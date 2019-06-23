<template>
  <el-select v-model="value" placeholder="表记类型" size="small" @change="change">
    <el-option v-for="item in list" :key="item.id" :label="item.label" :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
import { waterTypeList } from '@/constent'
export default {
  props: {
    // value: String,
    routeQuery: Boolean,
    index: [String, Number],
  },
  data() {
    return {
      value: '',
      list: [
        {
          label: '表记类型',
          id: '',
        },
        ...waterTypeList,
      ],
    }
  },
  mounted() {
    if (this.routeQuery) {
      this.value = this.$route.query.type
    }
  },
  methods: {
    change () {
      if (this.routeQuery) {
        this.updateRouteQuery('page', 1)
        this.updateRouteQuery('type', this.value)
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

