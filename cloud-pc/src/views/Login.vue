<template>
    <el-row class="login-page">
      <el-col :span="12">
        <el-header class="header">
          <div class="index-logoimg"><img src='../assets/img/caomei_logo.png' /></div>
        </el-header>
        <div class="login-container">
          <el-tabs class="login-content">
            <el-tab-pane label="微信登录">
              <div id="qrcode"></div>
            </el-tab-pane>
            <el-tab-pane label="手机登录">
              <form action="" class="phone">
              <el-input type="tel" placeholder="请输入手机号" v-model="number" autocomplete="off"></el-input>
              <el-input type="tel" placeholder="验证码" v-model="validateCode" @keyup.enter="loginent"></el-input>
              <span class="code" @click="getCode()" v-show="sendAuthCode" style="color:#00a69b">{{repeatsend}}</span>
              <span class="code" v-show="!sendAuthCode"> {{ countdown }} s后重新发送</span>
              <el-button type="primary" @click="submit" class="button">登录</el-button>
              </form>
            </el-tab-pane>
          </el-tabs>
        </div>
        <el-footer>
        粤ICP备16020717号-2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a href="https://www.funxdata.com/">Power by FunXdata</a>
      </el-footer>
      </el-col>
        <el-col :span="12" class="login-ads">
        <div class="login-img"><img src="../assets/img/login.png"></div>
        <div class="text">
          <h1>{{title}}</h1>
        </div>
        </el-col>
    </el-row>
</template>
<script>
import { getCode, pLogin, vLogin } from '../api/api'
export default {
  data () {
    return {
      title: this.fxCfg.login_title,
      logoMessage: this.fxCfg.logo_title,
      number: '', // 输入的电话号码
      validateCode: '', // 输入的验证码
      countdown: 0, // 计时器的初始值
      sendAuthCode: true,
      repeatsend: '获取验证码',
      urlCode: '',
    }
  },

  mounted () {
    this.func.getWechatCode(this.fxCfg.wx_login_redirect_uri)
  },
  // 在此处监听路由变化
  watch: {
    '$route.query': function () {
      if (this.$route.path == '/login') {
        this.wechat()
      }
    },
  },
  methods: {
    wechat () {
      this.urlCode = this.$route.query.code
      if (this.urlCode) {
        this.login()
      }
    },
    /* 微信登录 */
    login () {
      let that = this
      let para = {
        code: that.urlCode,
      }
      vLogin(para).then(res => {
        if (res) {
          let employeeInfo = {
            employee_id: res.ID,
            company_id: res.company_id,
          }
          sessionStorage.setItem('token', res.token)
          sessionStorage.setItem('info', JSON.stringify(employeeInfo))
          that.$router.push({ path: '/dataanalysis' })
        }
      }).catch(function (err) {
        console.log(err)
      })
    },
    /* 获取验证码 */
    getCode () {
      let that = this
      let para = {
        type: 'phone',
        phone: that.number,
      }
      if (that.number === '') {
        that.$message({
          message: '请输入手机号',
          type: 'warning',
        })
      } else {
        getCode(para).then((res) => {
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
        }).catch(function (err) {
          console.log(err)
        })
      }
    },
    /* 点击登录 */
    submit () {
      let that = this
      if (that.number === '') {
        that.$message.error('请输入电话号码')
      } else if (that.validateCode === '') {
        that.$message.error('请获取验证码')
      } else {
        let para = {
          phone: that.number,
          code: that.validateCode,
        }
        pLogin(para).then((res) => {
          if (res) {
            let employeeInfo = {
              employee_id: res.ID,
              company_id: res.company_id,
            }
            sessionStorage.setItem('token', res.token)
            sessionStorage.setItem('info', JSON.stringify(employeeInfo))
            that.$router.push({ path: '/dataanalysis' })
          }
        }).catch(function (err) {
          console.log(err)
        })
      }
    },
    loginent () {
      this.submit()
    },
  },
}
</script>
