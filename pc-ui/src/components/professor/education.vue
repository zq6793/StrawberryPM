<template>
  <div>
    <el-col :span="3">
      <el-select v-model="seleted" placeholder="请选择学历">
        <el-option
          v-for="item in jobTitleList"
          :key="item.key"
          :label="item.value"
          :value="item.key">
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="5">
      <el-input v-model="other" v-if="showInput" placeholder="请填写学历"></el-input>
    </el-col>
  </div>
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
        { key: '硕士', value: '硕士' },
        { key: '博士', value: '博士' },
        { key: '5', value: '其他' },
      ],
      other: '',
    }
  },
  computed: {
    showInput () {
      return this.seleted == '5'
    },
  },
  watch: {
    value () {
      for (const item of this.jobTitleList) {
        if (item.key == this.value || item.value == this.value) {
          this.seleted = item.key
          return
        }
      }
      if (this.value) {
        this.seleted = '5'
        this.other = this.value
      }
    },
  },
  updated () {
    if (this.showInput) {
      this.$emit('set', this.other)
    } else {
      this.$emit('set', this.seleted)
    }
  },
}
</script>
