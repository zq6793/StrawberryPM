// 门店类型
export const storeType = [
  {
    label: '集中式',
    id: 'UNION',
  },
  {
    label: '分布式',
    id: 'DOT'
  },
]

// 门店状态
export const storeStatus = [
  {
    label: '停业',
    id: 'CLOSE'
  },
  {
    label: '即将开业',
    id: 'WAIT',
  },
  {
    label: '营业中',
    id: 'NORMAL'
  },
]

// 合同模板类型
export const contractType = [
  {
    label: '长租',
    id: 'LONG',
  },
  {
    label: '短租',
    id: 'SHORT',
  },
  {
    label: '预定',
    id: 'RESERVE',
  },
]

// 设备类型
export const deviceType = [
  {
    label: '门锁',
    id: 'LOCK',
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
    label: '电表',
    id: 'ELECTRIC_METER',
  },
]

// 设备状态
export const deviceStatus = [
  {
    label: '已录入',
    id: 'NOORDER',
  },
  {
    label: '已生成',
    id: 'HASORDER',
  },
  {
    label: '未录入',
    id: 'NOREADING',
  },
  {
    label: '暂无住户',
    id: 'NORESIDENT',
  },
]

// 房型面积
// 室
export const roomNumber = [
  {
    label: '1室',
    id: 1,
  },
  {
    label: '2室',
    id: 2,
  },
  {
    label: '3室',
    id: 3,
  },
  {
    label: '4室',
    id: 4,
  },
]

// 厅
export const hallNumber = [
  {
    label: '0厅',
    id: 0,
  },
  {
    label: '1厅',
    id: 1,
  },
  {
    label: '2厅',
    id: 2,
  },
  {
    label: '3厅',
    id: 3,
  },
]

// 厨
export const cookNumber = [
  {
    label: '0厨',
    id: 0,
  },
  {
    label: '1厨',
    id: 1,
  },
  {
    label: '2厨',
    id: 2,
  },
]

// 卫
export const toiletNumber = [
  {
    label: '0卫',
    id: 0,
  },
  {
    label: '1卫',
    id: 1,
  },
  {
    label: '2卫',
    id: 2,
  },
  {
    label: '3卫',
    id: 3,
  },
]

// 朝向
export const directionNumber = [
  {
    label: '朝南',
    id: 'S',
  },
  {
    label: '朝北',
    id: 'N',
  },
  {
    label: '朝东',
    id: 'E',
  },
  {
    label: '朝西',
    id: 'W',
  },
  {
    label: '东西',
    id: 'EW',
  },
  {
    label: '南北',
    id: 'SN',
  },
]

export const roomFeature = [
  {
    label: '主卧',
    id: 'M',
  },
  {
    label: '次卧',
    id: 'S',
  },
  {
    label: '独卫主卧',
    value: 'MT',
  },
]
