<template>
<section>
<!--未付款金额-->
<el-card class="card bill-card" v-for="item in paidList" :key="item">
<div slot="header" class="clearfix">
<span>{{item.pay_circle}}</span>
</div>
<div v-for="param in item.fees" :key="param" class="bill-card-item">
<span class="bill-card-type">{{param.type}}</span>
<span class="bill-card-money">{{param.money}}</span>
<span class="bill-card-status">{{param.status}}</span>
</div>
<div class="clearfix bottom bill-card-foot">
<span>总金额</span>
<strong class="sumprice">{{item.money}}</strong>
</div>
</el-card>
<!--已付款金额-->
<!-- <el-card class="card bill-card" v-for="(item, value) in paidList" :key="item">
<div slot="header" class="clearfix">
<span>{{value}}</span>
</div>
<div v-for="param in item.orders" :key="param" class="bill-card-item">
<span class="bill-card-type">{{param.type}}</span>
<span class="bill-card-money">{{param.money}}</span>
<span class="bill-card-status">{{param.status}}</span>
</div>
<div class="clearfix bottom bill-card-foot">
<span>总金额</span>
<strong class="sumprice">{{item.total_money}}</strong>
</div>
</el-card> -->
</section>
</template>
<script>
import { listOrder2 } from '@/api/api'
export default {
  data () {
    return {
      basicList: {},
      residentid: '',
      paidList: {},
      nopaidList: {}
    }
  },
  created () {
    this.residentid = this.$route.query.id
  },
  computed: {
    headers () {
      return {
        Token: sessionStorage.getItem('token'),
      }
    },
  },
  mounted () {
    this.getMoneyInfo()
  },
  methods: {
    getMoneyInfo () {
      let that = this
      let para = {
        resident_id: that.residentid,
      }
      listOrder2(para).then(res => {
        that.paidList = res.data.items
        that.listLoading = false
      }).catch(function(err) {
        that.listLoading = false
      })
    },
    // 状态转化
    statuTar (status) {
      if (status == 'COMPLATE') {
        status = '已支付'
      } else {
        status = '未支付'
      }
      return status
    },
  }
}
</script>
<style scoped="scoped">
/*账单列表信息*/
.bill-card{
  width: 300px;
  height: 320px;
  font-size:14px;
  float: left;
  margin-right: 10px;
  position: relative;
  margin-top:10px;
}
.bill-card .el-card__header{
  font-size:16px;
}
.bill-card .bill-card-item{
  line-height: 26px;
}
.bill-card .bill-card-type{
  color: #606266;
  padding-right: 20px;
  width: 70px;
  display: inline-block;
}
.bill-card .bill-card-money{
  color: #606266;
  width: 70px;
  padding-right: 20px;
  display: inline-block;
}
.bill-card .bill-card-status{
 color: #E6A23C;
  width: 60px;
}
.bill-card .bill-card-foot{
  margin-top: 13px;
  color:#606266;
  position: absolute;
  bottom: 30px
}
.bill-card .bill-card-foot strong{
  font-size:16px;
  color:#F56C6C;
}
</style>
