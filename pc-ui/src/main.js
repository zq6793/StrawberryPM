import ElementUI from 'element-ui'
import Vue from 'vue'

// import 'element-ui/lib/theme-chalk/index.css'
import '@/review-theme/src/index.scss'

import VueQriously from 'vue-qriously'
import VueQuillEditor from 'vue-quill-editor'

// require styles 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import '@/assets/icon/iconfont.css'
import '@/assets/vars.scss'
import 'font-awesome/css/font-awesome.min.css'

import App from '@/App'
import store from '@/store'
import { router } from '@/router'
import func from '@/common/func.js'
import config from '@/common/config.js'
import filter from '@/filter'
import VueResource from 'vue-resource'

Vue.use(VueQuillEditor)
Vue.use(VueQriously)
Vue.use(ElementUI)
Vue.use(VueResource)

Vue.config.silent = true
Vue.config.productionTip = false
Vue.prototype.func = func
Vue.prototype.fxCfg = config
Vue.prototype.fxFilters = filter
Vue.http.options.emulateJSON = true

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

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
