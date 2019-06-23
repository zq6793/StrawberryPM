<template>
  <section class="fx-pages-main adjustflow task-flow-allpage">
    <el-row class="flowbox" :gutter="20">
        <el-col :span="12" class="flowleft">
          <h4 class="fx-head-m"><span>{{nameInfo.data.store_name}} &nbsp;&nbsp;&nbsp;{{nameInfo.data.room_number}}</span>{{taskflow.type}}审批</h4>
          <el-collapse v-model="activeNames" @change="handleChange">
              <el-collapse-item title="调价信息" name="1">
              <div>调价类型： <span>{{nameInfo.data.type_name}}</span></div>
              <p>当前价格：<span>{{nameInfo.data.ori_price}}</span></p>
              <p>申请调价价格：<span>{{nameInfo.data.new_price}}</span></p>
              <p>调价原因：<span>{{nameInfo.data.remark}}</span></p>
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
              <!-- <span class="pass">{{checkOutInfo.creator.position_name}}</span> -->
              <span>{{name}}</span>
              <em>{{checkOutInfo.CreatedAt}}</em>
            </div>
            <p class="textinfo">{{checkOutInfo.remark_e}}</p>
          </div>
          <p class="position start">发起</p>
        </div>
      </el-col>
    </el-row>
  </section>
</template>
<script>
import { NewTaskFlowDetail, priceDetailByTaskflow, affirmAuditV4 } from '@/api/api'
export default {
  data () {
    return {
      id: '',
      activeNames: ['1',
      ],
      nextShow: false,
      nextPositions: '',
      lenght: '',
      nameInfo: {
        store: {},
        roomunion: {},
        checkout: {},
        resident: {},
        unpaid: [],
        data: {}
      },
      status: '',
      // taskflow: {
      //   employee: {
      //     position: {},
      //   },
      // },
      checkOutInfo: '',
      taskflow: {},
      remark: '',
      listLoading: false,
      listLoadings: false,
      isShow: '',
      current_step: [],
      taskflowStatus: '',
      showItem: '',
      name: ''
    }
  },
  created () {
    this.id = this.$route.query.id
    this.isShow = this.$route.query.name == 'wait'
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      let that = this
      let para = {
        taskflow_id: that.id,
      }
      NewTaskFlowDetail(para.taskflow_id).then((res) => {
        that.name = res.data.participant.initiator_name
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
        // that.checkOutInfo.refund_time_e = that.fxFilter.goTime(that.checkOutInfo.refund_time_e)
        that.checkOutInfo.CreatedAt = that.fxFilter.goTime(that.checkOutInfo.CreatedAt)
        // that.checkOutInfo.check_time = that.fxFilter.goTime(that.checkOutInfo.check_time)
        // let newpara = { is_money_back: 1 }
        priceDetailByTaskflow(para.taskflow_id).then((res) => {
          that.nameInfo.data = res.data
        }).catch(function(err) {
          console.log(err)
        })
      }).catch(function (err) {
        console.log('erooo')
        console.log(err)
      })
    },

    priceTra (type) {
      if (type == 'MANAGEMENT') {
        type = '物业服务费'
      } else if (type == 'ROOM') {
        type = '住宿服务费'
      } else {

      }
      return type
    },
    passValue () {
      let that = this
      let para = {
        remark: that.remark,
        status: 'APPROVED',
      }
      that.listLoading = true
      if (!that.remark) {
        that.$message({
          message: '请完整填写表单',
          type: 'warning',
        })
        that.listLoading = false
      } else {
        that.$confirm('确认提交审核吗', '提示', {
          type: 'warning',
        })
          .then(() => {
            affirmAuditV4(this.id, para).then((res) => {
              that.$message({
                message: '审核已通过',
                type: 'success',
              })
              that.listLoading = false
              that.$router.push({ path: '/examine' })
            }).catch(function (err) {
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
    opposeV () {
      let that = this
      let para = {
        remark: that.remark,
        status: 'UNAPPROVED',
      }
      that.listLoadings = true
      if (!that.remark) {
        that.$message({
          message: '请完整填写表单',
          type: 'warning',
        })
        that.listLoadings = false
      } else {
        that.$confirm('确认驳回审核吗', '提示', {
          type: 'warning',
        })
          .then(() => {
            affirmAuditV4(that.id, para).then((res) => {
              that.$message({
                message: '审核已驳回',
                type: 'success',
              })
              that.listLoadings = false
              that.$router.push({ path: '/examine' })
            }).catch(function (err) {
              console.log(err)
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消驳回',
            })
          })
      }
    },
  },
}
</script>
