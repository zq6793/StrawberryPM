<template>
  <el-select v-model="seleted" placeholder="请选择提交状态">
    <el-option
      v-for="item in submitList"
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
      submitList: [
        { key: '', value: '请选择' },
        { key: 'COMMITED', value: '已提交' },
        { key: 'NO_UPLOAD', value: '未提交' },
      ],
    }
  },
  updated () {
    this.$emit('set', this.seleted)
  },
}
</script>
