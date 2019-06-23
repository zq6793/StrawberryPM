<template>
  <el-select v-model="seleted" placeholder="请选择类型">
    <el-option
      v-for="item in degreeTypeList"
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
      degreeTypeList: [
        { key: '', value: '请选择' },
        { key: '1', value: '专业学位硕士' },
        { key: '2', value: '学术型硕士' },
        { key: '3', value: '专业学位博士' },
        { key: '4', value: '学术型博士' },
        { key: '5', value: '公费师范硕士' },
        { key: '6', value: '同等学力硕士' },
        { key: '7', value: '留学生硕士' },
        { key: '8', value: '联考教育硕士' },
        { key: '9', value: '教育硕士' },
      ],
    }
  },
  updated () {
    this.$emit('set', this.seleted)
  },
}
</script>
