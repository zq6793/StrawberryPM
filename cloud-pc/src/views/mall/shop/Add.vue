<template>
  <section class="fx-pages-main">
    <el-form ref="addForm" :model="addForm" label-width="100px" :rules="addFormRules" style="margin:20px;width:60%;min-width:600px;" class="addshop">
      <el-form-item label="商品名称" class='white-el-select' prop="name">
        <el-input placeholder="请输入商品名称" v-model="addForm.name"></el-input>
      </el-form-item>
      <el-form-item label="原始链接" class='white-el-select' prop="original_link">
        <el-input placeholder="请输入原始链接" v-model="addForm.original_link"></el-input>
      </el-form-item>
      <el-form-item label="商品分类:" prop="category_id">
        <el-select v-model="category_id" placeholder="请选择" @change="categoryId">
          <el-option v-for="item in goodsOptions" :key="item.id" :label="item.name" :value="item.id" style="background: #fafafa; color: #000; border-radius: 0; border-bottom:1px solid #D8D8D8;"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="市场价格" class='white-el-select' prop="market_price">
        <el-input placeholder="请输入市场价格" v-model="addForm.market_price"></el-input>
      </el-form-item>
      <el-form-item label="售价" class='white-el-select' prop="shop_price">
        <el-input placeholder="请输入本店售价" v-model="addForm.shop_price"></el-input>
      </el-form-item>
      <el-form-item label="数量" class='white-el-select' prop="quantity">
        <el-input placeholder="请输入剩余数量" v-model="addForm.quantity"></el-input>
      </el-form-item>
      <el-form-item label="已售数据" class='white-el-select' prop="sale_num">
        <el-input placeholder="请输入已售数量" v-model="addForm.sale_num"></el-input>
      </el-form-item>
      <el-form-item label="是否上架" prop="on_sale">
        <el-radio-group v-model='addForm.on_sale'>
          <el-radio class="radio" :label="0">显示</el-radio>
          <el-radio class="radio" :label="1">不显示</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="添加缩略图:" class="shangchaun">
        <el-upload :action="uploadUrl()" list-type="picture-card" :headers="headers" :on-preview="handlePictureCardPreview" :on-success="handleSuccess" limit=1 name='image' ref="upload" :disabled="isClickT" :on-progress="handleProgressT" :before-upload="beforeAvatarUploadT" :on-remove="handleRemove">
          <img v-if="addForm.goods_thumb" :src="addForm.goods_thumb" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="描述" class='white-el-select'>
        <el-input placeholder="请输入商品简要描述" v-model="addForm.description"></el-input>
      </el-form-item>
      <el-form-item label="添加商品轮播:" class="shangchaun" prop="license">
        <el-upload :action="uploadUrl()" list-type="picture-card" :headers="headers" :on-preview="handlePictureCardPreview" :on-success="handleSuccesss" name='image' :before-upload="beforeAvatarUpload" :on-remove="handleRemove" :on-progress="handleProgress" :disabled="isClick">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="addForm.goods_carousel" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="详细描述:" prop="name" ref="ww">
        <editor @editorValue="getValue" :describe='addForm.detail'></editor>
      </el-form-item>
      <el-button type="primary" @click="getContent" :loading="listLoading">提交</el-button>
    </el-form>
  </section>
