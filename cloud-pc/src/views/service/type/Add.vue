<template>
  <section class="fx-pages-main add-server">
    <div class="fx-head-b">&nbsp;</div>
      <el-form ref="addSever" :model="addSever" label-width="100px" :rules="addSeverRules">
        <el-form-item label="类型名称:" prop="name">
          <el-col :span="6">
            <el-input class="input_inner" v-model='addSever.name' placeholder="请填写服务类型名称"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="服务特点:" prop="feature">
          <el-col :span="6">
          <el-input class="input_inner" v-model='addSever.feature' placeholder="请填写我们服务的特点"></el-input>
        </el-col>
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
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="addSever.image_url" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="详细描述:" prop="description">
          <editor @editorValue="getValue" :describe='addSever.description'></editor>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" class="add-btn" @click="submit" :loading="addLoading">提交</el-button>
        </el-form-item>
      </el-form>
  </section>

</template>
<script type="text/javascript">
import Editor from '@/components/Editor'
import { addService } from '@/api/api'
export default {
  components: {
    Editor,
  },
  data () {
    return {
      addSever: {
        name: '',
        feature: '',
        description: '',
        image_url: '',
      },
      isClickT: false,
      addSeverRules: {
        name: [{
          required: true,
          message: '请填写服务类型名称',
          trigger: 'blur',
        } ],
        feature: [{
          required: true,
          message: '请填写我们服务的特点',
          trigger: 'blur',
        } ],
        description: [{
          required: true,
          message: '请输入详细描述',
          trigger: 'blur',
        } ],
      },
      dialogVisible: false,
      addLoading: false,
      editorContent: '',
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

  methods: {
    getValue (value) {
      this.addSever.description = value
    },
    uploadUrl () {
      return this.fxCfg.image_upload_url
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
      this.addSever.image_url = res.data.image_url
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
    /* 添加服务 */
    submit () {
      let that = this
      that.$refs.addSever.validate((valid) => {
        if (valid) {
          that.$confirm('确认提交吗？', '提示', {}).then(() => {
            that.addLoading = true
            let para = Object.assign({}, that.addSever)
            addService(para).then((res) => {
              let rescode = res.data.rescode
              let resmsg = res.data.resmsg
              that.func.portInit(rescode, resmsg, function () {
                that.addLoading = false
                that.$message({
                  message: '提交成功',
                  type: 'success',
                })
                that.$refs['addSever'].resetFields()
                that.$router.push({
                  path: '/servicetype',
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
  },
}
</script>
