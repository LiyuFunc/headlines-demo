import axios from 'axios'
// 导入 jsonbigint
import jsonbig from 'json-bigint'
// 导入轻提示
import { Toast } from 'vant'
// 导入路由
import router from '../router/index'

// 导入操作 token 的方法
import { localGet, localSet } from '@/utils/mylocal.js'

// 创建 axios 实例
const instance = axios.create({
  baseURL: 'http://toutiao-app.itheima.net/',
  transformResponse: [
    // 将 超过 js 处理范围数字进行转换
    function (data) {
      try {
        // 就是服务器返回的 json 格式的字符串
        return jsonbig.parse(data)
      } catch {
        return JSON.parse(data)
      }
    }
  ]
})

// 创建一个新的 axios 实例来更新 token：
//  问题：为什么不用上面那个实例：因为上面这个实例，会带一个 token ,而这个 token 过期
const instanceToken = axios.create({
  baseURL: 'http://toutiao-app.itheima.net/'
})

// 设置拦截器
instance.interceptors.request.use(
  function (config) {
    const needToken = config.needToken
    // 判断是否需要携带 token
    if (needToken) {
      // 得到 token
      const token = localGet('token')
      // 判断是否存在 token
      if (token && token.token) {
        // 携带 token
        config.headers.Authorization = `Bearer ${token.token}`
      }
    }
    // 在发送请求之前做些什么
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 处理正常返回数据
    // 对响应数据做点什么
    return response.data // 这个 response 其实已经是一个对象了
  },
  async function (error) {
    // 处理错误的返回数据
    console.log('------------------响应拦截器-----------------')
    // 判断状态是否为 401
    if (error.response.status === 401) {
      // 更新 token：将 refhresh_token  提交到服务器得到新的 token
      // 得到 refresh_token
      const refreshToken = localGet('token').refresh_token
      // 提交服务器
      const resToken = await instanceToken({
        url: '/v1_0/authorizations',
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      })
      // 创建一个新的 token 对象
      var tokenObj = {
        token: resToken.data.data.token,
        refresh_token: refreshToken
      }
      // 将新的 token 保存到本地
      localSet('token', tokenObj)
      // 继续发送之前报错的请求 error.config : baseURL Authorization
      return await instance(error.config)
    } else if (error.response.status === 400) {
      Toast('token过期请重新登录!')
      router.push('/login')
    }
    console.log('------------------响应拦截器-----------------')
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

// 导出对象
export default instance
