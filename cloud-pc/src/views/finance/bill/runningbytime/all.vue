<template>
  <section class="all-box">
    <el-form :inline="true" class="fx-table-sort-head">
      <el-form-item size="small">
        <el-radio-group v-model="runninggbytimes" @change="tabChange">
          <el-radio-button label="汇总"></el-radio-button>
          <el-radio-button label="明细"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="" size="small">
        <city-store-select :route-query="true" @set="refresh"></city-store-select>
      </el-form-item>
      <el-form-item size="small" label="">
        <pay-way-select :route-query="true" @set="refresh"></pay-way-select>
      </el-form-item>
      <el-form-item label="" size="small">
        <date-interval-select :route-query="true" @set="refresh"></date-interval-select>
      </el-form-item>
      <el-form-item size="small">
        <text-search :options="textSearchOption" :routeQuery="true" @set="refresh"></text-search>
      </el-form-item>
      <el-form-item size="small">
        <!-- <el-button type="primary" @click="handleExports" size="small">批量导出</el-button> -->
      </el-form-item>
      <el-form-item size="small">
        <el-button type="primary" @click="handleExportBill" size="small">导出流水报表</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="billFlows" @selection-change="selsChange" style="width: 100%;" v-loading="listLoading" border>
      <el-table-column prop="sequence_number" label="流水号" align="center">
      </el-table-column>
      <el-table-column prop="store_name" label="门店名称" width="190" align="center">
      </el-table-column>
      <el-table-column prop="room_number" label="房间号" align="center" width="60">
      </el-table-column>
      <el-table-column prop="resident_name" label="姓名" align="center" width="80">
        <template slot-scope="scope">
          <span  style="cursor: pointer;">{{scope.row.resident_name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sum_money" label="金额" align="center">
      </el-table-column>
      <el-table-column prop="pay_ways" label="支付方式" align="center">
      </el-table-column>
      <el-table-column prop="transaction_numbers" label="交易单号" align="center">
      </el-table-column>
      <el-table-column prop="CreatedAt" label="确认支付时间" width="160" align="center">
      </el-table-column>
      <el-table-column prop="employee_name" label="经办人" align="center">
      </el-table-column>
      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="scope">
          <!-- <span class="textchange" @click="lookReceipts(scope.row)">查看凭证</span> -->
          <el-button type="text" @click="lookInfo(scope.$index, scope.row)">查看</el-button>
          <!-- <el-button type="text" v-if="scope.row.receipt_url!=''" @click="lookReceipt(scope.row.receipt_url)">电子收据</el-button> -->
          <el-button type="text" @click="lookReceipt(scope.row.ID)">电子收据</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination-select :route-query="true" :total="total" @set="refresh"></pagination-select>

    <!-- 查看信息 -->
    <el-dialog title="查看电子收据" :visible.sync="showReceiptImg" align="center">
      <img :src="receiptImg" alt="" style="width:350px;"/>
    </el-dialog>

    <el-dialog title="查看交易凭证" :visible.sync="showCertificate" align="center">
      <el-carousel :interval="5000" arrow="always" height="630px">
        <el-carousel-item v-for="(img,idx) in certificateImgs" :key="idx" style="height:auto">
          <img :src="img" alt="" style="width:350px;"/>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>

    <el-dialog title="流水明细" :visible.sync="billflowInfos" center>
      <div class="fx-head-s">
      {{currInfo.store_name}}&nbsp;&nbsp;
      {{currInfo.room_number}}&nbsp;&nbsp;
      {{currInfo.resident_name}}&nbsp;&nbsp;
      {{currInfo.CreatedAt}}
      </div>
      <div class="fx-head-s">流水信息</div>
      <el-table :data="billflowOne.bill" border>
        <el-table-column prop="pay_way" label="支付方式" width="80"></el-table-column>
        <el-table-column prop="money" label="支付金额" width="80"></el-table-column>
        <el-table-column prop="sub_number" label="子流水号"></el-table-column>
        <el-table-column prop="out_trade_no" label="交易单号"></el-table-column>
        <el-table-column prop="pay_date" label="支付日期"></el-table-column>
        <el-table-column prop="" label="交易凭证" width="80">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-show="scope.row.images.length>0"
              @click="lookCertificate(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="100"></el-table-column>
      </el-table>
      <div class="allCount">流水合计：{{billflowOne.bill_money}}</div>
      <div class="allCount" v-if="billflowOne.pre_money>0">使用预存金：{{billflowOne.pre_money}}</div>
      <div v-if="hasInputOrder">
        <div class="fx-head-s">账单信息(收入)</div>
        <el-table :data="billflowOne.input_order" border>
          <el-table-column prop="type" label="费用名称">
          </el-table-column>
          <el-table-column prop="has_paid" label="金额"></el-table-column>
          <el-table-column prop="expense_circle" label="费用周期"></el-table-column>
          <el-table-column prop="" label="折扣、优惠券使用情况" width="170">
            <template slot-scope="scope">
              <span v-if="scope.row.coupon">
                <!-- {{scope.row.coupon.coupon_type.name}} -->
                使用优惠券：{{scope.row.discount_money}} 元
              </span>
              <!-- <p style="margin:0; padding:0">{{scope.row.coupon.cou_name}}</p> -->
            </template>
          </el-table-column>
          <!-- <el-table-column prop="sub_number" label="流水合计"></el-table-column> -->
        </el-table>
        <div class="allCount">收入合计: {{billflowOne.input_paid}}</div>
      </div>
      <div v-if="hasOutputOrder">
        <div class="fx-head-s">账单信息(支出)</div>
        <el-table :data="billflowOne.output_order" border>
          <el-table-column prop="type" label="费用名称">
          </el-table-column>
          <el-table-column prop="has_paid" label="金额"></el-table-column>
          <el-table-column prop="expense_circle" label="费用周期"></el-table-column>
          <!-- <el-table-column prop="sub_number" label="流水合计"></el-table-column> -->
        </el-table>
        <div class="allCount">支出合计：- {{billflowOne.output_paid}}</div>
      </div>
      <!-- <strong>应付合计<span :class="{ span: types }"> {{billflowOne.sum_money}}</span></strong> -->
      <!-- <strong>实收金额<span :class="{ span: types }"> {{billflowOne.sum_paid}}</span></strong> -->
    </el-dialog>
  </section>
</template>
<script>
import { CityStoreSelect, PaginationSelect, DateIntervalSelect, TextSearch } from '@/components/selects'
import { PayWaySelect } from '@/components/finance'
import { billList1, showBill1, billListExcel, billSeal, billListExcelBill } from '@/api/api'
// import { billDetail } from './billDetail'
export default {
  components: {
    CityStoreSelect,
    DateIntervalSelect,
    PayWaySelect,
    PaginationSelect,
    TextSearch,
    // billDetail,
  },
  data() {
    return {
      // 收据
      showReceiptImg: false,
      receiptImg: '',
      listLoading: false,
      // 交易凭证
      showCertificate: false,
      certificateImgs: [],
      billflowInfos: false,
      billFlows: [],
      total: 0,
      billflowOne: {},
      textSearchOption: [
        { key: 'room_number', label: '房间号' },
        { key: 'resident_name', label: '姓名' },
      ],
      startTime: '',
      endTime: '',
      currInfo: {},
      runninggbytimes: '汇总',
      hasInputOrder: false,
      hasOutputOrder: false,
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    tabChange() {
      this.$emit('set', 'date', 'one')
    },
    refresh () {
      this.getBillflow()
    },
    getBillflow() {
      let that = this
      let para = this.queryOption()
      that.listLoading = true
      billList1(para).then((res) => {
        for (const item of res.data.items) {
          item.CreatedAt = that.fxFilter.goTime(item.CreatedAt)
        }
        that.billFlows = res.data.items
        that.total = res.data.count
        that.listLoading = false
      }).catch(err => {
        console.log(err)
        that.listLoading = false
      })
    },
    lookReceipt(id) {
      let that = this
      that.showReceiptImg = true
      let para = {
        id: id
      }
      billSeal(para).then((res) => {
        let imgData = res.data.data
        that.receiptImg = imgData.url
      }).catch(err => {
        console.log(err)
      })
    },
    lookCertificate(index, row) {
      this.showCertificate = true
      this.certificateImgs = row.images
    },
    // dialog 查看信息
    lookInfo(index, row) {
      let that = this
      that.billflowOne = {}
      let para = {
        sequence_number: row.sequence_number,
        resident_id: row.resident_id,
      }
      row.CreatedAt = that.fxFilter.goTime(row.CreatedAt)
      that.currInfo = row
      that.hasInputOrder = false
      that.hasOutputOrder = false
      showBill1(para).then((res) => {
        that.billflowOne = res.data
        if (that.billflowOne.input_order.length > 0) {
          that.billflowOne.input_order.forEach((item) => {
            item.month = (item.month < 10) ? '0' + item.month : item.month
            item.expense_circle = item.year + '-' + item.month
          })
          that.hasInputOrder = true
        }
        if (that.billflowOne.output_order.length > 0) {
          that.billflowOne.output_order.forEach((item) => {
            item.month = (item.month < 10) ? '0' + item.month : item.month
            item.expense_circle = item.year + '-' + item.month
            item.has_paid = '-' + item.has_paid
          })
          that.hasOutputOrder = true
        }
        that.billflowOne.bill.forEach((item) => {
          item.pay_date = that.fxFilter.goTime(item.pay_date)
        })
        that.billflowInfos = true
      }).catch(function(err) {
        console.log(err)
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
        billListExcel(para).then((res) => {
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
    /* 导出流水报表 */
    handleExportBill () {
      let that = this
      let time = ''
      let para = this.queryOption()
      that.startTime = para.begin_time.substr(0, 10)
      that.endTime = para.end_time.substr(0, 10)
      time = that.startTime + '--' + that.endTime
      that.$confirm('确认导出选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        billListExcelBill(para).then((res) => {
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
    }
  },
}

</script>
