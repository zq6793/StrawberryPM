<template>
  <el-select v-model="value" placeholder="支付方式" size="small" @change="change">
    <el-option v-for="item in list" :key="item.id" :label="item.label" :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
import { payWayList } from '@/constent'
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
          label: '支付方式',
          id: '',
        },
        ...payWayList,
      ],
    }
  },
  mounted () {
    if (this.routeQuery) {
      this.value = this.$route.query.pay_way
    }
  },
  methods: {
    change () {
      if (this.routeQuery) {
        this.updateRouteQuery('page', 1)
        this.updateRouteQuery('pay_way', this.value)
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
