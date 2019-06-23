import Vue from 'vue'
import VueRouter from 'vue-router'

import ElementUI from 'element-ui'

import func from './common/funcs.js'
import store from './store'
import routes from './router'
import filters from './filters'

// require styles 引入样式
// https://github.com/funxdata/funx-theme
import 'funx-theme'
// import '@/funx-theme/index.scss'
import 'font-awesome/css/font-awesome.min.css'
import '@/assets/icon/iconfont.css'
import '@/assets/vars.scss'
import App from './App'

Vue.use(VueRouter)
Vue.use(ElementUI)

Vue.prototype.func = func
Vue.prototype.fxFilter = filters
Vue.prototype.updateRouteQuery = function (k, v) {
  let q = Object.assign({}, this.$route.query)
  Vue.set(q, k, v)
  if (k != 'page') {
    Vue.set(q, 'page', 1)
  }
  this.$router.replace({ query: q })
}
Vue.prototype.clearRouteQuery = function () {
  this.$router.replace({ query: {} })
}
Vue.prototype.queryOption = function () {
  let q = Object.assign({}, this.$route.query)
  let page = 1
  if (q.page && q.page > 1) {
    page = q.page
  }
  if (q.end_time) {
    q.begin_time = q.begin_time + ':00.0+08:00'
  }
  if (q.end_time) {
    q.end_time = q.end_time + ':00.0+08:00'
  }
  q.limit = 10
  q.offset = (page - 1) * 10
  return q
}

Vue.config.silent = true
const router = new VueRouter({
  routes,
})

if (!Vue.prototype.fxCfg.global.isSAAS) {
  router.options.routes.pop()
  router.options.routes[3].redirect.path = '/dataanalysis'
} else {
  router.options.routes[3].redirect.path = '/registerinfo'
}
router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    sessionStorage.clear()
  }
  let token = sessionStorage.getItem('token')
  if (!token && to.path != '/login' && to.path != '/register') {
    return next({ path: '/login' })
  } else {
    next()
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
