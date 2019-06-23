<template>
  <section class="contractManage tab-title">
    <el-tabs type="card" @tab-click="handleClick" v-model="activeName">
      <el-tab-pane label="入住" name="first" class="fx-pages-main">
        <el-form :inline="true" class="fx-table-sort-head">
          <el-form-item size="small">
            <el-button @click="signPacts" type="primary" size="small">签署合同</el-button>
            <el-button @click="checkinExport" type="primary" size="small">批量导出</el-button>
          </el-form-item>
          <el-form-item label="选择门店" size="small">
            <city-store-select @set="handleSetStore"></city-store-select>
          </el-form-item>
          <el-form-item label="合同状态" prop="city" size="small">
            <el-select v-model="statuss" placeholder="请选择" size="small" @change="searchStatus" style="color:#fff">
              <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="合同开始" size="small">
            <el-date-picker type="date" placeholder="请选择日期" @change="startTimes" v-model="begin_time_start"></el-date-picker>
          </el-form-item>
          <el-form-item label="至" size="small">
            <el-date-picker type="date" placeholder="请选择日期" @change="endTimes" v-model="begin_time_stop"></el-date-picker>
          </el-form-item>
          <el-form-item label="合同到期" size="small">
            <el-date-picker type="date" placeholder="请选择日期" @change="startTimess" v-model="end_time_start"></el-date-picker>
          </el-form-item>
          <el-form-item label="至" size="small">
            <el-date-picker type="date" placeholder="请选择日期" @change="endTimess" v-model="end_time_stop"></el-date-picker>
          </el-form-item>
          <el-form-item class="searchs" size="small">
            <el-input v-model="name" type="text" class="input" placeholder="请输入房间号、姓名" @keyup.enter="getStaffList">
              <template class="iconfont icon-ali-sousuo" @click="searchAll" slot="append">搜索</template>
            </el-input>
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
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="totals">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="预定" name="second" class="fx-pages-main">
        <el-form :inline="true" class="fx-table-sort-head">
          <el-form-item size="small">
            <el-button @click="signPacts" type="primary" size="small">签署合同</el-button>
            <el-button @click="reserveExport" type="primary" size="small">批量导出</el-button>
          </el-form-item>
          <el-form-item label="选择门店" size="small">
            <city-store-select @set="handleSetStore"></city-store-select>
          </el-form-item>
          <el-form-item label="合同状态" size="small">
            <el-select v-model="chastatus" placeholder="请选择" size="small" @change="statusChange">
              <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="searchs" size="small">
            <el-input v-model="names" type="text" class="input" placeholder="请输入房间号、姓名" @keyup.enter="getStaffLists">
              <template class="iconfont icon-ali-sousuo" @click="searchAlls" slot="append">搜索</template>
            </el-input>
          </el-form-item>
        </el-form>
        <el-table :data="contractList" highlight-current-row @selection-change="selsChanges" v-loading="listLoadings" border tooltip-effect="dark">
          <el-table-column type="selection">
          </el-table-column>
          <el-table-column prop="resident.name" label="签约人">
          </el-table-column>
          <el-table-column prop="directory" label="房间地址" width="300">
          </el-table-column>
          <el-table-column prop="reserve_begin_time" label="预定时间" width="102">
          </el-table-column>
          <el-table-column prop="resident.book_money" label="定金" width="90">
          </el-table-column>
          <el-table-column prop="type" label="合同类型">
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
              <el-button type="text" @click="handleEdit(scope.$index, scope.row)">
                查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChanges" :page-size="1" :total="total">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="补充协议" name="three" class="fx-pages-main">
        <el-form :inline="true" class="fx-table-sort-head">
          <el-form-item label="选择门店" size="small">
            <city-store-select @set="handleSetStore"></city-store-select>
          </el-form-item>
          <el-form-item label="合同状态" size="small">
            <el-select v-model="mendstatus" placeholder="请选择" size="small" @change="repairStatus" style="color:#fff">
              <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="searchs" size="small">
            <el-input v-model="names" type="text" class="input" placeholder="请输入房间号、姓名" @keyup.enter="getStaffLists" size="small">
              <template class="iconfont icon-ali-sousuo" @click="searchAlls" slot="append">搜索</template>
            </el-input>
          </el-form-item>
        </el-form>
        <!--列表-->
        <el-table :data="repairList" highlight-current-row @selection-change="selsChanges" v-loading="listLoadingss" border tooltip-effect="dark">
          <el-table-column type="selection">
          </el-table-column>
          <el-table-column prop="contract_id" label="合同编号" width="200">
          </el-table-column>
          <el-table-column prop="resident.name" label="签署人">
          </el-table-column>
          <el-table-column prop="directory" label="房间地址" width="300">
          </el-table-column>
          <el-table-column prop="status" label="签署状态">
            <template slot-scope="scope">
              <span>{{ scope.row.status }}</span>
            </template>
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
        <el-pagination layout="prev, pager, next" @current-change="mendCurrentChange" :page-size="1" :total="totalss">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
    <!-- 批量导出 -->
    <el-dialog :title="title" v-model="digexport" :visible.sync="digexport" @close="digclose">
      <el-form :inline="true">
        <el-form-item label="选择门店">
          <city-store-select @set="handleSetStore"></city-store-select>
        </el-form-item>
        <el-form-item label="时间类型" class="select">
          <el-select v-model="checkinList.time_type" placeholder="请选择" size="small">
            <el-option v-for="item in timeType" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围" size="small">
          <el-date-picker type="date" placeholder="请选择日期" @change="digstart" v-model="checkinList.time_start"></el-date-picker>
        </el-form-item>
        <el-form-item label="至" size="small">
          <el-date-picker type="date" placeholder="请选择日期" @change="digend" v-model="checkinList.time_end"></el-date-picker>
        </el-form-item>
        <el-form-item size="small">
          <el-button class="comfir" type="primary" @click="derive" v-loading="digLoading" :disabled='isclick'>确认导出</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </section>
