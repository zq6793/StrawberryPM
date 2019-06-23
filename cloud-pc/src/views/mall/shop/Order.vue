<template>
  <section class="fx-pages-main commodity-order">
    <el-form :inline="true" class="fx-table-sort-head">
      <el-form-item label="" prop="begin_time" size="small">
        <el-date-picker v-model="filters.begin_time" type="date" placeholder="请选择日期" @change="beginTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="至" prop="end_time" size="small">
        <el-date-picker v-model="filters.end_time" type="date" placeholder="请选择日期" @change="endTime"></el-date-picker>
      </el-form-item>
      <el-form-item size="small">
        <el-input v-model="filters.number" type="text" placeholder="请输入订单号" @keyup.enter="commodityOrder">
         <template slot="append" class="iconfont icon-ali-sousuo" @click="searchAll">
          搜索
        </template>
        </el-input>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="commodityList" highlight-current-row @selection-change="selsChange" style="width: 100%;" v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column prop="number" label="订单号" width="80">
      </el-table-column>
      <el-table-column prop="customer_id" label="客户名称">
      </el-table-column>
      <el-table-column prop="goods_money" label="商品金额">
      </el-table-column>
      <el-table-column prop="goods_money" label="支付金额">
      </el-table-column>
      <el-table-column prop="address_id" label="地址">
      </el-table-column>
      <el-table-column prop="status" label="状态">
      </el-table-column>
      <el-table-column label="详情" width="53">
        <template slot-scope="scope">
          <span size="small" @click="handleEdit(scope.$index, scope.row)" class= "textchange">查看</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹出的订单详情 -->
    <el-dialog v-model="orderDetails" :close-on-click-modal="false" title="订单详情">
      <el-form :model="detail" class="white-el-select">
        <el-form-item label="订单号：" :label-width="formWidt">
          <el-input v-model="detail.number" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="客户姓名：" :label-width="formWidt">
          <el-input v-model="detail.customer.name" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="商品名称：" :label-width="formWidt">
          <el-input v-model="detail.goods_name" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="商品数量：" :label-width="formWidt">
          <el-input v-model="detail.goods_quantity" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="商品单价：" :label-width="formWidt">
          <el-input v-model="detail.goods_money" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="商品金额：" :label-width="formWidt">
          <el-input v-model="detail.pay_money" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="支付金额：" :label-width="formWidt">
          <el-input v-model="detail.goods_quantity*detail.pay_money" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="地址：" :label-width="formWidt">
          <el-input v-model="detail.address.apartment+'-'+detail.address.building+'-'+detail.address.room_number" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total">
      </el-pagination>
    </el-col>
  </section>
</template>
<script type="text/javascript">
import { goodOrderList, goodsDetail } from '@/api/api'
export default {
  data () {
    return {
      filters: {
        begin_time: '',
        end_time: '',
        number: '',
      },
      commodityList: [],
      total: 0,
      page: 1,
      listLoading: false,
      begin_time: '' /* 查询需要 开始日期 */,
      end_time: '' /* 查询需要 结束日期 */,
      orderDetails: false /* 是否显示订单详情 */,
      detail: {
        id: '',
        number: '',
        customer: {
          name: '',
        },
        goods_name: '',
        goods_quantity: '',
        goods_money: '',
        pay_money: '',
        address: {
          apartment: '',
          building: '',
          room_number: '',
        },
      },
      formWidt: '130px',
    }
  },

  mounted () {
    this.commodityOrder()
  },

  methods: {
    handleCurrentChange (val) {
      this.page = val
      this.commodityOrder()
    },

    /* 获取商品订单 */
    commodityOrder () {
      let that = this
      let para = {
        page: that.page,
        begin_time: that.begin_time,
        end_time: that.end_time,
        number: that.filters.number,
      }
      that.listLoading = true
      goodOrderList(para).then(res => {
        let rescode = res.data.rescode
        let getData = res.data.data
        let resmsg = res.data.resmsg
        this.func.portInit(rescode, resmsg, function () {
          for (let key in getData.list) {
            if (getData.list[key].address_id === getData.list[key].address.id) {
              getData.list[key].address_id =
                  getData.list[key].address.apartment + '-' + getData.list[key].address.building + '-' +
                  getData.list[key].address.room_number
            }
            if (getData.list[key].customer_id === getData.list[key].customer.id) {
              getData.list[key].customer_id = getData.list[key].customer.name
            }
            getData.list[key].status = that.states(getData.list[key].status)
          }
          that.commodityList = getData.list
          that.total = getData.count
          that.listLoading = false
        })
      }).catch(function (err) {
        console.log(err)
      })
    },

    /* 转换状态 */
    states (text) {
      let status = ''
      if (text === 'PENDING') {
        status = '已下单'
      } else if (text === 'PAYMENT') {
        status = '已付款'
      } else if (text === 'DELIVERED') {
        status = '配送中'
      } else if (text === 'COMPLETED') {
        status = '已完成'
      }
      if (text === 'CANCEL') {
        status = '已取消'
      } else {}

      return status
    },

    /* 选择开始日期 */
    beginTime (val) {
      this.begin_time = val
    },

    /* 结束日期 */
    endTime (val) {
      this.end_time = val
    },

    /* 详情 */
    handleDetail (index, row) {
      let that = this
      let para = {
        id: row.id,
      }
      that.orderDetails = true
      goodsDetail(para).then(res => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        that.func.portInit(rescode, resmsg, function () {
          that.detail = res.data.data[0]
        })
      }).catch(function (err) {
        console.log(err)
      })
    },

    selsChange (sels) {
      this.sels = sels
    },
  },
}
</script>
