import Home from '@/views/Home'

/* 房源 */

// 门店 store
import StoreList from '@/views/apartment/store/List' /* 门店管理 */
import StoreAdd from '@/views/apartment/store/Add' /* 新增门店 */
import StoreEdit from '@/views/apartment/store/Edit' /* 编辑门店 */

// 房型 houseType
import HouseTypeList from '@/views/apartment/houseType/List' /* 房型管理 */
import HouseTypeAdd from '@/views/apartment/houseType/Add' /* 新建房型 */
import HouseTypeEdit from '@/views/apartment/houseType/Edit' /* 编辑房型 */

// 小区 community
import CommunityList from '@/views/apartment/community/List' /* 小区管理 */
import CommunityAdd from '@/views/apartment/community/Add' /* 新建小区 */
import CommunityEdit from '@/views/apartment/community/Edit' /* 编辑小区 */

// 房间 room
import RoomList from '@/views/apartment/room/List' /* 房间管理 */
import RoomEditContract from '@/views/apartment/room/EditContract' /* 房间批量操作集中式 */
import RoomAdd from '@/views/apartment/room/Add' /* 新增房间 */
import RoomEdit from '@/views/apartment/room/Edit' /* 编辑房间 */

// 合同模板 contractTemplate
import ContractTemplateList from '@/views/apartment/contractTpl/List' /* 合同模板管理 */
import ContractTemplateAdd from '@/views/apartment/contractTpl/Add' /* 新建模板 */
import ContractTemplateEdit from '@/views/apartment/contractTpl/Edit' /* 编辑模板 */

// 设备管理 device
import DeviceList from '@/views/apartment/device/List' /* 设备管理 */
import DeviceDetail from '@/views/apartment/device/Detail' /* 设备详情 */

