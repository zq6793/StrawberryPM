<template>
  <section class="fx-pages-main bill">
    <el-form :inline="true" style="padding: 8px 22px">
      <el-form-item class="btn">
        <el-button type="primary" @click="handleAdd">+添加账单</el-button>
        <el-button type="primary" @click="dialogPush = true">推送账单</el-button>
        <el-button type="primary" @click="diainspect = true">确认审核</el-button>
        <el-button type="primary" @click="creatBill">生成账单</el-button>
        <el-button type="primary" @click="handleExports">批量导出</el-button>
        <el-button type="primary" @click="handlemoney">导出回款表</el-button>
      </el-form-item>
      <el-form-item label="选择门店">
        <city-store-select @set="handleSetStore"></city-store-select>
      </el-form-item>
      <el-form-item label="类型" class="selectl">
        <el-select v-model="type" placeholder="请选择" size="small" @change="searchType">
          <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支付状态" class="selectl">
        <el-select v-model="status" placeholder="请选择" size="small" @change="searchStatus">
          <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-date-picker type="month" placeholder="请选择日期" @change="monthTime" v-model="monthTimes"></el-date-picker>
      </el-form-item>
        <el-form-item class="searchs inputs white-el-select">
          <el-input v-model="input" type="text" placeholder="请输入房间号、姓名" @keyup.enter="searchStore" class="input" size="small">
            <template slot="append" class="iconfont icon-ali-sousuo" @click="searchAll">
              搜索
            </template>
          </el-input>
        </el-form-item>
      <el-dialog title="编辑" :visible.sync="handleEdit" width="30%" center class="dialogf">
        <el-row :gutter="24">
          <el-col :span="8">
            <div class="houseInfo">
              <p>{{typedialog}}</p>
              <el-col :span="20">
                <el-input type="text" class="input" v-model="editList.money"></el-input>
              </el-col>
              <el-col :span="4">
                <span>元</span>
              </el-col>
              <p class="person">操作人: &nbsp;{{name}}</p>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="changeinfo">
              <p>修改原因</p>
              <el-input type="textarea" placeholder="请填写修改原因" :rows="4" v-model="editList.remark"></el-input>
              <el-form-item label="" class="btn">
                <el-button type="primary" @click="submit">提交</el-button>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-dialog>
    </el-form>
    <!--列表-->
    <el-table :data="storeList" highlight-current-row @selection-change="selsChange" style="width: 100%;" v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="store.name" label="门店名称" width="210">
      </el-table-column>
      <el-table-column prop="roomunion.number" label="房间号">
      </el-table-column>
      <el-table-column prop="resident.name" label="姓名">
        <template slot-scope="scope">
          <span @click="lookInfo(scope.$index, scope.row)" style="cursor: pointer; color: #00a69b">{{scope.row.resident.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="账单创建时间" width="160">
      </el-table-column>
      <el-table-column prop="period" label="账单周期">
      </el-table-column>
      <el-table-column prop="type" label="类型">
      </el-table-column>
      <el-table-column prop="money" label="金额(元)">
      </el-table-column>
      <el-table-column prop="status" label="支付状态">
        <template slot-scope="scope">
          <span size="small" :class="{closeprice: (scope.row.status) == '已关闭'?true:false}">{{scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="84">
        <template slot-scope="scope">
          <span size="small" @click="handleEdit1(scope.$index, scope.row)" class="textchange">修改</span>
          <span size="small" @click="closeBill(scope.$index, scope.row)" style="color: red; cursor: pointer;">关闭</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 生成账单 -->
    <el-dialog title="提示" v-model="isBill" :close-on-click-modal="false">
      <el-form label-width="68px">
        <el-form-item label="选择门店">
          <city-store-select @set="handleSetStore"></city-store-select>
        </el-form-item>
        <el-form-item label="选择日期">
          <el-date-picker type="month" placeholder="请选择日期" @change="diamonthTime" v-model="diamonthTimes"></el-date-picker>
        </el-form-item>
        <el-button class="comfirs" type="primary" @click="createBills" :disabled="isClick">确认</el-button>
      </el-form>
    </el-dialog>
    <!-- 确认审核 -->
    <el-dialog title="提示" v-model="diainspect" :close-on-click-modal="false" @close="closeinspect">
      <el-form label-width="68px">
        <el-form-item label="选择门店">
          <city-store-select @set="handleSetStore"></city-store-select>
        </el-form-item>
        <el-form-item label="选择日期">
          <el-date-picker type="month" placeholder="请选择日期" @change="pushmonthTime" v-model="pushmonthTimes"></el-date-picker>
        </el-form-item>
        <el-button class="comfirs" type="primary" @click="inspectBill" :disabled="isclick" v-loading="loadingPush">确认</el-button>
      </el-form>
    </el-dialog>
    <!-- 推送账单 -->
    <el-dialog title="提示" v-model="dialogPush" :close-on-click-modal="false" @close="closePush">
      <el-form label-width="68px">
        <el-form-item label="选择门店">
          <city-store-select @set="handleSetStore"></city-store-select>
        </el-form-item>
        <el-button class="comfirs" type="primary" @click="pushBills" :disabled="isclick" v-loading="loadingPush">确认</el-button>
      </el-form>
    </el-dialog>
    <!-- 批量导出 -->
    <el-dialog title="账单导出" :visible.sync="handleExport" width="30%" center class="dialog" @close="close">
      <el-form :inline="true">
        <el-form-item label="选择门店">
          <city-store-select @set="handleSetStore"></city-store-select>
        </el-form-item>
        <br>
        <el-form-item label="选择时间">
          <el-date-picker type="month" placeholder="请选择日期" @change="startTimedE" v-model="pushExcel.startTime"></el-date-picker>
        </el-form-item>
        <el-form-item label="至">
          <el-date-picker type="month" placeholder="请选择日期" @change="endTimedE" v-model="pushExcel.endTime"></el-date-picker>
        </el-form-item>
        <br>
        <el-button type="primary" @click="pushExports" :disabled="isclick" v-loading="listLoadings" class="comfirex">导出</el-button>
      </el-form>
    </el-dialog>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total" :current-page.sync="page">
      </el-pagination>
    </el-col>
  </section>
</template>
<script type="text/javascript">
import { CityStoreSelect } from '@/components/selects'
import { getCityList, getStoreList, listOrder, editOrder, getName, generate, oedertoExcel, pushbill, approve, closeOrder, recycleExcel } from '@/api/api'
export default {
  components: {
    CityStoreSelect,
    // TextSearchSelect,
  },
  data () {
    return {
      total: 0,
      page: 1,
      listLoading: false,
      dialogPush: false,
      city: '',
      store_id: '',
      building_id: '',
      digList: [],
      pushList: [],
      buildingList: '',
      input: '',
      monthTimes: '',
      handleEdit: false,
      diainspect: false,
      typedialog: '',
      type: '',
      name: '',
      isClick: false,
      isclick: false,
      listLoadings: false,
      loadingPush: false,
      typeList: [{
        label: '请选择',
        value: '',
      },
      {
        label: '住宿服务费',
        value: 'ROOM',
      },
      {
        label: '物业服务费',
        value: 'MANAGEMENT',
      },
      {
        label: '用电服务费',
        value: 'ELECTRICITY',
      },
      {
        label: '冷水服务费',
        value: 'WATER',
      },
      {
        label: '热水服务费',
        value: 'HOT_WATER',
      },
      {
        label: '住宿押金',
        value: 'DEPOSIT_R',
      },
      {
        label: '其他押金',
        value: 'DEPOSIT_O',
      },
      {
        label: '定金',
        value: 'RESERVE',
      },
      {
        label: '退房',
        value: 'REFUND',
      },
      {
        label: '清洁服务费',
        value: 'CLEAN',
      },
      {
        label: '设备租赁费',
        value: 'DEIVCE',
      },
      {
        label: '物品维修费',
        value: 'REPAIR',
      },
      {
        label: '物品赔偿费',
        value: 'COMPENSATION',
      },
      {
        label: '滞纳金',
        value: 'OVERDUE',
      },

      {
        label: '其它服务费',
        value: 'OTHER',
      },
      ],
      status: '',
      statusList: [{
        label: '请选择',
        value: '',
      },
      {
        label: '已付款',
        value: 'PAY',
      },
      {
        label: '未付款',
        value: 'NOTPAY',
      },

      ],
      year: '',
      month: '',
      editList: {
        order_id: '',
        money: '',
        remark: '',
      },
      isBill: false,
      createdBill: {
        store_id: '',
        year: '',
        month: '',
      },
      pushBill: {
        store_id: '',
      },
      inspectList: {
        store_id: '',
        year: '',
        month: '',
      },
      diamonthTimes: '',
      pushmonthTimes: '',
      handleExport: false,
      storesListd: [],
      timeds: '',
      pushExcel: {
        cityd: '',
        store_id: '',
        startYear: '',
        startMonth: '',
        endYear: '',
        endMonth: '',
        startTime: '',
        endTime: '',
      },
      isRecycle: '',
    }
  },
  created () {
    if (this.$route.query.status) {
      this.status = this.$route.query.status
      this.getBill()
    }
    if (sessionStorage.getItem('page')) {
      this.page = Number(sessionStorage.getItem('page'))
    }
  },
  destroyed () {
    if (this.$route.path !== '/householdinfo') {
      sessionStorage.removeItem('page')
    }
  },
  mounted () {
    this.getCityd()
    this.getBill()
    this.getName()
  },
  methods: {
    handleSetStore (city, storeId) {
      this.city = city
      this.store_id = storeId
    },
    handleCurrentChange (val) {
      this.page = val
      this.getBill()
    },
    // 月时间
    monthTime (val) {
      this.monthTimes = val
      if (this.monthTimes != undefined) {
        this.year = val.substr(0, 4)
        this.month = val.substr(5)
      }
      this.page = 1
      this.getBill()
    },
    diamonthTime (val) {
      this.diamonthTimes = val
      if (this.diamonthTimes != undefined) {
        this.createdBill.year = val.substr(0, 4)
        this.createdBill.month = val.substr(5)
      }
    },
    pushmonthTime (val) {
      this.pushmonthTimes = val
      if (this.pushmonthTimes != undefined) {
        this.inspectList.year = val.substr(0, 4)
        this.inspectList.month = val.substr(5)
      }
    },

    searchType () {
      this.type = this.type,
      this.page = 1
      this.getBill()
    },
    searchStatus () {
      this.status = this.status,
      this.page = 1
      this.getBill()
    },

    // 搜索
    searchStore () {
      this.input = this.input
      this.getBill()
    },
    searchAll () {
      this.searchStore()
    },
    /* 选择门店 */
    searchName () {
      this.store_id = this.store_id
      this.page = 1
      this.getBill()
    },
    /* 获取流水列表 */
    getBill () {
      let that = this
      let para = {
        page: that.page,
        store_id: that.store_id,
        type: that.type,
        status: that.status,
        year: that.year,
        month: that.month,
        search: that.input,
      }
      that.listLoading = true
      listOrder(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data
        that.func.portInit(rescode, resmsg, function () {
          getData.orders.forEach((item) => {
            item.type = that.func.notypeTra(item.type)
            item.status = that.func.payStatus(item.status)
            item.period = `${item.year}-${item.month}`
          })
          that.storeList = getData.orders
          that.total = getData.total_page
          that.listLoading = false
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
    // 生成账单
    creatBill () {
      this.isBill = true
    },
    createBills () {
      let that = this
      that.isClick = true
      if (!that.createdBill.year || !that.createdBill.month || !that.createdBill.store_id) {
        that.$message({
          message: '请完整填写表单',
          type: 'error',
        })
        that.isClick = false
      } else {
        let para = Object.assign({}, that.createdBill)
        generate(para).then((res) => {
          let rescode = res.data.rescode
          // let getData = res.data.data
          let resmsg = res.data.resmsg
          that.func.portInit(rescode, resmsg, function () {
            that.$message({
              message: '生成账单成功',
              type: 'success',
            })
            that.createdBill.store_id = ''
            that.diamonthTimes = ''
            that.createdBill.month = ''
            that.createdBill.year = ''
            that.isBill = false
            setTimeout(() => {
              that.isClick = false
            }, 1200)
          })
        }).catch(function (err) {
          console.log(err)
        })
      }
    },
    // 确认审核
    inspectBill () {
      let that = this
      let para = Object.assign({}, that.inspectList)
      that.isclick = true
      that.loadingPush = true
      if (!para.store_id || !para.year || !para.month) {
        that.$message({
          message: '请完整填写表单',
          type: 'error',
        })
        that.isclick = false
        that.loadingPush = false
      } else {
        approve(para).then((res) => {
          let rescode = res.data.rescode
          // let getData = res.data.data
          let resmsg = res.data.resmsg
          that.func.portInit(rescode, resmsg, function () {
            that.$message({
              message: '审核成功',
              type: 'success',
            })
            setTimeout(() => {
              that.isclick = false
            }, 1200)
            that.diainspect = false
            that.loadingPush = false
          })
        }).catch(function (err) {
          console.log(err)
        })
      }
    },
    closeinspect () {
      this.func.clearVul(this.inspectList)
      this.pushmonthTimes = ''
      this.loadingPush = false
      this.isclick = false
    },
    // 推送订单
    pushBills () {
      let that = this
      let para = Object.assign({}, that.pushBill)
      that.isclick = true
      that.loadingPush = true
      if (!para.store_id) {
        that.$message({
          message: '请完整填写表单',
          type: 'error',
        })
        that.isclick = false
        that.loadingPush = false
      } else {
        pushbill(para).then((res) => {
          let rescode = res.data.rescode
          // let getData = res.data.data
          let resmsg = res.data.resmsg
          that.func.portInit(rescode, resmsg, function () {
            that.$message({
              message: '推送账单成功',
              type: 'success',
            })
            setTimeout(() => {
              that.isclick = false
            }, 1200)
            that.dialogPush = false
            that.loadingPush = false
          })
        }).catch(function (err) {
          console.log(err)
        })
      }
    },
    closePush () {
      this.pushBill.store_id = ''
      this.loadingPush = false
      this.isclick = false
    },
    /* 新增账单 */
    handleAdd () {
      let that = this
      that.$router.push({
        path: '/addbill',
      })
    },
    // 测试编辑账单
    handleEdit1 (index, row) {
      let that = this
      if (row.status == '已付款' || row.status == '付款待确认') {
        that.$message({
          message: '该账单已付款，不可修改',
          type: 'error',
        })
      } else if (row.status == '已关闭') {
        that.$message({
          message: '该账单已关闭，不可修改',
          type: 'error',
        })
      } else {
        that.editList.money = row.money
        that.typedialog = row.type
        that.editList.order_id = row.id
        that.handleEdit = true
      }
    },
    submit () {
      let that = this
      let para = Object.assign({}, that.editList)
      if (para.order_id == '' || para.money == '' || para.remark == '') {
        that.$message({
          message: '请完整填写表单',
          type: 'error',
        })
      } else {
        editOrder(para).then((res) => {
          let rescode = res.data.rescode
          let resmsg = res.data.resmsg
          // let getData = res.data.data
          that.func.portInit(rescode, resmsg, function () {
            that.$message({
              message: '修改成功',
              type: 'success',
            })
            that.editList.order_id = ''
            that.editList.money = ''
            that.editList.remark = ''
            that.handleEdit = false
            that.getBill()
          })
        }).catch(function (err) {
          console.log(err)
        })
      }
    },
    getName () {
      let para = {}
      getName(para).then((res) => {
        this.name = res.data.employee.name
      })
    },
    lookInfo (index, row) {
      sessionStorage.setItem('page', JSON.stringify(this.page))
      this.$router.push({
        path: '/householdinfo',
        query: {
          id: row.resident_id,
        },
      })
    },
    // ------------------------- 批量导出 -------------------------
    startTimedE (val) {
      if (val != undefined) {
        this.pushExcel.startYear = val.substr(0, 4)
        this.pushExcel.startMonth = val.substr(5)
        this.pushExcel.startTime = val
      }
    },
    endTimedE (val) {
      if (val != undefined) {
        this.pushExcel.endYear = val.substr(0, 4)
        this.pushExcel.endMonth = val.substr(5)
        this.pushExcel.endTime = val
      }
    },
    getCityd () {
      let that = this
      let para = {}
      getCityList(para).then((res) => {
        let rescode = res.data.rescode
        let getData = res.data.data.cities
        let resmsg = res.data.resmsg
        getData[0] = '请选择'
        that.func.portInit(rescode, resmsg, function () {
          that.cityListd = getData
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
    searchCityd () {
      let that = this
      // that.pushExcel.cityd = that.pushExcel.cityd
      if (that.pushExcel.cityd == '请选择') {
        that.pushExcel.store_id = ''
      }
      that.getStoreInfod()
    },
    // 关闭账单
    closeBill (index, row) {
      let that = this
      let para = {
        order_id: row.id,
      }
      if (row.status == '已关闭') {
        that.$message({
          message: '该账单已关闭，无法再次关闭',
          type: 'error',
        })
      } else if (row.status == '已付款' || row.status == '付款待确认') {
        that.$message({
          message: '该账单已付款，无法关闭',
          type: 'error',
        })
      } else {
        that.$confirm('此操作会使账单关闭', '提示', {
          type: 'warning',
        }).then(() => {
          closeOrder(para).then((res) => {
            if (res.data.rescode == 0) {
              that.$message({
                message: '关闭账单成功',
                type: 'success',
              })
              that.getBill()
            }
          }).catch(function (err) {
            console.log(err)
          })
        }).catch(() => {
          that.listLoading = false
          this.$message({
            type: 'info',
            message: '已取消账单关闭',
          })
        })
      }
    },
    /* 获取门店列表 */
    getStoreInfod () {
      let that = this
      let para = {
        city: that.pushExcel.cityd,
      }
      getStoreList(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data.stores
        that.func.portInit(rescode, resmsg, function () {
          getData.unshift({
            id: '',
            name: '请选择',
          })
          that.storesListd = getData
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
    close () {
      this.func.clearVul(this.pushExcel)
      this.func.clearVul(this.storesListd)
      this.storesListd.length = 0
      this.isclick = false
      this.listLoadings = false
    },
    handleExports () {
      this.handleExport = true
      this.isRecycle = ''
    },
    handlemoney () {
      this.handleExport = true
      this.isRecycle = '1'
    },
    pushExports () {
      let that = this
      let name = ''
      let time = ''
      let para = Object.assign({}, that.pushExcel)
      that.listLoadings = true
      that.isClick = true
      that.func.emptyVul(para, function () {
        that.isclick = false
        that.listLoadings = false
      }, function () {
        that.storesListd.forEach((item) => {
          if (item.id == para.store_id) {
            name = item.name
          }
        })
        time = para.startTime + '--' + para.endTime
        if (!that.isRecycle) {
          oedertoExcel(para).then((res) => {
            if (res.status == 200) {
              let blob = new Blob([res.data ], { type: 'application/octet-stream;charset=utf-8' }) // 创建一个blob对象
              let a = document.createElement('a') // 创建一个<a></a>标签
              a.href = URL.createObjectURL(blob) // response is a blob
              a.download = time + name + '账单' + '.xlsx' // 文件名称
              a.style.display = 'none'
              document.body.appendChild(a)
              a.click()
              a.remove()
              that.$message.success('账单导出成功')
              that.handleExport = false
              that.listLoadings = false
              setTimeout(() => {
                that.isclick = false
              }, 1200)
            }
          })
        } else {
          recycleExcel(para).then((res) => {
            if (res.status == 200) {
              let blob = new Blob([res.data ], { type: 'application/octet-stream;charset=utf-8' }) // 创建一个blob对象
              let a = document.createElement('a') // 创建一个<a></a>标签
              a.href = URL.createObjectURL(blob) // response is a blob
              a.download = time + name + '回款表' + '.xlsx' // 文件名称
              a.style.display = 'none'
              document.body.appendChild(a)
              a.click()
              a.remove()
              that.$message.success('回款表导出成功')
              that.handleExport = false
              that.listLoadings = false
              setTimeout(() => {
                that.isclick = false
              }, 1200)
            }
          })
        }
      })
    },
    selsChange (sels) {
      this.sels = sels
    },

  },
}

</script>