</template>
<script>
import Editor from '@/components/Editor'
import { addGoods, getGoodsList } from '@/api/api'
export default {
  name: 'editor',
  data () {
    return {
      listLoading: false,
      dialogImageUrl: '',
      dialogVisible: false,
      goodsOptions: [],
      isClick: false,
      isClickT: false,
      addForm: {
        name: '',
        category_id: '',
        market_price: '',
        shop_price: '',
        quantity: '',
        sale_num: '',
        description: '',
        detail: '',
        original_link: '',
        on_sale: '',
        goods_thumb: '',
        goods_carousel: [],
      },
      category_id: '',
      addFormRules: {
        name: [{
          required: true,
          message: '请输入商品名称',
          trigger: 'blur',
        } ],
        original_link: [{
          required: true,
          message: '请输入商品原始连接',
          trigger: 'blur',
        } ],
        market_price: [{
          required: true,
          message: '请选择门店状态',
          trigger: 'blur',
        } ],
        shop_price: [{
          required: true,
          message: '请输入商品价格',
          trigger: 'blur',
        } ],
        quantity: [{
          required: true,
          message: '请输入商品数量',
          trigger: 'blur',
        } ],
        sale_num: [{
          required: true,
          message: '请输入以售出的数量',
          trigger: 'blur',
        } ],
        description: [{
          required: true,
          message: '请输入商品描述',
          trigger: 'blur',
        } ],
        detail: [{
          required: true,
          message: '请输入商品详情',
          trigger: 'blur',
        } ],
        goods_thumb: [{
          required: true,
          message: '请上传商品缩略图',
          trigger: 'blur',
        } ],
        goods_carousel: [{
          required: true,
          message: '请上传商品轮播图',
          trigger: 'blur',
        } ],
      },
    }
  },

  computed: {
    headers () {
      return {
        Token: sessionStorage.getItem('token'),
      }
    },
  },
  mounted () {
    this.getClassOtion()
  },
  components: {
    Editor,
  },
  methods: {
    getValue (value) {
      this.addForm.describe = value
    },
    uploadUrl () {
      return this.fxCfg.image_upload_url
    },

    // 对图片删除操作也需要对images 进行重新定义
    handleRemove (file) {
      this.addForm.goods_carousel.forEach((item, i) => {
        if (item == file.response.data.image_url) {
          this.addForm.goods_carousel.splice(i, 1)
        }
      })
    },
    handlePictureCardPreview () {
      this.dialogVisible = true
    },
    handleSuccess (res) {
      this.isClickT = false
      this.$message('图片上传成功')
      this.addForm.goods_thumb = res.data.image_url
    },
    handleProgressT () {
      this.isClickT = true
    },
    handleProgress () {
      this.isClick = true
    },
    handleSuccesss (res) {
      this.isClick = false
      this.$message('图片上传成功')
      if (this.addForm.goods_carousel.length < 5) {
        this.addForm.goods_carousel.push(res.data.image_url)
      }
    },
    // 对商品缩略图进行规定
    beforeAvatarUploadT (file) {
      this.$refs.upload.$el.firstChild.style.display = 'none'
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
    // 对轮播图片进 行规定
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      const imageLength = this.addForm.goods_carousel.length < 5
      if (!isJPG) {
        this.$message.error('上传头像图片只能是jpg、jpeg、png 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      if (!imageLength) {
        this.$message.error('最多上传图片5张')
        // return false;
      }
      return isJPG && isLt2M && imageLength
    },

    /* 获取商品分类 */
    getClassOtion () {
      let that = this
      let para = {}
      getGoodsList(para).then(res => {
        let rescode = res.data.rescode
        let getData = res.data.data
        let resmsg = res.data.resmsg
        that.func.portInit(rescode, resmsg, function () {
          that.goodsOptions = getData.list
        })
      }).catch(function (err) {
        console.log(err)
      })
    },

    /* 选择商品分类 */
    categoryId () {
      this.category_id = this.category_id
    },

    /* 提交 */
    getContent () {
      let that = this
      that.$refs.addForm.validate(valid => {
        if (valid) {
          that.$confirm('确认提交吗？', '提示', {}).then(() => {
            that.listLoading = true
            let para = Object.assign({}, that.addForm)
            para.on_sale = (para.on_sale === 0) ? 'Y' : 'N'
            para.category_id = that.category_id
            if (para.category_id === '') {
              that.$message({
                message: '请选择商品分类ID',
                type: 'error',
              })
            } else {
              addGoods(para).then(res => {
                that.listLoading = false
                let rescode = res.data.rescode
                let resmsg = res.data.resmsg
                that.func.portInit(rescode, resmsg, function () {
                  that.$message({
                    message: '提交成功',
                    type: 'success',
                  })
                  that.$refs['addForm'].resetFields()
                  that.$router.push({
                    path: '/administration',
                  })
                })
              }).catch(function (err) {
                console.log(err)
              })
            }
          }).catch(() => {
            that.listLoading = false
            this.$message({
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
