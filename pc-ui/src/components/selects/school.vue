<template>
  <el-select
    filterable
    remote
    reserve-keyword
    placeholder="请选择学校"
    :remote-method="searchSchool"
    :disabled="disabled"
    v-model="id"
    @change="change">
    <el-option v-for="item in list" :key="item.ID" :label="item.name" :value="item.ID">
    </el-option>
  </el-select>
</template>
<script>
import { searchSchool, getSchool } from '@/api/api'
export default {
  props: {
    u_id: Number,
    disabled: Boolean,
  },
  data() {
    return {
      list: [],
      id: 0,
    }
  },
  mounted() {
    this.searchSchool()
    if (this.u_id && this.u_id > 0) {
      this.id = this.u_id
      this.getSchool(this.id)
    }
  },
  watch: {
    u_id () {
      if (this.u_id > 0) {
        this.id = this.u_id
        this.getSchool(this.u_id)
      }
    }
  },
  methods: {
    change () {
      this.$emit('set', this.id)
    },
    getSchool(id) {
      let that = this
      getSchool(id).then(res => {
        that.list.push(res)
        that.id = id
      }).catch(err => {
        console.log(err)
      })
    },
    searchSchool(queryString, force) {
      if (queryString == '' && !force) {
        this.list = []
        return
      }
      let that = this
      let para = {
        name: queryString,
        limit: 8,
      }

      searchSchool(para).then(res => {
        that.list = res
      }).catch(err => {
        console.log(err)
      })
    },
  },
}
</script>
