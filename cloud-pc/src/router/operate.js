import Home from '@/views/Home.vue'

/* 运营 */

// 销控
import marketing from '@/views/operate/market/List.vue' /* 销控 */

// 调价
import AdjustPriceList from '@/views/operate/adjustprice/List.vue' /* 调价 */
import AdjustPriceEdit from '@/views/operate/adjustprice/Edit.vue' /* 修改调价 */

// 预访
import ReservationList from '@/views/operate/reservation/List.vue' /* 预约订单 */

// 合同
import ContractList from '@/views/operate/contract/List.vue' /* 合同管理 */
import ContractLook from '@/views/operate/contract/Info.vue' /* 查看入住合同 */

// 住户
import HouseHoldList from '@/views/operate/household/List.vue' /* 住户管理 */
import HouseHoldInfo from '@/views/operate/household/Info.vue' /* 住户信息 */

export default {
  path: '/',
  component: Home,
  name: '运营',
  iconCls: 'iconfont icon-ali-yunying',
  children: [
    { path: '/marketing',
      component: marketing,
      name: '销控',
      meta: {
        desc: '销控：您可以了解门店房间整体运营状态，可快速筛选查看各个房间状态（出租、空闲、预订等）的房间，快速、清晰地了解门店出租情况，为运营决策提供参考依据。',
      },
    },
    { path: '/adjustprice',
      component: AdjustPriceList,
      name: '调价',
      meta: {
        desc: '调价：您可以设置并调整房间的租金、物业费、水电费单价，并可查看所有调价记录及原因。',
      },
    },
    { path: '/editprice',
      component: AdjustPriceEdit,
      name: '修改价格',
      hidden: true,
      meta: {
        desc: '调价：您可以设置并调整房间的租金、物业费、水电费单价，并可查看所有调价记录及原因。',
      },
    },
    { path: '/reservationorder',
      component: ReservationList,
      name: '预访',
      meta: {
        desc: '来访：您可以查看到访门店的所有客户信息，包括姓名、通过何种渠道到访、租房意向程度、租房需求等信息，帮助公寓运营针对性策略调整。',
      },
    },
    { path: '/contractmanage',
      component: ContractList,
      name: '合同',
      meta: {
        desc: '合同：您可以查看所有住户入住流程中签署的预定和入住合同，掌握所有住户合同详情，包括房间合同价格、合同时长、合同正文。',
      },
    },
    { path: '/lookcontracts',
      component: ContractLook,
      name: '查看合同',
      hidden: true,
      meta: {
        desc: '合同：您可以查看所有住户入住流程中签署的预定和入住合同，掌握所有住户合同详情，包括房间合同价格、合同时长、合同正文。',
      },
    },
    { path: '/household',
      component: HouseHoldList,
      name: '住户',
      meta: {
        desc: '住户：您可以查看所有住户的个人信息，包括姓名、手机号、证件类型、证件号码、紧急联系人等相关信息。',
      },
    },
    { path: '/householdinfo',
      component: HouseHoldInfo,
      name: '住户信息',
      hidden: true,
      meta: {
        desc: '住户：您可以查看所有住户的个人信息，包括姓名、手机号、证件类型、证件号码、紧急联系人等相关信息。',
      },
    },
  ],
}
