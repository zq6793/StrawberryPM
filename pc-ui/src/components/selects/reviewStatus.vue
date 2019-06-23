<template>
  <el-select v-model="seleted" placeholder="请选择状态">
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
        { key: 'WAIT_RECEIVE', value: '待接收' },
        { key: 'CONFLICT', value: '无法接受' },
        { key: 'TIMEOUT', value: '已过期' },
        { key: 'REVIEWING', value: '评阅中' },
        { key: 'REVIEWED', value: '已提交' },
        { key: 'REJECT', value: '已拒收' },
      ],
    }
  },
  mounted() {
    if (this.value) {
      this.seleted = this.value
    } else if (this.routeQuery) {
      this.seleted = this.$route.query.review_status
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
      this.updateRouteQuery('review_status', this.seleted)
    }
    this.$emit('set', this.seleted)
  },
}
</script>
