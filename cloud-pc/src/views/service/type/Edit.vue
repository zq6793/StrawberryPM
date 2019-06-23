<template>
  <section class="fx-pages-main edit-server">
    <!--工具条-->
    <el-col :span="24">
      <el-form :model="editServer" label-width="100px">
        <el-form-item label="类型名称:" prop="name">
          <el-input class="input_inner" v-model='editServer.name' placeholder="请填写服务类型名称"></el-input>
        </el-form-item>
        <el-form-item label="服务特点:" prop="feature">
          <el-input class="input_inner" v-model='editServer.feature' placeholder="请填写我们服务的特点"></el-input>
        </el-form-item>
        <el-form-item label="添加图片:" prop="image_url">
          <el-upload
            :action="uploadUrl()"
            :file-list="imageList"
            list-type="picture-card"
            :headers="headers"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            name="image"
            :limit="1"
            :disabled="isClickT"
            :on-progress="handleProgressT"
            :before-upload="beforeAvatarUploadT">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="详细描述:" prop="description" ref="ww">
          <editor @editorValue="getValue" :describe='editServer.description'></editor>
        </el-form-item>
        <el-button type="primary" class="add-btn" @click="editSubmit" :loading="editLoading">提交</el-button>
      </el-form>
    </el-col>
  </section>
</template>
<script type="text/javascript">
import Editor from '@/components/Editor'
import { editService, serviceTypes } from '@/api/api'
export default {
  components: {
    Editor,
  },
  data () {
    return {
      server_id: '',
      isClickT: false,
      editServer: {
        name: '',
        feature: '',
        description: '',
        image_url: '',
      },
      dialogVisible: false,
      editLoading: false,
      editor: '',
      imageList: [],
    }
  },
  computed: {
    headers () {
      return {
        'Token': sessionStorage.getItem('token'),
      }
    },
  },
  mounted () {
    this.server_id = this.$route.query.id
    this.getService()
  },
  methods: {
    getValue (value) {
      this.editServer.description = value
    },
    uploadUrl () {
      return this.fxCfg.image_upload_url
    },

    /* 获取信息 */
    getService () {
      let that = this
      let para = {
        id: that.server_id,
      }
      serviceTypes(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        that.func.portInit(rescode, resmsg, function () {
          that.editServer = res.data.data.list[0]
          that.imageList = [{
            url: that.editServer.image_url,
          }]
        })
      })
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handleProgressT () {
      this.isClickT = true
    },
    handlePictureCardPreview () {
      this.dialogVisible = true
    },
    handleSuccess (res) {
      this.isClickT = false
      this.$message('图片上传成功')
      this.editServer.image_url = res.data.image_url
    },
    beforeAvatarUploadT (file) {
      const isJPG = file.type == 'image/jpeg' || file.type == 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是jpg、jpeg、png 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },

    /* 编辑服务 */
    editSubmit () {
      let that = this
      that.$confirm('确认提交吗？', '提示', {}).then(() => {
        that.editLoading = true
        let para = {
          id: that.editServer.id,
          name: that.editServer.name,
          feature: that.editServer.feature,
          description: that.editServer.description,
          image_url: that.editServer.image_url,
        }
        editService(para).then((res) => {
          that.editLoading = false
          let rescode = res.data.rescode
          let resmsg = res.data.resmsg
          that.func.portInit(rescode, resmsg, function () {
            that.addLoading = false
            that.$message({
              message: '修改成功',
              type: 'success',
            })
            that.$router.push({
              path: '/servicetype',
            })
          })
        }).catch(function (err) {
          console.log(err)
        })
      }).catch(function () {
        that.editLoading = false
        that.$message({
          type: 'info',
          message: '已取消提交',
        })
      })
    },
  },

}
</script>

<style scoped>
</style>
