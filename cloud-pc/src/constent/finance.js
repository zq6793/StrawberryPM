// 水电类型
export const waterElectType = [
  {
    label: '电表',
    id: 'ELECTRIC_METER',
  },
  {
    label: '热水表',
    id: 'HOT_WATER_METER',
  },
  {
    label: '冷水表',
    id: 'COLD_WATER_METER',
  },
  {
    label: '燃气表',
    id: 'GAS_METER',
  },
]

// 水电生成状态
export const waterElectStatus = [
  {
    label: '已生成',
    id: 'HASORDER',
  },
  {
    label: '录入中',
    id: 'NOORDER',
  },
]

// 账单费用类型
export const feeTypes = [
  {
    label: '住宿服务费',
    id: 'ROOM',
  },
  {
    label: '物业服务费',
    id: 'MANAGEMENT',
  },
  {
    label: '用电服务费',
    id: 'ELECTRICITY',
  },
  {
    label: '冷水服务费',
    id: 'WATER',
  },
  {
    label: '热水服务费',
    id: 'HOT_WATER',
  },
  {
    label: '住宿押金',
    id: 'DEPOSIT_R',
  },
  {
    label: '其他押金',
    id: 'DEPOSIT_O',
  },
  {
    label: '定金',
    id: 'RESERVE',
  },
  {
    label: '退房',
    id: 'REFUND',
  },
  {
    label: '清洁服务费',
    id: 'CLEAN',
  },
  {
    label: '设备租赁费',
    id: 'DEIVCE',
  },
  {
    label: '物品维修费',
    id: 'REPAIR',
  },
  {
    label: '物品赔偿费',
    id: 'COMPENSATION',
  },
  {
    label: '滞纳金',
    id: 'OVERDUE',
  },
  {
    label: '宠物消杀费',
    id: 'PETCLEAN',
  },
  {
    label: '换房服务费',
    id: 'CHANGE_ROOM',
  },
  {
    label: '转租服务费',
    id: 'TRANSFORM',
  },
  {
    label: '其它服务费',
    id: 'OTHER',
  },
]


// 账单支付状态
export const billPayStatus = [
  {
    label: '已完成',
    id: 'COMPLETED',
  },
  {
    label: '未付款',
    id: 'PENDING',
  },
  {
    label: '未缴清',
    id: 'UNCOMPLETED',
  },
]

// 账单费用支付状态select
export const expenseStatusOption = [
  {
    label: '已付款',
    id: 'COMPLATE',
  },
  {
    label: '未付款',
    id: 'PENDING',
  },
  {
    label: '未审核',
    id: 'GENERATE',
  },
  {
    label: '已关闭',
    id: 'CLOSE',
  }
]

// 支付方式
export const payWays = [
  {
    label: '微信',
    id: 'JSAPI',
  },
  {
    label: '支付宝',
    id: 'ALIPAY',
  },
  {
    label: '转账',
    id: 'BANK',
  },
  {
    label: '刷卡',
    id: 'POS',
  },
  {
    label: '银行卡转账',
    id: 'BANK_TRANS,'
  }
  // {
  //   label: '预存金',
  //   id: 'PREMONEY',
  // },
  // {
  //   label: '放弃收益',
  //   id: 'GIVEUP',
  // },
  // {
  //   label: '钱包支付',
  //   id: 'WALLET',
  // },
]

// 退房类型
export const withdrawType = [
  {
    label: '违约退房',
    id: 'UNDER_CONTRACT',
  },
  {
    label: '正常退房',
    id: 'NORMAL_REFUND',
  },
]

