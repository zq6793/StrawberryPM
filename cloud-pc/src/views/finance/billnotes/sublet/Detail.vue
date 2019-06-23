<template>
  <section class="fx-pages-main lookCheckouts" v-loadimg="listLoading">
   <el-form :inline="true" class="fx-table-sort-head">
      <el-form-item size="small">
      <el-button type="primary" @click="backlist">返回</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="20">
      <el-col :span="10">
        <div class="fx-head-s">账单信息</div>
        <!-- <div class="clearfix bottom bill-card-foot">
            <span>应退款总额:</span>
            <strong class="sumprice">{{ refund_total }}</strong>
        </div> -->
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="原合同信息:" name="1">
            <el-form label-width="160px">
              <el-form-item label="合同编号:" v-if="resident.contract.length>0" size="small">
                {{ resident.contract[0].contract_id }}
              </el-form-item>
              <el-form-item label="住户姓名:" size="small">
                {{ resident.resident.name }}
              </el-form-item>
              <el-form-item label="联系方式:" size="small">
                {{ resident.resident.phone}}
              </el-form-item>
              <el-form-item label="合同周期:" size="small">
                {{ resident.resident.begin_time.substr(0, 10) }} — {{ resident.resident.end_time.substr(0, 10) }}
              </el-form-item>
              <el-form-item label="住宿服务费(￥/月):" size="small">
                {{ resident.resident.real_rent_money }} 元
              </el-form-item>
              <el-form-item label="物业服务费(￥/月):" size="small">
                {{ resident.resident.real_property_costs }} 元
              </el-form-item>
              <el-form-item label="押金(￥):" size="small">
                {{ resident.deposit_rent }} 元
              </el-form-item>
              <el-form-item label="其他押金(￥):" size="small">
                {{ resident.deposit_tmp }} 元
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="未缴费账单" name="2">
            <div v-for="item in unpaid" :key="item.id" class="bill-card-item">
            <span class="bill-card-type">{{item.type}}</span>
            <span class="bill-card-status">{{item.begin_time}}--{{item.end_time}}</span>
            <span class="bill-card-money">{{item.money}} 元</span>
            </div>
            <div class="clearfix bottom bill-card-foot">
            <span>未缴费总额:</span>
            <strong class="sumprice">{{ unpaid_total }} 元</strong>
            </div>
          </el-collapse-item>
          <el-collapse-item title="已缴费账单" name="3">
            <div v-for="item in paid" :key="item.id" class="bill-card-item">
            <span class="bill-card-type">{{item.type}}</span>
            <span class="bill-card-status">{{item.begin_time}} -- {{item.end_time}}</span>
            <span class="bill-card-money">{{item.money}} 元</span>
            </div>
            <div class="clearfix bottom bill-card-foot">
            <span>已缴费总额:</span>
            <strong class="sumprice">{{ paid_total }} 元</strong>
            </div>
            <div class="fx-head-ss">退款金额:￥
              <strong class="sumprice">{{ refund_total }}元</strong>
            </div>
          </el-collapse-item>
          <!-- <el-collapse-item title="额外退费" name="4"> -->
            <!-- <div v-for="item in paid" :key="item.id" class="bill-card-item">
            <span class="bill-card-type">{{item.type}}</span>
            <span class="bill-card-money">{{item.money}} 元</span>
            <span class="bill-card-status">{{item.remark}}</span>
            </div> -->
          <!-- </el-collapse-item> -->
        </el-collapse>
      </el-col>
      <el-col :span="12" :offset="2">
        <div class="fx-head-ss">退款银行卡</div>
        <el-form label-width="120px">
        <el-form-item label="姓名:" size="small">
          <span>{{ record.account }}</span>
        </el-form-item>
        <el-form-item label="卡号:" size="small">
          <span>{{ record.bank_card_number }}</span>
        </el-form-item>
        <el-form-item label="开户行:" size="small">
          <span>{{ record.bank }}</span>
        </el-form-item>
        <el-form-item label="银行卡照片:" size="small">
          <el-button type="text" @click="centerDialogVisible = true">
            <img :src="record.bank_card_front_img" alt="" style="height:40px">
          </el-button>
          <el-button type="text" @click="centerbackDialogVisible = true">
            <img :src="record.bank_card_back_img" alt="" style="height:40px">
          </el-button>
        </el-form-item>
        <div class="fx-head-ss">退款流水</div>
    <el-form-item label="银行转账流水号:" size="small">
          <el-col :span="8">
          <el-input type="text" placeholder="请必须输入支付流水单号" v-model="record.bank_sequence" :disabled='record.status == "COMPLETED"'></el-input>
          </el-col>
          <el-col :span="12" class="fx-text-tips">
            打款完成请输入银行转账流水号
          </el-col>
        </el-form-item>
        <el-form-item label="实际退款金额:" size="small">
          <el-col :span="8">
            <el-input type="text" placeholder="请输入实际应退金额" v-model="refund_paid_e" :disabled='record.status == "COMPLETED"' ></el-input>
          </el-col>
          <el-col :span="12" class="fx-text-tips">
            应退金额必须为数字
          </el-col>
        </el-form-item>
        <el-form-item label="备注信息:" size="small">
          <el-col :span="12">
          <el-input type="textarea" :rows="6" placeholder="请填写备注信息" v-model="record.accountant_remark" :disabled='record.status == "COMPLETED"'>
          </el-input>
          </el-col>
        </el-form-item>
        <el-form-item  v-show='record.status != "COMPLETED"' label="" size="small">
          <el-button type="primary" @click="submit" v-loading="listLoadings">退款</el-button>
        </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-dialog title="银行卡信息" :visible.sync="centerDialogVisible" center>
      <img :src="record.bank_card_front_img" alt="" style="width:400px">
    </el-dialog>
    <el-dialog title="银行卡信息" :visible.sync="centerbackDialogVisible" center>
      <img :src="record.bank_card_back_img" alt="" style="width:400px">
    </el-dialog>
  </section>
