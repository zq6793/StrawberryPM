import Home from '@/views/Home.vue'

/* 服务 */

// 服务类型
import TypeList from '@/views/service/type/List.vue' /* 服务类型 */
import TypeAdd from '@/views/service/type/Add.vue' /* 增加服务类型 */
import TypeEdit from '@/views/service/type/Edit.vue' /* 编辑服务类型 */

// 服务订单
import OrderList from '@/views/service/order/List.vue' /* 服务订单 */
// import InfoSupplement from '@/views/service/order/infoSupplement.vue'   /*信息补录*/

export default {
  path: '/',
  component: Home,
  name: '服务',
  iconCls: 'iconfont icon-ali-zengzhifuwu',
  children: [
    { path: '/servicetype',
      component: TypeList,
      name: '服务类型',
      meta: {
        desc: '服务类型：您可以创建不同类型的服务，如维修、保洁、搬家等，住户可通过微信公众号申请所创建的服务。',
      },
    },
    { path: '/addserver',
      component: TypeAdd,
      name: '增加服务',
      hidden: true,
      meta: {
        desc: '服务类型：您可以创建不同类型的服务，如维修、保洁、搬家等，住户可通过微信公众号申请所创建的服务。',
      },
    },
    { path: '/editserver',
      component: TypeEdit,
      name: '编辑服务',
      hidden: true,
      meta: {
        desc: '服务类型：您可以创建不同类型的服务，如维修、保洁、搬家等，住户可通过微信公众号申请所创建的服务。',
      },
    },
    { path: '/serviceorder',
      component: OrderList,
      name: '服务订单',
      meta: {
        desc: '服务订单：您可以查看所有的服务订单，了解申请服务的住户信息、服务金额、服务状态等。',
      },
    },
    // { path: '/InfoSupplement', component: InfoSupplement, name: '信息补录'},
  ],
}
