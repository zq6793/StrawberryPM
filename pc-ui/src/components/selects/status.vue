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
        { key: [ 'WAIT_RECEIVE', 'REVIEWING' ], value: '评阅中' },
        { key: [ 'PASSED', 'NO_PASS', 'REVIEWED' ], value: '已评阅' },
        { key: [ 'CONFLICT', 'CLOSED', 'TIMEOUT' ], value: '已关闭' },
      ],
    }
  },
  updated () {
    this.$emit('set', this.seleted)
  },
}
</script>
