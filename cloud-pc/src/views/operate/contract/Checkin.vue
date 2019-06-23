<template>
  <section class="contractManage tab-title">
    <el-form :inline="true" class="fx-table-sort-head">
      <el-form-item size="small">
        <el-button @click="signPacts" type="primary" size="small">签署合同</el-button>
        <el-button @click="checkinExport" type="primary" size="small">批量导出</el-button>
      </el-form-item>
      <el-form-item size="small">
        <city-store-select :route-query="true" @set="refresh"></city-store-select>
      </el-form-item>
      <el-form-item prop="city" size="small">
        <contract-status-select :route-query="true" @set="refresh"></contract-status-select>
      </el-form-item>
      <el-form-item label="合同开始" size="small">
        <date-interval-select :route-query="true" @set="refresh"></date-interval-select>
      </el-form-item>
      <!-- <el-form-item label="合同到期" size="small">
        <date-interval-select @set="handleSetEnd"></date-interval-select>
      </el-form-item> -->
      <el-form-item class="searchs" size="small">
        <text-search :options="searchOptions" :routeQuery="true" @set="refresh"></text-search>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="contractList" highlight-current-row @selection-change="selsChanges" v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="contract_id" label="合同编号" width="200">
      </el-table-column>
      <el-table-column prop="resident.name" label="签署人">
      </el-table-column>
      <el-table-column prop="directory" label="房间地址" width="300">
      </el-table-column>
      <el-table-column prop="created_at" label="合同周期" width="200">
      </el-table-column>
      <el-table-column prop="status" label="签署状态">
        <template slot-scope="scope">
          <span class='circles' :class='{ complete: (scope.row.status==="签署中") ? true :false,
                          canceled: (scope.row.status==="已归档") ? true :false,
                          pening: (scope.row.status==="未签署") ? true :false}'></span><span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="employee.name" label="经办人">
      </el-table-column>
      <el-table-column label="操作" width="50">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdits(scope.$index, scope.row)">
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <pagination-select :route-query="true" :total="total" @set="refresh"></pagination-select>
  </section>
