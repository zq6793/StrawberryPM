<template>
  <section class="fx-pages-main addStoreManage">
    <el-form ref="addStore" :model="form" label-width="100px" style="margin:20px;  min-width:200px;" class="addform" :rules="addStoreRules">
      <span class="info-upload-titles">门店信息</span>
      <el-form-item label="状态" prop="status">
        <el-radio v-model="form.status" label="NORMAL">营业中</el-radio>
        <el-radio v-model="form.status" label="CLOSE">停业中</el-radio>
        <el-radio v-model="form.status" label="WAIT">即将开业</el-radio>
      </el-form-item>
      <el-form-item label="类型" prop="rent_type">
        <el-radio v-model="form.rent_type" label="UNION">集中式</el-radio>
        <el-radio v-model="form.rent_type" label="DOT">分布式</el-radio>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-col :span="6">
          <el-input placeholder="请填写门店名称" v-model="form.name"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="主题" prop="theme">
        <el-col :span="6">
        <el-input placeholder="请填写门店主题" v-model="form.theme"></el-input>
      </el-col>
      </el-form-item>
      <el-form-item label="地址" class="selectcl white-el-select" prop="address">
        <location-select @set="handleSetLocation"></location-select>
      </el-form-item>
      <span class="info-upload-titles">联系方式</span>
      <el-form-item label="联系人" prop="contact_user">
        <el-col :span="6">
        <el-input placeholder="请填写联系人姓名" v-model="form.contact_user"></el-input>
      </el-col>
      </el-form-item>
      <el-form-item label="咨询电话" prop="counsel_phone">
        <el-col :span="6">
        <el-input placeholder="请填写联系人电话" v-model="form.counsel_phone"></el-input>
      </el-col>
      </el-form-item>
      <el-form-item label="咨询时间">
        <el-time-picker is-range v-model="time" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" @change="changeTime">
        </el-time-picker>
      </el-form-item>
      <span class="info-upload-titles">门店图片</span>
      <el-form-item label="" class="shangchaun">
        <el-upload :action="uploadUrl()" list-type="picture-card" :headers="headers" :on-preview="handlePictureCardPreview" :on-success="handleSuccess" name='image' :before-upload="beforeAvatarUpload" :on-remove="handleRemove" :on-progress="handleProgress" :disabled="isClick">
          <i class="el-icon-plus"></i>
          <span class="imgPosition">上传图片</span>
        </el-upload>
        <div class="fx-text-tips">（温馨提示：最多能上传5张图片，每张大小不能超过2M，分辨率建议为750*420，支持jpg/jpeg/png格式图片）
        </div>
      </el-form-item>
      <el-form-item label="门店描述" prop="describe" ref="edit">
        <editor @editorValue="getValue" :describe='form.describe'></editor>
      </el-form-item>
      <el-form-item label="" size="small">
        <el-button type="primary" class="sub-btn" @click="submit" :loading="addLoading">提交</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="form.images" alt="">
    </el-dialog>
  </section>
