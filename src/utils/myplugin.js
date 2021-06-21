// 添加一个插件：用来给 vue 添加一个全局方法
import { Toast } from 'vant'
import router from '../router/index.js'
import { localGet } from '@/utils/mylocal'
// 导入dayjs
import dayjs from 'dayjs'
// 导入dayjs 的插件 相对时间
import relativeTime from 'dayjs/plugin/relativeTime'
// 导入语言包
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
// 集成时间处理api
dayjs.extend(relativeTime)

// 定义插件对象
var pluginObj = {}
// 添加插件的固有方法
pluginObj.install = function (Vue) {
  // 添加一个全局的时间处理过滤器
  Vue.filter('timefilter', value => {
    return dayjs().to(value)
  })
  // 给 vue 添加一个全局方法
  Vue.prototype.$login = function () {
    // 得到 token
    const token = localGet('token')
    // 判断 token
    if (!token || !token.token) {
      // 提示未登录
      Toast.fail('对不起，您还未登录')
      // 跳转到登录页面
      router.push('/checkLogin')
      // 返回 false：说明未登录
      return false
    } else {
      // 返回 true: 说明已登录
      return true
    }
  }
}

// 导出插件对象
export default pluginObj
