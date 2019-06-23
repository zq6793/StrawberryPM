<template>
  <section class="tab-title bill">
    <el-tabs type="card"  v-model="activeName">
      <el-tab-pane label="账单(租户)" name="renter">
        <template v-if="activeName=='renter'">
         <renterbill v-if="tabName=='bill'" class="fx-pages-main" @set="refresh"></renterbill>
          <renterbills v-else class="fx-pages-main" @set="refresh"></renterbills>
        </template>
      </el-tab-pane>
  <!--     <el-tab-pane label="账单(业主)" name="landlord" style="display: none;">
        <template v-if="activeName=='landlord'">
        <landlordbill v-if="tabName=='bill'" class="fx-pages-main" @set="refresh"></landlordbill>
        <landlordbills v-else class="fx-pages-main" @set="refresh"></landlordbills>
        </template>
      </el-tab-pane>
      <el-tab-pane label="账单(其它)" name="other" style="display: none;">
        <template v-if="activeName=='other'">
         <otherbill v-if="tabName=='bill'" class="fx-pages-main" @set="refresh"></otherbill>
         <otherbills v-else class="fx-pages-main" @set="refresh"></otherbills>
        </template>
      </el-tab-pane> -->
    </el-tabs>
  </section>
</template>
<script type="text/javascript">
import renterbills from './renter/bills.vue'
import renterbill from './renter/bill.vue'
// import landlordbills from './landlord/bills.vue'
// import landlordbill from './landlord/bill.vue'
// import otherbills from './other/bills.vue'
// import otherbill from './other/bill.vue'

export default {
  data () {
    return {
      activeName: 'renter',
      page: 1,
      tabName: 'bills',
    }
  },
  components: {
    renterbills,
    renterbill,
    // landlordbills,
    // landlordbill,
    // otherbills,
    // otherbill,
  },
  created () {
  },
  mounted() {
    let routePaths = this.$route.path.split('/')
    this.activeName = routePaths[2]
    if (routePaths.length > 2) {
      this.tabName = routePaths[3]
    } else {
      switch (this.activeName) {
        case 'renter':
          this.tabName = 'bills'
          break
        case 'landlord':
          this.tabName = 'bills'
          break
        case 'other':
          this.tabName = 'bills'
          break
      }
    }
  },
  watch: {
    activeName() {
      this.clearRouteQuery()
      this.$router.push({ path: `/bill/${this.activeName}` })
    }
  },
  methods: {
    refresh(activeName, tabName) {
      this.activeName = activeName
      this.tabName = tabName
    }
  },
}
</script>
