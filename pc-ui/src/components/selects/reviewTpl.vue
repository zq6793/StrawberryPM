<template>
  <el-select v-model="id" placeholder="请选择模板" @change="changed">
    <el-option
      v-for="item in list"
      :key="item.ID"
      :label="item.name"
      :value="item.ID">
    </el-option>
  </el-select>
</template>

<script>
import { listReviewTemplate } from '@/api/api'

export default {
  data () {
    return {
      list: [],
      id: '',
    }
  },
  mounted () {
    this.listAllReviewTpls()
  },
  methods: {
    listAllReviewTpls () {
      let that = this

      listReviewTemplate().then(res => {
        that.list = res.items
      }).catch(err => {
        console.log(err)
      })
    },
    changed () {
      this.$emit('set', this.id)
    },
  },
}
</script>
