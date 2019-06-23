<template>
  <el-row class="login-page">
    <el-col :span="12">
      <div class="herder">
        <div class="index-logoimg"><img src='./../../assets/img/logo1.png' /></div>
      </div>
      <div class="logo-container">
        <el-tabs type="border-card" class="login-content" v-model="loginType">
          <el-tab-pane label="手机登录" name="phone">
            <form class="phone">
              <input type="tel" placeholder="请输入手机号" v-model="number" autocomplete="off">
              <input type="tel" placeholder="验证码" v-model="validateCode" @keyup.enter="loginent">
              <span class="code" @click="getCode" v-show="sendAuthCode">{{repeatsend}}</span>
              <span class="code" v-show="!sendAuthCode"> {{ countdown }} s后重新发送</span>
              <el-button type="primary" @click="submit" class="button">登录</el-button>
            </form>
          </el-tab-pane>
          <el-tab-pane label="微信登录" name="qrcode">
            <div id="qrcode"></div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="first" v-if="!isShowFirst"><span>首次登陆平台，请先通过邀请邮件进入使用手机登录</span></div>
      <div class="first" @click="showFirst" v-if="isShowFirst">首次登陆平台，点击进入>>></div>
      <!-- <div class="first" @click="mailbox" v-else="!isShowFirst">邮箱登录>>></div> -->
      <footer>Copyright 2018 汇文数据 版权所有 陕ICP备19001216号</footer>
    </el-col>
    <el-col :span="12">
      <div class="login-img">
        <img src="/static/imgs/login_bg.jpg">
        <invite-info></invite-info>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import InviteInfo from '@/components/common/InviteInfo'
import { loginPhone, getCode, loginWx } from '@/api/api'
export default {
  components: {
    InviteInfo,
  },
  data() {
    return {
      title: this.fxCfg.login_title,
      sub_titles: this.fxCfg.global.sub_titles,
      type: this.fxCfg.entra,
      manager_id: '',
      professor_id: '',
      student_id: '',
      number: '', // 输入的电话号码
      validateCode: '', // 输入的验证码
      countdown: 0, // 计时器的初始值
      sendAuthCode: true,
      repeatsend: '获取验证码',
      urlCode: '',
      isShowFirst: false,
      loginType: 'phone',
      invitationToken: '',
    }
  },
  computed: {
    wcCode() {
      return this.$route.query.code
    },
  },

  mounted() {
    if (this.$route.query.login_type == 'phone') {
      this.loginType = 'phone'
    }
    if (this.$route.query.token) {
      this.invitationToken = this.$route.query.token
    }
    let that = this
    if (that.type === 'student') {
      that.isShowFirst = true
    } else {
      that.isShowFirst = false
    }
    that.func.getWechatCode('qrcode', that.fxCfg.wx_login_redirect_url)
  },

  /* 在此处监听路由变化 */
  watch: {
    'wcCode': function() {
      if (this.wcCode) {
        this.wechatLogin()
      }
    },
  },

  methods: {
    /* 微信登录 扫码 */
    wechatLogin() {
      let that = this
      that.urlCode = that.$route.query.code

      if (that.urlCode) {
        let para = { code: that.urlCode }

        loginWx(para).then(res => {
          that.resolveLogin(res)
        }).catch(function(err) {
          console.log(err)
        })
      } else {
        that.$message({
          message: '请重新扫码',
          type: 'error',
        })
      }
    },

    /* 获取验证码 */
    getCode() {
      let that = this
      let para = { phone: that.number }

      if (!that.number) {
        that.$message({
          message: '请输入手机号',
          type: 'warning',
        })
      } else {
        getCode(para).then(res => {
          if (res === '') {
            that.$message.success('验证码已发送请注意查收')
            that.sendAuthCode = false
            that.countdown = 60
            let time = setInterval(() => {
              that.countdown--
              if (that.countdown <= 0) {
                that.sendAuthCode = true
                that.repeatsend = '重发'
                clearInterval(time)
              }
            }, 1000)
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },

    /* 首次登陆 */
    showFirst() {
      let that = this
      that.$router.push({ path: '/login/first' })
    },

    /* 点击登录 */
    submit() {
      let that = this
      if (!that.number) {
        that.$message({
          message: '请输入手机号',
          type: 'warning',
        })
        return
      }
      if (!that.validateCode) {
        that.$message({
          message: '请获取验证码',
          type: 'warning',
        })
        return
      }

      let para = {
        phone: that.number,
        code: that.validateCode,
        invitation_token: that.invitationToken,
      }

      loginPhone(para).then((res) => {
        that.resolveLogin(res)
      }).catch(err => {
        console.log(err)
      })
    },

    // 处理登录返回
    resolveLogin(res) {
      let that = this
      let need_wx = res.need_wx
      let gotoR = {}

      this.$store.dispatch('setUserProfile', res)

      // 学生登录、
      if (res.student || res.student != null) {
        this.$store.dispatch('setUserIdentity', 'student')
        if (need_wx === 'YES') {
          gotoR = { path: '/login/bindwechat', query: { id: res.student.ID } }
        } else {
          gotoR = { path: '/student', query: { id: res.student.ID } }
        }
        that.$router.push(gotoR)
        return
      }

      // 需要选择登录角色
      if (res.need_choose === 'YES') {
        gotoR = {
          path: '/login/choose',
          query: {
            manager_id: res.manager.ID,
            professor_id: res.professor.ID,
          },
        }
        that.$router.push(gotoR)
        return
      }

      // 学校管理员
      if (res.manager || res.ststion != null) {
        this.$store.dispatch('setUserIdentity', 'manager')
        if (need_wx === 'YES') {
          gotoR = { path: '/login/bindwechat', query: { id: res.manager.ID } }
        } else {
          gotoR = { path: '/index' }
        }
        that.$router.push(gotoR)
        return
      }

      // 论文评阅专家
      if (res.professor || res.professor != null) {
        this.$store.dispatch('setUserIdentity', 'professor')
        if (need_wx === 'YES') {
          gotoR = { path: '/login/bindwechat', query: { id: res.professor.ID } }
        } else {
          gotoR = { path: '/professor' }
        }
        that.$router.push(gotoR)
      }
    },

    loginent() {
      this.submit()
    },

    /* 邮箱登录 */
    mailbox() {
      this.$router.push({ path: '/mailbox' })
    },
  },
}
</script>
<style lang="scss" scoped>
.code {
  color: #173e6e;
}
</style>
