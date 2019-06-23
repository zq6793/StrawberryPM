<template>
  <section class="contractManage tab-title">
    <el-tabs type="card" @tab-click="handleClick" v-model="activeName">
      <el-tab-pane label="房态数据" name="first">
        <infovacant v-if="activeName=='first'" class="fx-pages-main"></infovacant>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
<script>
import infovacant from './Vacant.vue'
export default {
  data() {
    return {
      activeName: 'first',
    }
  },
  watch: {
    activeName() {
      this.clearRouteQuery()
    }
  },
  components: {
    infovacant,
  },
}
</script>
