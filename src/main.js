import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入公共样式
import './styles/base.css'
// 引入字体图标
import './styles/iconfont.css'
// 引入rem插件包
import 'lib-flexible'
import axios from 'axios'
import {
  Button,
  Toast,
  Dialog,
  Field,
  RadioGroup,
  Radio,
  Uploader,
  List,
  Tab,
  Tabs,
  PullRefresh,
  Search
} from 'vant'
import HmNav from 'components/hm-nav.vue'
import HmHeader from 'components/hm-header.vue'
import HmPosts from 'components/hm-posts.vue'
import moment from 'moment'
Vue.use(Button)
Vue.use(Toast)
Vue.use(Dialog)
Vue.use(Field)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Uploader)
Vue.use(List)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(PullRefresh)
Vue.use(Search)
// 注册全局组件
Vue.component('HmNav', HmNav)
Vue.component('HmHeader', HmHeader)
Vue.component('HmPosts', HmPosts)
// 注册全局过滤器
Vue.filter('time', function(value) {
  return moment(value).format('YYYY-MM-DD')
})
Vue.filter('fixUrl', function(value) {
  return axios.defaults.baseURL + value
})
// 计算时间的过滤器(多少小时前...)
Vue.filter('timeCalc', function(value) {
  // 设置语言为中文
  moment.locale('zh-cn')
  return moment(value).fromNow()
})
// 注册自定义指令
Vue.directive('focus', {
  inserted(el, binding) {
    el.focus()
  }
})
Vue.config.productionTip = false
// 将axios挂载到vue原型上
Vue.prototype.$axios = axios
// 配置基础地址
axios.defaults.baseURL = 'http://localhost:3000'

// 添加请求拦截器
// 所有的请求, 在真正被发送出去之前, 都会先经过请求拦截器 (我们就可以在请求拦截器, 统一添加token)
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前, 判断本地有没有token令牌, 只要有token令牌, 一律请求时携带在请求头中
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  function(response) {
    const { statusCode, message } = response.data
    if (statusCode === 401 && message === '用户信息验证失败') {
      // 登录状态失效，token失效
      localStorage.removeItem('token')
      localStorage.removeItem('user_id')
      // 提示用户
      Toast('登录状态已过期,请重新登录')
      // 跳转到登录页
      router.push('/login')
    }
    return response
  },
  function(error) {
    return Promise.reject(error)
  }
)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
