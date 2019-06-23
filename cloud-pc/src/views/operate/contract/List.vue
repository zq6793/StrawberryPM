<template>
  <section class="contractManage tab-title">
    <el-tabs type="card" v-model="activeName">
      <el-tab-pane label="入住" name="first">
        <infocheckin v-if="activeName=='first'" class="fx-pages-main"></infocheckin>
      </el-tab-pane>
      <el-tab-pane label="预定" name="second">
        <infobooking v-if="activeName=='second'" class="fx-pages-main"></infobooking>
      </el-tab-pane>
      <el-tab-pane label="补充协议" name="third">
        <infosupple v-if="activeName=='third'" class="fx-pages-main"></infosupple>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
<script>
import infocheckin from './Checkin.vue'
import infobooking from './Booking.vue'
import infosupple from './supplement.vue'
export default {
  data() {
    return {
      activeName: 'first',
      page: 1,
    }
  },
  watch: {
    activeName() {
      this.clearRouteQuery()
    }
  },
  components: {
    infocheckin,
    infobooking,
    infosupple,
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
        // this.$refs.twoflow.page = 1
      } else if (this.activeName == 'third') {
        // this.$refs.thrflow.page = 1
      } else {
        // this.$refs.oneflow.page = 1
      }
    },
  },
}

</script>
