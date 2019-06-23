<template>
  <el-select v-model="seleted" placeholder="请选择评议类型">
    <el-option
      v-for="item in options"
      :key="item.key"
      :label="item.value"
      :value="item.key">
    </el-option>
  </el-select>
</template>

<script>

export default {
  props: {
    value: String,
    routeQuery: Boolean,
  },
  data () {
    return {
      seleted: '',
      options: [
        { key: '', value: '请选择' },
        { key: 'DEGREE', value: '学位论文' },
        { key: 'FUND', value: '科研项目申请' },
        { key: 'TUTOR', value: '资格申请' },
      ],
    }
  },
  mounted() {
    if (this.value) {
      this.seleted = this.value
    } else if (this.routeQuery) {
      this.seleted = this.$route.query.paper_type
    }
  },
  watch: {
    value () {
      for (const item of this.options) {
        if (item.key == this.value || item.value == this.value) {
          this.seleted = item.key
          return
        }
      }
    },
  },
  updated () {
    if (this.routeQuery) {
      this.updateRouteQuery('paper_type', this.seleted)
    }
    this.$emit('set', this.seleted)
  },
}
</script>
