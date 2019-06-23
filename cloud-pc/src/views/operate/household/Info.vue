<template>
  <section class="tab-title household-info">
   <el-tabs @tab-click="handleClick" type="card" v-model="activeName">
      <el-tab-pane label="住户信息" name="first">
        <infoperson ref="oneflow" class="fx-pages-main"></infoperson>
      </el-tab-pane>
      <el-tab-pane label="合同信息" name="second">
        <infocontrat ref="twoflow" class="fx-pages-main"></infocontrat>
      </el-tab-pane>
      <el-tab-pane label="账单信息" name="third">
        <infobill ref="thrflow" class="fx-pages-main"></infobill>
      </el-tab-pane>
      <el-tab-pane label="优惠券信息" name="fourth">
        <infocoupon ref="fourflow" class="fx-pages-main"></infocoupon>
      </el-tab-pane>
      <el-tab-pane label="设备信息" name="fiveth">
        <infodevice ref="fiveflow" class="fx-pages-main"></infodevice>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
<script>
import infoperson from './householdInfoperson.vue'
import infocontrat from './householdInfocontrat.vue'
import infobill from './householdInfobill.vue'
import infocoupon from './householdInfocoupon.vue'
import infodevice from './householdInfodevice.vue'
export default {
  data () {
    return {
      activeName: 'first',
      page: 1,
    }
  },
  components: {
    infoperson,
    infocontrat,
    infobill,
    infocoupon,
    infodevice
  },
  created () {
    if (sessionStorage.getItem('active')) {
      this.activeName = sessionStorage.getItem('active').replace(/\"/g, '')
    }
  },
  mounted () {},

  methods: {
    handleClick () {
      if (this.activeName == 'second') {
        this.$refs.twoflow.page = 1
      } else if (this.activeName == 'third') {
        this.$refs.thrflow.page = 1
      } else if (this.activeName == 'fourth') {
        this.$refs.fourflow.page = 1
      } else if (this.activeName == 'fiveth') {
        this.$refs.fiveflow.page = 1
      } else {
        this.$refs.oneflow.page = 1
      }
    },
  },
}
</script>