</template>
<script type="text/javascript">
import { subletDetail, residentInfoDetail, subletRefund } from '@/api/api'
export default {
  data () {
    return {
      activeNames: ['1', '2', '3', '4'],
      listLoading: false,
      listLoadings: false,
      centerDialogVisible: false,
      centerbackDialogVisible: false,
      unpaid: {},
      unpaid_total: 0,
      paid: {},
      paid_total: 0,
      exrefund: {},
      exrefund_total: 0,
      refund_total: 0,
      refund_paid_e: 0,
      subletId: '',
      record: {},
      isShow: false,
      resident: {},
    }
  },
  watch: {
    refund_paid_e (now) {
      if (now != null) {
        if (isNaN(Number(now))) {
          this.isShow = true
        } else {
          this.isShow = false
        }
      }
    },
  },
  mounted () {
    this.subletId = this.$route.query.billnote_id
    this.subletroomInfo()
  },
  methods: {
    subletroomInfo () {
      let that = this
      subletDetail(that.subletId).then((res) => {
        let subletInfo = res.data
        // 住户信息
        residentInfoDetail(subletInfo.old_resident.resident.ID).then((res) => {
          that.resident = res.data
        }).catch(function (err) {
          console.log(err)
        })
        // 退款的银行卡信息
        that.record = subletInfo.transform_rent
        // 未缴费账单
        that.unpaid = subletInfo.input_order
        for (let i = 0; i < that.unpaid.length; i++) {
          that.unpaid_total = that.unpaid_total + that.unpaid[i].money
        }
        that.unpaid_total = that.moneyShowTwo(that.unpaid_total)
        that.unpaid.forEach((item) => {
          item.begin_time = that.fxFilter.date(item.begin_time)
          item.end_time = that.fxFilter.date(item.end_time)
          item.money = that.moneyShowTwo(item.money)
        })
        // 已缴费账单
        that.paid = subletInfo.output_order
        for (let i = 0; i < that.paid.length; i++) {
          that.paid_total = that.paid_total + that.paid[i].money
        }
        that.paid_total = that.moneyShowTwo(that.paid_total)
        that.paid.forEach((item) => {
          item.begin_time = that.fxFilter.date(item.begin_time)
          item.end_time = that.fxFilter.date(item.end_time)
          item.money = that.moneyShowTwo(item.money)
        })
        that.refund_total = that.moneyShowTwo(that.paid_total - that.unpaid_total)
        // 额外退费
      }).catch(function (err) {
        console.log(err)
      })
    },
    moneyShowTwo(val) {
      return parseFloat(val).toFixed(2)
    },
    submit () {
      let that = this
      let para = {}
      para.bank_sequence = that.record.bank_sequence
      para.refund_paid_e = parseFloat(parseFloat(that.refund_paid_e).toFixed(2))
      para.accountant_remark = that.record.accountant_remark
      // that.listLoadings = true;
      if (isNaN(Number(para.refund_paid_e))) {
        that.$message.error('应退金额必须为数字')
      } else {
        that.func.emptyVul(para, function () {
          that.listLoadings = false
        }, function () {
          that.$confirm('确定办理退房吗', '提示', { type: 'warning' }).then(() => {
            subletRefund(that.subletId, para).then((res) => {
              if (res == undefined) {
                that.listLoadings = false
              }
              if (res.data.rescode == 0) {
                that.$message.success('办理成功')
                // that.$router.push({ path: '/checkout' })
              }
            }).catch(function (err) {
              console.log(err)
            })
          }).catch(function () {
            that.listLoadings = false
            that.$message.info('已取消办理')
          })
        })
      }
    },
    backlist () {
      this.$emit('set', 'sublet', 'list')
    },
  },
}
</script>
<style scoped="scoped">
.lookCheckouts .fx-head-s{
  margin-top: 20px;
  margin-bottom: 20px;
}
.lookCheckouts .card{
  width: 100%;
  margin-top: 20px;
}
.lookCheckouts .el-card__header{
font-size:16px;
}
.lookCheckouts .bill-card-item{
  line-height: 26px;
}
.lookCheckouts .bill-card-type{
  color: #606266;
  padding-right: 20px;
  display: inline-block;
  width: 100px;
}
.lookCheckouts .bill-card-money{
  color: #606266;
  display: inline-block;
  width: 100px;
  padding-right: 20px;
}
.lookCheckouts .bill-card-status{
 color: #E6A23C;
  width: 200px;
  display: inline-block;
}
.lookCheckouts .bill-card-foot{
  margin-top: 13px;
  color:#606266;
  bottom: 30px;
  line-height: 40px;
}
.lookCheckouts .bill-card-foot strong{
  font-size:16px;
  color:#F56C6C;
}
.lookCheckouts .fx-head-ss{
  border-bottom:1px #eeeeee solid;
  margin-top: 20px;
}
</style>

