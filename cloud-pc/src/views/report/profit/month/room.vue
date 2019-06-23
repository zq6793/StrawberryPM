<template>
  <section class="all-box">
    <el-form :inline="true" class="fx-table-sort-head">
      <el-form-item size="small">
        <el-radio-group v-model="tabbyname" @change="tabChange">
          <el-radio-button label="门店"></el-radio-button>
          <el-radio-button label="房间"></el-radio-button>
          <el-radio-button label="住户"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="" size="small">
        <city-store-select :route-query="true" @set="refresh"></city-store-select>
      </el-form-item>
      <el-form-item label="" size="small">
        <date-interval-select :route-query="true" @set="refresh"></date-interval-select>
      </el-form-item>
      <el-form-item size="small">
        <!-- <el-button type="primary" @click="handleExports" size="small">批量导出</el-button> -->
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="billFlows" @selection-change="selsChange" style="width: 100%;" v-loading="listLoading" border>
      <el-table-column prop="store_name" label="门店名称" width="190" align="center">
      </el-table-column>
      <el-table-column prop="pay_ways" label="可出租天数" align="center">
      </el-table-column>
      <el-table-column prop="pay_ways" label="空置天数" align="center">
      </el-table-column>
      <el-table-column prop="pay_ways" label="平均空置天数" align="center">
      </el-table-column>
      <el-table-column prop="pay_ways" label="空置率" align="center">
      </el-table-column>
      <el-table-column prop="pay_ways" label="出房次数" align="center">
      </el-table-column>
      <el-table-column prop="pay_ways" label="平均出房天数" align="center">
      </el-table-column>
      <el-table-column prop="pay_ways" label="出房均价" align="center">
      </el-table-column>
      <el-table-column prop="pay_ways" label="空置损失" align="center">
      </el-table-column>
    </el-table>
    <pagination-select :route-query="true" :total="total" @set="refresh"></pagination-select>
    <!-- 查看信息 -->
  </section>
</template>
<script>
import { CityStoreSelect, PaginationSelect, DateIntervalSelect } from '@/components/selects'
import { billExcel } from '@/api/api'
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
      startYear: '',
      startMonth: '',
      endYear: '',
      endMonth: '',
      tabbyname: '房间'
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    tabChange() {
      switch (this.tabbyname) {
        case '门店' :
          this.$emit('set', 'month', 'store')
          break
        case '房间' :
          this.$emit('set', 'month', 'room')
          break
        case '住户' :
          this.$emit('set', 'month', 'person')
          break
        default :
          this.$emit('set', 'month', 'store')
          break
      }
    },
    refresh () {
      // this.getBillflow()
    },
    // getBillflow() {
    //   let that = this
    //   let para = this.queryOption()
    //   that.listLoading = true
    //   billList(para).then(res => {
    //     for (const item of res.data.items) {
    //       item.pay_date = that.fxFilter.goTime(item.pay_date)
    //       item.pay_type = that.fxFilter.payWay(item.pay_date)
    //     }
    //     that.billFlows = res.data.items
    //     that.total = res.data.count
    //     that.listLoading = false
    //   }).catch(function(err) {
    //     that.listLoading = false
    //   })
    // },
    /* 批量导出 */
    handleExports () {
      let that = this
      let time = ''
      that.listLoadings = true
      let para = Object.assign({}, that.pushExcel)
      that.func.emptyVul(para, function() {}, function() {
        time = that.startYear + '-' + that.startMonth + '-' + that.startDay + '--' + that.endYear + '-' + that.endMonth + '-' + that.endDay
        billExcel(para).then((res) => {
          let blob = new Blob([res.data ], { type: 'application/octet-stream;charset=utf-8' }) // 创建一个blob对象
          let a = document.createElement('a') // 创建一个<a></a>标签
          a.href = URL.createObjectURL(blob) // response is a blob
          a.download = time + '.xlsx' // 文件名称
          a.style.display = 'none'
          document.body.appendChild(a)
          a.click()
          a.remove()
          that.listLoadings = false
          setTimeout(() => {
            that.isclick = false
          }, 1200)
          that.handleExport = false
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
