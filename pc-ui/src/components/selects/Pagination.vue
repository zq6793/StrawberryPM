<template>
  <el-pagination
    layout="prev, pager, next"
    @current-change="handleCurrentChange"
    :page-size="10"
    :total="total"
    :current-page.sync="page">
  </el-pagination>
</template>
<script>

export default {
  props: {
    total: Number,
    routeQuery: Boolean,
  },
  data () {
    return {
      seleted: [],
      tree: [],
    }
  },
  computed: {
    page () {
      let rpage = this.$route.query.page
      if (!rpage) { return 1 }
      return parseInt(rpage)
    },
  },
  methods: {
    handleCurrentChange (pg) {
      if (this.routeQuery) {
        this.updateRouteQuery('page', pg)
      }
      this.$emit('set', pg)
    },
  },
}
</script>
