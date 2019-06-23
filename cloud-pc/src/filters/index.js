import Vue from 'vue'

import {
  taskflowType,
  taskflowStatus,
  taskflowStepStatus,
} from './taskflow'

import {
  money,
  status,
  feeType,
  payWay,
} from './finance'

let filters = {
  taskflowType,
  taskflowStatus,
  taskflowStepStatus,

  money,
  status,
  feeType,
  payWay,

  /* 截取年月日 */
  date: function (type) {
    return type.substr(0, 10)
  },
  time: function (value, formatString) {
    formatString = formatString || 'YYYY-MM-DD HH:mm'
    return value.format(formatString)
  },
  // 格式化golang接口的时间
  goTime: function (value) {
    let v = value.substr(0, 19)
    return v.replace('T', ' ')
  },
  // 全局的时间选择器的时间格式化
  toPHPTime(t) {
    return (t + ':59').replace('T', ' ')
  },
  // 账单支付状态
  payStatusShow: function (value) {
    switch (value) {
      case 'COMPLETED':
        return '已付款'
      case 'PENDING':
        return '未付款'
      default:
        return ''
    }
  },
  // 百分率转换
  toPercentage: function (value) {
    let v = (Number(value) * 100).toFixed(2)
    v += '%'
    return v
  },
}

Object.keys(filters).forEach(name => {
  Vue.filter(name, filters[name])
})

export default filters
