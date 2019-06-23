<template>
  <el-dialog title="账单详情" :visible.sync="show" width="80%" class="all-box">
    <div class="fx-head-s">
      {{title.store_name}}&nbsp;&nbsp;
      {{title.room_number}}&nbsp;&nbsp;
      {{title.resident_name}}&nbsp;&nbsp;
      {{title.pay_circle}}
    </div>
    <el-row class="fx-head-s">
      <el-col :span="9">应收:￥<span style="color:rgb(231,174,94);">{{ allmoney|money }}</span></el-col>
      <el-col :span="9">已收:￥<span style="color:rgb(231,174,94);">{{ allpayd|money }}</span></el-col>
    </el-row>

    <el-table :data="arrList" border>
      <el-table-column label="费用类型" prop="fee_name">
      </el-table-column>
      <el-table-column label="详细信息" prop="detail" min-width="100">
      </el-table-column>
      <el-table-column label="应收" prop="money">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已收" prop="has_paid">
      </el-table-column>
      <el-table-column label="状态" prop="status">
      </el-table-column>
      <el-table-column label="折扣、优惠券使用情况" prop="status">
        <template slot-scope="scope">
              <span v-if="scope.row.discount_money>0">
                使用优惠券：{{scope.row.discount_money}} 元
              </span>
            </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" width="280">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="billList">
        <el-row class="fx-head-s">流水详情</el-row>
        <el-table :data="billList" border>
        <el-table-column label="流水编号" prop="sub_number">
        </el-table-column>
        <el-table-column label="支付金额" prop="money">
        </el-table-column>
        <el-table-column label="支付时间" prop="pay_date">
        </el-table-column>
        <el-table-column label="支付方式" prop="pay_way">
        </el-table-column>
        <el-table-column label="交易单号" prop="out_trade_no">
        </el-table-column>
        <el-table-column label="凭证" prop="">
            <template slot-scope="scope">
                <el-button
                type="text"
                v-show="scope.row.images.length>0"
                @click="lookCertificate(scope.$index, scope.row)">查看</el-button>
            </template>
        </el-table-column>
        </el-table>
    </div>
    <div class="allCount"></div>
    <el-dialog title="查看交易凭证" :visible.sync="showCertificate" align="center">
        <el-carousel :interval="5000" arrow="always">
            <el-carousel-item v-for="(img,idx) in certificateImgs" :key="idx">
                <img :src="img" alt="" style="width:350px;"/>
            </el-carousel-item>
        </el-carousel>
    </el-dialog>
  </el-dialog>
</template>
<script>
export default {
  props: {
    show: Boolean,
    list: Array,
    billList: Array,
    title: Object,
    data: Object,
    addCostShow: Boolean,
  },
  data() {
    return {
      showCertificate: false,
      certificateImgs: [],
      arrList: [],
    }
  },
  computed: {
    allmoney () {
      let that = this
      let m = 0
      let arr = []
      for (let i = 0; i < that.list.length; i++) {
        if (that.list[i].status != '已关闭') {
          arr.push(that.list[i])
        }
      }
      that.arrList = arr
      for (const fee of arr) {
        m += fee.money
      }
      return m
    },
    allpayd () {
      let m = 0
      for (const fee of this.list) {
        m += fee.has_paid
      }
      return m
    },
    residentId () {
      if (this.data && this.data.resident_id) {
        return this.data.resident_id
      }
      return 0
    }
  },
  mounted() {
    this.changeShowTime()
  },
  methods: {
    lookCertificate(index, row) {
      this.showCertificate = true
      this.certificateImgs = row.images
    },
    changeShowTime() {
      if (this.billList) {
        this.billList.forEach((item) => {
          item.pay_date = this.fxFilter.goTime(item.pay_date)
        })
      }
    }
  },
}
</script>
