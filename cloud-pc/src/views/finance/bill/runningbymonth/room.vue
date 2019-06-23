<template>
  <section class="all-box">
    <el-form :inline="true" class="fx-table-sort-head">
      <el-form-item size="small">
        <el-radio-group v-model="tabbyname" @change="tabChange">
          <el-radio-button label="按门店"></el-radio-button>
          <el-radio-button label="按房间"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="" size="small">
        <city-store-select :route-query="true" @set="refresh"></city-store-select>
      </el-form-item>
      <el-form-item size="small">
        <el-date-picker type="year" placeholder="请选择日期" @change="getYear" v-model="year" value-format="yyyy"></el-date-picker>
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
      <el-table-column prop="store_name" label="门店名称" align="center">
      </el-table-column>
      <el-table-column prop="room_number" label="房间号" align="center">
      </el-table-column>
      <el-table-column label="1月" align="center">
      <el-table-column prop="input_01" label="收入" align="center">
      </el-table-column>
      <el-table-column prop="output_01" label="支出" align="center">
      </el-table-column>
      </el-table-column>
      <el-table-column label="2月" align="center">
      <el-table-column prop="input_02" label="收入" align="center">
      </el-table-column>
      <el-table-column prop="output_02" label="支出" align="center">
      </el-table-column>
      </el-table-column>
      <el-table-column label="3月" align="center">
      <el-table-column prop="input_03" label="收入" align="center">
      </el-table-column>
      <el-table-column prop="output_03" label="支出" align="center">
      </el-table-column>
      </el-table-column>
      <el-table-column label="4月" align="center">
      <el-table-column prop="input_04" label="收入" align="center">
      </el-table-column>
      <el-table-column prop="output_04" label="支出" align="center">
      </el-table-column>
      </el-table-column>
      <el-table-column label="5月" align="center">
      <el-table-column prop="input_05" label="收入" align="center">
      </el-table-column>
      <el-table-column prop="output_05" label="支出" align="center">
      </el-table-column>
      </el-table-column>
      <el-table-column label="6月" align="center">
      <el-table-column prop="input_06" label="收入" align="center">
      </el-table-column>
      <el-table-column prop="output_06" label="支出" align="center">
      </el-table-column>
      </el-table-column>
      <el-table-column label="7月" align="center">
      <el-table-column prop="input_07" label="收入" align="center">
      </el-table-column>
      <el-table-column prop="output_07" label="支出" align="center">
      </el-table-column>
      </el-table-column>
      <el-table-column label="8月" align="center">
      <el-table-column prop="input_08" label="收入" align="center">
      </el-table-column>
      <el-table-column prop="output_08" label="支出" align="center">
      </el-table-column>
      </el-table-column>
      <el-table-column label="9月" align="center">
      <el-table-column prop="input_09" label="收入" align="center">
      </el-table-column>
      <el-table-column prop="output_09" label="支出" align="center">
      </el-table-column>
      </el-table-column>
      <el-table-column label="10月" align="center">
      <el-table-column prop="input_10" label="收入" align="center">
      </el-table-column>
      <el-table-column prop="output_10" label="支出" align="center">
      </el-table-column>
      </el-table-column>
      <el-table-column label="11月" align="center">
      <el-table-column prop="input_11" label="收入" align="center">
      </el-table-column>
      <el-table-column prop="output_11" label="支出" align="center">
      </el-table-column>
      </el-table-column>
      <el-table-column label="12月" align="center">
      <el-table-column prop="input_12" label="收入" align="center">
      </el-table-column>
      <el-table-column prop="output_12" label="支出" align="center">
      </el-table-column>
      </el-table-column>
      <el-table-column label="总计" align="center">
      <el-table-column prop="sum_input_money" label="收入" align="center">
      </el-table-column>
      <el-table-column prop="sum_output_money" label="支出" align="center">
      </el-table-column>
      </el-table-column>
    </el-table>
    <pagination-select :route-query="true" :total="total" @set="refresh"></pagination-select>
  </section>
</template>
<script>
import { CityStoreSelect, PaginationSelect, TextSearch } from '@/components/selects'
import { billListMonthRoom, MonthRoomExcel } from '@/api/api'

export default {
  components: {
    CityStoreSelect,
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
      tabbyname: '按房间',
      currTime: '',
      year: '',
    }
  },
  mounted() {
    this.getCurrTime()
    this.refresh()
  },
  methods: {
    tabChange() {
      this.$emit('set', 'month', 'store')
    },
    refresh () {
      this.getBillflow()
    },
    getCurrTime() {
      this.currTime = new Date()
      this.year += this.currTime.getFullYear()
      this.getYear(this.year)
    },
    // 年时间
    getYear(val) {
      this.year = val.substr(0, 4)
      this.getBillflow()
    },
    getBillflow() {
      let that = this
      let para = this.queryOption()
      para.year = this.year
      that.listLoading = true
      billListMonthRoom(para).then(res => {
        for (const item of res.data.items) {
          item.sum_input_money = item.input_01 + item.input_02 + item.input_03 + item.input_04 + item.input_05 + item.input_06 + item.input_07 + item.input_08 + item.input_09 + item.input_10 + item.input_11 + item.input_12
          item.sum_output_money = item.output_01 + item.output_02 + item.output_03 + item.output_04 + item.output_05 + item.output_06 + item.output_07 + item.output_08 + item.output_09 + item.output_10 + item.output_11 + item.output_12
        }
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
        MonthRoomExcel(para).then((res) => {
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
