<template>
  <el-row class="login-page">
    <el-col :span="12">
      <div class="herder">
        <div class="index-logoimg"><img src='./../../assets/img/logo1.png' /></div>
        </div>
        <div class="logo-container">
          <div class="bind-weChat">
            <img v-if="isProfessor" :src="qrImgURL" height="300px">
            <div v-else id="bQrcode"></div>
          </div>
          <div class="identity">
            扫描二维码绑定微信登录
            <el-button type="text" class="btn-number-title" @click="skipBindWechat">跳过绑定</el-button>
          </div>
        </div>
        <!-- <div class="first" @click="mailbox" v-else="!isShowFirst">邮箱登录>>></div> -->
        <footer>Copyright 2018 汇文数据 版权所有 陕ICP备19001216号</footer>
    </el-col>
    <el-col :span="12">
      <div class="login-img">
        <img src="/static/imgs/login_bg.jpg">
      </div>
    </el-col>
  </el-row>
</template>
<script>
import {
  studentWe,
  professorWe,
  managerWe,
  pBindWechatQrImg,
  pWechatIsBind,
  pSkipBindWechat,
} from '@/api/api'
export default {
  data () {
    return {
      title: this.fxCfg.login_title,
      id: '',
      identity: '',
      urlCode: '',
      example: '0',
      qrImgURL: '',
    }
  },
  computed: {
    isProfessor () {
      return this.$store.getters.isProfessor
    },
  },

  mounted () {
    if (this.isProfessor) {
      pBindWechatQrImg().then((res) => {
        console.log('pBindWechatQrImg...', res)
        this.qrImgURL = `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${res.ticket}`
        console.log('ttttiket', this.qrImgURL)
      }).catch((err) => {
        console.log(err)
      })
      this.checkBind(10)
    } else {
      let that = this
      that.func.getWechatCode('bQrcode', that.fxCfg.wx_bind_redirect_url)
      that.id = that.$route.query.id
      that.identity = sessionStorage.getItem('identity')
    }
  },

  /* 在此处监听路由变化 */
  watch: {
    '$route.query': function () {
      if (this.$route.query.code) {
        this.wechatBind()
      }
    },
  },

  methods: {
    checkBind (remains) {
      console.log('remains', remains)
      let that = this
      if (remains > 0) {
        pWechatIsBind().then((res) => {
          console.log('is_bind: ', res)
          if (res.is_bind) {
            this.$router.push({ path: '/professor' })
            return
          }
          that.checkBind(remains - 1)
        }).catch((err) => {
        })
      }
    },
    /* 微信登录 绑定 */
    wechatBind () {
      let that = this
      let type = that.identity
      that.urlCode = that.$route.query.code

      if (that.urlCode) {
        let para = { code: that.urlCode }
        switch (type) {
          case 'student':
            that.bindWeChatsS(that.id, para)
            break
          case 'manager':
            that.bindWeChatsM(that.id, para)
            break
          case 'professor':
            that.bindWeChatsP(that.id, para)
            break
        }
      } else {
        that.$message({
          message: '请重新扫码',
          type: 'error',
        })
      }
    },

    /* 绑定学生微信 */
    bindWeChatsS (id, code) {
      studentWe(id, code).then(res => {
        if (res) {
          this.$store.dispatch('setUserIdentity', 'student')
          this.$router.push({ path: '/student' })
        }
      }).catch(err => {
        console.log(err)
      })
    },

    /* 绑定学校微信 */
    bindWeChatsM (id, code) {
      managerWe(id, code).then(res => {
        if (res) {
          this.$store.dispatch('setUserIdentity', 'manager')
          this.$router.push({ path: '/index' })
        }
      }).catch(err => {
        console.log(err)
      })
    },

    /* 绑定专家微信 */
    bindWeChatsP (id, code) {
      professorWe(id, code).then(res => {
        if (res) {
          this.$store.dispatch('setUserIdentity', 'professor')
          this.$router.push({ path: '/professor' })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    skipBindWechat () {
      let that = this
      that.$confirm('跳过微信绑定，您将无法使用微信端相关功能（评议提醒、接受评阅、微信提款等）。但不影响通过手机验证码登录平台进行论文接受、评阅及银行卡提取费用等功能。是否确定跳过', '温馨提示', {
        type: 'warning',
      }).then(() => {
        pSkipBindWechat().then((res) => {
        }).catch((err) => {
          console.log('err', err)
          that.$message.error('请求失败')
        })
      })
    }
  },
}

</script>
