import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入vuex
// import store from '../store/index'
// 导入token
import { localGet } from '../utils/mylocal'
// 导入轻提示
import { Toast } from 'vant'
// 导入组件
const Login = () => import('../views/login/login.vue')
const Home = () => import('../views/home/home.vue')
const Index = () => import('../views/home/index/index.vue')
const My = () => import('../views/home/my/my.vue')
const Search = () => import('../views/home/search/search.vue')
const SearchResult = () => import('../views/searchResult/searchResult.vue')
const Detail = () => import('../views/detail/detail.vue')
const Info = () => import('../views/info/info.vue')
const Zhi = () => import('../views/zhi/zhi.vue')
const Individual = () => import('../views/home/my/Individual/index.vue')
const collect = () => import('../views/home/my/collect/index.vue')
const video = () => import('../views/home/video/index.vue')
const SetUp = () => import('../views/home/SetUp/index.vue')
const Authentication = () => import('../views/home/my/Authentication/index.vue')
Vue.use(VueRouter)

const routes = [
  // 登录路由:登录成功之后，应该跳转到我的页面
  { path: '/login', component: Login },
  // 验证登录路由:登录成功之后，返回到上一个页面
  { path: '/checkLogin', component: Login },
  // 注册 home 路由
  {
    path: '/home',
    component: Home,
    redirect: '/my',
    children: [
      {
        path: '/Authentication',
        component: Authentication,
        meta: { needLogin: true }
      }, // 个人认证
      { path: '/SetUp', component: SetUp, meta: { needLogin: true } }, // 我的设置
      { path: '/index', component: Index, meta: { needTab: true } }, // 主页路由
      { path: '/my', component: My, meta: { needTab: true, needLogin: true } }, // 我的路由
      { path: '/search', component: Search, meta: { needTab: true } }, // 搜索路由
      { path: '/video', component: video, meta: { needTab: true } }, // 视频路由
      { path: '/Individual', component: Individual },
      { path: '/collect', component: collect }
    ]
  },
  { path: '/searchResult/:key', component: SearchResult },
  // 文章详情
  {
    path: '/detail/:path?/:key?/:artid',
    component: Detail,
    meta: { needLogin: true }
  },
  { path: '/info', component: Info, meta: { needLogin: true } },
  // 小智同学
  { path: '/zhi', component: Zhi, meta: { needLogin: true } },
  {
    path: '/',
    redirect: '/index'
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.meta.needLogin) {
    if (localGet('token')) {
      next()
    } else {
      Toast('对不起您还未登陆,请先登录!')
      router.push(`/login?_redirect=${to.fullPath}`)
    }
  } else {
    next()
  }
})
export default router
