<template>
  <section class="fx-pages-main checkoutflow task-flow-allpage">
    <el-row :gutter="20" class="flowbox">
      <el-col :span="14" class="flowleft">
        <h4 class="fx-head-m"><span>{{ resident.store_name }} &nbsp;&nbsp;&nbsp;
          {{ resident.room.number }}
        </span>
          <span v-if="checkOutInfo.type==='UNDER_CONTRACT'">违约退房</span>
          <span v-else>正常退房</span>
        </h4>
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="合同信息" name="1">
            <el-form label-width="160px">
              <el-form-item label="合同编号:" size="small">
                {{ resident.contract[0].contract_id }}
              </el-form-item>
              <el-form-item label="住户姓名:" size="small">
                {{ resident.resident.name }}
              </el-form-item>
              <el-form-item label="联系方式:" size="small">
                {{ resident.resident.phone}}
              </el-form-item>
              <el-form-item label="合同周期:" size="small">
                {{ resident.resident.begin_time }} — {{ resident.resident.end_time }}
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
<!--        <el-form-item label="付款方式(￥):" size="small">
                <el-button type="text" @click="lookDetails = true">查看押金流水详情</el-button>
              </el-form-item> -->
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="退租信息" name="2">
            <el-form label-width="200">
              <el-form-item label="退租类型:" size="small">
              <!-- {{ checkOutInfo.type }} -->
              <span v-if="checkOutInfo.type==='UNDER_CONTRACT'">违约退房</span>
              <span v-else>正常退房</span>
              </el-form-item>
              <el-form-item label="退租原因:" size="small">
                {{ checkOutInfo.reason_e }}
              </el-form-item>
              <el-form-item label="申请日期:" size="small">
                {{ checkOutInfo.CreatedAt }}
              </el-form-item>
              <el-form-item label="退租日期:" size="small">
                {{ checkOutInfo.refund_time_e }}
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
            <div class="fx-head-ss">
              应收费用
              <span class="fx-text-tips">
                  (请确保回收门禁卡、遥控器等其他物品，若无法住户无法归还请添加费用)
                  </span>
            </div>
            <div class="bill-card-item">
              <span class="bill-card-type">费用项</span>
              <span class="bill-card-status">账单周期</span>
              <span class="bill-card-money">金额</span>
              <span class="bill-card-remark">备注</span>
            </div>
            <div v-for="item in receivables" :key="item.id" class="bill-card-item">
              <span class="bill-card-type">{{item.type}}</span>
           <!--    <span v-if="item.begin_time" class="bill-card-status">
                  {{item.begin_time.substr(0, 10)}}-{{item.end_time.substr(0, 10)}}
                  </span> -->
              <span class="bill-card-status">
                  {{item.year}}-{{item.month}}
                  </span>
              <span class="bill-card-money">￥{{item.money}}元</span>
              <span class="bill-card-remark">{{item.remak}}</span>
            </div>
            <div class="clearfix bottom bill-card-foot">
              <span>总计￥:</span>
              <strong class="sumprice">{{ receivables_total }}</strong>
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
            <!--   <span v-else class="bill-card-status">
                  {{item.year}}-{{item.month}}
              </span> -->
              <span class="bill-card-money">￥{{item.money}}元</span>
              <span class="bill-card-remark">{{item.remake}}</span>
            </div>
            <div class="clearfix bottom bill-card-foot">
              <span>总计￥:</span>
              <strong class="sumprice">{{ depositables_total }}</strong>
            </div>
            <div class="fx-head-ss">已缴费用</div>
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
              <span class="bill-card-remark">{{item.remake}}</span>
            </div>
            <div class="clearfix bottom bill-card-foot">
              <span>总计￥:</span>
              <strong class="sumprice">{{ paidFee_total }}</strong>
            </div>
       <!-- <div class="fx-head-ss">
              附件
            </div>
            <div class="img">
              <img :src="item" @click="lookhoseImg(item)" v-for="(item,i) in nameInfo.checkout.add_refund_images" :key="i" height="60px">
            </div> -->
            <div class="fx-head-ss">
            </div>
            <div class="fx-head-ss">
              退房收入:￥
              <strong class="sumprice">{{ income_money }}</strong>
            </div>
            <div class="fx-head-ss">退房损失:
              <strong class="sumprice">￥{{ loss_money }}</strong>
            </div>
            <div class="fx-head-ss">退款金额:￥
              <strong class="sumprice">{{ refund_money }}</strong>
            </div>
            <div class="fx-head-ss">额外退费:
              <div class="bill-card-item">
                <span class="bill-card-type">费用项</span>
                <span class="bill-card-status">账单周期</span>
                <span class="bill-card-money">金额</span>
                <span class="bill-card-remark" style="display:inline-block;width:180px;">备注</span>
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
          <el-collapse-item title="退款账户信息" name="4">
            <el-form label-width="160px">
              <el-form-item label="姓名:" size="small">
                {{checkOutInfo.account}}
              </el-form-item>
              <el-form-item label="银行卡号:" size="small">
                {{checkOutInfo.bank_card_number}}
              </el-form-item>
              <el-form-item label="开户行:" size="small">
                {{checkOutInfo.bank}}
              </el-form-item>
              <el-form-item label="银行卡正反面照:" size="small">
                <img style="width: 60px;margin-right: 20px" :src="checkOutInfo.bank_card_front_img" alt="" @click="lookhoseImg(checkOutInfo.bank_card_front_img)" />
                <img  style="width: 60px;margin-right: 20px" :src="checkOutInfo.bank_card_back_img" alt="" @click="lookhoseImg(checkOutInfo.bank_card_back_img)" />
              </el-form-item>
                <el-form-item label="身份证正反面照:" size="small">
                  <img  style="width: 60px;margin-right: 20px" :src="checkOutInfo.card_front_img" alt="" @click="lookhoseImg(checkOutInfo.card_front_img)">
                  <img  style="width: 60px;margin-right: 20px" :src="checkOutInfo.card_back_img" alt="" @click="lookhoseImg(checkOutInfo.card_back_img)">
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
      <el-col :offset="2" :span="8" class="flowright">
        <div class="step" v-if="taskflowStatus == '通过'">
          <p class="line linebc"></p>
          <span class="vertical"></span>
          <div class="text">
            <div class="toptext">
              <span class="pass">该审批已结束</span>
            </div>
          </div>
          <p class="position start">完成</p>
        </div>
        <div class="step" v-if="current_step != null">
          <p class="line linebn"></p>
          <span class="vertical"></span>
          <div class="text">
            <div class="toptext">
              <span class="passs">{{showItem}}</span>
              <i></i>
              <em></em>
            </div>
            <p class="textinfo"></p>
          </div>
          <p class="position titlcn">当前审批</p>
        </div>
        <div class="step" v-for="item in taskflow" :key="item.id">
          <p class="line" :class="{linebc:(item.status == 'APPROVED'||item.status == '通过')?true:false, nolinebc:(item.status == 'UNAPPROVED'||item.status == '不通过')?true:false}"></p>
          <span class="vertical"></span>
          <div class="text">
            <div class="toptext">
              <span class="pass" v-for="item2 in taskflow.positions">
              {{ item2.name }}
              </span>
              <em>{{ item.employee.name }}</em>
              <em>{{ item.CreatedAt }}</em>
              <span v-if="item.status=='APPROVED'||item.status == '通过'" class="typepass">通过</span>
              <span v-else class="typepass">驳回</span>
            </div>
            <p class="textinfo">{{ item.remark }}</p>
          </div>
          <p class="position start" v-if="item.end_status">结束</p>
          <p class="position" v-else>审批人</p>
        </div>
