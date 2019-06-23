<template>
<section>
<div class="contractinfo" v-if="residentList.contract.rent_type == ''">
<div class="fx-head-ss">{{residentList.contract.CreatedAt}}入住合同</div>
<el-form label-width="100px">
<!--   <el-form-item label="合同编号">
  </el-form-item> -->
  <el-form-item label="合同编号" size="small">
    <span> {{residentList.contract.contract_id}}</span>
  </el-form-item>
  <el-form-item label="房间地址" size="small">
    <span>
      {{residentList.store_name}}{{residentList.room.number}}
    </span>
  </el-form-item>
  <el-form-item label="签约日期" size="small">
    <span> {{residentList.contract.CreatedAt}} </span>
  </el-form-item>
  <el-form-item label="合同周期" size="small">
    <span>{{residentList.resident.begin_time}}--{{residentList.resident.end_time}}</span>
  </el-form-item>
  <el-form-item label="解除时间" size="small">
    <span>{{residentList.resident.refund_time}}</span>
  </el-form-item>
  <el-form-item label="状态" size="small">
    <span>{{residentList.contract.status}}</span>
  </el-form-item>
  <el-form-item label="租金" size="small">
    <span>{{residentList.resident.real_rent_money}}元/月</span>
  </el-form-item>
  <el-form-item label="付款方式" size="small">
    <span>{{residentList.resident.pay_frequency}}</span>
  </el-form-item>
  <el-form-item label="物业服务费" size="small">
    <span>{{residentList.resident.real_property_costs}}</span>
  </el-form-item>
  <el-form-item label="其他押金" size="small">
    <span>{{residentList.resident.tmp_deposit}}</span>
  </el-form-item>
  <el-form-item label="押金" size="small">
    <span>{{residentList.resident.deposit_money}}</span>
  </el-form-item>
</el-form>
</div>
<div class="reserve" v-if="residentList.contract.rent_type == 'RESERVE'">
<div class="fx-head-s">{{residentList.created_at}}预定合同</div>
  <el-form-item label="合同编号" size="small">
    <span>{{residentList.contract.contract_id}}</span>
  </el-form-item>
  <el-form-item label="签约人" size="small">
    <span>{{residentList.resident.name}}</span>
  </el-form-item>
  <el-form-item label="联系方式" size="small">
    <span>{{residentList.resident.phone}}</span>
  </el-form-item>
  <el-form-item label="证件类型" size="small">
    <span>{{residentList.resident.card_type}}</span>
  </el-form-item>
  <el-form-item label="证件号码" size="small">
    <span>{{residentList.resident.card_number}}</span>
  </el-form-item>
  <el-form-item label="房间地址" size="small">
    <span>{{residentList.store_name}}{{residentList.room.number}}
    </span>
  </el-form-item>
  <el-form-item label="预定时间" size="small">
    <span>{{residentList.resident.book_time}}</span>
  </el-form-item>
  <el-form-item label="定金(￥)" size="small">
    <span>{{residentList.resident.book_money}}</span>
  </el-form-item>
  <el-form-item label="起租日期" size="small">
    <span>{{residentList.resident.reserve_begin_time}}</span>
  </el-form-item>
  <el-form-item label="合租时长" size="small">
    <span>{{residentList.resident.reserve_contract_time}}月</span>
  </el-form-item>
  <el-form-item label="月租原价" size="small">
    <span>{{residentList.resident.rent_price}}</span>
  </el-form-item>
  <el-form-item label="物业服务费" size="small">
    <span>{{residentList.resident.property_price}}</span>
  </el-form-item>
  <el-form-item label="合同类型" size="small">
    <span>{{residentList.contract.type}}</span>
  </el-form-item>
  <el-form-item label="签约状态" size="small">
    <span>{{residentList.contract.status}}</span>
  </el-form-item>
  <el-form-item label="特别条款" size="small">
    <span>{{residentList.resident.reserve_special_term}}</span>
  </el-form-item>
  <el-form-item label="备注" size="small">
    <span>{{residentList.resident.remark}}</span>
  </el-form-item>
</div>
<div class="fx-head-s" v-if="residentList.contract.length == 0">暂时没有合同信息</div>
</section>
</template>
<script>
import { residentInfoDetail } from '@/api/api'
export default {
  data () {
    return {
      basicList: {},
      residentid: '',
      residentList: {},
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
    this.getOperation()
  },
  methods: {
    getOperation () {
      let that = this
      that.listLoading = true
      residentInfoDetail(that.residentid).then((res) => {
        let getData = res.data
        that.residentList = getData
        if (getData != '') {
          getData.contract.forEach(item => {
            item.CreatedAt = that.fxFilter.goTime(item.CreatedAt)
            item.status = that.func.constatus(item.status)
            that.residentList.contract = item
          })
          that.residentList.resident.begin_time = that.fxFilter.date(getData.resident.begin_time)
          that.residentList.resident.end_time = that.fxFilter.date(getData.resident.end_time)
          // getData.money = '押' + getData.deposit_month + '付' + getData.pay_frequency
          if (getData.resident.refund_time == null) {
            that.residentList.resident.refund_time = '未解除'
          } else {
            that.residentList.resident.refund_time = that.fxFilter.goTime(getData.resident.refund_time)
          }
          // getData.card_type = that.func.cardTypeT(getData.card_type)
          // getData.type = that.func.contype(getData.type)
        }
      }).catch(function (err) {
        console.log(err)
      })
    },
  },
}
</script>
