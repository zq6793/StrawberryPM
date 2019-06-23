<template>
  <section class="fx-pages-main checkoutflow task-flow-allpage">
    <el-row :gutter="20" class="flowbox">
      <el-col :span="12" class="flowleft">
        <h4 class="fx-head-m"><span>{{resident.store_name}} &nbsp;&nbsp;&nbsp;{{resident.room.number }}</span></h4>
         <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="原合同信息:" name="1">
            <el-form label-width="160px">
   <!--            <el-form-item label="合同编号:" size="small">
                 {{ resident.resident.name }}
              </el-form-item> -->
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
          <el-collapse-item title="退款结算" name="2">
            <div class="fx-head-ss">
              应收费用
              <span class="fx-text-tips">
                  (请确保回收门禁卡、遥控器等其他物品，若无法住户无法归还请添加费用)
                  </span>
            </div>
            <div class="bill-card-item">
              <span class="bill-card-type">费用项</span>
              <span class="bill-card-status">周期</span>
              <span class="bill-card-money">金额</span>
              <span class="bill-card-remark">备注</span>
            </div>
            <div v-for="item in unpaid" :key="item.id" class="bill-card-item">
            <span class="bill-card-type">{{item.type}}</span>
                <span class="bill-card-status">
                  {{item.year}}-{{item.month}}
              </span>
            <span class="bill-card-money">{{item.money}}元</span>
            <span class="bill-card-status">{{item.created_at}}</span>
            </div>
            <div class="clearfix bottom bill-card-foot">
            <span>总计:</span>
            <strong class="sumprice">{{ unpaid_total }}元</strong>
            </div>
            <div class="fx-head-ss">
              已缴费用
            </div>
           <div class="bill-card-item">
              <span class="bill-card-type">费用项</span>
              <span class="bill-card-status">周期</span>
              <span class="bill-card-money">金额</span>
              <span class="bill-card-remark">备注</span>
            </div>
            <div v-for="item in paid" :key="item.id" class="bill-card-item">
            <span class="bill-card-type">{{item.type}}</span>
                <span class="bill-card-status">
                  {{item.year}}-{{item.month}}
              </span>
            <span class="bill-card-money">{{item.money}}元</span>
            <span class="bill-card-status">{{item.created_at}}</span>
            </div>
            <div class="clearfix bottom bill-card-foot">
            <span>总计:</span>
            <strong class="sumprice">{{ paid_total }}元</strong>
            </div>
            <div class="clearfix bottom bill-card-foot">
              <span>退款金额￥:</span>
              <strong class="sumprice">{{ refund_total }}元</strong>
            </div>
          </el-collapse-item>
        <el-collapse-item title="退款账户信息" name="3">
            <el-form label-width="160px">
              <el-form-item label="姓名:" size="small">
                {{record.account}}
              </el-form-item>
              <el-form-item label="银行卡号:" size="small">
                {{record.bank_card_number}}
              </el-form-item>
              <el-form-item label="开户行:" size="small">
                {{record.bank}}
              </el-form-item>
              <el-form-item label="银行卡正反面照:" size="small">
                <img style="width: 60px;margin-right: 20px" :src="record.bank_card_front_img" alt="" @click="lookhoseImg(record.bank_card_front_img)" />
                <img  style="width: 60px;margin-right: 20px" :src="record.bank_card_back_img" alt="" @click="lookhoseImg(record.bank_card_back_img)" />
              </el-form-item>
                <el-form-item label="身份证正反面照:" size="small">
                  <img  style="width: 60px;margin-right: 20px" :src="record.card_front_img" alt="" @click="lookhoseImg(record.card_front_img)">
                  <img  style="width: 60px;margin-right: 20px" :src="record.card_back_img" alt="" @click="lookhoseImg(record.card_back_img)">
                  </el-form-item>
        <!--    <el-form-item label="" size="small" v-if='nameInfo.checkout.signature_type != "NO"'>
                    <el-button type="text">
                      查看退租单PDF
                    </el-button>
                  </el-form-item> -->
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <el-form class="opinion" v-show="isShow">
          <el-form-item label="审批意见：">
            <el-input type="textarea" :rows="8" placeholder="请输入内容" v-model="remark"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" class="submit" @click="passValue">通过</el-button>
            <el-button type="primary" class="submit" @click="opposeV">驳回</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :offset="4" :span="8" class="flowright">
        <div class="step" v-for="item in taskflow" :key="item.id">
          <p class="line" :class="{linebc:(item.status == 'APPROVED' || item.status =='通过')?true:false, nolinebc:(item.status == 'UNAPPROVED'|| item.status == '不通过')?true:false}"></p>
          <span class="vertical"></span>
          <div class="text">
            <div class="toptext">
              <span class="pass" v-for="item2 in taskflow.positions">
              {{ item2.name }}
              </span>
              <i>{{ item.employee.name }}</i>
              <em>{{ item.updated_at }}</em>
              <span v-if="item.status=='APPROVED'||item.status=='通过'" class="typepass">通过</span>
              <span v-else class="typepass">驳回</span>
            </div>
            <p class="textinfo">{{ item.remark }}</p>
          </div>
          <p class="position start" v-if="item.end_status">结束</p>
          <p class="position" v-else>审批人</p>
        </div>
 <!--        <div class="step">
          <p class="line linebc"></p>
          <span class="vertical"></span>
          <div class="text">
            <div class="toptext">
              <span class="pass">{{ checkOutInfo.checker.position_name }}</span>
              <i>{{ checkOutInfo.checker.name }}</i>
              <em>{{ checkOutInfo.check_time.substr(0, 10) }}</em>
            </div>
            <p class="textinfo"></p>
          </div>
          <p class="position">验房</p>
        </div>
        <div class="step">
          <p class="line linebc"></p>
          <span class="vertical"></span>
          <div class="text">
            <div class="toptext">
              <span class="pass">{{checkOutInfo.creator.position_name}}</span>
              <i>{{checkOutInfo.creator.name}}</i>
              <em>{{checkOutInfo.created_at}}</em>
            </div>
            <p class="textinfo">{{checkOutInfo.remark_e}}</p>
          </div>
          <p class="position start">发起</p>
        </div> -->
      </el-col>
    </el-row>
    <!--查看照片-->
    <el-dialog title="查看照片" :visible.sync="lookImg">
      <img :src="homeImg" alt="" style="width:450px;">
    </el-dialog>
  </section>
