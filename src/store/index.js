import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用户信息
    userInfo: {},
    loginStatus: false
  },
  mutations: {
    // 设置用户信息
    setUserInfo (state, data) {
      state.userInfo = data
    },
    // 设置登录状态
    setLoginStatus (state, data) {
      state.loginStatus = data
    }
  },
  actions: {},
  modules: {}
})
