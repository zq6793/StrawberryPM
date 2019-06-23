<template>
  <section class="fx-pages-main new-built">
    <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="100px">
      <div class="white-el-select">
        <p class="info-upload-titles">小区信息</p>
        <el-form-item label="选择门店" prop="store_id">
          <city-store-select @set="handleSetStore"></city-store-select>
        </el-form-item>
        <el-form-item label="小区名称：" prop="name">
          <el-input placeholder="请填写小区名称" v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="小区地址：" prop="" class="min-input">
          <el-input class="el-input" placeholder="" v-model="addForm.province" :disabled="true"></el-input>
          <el-input class="el-input" placeholder="" v-model="addForm.city" :disabled="true"></el-input>
          <el-select v-model="addForm.district" placeholder="请选择区" @change="searchDistrict">
            <el-option v-for="item in districts" :key="item.district_id" :label="item.district" :value="item.district" style="background: #fafafa; color: #000; border-radius: 0; border-bottom:1px solid #D8D8D8"></el-option>
          </el-select>
          <el-form-item class="text-input">
            <el-input placeholder="请填写小区详细地址" v-model="addForm.address" style=""></el-input>
          </el-form-item>
        </el-form-item>
        <p class="info-upload-titles">小区图片</p>
        <el-form-item label="" class="shangchaun">
          <el-upload :action="uploadUrl()" list-type="picture-card" :headers="headers" :on-preview="handlePictureCardPreview" :on-success="handleSuccess" name='image' :before-upload="beforeAvatarUpload" :on-remove="handleRemove" :on-progress="handleProgress" :disabled="isClick">
            <i class="el-icon-plus"></i>
            <span class="imgPosition">上传图片</span>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="addForm.images" alt="">
          </el-dialog>
        </el-form-item>
        <p class="size1">（温馨提示：最多能上传5张图片，每张大小不能超过2M，分辨率建议为750*420，支持jpg/jpeg/png格式图片）</p>
        <el-form-item label="门店描述" prop="describe" ref="edit">
          <editor @editorValue="getValue" :describe='addForm.describe'></editor>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="sub-btn" @click="submit" :loading="addLoading">提交</el-button>
        </el-form-item>
      </div>
    </el-form>
  </section>
</template>
<script type="text/javascript">
import { CityStoreSelect } from '@/components/selects'
import { addCommunity, districts } from '@/api/api'
import Editor from '@/components/Editor'
export default {
  components: {
    Editor,
    CityStoreSelect,
    // TextSearchSelect,
  },
  data () {
    return {
      cityValue: '',
      store_id: '',
      /* 选择需要门店Id */
      districts: [],
      /* 区 */
      addForm: {
        store_id: '',
        name: '',
        province: '',
        city: '',
        district: '',
        address: '',
        describe: '',
        images: [],
      },
      addFormRules: {
        name: [{
          required: true,
          message: '请输入小区名称',
          trigger: 'blur',
        } ],
        address: [{
          required: true,
          message: '请填写小区详细地址',
          trigger: 'blur',
        } ],
        describe: [{
          required: true,
          message: '请输入小区描述',
          trigger: 'blur',
        } ],
      },
      addLoading: false,
    }
  },
  mounted () {
  },
  computed: {
    headers () {
      return {
        'Token': sessionStorage.getItem('token'),
      }
    },
  },
  methods: {
    handleSetStore (city, storeId) {
      this.city = city
      this.store_id = storeId
    },
    getValue (value) {
      this.addForm.describe = value
    },
    uploadUrl () {
      return this.fxCfg.image_upload_url
    },
    // 对图片删除操作也需要对images 进行重新定义
    handleRemove (file) {
      this.addForm.images.forEach((item, i) => {
        if (item == file.response.data.image_url) {
          this.addForm.images.splice(i, 1)
        }
      })
    },
    handlePictureCardPreview () {
      this.dialogVisible = true
    },
    handleProgress () {
      this.isClick = true
    },
    handleSuccess (res) {
      this.isClick = false
      this.$message('图片上传成功')
      if (this.addForm.images.length < 5) {
        this.addForm.images.push(res.data.image_url)
      }
    },
    // 对上传图片进行规定
    beforeAvatarUpload (file) {
      const isJPG = file.type == 'image/jpeg' || file.type == 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      const imageLength = this.addForm.images.length < 5
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

    /* 选择门店 */
    stores (storeList) {
      let that = this
      that.store_id = that.addForm.store_id
      for (let key in storeList) {
        if (storeList[key].id === that.store_id) {
          that.addForm.province = storeList[key].province
          that.addForm.city = storeList[key].city
        }
      }
      that.getDistricts()
    },

    /* 获取区列表 */
    getDistricts () {
      let that = this
      let para = {
        city_name: that.addForm.city,
      }
      districts(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data.district
        that.func.portInit(rescode, resmsg, function () {
          getData.unshift({
            district_id: '',
            district: '请选择',
          })
          that.districts = getData
        })
      }).catch(function (err) {
        console.log(err)
      })
    },

    /* 选择区 */
    searchDistrict () {
      this.district = this.addForm.district
    },

    submit () {
      let that = this
      that.$refs.addForm.validate((valid) => {
        if (valid) {
          if (that.store_id == '') {
            that.$message({
              message: '请选择门店',
              type: 'error',
            })
          } else if (that.addForm.images.length == 0) {
            that.$message({
              message: '请上传小区图片',
              type: 'error',
            })
          } else {
            that.$confirm('确认提交吗？', '提示', {}).then(() => {
              that.addLoading = true
              let para = Object.assign({}, that.addForm)
              para.store_id = that.store_id
              addCommunity(para).then((res) => {
                that.addLoading = false
                let rescode = res.data.rescode
                if (rescode == 0) {
                  that.$message({
                    message: '提交成功',
                    type: 'success',
                  })
                  that.$refs['addForm'].resetFields()
                  that.$router.push({
                    path: '/villagemanage',
                  })
                }
              }).catch(function (err) {
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
        }
      })
    },
  },
}
</script>
