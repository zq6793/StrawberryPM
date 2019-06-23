<template>
  <section class="all-box">
    <el-form :inline="true" class="fx-table-sort-head">
      <el-form-item size="small">
        <el-radio-group v-model="allbycost" @change="tabChange">
          <el-radio-button label="汇总"></el-radio-button>
          <el-radio-button label="明细(门店)"></el-radio-button>
          <el-radio-button label="明细(房间)"></el-radio-button>
          <el-radio-button label="明细(租户)"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="" size="small">
        <city-store-select :route-query="true" @set="refresh"></city-store-select>
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
    <!--列表-->
    <el-table :data="billFlows" @selection-change="selsChange" style="width: 100%;" v-loading="listLoading" border>
      <el-table-column prop="store_name" label="门店名称" width="220" align="center">
      </el-table-column>
      <el-table-column prop="room_number" label="房间号" align="center">
      </el-table-column>
      <el-table-column prop="resident_name" label="租户姓名" align="center">
      </el-table-column>
      <el-table-column label="收入" align="center">
        <el-table-column prop="deposit" label="押金" align="center">
        </el-table-column>
        <el-table-column prop="service_fee" label="服务费" align="center">
        </el-table-column>
        <el-table-column prop="room_fee" label="房租服务费" align="center">
        </el-table-column>
        <el-table-column prop="temp_fee" label="临时服务费" align="center">
        </el-table-column>
        <el-table-column prop="pre_payment" label="预收费" align="center">
        </el-table-column>
      </el-table-column>
      <el-table-column label="支出" align="center">
        <el-table-column prop="out_deposit" label="押金退款" align="center">
        </el-table-column>
        <el-table-column prop="out_refund" label="额外退款" align="center">
        </el-table-column>
        <el-table-column prop="out_flat" label="调账" align="center">
        </el-table-column>
      </el-table-column>
    </el-table>
    <pagination-select :route-query="true" :total="total" @set="refresh"></pagination-select>
    <!-- 查看信息 -->
  </section>
</template>
<script>
import { CityStoreSelect, PaginationSelect, DateIntervalSelect, TextSearch } from '@/components/selects'
import { billListCostResident, CostResidentExcel } from '@/api/api'
export default {
  components: {
    CityStoreSelect,
    DateIntervalSelect,
    PaginationSelect,
    TextSearch,
  },
  data() {
    return {
      listLoading: false,
      billFlows: [],
      total: 0,
      textSearchOption: [
        { key: 'room_number', label: '房间号' },
        { key: 'resident_name', label: '姓名' },
      ],
      startTime: '',
      endTime: '',
      allbycost: '明细(租户)'
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    tabChange() {
      switch (this.allbycost) {
        case '汇总' :
          this.$emit('set', 'fees', 'all')
          break
        case '明细(门店)' :
          this.$emit('set', 'fees', 'store')
          break
        case '明细(房间)' :
          this.$emit('set', 'fees', 'room')
          break
        case '明细(租户)' :
          this.$emit('set', 'fees', 'person')
          break
        default :
          this.$emit('set', 'fees', 'all')
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
      billListCostResident(para).then(res => {
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
        CostResidentExcel(para).then((res) => {
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
