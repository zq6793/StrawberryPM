import Home from '@/views/Home'

/* 财务 */
// 水电 utilityFee
import UtilityFeeList from '@/views/finance/utilityFee/List' /* 水电 */

// 账单 order
// import OrderList from '@/views/finance/order/List' /* 账单 */
import OrderListV2 from '@/views/finance/order/ListV2' /* 账单 */
// import OrderAdd from '@/views/finance/order/Add' /* 新增租客账单 */

// 流水 bill
// import BillList from '@/views/finance/List' /* 流水 */
import BillListV2 from '@/views/finance/bill/ListV2' /* 流水2 */

// 业务单 退房 checkout
import BillNotes from '@/views/finance/billnotes/List' /* 退房 */
// import CheckoutDetail from '@/views/finance/checkout/Detail' /* 退房明细 */

// 物品 goods
// import goods from '@/views/finance/goods/goods' /*物品*/
import GoodsAdd from '@/views/finance/goods/Add' /* 新增账单 */
import GoodsEdit from '@/views/finance/goods/Edit' /* 修改账单 */

export default {
  path: '/',
  component: Home,
  name: '财务',
  iconCls: 'iconfont icon-ali-financetb',
  children: [
    { path: '/water',
      component: UtilityFeeList,
      name: '水电',
      meta: {
        desc: '水电：您可以通过水电智能设备提供的读数或自行上传水电的读数生成水电账单，从而使住户缴纳每月实际应缴的水电费用。',
      },
    },
    // { path: '/bill',
    //   component: OrderList,
    //   name: '账单',
    //   meta: {
    //     desc: '账单：您可以查看住户入住期间所有支付的账单记录，包括押金、租金、水电费、清洁费、物品租赁费等一切费用，了解账单的支付状态、支付时间等相关信息，并可对账单的金额进行修改。',
    //   },
    // },
    {
      path: '/bill/renter',
      component: OrderListV2,
      name: '账单',
      meta: {
        desc: '租户账单：您可以查看租户入住期间所有支付的账单记录，包括押金、租金、水电费、清洁费、物品租赁费等一切费用，了解账单的支付状态、支付时间等相关信息，并可对账单的金额进行修改。',
      },
    },
    { path: '/bill/renter/bills',
      component: OrderListV2,
      name: '租户账单',
      hidden: true,
      meta: {
        desc: '租户账单：您可以查看租户入住期间所有支付的账单记录，包括押金、租金、水电费、清洁费、物品租赁费等一切费用，了解账单的支付状态、支付时间等相关信息，并可对账单的金额进行修改。',
      },
    },
    { path: '/bill/renter/bill',
      component: OrderListV2,
      name: '租户账单',
      hidden: true,
      meta: {
        desc: '租户账单：您可以查看租户入住期间所有支付的账单记录，包括押金、租金、水电费、清洁费、物品租赁费等一切费用，了解账单的支付状态、支付时间等相关信息，并可对账单的金额进行修改。',
      },
    },
    { path: '/bill/renter/addbill',
      component: OrderListV2,
      name: '新增租户',
      hidden: true,
      meta: {
        desc: '租户账单：您可以查看住户入住期间所有支付的账单记录，包括押金、租金、水电费、清洁费、物品租赁费等一切费用，了解账单的支付状态、支付时间等相关信息，并可对账单的金额进行修改。',
      },
    },
    {
      path: '/bill/landlord',
      component: OrderListV2,
      name: '业主账单',
      meta: {
        desc: '业主账单：您可以查看业主入住期间所有支付的账单记录，包括押金、租金、水电费、清洁费、物品租赁费等一切费用，了解账单的支付状态、支付时间等相关信息，并可对账单的金额进行修改。',
      },
    },
    { path: '/bill/landlord/bills',
      component: OrderListV2,
      name: '业主账单',
      hidden: true,
      meta: {
        desc: '业主账单：您可以查看业主入住期间所有支付的账单记录，包括押金、租金、水电费、清洁费、物品租赁费等一切费用，了解账单的支付状态、支付时间等相关信息，并可对账单的金额进行修改。',
      },
    },
    { path: '/bill/landlord/bill',
      component: OrderListV2,
      name: '业主账单',
      hidden: true,
      meta: {
        desc: '业主账单：您可以查看业主入住期间所有支付的账单记录，包括押金、租金、水电费、清洁费、物品租赁费等一切费用，了解账单的支付状态、支付时间等相关信息，并可对账单的金额进行修改。',
      },
    },
    { path: '/bill/landlord/addbill',
      component: OrderListV2,
      name: '新增业主账单',
      hidden: true,
      meta: {
        desc: '业主账单：您可以查看业主入住期间所有支付的账单记录，包括押金、租金、水电费、清洁费、物品租赁费等一切费用，了解账单的支付状态、支付时间等相关信息，并可对账单的金额进行修改。',
      },
    },
    {
      path: '/bill/other',
      component: OrderListV2,
      name: '其它账单列表',
      meta: {
        desc: '其它账单：您可以查看其它期间所有支付的账单记录，包括押金、租金、水电费、清洁费、物品租赁费等一切费用，了解账单的支付状态、支付时间等相关信息，并可对账单的金额进行修改。',
      },
    },
    { path: '/bill/other/bills',
      component: OrderListV2,
      name: '业主账单列表',
      hidden: true,
      meta: {
        desc: '业主账单：您可以查看其它账单记录，包括押金、租金、水电费、清洁费、物品租赁费等一切费用，了解账单的支付状态、支付时间等相关信息，并可对账单的金额进行修改。',
      },
    },
    { path: '/bill/other/bill',
      component: OrderListV2,
      name: '业主账单明细',
      hidden: true,
      meta: {
        desc: '业主账单：您可以查看其它账单记录，包括押金、租金、水电费、清洁费、物品租赁费等一切费用，了解账单的支付状态、支付时间等相关信息，并可对账单的金额进行修改。',
      },
    },
    { path: '/bill/other/addbill',
      component: OrderListV2,
      name: '新增业主账单',
      hidden: true,
      meta: {
        desc: '业主账单：您可以查看其它账单记录，包括押金、租金、水电费、清洁费、物品租赁费等一切费用，了解账单的支付状态、支付时间等相关信息，并可对账单的金额进行修改。',
      },
    },
    // { path: '/runningwater',
    //   component: BillList,
    //   name: '流水',
    //   meta: {
    //     desc: '流水：您可以了解住户入住期间每一笔已支付费用的详情，包括支付时间、支付途径、付款金额等，帮助您了解门店流水状况。',
    //   },
    // },
    {
      path: '/running',
      // component: BillListV2,
      redirect: { name: '流水-按时间' },
      name: '流水',
      meta: {
        desc: '流水：您可以了解住户入住期间每一笔已支付费用的详情，包括支付时间、支付途径、付款金额等，帮助您了解门店流水状况。',
      },
    },
    {
      path: '/running/date',
      component: BillListV2,
      name: '流水-按时间',
      hidden: true,
      meta: {
        desc: '流水：您可以了解住户入住期间每一笔已支付费用的详情，包括支付时间、支付途径、付款金额等，帮助您了解门店流水状况。',
      },
    },
    {
      path: '/running/date/all',
      component: BillListV2,
      name: '流水-按时间-汇总',
      hidden: true,
      meta: {
        desc: '流水：您可以了解住户入住期间每一笔已支付费用的详情，包括支付时间、支付途径、付款金额等，帮助您了解门店流水状况。',
      },
    },
    {
      path: '/running/date/one',
      component: BillListV2,
      name: '流水-按时间-汇总',
      hidden: true,
      meta: {
        desc: '流水：您可以了解住户入住期间每一笔已支付费用的详情，包括支付时间、支付途径、付款金额等，帮助您了解门店流水状况。',
      },
    },
    {
      path: '/running/fees',
      component: BillListV2,
      name: '流水-按费用项',
      hidden: true,
      meta: {
        desc: '流水：您可以了解住户入住期间每一笔已支付费用的详情，包括支付时间、支付途径、付款金额等，帮助您了解门店流水状况。',
      },
    },
    {
      path: '/running/fees/all',
      component: BillListV2,
      name: '流水-按费用项-汇总',
      hidden: true,
      meta: {
        desc: '流水：您可以了解住户入住期间每一笔已支付费用的详情，包括支付时间、支付途径、付款金额等，帮助您了解门店流水状况。',
      },
    },
    {
      path: '/running/fees/store',
      component: BillListV2,
      name: '流水-按费用项-明细(门店)',
      hidden: true,
      meta: {
        desc: '流水：您可以了解住户入住期间每一笔已支付费用的详情，包括支付时间、支付途径、付款金额等，帮助您了解门店流水状况。',
      },
    },
    {
      path: '/running/fees/room',
      component: BillListV2,
      name: '流水-按费用项-明细(房间)',
      hidden: true,
      meta: {
        desc: '流水：您可以了解住户入住期间每一笔已支付费用的详情，包括支付时间、支付途径、付款金额等，帮助您了解门店流水状况。',
      },
    },
    {
      path: '/running/fees/person',
      component: BillListV2,
      name: '流水-按费用项-明细(住户)',
      hidden: true,
      meta: {
        desc: '流水：您可以了解住户入住期间每一笔已支付费用的详情，包括支付时间、支付途径、付款金额等，帮助您了解门店流水状况。',
      },
    },
    {
      path: '/running/month',
      component: BillListV2,
      name: '流水-按月度',
      hidden: true,
      meta: {
        desc: '流水：您可以了解住户入住期间每一笔已支付费用的详情，包括支付时间、支付途径、付款金额等，帮助您了解门店流水状况。',
      },
    },
    {
      path: '/running/month/store',
      component: BillListV2,
      name: '流水-按月度-门店',
      hidden: true,
      meta: {
        desc: '流水：您可以了解住户入住期间每一笔已支付费用的详情，包括支付时间、支付途径、付款金额等，帮助您了解门店流水状况。',
      },
    },
    {
      path: '/running/month/room',
      component: BillListV2,
      name: '流水-按月度-房间',
      hidden: true,
      meta: {
        desc: '流水：您可以了解住户入住期间每一笔已支付费用的详情，包括支付时间、支付途径、付款金额等，帮助您了解门店流水状况。',
      },
    },
    {
      path: '/running/payway',
      component: BillListV2,
      name: '流水-按渠道',
      hidden: true,
      meta: {
        desc: '流水：您可以了解住户入住期间每一笔已支付费用的详情，包括支付时间、支付途径、付款金额等，帮助您了解门店流水状况。',
      },
    },
    {
      path: '/running/payway/month',
      component: BillListV2,
      name: '流水-按渠道-月',
      hidden: true,
      meta: {
        desc: '流水：您可以了解住户入住期间每一笔已支付费用的详情，包括支付时间、支付途径、付款金额等，帮助您了解门店流水状况。',
      },
    },
    {
      path: '/running/payway/day',
      component: BillListV2,
      name: '流水-按渠道-天',
      hidden: true,
      meta: {
        desc: '流水：您可以了解住户入住期间每一笔已支付费用的详情，包括支付时间、支付途径、付款金额等，帮助您了解门店流水状况。',
      },
    },
    { path: '/billnotes/checkout',
      component: BillNotes,
      name: '业务单',
      meta: {
        desc: '退房：您可以查看审核住户退房时的所有费用结算情况，包括账单是否缴清、是否违约、退还押金金额等。',
      },
    },
    { path: '/billnotes/checkout/list',
      component: BillNotes,
      hidden: true,
      name: '退房单列表',
      meta: {
        desc: '退房：您可以查看审核住户退房时的所有费用结算情况，包括账单是否缴清、是否违约、退还押金金额等。',
      },
    },
    { path: '/billnotes/checkout/detail',
      component: BillNotes,
      name: '查看明细',
      hidden: true,
      meta: {
        desc: '退房：您可以查看审核住户退房时的所有费用结算情况，包括账单是否缴清、是否违约、退还押金金额等。',
      },
    },
    { path: '/billnotes/changeroom',
      component: BillNotes,
      hidden: true,
      name: '换房单列表',
      meta: {
        desc: '换房单：您可以查看审核住户退房时的所有费用结算情况，包括账单是否缴清、是否违约、退还押金金额等。',
      },
    },
    { path: '/billnotes/changeroom/list',
      component: BillNotes,
      hidden: true,
      name: '换房单列表',
      meta: {
        desc: '换房单：您可以查看审核住户退房时的所有费用结算情况，包括账单是否缴清、是否违约、退还押金金额等。',
      },
    },
    { path: '/billnotes/changeroom/detail',
      component: BillNotes,
      name: '查看明细',
      hidden: true,
      meta: {
        desc: '换房单：您可以查看审核住户退房时的所有费用结算情况，包括账单是否缴清、是否违约、退还押金金额等。',
      },
    },
    { path: '/billnotes/sublet',
      component: BillNotes,
      hidden: true,
      name: '转租单列表',
      meta: {
        desc: '转租单：您可以查看审核住户退房时的所有费用结算情况，包括账单是否缴清、是否违约、退还押金金额等。',
      },
    },
    { path: '/billnotes/sublet/list',
      component: BillNotes,
      hidden: true,
      name: '转租单列表',
      meta: {
        desc: '转租单：您可以查看审核住户退房时的所有费用结算情况，包括账单是否缴清、是否违约、退还押金金额等。',
      },
    },
    { path: '/billnotes/sublet/detail',
      component: BillNotes,
      name: '查看明细',
      hidden: true,
      meta: {
        desc: '转租单：您可以查看审核住户退房时的所有费用结算情况，包括账单是否缴清、是否违约、退还押金金额等。',
      },
    },
    // { path: '/goods', component: goods, name: '物品' },
    {
      path: '/addgoods',
      component: GoodsAdd,
      name: '新增账单',
      hidden: true,
      meta: {
        desc: '物品：您可以查看、管理住户在入住期间额外租赁的物品详情，如物品类型（冰箱、沙发等）、租赁金额、支付状态灯。',
      },
    },
    {
      path: '/editgoods',
      component: GoodsEdit,
      name: '修改账单',
      hidden: true,
      meta: {
        desc: '物品：您可以查看、管理住户在入住期间额外租赁的物品详情，如物品类型（冰箱、沙发等）、租赁金额、支付状态灯。',
      },
    },
  ],
}
