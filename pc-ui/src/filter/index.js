import Vue from 'vue'

import dateFormat from 'dateformat'

function parseDate (val) {
  let t = val.substr(0, 19)
    .replace('T', ' ')
    .replace('-', '/')
    .replace('-', '/')
  return new Date(t)
}

let filters = {
  /* 截取年月日 */
  date: function (type) {
    if (type == '0001-01-01T00:00:00Z') {
      return ''
    }
    return type.substr(0, 10)
  },
  // 截取年月日时分秒
  time: function (value) {
    let t = parseDate(value)
    return dateFormat(t, 'yyyy-mm-dd HH:MM:ss')
  },
  boolx: function (value) {
    if (value == 1) {
      return true
    }
    return false
  },
  // 获取倒计时时间
  countdown: function (dead) {
    let t = parseDate(dead)
    let now = new Date()
    // console.log('now', now, 't', t, 'dead', dead, t<=now)
    if (t <= now) {
      return '已超时'
    }
    let str = '剩余'
    let n = (t.getTime() - now.getTime()) / 1000
    let d = parseInt(n / (60 * 60 * 24))
    if (d >= 1) {
      str += d + '天'
    }
    let h = parseInt((n % (60 * 60 * 24)) / (60 * 60))
    if (h >= 1) {
      str += h + '小时'
    }
    if (d === 0 && h < 1) {
      str = '剩余不足一小时'
    }
    return str
  },

  // 管理端论文状态展示
  mPaperStatus: function (value) {
    switch (value) {
      case 'WAIT_REVIEW':
      case 'WAIT_TUTOR':
      case 'WAIT_COLLEGE':
        return '审批中'
      case 'REJECT':
        return '已驳回'
      case 'WAIT_SEND':
        return '待送审'
      case 'SEND':
        return '送审中'
      case 'MATCH_FAILED':
        return '送审异常'
      case 'PASSED':
      case 'NO_PASS':
      case 'REVIEWED':
        return '已评阅'
      default:
        return value
    }
  },

  taskflowStatus: function (value) {
    switch (value) {
      case 'GENERATE':
        return '已创建'
      case 'AUDIT':
        return '审批中'
      case 'APPROVED':
        return '已通过'
      case 'CLOSED':
        return '已关闭'
      case 'UNAPPROVED':
        return '已驳回'
      case 'COMPLETE':
        return '已完成'
      default:
        return value
    }
  },

  mPaperReviewStatus: function (value) {
    switch (value) {
      case 'WAIT_RECEIVE':
      case 'REVIEWING':
        return '评阅中'
      case 'PASSED':
      case 'NO_PASS':
      case 'REVIEWED':
        return '已评阅'
      case 'CONFLICT':
      case 'CLOSED':
      case 'TIMEOUT':
        return '已关闭'
      default:
        return value
    }
  },

  // 专家端论文评阅展示
  pPaperReviewStatus: function (value) {
    switch (value) {
      case 'WAIT_RECEIVE':
        return '待接收'
      case 'TIMEOUT':
        return '评阅超时'
      case 'REJECT':
        return '已拒评'
      case 'REVIEWING':
        return '评阅中'
      case 'REVIEWED':
        return '已评阅'
      case 'CONFLICT':
      case 'CLOSED':
        return '已关闭'
      default:
        return value
    }
  },

  // 学生攻读类别
  degreeType: function (value) {
    switch (value) {
      case '1':
        return '专业学位硕士'
      case '2':
        return '学术型硕士'
      case '3':
        return '专业学位博士'
      case '4':
        return '学术型博士'
      case '5':
        return '公费师范生'
      case '6':
        return '同等学力硕士'
      case '7':
        return '留学生硕士'
      case '8':
        return '联考教育硕士'
      case '9':
        return '教育硕士'
      default:
        return value
    }
  },

  // 学生攻读方式
  degreeWay: function (value) {
    switch (value) {
      case '1':
        return '统招'
      case '2':
        return '联合培养'
      case '3':
        return '在职'
      case '4':
        return '同等学历'
      default:
        return value
    }
  },

  // 学生审核状态
  reviewStatus: function (value) {
    switch (value) {
      case 'LOCKED':
        return '审核中'
      case 'NORMAL':
        return '已入账'
      default:
        return value
    }
  },

  // 学生提交状态
  submitStatus: function (value) {
    switch (value) {
      case 'COMMITED':
        return '已提交'
      case 'NO_UPLOAD':
        return '未提交'
      default:
        return value
    }
  },
}

Object.keys(filters).forEach(name => {
  Vue.filter(name, filters[name])
})

export default filters
