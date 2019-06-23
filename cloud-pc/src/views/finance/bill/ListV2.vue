<template>
  <section class="tab-title">
    <el-tabs type="card" v-model="activeName">
      <el-tab-pane label="按确认支付时间" name="date">
        <template v-if="activeName=='date'">
          <runningbytimeall v-if="tabName=='all'" class="fx-pages-main"  @set="refresh">
          </runningbytimeall>
          <runningbytimeone v-else class="fx-pages-main"  @set="refresh">
          </runningbytimeone>
        </template>
      </el-tab-pane>
      <el-tab-pane label="按费用项" name="fees">
      <template v-if="activeName=='fees'">
        <runningbycoststore v-if="tabName=='store'" class="fx-pages-main" @set="refresh"></runningbycoststore>
        <runningbycostroom v-else-if="tabName=='room'" class="fx-pages-main" @set="refresh">
        </runningbycostroom>
        <runningbycostperson v-else-if="tabName=='person'" class="fx-pages-main" @set="refresh">
        </runningbycostperson>
        <runningbycost v-else class="fx-pages-main" @set="refresh">
        </runningbycost>
      </template>
      </el-tab-pane>
      <el-tab-pane label="按月度" name="month">
      <template v-if="activeName=='month'">
        <runningbymonthroom v-if="tabName=='room'" class="fx-pages-main" @set="refresh"></runningbymonthroom>
        <runningbymonthstore v-else class="fx-pages-main" @set="refresh"></runningbymonthstore>
      </template>
      </el-tab-pane>
      <el-tab-pane label="按渠道" name="payway">
        <template v-if="activeName=='payway'">
        <runningbywayday v-if="tabName=='day'" class="fx-pages-main" @set="refresh"></runningbywayday>
        <runningbywaymonth v-else class="fx-pages-main" @set="refresh">
        </runningbywaymonth>
        </template>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
<script type="text/javascript">
import runningbytimeall from './runningbytime/all.vue'
import runningbytimeone from './runningbytime/one.vue'
import runningbycoststore from './runningbycost/onebystore.vue'
import runningbycostroom from './runningbycost/onebyroom.vue'
import runningbycostperson from './runningbycost/onebyperson.vue'
import runningbycost from './runningbycost/all.vue'
import runningbymonthstore from './runningbymonth/store.vue'
import runningbymonthroom from './runningbymonth/room.vue'
import runningbywaymonth from './runningbyway/month.vue'
import runningbywayday from './runningbyway/day.vue'
export default {
  data() {
    return {
      activeName: 'date',
      page: 1,
      tabName: 'all',
    }
  },
  components: {
    runningbytimeall,
    runningbytimeone,
    runningbycoststore,
    runningbycostroom,
    runningbycostperson,
    runningbycost,
    runningbymonthstore,
    runningbymonthroom,
    runningbywaymonth,
    runningbywayday
  },
  created() {},
  mounted() {
    let routePaths = this.$route.path.split('/')
    this.activeName = routePaths[2]
    if (routePaths.length > 3) {
      this.tabName = routePaths[3]
    } else {
      switch (this.activeName) {
        case 'date':
          this.tabName = 'all'
          break
        case 'fees':
          this.tabName = 'all'
          break
        case 'month':
          this.tabName = 'store'
          break
        case 'payway':
          this.tabName = 'month'
          break
      }
    }
  },
  watch: {
    activeName() {
      this.clearRouteQuery()
      this.$router.push({ path: `/running/${this.activeName}` })
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
