<template>
  <el-select v-model="value" placeholder="支付状态" size="small" @change="change">
    <el-option v-for="item in list" :key="item.id" :label="item.label" :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
import { payStatusList } from '@/constent'
export default {
  data() {
    return {
      value: '',
      list: [
        {
          label: '支付状态',
          id: '',
        },
        ...payStatusList,
      ],
    }
  },
  methods: {
    change () {
      this.$emit('set', this.value)
    }
  },
}
</script>
