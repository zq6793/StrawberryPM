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
    <el-table :data="contractedList" highlight-current-row @selection-change="selsChanges" v-loading="listLoading" border tooltip-effect="dark">
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
      templateList: {
        store_id: '',
        building_id: '',
      },
      templateLists: {
        store_id: '',
      },
      mendList: {
        store_id: '',
      },
      buildingList: '',
      totals: 0,
      citySplice: '',
      showCommunityList: '',
      input: '',
      activeName: 'first',
      dayNum: '',
      chastatus: '',
      mendstatus: '',
      title: '',
      dayList: [
        {
          value: '控制天数',
          label: '控制天数',
        },
        {
          value: '小于10天',
          label: '小于10天',
        },
        {
          value: '11至20天',
          label: '11至20天',
        },
        {
          value: '21至30天',
          label: '21至30天',
        },
        {
          value: '大于30天',
          label: '大于30天',
        },
      ],
      contractList: [],
      contractedList: [],
      repairList: [],
      total: 0,
      name: '',
      names: '',
      listLoading: false,
      listLoadings: false,
      listLoadingss: false,
      digLoading: false,
      isclick: false,
      begin_time_start: '',
      begin_time_stop: '',
      end_time_start: '',
      end_time_stop: '',
      // sels: [],
      sel: [],
      checkinList: {
        city: '',
        store_id: '',
        type: '',
        time_type: '',
        time_start: '',
        time_end: '',
      },
      timeType: [
        {
          id: 'BEGIN',
          name: '按合同开始时间',
        },
        {
          id: 'END',
          name: '按合同结束时间',
        },
      ],
      digexport: false,
      searchOptions: [
        { key: 'room_number', label: '房间号' },
        { key: 'resident_name', label: '姓名' },
      ],
    }
  },
  computed: {
    headers() {
      return {
        'Token': sessionStorage.getItem('token'),
      }
    },
  },
  // created() {
  //   if (this.$route.query.time !== '') {
  //     this.end_time_start = this.$route.query.from
  //     this.end_time_stop = this.$route.query.to
  //   }
  // },
  mounted() {
    // this.refresh()
  },
  methods: {
    refresh () {
      this.operatList()
    },
    handleSetBegin(begin, end) {
      // this.begin_time_start = begin + ':00.0+08:00'
      // this.begin_time_stop = end + ':00.0+08:00'
      this.begin_time_start = this.fxFilter.toPHPTime(begin)
      this.begin_time_stop = this.fxFilter.toPHPTime(end)
      this.refresh()
    },
    handleSetEnd(begin, end) {
      // this.end_time_start = begin + ':00.0+08:00'
      // this.end_time_stop = end + ':00.0+08:00'
      this.end_time_start = this.fxFilter.toPHPTime(begin)
      this.end_time_stop = this.fxFilter.toPHPTime(end)
      this.refresh()
    },
    // 批量导出
    batchExport() {

    },
    searchName() {
      this.store_id = this.templateList.store_id,
      this.getBooking()
    },
    // ---------------------------- 预定 ------------------------------
    // 获取列表
    getBooking() {
      let that = this
      let para = {
        page: that.pages,
        status: that.chastatus,
        store_id: that.templateList.store_id,
        begin_time_start: '',
        begin_time_stop: '',
        // end_time_start: '',
        // end_time_stop: '',
        // contract_id: that.names,
        type: 'RESERVE',
      }
      para.contract_id = para.room_number ? para.room_number : para.resident_name
      that.listLoadings = true
      operatList(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data
        that.func.portInit(rescode, resmsg, function() {
          that.contractList = getData.list
          that.total = getData.count
          getData.list.forEach((item) => {
            item.sign_type = that.signTransition(item.sign_type)
            item.status = that.func.constatus(item.status)
            item.directory = `${item.store.city}${item.store.name}${item.roomunion.number}`
            item.created_at = `${item.begin_time}~${item.end_time}`
            item.type = that.func.contype(item.type)
          })
          that.listLoadings = false
        })
      }).catch(function(err) {
        console.log(err)
      })
    },
    getStaffLists() {
      this.contract_id = this.names
      this.getBooking()
    },
    statusChange() {
      this.status = this.chastatus
      this.getBooking()
    },

    reserveExport() {
      this.title = '批量导出预约合同'
      this.checkinList.type = 'RESERVE'
      this.digexport = true
    },
    // 查看信息
    handleEdit(index, row) {
      sessionStorage.setItem('pages', JSON.stringify(this.pages))
      this.$router.push({
        path: '/lookcontracts',
        query: {
          id: row.id,
          name: 'reserve',
        },
      })
    },
    // ---------------------------- 入住 ------------------------------
    searchCitys() {
      this.checkinList.store_id = ''
      this.checkinList.city = this.checkinList.city
    },
    // 转化类型
    signTransition(sign) {
      if (sign == 'NEW') {
        sign = '新签'
      } else if (sign == 'RENEW') {
        sign = '续新'
      } else if (sign == 'CHANGE') {
        sign = '换房'
      } else {

      }
      return sign
    },
    searchStatus(val) {
      this.updateRouteQuery('status', val)
      this.refresh()
    },
    getStaffList() {
      this.contract_id = this.name
      this.refresh()
    },
    searchAll() {
      this.getStaffList()
    },
    operatList() {
      let that = this
      let para = this.queryOption()
      para.begin_time_start = para.begin_time
      para.begin_time_stop = para.end_time
      // para.end_time_start = that.end_time_start
      // para.end_time_stop = that.end_time_stop
      para.contract_id = para.room_number ? para.room_number : para.resident_name
      para.type = 'DEPOSIT'
      that.listLoading = true
      operatList(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data
        that.func.portInit(rescode, resmsg, function() {
          that.contractedList = getData.list
          that.totals = getData.count
          getData.list.forEach((item) => {
            item.sign_type = that.signTransition(item.sign_type)
            item.status = that.func.constatus(item.status)
            item.directory = `${item.store.city}${item.store.name}${item.roomunion.number}`
            item.created_at = `${item.begin_time}~${item.end_time}`
          })
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
    checkinExport() {
      this.title = '批量导出入住合同'
      this.checkinList.type = 'CHECKIN'
      this.digexport = true
    },
    derive() {
      let name = ''
      let time = ''
      let type = ''
      let that = this
      let myDate = new Date()
      let para = Object.assign({}, that.checkinList)
      that.digLoading = true
      that.isclick = true
      that.func.emptyVul(para, function() {
        that.digLoading = false
        that.isclick = false
      }, function() {
        that.storesList.forEach((item) => {
          if (item.id == para.store_id) {
            name = item.name
          }
        })
        time = myDate.toLocaleDateString()
        if (para.type == 'CHECKIN') {
          type = '入住'
        } else if (para.type == 'RESERVE') {
          type = '预定'
        }
        contractExport(para).then((res) => {
          if (res.status == 200) {
            let blob = new Blob([res.data], { type: 'application/octet-stream;charset=utf-8' }) // 创建一个blob对象
            let a = document.createElement('a') // 创建一个<a></a>标签
            a.href = URL.createObjectURL(blob) // response is a blob
            a.download = time + name + type + '合同' + '.xlsx' // 文件名称
            a.style.display = 'none'
            document.body.appendChild(a)
            a.click()
            a.remove()
            that.$message({
              message: '合同信息导出成功',
              type: 'success',
            })
            that.digexport = false
            setTimeout(() => {
              that.isclick = false
            }, 1200)
          }
        })
      })
    },
    // ---------------------------- 补充协议 ------------------------------

    repairStatus() {
      this.status = this.mendstatus
      this.getReplenish()
    },
    searchNames() {
      this.store_id = this.mendList.store_id
      this.getReplenish()
    },

    getReplenish() {
      let that = this
      let para = {
        page: that.pages,
        status: that.mendstatus,
        store_id: that.mendList.store_id,
        begin_time_start: '',
        begin_time_stop: '',
        end_time_start: '',
        end_time_stop: '',
        contract_id: that.names,
        type: 'DEPOSIT',
      }
      that.listLoadingss = true
      operatList(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data
        that.func.portInit(rescode, resmsg, function() {
          that.totalss = getData.count * 10
          that.repairList = getData.list
          getData.list.forEach((item) => {
            item.sign_type = that.signTransition(item.sign_type)
            item.status = that.func.constatus(item.status)
            item.directory = `${item.store.city}${item.store.name}${item.roomunion.number}`
            item.type = that.func.contype(item.type)
          })
          that.listLoadingss = false
        })
      }).catch(function(err) {
        console.log(err)
      })
    },
    // 确认导出
    mendExport() {
      this.title = '批量导出补充协议合同'
      this.checkinList.type = 'DEPOSIT'
      this.digexport = true
    },
    digclose() {
      this.func.clearVul(this.checkinList)
      this.digLoading = false
      this.isclick = false
    },

    // selsChange(sels) {
    //   this.sels = sels;
    // },
    selsChanges(sels) {
      this.sel = sels
    },
  },

}

</script>
