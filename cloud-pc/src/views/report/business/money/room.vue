<template>
  <section class="all-box">
    <el-form :inline="true" class="fx-table-sort-head">
      <el-form-item size="small">
        <el-radio-group v-model="tabbyname" @change="tabChange">
          <el-radio-button label="门店"></el-radio-button>
          <el-radio-button label="房间"></el-radio-button>
          <el-radio-button label="租户"></el-radio-button>
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
       <el-table-column prop="room_number" label="房间号" width="90" align="center">
      </el-table-column>
      <el-table-column prop="pay_circle" label="周期" width="110" align="center">
      </el-table-column>
      <el-table-column label="住宿费" align="center">
      <el-table-column prop="rent_contact" label="合同金额" align="center">
      </el-table-column>
      <el-table-column prop="rent_original" label="应收" align="center">
      </el-table-column>
      <el-table-column prop="rent_real" label="实收" align="center">
      </el-table-column>
      </el-table-column>
      <el-table-column label="服务费" align="center">
      <el-table-column prop="service_contact" label="合同金额" align="center">
      </el-table-column>
      <el-table-column prop="service_original" label="应收" align="center">
      </el-table-column>
      <el-table-column prop="service_real" label="实收" align="center">
      </el-table-column>
      </el-table-column>
      <el-table-column label="临时收费" align="center">
      <el-table-column prop="temporary_contact" label="合同金额" align="center">
      </el-table-column>
      <el-table-column prop="temporary_original" label="应收" align="center">
      </el-table-column>
      <el-table-column prop="temporary_real" label="实收" align="center">
      </el-table-column>
      </el-table-column>
      <el-table-column label="押金" align="center">
      <el-table-column prop="deposit_contact" label="合同金额" align="center">
      </el-table-column>
      <el-table-column prop="deposit_original" label="应收" align="center">
      </el-table-column>
      <el-table-column prop="deposit_real" label="实收" align="center">
      </el-table-column>
      </el-table-column>
      <el-table-column label="总计" align="center">
      <el-table-column prop="total_contact" label="合同金额" align="center">
      </el-table-column>
      <el-table-column prop="total_original" label="应收" align="center">
      </el-table-column>
      <el-table-column prop="total_real" label="实收" align="center">
      </el-table-column>
      </el-table-column>
    </el-table>
    <pagination-select :route-query="true" :total="total" @set="refresh"></pagination-select>
    <!-- 查看信息 -->
  </section>
</template>
<script>
import { CityStoreSelect, PaginationSelect, DateIntervalSelect } from '@/components/selects'
import { chartReceiptRoom, receiptRoomExcel } from '@/api/api'
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
          this.$emit('set', 'money', 'store')
          break
        case '房间' :
          this.$emit('set', 'money', 'room')
          break
        case '租户' :
          this.$emit('set', 'money', 'person')
          break
        default :
          this.$emit('set', 'money', 'store')
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
      chartReceiptRoom(para).then(res => {
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
        receiptRoomExcel(para).then((res) => {
          let blob = new Blob([res.data], { type: 'application/octet-stream;charset=utf-8' }) // 创建一个blob对象
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