</template>
<script>
import { CityStoreSelect, DateIntervalSelect, TextSearch, PaginationSelect } from '@/components/selects'
import { ContractStatusSelect } from '@/components/operate'
import { operatList, batchSign, contractExport } from '@/api/api'
export default {
  components: {
    CityStoreSelect,
    DateIntervalSelect,
    TextSearch,
    PaginationSelect,
    ContractStatusSelect,
  },
  data() {
    return {
      city: '',
      store_id: '',
      page: 1,
      totals: 0,
      pages: 1,
      input: '',
      contractList: [],
      name: '',
      listLoading: false,
      digLoading: false,
      isclick: false,
      begin_time_start: '',
      begin_time_stop: '',
      end_time_start: '',
      end_time_stop: '',
      // sels: [],
      sel: [],
      digexport: false,
      searchOptions: [
        { key: 'room_number', label: '房间号' },
        { key: 'resident_name', label: '姓名' },
      ],
      checkinList: {
        time_start: '',
        time_end: '',
        type: '',
      },
      startTime: '',
      endTime: '',
    }
  },
  computed: {
    headers() {
      return {
        'Token': sessionStorage.getItem('token'),
      }
    },
  },
  created() {
    // this.operatList()
    // if (this.$route.query.time !== '') {
    // this.end_time_start = this.$route.query.from
    // this.end_time_stop = this.$route.query.to
    // this.operatList()
    // }
    // if (sessionStorage.getItem('page')) {
    //   this.page = Number(sessionStorage.getItem('page'))
    // }
    // if (sessionStorage.getItem('pages')) {
    //   this.pages = Number(sessionStorage.getItem('pages'))
    // }
    // if (sessionStorage.getItem('active')) {
    //   this.activeName = sessionStorage.getItem('active').replace(/\"/g, '')
    // }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    refresh() {
      this.operatList()
    },
    handleSetBegin(begin, end) {
      console.log(begin, end)
      // this.begin_time_start = begin + ':00.0+08:00'
      // this.begin_time_stop = end + ':00.0+08:00'
      this.begin_time_start = begin
      this.begin_time_stop = end
      this.refresh()
    },
    handleSetEnd(begin, end) {
      // this.end_time_start = begin + ':00.0+08:00'
      // this.end_time_stop = end + ':00.0+08:00'
      this.end_time_start = this.fxFilter.toPHPTime(begin)
      this.end_time_stop = this.fxFilter.toPHPTime(end)
      this.refresh()
    },
    // 转化类型
    signTransition(sign) {
      if (sign == 'NEW') {
        sign = '新签'
      } else if (sign == 'RENEW') {
        sign = '续新'
      } else if (sign == 'CHANGE') {
        sign = '换房'
      }
      return sign
    },
    searchStatus() {
      this.status = this.statuss
      this.operatList()
    },
    // getStaffList() {
    //   this.contract_id = this.name
    //   this.operatList()
    // },
    // searchAll() {
    //   this.getStaffList()
    // },
    operatList() {
      let that = this
      let para = this.queryOption()
      para.begin_time_start = para.begin_time
      para.begin_time_stop = para.end_time
      // para.end_time_start = that.end_time_start
      // para.end_time_stop = that.end_time_stop
      para.contract_id = para.room_number ? para.room_number : para.resident_name
      // console.log(that.room_number)
      // resident_name
      para.type = 'CHECKIN'
      that.listLoading = true
      operatList(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data
        that.func.portInit(rescode, resmsg, function() {
          that.totals = getData.count
          getData.list.forEach((item) => {
            item.sign_type = that.signTransition(item.sign_type)
            item.status = that.func.constatus(item.status)
            item.directory = `${item.store.city}${item.store.name}${item.roomunion.number}`
            item.created_at = `${item.begin_time}~${item.end_time}`
          })
          that.contractList = getData.list
          that.total = getData.count * 10
          that.listLoading = false
        })
      }).catch(function() {
        // console.log(err)
      })
    },

    // 查看信息
    handleEdits(index, row) {
      sessionStorage.setItem('page', JSON.stringify(this.page))
      this.$router.push({
        path: '/lookcontracts',
        query: {
          id: row.id,
          name: 'checkin',
        },
      })
    },
    // 签署合同
    signPact() {
      let that = this
      let ids = that.sel.map(item => item.id).toString()
      if (this.sel.length == 0) {
        this.$message({
          message: '请选择你所要签署的合同',
          type: 'error',
        })
      } else {
        that.$confirm('确定签署所选中的合同吗', '提示', {
          type: 'warning',
        }).then(() => {
          that.listLoading = true
          let para = {
            contract_ids: ids,
          }
          batchSign(para).then(res => {
            let rescode = res.data.rescode
            if (rescode == 0) {
              that.listLoading = false
              that.$message({
                message: '签署成功',
                type: 'success',
              })
              that.operatList()
            }
          }).catch(function(err) {
            console.log(err)
            that.operatList()
          })
        }).catch(function() {
          that.listLoading = false
          that.$message({
            type: 'info',
            message: '已取消签署',
          })
        })
      }
    },

    // 签署合同
    signPacts() {
      let that = this
      let ids = that.sel.map(item => item.id).toString()
      if (this.sel.length == 0) {
        this.$message({
          message: '请选择你所要签署的合同',
          type: 'error',
        })
      } else {
        that.$confirm('确定签署所选中的合同吗', '提示', {
          type: 'warning',
        }).then(() => {
          that.listLoadings = true
          let para = {
            contract_ids: ids,
          }
          batchSign(para).then(res => {
            let rescode = res.data.rescode
            if (rescode == 0) {
              that.listLoadings = false
              that.$message({
                message: '签署成功',
                type: 'success',
              })
              that.getBooking()
            }
          }).catch(function(err) {
            console.log(err)
            that.getBooking()
          })
        }).catch(function() {
          that.listLoading = false
          that.$message({
            type: 'info',
            message: '已取消签署',
          })
        })
      }
    },
    digstart(val) {
      this.checkinList.time_start = val
    },
    digend(val) {
      this.checkinList.time_end = val + ' 23:59:59'
    },
    // 确认导出
    checkinExport () {
      let that = this
      let time = ''
      let para = this.queryOption()
      para.begin_time_start = para.begin_time
      para.begin_time_stop = para.end_time
      para.type = 'CHECKIN'
      that.startTime = para.begin_time.substr(0, 10)
      that.endTime = para.end_time.substr(0, 10)
      time = that.startTime + '--' + that.endTime
      that.$confirm('确认导出选中合同吗？', '提示', {
        type: 'warning'
      }).then(() => {
        contractExport(para).then((res) => {
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
            message: '合同信息导出成功',
            type: 'success',
          })
        })
      })
    },
    selsChanges (sels) {
      this.sel = sels
      console.log(sels)
    },
    // ---------------------------- 补充协议 ------------------------------
  },

}

</script>
