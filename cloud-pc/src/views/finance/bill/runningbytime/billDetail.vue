<template>
  <el-dialog title="流水明细" :visible.sync="show" center>
    <div class="fx-head-s"></div>
    <el-table :data="subBillList">
      <el-table-column prop="pay_type" label="支付方式"></el-table-column>
      <el-table-column prop="money" label="支付金额"></el-table-column>
      <el-table-column prop="sub_number" label="子流水号"></el-table-column>
    </el-table>

    <el-table :data="orderList">
      <el-table-column prop="type" label="费用名称">
      </el-table-column>
      <el-table-column prop="money" label="应付金额"></el-table-column>
      <el-table-column prop="pay_circle" label="费用周期"></el-table-column>
      <el-table-column prop="" label="折扣、优惠券使用情况" width="170">
        <template slot-scope="scope" v-for="item in coupon">
          <span v-show='scope.row.type == "住宿服务费"?true:false'><span>{{item.name}}</span></span>
          <p style="margin:0; padding:0">{{scope.row.cou_name}}</p>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="pay_type" label="支付方式"></el-table-column>
      <el-table-column prop="money" label="支付金额"></el-table-column>
      <el-table-column prop="sub_number" label="子流水号"></el-table-column> -->
    </el-table>

    <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" style="width: 100%;height: 40px;">
      <tbody>
        <!--合计-->
        <tr class="el-table__row">
          <td class="">
            <div class="cell" style="padding-left: 20px;">应付合计</div>
          </td>
          <td class="" colspan="4">
            <div class="cell detail-total" style="text-align: center">{{sum}}</div>
          </td>
        </tr>
      </tbody>
    </table>
    <strong>实收金额<span :class="{ span: types }">{{sums}}</span></strong>
  </el-dialog>
</template>

<script>
export default {
  props: {
    data: Object,
    show: Boolean,
  },
  data () {
    return {}
  },
  computed: {
    subBillList () {
      if (this.data && this.data.bill) {
        return this.data.bill
      }
      return []
    },
    orderList () {
      if (this.data && this.data.order) {
        return this.data.order
      }
      return []
    },
  },
}
</script>
