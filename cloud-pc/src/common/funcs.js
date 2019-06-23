import Vue from 'vue'
import config from './config.js'
import '@/assets/js/wxLogin.js'

Vue.prototype.fxCfg = config

let SIGN_REGEXP = /([yMdhsm])(\1*)/g
let DEFAULT_PATTERN = 'yyyy-MM-dd'

function padding (s, len) {
  len = len - (s + '').length
  for (let i = 0; i < len; i++) { s = '0' + s }
  return s
};

export default {
  getQueryStringByName: function (name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    let r = window.location.search.substr(1).match(reg)
    let context = ''
    if (r != null) { context = r[2] }
    reg = null
    r = null
    return context == null || context == '' || context == 'undefined' ? '' : context
  },
  formatDate: {
    format: function (date, pattern) {
      pattern = pattern || DEFAULT_PATTERN
      return pattern.replace(SIGN_REGEXP, function ($0) {
        switch ($0.charAt(0)) {
          case 'y':
            return padding(date.getFullYear(), $0.length)
          case 'M':
            return padding(date.getMonth() + 1, $0.length)
          case 'd':
            return padding(date.getDate(), $0.length)
          case 'w':
            return date.getDay() + 1
          case 'h':
            return padding(date.getHours(), $0.length)
          case 'm':
            return padding(date.getMinutes(), $0.length)
          case 's':
            return padding(date.getSeconds(), $0.length)
        }
      })
    },
    parse: function (dateString, pattern) {
      let matchs1 = pattern.match(SIGN_REGEXP)
      let matchs2 = dateString.match(/(\d)+/g)
      if (matchs1.length == matchs2.length) {
        let _date = new Date(1970, 0, 1)
        for (let i = 0; i < matchs1.length; i++) {
          let _int = parseInt(matchs2[i])
          let sign = matchs1[i]
          switch (sign.charAt(0)) {
            case 'y':
              _date.setFullYear(_int)
              break
            case 'M':
              _date.setMonth(_int - 1)
              break
            case 'd':
              _date.setDate(_int)
              break
            case 'h':
              _date.setHours(_int)
              break
            case 'm':
              _date.setMinutes(_int)
              break
            case 's':
              _date.setSeconds(_int)
              break
          }
        }
        return _date
      }
      return null
    },
  },
  // 对参数是否为空的函数
  emptyVul: function (obj, load, callback) {
    let flag = 1
    for (let key in obj) {
      if (obj[key] === '') {
        flag = 2
        Vue.prototype.$message({
          message: '请完整填写表单',
          type: 'error',
        })
        return load()
      }
    }
    if (flag == 1) {
      callback()
    }
  },
  // 对每一次关闭diglog进行清空
  clearVul: function (obj) {
    for (let key in obj) {
      if (obj[key] != '') {
        obj[key] = ''
      }
    }
  },
  // 退租类型转化
  typeTre: function (type) {
    if (type == 'CHECKOUT') {
      type = '正常退房'
    } else if (type == 'PRICE') {
      type = '调价'
    } else if (type == 'SERVICE') {
      type = '服务订单'
    } else if (type == 'RESERVE') {
      type = '预约看房'
    } else if (type == 'WARNING') {
      type = '预警'
    } else if (type == 'UNDER_CONTRACT' || type == 'UNDER_CONTRACT_LESS') {
      type = '违约退房'
    } else if (type == 'NO_LIABILITY') {
      type = '特殊退房'
    } else if (type == 'GIVE_UP') {
      type = '退房-放弃追缴'
    } else if (type == 'CHANGE_ROOM') {
      type = '换房'
    } else if (type == 'ADD_REFUND') {
      type = '退房-额外退款'
    } else if (type == 'REAL_INCOME_LESS') {
      type = '退房-实际收益小于0'
    }else if(type == 'NORMAL_REFUND') {
      type = '正常退房退款'
    } else if (type == 'NORMAL_NOT_REFUND') {
      type = '正常退房不退款'
    } else if (type == 'UNDER_REFUND') {
      type = '违约退房退款'
    } else if (type == 'UNDER_NOT_REFUND') {
      type = '违约退房不退款'
    } else if (type == 'UNDER_NO_REFUND') {
      type = '违约退房无可退金额'
    } else if (type == 'TRANSFORM') {
      type = '转租'
    }
    return type
  },
  // 状态转化
  statusTre: function (status) {
    if (status == 'AUDIT') {
      status = '审批流程中'
    } else if (status == 'APPROVED') {
      status = '审批已完成'
    } else if (status == 'CLOSED') {
      status = '审批已终止'
    } else if (status == 'UNAPPROVED') {
      status = '审批未通过'
    }
    return status
  },
  // 状态转化
  checkoutStatus: function (status) {
    if (status == 'CHECKED') {
      status = '已验房'
    } else if (status == 'COMPLETED') {
      status = '已完成'
    } else if (status == 'AUDIT') {
      status = '审批中'
    } else if (status == 'UNAPPROVED') {
      status = '未通过'
    } else if (status == 'UNPAID') {
      status = '未退款'
    } else if (status == 'CLOSED') {
      status = '已关闭'
    } else if (status == 'CONFIRM') {
      status = '已确认'
    } else if (status == 'COMPLETE') {
      status = '已完成'
    }
    return status
  },
  // 转租端类型转换
  transType: function (type) {
    if (type == 'CUSTOMER') {
      type = '住户转租'
    } else if (type == 'COMPANY') {
      type = '草莓转租'
    }
    return type
  },
  // 审批结果状态转化
  // 状态转化
  resultTre: function (result) {
    if (result == 'APPROVED') {
      result = '通过'
    } else if (result == 'UNAPPROVED' || result == 'CLOSED') {
      result = '驳回'
    }
    return result
  },
  //
  // 类型装换
  notypeTra: function (type) {
    if (type == 'ROOM') {
      type = '住宿服务费'
    } else if (type == 'CLEAN') {
      type = '清洁服务费'
    } else if (type == 'DEIVCE') {
      type = '设备租赁费'
    } else if (type == 'UTILITY') {
      type = '水电服务费'
    } else if (type == 'REFUND') {
      type = '退房'
    } else if (type == 'RESERVE') {
      type = '定金'
    } else if (type == 'MANAGEMENT') {
      type = '物业服务费'
    } else if (type == 'DEPOSIT_R') {
      type = '住宿押金'
    } else if (type == 'DEPOSIT_O') {
      type = '其他押金'
    } else if (type == 'ELECTRICITY') {
      type = '用电服务费'
    } else if (type == 'WATER') {
      type = '冷水服务费'
    } else if (type == 'HOT_WATER') {
      type = '热水服务费'
    } else if (type == 'REPAIR') {
      type = '物品维修费'
    } else if (type == 'COMPENSATION') {
      type = '物品赔偿费'
    } else if (type == 'OVERDUE') {
      type = '滞纳金'
    } else if (type == 'OTHER') {
      type = '其它服务费'
    } else if (type == 'BREAK') {
      type = '违约金'
    } else if (type == 'GAS') {
      type = '燃气费'
    } else if (type == 'PETCLEAN') {
      type = '宠物消杀费'
    } else if (type == 'CHANGE_ROOM') {
      type = '换房服务费'
    } else if (type == 'TRANSFORM') {
      type = '转租服务费'
    }
    return type
  },
  // 类型转换
  contypeTra: function (type) {
    if (type == 'CASH') {
      type = '代金券'
    } else if (type == 'DISCOUNT') {
      type = '折扣券'
    } else if (type == 'REMIT') {
      type = '减免券'
    } else {

    }
    return type
  },
  // 获取二维码
  getWechatCode: function (url) {
    return new WxLogin({
      id: 'qrcode',
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
  // 合同状态转化
  constatus: function (status) {
    if (status == 'GENERATED') {
      status = '未签署'
    } else if (status == 'SIGNING') {
      status = '签署中'
    } else if (status == 'ARCHIVED') {
      status = '已归档'
    } else {}
    return status
  },
  // 合同类型转化
  contype: function (type) {
    if (type == 'FDD') {
      type = '电子合同'
    } else {
      type = '普通合同'
    }
    return type
  },
  // 证件类型转化
  cardTypeT: function (type) {
    if (type == '0') {
      type = '身份证'
    } else if (type == '1') {
      type = '护照'
    } else if (type == '2') {
      type = '军人身份证'
    } else if (type == '6') {
      type = '社会保障卡'
    } else if (type == 'A') {
      type = '武装警察身份证件'
    } else if (type == 'B') {
      type = '港澳通行证'
    } else if (type == 'C') {
      type = '台湾居民来往大陆通行证'
    } else if (type == 'E') {
      type = '户口簿'
    } else if (type == 'F') {
      type = '临时居民身份证'
    } else if (type == 'P') {
      type = '外国人永久居留证'
    } else if (type == 'Bl') {
      type = '营业执照'
    } else if (type == 'OTHER') {
      type = '其他'
    } else if (type == 'E') {
      type = '户口簿'
    } else if (type == 'IDCARD') {
      type = '身份证'
    }

    return type
  },
  // 类型转化
  storeTre: function (type) {
    if (type == 'DOT') {
      type = '分布式'
    } else {
      type = '集中式'
    }
    return type
  },
  // 销控房间类型转化
  markTran (status) {
    if (status == 'BLANK') {
      status = '空'
    } else if (status == 'RESERVE') {
      status = '预订'
    } else if (status == 'RENT') {
      status = '正常出租'
    } else if (status == 'ARREARS') {
      status = '欠费出租'
    } else if (status == 'OCCUPIED') {
      status = '占用'
    } else {

    }
    return status
  },
  // 房间类型转化
  featureTra (type) {
    if (type == 'M') {
      type = '主卧'
    } else if (type == 's') {
      type = '次卧'
    } else if (type == 'MT') {
      type = '独卫主卧'
    }
    return type
  },
  wxTry (status) {
    if (status == '2') {
      status = '服务号'
    } else if (status == '1') {
      status = '由历史老帐号升级订阅号'
    } else if (status == '0') {
      status = '订阅号'
    }
    return status
  },
  wxTrystatus (status) {
    if (status == '5') {
      status = '代表已资质认证通过、还未通过名称认证，但通过了腾讯微博认证'
    } else if (status == '4') {
      status = '已资质认证通过、还未通过名称认证，但通过了新浪微博认证'
    } else if (status == '3') {
      status = '已资质认证通过但还未通过名称认证'
    } else if (status == '2') {
      status = '腾讯微博认证'
    } else if (status == '1') {
      status = '新浪微博认证'
    } else if (status == '0') {
      status = '微信认证'
    } else if (status == '-1') {
      status = '未认证'
    }
    return status
  },
  waterStatus (status) {
    if (status == 'NOORDER') {
      status = '录入中'
    } else if (status == 'HASORDER') {
      status = '已生成'
    } else if (status == 'NORESIDENT') {
      status = '无住户'
    } else {
      status = '未上传读数'
    }
    return status
  },
  activetre (type) {
    if (type == 'SCRATCH') {
      type = '刮刮乐'
    } else if (type == 'TRNTABLE') {
      type = '幸运大转盘'
    } else if (type == 'OLDBELTNEW') {
      type = '老带新'
    } else if (type == 'CHECKIN') {
      type = '入住送好礼'
    } else if (type == 'ATTRACT') {
      type = '吸粉'
    }
    return type
  },

  // 水电表转化
  waterTypeTra (type) {
    if (type == 'COLD_WATER_METER') {
      type = '冷水表'
    } else if (type == 'HOT_WATER_METER') {
      type = '热水表'
    } else if (type == 'ELECTRIC_METER') {
      type = '电表'
    } else if (type == 'GAS_METER') {
      type = '燃气表'
    }
    return type
  },

  // 小业主状态转化
  ownerStatus (status) {
    if (status == 'NORMAL') {
      status = '正常'
    } else if (status == 'RESCISSION') {
      status = '解约'
    } else if (status == 'INVALID') {
      status = '无效'
    }
    return status
  },

  // 优惠券状态
  constatusTra (status) {
    if (status == 'UNUSED') {
      status = '未使用 '
    } else if (status == 'EXPIRED') {
      status = '已过期'
    } else if (status == 'USED') {
      status = '已使用'
    } else if (status == 'INACTIVE') {
      status = '已失效'
    } else {

    }
    return status
  },

  /* 转换支付方式 */
  payType (type) {
    switch (type) {
      case 'BANK':
        type = '银行卡'
        break
      case 'JSAPI':
        type = '微信'
        break
      case 'ALIPAY':
        type = '支付宝'
        break
      case 'DEPOSIT':
        type = '押金抵扣'
        break
      case 'GIVEUP':
        type = '退房-放弃追缴审批'
        break
      case 'REFUND_ADVANCE':
        type = '退房欠收'
        break
    }
    return type
  },
  // 支付状态转化
  payStatus (status) {
    if (status == 'GENERATE') {
      status = '未审核'
    } else if (status == 'AUDITED') {
      status = '已审核'
    } else if (status == 'PENDING') {
      status = '未付款'
    } else if (status == 'CONFIRM') {
      status = '付款待确认'
    } else if (status == 'COMPLETED') {
      status = '已付款'
    } else if (status == 'REFUND') {
      status = '退单'
    } else if (status == 'EXPIRE') {
      status = '过期'
    } else if (status == 'CLOSE') {
      status = '已关闭'
    }
    return status
  },
  // 住户状态
  residentTre (status) {
    if (status == 'NOT_PAY') {
      status = '办理入住未支付'
    } else if (status == 'PRE_RESERVE') {
      status = '办理预订未支付'
    } else if (status == 'PRE_CHECKIN') {
      status = '预订转入住未支付'
    } else if (status == 'PRE_CHANGE') {
      status = '换房未支付'
    } else if (status == 'PRE_RENEW') {
      status = '续约未支付'
    } else if (status == 'RESERVE') {
      status = '预订'
    } else if (status == 'NORMAL') {
      status = '正常'
    } else if (status == 'NORMAL_REFUND') {
      status = '正常退房'
    } else if (status == 'UNDER_CONTRACT') {
      status = '违约退房'
    } else if (status == 'INVALID') {
      status = '无效'
    } else if (status == 'CHECKOUT') {
      status = '已退房'
    } else if (status == 'RENEWAL') {
      status = '续租'
    } else if (status == 'NO_LIABILITY') {
      status = '特殊退房'
    }
    return status
  },
  // 优惠券用途
  limitTra (limit) {
    if (limit == 'ROOM') {
      limit = '房租'
    } else if (limit == 'WATER') {
      limit = '水费'
    } else if (limit == 'ELECTRICITY') {
      limit = '电费'
    } else if (limit == 'GAS') {
      limit = '燃气费'
    } else if (limit == 'MANAGEMENT') {
      limit = '服务管理费'
    } else if (limit == 'NONE') {
      limit = '通用'
    }
    return limit
  },
  // 设备管理状态转化
  facilityTras (status) {
    if (status == 'NOORDER') {
      status = '已录入'
    } else if (status == 'HASORDER') {
      status = '已生成'
    } else if (status == 'NOREADING') {
      status = '未录入'
    } else if (status == 'NORESIDENT') {
      status = '暂无住户'
    }
    return status
  },
  facilityTrat (type) {
    if (type == 'NORMAL') {
      type = '日常读数'
    } else if (type == 'NEW_RENT') {
      type = '入住读数'
    } else if (type == 'CHANGE_NEW') {
      type = '新表读数'
    } else if (type == 'CHANGE_OLD') {
      type = '旧表读数'
    }
    return type
  },
  year (type) {
    return type.substr(0, 10)
  },
  /* 订单处理情况转换 */
  serviceTypes (deal) {
    switch (deal) {
      case 'UNDONE':
        deal = '未处理'
        break
      case 'SDOING':
        deal = '处理中'
        break
      case 'SDONE':
        deal = '已处理'
        break
    }
    return deal
  },
  /* 服务状态转换 */
  serviceStatus (status) {
    switch (status) {
      case 'COMPLETED':
        status = '已完成'
        break
      case 'SERVING':
        status = '处理中'
        break
      case 'SUBMITTED':
        status = '已提交'
        break
      case 'PENDING':
        status = '待支付'
        break
      case 'PAID':
        status = '已支付'
        break
      case 'CANCELED':
        status = '已取消'
        break
      case 'EXPIRED':
        status = '已过期'
        break
    }
    return status
  }
}
