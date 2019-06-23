import Home from '@/views/Home.vue'

/* 权限 */

// 角色 role
import RoleList from '@/views/jurisdiction/role/List.vue' /* 职位管理 */
import RoleAdd from '@/views/jurisdiction/role/Add.vue' /* 新增职位 */
import RoleEdit from '@/views/jurisdiction/role/Edit.vue' /* 编辑职位 */

// 员工 staff
import StaffList from '@/views/jurisdiction/staff/List.vue' /* 员工管理 */
import StaffAdd from '@/views/jurisdiction/staff/Add.vue' /* 新增员工 */
import StaffEdit from '@/views/jurisdiction/staff/Edit.vue' /* 编辑员工 */

// 审批流 flow
import FlowList from '@/views/jurisdiction/flow/List.vue' /* 审批流 */
import FlowEdit from '@/views/jurisdiction/flow/Edit.vue' /* 修改审批流 */
import FlowAdd from '@/views/jurisdiction/flow/Add.vue' /* 新建审批流 */

// 任务流
import examine from '@/views/jurisdiction/taskflow/List.vue' /* 任务流模板 */
import checkoutflow from '@/views/jurisdiction/taskflow/CheckoutDetail.vue' /* 退房审批 */
import adjustflow from '@/views/jurisdiction/taskflow/AdjustDetail.vue' /* 调价审批 */
import sublet from '@/views/jurisdiction/taskflow/SubletDetail.vue' /* 转租审批 */

export default {
  path: '/',
  component: Home,
  name: '权限',
  iconCls: 'iconfont icon-ali-quanxian',
  children: [
    { path: '/jobmanagement',
      component: RoleList,
      name: '角色',
      meta: {
        desc: '角色：您可以添加公寓员工的角色，并对每一种角色设置不同的使用权限，不同的角色权限对应地可以增加、删除、查看、编辑不同的系统模块。',
      },
    },
    { path: '/addjob',
      component: RoleAdd,
      name: '新增角色',
      hidden: true,
      meta: {
        desc: '角色：您可以添加公寓员工的角色，并对每一种角色设置不同的使用权限，不同的角色权限对应地可以增加、删除、查看、编辑不同的系统模块。',
      },
    },
    { path: '/editjob',
      component: RoleEdit,
      name: '编辑角色',
      hidden: true,
      meta: {
        desc: '职位：您可以添加公寓员工的职位，并对每一种职位设置不同的使用权限，不同的职位权限对应地可以增加、删除、查看、编辑不同的系统模块。',
      },
    },
    { path: '/staffmanagement',
      component: StaffList,
      name: '员工',
      meta: {
        desc: '员工：您可以添加公寓运营时的员工，并给予每个员工绑定对应的角色，添加完成后员工可通过手机验证码或微信扫一扫登录管理系统进行日常管理。',
      },
    },
    { path: '/addstaff',
      component: StaffAdd,
      name: '新增员工',
      hidden: true,
      meta: {
        desc: '员工：您可以添加公寓运营时的员工，并给予每个员工绑定对应的职位，添加完成后员工可通过手机验证码或微信扫一扫登录管理系统进行日常管理。',
      },
    },
    { path: '/editstaff',
      component: StaffEdit,
      name: '编辑员工',
      hidden: true,
      meta: {
        desc: '员工：您可以添加公寓运营时的员工，并给予每个员工绑定对应的职位，添加完成后员工可通过手机验证码或微信扫一扫登录管理系统进行日常管理。',
      },
    },
    { path: '/examine',
      component: examine,
      name: '任务流',
      hidden: true,
      meta: {
        desc: '任务流：您可以查看待审批、您发起的审批、参与的审批和全部审批项目与其他待处理任务。',
      },
    },
    { path: '/examineflow',
      component: FlowList,
      name: '审批流',
      meta: {
        desc: '审批流：您可以自由配置各个业务审批流的关键步骤模板。',
      },
    },
    { path: '/editflow',
      component: FlowEdit,
      name: '修改审批流',
      hidden: true,
      meta: {
        desc: '审批流：您可以自由配置各个业务审批流的关键步骤模板。',
      },
    },
    { path: '/addflow',
      component: FlowAdd,
      name: '添加审批流',
      hidden: true,
      meta: {
        desc: '审批流：您可以自由配置各个业务审批流的关键步骤模板。',
      },
    },
    { path: '/checkoutflow',
      component: checkoutflow,
      name: '退房审批详情',
      hidden: true,
      meta: {
        desc: '任务流：您可以查看待审批、您发起的审批、参与的审批和全部审批项目与其他待处理任务。',
      },
    },
    { path: '/adjustflow',
      component: adjustflow,
      name: '调价审批详情',
      hidden: true,
      meta: {
        desc: '任务流：您可以查看待审批、您发起的审批、参与的审批和全部审批项目与其他待处理任务。',
      },
    },
    { path: '/sublet',
      component: sublet,
      name: '转租审批详情',
      hidden: true,
      meta: {
        desc: '任务流：您可以查看待审批、您发起的审批、参与的审批和全部审批项目与其他待处理任务。',
      },
    },
  ],
}
