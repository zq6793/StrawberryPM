<template>
  <section class="fx-pages-main editStoreManage">
    <el-form ref="addStores" :model="editStore" label-width="160px" style="margin:20px;  min-width:200px;" class="addform" :rules="addStoreRules">
      <span class="info-upload-titles">门店信息</span>
      <el-form-item label="类型" prop="status">
        {{storeType}}
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio v-model="editStore.status" label="NORMAL">营业中</el-radio>
        <el-radio v-model="editStore.status" label="CLOSE">停业中</el-radio>
        <el-radio v-model="editStore.status" label="WAIT">即将开业</el-radio>
      </el-form-item>
      <el-form-item label="名称:" prop="name">
        <el-input placeholder="请填写门店名称" v-model="editStore.name"></el-input>
      </el-form-item>
      <el-form-item label="主题:" prop="theme">
        <el-input placeholder="请填写门店主题" v-model="editStore.theme"></el-input>
      </el-form-item>
      <el-form-item label="地址:" class="selectcl white-el-select" prop="address">
        <el-col :span="5">
          <el-select placeholder="请选择省" v-model="editStore.province" @change="provinceSelect(provinceList)">
            <el-option v-for="item in provinceList" :key="item.province_id" :label="item.province" :value="item.province"></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-select placeholder="请选择市" v-model="editStore.city" @change="citySelect(cityList)">
            <el-option v-for="item in cityList" :key="item.city_id" :label="item.city" :value="item.city"></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-select placeholder="请选择区" v-model="editStore.district">
            <el-option v-for="item in districtList" :key="item.district_id" :label="item.district" :value="item.district"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-input placeholder="请输入详细地址" v-model="editStore.address" class="place">
          </el-input>
        </el-col>
      </el-form-item>
      <span class="info-upload-titles">联系方式</span>
      <el-form-item label="联系人:" prop="contact_user">
        <el-input placeholder="请填写联系人姓名" v-model="editStore.contact_user"></el-input>
      </el-form-item>
      <el-form-item label="咨询电话:" prop="counsel_phone">
        <el-input placeholder="请填写联系人电话" v-model="editStore.counsel_phone"></el-input>
      </el-form-item>
      <el-form-item label="咨询时间">
        <el-time-picker is-range v-model="time" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" @change="changeTime">
        </el-time-picker>
      </el-form-item>
      <span class="info-upload-titles">门店图片</span>
      <el-form-item label="添加图片:" class="shangchaun">
        <div :class="{out_border: length == '' ? false:true}">
          <el-upload :action="uploadUrl()" list-type="picture-card" :headers="headers" :on-preview="handlePictureCardPreview" :on-success="handleSuccess" name='image' :before-upload="beforeAvatarUpload" :on-remove="handleRemove" :on-progress="handleProgress" :disabled="isClick">
            <i class="el-icon-plus avatar-uploader-icon"></i>
            <span class="imgPosition">上传图片</span>
          </el-upload>
              <div class="fx-text-tips">（温馨提示：最多能上传5张图片，每张大小不能超过2M，分辨率建议为750*420，支持jpg/jpeg/png格式图片）</div>
          </div>
          <el-dialog :visible.sync="dialogVisible"></el-dialog>
      </el-form-item>
      <el-form-item label="">
         <div class="old_img">
            <img :src="item" class="avatar" v-for="(item, i) in images" :key="item" @click='delImage(i)' style="width: 200px;margin-right: 10px">
          </div>
      </el-form-item>
      <el-form-item label="房型描述:" prop="description" ref="edit">
        <editor @editorValue="getValue" :describe='editStore.describe'></editor>
      </el-form-item>
      <el-button type="primary" class="sub-btn" @click="submit" :loading="addLoading">提交</el-button>
    </el-form>
  </section>
