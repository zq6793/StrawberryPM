<template>
  <section class="tab-title household-info">
    <el-tabs type="card" @tab-click="handleClick">
      <el-tab-pane class="fx-pages-main" label="基本信息">
        <el-form ref="residentInfo" :model="basicList" label-width="100px" v-loading="listLoading" :rules="editbasicRules" class="forms">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="basicList.name"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="genderl">
            <el-input v-model="basicList.genderl"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="phone">
            <el-input v-model="basicList.phone"></el-input>
          </el-form-item>
          <el-form-item label="证件类型" class="white-el-select">
            <el-select v-model="basicList.card_type" placeholder="请选择">
              <el-option v-for="item in cardList" :key="item.id" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="证件号码" prop="card_number">
            <el-input v-model="basicList.card_number"></el-input>
          </el-form-item>
          <el-form-item label="证件照片:" class="image">
            <img v-if="basicList.card_one" :src="basicList.card_one" class="avatar" @click="lookImgone = true">
            <img v-if="basicList.card_two" :src="basicList.card_two" class="avatar" @click="lookImgtwo = true">
            <img v-if="basicList.card_two" :src="basicList.card_three" class="avatar" @click="lookImgthree = true">
          </el-form-item>
          <el-dialog title="查看照片" :visible.sync="lookImgone" :close-on-click-modal="false" class="look_img">
            <img :src="basicList.card_one" alt="" style="width:450px;">
          </el-dialog>
          <el-dialog title="查看照片" :visible.sync="lookImgtwo" :close-on-click-modal="false" class="look_img">
            <img :src="basicList.card_two" alt="" style="width:450px;">
          </el-dialog>
          <el-dialog title="查看照片" :visible.sync="lookImgthree" :close-on-click-modal="false" class="look_img">
            <img :src="basicList.card_three" alt="" style="width:450px;">
          </el-dialog>
          <el-form-item label="紧急联系人" prop="alternative">
            <el-input placeholder="请输入紧急联系人" v-model="basicList.alternative"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="alter_phone">
            <el-input placeholder="请输入联系电话 " v-model="basicList.alter_phone"></el-input>
          </el-form-item>
          <!--列表-->
          <div class="card_table">
            <p class="add">
              <el-button type="primary" class="addCard" @click="addCard">添加门禁卡</el-button>
            </p>
            <el-form-item label="门禁卡信息" class="table">
              <el-table :data="cardInfo" highlight-current-row @selection-change="selsChange" v-loading="listLoading" border tooltip-effect="dark">
                <el-table-column prop="name" label="类型">
                </el-table-column>
                <el-table-column prop="count" label="数量">
                </el-table-column>
                <el-table-column prop="number" label="卡号">
                </el-table-column>
                <el-table-column prop="description" label="备注">
                </el-table-column>
                <el-table-column prop="status" label="状态">
                </el-table-column>
                <el-table-column label="操作" width="202">
                  <template slot-scope="scope">
                    <span size="small" @click="changeEdit(scope.row)" class="textchange">修改</span>
                    <span size="small" @click="lossEdit(scope.row)" class="textchange">挂失</span>
                    <span size="small" @click="recycleEdit(scope.row)" class="textchange">回收</span>
                    <span size="small" @click="delEdit(scope.row)" class="textchange">删除</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </div>
          <el-form-item label="">
            <el-button type="primary" class="add-btn" @click="submit" :loading="listLoading">确定</el-button>
          </el-form-item>
        </el-form>
        <el-dialog title="门禁卡信息" v-model="isadd" width="30%" :close-on-click-modal="false" @close="closeCard" class="forbid">
          <el-form label-width="80px">
        <el-form-item label="物品类型" class="select">
          <el-select v-model="cardInfos.name" placeholder="请选择" size="small">
            <el-option v-for="item in typeList" :key="item" :label="item" :value="item" style="background: #fafafa; color: #000; border-radius: 0; border-bottom:1px solid #D8D8D8">
            </el-option>
          </el-select>
        </el-form-item>
            <el-form-item label="物品编号">
              <el-input v-model="cardInfos.number" placeholder="请输入物品编号"></el-input>
            </el-form-item>
            <el-form-item label="数量">
              <el-input v-model="cardInfos.count" placeholder="请输入物品数量"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="cardInfos.description" placeholder="请输入物品备注"></el-input>
            </el-form-item>
            <el-button @click="appendCard" type="primary" :loading="listLoadings" class="append">提交</el-button>
          </el-form>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane class="fx-pages-main" label="合同信息">
          <div class="contractinfo" v-for="item in residentList" :key="item.input" v-if="item.rent_type == null">
            <strong>{{item.created_at}}</strong>
            <hr>
            <div class="contractson">
              <p>合同编号 <span> {{item.contract_id}}</span></p>
              <p>房间地址 <span>{{item.directory}}</span></p>
              <p>签约日期 <span>{{item.created_at}}</span></p>
              <p>合同周期 <span>{{item.time}}</span></p>
              <p>解除时间<span> {{item.refund_time}}</span></p>
              <p>状态 <span>{{item.status}}</span></p>
              <p>租金 <span>{{item.real_rent_money}}元/月</span></p>
              <p>付款方式 <span>{{item.money}}</span></p>
              <p>物业服务费 <span>{{item.residents.property_price}}</span></p>
              <p>其他押金 <span>{{item.residents.tmp_deposit}}</span></p>
              <p>押金 <span>{{item.deposit_money}}</span></p>
            </div>
          </div>
          <div class="reserve" v-for="item in residentList" :key="item.input" v-if="item.rent_type == 'RESERVE'">
            <strong>{{item.created_at}}</strong>
            <hr>
            <div class="reserveinfo">
              <p><span>合同编号</span>{{item.contract_id}}</p>
              <p><span>签约人</span>{{item.residents.name}}</p>
              <p><span>联系方式</span>{{item.residents.phone}}</p>
              <p><span>证件类型</span>{{item.residents.card_type}}</p>
              <p><span>证件号码</span>{{item.residents.card_number}}</p>
              <p><span>房间地址</span>{{item.store.city}}{{item.store.name}}{{item.roomunion.number}}</p>
              <p><span>预定时间</span>{{item.created_at}}</p>
              <p><span>定金（￥）</span>{{item.residents.book_money}}</p>
              <p><span>起租日期</span>{{item.residents.reserve_begin_time}}</p>
              <p><span>合租时长</span>{{item.residents.reserve_contract_time}}月</p>
              <p><span>月租原价</span>{{item.residents.rent_price}}</p>
              <p><span>物业服务费</span>{{item.residents.property_price}}</p>
              <p><span>合同类型</span>{{item.type}}</p>
              <p><span>签约状态</span>{{item.status}}</p>
              <p><span>经办人</span>{{item.employee.name}}</p>
              <p><span>特别条款</span>{{item.residents.reserve_special_term}}</p>
              <p><span>备注</span>{{item.residents.remark}}</p>
            </div>
          </div>
      </el-tab-pane>
      <el-tab-pane label="账单信息" class="fx-pages-main billinfo">
        <el-card class="card bill-card" v-for="(item, value) in uppaildList" :key="item" v-show="upaildList">
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
        </el-card>

        <el-card class="card bill-card" v-for="(item, value) in paidList" :key="item" v-show="paidList">
          <div slot="header" class="clearfix">
            <span>{{value}}</span>
          </div>
          <div v-for="param in item.orders" :key="param" class="bill-card-item">
            <span class="bill-card-type">{{param.type}}</span>
            <span class="bill-card-money">{{param.money}}</span>
            <span class="bill-card-status">{{param.status}}</span>
          </div>
          <div class="clearfix bottom bill-card-foot">
            <span>总金额:</span>
            <strong class="sumprice">{{item.total_money}}</strong>
          </div>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="优惠券信息" class="fx-pages-main coupon">
        <el-table :data="CouponList" highlight-current-row @selection-change="selsChange" v-loading="listLoading" border tooltip-effect="dark">
          <el-table-column type="selection">
          </el-table-column>
          <el-table-column prop="created_at" label="发放时间" width="160">
          </el-table-column>
          <el-table-column prop="coupon_type.name" label="名称">
          </el-table-column>
          <el-table-column prop="coupon_type.discount" label="金额￥" width="80">
          </el-table-column>
          <el-table-column prop="time" label="有效期" width="315">
          </el-table-column>
          <el-table-column prop="coupon_type.description" label="用途">
          </el-table-column>
          <el-table-column prop="status" label="状态" width="80">
          </el-table-column>
          <el-table-column prop="updated_at" label="使用时间" width="160">
          </el-table-column>
        </el-table>
      </el-tab-pane>

    </el-tabs>
  </section>