<!--         <div class="step" v-if="nameInfo.signaturer">
          <p class="line linebc"></p>
          <span class="vertical"></span>
          <div class="text">
            <div class="toptext">
              <span class="pass">{{nameInfo.signaturer.position.name}}</span>
              <i>{{nameInfo.signaturer.name}}</i>
              <em>{{nameInfo.checkout.signature_time}}</em>
            </div>
            <p class="textinfo"></p>
          </div>
          <p class="position">签署人</p>
        </div> -->
        <div class="step">
          <p class="line linebc"></p>
          <span class="vertical"></span>
          <div class="text">
            <div class="toptext">
              <span class="pass">{{ checkOutInfo.checker.position_name }}</span>
              <em>{{ checkOutInfo.checker.name }}</em>
              <em>{{ checkOutInfo.check_time }}</em>
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
              <span>{{checkOutInfo.creator.name}}</span>
              <em>{{checkOutInfo.CreatedAt}}</em>
            </div>
            <p class="textinfo">{{checkOutInfo.remark_e}}</p>
          </div>
          <p class="position start">发起</p>
        </div>
      </el-col>
    </el-row>
    <!--查看照片-->
    <el-dialog title="查看照片" :visible.sync="lookImg">
      <img :src="homeImg" alt="" style="width:450px;">
    </el-dialog>
    <!--查看额外退款凭证-->
    <el-dialog title="查看额外退款凭证" :visible.sync="showAddOrderImgs" align="center">
      <el-carousel :interval="5000" arrow="always" height="630px">
        <el-carousel-item v-for="(img,idx) in addOrderImgs" :key="idx" style="height:auto">
          <img :src="img" alt="" style="width:350px;"/>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </section>
