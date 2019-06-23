export const taskflowType = function (val) {
  switch (val) {
    case 'CHECKOUT':
      return '正常退房'
    case 'PRICE':
      return '调价'
    case 'SERVICE':
      return '服务订单'
    case 'RESERVE':
      return '预约看房'
    case 'WARNING':
      return '预警'
    case 'UNDER_CONTRACT':
    case 'UNDER_CONTRACT_LESS':
      return '违约退房'
    case 'NO_LIABILITY':
      return '特殊退房'
    case 'GIVE_UP':
      return '退房-放弃追缴审批'
    case 'CHANGE_ROOM':
      return '换房'
    case 'ADD_REFUND':
      return '退房-额外退款'
    case 'REAL_INCOME_LESS':
      return '退房-实际收益小于0'
    case 'NORMAL_REFUND':
      return '正常退房退款'
    case 'NORMAL_NOT_REFUND':
      return '正常退房不退款'
    case 'UNDER_REFUND':
      return '违约退房退款'
    case 'UNDER_NOT_REFUND':
      return '违约退房不退款'
    case 'UNDER_NO_REFUND':
      return '违约退房无可退金额'
    case 'TRANSFORM':
      return '转租'
    default:
      return val
  }
}

export const taskflowStatus = function (val) {
  switch (val) {
    case 'AUDIT':
      return '审批流程中'
    case 'APPROVED':
      return '审批已完成'
    case 'CLOSED':
      return '审批已终止'
    default:
      return val
  }
}

export const taskflowStepStatus = function (val) {
  switch (val) {
    case 'APPROVED':
      return '通过'
    case 'UNAPPROVED':
    case 'CLOSED':
      return '驳回'
    default:
      return val
  }
}
