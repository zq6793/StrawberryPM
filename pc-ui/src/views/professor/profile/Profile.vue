<template>
  <el-tabs v-model="activeTab" type="border" @tab-click="handleClick">
    <el-tab-pane label="个人信息" name="first">
      <base-info :profile="info"></base-info>
    </el-tab-pane>
    <el-tab-pane label="专业信息" name="second">
      <subject-info :profile="info"></subject-info>
    </el-tab-pane>
    <el-tab-pane label="账户信息" name="third">
      <account-info :profile="info"></account-info>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { managerProfile } from '@/api/api'
import accountInfo from './accountInfo'
import subjectInfo from './subjectInfo'
import baseInfo from './baseInfo'
export default {
  components: {
    accountInfo,
    subjectInfo,
    baseInfo,
  },
  data() {
    return {
      activeTab: 'first',
      info: {},
    }
  },
  mounted() {
    if (this.$route.query.active_tab) {
      this.activeTab = this.$route.query.active_tab
    }
    this.getProfile()
  },
  methods: {
    getProfile () {
      let that = this
      managerProfile().then((res) => {
        if (res.bank_card_account == '') {
          res.bank_card_account = res.name
        }
        that.info = res
      }).catch((err) => {
        that.$message({
          type: 'error',
          message: '获取信息失败',
        })
      })
    },
  },
}
</script>
