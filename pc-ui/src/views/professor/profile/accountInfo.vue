<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="110px">
    <el-form-item label="身份证号" prop="idcard_number">
      <el-input v-model="form.idcard_number"></el-input>
    </el-form-item>
    <!-- <el-form-item label="身份证照">
      <el-upload
        class="avatar-uploader"
        :action="pUploadCardImgURL"
        :headers="uploadHeader"
        name="image"
        :show-file-list="false"
        :on-success="handleAvatarSuccess_idcard_front_img"
        :before-upload="beforeAvatarUpload">
        <img v-if="form.idcard_front_img" :src="form.idcard_front_img" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon">正面</i>
      </el-upload>
      <el-upload
        class="avatar-uploader"
        :action="pUploadCardImgURL"
        :headers="uploadHeader"
        name="image"
        :show-file-list="false"
        :on-success="handleAvatarSuccess_idcard_back_img"
        :before-upload="beforeAvatarUpload">
        <img v-if="form.idcard_back_img" :src="form.idcard_back_img" class="avatar">
        <span v-else>
          <i class="el-icon-plus avatar-uploader-icon">反面</i>
        </span>
      </el-upload>
    </el-form-item> -->
    <el-form-item label="开户行" prop="bank_type">
      <el-input v-model="form.bank_type"></el-input>
    </el-form-item>
    <el-form-item label="支行" prop="bank_name">
      <el-input v-model="form.bank_name"></el-input>
    </el-form-item>
    <el-form-item label="开户人姓名">
      <el-tooltip class="item" effect="dark" content="开户人姓名需与专家姓名保持一致，如姓名有误，可联系服务支持修改" placement="bottom-start">
        <el-input v-model="form.bank_card_account" :disabled="true"></el-input>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="账号" prop="bank_card_number">
      <el-input v-model="form.bank_card_number"></el-input>
    </el-form-item>
    <!-- <el-form-item label="银行卡照片"> -->
      <!-- <el-input v-model="form.idcard_number"></el-input> -->
      <!-- <el-input v-model="form.idcard_number"></el-input> -->
      <!-- <el-upload
        class="avatar-uploader"
        :action="pUploadCardImgURL"
        :headers="uploadHeader"
        name="image"
        :show-file-list="false"
        :on-success="handleAvatarSuccess_bank_card_front_img"
        :before-upload="beforeAvatarUpload">
        <img v-if="form.bank_card_front_img" :src="form.bank_card_front_img" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon">正面</i>
      </el-upload>
      <el-upload
        class="avatar-uploader"
        :action="pUploadCardImgURL"
        :headers="uploadHeader"
        name="image"
        :show-file-list="false"
        :on-success="handleAvatarSuccess_bank_card_back_img"
        :before-upload="beforeAvatarUpload">
        <img v-if="form.bank_card_back_img" :src="form.bank_card_back_img" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon">反面</i>
      </el-upload>
    </el-form-item> -->
    <el-form-item>
      <el-button type="primary" @click="onSubmit" :disabled="disabledSubmit">保存</el-button>
      <el-button @click="cancleSubmit">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { pUpdatePrivateInfo, pUploadCardImgURL, token } from '@/api/api'

export default {
  props: {
    profile: Object,
  },
  data() {
    return {
      pUploadCardImgURL: pUploadCardImgURL(),
      uploadHeader: {
        Token: token(),
      },
      form: {
        idcard_number: '',
        idcard_hand_img: '',
        idcard_front_img: '',
        idcard_back_img: '',
        bank_type: '',
        bank_name: '',
        bank_card_number: '',
        bank_card_account: '',
        bank_card_front_img: '',
        bank_card_back_img: '',
      },
      rules: {
        idcard_number: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
        bank_type: [{ required: true, message: '请输入开户行名称', trigger: 'blur' }],
        bank_name: [{ required: true, message: '请输入开户行支行', trigger: 'blur' }],
        // bank_card_account: [{ required: true, message: '请输入银行卡号', trigger: 'blur' }],
        bank_card_number: [{ required: true, message: '请输入银行卡号', trigger: 'blur' }],
      },
    }
  },
  watch: {
    profile () {
      this.reload()
    }
  },
  methods: {
    reload () {
      this.form = this.profile
      this.form.bank_card_account = this.form.name
    },
    cancleSubmit () {
      this.reload()
    },
    onSubmit () {
      let that = this
      this.form.bank_card_account = this.form.name
      this.$refs['form'].validate((valid) => {
        if (valid) {
          pUpdatePrivateInfo(this.form).then((res) => {
            that.$message({
              type: 'success',
              message: '更新成功',
            })
          }).catch((err) => {
            that.$message({
              type: 'error',
              message: '更新出错',
            })
          })
        } else {
          return false
        }
      })
    },
    handleAvatarSuccess_idcard_front_img (res) {
      this.form.idcard_front_img = res.image_url
    },
    handleAvatarSuccess_idcard_back_img (res) {
      this.form.idcard_back_img = res.image_url
    },
    handleAvatarSuccess_bank_card_front_img (res) {
      this.form.bank_card_front_img = res.image_url
    },
    handleAvatarSuccess_bank_card_back_img (res) {
      this.form.bank_card_back_img = res.image_url
    },
  },
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
