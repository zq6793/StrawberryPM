<template>
  <section class="all-box">
    <el-form :inline="true" class="fx-table-sort-head">
      <el-form-item label="" size="small">
      <el-radio-group v-model="tabbyname" @change="tabChange">
          <el-radio-button label="按月"></el-radio-button>
          <el-radio-button label="按天"></el-radio-button>
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
      <el-table-column prop="store_name" label="门店名称" align="center">
      </el-table-column>
      <el-table-column prop="day" label="周期" align="center">
      </el-table-column>
      <el-table-column label="收入" align="center">
        <el-table-column prop="jsapi" label="微信支付" align="center">
        </el-table-column>
        <el-table-column prop="alipay" label="支付宝支付" align="center">
        </el-table-column>
        <el-table-column prop="bank" label="银行卡" align="center">
        </el-table-column>
        <el-table-column prop="pos" label="pos机" align="center">
        </el-table-column>
        <el-table-column prop="out_deposit" label="调账" align="center">
        </el-table-column>
      </el-table-column>
      <el-table-column label="支出" align="center">
        <el-table-column prop="bank_trans" label="银行转账" align="center">
        </el-table-column>
        <el-table-column prop="give_up" label="平账" align="center">
        </el-table-column>
      </el-table-column>
    </el-table>
    <pagination-select :route-query="true" :total="total" @set="refresh"></pagination-select>
  </section>
</template>
<script>
import { CityStoreSelect, PaginationSelect, DateIntervalSelect } from '@/components/selects'
import { billListMonth, PaywayMonthExcel } from '@/api/api'
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
      billflowOne: {},
      tabbyname: '按月',
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    tabChange() {
      this.$emit('set', 'payway', 'day')
    },
    refresh () {
      this.getBillflow()
    },
    getBillflow() {
      let that = this
      let para = this.queryOption()
      that.listLoading = true
      billListMonth(para).then(res => {
        that.billFlows = res.data.items
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
        PaywayMonthExcel(para).then((res) => {
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
