<template>
  <section class="expense-box">
    <el-form :inline="true" class="fx-table-sort-head">
      <el-form-item size="small">
        <el-radio-group v-model="tabbyname" @change="tabChange">
          <el-radio-button label="汇总"></el-radio-button>
          <el-radio-button label="费用明细"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="" size="small">
        <city-store-select :route-query="true" @set="refresh"></city-store-select>
      </el-form-item>
      <el-form-item label="" size="small">
        <expense-status-select @set="change_Status"></expense-status-select>
      </el-form-item>
      <el-form-item label="" size="small">
        <fee-type-select @set="change_Type"></fee-type-select>
      </el-form-item>
      <el-form-item label="" class="selectl">
        <el-date-picker type="month" placeholder="请选择日期" @change="monthTime" v-model="monthTimes"  value-format="yyyy-MM" size="small"></el-date-picker>
      </el-form-item>
      <el-form-item class="searchs white-el-select">
        <text-search :options="textSearchOption" :routeQuery="true" @set="refresh"></text-search>
      </el-form-item>
    </el-form>
    <el-table :data="expenses" highlight-current-row @selection-change="selsChange" style="width: 100%;" v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="store_name" label="门店名称" align="center" width="210">
      </el-table-column>
      <el-table-column prop="room_number" label="房间号" align="center">
      </el-table-column>
      <el-table-column prop="resident_name" label="姓名" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="lookInfo(scope.$index, scope.row)">{{scope.row.resident_name}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="CreatedAt" label="账单创建时间" width="160" align="center">
      </el-table-column>
      <el-table-column prop="expense_circle" label="费用周期" align="center">
      </el-table-column>
      <el-table-column prop="type" label="费用类型" align="center">
      </el-table-column>
      <el-table-column prop="money" label="金额(元)" width="100" align="center">
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          <span size="small">{{scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope" v-if="(scope.row.status!='已关闭')&&(scope.row.status!='已完成')">
          <el-button type="text" @click="handleEdit1(scope.$index, scope.row)">修改</el-button>
          <el-button size="small" @click="closeBill(scope.$index, scope.row)" style="color: red;" type="text">关闭</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="费用修改" :visible.sync="expenseChange" center class="dialog" @close="closeEdit">
      <el-row :gutter="20">
        <el-col :span="8" class="fee">
          <p>{{expenseType}}</p>
          <el-row :gutter="20">
            <el-col :span="20">
              <el-input size="small" v-model="moneyVal"></el-input>
            </el-col>
            <el-col :span="4">
              <span class="price">元</span>
            </el-col>
          </el-row>
          <el-row class="person">操作人：{{personInfo.name}}</el-row>
        </el-col>
        <el-col :span="16">
          <p>修改原因</p>
          <el-row>
            <el-input
            type="textarea"
            :rows="3"
            v-model="textReason"
            placeholder="请填写修改原因"
            :autosize="{ minRows:3 }"></el-input>
          </el-row>
          <el-button type="primary" @click="submitFeeChange">提交</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <pagination-select :route-query="true" :total="total" @set="refresh"></pagination-select>
  </section>
</template>
<script type="text/javascript">
import { CityStoreSelect, PaginationSelect, TextSearch } from '@/components/selects'
import { ExpenseStatusSelect, FeeTypeSelect } from '@/components/finance'
import { listOrderExpense, getName, editOrder, closeOrder } from '@/api/api'
export default {
  components: {
    CityStoreSelect,
    PaginationSelect,
    TextSearch,
    ExpenseStatusSelect,
    FeeTypeSelect,
  },
  data() {
    return {
      listLoading: false,
      total: 0,
      pay_status: '',
      monthTimes: '',
      year: '',
      month: '',
      currTime: '',
      expenses: [],
      pay_type: '',
      textSearchOption: [
        { key: 'room_number', label: '房间号' },
        { key: 'resident_name', label: '姓名' },
      ],
      expenseChange: false,
      moneyVal: 0,
      textReason: '',
      expenseType: '',
      personInfo: {},
      submitOption: {
        order_id: 0,
        money: 0,
        remark: '',
      },
      tabbyname: '费用明细',
    }
  },
  mounted() {
    this.clearRouteQuery()
    this.getCurrTime()
  },
  methods: {
    tabChange() {
      switch (this.tabbyname) {
        case '汇总' :
          this.$emit('set', 'renter', 'bills')
          break
        case '费用明细' :
          this.$emit('set', 'renter', 'bill')
          break
        default :
          this.$emit('set', 'renter', 'bills')
          break
      }
    },
    refresh () {
      this.getExpenses()
    },
    searchAll() {
      this.refresh()
    },
    // 选择付款状态
    change_Status(val) {
      this.updateRouteQuery('status', val)
      this.refresh()
    },
    // 选择费用类型
    change_Type(val) {
      this.updateRouteQuery('type', val)
      this.refresh()
    },
    getCurrTime() {
      this.currTime = new Date()
      this.monthTimes = this.currTime
      this.year = this.currTime.getFullYear()
      this.month = (this.currTime.getMonth() + 1) < 10 ? (this.currTime.getMonth() + 1) : (this.currTime.getMonth() + 1)
      this.updateRouteQuery('year', this.year)
      this.updateRouteQuery('month', this.month)
      this.refresh()
    },
    monthTime(val) {
      if (val) {
        this.year = val.substr(0, 4)
        this.month = val.substr(5, 2)
        this.updateRouteQuery('year', this.monthTimes.substr(0, 4))
        this.updateRouteQuery('month', this.monthTimes.substr(5, 2))
      } else {
        this.updateRouteQuery('year', '')
        this.updateRouteQuery('month', '')
      }
      this.refresh()
    },
    getExpenses() {
      let that = this
      let para = this.queryOption()
      that.listLoading = true
      listOrderExpense(para).then(res => {
        that.expenses = res.data.items
        that.total = res.data.count
        that.expenses.forEach(item => {
          item.CreatedAt = this.fxFilter.goTime(item.CreatedAt)
          item.month = (item.month < 10) ? '0' + item.month : item.month
          item.expense_circle = item.year + '-' + item.month
        })
        that.listLoading = false
      }).catch(function(err) {
        that.listLoading = false
      })
    },
    // 修改
    handleEdit1 (idx, row) {
      let that = this
      this.expenseChange = true
      getName().then((res) => {
        that.personInfo = res.data.employee
      }).catch(err => {
        console.log(err)
      })
      this.moneyVal = row.money
      this.submitOption.order_id = row.ID
      this.expenseType = row.type
    },
    // 修改确认提交
    submitFeeChange() {
      let that = this
      that.submitOption.money = that.moneyVal
      that.submitOption.remark = that.textReason
      let para = Object.assign({}, that.submitOption)
      that.func.emptyVul(para, function() {}, function() {
        editOrder(para).then(() => {
          that.$message.success('提交成功')
          that.expenseChange = false
          that.refresh()
        }).catch(err => {
          console.log(err)
        })
      })
    },
    // 关闭
    closeBill (idx, row) {
      let that = this
      let para = {
        order_id: row.ID
      }
      if (row.status != '已关闭') {
        that.$confirm('确认关闭吗？', '提示', {}).then(() => {
          closeOrder(para).then((res) => {
            if (res.rescode == 0) {
              that.$message.success('已关闭账单')
              that.refresh()
            } else {
              that.$message.error(res.resmsg)
            }
          }).catch(err => {
            console.log(err)
          })
        }).catch(function(err) {
          that.$message('已取消关闭')
        })
      }
    },
  },
}

</script>
