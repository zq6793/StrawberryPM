<template>
  <el-select v-model="value" placeholder="审批状态" size="small" @change="change">
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
          value: '审批状态',
        },
        {
          id: 'AUDIT',
          value: '审批流程中',
        },
        {
          id: 'APPROVED',
          value: '审批已完成',
        },
        {
          id: 'CLOSED',
          value: '审批已终止',
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
