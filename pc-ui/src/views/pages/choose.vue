<template>
  <el-row class="login-page">
    <el-col :span="12">
      <div class="herder">
        <div class="index-logoimg"><img src='./../../assets/img/logo1.png' /></div>
        </div>
        <div class="logo-container">
          <div class="identity">
            <el-button type="primary" @click="manager">学校端</el-button>
            <el-button type="primary" @click="expert">专家端</el-button>
          </div>
        </div>
        <div class="first" @click="showFirst" v-if="isShowFirst" style="font-size: 14px;cursor: pointer">
          首次登陆平台，点击进入>>>
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
import { chooseStation } from '@/api/api'
export default {
  data () {
    return {
      title: this.fxCfg.login_title,
      manager_id: '',
      professor_id: '',
    }
  },
  computed: {
    userName () {
      return this.$store.getters.name
    },
    userProfile () {
      return this.$store.getters.userProfile
    },
  },

  mounted () {
    this.manager_id = this.$route.query.manager_id
    this.professor_id = this.$route.query.professor_id
    console.log('namename', this.userName, this.userProfile)
  },

  methods: {
    /* 选择身份 */
    chooseIdentity (manager_id, professor_id, station) {
      let that = this
      let para = {
        manager_id: manager_id,
        professor_id: professor_id,
        station: station,
      }

      chooseStation(para).then((res) => {
        let resData = res.data
        sessionStorage.setItem('token', resData.token)
        if (resData.manager || resData.manager != null) {
          this.$store.dispatch('setUserIdentity', 'manager')
          sessionStorage.setItem('identity', 'manager')
          sessionStorage.setItem('id', resData.manager.ID)
          if (resData.need_wx === 'YES') {
            that.$router.push({ path: '/login/bindwechat', query: { id: resData.manager.ID } })
          } else {
            that.$router.push({ path: '/index' })
            sessionStorage.setItem('school_id', resData.manager.university_id)
          }
        }

        if (resData.professor || resData.professor != null) {
          this.$store.dispatch('setUserIdentity', 'professor')
          sessionStorage.setItem('identity', 'professor')
          sessionStorage.setItem('id', resData.professor.ID)
          if (resData.need_wx === 'YES') {
            that.$router.push({ path: '/login/bindwechat', query: { id: resData.professor.ID } })
          } else {
            that.$router.push({ path: '/professor' })
            sessionStorage.setItem('professor_id', resData.professor.ID)
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },

    /* 点击跳到学校端 */
    manager () {
      sessionStorage.setItem('identity', 'manager')
      this.chooseIdentity(parseInt(this.manager_id), parseInt(this.professor_id), 'MANAGER')
    },

    /* 点击跳到专家端 */
    expert () {
      sessionStorage.setItem('identity', 'professor')
      this.chooseIdentity(parseInt(this.manager_id), parseInt(this.professor_id), 'PROFESSOR')
    },
  },
}

</script>
