<template>
  <section class="register">
    <div class="registerInfo">
      <div class="register-left">
        <div v-if="formover">
          <h1>公寓注册</h1>
          <el-form ref="form" label-width="80px" :inline="true">
            <el-form-item class="type">
              <el-select v-model="registerList.store_type" placeholder="请选择门店类型" size="small" @change="searchRent_type">
                <el-option v-for="item in typeList" :key="item.id" :label="item.value" :value="item.id" style="background: #fafafa; color: #000; border-radius: 0; border-bottom:1px solid #D8D8D8">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="margin-left:10px;" class="type">
              <el-input placeholder="房源数量（间）" v-model="registerList.scale"></el-input>
            </el-form-item>
            <br>
            <el-form-item>
              <el-input placeholder="联系姓名" v-model="registerList.contact_user"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input placeholder="联系电话" v-model="registerList.contact_phone"></el-input>
            </el-form-item>
            <el-form-item class="registercode">
              <input type="tel" placeholder="验证码" v-model="registerList.code" @keyup.enter="loginent" class="code">
              <span @click="getCode" v-show="sendAuthCode" class="codenum">{{repeatsend}}</span>
              <span v-show="!sendAuthCode" class="changenum"> {{ countdown }} s后重新发送</span>
            </el-form-item>
            <el-form-item class="registerbtn">
              <el-button type="info" @click="submit">注册</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-else class="codestyle">
          <h1>公寓注册</h1>
          <div id="qrcode"></div>
          <p>绑定微信可通过微信扫码登录公寓云管理系统和使用微信小程序处理公寓运营中的各项任务</p>
        </div>
      </div>

      <div class="register-right">
        <img src="../assets/img/bitmap.png" alt="">
        <p @click="login">已有梵响公寓云账号？立即登录>></p>
      </div>
    </div>
  </section>
</template>
<script>
import { sendCode, register, registerWechat } from '../api/api'
export default {
  data () {
    return {
      registerList: {
        store_type: '',
        scale: '',
        contact_user: '',
        contact_phone: '',
        code: '',
      },
      company_id: '',
      employee_id: '',
      repeatsend: '获取验证码',
      sendAuthCode: true,
      countdown: 0,
      typeList: [{
        id: '1',
        value: '请选择',
      },
      {
        id: 'centralizeds',
        value: '集中式',
      },
      {
        id: 'distributed',
        value: '分布式',
      },
      ],
      formover: true,
      code: '',
    }
  },
  watch: {
    '$route.query': function () {
      if (this.$route.path == '/register') {
        this.wechat()
      }
    },
  },
  mounted () {
    // this.scanrRrister();
  },
  updated () {
    if (!this.formover) {
      this.scan()
    }
  },
  methods: {
    // 扫码
    scan () {
      this.func.getWechatCode(this.fxCfg.wx_register_redirect_uri)
    },
    // 扫码后获取code
    wechat () {
      this.code = this.$route.query.code
      if (this.code) {
        this.scanrRrister()
      }
    },
    scanrRrister () {
      let that = this
      let id = that.employee_id
      let para = {
        code: that.code,
        company_id: that.company_id,
      }
      registerWechat(id, para).then((res) => {
        if (res) {
          that.$message.success('绑定微信成功')
          this.$router.push({ path: '/login' })
        }
      })
    },
    getCode () {
      let that = this
      let para = {
        phone: that.registerList.contact_phone,
      }
      sendCode(para).then((res) => {
        if (res === '') {
          that.$message.success('验证码已发送请注意查收')
          that.sendAuthCode = false
          that.countdown = 60
          let time = setInterval(() => {
            that.countdown--
            if (that.countdown <= 0) {
              that.sendAuthCode = true
              that.repeatsend = '重新发送'
              clearInterval(time)
            }
          }, 1000)
        }
      }).catch(function (err) {
        console.log(err)
      })
    },
    submit () {
      let that = this
      let para = Object.assign(that.registerList, {})
      register(para).then((res) => {
        if (res) {
          that.company_id = res.company_id
          that.employee_id = res.employee_id
          that.formover = false
        }
      })
    },
    // registerWechat
    // 跳转登录接口
    login () {
      this.$router.push({ path: '/login' })
    },
  },
}
</script>
