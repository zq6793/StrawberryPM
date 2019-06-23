<template>
  <section class="fx-pages-main lookcontracts">
    <!--工具条-->
    <div v-if="isShow">
      <div class="fx-head-s">合同详情</div>
    </div>
    <div v-else>
      <div class="fx-head-s">预定合同详情</div>
    </div>
    <el-form v-loading="listLoading" label-width="100px">
      <div class="checkin" v-if="isShow">
        <el-form-item label="房间地址">
          <span>{{info.place}}</span>
        </el-form-item>
        <el-form-item label="合同编号">
          <span>{{info.contract_id}}</span>
        </el-form-item>
        <el-form-item label="合同周期">
          <span>{{info.time}}</span>
        </el-form-item>
        <el-form-item label="合同状态">
          <span>{{info.status}}</span>
        </el-form-item>
        <el-form-item label="解除时间">
          <span>{{refund_time}}</span>
        </el-form-item>
        <el-form-item label="租金">
          <span>{{real_rent_money}}元/月</span>
        </el-form-item>
        <el-form-item label="押金">
          <span>{{deposit_money}}</span>
        </el-form-item>
        <el-form-item label="物业服务费">
          <span>{{info.residents.real_property_costs}}</span>
        </el-form-item>
        <el-form-item label="其他押金">
          <span>{{info.residents.tmp_deposit}}</span>
        </el-form-item>
        <el-form-item label="付款方式">
          <span>{{info.money}}</span>
        </el-form-item>
        <el-form-item label="同住人" v-if="name_two">
          <span>{{name_two}}</span>
        </el-form-item>
        <el-form-item label="验房图片" class="homeimg" v-if="info.residents.check_images != ''">
          <img :src="item" alt="" @click="lookImg(item)" v-for="item in info.residents.check_images" :key="item" width="100px">
        </el-form-item>
      </div>
      <div class="reserve" v-else>
        <el-form-item label="合同编号">
          <span>{{info.contract_id}}</span>
        </el-form-item>
        <el-form-item label="签约人">
          <span>{{info.residents.name}}</span>
        </el-form-item>
        <el-form-item label="联系方式">
          <span>{{info.residents.phone}}</span>
        </el-form-item>
        <el-form-item label="证件类型">
          <span>{{info.residents.card_type}}</span>
        </el-form-item>
        <el-form-item label="证件号码">
          <span>{{info.residents.card_number}}</span>
        </el-form-item>
        <el-form-item label="房间地址">
          <span>{{info.store.city}}{{info.store.name}}{{info.room.number}}</span>
        </el-form-item>
        <el-form-item label="预定时间">
          <span>{{info.created_at}}</span>
        </el-form-item>
        <el-form-item label="定金(￥)">
          <span>{{info.residents.book_money}}</span>
        </el-form-item>
        <el-form-item label="起租日期">
          <span>{{info.residents.reserve_begin_time}}</span>
        </el-form-item>
        <el-form-item label="合租时长">
          <span>{{info.residents.reserve_contract_time}}月</span>
        </el-form-item>
        <el-form-item label="月租原价">
          <span>{{info.residents.rent_price}}</span>
        </el-form-item>
        <el-form-item label="物业服务费">
          <span>{{info.residents.property_price}}</span>
        </el-form-item>
        <el-form-item label="合同类型">
          <span>{{info.type}}</span>
        </el-form-item>
        <el-form-item label="签约状态">
          <span>{{info.status}}</span>
        </el-form-item>
        <el-form-item label="经办人">
          <span>{{info.employee.name}}</span>
        </el-form-item>
        <el-form-item label="特别条款">
          <span>{{info.residents.reserve_special_term}}</span>
        </el-form-item>
        <el-form-item label="备注">
          <span>{{info.residents.remark}}</span>
        </el-form-item>
        <el-form-item label="验房图片" class="homeimg" v-if="info.residents.check_images != ''">
          <img :src="item" @click="lookImg(item)" v-for="item in info.residents.check_images" :key="item" width="100px">
        </el-form-item>
      </div>
      <el-form-item label="">
        <el-button type="primary" @click="pdfLook">查看PDF</el-button>
        <el-button type="primary" @click="dialogPush = true">上传合同</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="查看照片" :visible.sync="lookImgone" :close-on-click-modal="false" class="upimg">
      <img :src="img" alt="" style="width:450px;">
      </el-dialog>
      <el-dialog title="合同上传" v-model="dialogPush" :visible.sync="dialogPush">
        <el-form>
          <el-form-item>
            <el-upload class="upload-demo" drag :action="uploadUrl()" multiple :on-success="handleAvatarSuccess" ref="upload" :before-upload="beforeLoad" :headers="headers" :on-progress="handleProgress">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">请上传PDF格式的文件，且不超过4M</div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button class="comfirs" type="primary" @click="submit" :disabled="isClick" v-loading="listLoadings">确认</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      </el-form>
  </section>
