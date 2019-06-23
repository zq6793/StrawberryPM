<template>
  <el-select v-model="value" placeholder="请选择" size="small" @change="change">
    <el-option v-for="item in list" :key="item.id" :label="item.value" :value="item.id">
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
          value: '审批类目',
        },
        {
          id: 'CHECKOUT',
          value: '退房',
        },
        {
          id: 'PRICE',
          value: '调价',
        },
        {
          id: 'RESERVE',
          value: '预约看房',
        },
        {
          id: 'SERVICE',
          value: '服务订单',
        },
        {
          id: 'TRANSFORM',
          value: '转租审批',
        },
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
