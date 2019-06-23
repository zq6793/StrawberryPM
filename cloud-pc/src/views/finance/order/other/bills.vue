<template>
  <section>
    <!--头部导航信息-->
    <el-form :inline="true" class="fx-table-sort-head">
      <el-form-item size="small">
        <el-radio-group v-model="tabbyname" @change="tabChange">
          <el-radio-button label="汇总"></el-radio-button>
          <el-radio-button label="明细"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="" size="small">
        <city-store-select :route-query="true" @set="refresh"></city-store-select>
      </el-form-item>
      <el-form-item label="" size="small">
        <pay-status-select @set="change_Status"></pay-status-select>
      </el-form-item>
      <el-form-item label="" class="selectl" size="small">
        <el-date-picker type="month" placeholder="请选择日期" @change="monthTime" v-model="monthTimes" value-format="yyyy-MM" size="small"></el-date-picker>
      </el-form-item>
      <el-form-item class="searchs white-el-select" size="small">
        <text-search :options="textSearchOption" :routeQuery="true" @set="refresh"></text-search>
      </el-form-item>
    </el-form>
    <!--账单列表-->
    <el-table v-loading="listLoading" :data="bills" @selection-change="selsChange" border >
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="store_name" label="门店名称" align="center">
      </el-table-column>
      <el-table-column prop="room_number" label="房间号" width="150" align="center">
      </el-table-column>
      <el-table-column prop="resident_name" label="姓名" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="lookInfo(scope.$index, scope.row)">{{scope.row.resident_name}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="pay_circle" label="账单周期" align="center" width="150">
      </el-table-column>
      <el-table-column prop="money" label="总金额(元)" width="150" align="center">
      </el-table-column>
      <el-table-column prop="paid" label="已付金额(元)" width="150" align="center">
      </el-table-column>
      <el-table-column prop="order_status" label="状态" align="center" width="100">
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="openBillDetail(scope.row)">
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination-select :route-query="true" :total="total" @set="refresh"></pagination-select>

    <!-- 推送账单 -->
    <el-dialog title="推送门店账单" v-model="dialogPushs" :visible.sync="dialogPushs" @close="closePush">
      <el-form label-width="68px">
        <el-form-item label="门店名称" class="select">
          <city-store-select @set="handleSetExpStore"></city-store-select>
        </el-form-item>
        <el-button class="comfirs" type="primary" @click="pushBills" :disabled="isclick" v-loading="loadingPush">确认</el-button>
      </el-form>
    </el-dialog>
    <!-- 批量导出 -->
    <el-dialog title="账单导出" :visible.sync="handleExport" center class="dialog" @close="close">
      <el-form size="small">
        <el-form-item label="选择门店">
          <city-store-select @set="handleSetExpStore"></city-store-select>
        </el-form-item>
        <el-form-item label="选择时间" size="small">
          <date-interval-select @set="handleTime"></date-interval-select>
        </el-form-item>
        <el-form-item label="" size="small">
          <el-button type="primary" @click="pushExports" :disabled="isclick" v-loading="listLoadings" class="comfirex">导出</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 导出回款表 -->
    <el-dialog title="回款表导出" :visible.sync="handleExportRecycle" center class="dialog" @close="closeRecycle">
      <el-form size="small">
        <el-form-item label="选择门店">
          <city-store-select @set="handleSetExpStore"></city-store-select>
        </el-form-item>
        <el-form-item label="选择时间" size="small">
          <date-interval-select @set="handleTime"></date-interval-select>
        </el-form-item>
        <el-form-item label="" size="small">
          <el-button type="primary" @click="pushExportRecycle" :disabled="isclick" v-loading="recyclelistLoadings" class="comfirex">导出</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 确认审核 -->
    <el-dialog title="确认审核" :visible.sync="handleAudit" center class="dialog" @close="closeAudit">
      <el-form size="small">
        <el-form-item label="选择门店">
          <city-store-select @set="handleSetExpStore"></city-store-select>
        </el-form-item>
        <el-form-item label="选择日期" class="selectl" size="small">
          <el-date-picker type="month" placeholder="请选择日期" @change="monthTimeAudit" v-model="monthTimesaudit" value-format="yyyy-MM" size="small"></el-date-picker>
        </el-form-item>
        <el-form-item label="" size="small">
          <el-button type="primary" @click="comfirsAudit" :disabled="isclick" v-loading="auditLoadings" class="comfirex">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 生成账单 -->
    <el-dialog title="生成账单" :visible.sync="handleOrder" center class="dialog" @close="closeOrder">
      <el-form size="small">
        <el-form-item label="选择门店">
          <city-store-select @set="handleSetExpStore"></city-store-select>
        </el-form-item>
        <el-form-item label="选择日期" class="selectl" size="small">
          <el-date-picker type="month" placeholder="请选择日期" @change="monthTimeAudit" v-model="monthTimesaudit" value-format="yyyy-MM" size="small"></el-date-picker>
        </el-form-item>
        <el-form-item label="" size="small">
          <el-button type="primary" @click="comfirsOrder" :disabled="isclick" v-loading="orderLoadings" class="comfirex">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--账单详情-->
    <order-detail :show.sync="handleEditBill" :data="detailData" :list.sync="detailList" :title="titleText" @set="changeMoney"></order-detail>
  </section>
</template>
<script type="text/javascript">
import { CityStoreSelect, PaginationSelect, TextSearch, DateIntervalSelect } from '@/components/selects'
import { PayStatusSelect } from '@/components/finance'
import OrderDetail from './orderDetail'
import { oedertoExcel, recycleExcel, getOrder2Detail, pushbill, approve, generate } from '@/api/api'
export default {
  components: {
    CityStoreSelect,
    PaginationSelect,
    TextSearch,
    OrderDetail,
    PayStatusSelect,
    DateIntervalSelect,
  },
  data() {
    return {
      listLoading: false,
      total: 0,
      push_store_id: '',
      order_status: '',
      detailDataLoading: true,
      monthTimes: '',
      monthTimesaudit: '',
      year: '',
      month: '',
      currTime: '',
      pay_circle: '',
      search_input: '',
      bills: '',
      dialogPushs: false,
      handleExport: false,
      handleExportRecycle: false,
      handleEditBill: false,
      handleAudit: false,
      handleOrder: false,
      pushExcel: {
        store_id: '',
        startYear: '',
        startMonth: '',
        endYear: '',
        endMonth: '',
        startTime: '',
        endTime: '',
      },
      audit: {
        store_id: '',
        year: '',
        month: '',
      },
      titleText: {
        store_name: '',
        room_number: '',
        resident_name: '',
        number: '',
      },
      detailData: {},
      detailList: [],
      detailTotal: '',
      textSearchOption: [
        { key: 'room_number', label: '房间号' },
        { key: 'resident_name', label: '姓名' },
      ],
      tabbyname: '汇总',
    }
  },
  computed: {},
  created() {
    this.getBill()
  },
  destroyed() {},
  mounted() {
    this.getCurrTime()
    this.refresh()
  },
  methods: {
    tabChange() {
      switch (this.tabbyname) {
        case '汇总' :
          this.$emit('set', 'other', 'bills')
          break
        case '明细' :
          this.$emit('set', 'other', 'bill')
          break
        default :
          this.$emit('set', 'other', 'bills')
          break
      }
    },
    refresh (val) {
      this.handleEditBill = false
      this.getBill()
    },
    searchAll() {
      this.refresh()
    },
    handleSetExpStore(city, storeId) {
      this.push_store_id = storeId
      this.pushExcel.store_id = storeId
      this.audit.store_id = storeId
    },
    handleTime(begin_time, end_time) {
      this.pushExcel.startTime = begin_time
      this.pushExcel.endTime = end_time
      this.pushExcel.startYear = begin_time.substr(0, 4)
      this.pushExcel.endYear = end_time.substr(0, 4)
      this.pushExcel.startMonth = begin_time.substr(5, 2)
      this.pushExcel.endMonth = end_time.substr(5, 2)
    },
    change_Status(val) {
      this.order_status = val
      this.refresh()
    },
    changeMoney(val, id, circle) {
      if (val) {
        this.refresh()
        let value = {}
        value.resident_id = id
        value.pay_circle = circle
        this.openBillDetail(value)
      }
    },
    getCurrTime() {
      this.currTime = new Date()
      this.monthTimes += this.currTime.getFullYear() + '-'
      this.monthTimes += (this.currTime.getMonth() + 1) < 10 ? '0' + (this.currTime.getMonth() + 1) : (this.currTime.getMonth() + 1)
      this.monthTime(this.monthTimes)
    },
    monthTime(val) {
      if (val) {
        this.year = val.substr(0, 4)
        this.month = val.substr(5, 2)
        this.pay_circle = this.year + '-' + this.month
        this.updateRouteQuery('pay_circle', this.pay_circle)
      }
      this.refresh()
    },
    monthTimeAudit() {
      if (this.monthTimesaudit != undefined) {
        this.audit.year = this.monthTimesaudit.substr(0, 4)
        this.audit.month = this.monthTimesaudit.substr(5, 2)
      }
    },
    getBill() {
      // let that = this
      // let para = this.queryOption()
      // that.listLoading = true
      // if (that.order_status) {
      //   para.order_status = that.order_status
      // }
      // listOrder2(para).then(res => {
      //   that.bills = res.data.items
      //   that.total = res.data.count
      //   that.listLoading = false
      // }).catch(function(err) {
      //   that.listLoading = false
      // })
    },
    lookInfo(index, row) {
      sessionStorage.setItem('page', JSON.stringify(this.page))
      this.$router.push({
        path: '/householdinfo',
        query: {
          id: row.resident_id,
        },
      })
    },
    // 推送账单
    pushBills() {
      let that = this
      let para = {
        store_id: that.push_store_id
      }
      pushbill(para).then(() => {
        that.$message.success('推送账单成功')
      }).catch(err => {
        console.log(err)
      })
    },
    /* 推送账单 */
    handlePushs() {
      this.handleEditBill = false
      this.dialogPushs = true
    },
    /* 批量导出 */
    handleExports() {
      this.handleEditBill = false
      this.handleExport = true
    },
    /* 导出回款表 */
    handlemoney() {
      this.handleEditBill = false
      this.handleExportRecycle = true
    },
    /* 确认审核 */
    handleAudits() {
      this.handleEditBill = false
      this.handleAudit = true
    },
    /* 生成账单 */
    handleOrders() {
      this.handleEditBill = false
      this.handleOrder = true
    },
    // 批量导出
    pushExports() {
      let that = this
      // let name = ''
      let time = ''
      let para = Object.assign({}, that.pushExcel)
      that.func.emptyVul(para, function() {}, function() {
        // that.storesListd.forEach((item) => {
        //   if (item.id == para.store_id) {
        //     name = item.name
        //   }
        // })
        time = para.startYear + '-' + para.startMonth + '--' + para.endYear + '-' + para.endMonth
        oedertoExcel(para).then((res) => {
          if (res.status == 200) {
            let blob = new Blob([res.data], { type: 'application/octet-stream;charset=utf-8' }) // 创建一个blob对象
            let a = document.createElement('a') // 创建一个<a></a>标签
            a.href = URL.createObjectURL(blob) // response is a blob
            a.download = time + '账单' + '.xlsx' // 文件名称
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
      })
    },
    // 导出回款表
    pushExportRecycle() {
      let that = this
      // let name = ''
      let time = ''
      let para = Object.assign({}, that.pushExcel)
      that.func.emptyVul(para, function() {}, function() {
        // that.storesListd.forEach((item) => {
        //   if (item.id == para.store_id) {
        //     name = item.name
        //   }
        // })
        time = para.startYear + '-' + para.startMonth + '--' + para.endYear + '-' + para.endMonth
        recycleExcel(para).then((res) => {
          if (res.status == 200) {
            let blob = new Blob([res.data], { type: 'application/octet-stream;charset=utf-8' }) // 创建一个blob对象
            let a = document.createElement('a') // 创建一个<a></a>标签
            a.href = URL.createObjectURL(blob) // response is a blob
            a.download = time + '回款表' + '.xlsx' // 文件名称
            a.style.display = 'none'
            document.body.appendChild(a)
            a.click()
            a.remove()
            that.$message.success('回款表导出成功')
            that.handleExportRecycle = false
            that.recyclelistLoadings = false
            setTimeout(() => {
              that.isclick = false
            }, 1200)
          }
        })
      })
    },
    // 确认审核
    comfirsAudit() {
      let that = this
      let para = Object.assign({}, that.audit)
      that.func.emptyVul(para, function() {}, function() {
        approve(para).then((res) => {
          that.$message.success('已成功确认审核')
          that.handleAudit = false
          that.auditLoadings = false
          setTimeout(() => {
            that.isclick = false
          }, 1200)
        }).catch(err => {
          console.log(err)
        })
      })
    },
    // 生成账单
    comfirsOrder() {
      let that = this
      let para = Object.assign({}, that.audit)
      that.func.emptyVul(para, function() {}, function() {
        generate(para).then((res) => {
          that.$message.success('生成账单成功')
          that.refresh()
          that.handleOrder = false
          that.orderLoadings = false
        }).catch(err => {
          console.log(err)
        })
      })
    },
    openBillDetail(row) {
      let that = this
      let query = {
        resident_id: row.resident_id,
        pay_circle: row.pay_circle,
      }
      that.titleText = row
      that.detailData = {}
      that.detailList = []
      that.handleEditBill = true
      getOrder2Detail(query).then((res) => {
        that.detailData = res.data
        that.detailList = res.data.items
      }).catch(function(err) {
        console.log(err)
      })
    },
  },
}

</script>
