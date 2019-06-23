
import { feeTypeList, payWayList, payStatusList } from '@/constent'


const containArray = function (list, id, unknow) {
  if (!id) {
    return ''
  }
  for (const item of list) {
    if (item.id === id) {
      return item.label
    }
  }
  if (unknow) {
    return unknow
  }
  return id
}

export const money = function (val) {
  switch (typeof val) {
    case 'string':
      return parseFloat(val).toFixed(2)
    case 'number':
      return val.toFixed(2)
  }
  return 0.00
}

// 费用类型
export const feeType = function (id) {
  return containArray(feeTypeList, id, '未知费用类型')
}


// 支付方式
export const payWay = function (val) {
  return containArray(payWayList, val, '未知支付方式')
}

export const status = function (val) {
  switch (val) {
    case 'COMPLETED':
      return '完成'
    case 'PENDING':
      return '待定'
  }
}
// 支付状态
export const payStatus = function (id) {
  return containArray(payStatusList, id, '')
}
