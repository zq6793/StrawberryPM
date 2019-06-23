<template>
  <section class="all-box">
    <el-form :inline="true" class="fx-table-sort-head">
      <el-form-item size="small">
        <el-radio-group v-model="tabbyname" @change="tabChange">
          <el-radio-button label="门店"></el-radio-button>
          <el-radio-button label="房型"></el-radio-button>
          <el-radio-button label="房间"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="" size="small">
        <city-store-select :route-query="true" @set="refresh"></city-store-select>
      </el-form-item>
      <el-form-item label="" size="small">
        <date-interval-select :route-query="true" @set="refresh"></date-interval-select>
      </el-form-item>
      <el-form-item size="small">
        <el-button type="primary" @click="handleExports" size="small">批量导出</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="billFlows" @selection-change="selsChange" style="width: 100%;" v-loading="listLoading" border>
      <el-table-column prop="store_name" label="门店名称" width="190" align="center">
      </el-table-column>
      <el-table-column prop="room_count" label="总房间数" align="center">
      </el-table-column>
      <el-table-column prop="price_avg" label="表均价" align="center">
      </el-table-column>
      <el-table-column prop="rent_avg" label="成交均价" align="center">
      </el-table-column>
      <el-table-column prop="discount_rate" label="折扣率" align="center">
      </el-table-column>
      <el-table-column prop="rent_rate" label="平均出租率" align="center">
      </el-table-column>
      <el-table-column prop="sameday_rate" label="当天出租率" align="center">
      </el-table-column>
    </el-table>
    <pagination-select :route-query="true" :total="total" @set="refresh"></pagination-select>
    <!-- 查看信息 -->
  </section>
</template>
<script>
import { CityStoreSelect, PaginationSelect, DateIntervalSelect } from '@/components/selects'
import { operationStoreExcel, chartOperationStore } from '@/api/api'
export default {
  components: {
    CityStoreSelect,
    DateIntervalSelect,
    PaginationSelect,
  },
  data() {
    return {
      listLoading: false,
      billFlows: [],
      total: 0,
      startTime: '',
      endTime: '',
      tabbyname: '门店'
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    tabChange() {
      switch (this.tabbyname) {
        case '门店' :
          this.$emit('set', 'boss', 'store')
          break
        case '房型' :
          this.$emit('set', 'boss', 'roomtype')
          break
        case '房间' :
          this.$emit('set', 'boss', 'room')
          break
        default :
          this.$emit('set', 'boss', 'store')
          break
      }
    },
    refresh () {
      this.getBillflow()
    },
    getBillflow() {
      let that = this
      let para = this.queryOption()
      that.listLoading = true
      chartOperationStore(para).then(res => {
        that.billFlows = res.data.items
        that.billFlows.forEach((item) => {
          item.discount_rate = that.fxFilter.toPercentage(item.discount_rate)
          item.rent_rate = that.fxFilter.toPercentage(item.rent_rate)
          item.sameday_rate = that.fxFilter.toPercentage(item.sameday_rate)
          item.status = that.func.markTran(item.status)
        })
        that.total = res.data.count
        that.listLoading = false
      }).catch(function(err) {
        that.listLoading = false
      })
    },
    /* 批量导出 */
    handleExports () {
      let that = this
      let time = ''
      let para = this.queryOption()
      that.startTime = para.begin_time.substr(0, 10)
      that.endTime = para.end_time.substr(0, 10)
      time = that.startTime + '--' + that.endTime
      that.$confirm('确认导出选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        operationStoreExcel(para).then((res) => {
          let blob = new Blob([res.data ], { type: 'application/octet-stream;charset=utf-8' }) // 创建一个blob对象
          let a = document.createElement('a') // 创建一个<a></a>标签
          a.href = URL.createObjectURL(blob) // response is a blob
          a.download = time + '.xlsx' // 文件名称
          a.style.display = 'none'
          document.body.appendChild(a)
          a.click()
          a.remove()
          setTimeout(() => {
            that.isclick = false
          }, 1200)
          that.$message({
            message: '导出表成功',
            type: 'success',
          })
        })
      })
    },
  },
}

</script>
