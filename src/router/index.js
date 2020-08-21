import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from 'pages/Login.vue'
import Register from 'pages/Register.vue'
import Profile from 'pages/Profile.vue'
import EditProfile from 'pages/EditProfile.vue'
import Follow from 'pages/Follow.vue'
import Comments from 'pages/Comments.vue'
import Favorite from 'pages/Favorite.vue'
import Home from 'pages/Home.vue'
import PostDetail from 'pages/PostDetail.vue'
import TabManage from 'pages/TabManage.vue'
import Search from 'pages/Search.vue'
Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
// 解决Vue-Router升级导致的Uncaught(in promise) navigation guard问题
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject)
  }
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/home' },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {
        keepAlive: true,
        title: '首页'
      }
    },
    { path: '/login', name: 'login', component: Login },
    { path: '/register', name: 'register', component: Register },
    { path: '/profile', name: 'profile', component: Profile },
    { path: '/edit-profile', name: 'edit-profile', component: EditProfile },
    { path: '/follow', name: 'follow', component: Follow },
    { path: '/comments', name: 'comments', component: Comments },
    { path: '/favorite', name: 'favorite', component: Favorite },
    { path: '/post-detail/:id', name: 'post-detail', component: PostDetail },
    { path: '/tab-manage', name: 'tab-manage', component: TabManage },
    {
      path: '/search',
      name: 'search',
      component: Search,
      meta: {
        keepAlive: true,
        title: '搜索页'
      }
    }
  ]
})
// 配置全局前置守卫
// 将需要授权的页面的路径存到一个授权数组中
const AuthUrls = [
  '/profile',
  '/edit-profile',
  '/follow',
  '/comments',
  '/favorite'
]
router.beforeEach((to, from, next) => {
  // 判断当前路径是否在授权数组中存在
  if (AuthUrls.includes(to.path)) {
    // 判断登录的页面是否有token
    const token = localStorage.getItem('token')
    if (token) {
      next()
    } else {
      next('/login')
    }
  } else {
    // 不需要登录的页面，直接放行
    next()
  }
})
export default router
