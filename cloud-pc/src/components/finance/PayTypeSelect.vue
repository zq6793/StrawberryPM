<template>
  <el-select v-model="value" placeholder="请选择" size="small" @change="change">
    <el-option v-for="item in list" :key="item.id" :label="item.label" :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
export default {
  data() {
    return {
      value: '',
      list: [
        {
          id: '',
          label: '请选择',
        },
        {
          id: 'CHECKOUT',
          label: '退房',
        },
        {
          id: 'PRICE',
          label: '调价',
        },
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
