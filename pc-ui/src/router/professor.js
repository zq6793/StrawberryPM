/* 专家信息 */
import professorPage from '@/views/framework/Professor'

import Home from '@/views/professor/Home' /* 首页数据分析 */
// import flowWaterP from '@/views/professor/flowWater' /* 流水 */
import benefit from '@/views/professor/benefit' /* 评审费 */
import withdrawCash from '@/views/professor/withdrawcash/List' /* 评审费 */

import PaperList from '@/views/professor/paper/List'
// 学位论文
import PaperDetail from '@/views/professor/paper/Detail'
import PaperDetailPDF from '@/views/professor/paper/PDF'
import PaperReview from '@/views/professor/paper/Review'

// 科研项目
import FundPaperDetail from '@/views/professor/fund/Detail'
import FundPaperDetailPDF from '@/views/professor/fund/PDF'
import FundPaperReview from '@/views/professor/fund/Review'
// import review from '@/views/professor/review' /* 评审费 */

// 资格申请，导师遴选
import TutorPaperDetail from '@/views/professor/tutor/Detail'
import TutorPaperDetailPDF from '@/views/professor/tutor/PDF'
import TutorPaperReview from '@/views/professor/tutor/Review'

import taskList from '@/views/professor/task/List' /* 任务列表 */
import taskApproval from '@/views/professor/task/Approval' /* 任务详情 */
import Profile from '@/views/professor/profile/Profile'

let professor_routes = [
  {
    path: '/professor',
    component: professorPage,
    name: '首页',
    iconCls: 'iconfont icon-ali-zonglan',
    leaf: true, // 只有一个节点
    children: [
      { path: '', component: Home, name: '首页' },

      { path: 'tasks', component: taskList, name: '专家审批列表', hidden: true },
      { path: 'tasks/:id', component: taskApproval, name: '专家审批详情', hidden: true },
    ],
  },
  // {
  //   path: '/pprofile',
  //   component: professorPage,
  //   name: '个人信息',
  //   iconCls: 'iconfont icon-ali-fangyuan-xuanzhong',
  //   leaf: true, // 只有一个节点
  //   children: [
  //     { path: '', component: Profile, name: '个人详情', hidden: true },
  //   ],
  // },
  {
    path: '/ppaper',
    component: professorPage,
    name: '评议管理',
    iconCls: 'iconfont icon-ali-lunwen',
    leaf: true, // 只有一个节点
    children: [
      { path: '', component: PaperList, name: '评议列表' },
      { path: ':id/detail', component: PaperDetail, name: '论文信息概览', hidden: true },
      { path: ':id/pdf', component: PaperDetailPDF, name: '论文PDF浏览', hidden: true },
      { path: ':id/review', component: PaperReview, name: '论文评阅', hidden: true },
      { path: ':id/fund_detail', component: FundPaperDetail, name: '科研项目概览', hidden: true },
      { path: ':id/fund_pdf', component: FundPaperDetailPDF, name: '科研项目材料浏览', hidden: true },
      { path: ':id/fund_review', component: FundPaperReview, name: '科研项目评阅', hidden: true },
      { path: ':id/tutor_detail', component: TutorPaperDetail, name: '资格申请概览', hidden: true },
      { path: ':id/tutor_pdf', component: TutorPaperDetailPDF, name: '资格申请材料浏览', hidden: true },
      { path: ':id/tutor_review', component: TutorPaperReview, name: '资格申请评阅', hidden: true },
    ],
  },
  {
    path: '/pfinance',
    component: professorPage,
    name: '费用列表',
    iconCls: 'iconfont icon-ali-financetb',
    leaf: true, // 只有一个节点
    children: [
      { path: '', component: benefit, name: '费用' },
    ],
  },
  {
    path: '/pwithdrawcash',
    component: professorPage,
    name: '提取记录',
    iconCls: 'iconfont icon-ali-financetb',
    leaf: true, // 只有一个节点
    children: [
      { path: '', component: withdrawCash, name: '提取' },
    ],
  },
  {
    path: '/pprofile',
    component: professorPage,
    name: '个人信息',
    iconCls: 'iconfont icon-ali-financetb',
    leaf: true, // 只有一个节点
    children: [
      { path: '', component: Profile, name: '专家个人信息修改' },
    ],
  },
  // {
  //   path: '/pappraisal',
  //   component: professorPage,
  //   name: '数据统计',
  //   iconCls: 'confont icon-ali-yunying',
  //   leaf: true, // 只有一个节点
  //   children: [
  //     { path: '', component: appraisalFee, name: '评审费' },
  //   ],
  // },
]
// 管理员路由
export default professor_routes
