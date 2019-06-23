// 空置天数
export const vacancyDays = [
  {
    label: '小于10天',
    id: '1',
  },
  {
    label: '11至20天',
    id: '2',
  },
  {
    label: '21至30天',
    id: '3',
  },
  {
    label: '大于30天',
    id: '4',
  },
]

// 调价类型
export const adjPriceType = [
  {
    label: '电费',
    id: 'ELECTRICITY',
  },
  {
    label: '冷水',
    id: 'WATER',
  },
  {
    label: '热水',
    id: 'HOTWATER',
  },
  {
    label: '燃气',
    id: 'GAS',
  },
  {
    label: '住宿服务费',
    id: 'ROOM',
  },
  {
    label: '物业服务费',
    id: 'MANAGEMENT',
  },
]

// 来访类型
export const visitType = [
  {
    label: '电话咨询',
    id: 'PHONE',
  },
  {
    label: '现场看房',
    id: 'VISIT',
  },
  {
    label: '官网预约',
    id: 'WEB',
  },
  {
    label: '订房系统预约',
    id: 'WECHAT',
  },
]

// 来访看房状态转换
export const visitStatus = [
  {
    label: '未到访',
    id: 'NO',
  },
  {
    label: '等待看房',
    id: 'WAIT'
  },
  {
    label: '取消',
    id: 'INVALID'
  },
  {
    label: '完成看房',
    id: 'END'
  },
  {
    label: '开始看房',
    id: 'BEGIN'
  },
]

// 合同状态
export const contractStatus = [
  {
    label: '未签署',
    id: 'GENERATED',
  },
  {
    label: '签署中',
    id: 'SIGNING',
  },
  {
    label: '已归档',
    id: 'ARCHIVED',
  },
]

// 住户证件类型
export const cardType = [
  {
    label: '身份证',
    id: '0',
  },
  {
    label: '护照',
    id: '1',
  },
  {
    label: '军人身份证',
    id: '2',
  },
  {
    label: '社会保障卡',
    id: '6',
  },
  {
    label: '武装警察身份证件',
    id: 'A',
  },
  {
    label: '港澳通行证',
    id: 'B',
  },
  {
    label: '户口簿',
    id: 'E',
  },
  {
    label: '临时居民身份证',
    id: 'F',
  },
  {
    label: '外国人永久居留证',
    id: 'P',
  },
  {
    label: '营业执照',
    id: 'BL',
  },
  {
    label: '其他',
    id: 'OTHER',
  },
]
