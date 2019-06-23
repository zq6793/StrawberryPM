<template>
<section class="one-box">
  <el-form :inline="true" class="fx-table-sort-head">
    <el-form-item label="" size="small" >
    <el-radio-group v-model="runninggbytimes" @change="tabChange">
      <el-radio-button label="汇总"></el-radio-button>
      <el-radio-button label="明细"></el-radio-button>
    </el-radio-group>
  </el-form-item>
    <el-form-item label="" size="small" >
      <city-store-select :route-query="true" @set="refresh"></city-store-select>
    </el-form-item>
    <el-form-item size="small" label="">
      <pay-way-select :route-query="true" @set="refresh"></pay-way-select>
    </el-form-item>
    <el-form-item label="" size="small">
      <date-interval-select :route-query="true" @set="refresh"></date-interval-select>
    </el-form-item>
    <el-form-item size="small">
      <text-search :options="textSearchOption" :routeQuery="true" @set="refresh"></text-search>
    </el-form-item>
    <el-form-item size="small">
      <el-button type="primary" @click="handleExports" size="small">批量导出</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="subBillList" highlight-current-row  v-loading="listLoading" border tooltip-effect="dark">
    <el-table-column prop="store_name" label="门店名称" width="200" align="center">
    </el-table-column>
    <el-table-column prop="room_number" label="房间号" width="100" align="center">
    </el-table-column>
    <el-table-column prop="resident_name" label="姓名" width="100" align="center">
      <template slot-scope="scope">
        <span style="cursor: pointer;">{{scope.row.resident_name}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="sum_money" label="金额" align="center">
    </el-table-column>
    <el-table-column prop="pay_date" label="支付时间" width="160" align="center">
    </el-table-column>
    <el-table-column prop="pay_way" label="支付方式" align="center">
    </el-table-column>
    <el-table-column prop="out_trade_no" label="交易单号" align="center">
    </el-table-column>
    <el-table-column prop="images" label="凭证" align="center">
      <template slot-scope="scope">
        <span style="color: #00a69b; cursor: pointer;" @click="lookVoucher(scope.row)" v-if="scope.row.images.length">查看</span>
      </template>
    </el-table-column>
    <el-table-column prop="employee_name" label="经办人" align="center">
    </el-table-column>
  </el-table>
  <el-dialog
    title="查看凭证"
    :visible.sync="voucherVisible"
    center class="dialog"  @close="close">
    <el-carousel class="homepage-tips" :autoplay="false" trigger="click" ref="carousel">
      <el-carousel-item v-for="item in imgs" :key="item" style="height:auto;">
        <img :src="item" style="width:auto">
      </el-carousel-item>
    </el-carousel>
  </el-dialog>
  <!--工具条-->
  <pagination-select :route-query="true" :total="total" @set="refresh"></pagination-select>
</section>
</template>
<script>
import { CityStoreSelect, PaginationSelect, DateIntervalSelect, TextSearch } from '@/components/selects'
import { PayWaySelect } from '@/components/finance'
import { billList2, subSetsExcel } from '@/api/api'
export default {
  components: {
    CityStoreSelect,
    PaginationSelect,
    DateIntervalSelect,
    PayWaySelect,
    TextSearch,
  },
  data () {
    return {
      listLoading: false,
      total: 0,
      subBillList: [],
      payd_type: '',
      textSearchOption: [
        { key: 'room_number', label: '房间号' },
        { key: 'resident_name', label: '姓名' },
      ],
      voucherVisible: false,
      imgs: [],
      runninggbytimes: '明细'
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    tabChange() {
      this.$emit('set', 'date', 'all')
    },
    refresh () {
      this.getBillflow()
    },
    searchPaydType (val) {
      this.updateRouteQuery('payd_type', val)
      this.payd_type = val
      this.getBillflow()
    },
    searchAll () {
      this.updateRouteQuery('search', this.input)
      this.getBillflow()
    },
    getBillflow () {
      let that = this
      let para = this.queryOption()
      that.listLoading = true
      billList2(para).then(res => {
        that.total = res.data.count
        that.subBillList = res.data.items
        for (const item of that.subBillList) {
          item.pay_date = that.fxFilter.goTime(item.pay_date)
        }
        that.listLoading = false
      }).catch(function(err) {
        that.listLoading = false
      })
    },
    lookVoucher (row) {
      let that = this
      that.voucherVisible = true
      that.imgs = row.images
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
        subSetsExcel(para).then((res) => {
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
