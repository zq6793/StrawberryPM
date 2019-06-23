<template>
  <el-select v-model="seleted" placeholder="请选择类型">
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
        { key: 'PASSED', value: '通过' },
        { key: 'NO_PASS', value: '不通过' },
      ],
    }
  },
  updated () {
    this.$emit('set', this.seleted)
  },
}
</script>
