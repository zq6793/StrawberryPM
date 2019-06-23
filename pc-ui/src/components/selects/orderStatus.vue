<template>
  <el-select v-model="seleted" placeholder="请选择账单状态">
    <el-option
      v-for="item in statusList"
      :key="item.key"
      :label="item.value"
      :value="item.key">
    </el-option>
  </el-select>
</template>

<script>

export default {
  data () {
    return {
      seleted: '',
      statusList: [
        { key: '', value: '请选择' },
        { key: 'LOCKED', value: '未出账' },
        { key: 'NORMAL', value: '可提取' },
      ],
    }
  },
  updated () {
    this.$emit('set', this.seleted)
  },
}
</script>
