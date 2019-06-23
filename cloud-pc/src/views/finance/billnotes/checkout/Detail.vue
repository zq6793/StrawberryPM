<template>
  <section class="fx-pages-main lookCheckouts" v-loadimg="listLoading">
    <el-form :inline="true" class="fx-table-sort-head">
      <el-form-item size="mini">
      <el-button type="primary" @click="backlist">返回</el-button>
      </el-form-item>
      <el-form-item size="mini">
      <el-button type="primary" @click="handleCheckout">导出退租单明细</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="20">
    <el-col :span="10" class="flowleft">
        <h4 class="fx-head-m"><span>{{resident.store_name}} &nbsp;&nbsp;&nbsp;
          {{resident.room.number}}
        </span>
          <span v-if="checkOutInfo.type==='UNDER_CONTRACT'">违约退房</span>
          <span v-else>正常退房</span>
        </h4>
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="合同信息" name="1">
            <el-form label-width="160px">
              <el-form-item label="合同编号:" size="small" v-if="resident.contract.length>0">
                {{ resident.contract[0].contract_id }}
              </el-form-item>
              <el-form-item label="住户姓名:" size="small">
                {{ resident.resident.name }}
              </el-form-item>
              <el-form-item label="联系方式:" size="small">
                {{ resident.resident.phone}}
              </el-form-item>
              <el-form-item label="合同周期:" size="small">
                {{ resident.resident.begin_time.substr(0, 10) }}
                —
                {{ resident.resident.end_time.substr(0, 10) }}
              </el-form-item>
              <el-form-item label="住宿服务费(￥/月):" size="small">
                {{ resident.resident.real_rent_money }}元
              </el-form-item>
              <el-form-item label="物业服务费(￥/月):" size="small">
                {{ resident.resident.real_property_costs }}元
              </el-form-item>
              <el-form-item label="押金(￥):" size="small">
                {{ resident.deposit_rent }}元
              </el-form-item>
              <el-form-item label="其他押金(￥):" size="small">
                {{ resident.deposit_tmp }}元
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="退租信息" name="2">
            <el-form label-width="200">
              <el-form-item label="退租类型:" size="small">
                {{ checkOutInfo.showType }}
              </el-form-item>
              <el-form-item label="退租原因:" size="small">
                {{ checkOutInfo.reason_e }}
              </el-form-item>
              <el-form-item label="申请日期:" size="small">
                {{ checkOutInfo.CreatedAt.substr(0, 10) }}
              </el-form-item>
              <el-form-item label="退租日期:" size="small">
                {{ checkOutInfo.refund_time_e.substr(0, 10) }}
              </el-form-item>
              <el-form-item label="备注:" size="small">
                {{ checkOutInfo.remark_e }}
              </el-form-item>
              <el-form-item label="验房照片:" size="small">
                <div class="img">
                  <img :src="item" @click="lookhoseImg(item)" v-for="(item,i) in checkOutInfo.check_images" :key="i" height="60px"/>
                </div>
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="退款结算" name="3">
            <div class="bill-card-item">
              <span class="bill-card-type">费用项</span>
              <span class="bill-card-status">账单周期</span>
              <span class="bill-card-money">金额</span>
              <span class="bill-card-remark">备注</span>
            </div>
            <div v-for="item in receivables" :key="item.id" class="bill-card-item">
              <span class="bill-card-type">{{item.type}}</span>
              <span class="bill-card-status">
                  {{item.year}}-{{item.month}}
                  </span>
              <span class="bill-card-money">￥{{item.money}}元</span>
              <span class="bill-card-remark">{{item.remark}}</span>
            </div>
            <div class="clearfix bottom bill-card-foot">
              <span>总计￥:</span>
              <strong class="sumprice">{{ receivables_total }}元</strong>
            </div>
            <div class="fx-head-ss">
              押金
              <span class="fx-text-tips">
                  (已交费用(请确保回收门禁卡、遥控器等其他物品，若无法住户无法归还请添加费用)
              </span>
            </div>
            <div class="bill-card-item">
              <span class="bill-card-type">费用项</span>
              <span class="bill-card-status">周期</span>
              <span class="bill-card-money">金额</span>
              <span class="bill-card-remark">备注</span>
            </div>
            <div v-for="item in depositables" :key="item.id" class="bill-card-item">
              <span class="bill-card-type">{{item.type}}</span>
              <span class="bill-card-status">
                  {{ item.begin_time.substr(0, 10) }}
              </span>
              <span class="bill-card-money">￥{{item.money}}元</span>
              <span class="bill-card-remark">{{item.remark}}</span>
            </div>
            <div class="clearfix bottom bill-card-foot">
              <span>总计￥:</span>
              <strong class="sumprice">{{ depositables_total }}元</strong>
            </div>
            <div class="fx-head-ss">已交费用</div>
            <div class="bill-card-item">
              <span class="bill-card-type">费用项</span>
              <span class="bill-card-status">账单周期</span>
              <span class="bill-card-money">金额</span>
              <span class="bill-card-remark">备注</span>
            </div>
            <div v-for="item in paidFee" :key="item.id" class="bill-card-item">
              <span class="bill-card-type">{{item.type}}</span>
              <span class="bill-card-status">
                  {{item.year}}-{{item.month}}
              </span>
              <span class="bill-card-money">￥{{item.money}}元</span>
              <span class="bill-card-remark">{{item.remark}}</span>
            </div>
            <div class="clearfix bottom bill-card-foot">
              <span>总计￥:</span>
              <strong class="sumprice">{{ paidFee_total }}元</strong>
            </div>
            <div class="fx-head-ss">
            </div>
            <div class="fx-head-ss">
              退房收入:￥
              <strong class="sumprice">{{ income_money }}元</strong>
            </div>
            <div class="fx-head-ss">退房损失:
              <strong class="sumprice">￥{{ loss_money }}元</strong>
            </div>
            <div class="fx-head-ss">退款金额:￥
              <strong class="sumprice">{{ refund_money }}元</strong>
            </div>
            <div class="fx-head-ss">额外退费:
              <div class="bill-card-item">
                <span class="bill-card-type">费用项</span>
                <span class="bill-card-status">账单周期</span>
                <span class="bill-card-money">金额</span>
                <span class="bill-card-remark" style="display:inline-block;width:180px;text-align:center;">备注</span>
                <span class="bill-card-look">查看图片</span>
              </div>
              <div v-for="item in add_exorder_fee" :key="item.id" class="bill-card-item">
                <span class="bill-card-type">{{item.type}}</span>
                <span class="bill-card-status">
                    {{item.year}}-{{item.month}}
                    </span>
                <span class="bill-card-money">￥{{item.money}}元</span>
                <span class="bill-card-remark" style="display:inline-block;width:180px;">{{item.remark}}</span>
                <el-button type="text" @click="lookAddOrderImg(item)">查看图片</el-button>
              </div>
              <div class="clearfix bottom bill-card-foot">
                <span>总计￥:</span>
                <strong class="sumprice">{{ ex_refund_total }}元</strong>
              </div>
            </div>
            <div class="fx-head-ss">合计退款金额:￥
              <strong class="sumprice">{{ real_refund_money }}元</strong>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-col>
      <el-col :span="12" :offset="2">
        <div class="fx-head-ss">退款银行卡</div>
        <el-form label-width="120px">
        <el-form-item label="姓名:" size="small">
          <span>{{ checkOutInfo.account }}</span>
        </el-form-item>
        <el-form-item label="卡号:" size="small">
          <span>{{ checkOutInfo.bank_card_number }}</span>
        </el-form-item>
        <el-form-item label="开户行:" size="small">
          <span>{{ checkOutInfo.bank }}</span>
        </el-form-item>
        <el-form-item label="银行卡照片:" size="small">
          <el-button type="text" @click="centerDialogVisible = true">
            <img :src="checkOutInfo.bank_card_front_img" alt="" style="height:40px">
          </el-button>
          <el-button type="text" @click="centerDialogVisible = true">
            <img :src="checkOutInfo.bank_card_front_img" alt="" style="height:40px">
          </el-button>
        </el-form-item>
        <div class="fx-head-ss">退款流水</div>
        <el-form-item label="银行转账流水号:" size="small">
          <el-col :span="8">
          <el-input type="text" placeholder="请必须输入支付流水单号" v-model="checkOutInfo.bank_sequence" :disabled='checkOutInfo.status == "COMPLETED"'></el-input>
          </el-col>
          <el-col :span="12" class="fx-text-tips">
            退款完成请输入银行转账流水号
          </el-col>
        </el-form-item>
        <el-form-item label="实际退款金额:" size="small">
          <el-col :span="8">
            <el-input type="text" placeholder="请输入实际应退金额" v-model="real_refund_money" :disabled='checkOutInfo.status == "COMPLETED"' ></el-input>
          </el-col>
          <el-col :span="12" class="fx-text-tips">
            应退金额必须为数字
          </el-col>
        </el-form-item>
        <el-form-item label="备注信息:" size="small">
          <el-col :span="12">
          <el-input type="textarea" :rows="6" placeholder="请填写备注信息" v-model="checkOutInfo.accountant_remark" :disabled='checkOutInfo.status == "COMPLETED"'>
          </el-input>
          </el-col>
        </el-form-item>
        <el-form-item  v-show='checkOutInfo.status != "COMPLETED"' label="" size="small">
          <el-button type="primary" @click="submit" v-loading="listLoadings">退款</el-button>
        </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-dialog title="银行卡信息" :visible.sync="centerDialogVisible" center>
      <img :src="checkOutInfo.bank_card_front_img" alt="" style="width:400px">
    </el-dialog>
    <el-dialog title="查看额外退款凭证" :visible.sync="showAddOrderImgs" align="center">
      <el-carousel :interval="5000" arrow="always" height="630px">
        <el-carousel-item v-for="(img,idx) in addOrderImgs" :key="idx" style="height:auto">
          <img :src="img" alt="" style="width:350px;"/>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </section>
</template>
<script type="text/javascript">
import { checkoutOrderByone, newCheckOutInfo, residentInfoDetail, checkOutRoom_Refund, backRoomDetailExport } from '@/api/api'
export default {
  data () {
    return {
      activeNames: ['1', '2', '3', '4'],
      listLoading: false,
      listLoadings: false,
      centerDialogVisible: false,
      isShow: false,
      checkOutInfo: '',
      resident: '',
      receivables: {},
      receivables_total: 0,
      depositables: {},
      depositables_total: 0,
      paidFee: {},
      paidFee_total: 0,
      refund_money: 0,
      income_money: 0,
      loss_money: 0,
      checkout_id: '',
      real_refund_money: 0,
      add_exorder_fee: [],
      ex_refund_total: 0,
      showAddOrderImgs: false,
      addOrderImgs: [],
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
    this.checkout_id = this.$route.query.billnote_id
    this.checkoutInfo()
  },
  methods: {
    checkoutInfo () {
      let that = this
      // 获取费用信息
      newCheckOutInfo(this.checkout_id).then((res) => {
        that.checkOutInfo = res
        that.checkOutInfo.showType = that.func.typeTre(that.checkOutInfo.type)
        // 获取账单信息
        let newpara = { is_money_back: 1 }
        checkoutOrderByone(this.checkout_id, newpara).then((res) => {
          that.receivables = res.input_order
          that.receivables_total = res.input_money
          that.depositables = res.deposit_order
          that.depositables_total = res.deposit_money
          that.paidFee = res.output_order
          that.paidFee_total = res.output_money
          that.refund_money = res.refund_money
          that.real_refund_money = res.real_refund_money
          that.income_money = res.income_money
          that.loss_money = res.loss_money
          that.ex_refund_total = res.add_refund_money
          that.add_exorder_fee = res.add_refund_order
        }).catch(function(err) {
          console.log(err)
        })
        // 获取住户信息
        residentInfoDetail(that.checkOutInfo.resident_id).then((res) => {
          that.resident = res.data
        }).catch(function(err) {
          console.log(err)
        })
      }).catch(function(err) {
        console.log(err)
      })
    },
    submit () {
      let that = this
      let para = Object.assign({})
      para.bank_sequence = that.checkOutInfo.bank_sequence
      para.refund_paid_e = parseFloat(parseFloat(that.real_refund_money).toFixed(2))
      para.accountant_remark = that.checkOutInfo.accountant_remark
      if (isNaN(Number(para.refund_paid_e))) {
        that.$message.error('应退金额必须为数字')
      } else {
        that.func.emptyVul(para, function () {
          that.listLoadings = false
        }, function() {
          that.$confirm('确定办理退房吗', '提示', { type: 'warning' }).then(() => {
            checkOutRoom_Refund(that.checkout_id, para).then((res) => {
              that.$message.success('办理成功')
              that.$emit('set', 'checkout', 'list')
            }).catch(err => {
              console.log(err)
            })
          }).catch(function (err) {
            that.listLoadings = false
            that.$message.info('已取消办理')
            console.log(err)
          })
        })
      }
    },
    backlist () {
      this.$emit('set', 'checkout', 'list')
    },
    // 查看额外退款凭证
    lookAddOrderImg (item) {
      console.log('点击查看图片')
      this.showAddOrderImgs = true
      this.addOrderImgs = item.images
    },
    /* 导出退租单明细 */
    handleCheckout () {
      console.log('导出退租单明细')
      let that = this
      // let time = ''
      let para = this.checkout_id
      console.log(para)
      // that.startTime = para.begin_time.substr(0, 10)
      // that.endTime = para.end_time.substr(0, 10)
      // time = that.startTime + '--' + that.endTime
      that.$confirm('确认导出选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        backRoomDetailExport(para).then((res) => {
          let blob = new Blob([res.data], { type: 'application/octet-stream;charset=utf-8' }) // 创建一个blob对象
          let a = document.createElement('a') // 创建一个<a></a>标签
          a.href = URL.createObjectURL(blob) // response is a blob
          a.download = '退房单明细导出.xlsx' // 文件名称
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
    text-align: center;
}
.lookCheckouts .bill-card-status{
 color: #E6A23C;
  width: 150px;
  text-align: center;
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
.bill-card-look{
  color: #606266;
}
</style>

