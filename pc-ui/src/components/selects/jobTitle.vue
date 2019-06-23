<template>
  <el-select v-model="seleted" placeholder="请选择职称">
    <el-option
      v-for="item in jobTitleList"
      :key="item.key"
      :label="item.value"
      :value="item.key">
    </el-option>
  </el-select>
</template>

<script>

export default {
  props: {
    value: String,
  },
  data () {
    return {
      seleted: '',
      jobTitleList: [
        { key: '', value: '请选择' },
        { key: '1', value: '硕导' },
        { key: '2', value: '博导' },
        { key: '3', value: '兼职硕导' },
        { key: '4', value: '兼职博导' },
        { key: '5', value: '其他' },
      ],
    }
  },
  watch: {
    value () {
      for (const item of this.jobTitleList) {
        if (item.key == this.value || item.value == this.value) {
          this.seleted = item.key
          return
        }
      }
    },
  },
  updated () {
    this.$emit('set', this.seleted)
  },
}
</script>
