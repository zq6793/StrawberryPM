import Login from '@/views/Login.vue'
import register from '@/views/register.vue'
import NotFound from '@/views/404.vue'
import Home from '@/views/Home.vue'
import dataanalysis from '@/views/dataanalysis.vue' /* 首页数据分析 */

import apartment from './apartment.js'
import company from './company.js'
import finance from './finance.js'
import mall from './mall.js'
import marketing from './marketing.js'
import operate from './operate.js'
import jurisdiction from './jurisdiction.js'
import proprietor from './proprietor.js'
import service from './service.js'
import report from './report.js'

let routes = [
  { path: '/login', component: Login, name: '', hidden: true },
  { path: '/register', component: register, name: '', hidden: true },
  { path: '/404', component: NotFound, name: '', hidden: true },
  { path: '/', hidden: true, redirect: { path: '' } },
  {
    path: '/',
    component: Home,
    name: '首页',
    iconCls: 'iconfont icon-ali-zonglan',
    leaf: true, // 只有一个节点
    children: [
      { path: '/dataanalysis', component: dataanalysis, name: '首页' },
    ],
  },
  apartment,
  operate,
  finance,
  jurisdiction,
  marketing,
  service,
  mall,
  report,
  proprietor,
  company,
  {
    path: '*',
    hidden: true,
    redirect: { path: '/404' },
  },
]

export default routes
