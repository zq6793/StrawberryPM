<template>
  <div class="head-navbar-item head-navbar-user">
  <el-dropdown trigger="hover" class="" show-timeout='0' hide-timeout='500'>
    <span class="el-dropdown-link">
      <img :src="userInfo.avatar" style="width:20px;margin: 14px 5px;border-radius:10px; " />
      <span>{{ userInfo.name }}</span>
    </span>
    <el-dropdown-menu slot="dropdown">
      <!-- <el-dropdown-item @click.native="logout">账户设置</el-dropdown-item> -->
      <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</div>
</template>
<script>
import { getName } from '@/api/api'
export default {
  data () {
    return {
      sysUserAvatar: '',
      userInfo: '',
    }
  },
  mounted () {
    this.getName()
  },
  methods: {
    getName () {
      getName({}).then((res) => {
        this.userInfo = res.data.employee
        // console.log(this.userInfo)
      })
    },
    // 退出登录
    logout () {
      let _this = this
      this.$confirm('确认退出吗?', '提示', {}).then(() => {
        sessionStorage.removeItem('user')
        _this.$router.push('/login')
      }).catch(() => {

      })
    },
  },
}
</script>