</template>
<script>
import locationSelect from './Location'
import { addStore } from '@/api/api'
import Editor from '@/components/Editor.vue'
export default {
  components: {
    Editor,
    locationSelect,
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      checkList: [],
      addLoading: false,
      tab: '',
      province_id: '',
      /* 选择市需要 省id */
      provinceList: [],
      cityList: [],
      districtList: [],
      city_id: '',
      isClick: false,
      time: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 18, 40)],
      startTime: '',
      endTime: '',
      form: {
        images: [],
        name: '',
        rent_type: '',
        status: '',
        type: '',
        theme: '',
        province: '',
        city: '',
        district: '',
        address: '',
        contact_user: '',
        counsel_phone: '',
        counsel_time: '',
        describe: '',
        history: '',
        shop: '',
        relax: '',
        bus: '',
      },
      addStoreRules: {
        name: [{
          required: true,
          message: '请输入门店名称',
          trigger: 'blur',
        }],
        rent_type: [{
          required: true,
          message: '请选择门店类型',
          trigger: 'blur',
        }],
        status: [{
          required: true,
          message: '请选择门店状态',
          trigger: 'blur',
        }],
        theme: [{
          required: true,
          message: '请输入门店主题',
          trigger: 'blur',
        }],
        province: [{
          required: true,
          message: '请选择省份',
          trigger: 'blur',
        }],
        city: [{
          required: true,
          message: '请选择城市',
          trigger: 'blur',
        }],
        district: [{
          required: true,
          message: '请选择区',
          trigger: 'blur',
        }],
        address: [{
          required: true,
          message: '请输入门店地址',
          trigger: 'blur',
        }],
        contact_user: [{
          required: true,
          message: '请输入联系人信息',
          trigger: 'blur',
        }],
        counsel_phone: [
          {
            required: true,
            message: '请输入咨询电话',
            trigger: 'blur',
          },
          {
            min: 8,
            max: 11,
            message: '请输入正确的电话',
            trigger: 'blur',
          },
        ],
        counsel_time: [{
          required: true,
          message: '请输入咨询时间',
          trigger: 'blur',
        }],
        describe: [{
          required: true,
          message: '请输入门店描述',
          trigger: 'blur',
        }],
        history: [{
          required: true,
          message: '请输入周边配套的医院',
          trigger: 'blur',
        }],
        shop: [{
          required: true,
          message: '请输入周边配套的商场',
          trigger: 'blur',
        }],
        relax: [{
          required: true,
          message: '请输入周边配套的休闲',
          trigger: 'blur',
        }],
        bus: [{
          required: true,
          message: '请输入周边配套的交通',
          trigger: 'blur',
        }],
        images: [{
          required: true,
          message: '请上传图片',
          trigger: 'blur',
        }],
      },
    }
  },

  computed: {
    headers() {
      return {
        'Token': sessionStorage.getItem('token'),
      }
    },
  },
  created() {
    // this.getProvince()
  },
  mounted() {
    // this.$refs.edit.$el.lastChild.style.zIndex = 100;
  },
  methods: {
    // 获取富文本编辑的内容
    getValue(value) {
      this.form.describe = value
    },
    uploadUrl() {
      return this.fxCfg.image_upload_url
    },
    handleSetLocation (province, city, district, address) {
      this.form.province = province
      this.form.city = city
      this.form.district = district
      this.form.address = address
    },

    // 对图片删除操作也需要对images 进行重新定义
    handleRemove(file) {
      this.form.images.forEach((item, i) => {
        if (item == file.response.data.image_url) {
          this.form.images.splice(i, 1)
        }
      })
    },
    handlePictureCardPreview() {
      this.dialogVisible = true
    },
    handleProgress() {
      this.isClick = true
    },
    handleSuccess(res) {
      this.isClick = false
      this.$message.success('图片上传成功')
      if (this.form.images.length < 5) {
        this.form.images.push(res.data.image_url)
      }
    },
    // 对上传图片进行规定
    beforeAvatarUpload(file) {
      const isJPG = file.type == 'image/jpeg' || file.type == 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      const imageLength = this.form.images.length < 5
      if (!isJPG) {
        this.$message.error('上传头像图片只能是jpg、jpeg、png 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      if (!imageLength) {
        this.$message.error('最多上传图片5张')
        return false
      }
      return isJPG && isLt2M && imageLength
    },
    changeTime(val) {
      let startHour = val[0].getHours() > 9 ? val[0].getHours() : '0' + val[0].getHours()
      let startMinutes = val[0].getMinutes() > 9 ? val[0].getMinutes() : '0' + val[0].getMinutes()
      let startSeconds = val[0].getSeconds() > 9 ? val[0].getSeconds() : '0' + val[0].getSeconds()
      this.startTime = startHour + ':' + startMinutes + ':' + startSeconds
      let endHour = val[1].getHours() > 9 ? val[1].getHours() : '0' + val[1].getHours()
      let endMinutes = val[1].getMinutes() > 9 ? val[1].getMinutes() : '0' + val[1].getMinutes()
      let endSeconds = val[1].getSeconds() > 9 ? val[1].getSeconds() : '0' + val[1].getSeconds()
      this.endTime = endHour + ':' + endMinutes + ':' + endSeconds
      this.form.counsel_time = this.startTime + '至' + this.endTime
    },
    submit() {
      let that = this
      // let para = Object.assign({}, that.form)
      that.$refs.addStore.validate((valid) => {
        if (valid) {
          that.$confirm('确认提交吗？', '提示', {}).then(() => {
            that.addLoading = true
            let para = Object.assign({}, that.form)
            if (para.province === '') {
              that.$message({
                message: '请选择省',
                type: 'error',
              })
            } else if (para.city === '') {
              that.$message({
                message: '请选择市',
                type: 'error',
              })
            }
            addStore(para).then(res => {
              if (res) {
                that.$message({
                  message: '提交成功',
                  type: 'success',
                })
                that.$refs['addStore'].resetFields()
                that.$router.push({
                  path: '/storemanage',
                })
              } else {
                that.$message.error('添加门店失败')
              }
            }).catch(err => {
              that.$message({
                message: '提交失败' + err,
                type: 'error',
              })
              that.addLoading = false
            })
          }).catch(function() {
            that.addLoading = false
            that.$message({
              type: 'info',
              message: '已取消提交',
            })
          })
        }
      })
    },
  },

}

</script>
<style>
.ql-editor {
  min-height: 300px;
}
</style>
