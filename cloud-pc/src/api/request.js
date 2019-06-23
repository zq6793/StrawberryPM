import axios from 'axios'
import config from '@/common/config.js'
import qs from 'qs'
import Vue from 'vue'

let requestV3 = axios.create({
  baseURL: config.api_url + '/',
  timeout: 10000,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  // transformRequest: 对接口返回数据进行处理
})

requestV3.interceptors.request.use(function (config) {
  if (config.method === 'post' || config.method === 'get') {
    config.data = qs.stringify({
      ...config.data,
    })
  }
  return config
}, function (error) {
  console.log('requestV3.interceptors.request', error)
})

requestV3.interceptors.request.use(
  config => {
    // token = ;
    // if(token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
    config.headers.Token = sessionStorage.getItem('token')
    // }
    return config
  },
  err => {
    console.log('data', err)
  }
)

requestV3.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          if (error.response.data.rescode == 1001) {
            Vue.prototype.$message.warning('用户身份过期，请重新登录')
            location.href = '/#/login'
            sessionStorage.clear()
            break
          } else {
            Vue.prototype.$message.error('访问拒绝')
            break
          }
        case 500:
          if (error.response.data.rescode == 500) {
            Vue.prototype.$message.error('系统内部错误')
            break
          } else if (error.response.data.rescode == 10052) {
            Vue.prototype.geterror = function () {
              return error.response.data.data.error
            }
            break
          } else {
            Vue.prototype.$message.error(error.response.data.resmsg)
            break
          }
        case 400:
          if (error.response.data.rescode == 1002) {
            Vue.prototype.$message.error(error.response.data.data.error)
            break
          } else if (error.response.data.rescode == 1005) {
            Vue.prototype.$message.error('该城市下无小区')
            break
          } else {
            Vue.prototype.$message.error(error.response.data.resmsg)
            break
          }
        case 404:
          Vue.prototype.$message.error(error.response.data.resmsg)
          break
        case 403:
          Vue.prototype.$message.error(error.response.data.resmsg)
          break
      }
    }
  })

export default requestV3
