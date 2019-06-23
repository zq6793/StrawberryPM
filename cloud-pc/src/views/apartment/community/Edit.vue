<template>
  <section class="fx-pages-main edit-built">
    <el-form ref="editBuilt" :model="edit" label-width="100px" style="margin:20px; min-width:200px;" v-loading="listLoading">
      <el-form-item class="city-select">
        <el-form-item label="所属城市" prop="city">
          <el-select v-model="edit.city" placeholder="请选择" @change="searchCity">
            <el-option v-for="item in cityList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店名称" prop="store_id" class="store">
          <el-select v-model="edit.store_id" placeholder="请选择" @change="stores(storeList)">
            <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
      <div class="white-el-select">
        <span class="info-upload-titles">小区信息</span>
        <el-form-item label="小区名称：" prop="name">
          <el-input placeholder="请填写小区名称" v-model="edit.name"></el-input>
        </el-form-item>
        <el-form-item label="小区地址：" prop="province" class="min-input">
          <el-input class="el-input" placeholder="" v-model="edit.province" :disabled="true"></el-input>
          <el-input class="el-input" placeholder="" v-model="edit.city" :disabled="true"></el-input>
          <el-select v-model="edit.district" placeholder="请选择区：" @change="searchDistrict">
            <el-option v-for="item in districts" :key="item.district_id" :label="item.district" :value="item.district" style="background: #fafafa; color: #000; border-radius: 0; border-bottom:1px solid #D8D8D8"></el-option>
          </el-select>
          <el-form-item class="text-input">
            <el-input placeholder="请填写小区详细地址" v-model="edit.address"></el-input>
          </el-form-item>
        </el-form-item>
        <span class="info-upload-titles">小区图片</span>
        <el-form-item label="添加图片:" class="shangchaun">
          <el-upload :action="uploadUrl()" list-type="picture-card" :headers="headers" :on-preview="handlePictureCardPreview" :on-success="handleSuccess" limit=1 name="image" :before-upload="beforeAvatarUpload" :on-remove="handleRemove" :on-progress="handleProgress" :disabled="isClick">
            <i class="el-icon-plus avatar-uploader-icon"></i>
            <span class="imgPosition">上传图片</span>
          </el-upload>
          <img :src="item" class="avatar" v-for="(item, i) in images" :key="item" @click='delImage(i)'>
          <el-dialog :visible.sync="dialogVisible"></el-dialog>
        </el-form-item>
        <p class="size1">（温馨提示：最多能上传5张图片，每张大小不能超过2M，分辨率建议为750*420，支持jpg/jpeg/png格式图片）</p>
        <el-form-item label="房型描述:" prop="description" ref="edit">
          <editor @editorValue="getValue" :describe='edit.describe'></editor>
          <el-button @click="submit" v-loading="editLoading" type="primary" class="btn">提交</el-button>
        </el-form-item>
      </div>
    </el-form>
  </section>
</template>
<script type="text/javascript">
import { getCityList, getStoreList, getCommunity, updateCommunity, districts } from '@/api/api'
import Editor from '@/components/Editor'
export default {
  data () {
    return {
      community_id: '',
      edit: {
        city: '',
        store_id: '',
        name: '',
        province: '',
        district: '',
        address: '',
        describe: '',
        images: [],
      },
      city: '',
      cityList: [],
      store_id: '',
      storeList: [],
      districts: [],
      editLoading: false,
      listLoading: false,
      images: [],
      editor: '',
    }
  },
  computed: {
    headers () {
      return {
        Token: sessionStorage.getItem('token'),
      }
    },
  },
  components: {
    Editor,
  },
  mounted () {
    this.community_id = this.$route.query.id
    this.getCity()
    this.getStoreInfo()
    this.getCommunitys()
  },
  methods: {
    getValue (value) {
      this.edit.describe = value
    },
    uploadUrl () {
      return this.fxCfg.image_upload_url
    },

    // 对图片删除操作也需要对images 进行重新定义
    handleRemove (file) {
      this.edit.images.forEach((item, i) => {
        if (item == file.response.data.image_url) {
          this.edit.images.splice(i, 1)
        }
      })
    },
    handleProgress () {
      this.isClick = true
    },

    handlePictureCardPreview () {
      this.dialogVisible = true
    },

    handleSuccess (res) {
      if (this.images.length > 1) {
        this.images = this.images.slice(0, this.images.length)
      } else {
        this.images = this.images.slice(0, this.images.length)
      }
      this.isClick = false
      this.$message('图片上传成功')
      if (this.edit.images.length < 5) {
        this.edit.images.push(res.data.image_url)
      }
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type == 'image/jpeg' || file.type == 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      const imageLength = this.edit.images.length < 5
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
    delImage (i) {
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
        this.edit.images.forEach((item, i) => {
          if (item == this.item) {
            this.edit.images.splice(i, 1)
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
    /* 获取小区信息 */
    getCommunitys () {
      let that = this
      let para = {
        community_id: that.community_id,
      }
      that.listLoading = true
      getCommunity(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        that.func.portInit(rescode, resmsg, function () {
          that.edit = res.data.data.community[0]
          that.images = res.data.data.community[0].images
          that.listLoading = false
        })
      }).catch(function (err) {
        console.log(err)
      })
    },

    /* 获取城市 */
    getCity () {
      let that = this
      let para = {}
      getCityList(para).then((res) => {
        let rescode = res.data.rescode
        let getData = res.data.data.cities
        let resmsg = res.data.resmsg
        getData[0] = '请选择'
        that.func.portInit(rescode, resmsg, function () {
          that.cityList = getData
        })
      }).catch(function (err) {
        console.log(err)
      })
    },

    /* 搜索城市 */
    searchCity () {
      let that = this
      that.city = that.edit.city
      that.getStoreInfo()
    },

    /* 获取门店列表 */
    getStoreInfo () {
      let that = this
      let para = {
        city: that.city,
      }
      getStoreList(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data.stores
        that.func.portInit(rescode, resmsg, function () {
          getData.unshift({
            id: '',
            name: '请选择',
          })
          that.storeList = getData
        })
      }).catch(function (err) {
        console.log(err)
      })
    },

    /* 选择门店 */
    stores () {
      let that = this
      that.store_id = that.edit.store_id
      for (let key in that.storeList) {
        if (that.storeList[key].id == that.store_id) {
          that.edit.province = that.storeList[key].province
        }
      }
      that.getDistricts()
    },

    /* 获取 区列表 */
    getDistricts () {
      let that = this
      let para = {
        city_name: that.edit.city,
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
      this.district = this.edit.district
    },

    submit () {
      let that = this
      that.editLoading = true
      let para = Object.assign({}, that.edit)
      para.community_id = that.community_id
      if (!para.address || !para.city || !para.district || !para.name || !para.province) {
        that.$message({
          message: '请完整填写表单',
          type: 'error',
        })
        that.editLoading = false
      } else {
        that.$confirm('确认提交小区的修改吗', '提示', {
          type: 'warning',
        }).then(() => {
          updateCommunity(para).then((res) => {
            that.editLoading = false
            if (res.data.rescode == 0) {
              that.$message({
                message: '提交成功',
                type: 'success',
              })
            }
            that.$router.push({ path: '/villagemanage' })
          })
        }).catch(() => {
          that.editLoading = false
          this.$message({
            type: 'info',
            message: '已取消提交',
          })
        })
      }
    },
  },
}
</script>
