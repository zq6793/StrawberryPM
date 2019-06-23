<template>
  <el-select v-model="value" placeholder="设备类型" size="small" @change="change">
    <el-option v-for="item in list" :key="item.id" :label="item.label" :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
import { deviceTypeList } from '@/constent'
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
          label: '设备类型',
          id: '',
        },
        ...deviceTypeList,
      ],
    }
  },
  mounted () {
    if (this.routeQuery) {
      this.value = this.$route.query.device_type
    }
  },
  methods: {
    change () {
      if (this.routeQuery) {
        this.updateRouteQuery('page', 1)
        this.updateRouteQuery('device_type', this.value)
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