</template>
<script>
import { CityStoreSelect } from '@/components/selects'
import { operatList, batchSign, contractExport } from '@/api/api'
export default {
  components: {
    CityStoreSelect,
    // TextSearchSelect,
  },
  data() {
    return {
      city: '',
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
      // cityList: '',
      // storesList: '',
      buildingList: '',
      page: 1,
      totals: 0,
      citySplice: '',
      pages: 1,
      showCommunityList: '',
      input: '',
      activeName: 'first',
      dayNum: '',
      chastatus: '',
      mendstatus: '',
      title: '',
      statusList: [{
          value: '',
          label: '请选择',
        },
        {
          value: 'GENERATED',
          label: '未签署',
        },
        {
          value: 'SIGNING',
          label: '签署中',
        },
        {
          value: 'ARCHIVED',
          label: '已归档',
        },

      ],
      statuss: '',
      dayList: [{
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
      timeType: [{
          id: 'BEGIN',
          name: '按合同开始时间',
        },
        {
          id: 'END',
          name: '按合同结束时间',
        },
      ],
      digexport: false,
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
    if (this.$route.query.time !== '') {
      this.end_time_start = this.$route.query.from
      this.end_time_stop = this.$route.query.to
      this.operatList()
    }

    if (sessionStorage.getItem('page')) {
      this.page = Number(sessionStorage.getItem('page'))
    }
    if (sessionStorage.getItem('pages')) {
      this.pages = Number(sessionStorage.getItem('pages'))
    }
    if (sessionStorage.getItem('active')) {
      this.activeName = sessionStorage.getItem('active').replace(/\"/g, '')
    }
  },
  mounted() {
    this.getBooking()
    this.operatList()
    this.getReplenish()
  },
  destroyed() {
    if (this.$route.path !== '/lookcontracts') {
      sessionStorage.removeItem('page')
      sessionStorage.removeItem('active')
    }
  },
  methods: {
    handleSetStore(city, storeId) {
      this.city = city
      this.store_id = storeId
    },
    handleCurrentChange(val) {
      this.page = val
      this.operatList()
    },
    handleCurrentChanges(val) {
      this.pages = val
      this.getBooking()
    },
    mendCurrentChange(val) {
      this.pages = val
      this.getReplenish()
    },
    handleClick(tab) {
      if (tab.label == '预定') {
        sessionStorage.setItem('active', JSON.stringify('second'))
        this.pages = 1
        this.getBooking()
      } else if (tab.label == '入住') {
        sessionStorage.setItem('active', JSON.stringify('first'))
        this.page = 1
        this.operatList()
      } else {
        sessionStorage.setItem('active', JSON.stringify('three'))
        this.page = 1
        this.getReplenish()
      }
    },

    searchCity() {
      let that = this
      let para = {
        city: that.city,
      }

      that.templateLists.store_id = ''
      that.templateList.store_id = ''
      if (that.activeName == 'first') {
        para.city = that.citySplice
      }
      if (para.city == '请选择') {
        that.templateList.store_id = ''
        that.templateLists.store_id = ''
      }
      that.getStoreList()
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
        end_time_start: '',
        end_time_stop: '',
        contract_id: that.names,
        type: 'RESERVE',
      }
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
    searchAlls() {
      this.getStaffLists()
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
    searchNameSplice() {
      this.store_id = this.templateLists.store_id
      this.operatList()
    },
    /* 选择入职时间 */
    startTimes(val) {
      this.begin_time_start = val
      this.operatList()
    },
    endTimes(val) {
      this.begin_time_stop = val + ' 23:59:59'
      this.operatList()
    },
    startTimess(val) {
      this.end_time_start = val
      this.operatList()
    },
    endTimess(val) {
      this.end_time_stop = val + ' 23:59:59'
      this.operatList()
    },
    searchStatus() {
      this.status = this.statuss
      this.operatList()
    },
    getStaffList() {
      this.contract_id = this.name
      this.operatList()
    },
    searchAll() {
      this.getStaffList()
    },
    operatList() {
      let that = this
      let para = {
        page: that.page,
        status: that.statuss,
        store_id: that.templateLists.store_id,
        begin_time_start: that.begin_time_start,
        begin_time_stop: that.begin_time_stop,
        end_time_start: that.end_time_start,
        end_time_stop: that.end_time_stop,
        // contract_id: that.name,
        type: 'CHECKIN',
      }
      para.contract_id = para.room_number ? para.room_number : para.resident_name,
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
      this.store_id = this.mendList.store_id,
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