</template>
<script type="text/javascript">
import { operationFind, uploadPd } from '@/api/api'
export default {
  data() {
    return {
      lookImgone: false,
      listLoading: false,
      id: '',
      img: '',
      info: {
        room: {},
        employee: {},
        residents: {
          check_images: [],
        },
        store: {},
      },
      activity: '',
      refund_time: '',
      real_rent_money: '',
      deposit_money: '',
      name_two: '',
      dialogPush: false,
      files: '',
      url: '',
      listLoadings: false,
      isClick: false,
      isShow: false,
      name: '',
    }
  },
  created() {
    this.id = this.$route.query.id
    this.isShow = this.$route.query.name == 'checkin'
    this.name = this.$route.query.name
    this.operationFind()
  },
  computed: {
    headers() {
      return {
        Token: sessionStorage.getItem('token'),
      }
    },
  },
  mounted() {

  },
  methods: {
    // 租金钱数改变
    numTran(num) {
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
    // 获取查看信息
    operationFind() {
      let that = this
      let para = {
        id: that.id,
      }
      that.listLoading = true
      operationFind(para).then((res) => {
        that.listLoading = false
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data
        that.func.portInit(rescode, resmsg, function() {
          getData.info[0].status = that.func.constatus(getData.info[0].status)
          getData.info[0].residents.pay_frequency = that.numTran(getData.info[0].residents.pay_frequency)
          getData.info[0].residents.deposit_month = that.numTran(getData.info[0].residents.deposit_month)
          getData.info[0].money = `押${getData.info[0].residents.deposit_month}付${getData.info[0].residents.pay_frequency}`
          that.refund_time = getData.info[0].residents.refund_time
          if (that.refund_time == null) {
            that.refund_time = '未解除'
          }
          that.real_rent_money = getData.info[0].residents.real_rent_money
          that.deposit_money = getData.info[0].residents.deposit_money
          that.name_two = getData.info[0].residents.name_two
          that.info = getData.info[0]
          that.info.place = `${getData.info[0].store.city}${getData.info[0].store.name}${getData.info[0].room.number}`
          that.info.time = getData.info[0].residents.begin_time.substr(0, 10) + ' 一 ' + getData.info[0].residents.end_time.substr(0, 10)
          that.info.residents.card_type = that.func.cardTypeT(that.info.residents.card_type)
          that.info.type = that.func.contype(that.info.type)
        })
      }).catch(function(err) {
        console.log(err)
      })
    },
    pdfLook() {
      window.open(this.info.view_url)
    },
    uploadUrl() {
      return this.fxCfg.file_upload_url
    },
    lookImg(item) {
      this.lookImgone = true
      this.img = item
    },
    // 使文件上传文件隐藏
    showimg() {
      this.$refs.upload.$el.lastElementChild.style.display = 'none'
    },
    handleProgress() {
      this.listLoadings = true
      this.isClick = true
    },

    beforeLoad(file) {
      const isfile = file.type == 'application/pdf'
      if (!isfile) {
        this.$message.error('请上传pdf格式文件!')
      }
      return isfile
    },
    handleAvatarSuccess(res, file) {
      this.listLoadings = false
      this.isClick = false
      this.url = file.response.data.file_url
      this.files = file.raw.name
      this.$message({
        message: '上传文件成功',
        type: 'success',
      })
    },
    submit() {
      let that = this
      that.isClick = true
      let para = {
        contract_id: that.id,
        url: that.url,
      }
      if (!para.url) {
        this.$message({
          message: '请上传PDF格式的文件...',
          type: 'error',
        })
        that.isClick = false
      } else {
        uploadPd(para).then((res) => {
          let rescode = res.data.rescode
          let resmsg = res.data.resmsg
          that.func.portInit(rescode, resmsg, function() {
            that.$message({
              message: '文件上传成功',
              type: 'success',
            })
            that.operationFind()
            that.dialogPush = false
            setTimeout(() => {
              that.isClick = false
            }, 1500)
          })
        }).catch(function(err) {
          console.log(err)
        })
      }
    },
    closecheckin() {
      this.url = ''
      this.files = ''
    },
  },
}

</script>
<style scoped="scoped">
.lookcontracts .el-form-item {
  margin-bottom: 0px;
}

</style>
