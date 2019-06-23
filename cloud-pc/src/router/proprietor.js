import Home from '@/views/Home.vue'

/* 小业主 */

// 小业主列表
import ListList from '@/views/proprietor/list/List.vue' /* 小业主列表 */
import ListAdd from '@/views/proprietor/list/Add.vue' /* 新增小业主 */
import ListEdit from '@/views/proprietor/list/Edit.vue' /* 编辑小业主 */

// 小业主账单
import BillList from '@/views/proprietor/bill/List.vue' /* 小业主账单 */
import BillInfo from '@/views/proprietor/bill/Info.vue' /* 查看小业主订单 */

export default {
  path: '/',
  component: Home,
  name: '小业主',
  iconCls: 'iconfont icon-ali-yezhu',
  children: [
    { path: '/ownerlist',
      component: ListList,
      name: '小业主列表',
      meta: {
        desc: '小业主：您可以查看将房屋托管给公寓运营的业主详情，如业主姓名、联系方式、房间地址、签署的合同信息等。',
      },
    },
    { path: '/addowner',
      component: ListAdd,
      name: '新增小业主',
      hidden: true,
      meta: {
        desc: '小业主：您可以查看将房屋托管给公寓运营的业主详情，如业主姓名、联系方式、房间地址、签署的合同信息等。',
      },
    },
    { path: '/editowner',
      component: ListEdit,
      name: '编辑小业主',
      hidden: true,
      meta: {
        desc: '小业主：您可以查看将房屋托管给公寓运营的业主详情，如业主姓名、联系方式、房间地址、签署的合同信息等。',
      },
    },
    { path: '/ownerorder',
      component: BillList,
      name: '小业主账单',
      meta: {
        desc: '小业主账单：您可以查看管理公寓应支付给业主的账单详情，包括账单金额、账单状态等。',
      },
    },
    { path: '/lookorderlist',
      component: BillInfo,
      name: '查看账单',
      meta: {
        desc: '小业主账单：您可以查看管理公寓应支付给业主的账单详情，包括账单金额、账单状态等。',
      },
    },
  ],
}