</template>
<script>
import { getStore, province, citys, districts, editStore } from '@/api/api'
import Editor from '@/components/Editor'
export default {
  data() {
    return {
      storeType: '',
      isClick: false,
      store_id: 0,
      show: true,
      dialogImageUrl: '',
      radio: false,
      dialogVisible: false,
      checkList: [],
      province_id: '',
      /* 选择市需要 省id */
      provinceList: [],
      city_id: '',
      time: [],
      /* 选择区需要 市id */
      cityList: [],
      districtList: [],
      listLoading: false,
      images: [],
      length: '',
      item: '',
      addStoreRules: {
        name: [{
          required: true,
          message: '请输入门店名称',
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
        counsel_phone: [{
          required: true,
          message: '请输入咨询电话',
          trigger: 'blur',
        }],
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
      editStore: {
        store_id: '',
        address: '',
        city: '',
        contact_user: '',
        counsel_phone: '',
        counsel_time: '',
        describe: '',
        district: '',
        images: [],
        name: '',
        province: '',
        rent_type: '',
        status: '',
        theme: '',
      },
      editor: '',
      startTime: '',
      endTime: '',
    }
  },

  components: {
    Editor,
  },

  // beforeRouteLeave(to, from, next) {
  //     if(to.path === "storemanage"){
  //         to.meta.keepAlive = true;
  //     }else{
  //         to.meta.keepAlive = false;
  //     }
  //     next();
  // },

  computed: {
    headers() {
      return {
        Token: sessionStorage.getItem('token'),
      }
    },
  },
  mounted() {
    this.store_id = parseInt(this.$route.query.id)
    this.getStore()
    this.getProvince()
  },
  methods: {
    getValue(value) {
      this.editStore.describe = value
    },
    uploadUrl() {
      return this.fxCfg.image_upload_url
    },
    // 对图片删除操作也需要对images 进行重新定义
    handleRemove(file) {
      this.editStore.images.forEach((item, i) => {
        if (item == file.response.data.image_url) {
          this.editStore.images.splice(i, 1)
        }
      })
    },
    handleProgress() {
      this.isClick = true
    },
    handlePictureCardPreview() {
      this.dialogVisible = true
    },
    handleSuccess(res) {
      if (this.images.length > 1) {
        this.images = this.images.slice(0, this.images.length)
      } else {
        this.images = this.images.slice(0, this.images.length)
      }
      this.isClick = false
      this.$message('图片上传成功')
      if (this.editStore.images.length < 5) {
        this.editStore.images.push(res.data.image_url)
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type == 'image/jpeg' || file.type == 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      const imageLength = this.editStore.images.length < 5
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
    // 删除原先的图片
    delImage(i) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let index = i
        this.images.forEach((item, i) => {
          if (index == i) {
            // item = item
            this.images.splice(i, 1)
            this.item = item
          }
        })
        this.editStore.images.forEach((item, i) => {
          if (item == this.item) {
            this.editStore.images.splice(i, 1)
          }
        })
        this.$message({
          type: 'success',
          message: '删除成功!',
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      })
    },
    /* 获取 省列表 */
    getProvince() {
      let that = this
      let para = {}
      province(para).then((res) => {
        that.provinceList = res
      }).catch(function(err) {
        console.log(err)
      })
    },
    /* 选择省 */
    provinceSelect(provinceList) {
      let that = this
      let province = ''
      province = that.editStore.province
      for (let key in provinceList) {
        if (province === provinceList[key].province) {
          that.province_id = provinceList[key].province_id
        }
      }
      that.getCity()
    },
    /* 获取 市列表 */
    getCity() {
      let that = this
      citys(that.province_id).then((res) => {
        that.cityList = res
      }).catch(function(err) {
        console.log(err)
      })
    },
    /* 选择市 */
    citySelect(cityList) {
      let that = this
      let city = ''
      city = that.editStore.city
      for (let key in cityList) {
        if (city === cityList[key].city) {
          that.city_id = cityList[key].city_id
        }
      }
      that.getDistrict()
    },
    /* 获取 区列表 */
    getDistrict() {
      let that = this
      districts(that.city_id).then((res) => {
        that.districtList = res
      }).catch(function(err) {
        console.log(err)
      })
    },
    getStore() {
      let that = this
      that.listLoading = true
      getStore(that.store_id).then(res => {
        that.listLoading = false
        that.storeType = that.func.storeTre(res.rent_type)
        if (!res.images) {
          res.images = []
        }
        that.images = res.images
        that.length = that.images.length
        let start_h = res.counsel_time.substr(0, 2)
        let start_m = res.counsel_time.substr(3, 2)
        let start_s = res.counsel_time.substr(6, 2)
        let end_h = res.counsel_time.substr(9, 2)
        let end_m = res.counsel_time.substr(12, 2)
        let end_s = res.counsel_time.substr(15, 2)
        that.time = [new Date(2016, 9, 10, start_h, start_m, start_s), new Date(2016, 9, 10, end_h, end_m, end_s)]
        that.editStore = res
      }).catch(err => {
        console.log(err)
      })
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
      this.editStore.counsel_time = this.startTime + '至' + this.endTime
    },
    submit() {
      let that = this
      that.$refs.addStores.validate((valid) => {
        if (valid) {
          that.$confirm('确认提交吗？', '提示', {}).then(() => {
            that.listLoading = true
            let id = that.store_id
            let para = Object.assign({}, that.editStore)
            editStore(id, para).then(res => {
              that.$message({
                message: '提交成功',
                type: 'success',
              })
              that.$refs['addStores'].resetFields()
              that.$router.push({
                path: '/storemanage',
              })
            }).catch(err => {
              console.log(err)
            })
          }).catch(() => {
            that.addLoading = false
            this.$message({
              type: 'info',
              message: '已取消提交',
            })
          })
        }
      })
    },
    submits() {},
  },
}

</script>
<style>
.ql-editor {
  min-height: 300px;
}
</style>
