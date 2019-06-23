<template>
  <el-select v-model="value" placeholder="处理情况" size="small" @change="change">
    <el-option v-for="item in list" :key="item.id" :label="item.label" :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
import { serviceStatusList } from '@/constent'
export default {
  props: {
    // value: String,
    index: [String, Number],
  },
  data() {
    return {
      value: '',
      list: [
        {
          label: '处理情况',
          id: '',
        },
        ...serviceStatusList,
      ],
    }
  },
  methods: {
    change () {
      if (this.index || this.index === 0) {
        this.$emit('set', this.value, this.index)
      } else {
        this.$emit('set', this.value)
      }
    }
  },
}
</script>
