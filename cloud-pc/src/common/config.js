let allConfigs = {
  prod: {
    domain: 'boss.strongberry.cn',
    api_domain: 'api.boss.strongberry.cn',
    wxweb_appid: 'wx1574f9db2ebfd805',
    isSAAS: false,
    logo_title: '金地草莓社区',
    login_title: '金地草莓社区 · 公寓管理系统',
    cdn_img: 'cdn.funxdata.com',
    title: '后台管理'
  },
  dev: {
    domain: 'tboss.funxdata.com',
    // api_domain: 'tapi.boss.funxdata.com:8010',
    api_domain: 'tapi.fun-x.cn',
    // api_domain: 'localhost:8080',
    wxweb_appid: 'wx75fd74e2316b2355',
    isSAAS: false,
    logo_title: '金地草莓社区',
    login_title: '金地草莓社区 · 公寓管理系统',
    oss_img: 'tfunx.oss-cn-shenzhen.aliyuncs.com',
    title: '后台管理'
  },
  pre: {
    domain: 'boss-pre.strongberry.cn',
    api_domain: 'api.boss-pre.strongberry.cn',
    wxweb_appid: 'wx7a399aff7b64b577',
    isSAAS: false,
    logo_title: '金地草莓社区',
    login_title: '金地草莓社区 · 测试系统',
    title: '后台管理'
  },
  saas: {
    domain: 'cloud.funxdata.com',
    api_domain: 'api.cloud.funxdata.com',
    wxweb_appid: 'wxed23dd1f8cb18d86',
    isSAAS: true,
    logo_title: '',
    login_title: '梵响 · 公寓云',
    title: '公寓云',
  },
  pre_saas: {
    domain: 'tcloud.funxdata.com',
    api_domain: 'tapi.cloud.funxdata.com',
    wxweb_appid: '',
    isSAAS: true,
    logo_title: '',
    login_title: '梵响 · 公寓云',
    title: '公寓云',
  },
}

function loadConfig () {
  switch (document.domain) {
    case 'boss.strongberry.cn':
      return allConfigs.prod
    case 'localhost':
    case 'tboss.fun-x.cn':
    case 'tboss.funxdata.com':
      return allConfigs.dev
    case 'tcloud.funxdata.com':
      return allConfigs.pre_saas
    case 'boss-pre.strongberry.cn':
      return allConfigs.pre
    default:
      return allConfigs.saas
  }
}
let cfg = loadConfig()
let api_url = 'http://' + cfg.api_domain
document.title = cfg.title
// console.log('welcome', cfg)
export default {
  global: cfg,
  api_url: api_url,
  wx_appid: cfg.wxweb_appid,
  wx_login_redirect_uri: 'http://' + cfg.domain + '/%23/login',
  wx_register_redirect_uri: 'http://' + cfg.domain + '/%23/register',
  wx_addstaff_redirect_uri: 'http://' + cfg.domain + '/%23/addstaff',
  isSAAS: cfg.isSAAS,
  logo_title: cfg.logo_title,
  login_title: cfg.login_title,
  image_upload_url: api_url + '/common/imageupload/',
  file_upload_url: api_url + '/common/fileupload',
  active_osso: 'http://' + cfg.oss_img + '/2018-07-24/5b56de19ec3d9.jpg',
  active_ossT: 'http://' + cfg.oss_img + '/2018-07-24/5b56dd4e88fac.jpg',
  active_cdno: 'http://' + cfg.cdn_img + '/2018-07-25/5b57d12e22499.jpg',
}
