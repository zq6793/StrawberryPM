<template>
  <el-select v-model="value" placeholder="来访类型" size="small" @change="change">
    <el-option v-for="item in list" :key="item.id" :label="item.label" :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
import { visitTypeList } from '@/constent'
export default {
  props: {
    routeQuery: Boolean,
    index: [String, Number],
  },
  data() {
    return {
      value: '',
      list: [
        {
          label: '来访类型',
          id: '',
        },
        ...visitTypeList,
      ],
    }
  },
  mounted () {
    if (this.routeQuery) {
      this.value = this.$route.query.visit_type
    }
  },
  methods: {
    change () {
      if (this.routeQuery) {
        this.updateRouteQuery('page', 1)
        this.updateRouteQuery('visit_type', this.value)
      }
      if (this.index || this.index === 0) {
        this.$emit('set', this.value, this.index)
      } else {
        this.$emit('set', this.value)
      }
    }
  },
}
</script>
