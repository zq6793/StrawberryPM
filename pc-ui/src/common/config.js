import { ENTRA_STUDENT, ENTRA_MANAGER } from './constants'

let allConfigs = {
  prod_student: {
    domain: 'student.paperchain.cn',
    // api_domain: 'http://pre.funxdata.com:9011/',
    api_domain: 'http://api.fun-x.cn/',
    wxweb_appid: 'wx7716a960fef90449',
    login_title: '纸链 · 论文评审平台',
    sub_titles: [
      '平台优化升级中，暂无法登录，2月14日新版发布',
      '汇文数据祝各位新年快乐 万事peiqi',
    ],
    title: '学生端登录',
    entrance: ENTRA_STUDENT,
  },

  prod_manager: {
    domain: 'review.paperchain.cn',
    // api_domain: 'http://pre.funxdata.com:9011/',
    api_domain: 'http://api.fun-x.cn/',
    wxweb_appid: 'wx69c4a3900c420133',
    login_title: '纸链 · 论文评审平台',
    sub_titles: [
      '平台优化升级中，暂无法登录，2月14日新版发布',
      '汇文数据祝各位新年快乐 万事peiqi',
    ],
    title: '纸链·评审平台',
    entrance: ENTRA_MANAGER,
  },

  dev_student: {
    domain: 'student.funxdata.com',
    // api_domain  : 'http://api.fun-x.cn/',
    api_domain: 'http://tapi.boss.funxdata.com:9010/',
    wxweb_appid: 'wxb5a7ca3c63ccdebf',
    login_title: '纸链 · 论文评审平台',
    sub_titles: [
      '平台优化升级中，暂无法登录，2月14日新版发布',
      '汇文数据祝各位新年快乐 万事peiqi',
    ],
    title: '学生端登录',
    entrance: ENTRA_STUDENT,
  },

  dev_manager: {
    domain: 'review.funxdata.com',
    // api_domain  : 'http://api.fun-x.cn/',
    api_domain: 'http://tapi.boss.funxdata.com:9010/',
    // api_domain: 'http://localhost:8081/', // http://localhost:8081/
    wxweb_appid: 'wx5a9cd81a7c444471',
    login_title: '纸链 · 论文评审平台',
    title: '纸链·评审平台',
    entrance: ENTRA_MANAGER,
  },

  local: {
    domain: 'review.funxdata.com',
    api_domain: 'http://localhost:7070/',
    wxweb_appid: 'wx5a9cd81a7c444471',
    login_title: '纸链 · 论文评审平台',
    title: '纸链·评审平台',
    entrance: ENTRA_MANAGER,
  },
}

function loadConfig () {
  switch (document.domain) {
    case 'review.paperchain.cn':
    case 'r.paperchain.cn':
    case 'u.paperchain.cn':
      return allConfigs.prod_manager
    case 'student.paperchain.cn':
    case 's.paperchain.cn':
      return allConfigs.prod_student
    case 'student.funxdata.com':
    case 'student.t.paperchain.cn':
      return allConfigs.dev_student
    case 'review.funxdata.com':
    case 'review.t.paperchain.cn':
      return allConfigs.dev_manager
      // return allConfigs.prod_manager
    default:
      // return allConfigs.local
      return allConfigs.dev_manager
      // return allConfigs.prod_manager
  }
}

let cfg = loadConfig()

console.log('welcome  ', cfg)

document.title = cfg.title

export default {
  global: cfg,
  api_domain: cfg.api_domain,
  wx_appid: cfg.wxweb_appid,
  wx_login_redirect_url: 'http://' + cfg.domain + '/%23/login', // 微信登录
  wx_bind_redirect_url: 'http://' + cfg.domain + '/%23/login/bindwechat', // 微信绑定
  // expert_redirect_url   : "http://"+cfg.domain+"/#/professor", //专家端
  // student_redirect_url  : "http://"+cfg.domain+"/#/index", //学校端
  login_title: cfg.login_title,
  entra: cfg.entrance,
  is_manager: cfg.entrance === ENTRA_MANAGER,
}
