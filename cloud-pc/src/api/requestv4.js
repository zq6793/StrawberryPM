import axios from 'axios'
import config from '@/common/config.js'
import Vue from 'vue'

function getAgent() {
  let as = localStorage.getItem('agent-seq')
  if (as) {
    return as
  }
  as = Math.random().toString(36).substr(2)
  localStorage.setItem('agent-seq', as)
}

let requestV4 = axios.create({
  baseURL: config.api_url + '/v4/',
  // baseURL: 'http://localhost:8080/v4/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Agent': getAgent(),
    'X-Client-Version': 'pc4.0.1',
  },
  // transformRequest: 对接口返回数据进行处理
})

// 对发送请求进行处理，请求头部带上token
requestV4.interceptors.request.use(function (config) {
  config.headers.Token = sessionStorage.getItem('token')
  // console.log(config)
  return config
}, function (error) {
  console.log('error', error)
  return Promise.reject(error)
})

// 对响应数据进行处理
requestV4.interceptors.response.use(function (response) {
  // console.log(response)
  return response
}, function (error) {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        location.href = '/#/login'
        sessionStorage.clear()
        Vue.prototype.$message.error(error.response.data.message)
        break
      case 403:
        Vue.prototype.$message.error(error.response.data.message)
        break
      case 400:
        Vue.prototype.$message.error(error.response.data.message)
        break
      default:
        return Vue.prototype.$message.error(error.response.data.message)
    }
  }
})

export default requestV4
