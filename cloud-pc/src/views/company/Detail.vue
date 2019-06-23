<template>
  <section class="registerinfo tab-title">
    <el-tabs type="border-card" @tab-click="handleClick" v-model="activeName">
      <div class="title">
      </div>
      <el-tab-pane label="企业认证" name="first" :inline="true">
        <el-form label-width="150px" v-loading="listLoading">
          <div v-if='approveOver.status == "REGISTER"'>
            <el-form-item label="公寓品牌">
              <el-input placeholder="公寓品牌名称" v-model="approveList.brand"></el-input>
            </el-form-item>
            <el-form-item label="公寓介绍">
              <el-input type="textarea" :rows="7" placeholder="请填写门店描述" v-model="approveList.brand_intro"></el-input>
            </el-form-item>
            <hr>
            <el-form-item label="公司名称">
              <el-input placeholder="公司名称" v-model="approveList.name"></el-input>
            </el-form-item>
            <el-form-item label="法人姓名">
              <el-input placeholder="法人姓名" v-model="approveList.legal_person"></el-input>
            </el-form-item>
            <el-form-item label="法人身份证号">
              <el-input placeholder="法人身份证号" v-model="approveList.id_number"></el-input>
            </el-form-item>
            <el-form-item label="联系人手机号">
              <el-input placeholder="联系人手机号" v-model="approveList.phone"></el-input>
            </el-form-item>
            <el-form-item label="营业执照号">
              <el-input placeholder="营业执照号" v-model="approveList.license"></el-input>
            </el-form-item>
            <el-form-item label="营业执照照片" class="upimg">
              <div class="upinfo">
                <el-upload :action="uploadUrl()" list-type="picture-card" :headers="headers" :on-preview="preview" :on-success="imgSuccess" limit=1 name='image' ref="upload1" :disabled="isClickT" :on-progress="progress" :before-upload="before">
                  <img v-if="approveList.license_image" :src="approveList.license_image" class="avatar">
                  <div class="uptexts" :class="{noshow: approveList.license_image != ''?true:false}">
                    <span class="iconfont icon-ali-xiangji"></span>
                    <p>上传图片</p>
                  </div>
                </el-upload>
              </div>
            </el-form-item>
            <el-form-item label="联系人身份正反面照" class="upimg upimgs">
              <div class="upinfo">
                <el-upload :action="uploadUrl()" list-type="picture-card" :headers="headers" :on-preview="preview" :on-success="imgSuccessW" limit=1 name='image' ref="upload2" :disabled="isClickT" :on-progress="progress" :before-upload="before">
                  <img v-if="approveList.idcard_front" :src="approveList.idcard_front" class="avatar">
                  <div class="uptexts" :class="{noshow: approveList.idcard_front != ''?true:false}">
                    <span class="iconfont icon-ali-xiangji"></span>
                    <p>上传图片</p>
                  </div>
                </el-upload>
              </div>
              <div class="upinfo">
                <el-upload :action="uploadUrl()" list-type="picture-card" :headers="headers" :on-preview="preview" :on-success="imgSuccessT" limit=1 name='image' ref="upload3" :disabled="isClickT" :on-progress="progress" :before-upload="before">
                  <img v-if="approveList.idcard_back" :src="approveList.idcard_back" class="avatar">
                  <div class="uptexts" :class="{noshow: approveList.idcard_back != ''?true:false}">
                    <span class="iconfont icon-ali-xiangji"></span>
                    <p>上传图片</p>
                  </div>
                </el-upload>
              </div>
            </el-form-item>
            <el-form-item class="btn">
              <el-button type="primary" @click="submit" :loading="listLoadings">提交</el-button>
            </el-form-item>
          </div>
          <!-- 认证完成 -->
          <div v-else-if='approveOver.status == "NORMAL"' class="normal">
            <p class="normali"><img src="../../assets/img/over.png"><span>已完成认证</span></p>
            <p><span>公寓品牌</span><i>{{approveOver.brand}}</i></p>
            <p><span>公寓介绍</span><i>{{approveOver.brand_intro}}</i></p>
            <p><span>公司名称</span><i>{{approveOver.name}}</i></p>
            <p><span>法人姓名</span><i>{{approveOver.legal_person}}</i></p>
            <p><span>法人身份证号</span><i>{{approveOver.id_number}}</i></p>
            <p><span>联系人手机号</span><i>{{approveOver.phone}}</i></p>
            <p><span>营业执照号</span><i>{{approveOver.license}}</i></p>
            <p><span>营业执照照片</span><i><img :src="approveOver.license_image" @click="lookImgone = true"></i></p>
            <p class="img"><span>联系人身份证正反照片</span><i><img :src="approveOver.idcard_front" @click="lookImgtwo = true"><img :src="approveOver.idcard_back" @click="lookImgthr = true"></i></p>
            <el-dialog title="查看照片" :visible.sync="lookImgone" :close-on-click-modal="false">
              <img :src="approveOver.license_image">
            </el-dialog>
            <el-dialog title="查看照片" :visible.sync="lookImgtwo" :close-on-click-modal="false">
              <img :src="approveOver.idcard_front">
            </el-dialog>
            <el-dialog title="查看照片" :visible.sync="lookImgthr" :close-on-click-modal="false">
              <img :src="approveOver.idcard_back">
            </el-dialog>
          </div>
          <!-- 等待认证 -->
          <div v-else-if='approveOver.status == "UNAUTH"' class="await">
            <p>您的信息已提交成功，请等待认证。</p>
          </div>
          <!-- 认证失败 -->
          <div class="loser" v-else-if='approveOver.status == "UNAPPROVED"'>
            <p><img src="../../assets/img/loser.png"><span>未通过认证</span></p>
            <p class="again" @click="againc">重新认证</p>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="微信公众号" name="second">
        <div v-if="isCode" class="wx">
          <img src="../../assets/img/wx.png" alt="">
          <h3>绑定微信公众号 实现微信轻松运营</h3>
          <p class="wx_text" @click="binding">我有微信公众号，立即设置</p>
          <p class="wx_hint">
            <span class="iconfont icon-ali-tishi1"></span> 温馨提示：微信公众号必须是认证服务号，才能支持微信支付功能
          </p>
        </div>
        <div v-else class="public">
          <div class="left">
            <p><span>微信公众号：</span>{{wxOver.user_name}}</p>
            <!-- <i>解除绑定</i> -->
            <p><span>公众号昵称：</span>{{wxOver.nick_name}}</p>
            <p><span>微信公众号类型：</span>{{wxOver.service_type_info}}</p>
            <p><span>授权状态：</span>{{wxOver.verify_type_info}}</p>
          </div>
          <div class="right">
            <img :src="wxOver.qrcode_url" alt="">
          </div>

        </div>

      </el-tab-pane>
      <!-- <el-tab-pane label="账户余额" name="third">

      </el-tab-pane>
      <el-tab-pane label="发票管理" name="fourth">

      </el-tab-pane> -->
    </el-tabs>
  </section>
