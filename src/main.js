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

Vue.config.productionTip = false
Vue.use(Vant)

new Vue({
  router, // 挂载了路由
  store, // 挂载了 vuex
  render: h => h(App) // 将 App.vue 渲染到 Vue 中
}).$mount('#app')
