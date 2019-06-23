<template>
<el-row class="login-page">
  <el-col :span="12">
        <div class="herder">
                <div class="index-logoimg"><img src='./../../assets/img/logo1.png' /></div>
            </div>
            <div class="logo-container">
            <el-tabs type="border-card" class="login-content">
        <el-tab-pane label="邮箱登录">
           <form class="phone">
                    <input type="tel" placeholder="请输入邮箱" v-model="number" autocomplete="off">
                    <input type="tel" placeholder="验证码" v-model="validateCode" @keyup.enter="loginent">
                    <span class="code" @click="getCode()" v-show="sendAuthCode" style="color:#00a69b">{{repeatsend}}</span>
                    <span class="code" v-show="!sendAuthCode"> {{ countdown }} s后重新发送</span>
                    <el-button type="primary" @click="submit" class="button">登录</el-button>
                </form>
                </el-tab-pane>
            </el-tabs>
            </div>
            <div class="first" @click="showFirst" v-if="isShowFirst" style="font-size: 14px;cursor: pointer">首次登陆平台，点击进入>>></div>
            <!-- <div class="first" @click="mailbox" v-else="!isShowFirst">邮箱登录>>></div> -->
            <footer>Copyright  2018 汇文数据 版权所有 陕ICP备19001216号</footer>
  </el-col>
  <el-col :span="12">
    <div class="login-img">
        <img src="/static/imgs/login_bg.jpg">
    </div>
  </el-col>
</el-row>


</template>

<script>
import { getCode } from '@/api/api'
export default {
  data () {
    return {
      title: this.fxCfg.login_title,
      sub_titles: this.fxCfg.sub_titles,
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
    }
  },

  mounted () {
  },


  methods: {
    /* 获取验证码 */
    getCode () {
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

    /* 登录 */
    submit () {

    },
  },
}
</script>