</template>
<script>
import { certification, authLocation, accredit, companyInfo, companywxInfo } from '@/api/api'
export default {
  data () {
    return {
      activeName: 'first',
      approveList: {
        brand: '',
        brand_intro: '',
        name: '',
        legal_person: '',
        id_number: '',
        phone: '',
        license: '',
        license_image: '',
        idcard_front: '',
        idcard_back: '',

      },
      lookImgone: false,
      lookImgtwo: false,
      lookImgthr: false,
      approveOver: {},
      wxOver: {

      },
      isEmpty: undefined,
      isCode: true,
      isClickT: false,
      listLoadings: false,
      listLoading: false,
      employee: '',
    }
  },
  created () {
    this.employee = JSON.parse(sessionStorage.getItem('info'))
    // 请求后 看是否 length
    if (this.$route.query.second) {
      this.activeName = 'second'
      this.isCode = false
      this.accredits()
    } else {
      this.isCode = true
      this.companywxInfo()
    }
  },
  mounted () {
    this.companyInfo()
  },
  watch: {
    'isEmpty': function () {
      this.isCode = false
      this.companywxInfo()
    },
  },
  computed: {
    headers () {
      return {
        Token: sessionStorage.getItem('token'),
      }
    },
  },
  methods: {
    handleClick () {},
    // ---------------------------- 企业认证 ------------------------------

    uploadUrl () {
      return this.fxCfg.image_upload_url
    },
    preview () {
      this.dialogVisible = true
    },
    imgSuccess (res) {
      this.isClickT = false
      this.listLoadings = false
      this.$message('图片上传成功')
      this.approveList.license_image = res.data.image_url
    },
    imgSuccessW (res) {
      this.isClickT = false
      this.listLoadings = false
      this.$message('图片上传成功')
      this.approveList.idcard_front = res.data.image_url
    },
    imgSuccessT (res) {
      this.isClickT = false
      this.listLoadings = false
      this.$message('图片上传成功')
      this.approveList.idcard_back = res.data.image_url
    },
    progress () {
      this.isClickT = true
      this.listLoadings = true
    },
    before (file) {
      this.$refs.upload1.$el.firstChild.style.display = 'none'
      this.$refs.upload2.$el.firstChild.style.display = 'none'
      this.$refs.upload3.$el.firstChild.style.display = 'none'
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是jpg、jpeg、png、gif 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    submit () {
      let that = this
      let id = that.employee.employee_id
      let para = Object.assign({}, that.approveList)
      certification(id, para).then((res) => {
        if (res) {
          that.$message.success('您的信息已提交成功，请等待认证。')
          that.approveOver.status = 'UNAUTH'
        }
      })
    },
    companyInfo () {
      let that = this
      let para = that.employee.company_id
      that.listLoading = true
      companyInfo(para).then((res) => {
        if (res) {
          that.approveOver = res
          that.$store.commit('isaFfirm', that.approveOver.status)
          that.listLoading = false
        }
      })
    },
    againc () {
      this.approveOver.status = 'REGISTER'
    },
    // ----------------------------  微信公众号 ------------------------------
    binding () {
      // let that = this
      let para = {}
      authLocation(para).then((res) => {
        window.location.href = res.data.url
      })
    },
    // 获取信息
    accredits () {
      let that = this
      let para = {
        auth_code: that.$route.query.auth_code,
        expires_in: that.$route.query.expires_in,
      }
      accredit(para).then((res) => {
        if (res) {
          that.companywxInfo()
        }
      })
    },
    companywxInfo () {
      let that = this
      let para = that.employee.company_id
      companywxInfo(para).then((res) => {
        if (res) {
          that.isEmpty = res.id
          that.wxOver = res
          that.wxOver.service_type_info = that.func.wxTry(that.wxOver.service_type_info)
          that.wxOver.verify_type_info = that.func.wxTrystatus(that.wxOver.verify_type_info)
          if (that.wxOver.status == 'unauthorized') {
            this.isCode = true
          } else {
            this.isCode = false
          }
        }
      })
    },

    // ----------------------------  发票管理 ------------------------------

    // ----------------------------  全部审批 ------------------------------
  },

}
</script>
