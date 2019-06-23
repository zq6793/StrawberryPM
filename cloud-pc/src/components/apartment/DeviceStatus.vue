<template>
  <el-select v-model="value" placeholder="设备状态" size="small" @change="change">
    <el-option v-for="item in list" :key="item.id" :label="item.label" :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
import { deviceSatusList } from '@/constent'
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
          label: '设备状态',
          id: '',
        },
        ...deviceSatusList,
      ],
    }
  },
  mounted () {
    if (this.routeQuery) {
      this.value = this.$route.query.order_status
    }
  },
  methods: {
    change () {
      if (this.routeQuery) {
        this.updateRouteQuery('page', 1)
        this.updateRouteQuery('order_status', this.value)
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