</template>
<script>
import { NewTaskFlowDetail, affirmAuditV4, subletDetail, residentInfoDetail } from '@/api/api'
export default {
  data() {
    return {
      activeNames: ['1',
        '2',
        '3',
        '4',
      ],
      lookImg: false,
      lookDetail: false,
      id: '',
      homeImg: '',
      nextPositions: '',
      lenght: '',
      nameInfo: {
        store: {},
        room: {},
        checkout: {},
        resident: {},
        deposit: [],
        checker: { position: {} },
        signaturer: { position: {} },
        contract: {},
        creater: {
          position: {},
        },
      },
      nextShow: false,
      listLoading: false,
      status: '',
      taskflow: {
        employee: {
          position: {},
        },
      },
      remark: '',
      detailsInfo: [],
      isShow: '',
      unpaid: {},
      unpaid_total: 0,
      paid: {},
      paid_total: 0,
      exrefund: {},
      exrefund_total: 0,
      refund_total: 0,
      refund_paid_e: 0,
      resident: {},
    }
  },
  created() {
    this.id = this.$route.query.id
    this.isShow = this.$route.query.name == 'wait'
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      let that = this
      this.listLoading = true
      NewTaskFlowDetail(that.id).then((res) => {
        let getData = res.data
        that.taskflow = getData.taskflow_records
        this.listLoading = false
        subletDetail(getData.task_detail.transform_rent.ID).then((res) => {
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
          that.unpaid_total = that.unpaid_total.toFixed(2)
          // 已缴费账单
          that.paid = subletInfo.output_order
          for (let i = 0; i < that.paid.length; i++) {
            that.paid_total = that.paid_total + that.paid[i].money
          }
          that.paid_total = that.paid_total.toFixed(2)
          that.refund_total = that.paid_total - that.unpaid_total
          that.refund_total = that.refund_total.toFixed(2)
          // 额外退费
        }).catch(function (err) {
          console.log(err)
        })
      }).catch(function(err) {
        console.log(err)
      })
    },
    // 获取图片
    lookhoseImg(img) {
      this.homeImg = img
      this.lookImg = true
    },
    // 查看pdf
    passValue() {
      let that = this
      let para = {
        remark: that.remark,
        status: 'APPROVED',
      }
      if (!that.remark) {
        that.$message({
          message: '请完整填写表单',
          type: 'warning',
        })
      } else {
        that.$confirm('确认提交审核吗', '提示', { type: 'warning' }).then(() => {
          affirmAuditV4(that.id, para).then((res) => {
            that.$message({
              message: '审核已通过',
              type: 'success',
            })
            that.$router.push({ path: '/examine' })
          }).catch(function(err) {
            console.log(err)
          })
        }).catch(() => {
          that.$message({
            type: 'info',
            message: '已取消通过',
          })
        })
      }
    },
    opposeV() {
      let that = this
      let para = {
        remark: that.remark,
        status: 'UNAPPROVED',
      }
      if (!that.remark) {
        that.$message({
          message: '请完整填写表单',
          type: 'warning',
        })
      } else {
        that.$confirm('确认驳回审核吗', '提示', { type: 'warning' }).then(() => {
          affirmAuditV4(that.id, para).then((res) => {
            that.$message({
              message: '审核已驳回',
              type: 'success',
            })
            that.$router.push({ path: '/examine' })
          }).catch(function(err) {
            console.log(err)
          })
        }).catch(() => {
          that.$message({
            type: 'info',
            message: '已取消驳回',
          })
        })
      }
    },
    lookDetails() {

    },
    checkoutType(type) {
      if (type == 'NORMAL_REFUND') {
        type = '正常退房'
      } else if (type == 'UNDER_CONTRACT') {
        type = '违约退房'
      } else {

      }
      return type
    },
  },
}

</script>
<style scoped="scoped">
.checkoutflow .el-form-item--small.el-form-item {
  margin-bottom: 4px;
}

.checkoutflow .card {
  width: 100%;
  margin-top: 20px;
}

.checkoutflow .el-card__header {
  font-size: 16px;
}

.checkoutflow .bill-card-item {
  line-height: 26px;
  border-bottom: 1px #eeeeee solid;
}

.checkoutflow .bill-card-type {
  /*color: #606266;*/
  padding-right: 20px;
  display: inline-block;
  width: 80px;
}

.checkoutflow .bill-card-money {
  /*color:#F56C6C;*/
  display: inline-block;
  width: 60px;
  padding-right: 20px;
}

.checkoutflow .bill-card-status {
  /*color: #E6A23C;*/
  width: 60px;
  display: inline-block;
  padding-right: 20px;
}

.checkoutflow .bill-card-foot {
  margin-top: 13px;
  color: #606266;
  bottom: 30px;
  line-height: 40px;
}

.checkoutflow .bill-card-foot strong {
  font-size: 16px;
  color: #F56C6C;
}

.checkoutflow .fx-head-ss {
  border-top: 1px #eeeeee solid;
  margin-top: 5px;
  border-bottom: 0px #eeeeee solid;
}

</style>
