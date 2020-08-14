import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from 'pages/Login.vue'
import Register from 'pages/Register.vue'
import Profile from 'pages/Profile.vue'
import EditProfile from 'pages/EditProfile.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: Login },
    { path: '/register', name: 'register', component: Register },
    { path: '/profile', name: 'profile', component: Profile },
    { path: '/edit-profile', name: 'edit-profile', component: EditProfile }
  ]
})
// 配置全局前置守卫
// 将需要授权的页面的路径存到一个授权数组中
const AuthUrls = ['/profile', '/edit-profile']
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