export default {
  path: '/',
  component: Home,
  name: '房源',
  iconCls: 'iconfont icon-ali-fangyuan-xuanzhong', // 图标样式class
  children: [
    { path: '/storemanage',
      component: StoreList,
      name: '门店',
      meta: {
        keepAlive: true,
        desc: '门店：您可以完整录入门店基础信息（名称、主题、地址、门店照等）、门店联系人信息与门店营业状态，公司整体掌控与管理各区域所有公寓的营运情况。',
      },
    }, // 需要被缓存
    { path: '/addstoremanage',
      component: StoreAdd,
      name: '新增门店',
      hidden: true,
      meta: {
        desc: '门店：您可以完整录入门店基础信息（名称、主题、地址、门店照等）、门店联系人信息与门店营业状态，公司整体掌控与管理各区域所有公寓的营运情况。',
      },
    },
    { path: '/editstoremanage',
      component: StoreEdit,
      name: '编辑门店',
      hidden: true,
      meta: {
        desc: '门店：您可以完整录入门店基础信息（名称、主题、地址、门店照等）、门店联系人信息与门店营业状态，公司整体掌控与管理各区域所有公寓的营运情况。',
      },
    },
    {
      path: '/housetypemanage',
      component: HouseTypeList,
      name: '房型',
      meta: {
        desc: '房型：您可以完整录入房型基本信息（名称、特点、面积、配套等），租客能全方位知晓信息，快速筛选所需房源，这是集中式公寓管理的独有功能。',
      },
    },
    { path: '/addhousetype',
      component: HouseTypeAdd,
      name: '新建房型',
      hidden: true,
      meta: {
        desc: '门店：您可以完整录入房型基本信息（名称、特点、面积、配套等），租客能全方位知晓信息，快速筛选所需房源，这是集中式公寓管理的独有功能。',
      },
    },
    { path: '/edithousetype',
      component: HouseTypeEdit,
      name: '编辑房型',
      hidden: true,
      meta: {
        desc: '门店：您可以完整录入房型基本信息（名称、特点、面积、配套等），租客能全方位知晓信息，快速筛选所需房源，这是集中式公寓管理的独有功能。',
      },
    },
    { path: '/villagemanage',
      component: CommunityList,
      name: '小区',
      meta: {
        desc: '小区：您可以完整录入小区基本信息（名称、周边配置、小区照片等），租客能掌方位知晓信息，快速筛选所需房源，这是分布式公寓管理的独有功能。',
      },
    },
    { path: '/newbuilt',
      component: CommunityAdd,
      name: '新建小区',
      hidden: true,
      meta: {
        desc: '小区：您可以完整录入小区基本信息（名称、周边配置、小区照片等），租客能掌方位知晓信息，快速筛选所需房源，这是分布式公寓管理的独有功能。',
      },
    },
    { path: '/editbuilt',
      component: CommunityEdit,
      name: '编辑小区',
      hidden: true,
      meta: {
        desc: '小区：您可以完整录入小区基本信息（名称、周边配置、小区照片等），租客能掌方位知晓信息，快速筛选所需房源，这是分布式公寓管理的独有功能。',
      },
    },
    { path: '/roommanage',
      component: RoomList,
      name: '房间',
      meta: {
        desc: '房间：您可以完整录入所有房间的基础信息（楼栋号、楼层、房间照），租客能深入了解房间具体情况，快速构建房间整体认识，增强公寓管理的专业性。',
      },
    },
    { path: '/roombath',
      component: RoomEditContract,
      name: '批量操作',
      hidden: true,
      meta: {
        desc: '房间：您可以完整录入所有房间的基础信息（楼栋号、楼层、房间照），租客能深入了解房间具体情况，快速构建房间整体认识，增强公寓管理的专业性。',
      },
    },
    { path: '/newroominfo',
      component: RoomAdd,
      name: '新增房间',
      hidden: true,
      meta: {
        desc: '房间：您可以完整录入所有房间的基础信息（楼栋号、楼层、房间照），租客能深入了解房间具体情况，快速构建房间整体认识，增强公寓管理的专业性。',
      },
    },
    { path: '/edithome',
      component: RoomEdit,
      name: '查看房间',
      hidden: true,
      meta: {
        desc: '房间：您可以完整录入所有房间的基础信息（楼栋号、楼层、房间照），租客能深入了解房间具体情况，快速构建房间整体认识，增强公寓管理的专业性。',
      },
    },
    { path: '/addTemplate',
      component: ContractTemplateAdd,
      name: '新建模板',
      hidden: true,
      meta: {
        desc: '合同模板：您可以与住户在办理公寓入住或预定时签署电子合同，您可以一键快速查询住户租住情况，精准计算相关费用，预测公寓未来空置率，提升公寓营管效率。',
      },
    },
    { path: '/contracttemplate',
      component: ContractTemplateList,
      name: '合同模板',
      meta: {
        desc: '合同模板：您可以与住户在办理公寓入住或预定时签署电子合同，您可以一键快速查询住户租住情况，精准计算相关费用，预测公寓未来空置率，提升公寓营管效率。',
      },
    },
    { path: '/editTemplate',
      component: ContractTemplateEdit,
      name: '编辑模板',
      hidden: true,
      meta: {
        desc: '合同模板：您可以与住户在办理公寓入住或预定时签署电子合同，您可以一键快速查询住户租住情况，精准计算相关费用，预测公寓未来空置率，提升公寓营管效率。',
      },
    },
    { path: '/devicemanage',
      component: DeviceList,
      name: '设备管理',
      meta: {
        desc: '智能设备：您可以完全在线管理房间所有智能设备（智能电表、水表、门锁等），时刻掌控设备运行状态与用量数据，避免数据误差，便于月底费用收缴与管理。',
      },
    },
    { path: '/detailspage',
      component: DeviceDetail,
      name: '设备详情',
      hidden: true,
      meta: {
        desc: '智能设备：您可以完全在线管理房间所有智能设备（智能电表、水表、门锁等），时刻掌控设备运行状态与用量数据，避免数据误差，便于月底费用收缴与管理。',
      },
    },
  ],
}
