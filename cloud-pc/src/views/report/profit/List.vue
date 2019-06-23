<template>
  <section class="tab-title">
    <el-tabs type="card" v-model="activeName">
      <el-tab-pane label="汇总" name="summary">
        <template v-if="activeName=='summary'">
        <summarybystoreshow v-if="tabName=='storeshow'" class="fx-pages-main" @set="refresh"></summarybystoreshow>
        <summarybyroom v-else-if="tabName=='room'" class="fx-pages-main"  @set="refresh"></summarybyroom>
        <summarybystore v-else class="fx-pages-main" @set="refresh"></summarybystore>
        </template>
      </el-tab-pane>
      <el-tab-pane label="按费用项" name="type">
      <template v-if="activeName=='type'">
        <typebyroom v-if="tabName=='room'" class="fx-pages-main" @set="refresh"></typebyroom>
        <typebyperson v-else-if="tabName=='person'" class="fx-pages-main"  @set="refresh"></typebyperson>
        <typebystore v-else class="fx-pages-main" @set="refresh"></typebystore>
      </template>
      </el-tab-pane>
      <el-tab-pane label="按月度" name="month">
      <template v-if="activeName=='month'">
        <monthbyroom v-if="tabName=='room'" class="fx-pages-main" @set="refresh"></monthbyroom>
        <monthbyperson v-else-if="tabName=='person'" class="fx-pages-main"  @set="refresh"></monthbyperson>
        <monthbystore v-else class="fx-pages-main" @set="refresh"></monthbystore>
      </template>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
<script type="text/javascript">
import summarybystore from './all/store.vue'
import summarybystoreshow from './all/storeshow.vue'
import summarybyroom from './all/room.vue'
import typebystore from './type/store.vue'
import typebyroom from './type/room.vue'
import typebyperson from './type/person.vue'
import monthbystore from './month/store.vue'
import monthbyroom from './month/room.vue'
import monthbyperson from './month/person.vue'
export default {
  data() {
    return {
      activeName: 'summary',
      page: 1,
      tabName: 'store',
    }
  },
  components: {
    summarybystore,
    summarybystoreshow,
    summarybyroom,
    typebystore,
    typebyroom,
    typebyperson,
    monthbystore,
    monthbyroom,
    monthbyperson
  },
  created() {},
  mounted() {
    let routePaths = this.$route.path.split('/')
    this.activeName = routePaths[2]
    if (routePaths.length > 2) {
      this.tabName = routePaths[3]
    } else {
      switch (this.activeName) {
        case 'summary':
          this.tabName = 'store'
          break
        case 'type':
          this.tabName = 'store'
          break
        case 'month':
          this.tabName = 'store'
          break
      }
    }
  },
  watch: {
    activeName() {
      this.clearRouteQuery()
      this.$router.push({ path: `/profit/${this.activeName}` })
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
