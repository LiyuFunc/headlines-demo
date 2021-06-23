// 导入 vue
import Vue from 'vue'
// 导入了根组件：页面的结构
import App from './App.vue'
// 导入了路由
import router from './router'
// 导入了 vuex
import store from './store'
// 导入 vant
import Vant from 'vant'
import 'vant/lib/index.css'
// 导入字体图标代码
import './style/index.css'
// 导入自己封装的插件
import pluginObj from '@/utils/myplugin.js'
// 导入适配的插件
import 'amfe-flexible/index.js'
// 使用插件
Vue.use(pluginObj)

// // 导入操作 token 的方法
// import { localGet } from '@/utils/mylocal'
// Vue.use(Toast)
// // 封装一个全局方法：用来验证登录的全局方法
// Vue.prototype.$login = function () {
//   // 得到 token
//   const token = localGet('token')
//   // 判断 token
//   if (!token || !token.token) {
//     // 提示未登录
//     Toast.fail('对不起，您还未登录')
//     // 跳转到登录页面
//     router.push('/login')
//     // 返回 false：说明未登录
//     return false
//   } else {
//     // 返回 true: 说明已登录
//     return true
//   }
// }
// // 导入 dayjs
// import dayjs from 'dayjs'
// // 导入 dayjs 的插件：将固定时间转为相对时间
// import relativeTime from 'dayjs/plugin/relativeTime'
// // 导入语言包
// import 'dayjs/locale/zh-cn'

Vue.config.productionTip = false
Vue.use(Vant)

new Vue({
  router, // 挂载了路由
  store, // 挂载了 vuex
  render: h => h(App) // 将 App.vue 渲染到 Vue 中
}).$mount('#app')
