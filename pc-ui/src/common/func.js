import '@/assets/js/wxLogin.js'
import config from './config'

export default {
  /* 获取登录二维码 */
  getWechatCode: function (id, url) {
    let obj = new WxLogin({
      id: id,
      appid: config.wx_appid,
      scope: 'snsapi_login',
      redirect_uri: url,
      state: Math.ceil(Math.random() * 1000),
      style: 'black',
      href: 'data:text/css;base64,LmltcG93ZXJCb3h7DQoJd2lkdGg6IDEwMCU7DQoJbWFyZ2luOiAwIGF1dG87DQp9DQouaW1wb3dlckJveCAucXJjb2Rlew0KCXdpZHRoOiAxODBweDsNCgltYXJnaW46IDE1cHggYXV0byAwOw0KCWJvcmRlcjogbm9uZTsNCn0NCi50aXRsZSwNCiN3eF9kZWZhdWx0X3RpcCBwOm50aC1jaGlsZCgyKXsNCglkaXNwbGF5Om5vbmU7DQp9DQoud3hfYWZ0ZXJfc2NhbnsNCgl0ZXh0LWFsaWduOiBjZW50ZXI7DQp9DQouaW1wb3dlckJveCAuaWNvbjM4X21zZy5zdWNjIHsNCgliYWNrZ3JvdW5kLXNpemU6IDIwcHggNjdweDsNCglwb3NpdGlvbjogYWJzb2x1dGU7DQogIGJvdHRvbTogMjhweDsNCglsZWZ0OiA5M3B4Ow0KCWJhY2tncm91bmQtcG9zaXRpb246IDAgLTIzcHg7DQp9DQouaW1wb3dlckJveCAuaWNvbjM4X21zZyB7DQoJd2lkdGg6IDIwcHg7DQoJaGVpZ2h0OiAyM3B4Ow0KfQ0KaDQgew0KCXRleHQtYWxpZ246IGNlbnRlcjsNCgltYXJnaW4tbGVmdDogMjZweDsNCn0NCi5pbXBvd2VyQm94IC5zdGF0dXNfdHh0IHsNCglkaXNwbGF5OiBibG9jazsNCn0NCi5pbXBvd2VyQm94IC5zdGF0dXNfdHh0IHAgew0KCWNvbG9yOiAjOTk5Ow0KCXRvcDogM3B4Ow0KCXRleHQtYWxpZ246IGNlbnRlcjsNCn0=',
    })
  },

  // 对接口的请求进行判断
  // 公共函数这里面有问题 有时间需要更改
  portInit: function (rescode, resmsg, callback) {
    // 请求数据
    if (rescode !== 0) { return }
    callback()
  },

}
