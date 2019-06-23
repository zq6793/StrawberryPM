<template>
  <el-select v-model="value" placeholder="商品分类" size="small" @change="change">
    <el-option v-for="item in list" :key="item.id" :label="item.label" :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
import { getGoodsList } from '@/api/api'
export default {
  props: {
    // value: String,
    routeQuery: Boolean,
    index: [String, Number],
  },
  data() {
    return {
      value: '',
      list: [],
    }
  },
  mounted() {
    this.getClassifications()
    if (this.routeQuery) {
      this.value = this.$route.query.category_id
    }
  },
  methods: {
    change () {
      if (this.routeQuery) {
        this.updateRouteQuery('page', 1)
        this.updateRouteQuery('category_id', this.value)
      }
      if (this.index || this.index === 0) {
        this.$emit('set', this.value, this.index)
      } else {
        this.$emit('set', this.value)
      }
    },
    /* 获取商品分类 */
    getClassifications () {
      let that = this
      let para = {}
      getGoodsList(para).then(res => {
        let rescode = res.data.rescode
        let getData = res.data.data.list
        let resmsg = res.data.resmsg
        that.func.portInit(rescode, resmsg, function () {
          getData.unshift({
            id: '',
            name: '商品分类',
          })
          that.list = getData
          that.list.forEach((item) => {
            item.label = item.name
          })
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
  },
}
</script>
