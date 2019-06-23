import Home from '@/views/Home'

import CompanyDetail from '@/views/company/Detail' /* 企业信息 */

export default {
  path: '/',
  component: Home,
  name: '',
  iconCls: 'iconfont icon-ali-gongsi-',
  leaf: true, // 只有一个节点
  hidden: '',
  children: [
    { path: '/registerinfo',
      component: CompanyDetail,
      name: '企业信息',
      meta: {
        desc: '企业信息：您需要在首次进入平台后进行企业认证，认证通过后才能正常使用公寓云管理系统。',
      },
    },
  ],
}