</template>
<script>
import { NewTaskFlowDetail, UpdateTask, checkoutOrderByone, residentInfoDetail } from '@/api/api'
// import { NewTaskFlowDetail, affirmAudit, checkoutOrderByone } from '@/api/api'

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
      listLoading: false,
      status: '',
      taskflow: {},
      remark: '',
      detailsInfo: [],
      isShow: '',
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
      ex_refund_total: 0,
      showAddOrderImgs: false,
      addOrderImgs: [],
      real_refund_money: 0,
      taskflowStatus: '',
      current_step: [],
      showItem: '',
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
        that.current_step = res.data.current_step
        let showItem = ''
        if (that.current_step != null) {
          that.current_step.positions.forEach(item => {
            showItem += item.name + '/'
          })
          showItem = showItem.substring(0, showItem.length - 1)
        }
        that.showItem = showItem
        that.checkOutInfo = res.data.task_detail
        that.taskflowStatus = res.data.taskflow.status
        that.taskflow = res.data.taskflow_records
        that.taskflow.forEach(item => {
          item.CreatedAt = that.fxFilter.goTime(item.CreatedAt)
        })
        that.checkOutInfo.refund_time_e = that.fxFilter.goTime(that.checkOutInfo.refund_time_e)
        that.checkOutInfo.CreatedAt = that.fxFilter.goTime(that.checkOutInfo.CreatedAt)
        that.checkOutInfo.check_time = that.fxFilter.goTime(that.checkOutInfo.check_time)
        let newpara = { is_money_back: 1 }
        // 获取住户信息
        residentInfoDetail(that.checkOutInfo.resident_id).then((res) => {
          that.resident = res.data
          that.resident.resident.begin_time = that.fxFilter.goTime(that.resident.resident.begin_time)
          that.resident.resident.end_time = that.fxFilter.goTime(that.resident.resident.end_time)
        }).catch(function(err) {
          console.log(err)
        })
        checkoutOrderByone(that.checkOutInfo.ID, newpara).then((res) => {
          that.receivables = res.input_order
          that.receivables_total = res.input_money
          that.depositables = res.deposit_order
          that.depositables_total = res.deposit_money
          that.paidFee = res.output_order
          that.paidFee_total = res.output_money
          that.refund_money = res.refund_money
          that.income_money = res.income_money
          that.loss_money = res.loss_money
          that.ex_refund_total = res.add_refund_money
          that.add_exorder_fee = res.add_refund_order
          that.real_refund_money = res.real_refund_money
        }).catch(function(err) {
          console.log(err)
        })
        this.listLoading = false
        // }
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
    lookpdf() {
      window.open(this.nameInfo.checkout.signature_url)
    },
    passValue() {
      let that = this
      let para = {
        taskflow_id: that.id,
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
          UpdateTask(that.id, para).then((res) => {
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
        taskflow_id: that.id,
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
          UpdateTask(that.id, para).then((res) => {
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
    // 查看额外退款凭证
    lookAddOrderImg (item) {
      this.showAddOrderImgs = true
      this.addOrderImgs = item.images
    }
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
  width: 100px;
}

.checkoutflow .bill-card-money {
  /*color:#F56C6C;*/
  display: inline-block;
  width: 90px;
  padding-right: 20px;
}

.checkoutflow .bill-card-status {
  /*color: #E6A23C;*/
  width: 90px;
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

.fx-head-ss .sumprice{
    font-size: 16px;
  color: #F56C6C;
}

</style>
