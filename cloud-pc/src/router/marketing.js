import Home from '@/views/Home'

/* 营销 */
// 营销应用 app
import AppList from '@/views/marketing/app/List' /* 营销应用 */
import AppAdd from '@/views/marketing/app/Add' /* 新增活动 */

// 活动统计 activity
import ActivityList from '@/views/marketing/activity/List' /* 活动 */
import ActivityEdit from '@/views/marketing/activity/Edit' /* 编辑活动 */
import ActivityDetail from '@/views/marketing/activity/Detail' /* 查看活动 */
import ActivityMetrics from '@/views/marketing/activity/Metrics' /* 活动统计 */
import ActivityBoostMetrics from '@/views/marketing/activity/BoostMetrics' /* 助力统计 */
import ActivityFansMetrics from '@/views/marketing/activity/FansMetrics' /* 吸粉统计 */

// 优惠券
import CouponList from '@/views/marketing/coupon/List' /* 优惠券 */
import CouponAdd from '@/views/marketing/coupon/Add' /* 新增优惠券 */
import CouponEdit from '@/views/marketing/coupon/Edit' /* 编辑优惠券 */
import CouponDistribute from '@/views/marketing/coupon/Distribute' /* 派发优惠券 */
import CouponRecordList from '@/views/marketing/coupon/RecordList' /* 优惠券 */

export default {
  path: '/',
  component: Home,
  name: '营销',
  iconCls: 'iconfont icon-ali-yingxiao', // 图标样式class
  children: [
    { path: '/selluse',
      component: AppList,
      name: '营销应用',
      meta: {
        desc: '营销活动：您可以创建不同类型的营销活动，每一种活动均和优惠券绑定，参加活动的住户完成活动要求后可领取相应的优惠，并可实时查看活动派发优惠的状况。',
      },
    },
    { path: '/addactivity',
      component: AppAdd,
      name: '新增活动',
      hidden: true,
      meta: {
        desc: '活动：您可以创建不同类型的营销活动，每一种活动均和优惠券绑定，参加活动的住户完成活动要求后可领取相应的优惠，并可实时查看活动派发优惠的状况。',
      },
    },
    { path: '/payoutcoupon',
      component: CouponDistribute,
      name: '派发优惠券',
      hidden: true,
      meta: {
        desc: '优惠券：您可以创建不同类型的优惠券，可适用于住户办理入住时房间租金的折扣或是支付账单时的抵扣，并可自行将指定的优惠券发给指定的住户。',
      },
    },
    { path: '/addcoupon',
      component: CouponAdd,
      name: '新增优惠券',
      hidden: true,
      meta: {
        desc: '优惠券：您可以创建不同类型的优惠券，可适用于住户办理入住时房间租金的折扣或是支付账单时的抵扣，并可自行将指定的优惠券发给指定的住户。',
      },
    },
    { path: '/editcoupon',
      component: CouponEdit,
      name: '编辑优惠券',
      hidden: true,
      meta: {
        desc: '优惠券：您可以创建不同类型的优惠券，可适用于住户办理入住时房间租金的折扣或是支付账单时的抵扣，并可自行将指定的优惠券发给指定的住户。',
      },
    },
    { path: '/activity',
      component: ActivityList,
      name: '活动',
      meta: {
        desc: '活动：您可以创建不同类型的营销活动，每一种活动均和优惠券绑定，参加活动的住户完成活动要求后可领取相应的优惠，并可实时查看活动派发优惠的状况。',
      },
    },
    { path: '/editactivity',
      component: ActivityEdit,
      name: '编辑活动',
      hidden: true,
      meta: {
        desc: '活动：您可以创建不同类型的营销活动，每一种活动均和优惠券绑定，参加活动的住户完成活动要求后可领取相应的优惠，并可实时查看活动派发优惠的状况。',
      },
    },
    { path: '/lookactivity',
      component: ActivityDetail,
      name: '查看活动',
      hidden: true,
      meta: {
        desc: '合同：您可以查看所有住户入住流程中签署的预定和入住合同，掌握所有住户合同详情，包括房间合同价格、合同时长、合同正文。',
      },
    },
    { path: '/activedata',
      component: ActivityMetrics,
      name: '活动统计',
      hidden: true,
      meta: {
        desc: '活动：活动数据统计',
      },
    },
    { path: '/helplist',
      component: ActivityBoostMetrics,
      name: '助力统计',
      hidden: true,
      meta: {
        desc: '活动：您可以创建不同类型的营销活动，每一种活动均和优惠券绑定，参加活动的住户完成活动要求后可领取相应的优惠，并可实时查看活动派发优惠的状况。',
      },
    },
    { path: '/report',
      component: ActivityFansMetrics,
      name: '吸粉统计',
      hidden: true,
      meta: {
        desc: '活动：您可以创建不同类型的营销活动，每一种活动均和优惠券绑定，参加活动的住户完成活动要求后可领取相应的优惠，并可实时查看活动派发优惠的状况。',
      },
    },
    { path: '/coupon',
      component: CouponList,
      name: '优惠券',
      meta: {
        desc: '优惠券：您可以创建不同类型的优惠券，可适用于住户办理入住时房间租金的折扣或是支付账单时的抵扣，并可自行将指定的优惠券发给指定的住户。',
      },
    },
    { path: '/record',
      component: CouponRecordList,
      name: '优惠记录',
      meta: {
        desc: '退房：您可以查看审核住户退房时的所有费用结算情况，包括账单是否缴清、是否违约、退还押金金额等。',
      },
    },
  ],
}