</template>
<script>
import { resident, residentInfo, updateresident, moneyList, getCoupon, itemInfo, addItem, updateItem, delItem, item } from '@/api/api'
export default {
  data () {
    return {
      // 房间门卡、房间钥匙、大门门卡、小区门卡
      info: {},
      isadd: false,
      listLoading: false,
      listLoadings: false,
      isClick: false,
      lookImgone: false,
      lookImgtwo: false,
      lookImgthree: false,
      basicList: {},
      cardList: [{
        label: '请选择',
        value: '',
      },
      {
        label: '身份证',
        value: '0',
      },
      {
        label: '护照',
        value: '1',
      },
      {
        label: '军人身份证',
        value: '2',
      },
      {
        label: '社会保障卡',
        value: '6',
      },
      {
        label: '武装警察身份证件',
        value: 'A',
      },
      {
        label: '港澳通行证',
        value: 'B',
      },
      {
        label: '户口簿',
        value: 'E',
      },
      {
        label: '临时居民身份证',
        value: 'F',
      },
      {
        label: '外国人永久居留证',
        value: 'P',
      },
      {
        label: '营业执照',
        value: 'BL',
      },
      {
        label: '其他',
        value: 'OTHER',
      },
      ],
      billingInfo: [],
      sels: [],
      page: 1,
      total: 0,
      residentList: {},
      id: '',
      paidList: {},
      uppaildList: {},
      upaildList: false,
      CouponList: [],
      editbasicRules: {
        name: [{
          required: true,
          message: '请填写您的姓名',
          trigger: 'blur',
        } ],
        genderl: [{
          required: true,
          message: '请填写您的性别',
          trigger: 'blur',
        } ],
        phone: [{
          required: true,
          message: '请填写您的联系方式',
          trigger: 'blur',
        } ],
        card_type: [{
          required: true,
          message: '请填写您的证件类型',
          trigger: 'blur',
        } ],
        card_number: [{
          required: true,
          message: '请填写您的证件号码',
          trigger: 'blur',
        } ],
        alternative: [{
          required: true,
          message: '请填写您的紧急联系人',
          trigger: 'blur',
        } ],
        alter_phone: [{
          required: true,
          message: '请填写您的联系电话',
          trigger: 'blur',
        } ],
      },
      cardInfo: [],
      cardInfos: {
        name: '',
        count: '',
        description: '',
        status: '',
        number: '',
      },
      typeList: ['房间门卡', '房间钥匙', '大门门卡', '小区门卡' ],
      type: 'add',
      ids: '',
    }
  },
  created () {
    this.id = this.$route.query.id
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
    this.getBasic()
    this.getMoneyInfo()
    this.getCoupon()
    this.getcardList()
  },
  methods: {
    uploadUrl () {
      return this.fxCfg.image_upload_url
    },

    handleClick () {},
    // ------------------------ 基本信息 ----------------------------
    getBasic () {
      let that = this
      let para = {
        id: this.id,
      }
      that.listLoading = true
      residentInfo(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data
        that.func.portInit(rescode, resmsg, function () {
          that.genderTra(getData[0])
          that.basicList = getData[0]
          that.listLoading = false
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
    // 性别转化
    genderTra (getData) {
      if (getData.customer_s.gender == 'W') {
        getData.genderl = '女'
      } else if (getData.customer_s.gender == 'M') {
        getData.genderl = '男'
      } else {
        getData.genderl = '未知'
      }
    },
    submit () {
      let that = this
      if (that.basicList.genderl == '男') {
        that.basicList.gender = 'M'
      } else if (that.basicList.genderl == '女') {
        that.basicList.gender = 'W'
      } else {
        that.basicList.gender = 'N'
      }
      let para = Object.assign({}, that.basicList)
      that.$refs.residentInfo.validate((valid) => {
        if (valid) {
          that.$confirm('确认提交吗？', '提示', {}).then(() => {
            that.listLoading = true
            updateresident(para).then((res) => {
              that.listLoading = false
              let rescode = res.data.rescode
              let resmsg = res.data.resmsg
              that.func.portInit(rescode, resmsg, function () {
                that.$message({
                  message: '提交成功',
                  type: 'success',
                })
                that.$refs['residentInfo'].resetFields()
                that.$router.push({
                  path: '/household',
                })
              })
            }).catch(function (err) {
              console.log(err)
            })
          }).catch(function () {
            that.listLoading = false
            that.$message({
              type: 'info',
              message: '已取消提交',
            })
          })
        }
      })
    },
    // 门禁卡
    getcardList () {
      let that = this
      let para = {
        resident_id: that.id,
      }
      itemInfo(para).then((res) => {
        let rescode = res.data.rescode
        let getData = res.data.data
        if (rescode == 0) {
          that.cardInfo = getData.list
        }
      })
    },
    addCard () {
      this.isadd = true
      this.type = 'add'
    },
    appendCard () {
      let that = this
      let para = Object.assign({}, that.cardInfos)
      para.resident_id = that.id
      para.store_id = that.residentList[0].store_id
      para.status = '生效中'
      para.price = '0'
      that.listLoadings = true
      that.func.emptyVul(para, function () {
        that.listLoadings = false
      }, function () {
        if (!isNaN(Number(para.count))) {
          if (that.type == 'add') {
            addItem(para).then((res) => {
              if (res.data.rescode == 0) {
                that.isadd = false
                that.listLoadings = false
                that.$message.success('添加成功')
                that.getcardList()
              }
            })
          } else {
            para.id = that.ids
            updateItem(para).then((res) => {
              if (res.data.rescode == 0) {
                that.isadd = false
                that.listLoadings = false
                that.$message.success('修改成功')
                that.getcardList()
              }
            })
          }
        } else {
          that.listLoadings = false
          that.$message.error('数量必须是数字')
        }
      })
    },
    closeCard () {
      this.func.clearVul(this.cardInfos)
    },
    changeEdit (row) {
      let that = this
      let para = {
        id: row.id,
      }
      that.ids = para.id
      item(para).then((res) => {
        if (res.data.rescode == 0) {
          delete res.data.data.list[0].room
          delete res.data.data.list[0].store
          delete res.data.data.list[0].id
          that.cardInfos = res.data.data.list[0]
          that.isadd = true
          that.type = 'edit'
          that.getcardList()
        }
      })
    },
    lossEdit (row) {
      let that = this
      let para = {
        id: row.id,
        status: '已挂失',
      }
      that.$confirm('是否进行挂失操作', '提示', {
        type: 'warning',
      }).then(() => {
        updateItem(para).then((res) => {
          if (res.data.rescode == 0) {
            that.$message.success('挂失成功')
            that.getcardList()
          }
        })
      }).catch(function () {
        that.$message.info('已取消挂失')
      })
    },
    recycleEdit (row) {
      let that = this
      let para = {
        id: row.id,
        status: '已收回',
      }
      that.$confirm('是否进行回收操作', '提示', {
        type: 'warning',
      }).then(() => {
        updateItem(para).then((res) => {
          if (res.data.rescode == 0) {
            that.$message.success('回收成功')
            that.getcardList()
          }
        })
      }).catch(function () {
        that.$message.info('已取消回收')
      })
    },
    delEdit (row) {
      let that = this
      let para = {
        id: row.id,
      }
      that.$confirm('是否进行删除操作', '提示', {
        type: 'warning',
      }).then(() => {
        delItem(para).then((res) => {
          if (res.data.rescode == 0) {
            that.$message.success('删除成功')
            that.getcardList()
          }
        })
      }).catch(function () {
        that.$message.info('已取消删除')
      })
    },
    // ------------------------ 合同信息 -----------------------------
    // 租金钱数改变
    numTran (num) {
      if (num == 1) {
        num = '一'
      } else if (num == 2) {
        num = '二'
      } else if (num == 3) {
        num = '三 '
      } else if (num == 4) {
        num = '四'
      } else if (num == 5) {
        num = '五'
      } else if (num == 6) {
        num = '六'
      } else {}
      return num
    },
    getOperation () {
      let that = this
      let para = {
        id: this.id,
      }
      that.listLoading = true
      resident(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data
        that.func.portInit(rescode, resmsg, function () {
          getData.resident.forEach((item) => {
            item.directory = `${item.store.city}${item.store.name}${item.roomunion.number}`
            item.time = item.residents.begin_time + '一' + item.residents.end_time
            item.residents.pay_frequency = that.numTran(item.residents.pay_frequency)
            item.residents.deposit_month = that.numTran(item.residents.deposit_month)
            item.money = `押${item.residents.deposit_month}付${item.residents.pay_frequency}`
            item.refund_time = item.residents.refund_time
            if (item.refund_time == null) {
              item.refund_time = '未解除'
            }
            item.status = that.func.constatus(item.status)
            item.real_rent_money = item.residents.real_rent_money
            item.deposit_money = item.residents.deposit_money
            item.residents.card_type = that.func.cardTypeT(item.residents.card_type)
            item.type = that.func.contype(item.type)
          })
          that.residentList = getData.resident
          that.listLoading = false
        })
      }).catch(function (err) {
        console.log(err)
      })
    },

    // ------------------------ 账单信息 -----------------------------
    getMoneyInfo () {
      let that = this
      let para = {
        resident_id: this.id,
      }
      that.listLoading = true
      moneyList(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data
        that.func.portInit(rescode, resmsg, function () {
          if (getData.paid.length !== 0) {
            for (let key in getData.paid) {
              getData.paid[key].orders.forEach((item) => {
                item.type = that.func.notypeTra(item.type)
                item.status = that.statuTar(item.status)
              })
            }
          }
          if (getData.unpaid.length !== 0) {
            that.upaildList = true
            for (let key in getData.unpaid) {
              getData.unpaid[key].orders.forEach((item) => {
                item.type = that.func.notypeTra(item.type)
                item.status = that.statuTar(item.status)
              })
            }
          };
          that.paidList = getData.paid
          that.uppaildList = getData.unpaid
          that.listLoading = false
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
    // ------------------------ 优惠券信息 -----------------------------
    getCoupon () {
      let that = this
      let para = {
        resident_id: that.id,
      }
      that.listLoading = true
      getCoupon(para).then((res) => {
        let getData = res.data.data
        that.CouponList = getData.coupon
        that.CouponList.forEach((item) => {
          item.status = that.func.constatusTra(item.status)
          item.time = `${item.created_at}--${item.deadline}`
          if (item.status == '已使用') {

          } else {
            item.updated_at = ''
          }
        })
        that.listLoading = false
      }).catch(function (err) {
        console.log(err)
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
  },
}
</script>
