<template>
  <section class="fx-pages-main ">
    <el-form :model="editshop" ref="addShop" label-width="100px" style="margin:20px;width:60%;min-width:600px;" class="formx" :loading="listLoading">
      <el-form-item label="商品名称" class='white-el-select'>
        <el-input placeholder="请输入商品名称" v-model="editshop.name"></el-input>
      </el-form-item>
      <el-form-item label="原始链接" class='white-el-select' prop="original_link">
        <el-input placeholder="请输入原始链接" v-model="editshop.original_link"></el-input>
      </el-form-item>
      <el-form-item label="分类名称:" prop="category_id">
        <el-select v-model="editshop.category_id" placeholder="请选择" size="small" @change="categoryId">
          <el-option v-for="item in goodsOptions" :key="item.id" :label="item.name" :value="item.id" style="background: #fafafa; color: #000; border-radius: 0; border-bottom:1px solid #D8D8D8;"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="市场价格" class='white-el-select'>
        <el-input placeholder="请输入市场价格" v-model="editshop.market_price"></el-input>
      </el-form-item>
      <el-form-item label="售价" class='white-el-select'>
        <el-input placeholder="请输入本店售价" v-model="editshop.shop_price"></el-input>
      </el-form-item>
      <el-form-item label="数量" class='white-el-select'>
        <el-input placeholder="请输入剩余数量" v-model="editshop.quantity"></el-input>
      </el-form-item>
      <el-form-item label="已售数据" class='white-el-select' prop="sale_num">
        <el-input placeholder="请输入已售数量" v-model="editshop.sale_num"></el-input>
      </el-form-item>
      <el-form-item label="是否上架">
        <el-radio v-model="editshop.on_sale" label="Y">显示</el-radio>
        <el-radio v-model="editshop.on_sale" label="N">不显示</el-radio>
      </el-form-item>
      <el-form-item label="添加缩略图:" class="shangchaun" prop="goods_thumb">
        <el-upload class="avatar-uploader" :action="uploadUrl()" :show-file-list="false" :on-success="thumbnail" name="image" ref="upload" :disabled="isClickT" :on-progress="handleProgressT" :before-upload="beforeAvatarUploadT" :on-remove="handleRemove">
          <img v-if="editshop.goods_thumb" :src="editshop.goods_thumb" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="描述" class='white-el-select'>
        <el-input placeholder="请输入商品简要描述" v-model="editshop.description"></el-input>
      </el-form-item>
      <el-form-item label="商品轮播图:" class="shangchaun" prop="goods_carousel">
        <el-upload :action="uploadUrl()" list-type="picture-card" :headers="headers" :on-preview="handlePictureCardPreview" :on-success="handleSuccess" limit=1 name="image" :before-upload="beforeAvatarUpload" :on-remove="handleRemove" :on-progress="handleProgress" :disabled="isClick">
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div>
          <img :src="item" class="avatar" v-for="(item, i) in images" :key="item" @click='delImage(i)'>
        </div>
        <el-dialog :visible.sync="dialogVisible">
        </el-dialog>
      </el-form-item>
      <el-form-item label="详细描述:" prop="detail" ref="edit">
        <editor @editorValue="getValue" :describe='editshop.detail'></editor>
        <el-col :span="24">
          <el-button type="danger" class="add-btn" @click="getContent" :loading="listLoading">提交</el-button>
        </el-col>
      </el-form-item>
    </el-form>
  </section>
</template>
<script>
import Editor from '@/components/Editor'
import { editGoods, getGoodsList, getGoodList } from '@/api/api'
export default {
  components: {
    Editor,
  },
  name: 'editor',
  data () {
    return {
      shop_id: '',
      editshop: {
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
        goods_carousel: '',
      },
      dialogVisible: false,
      listLoading: false,
      goodsOptions: [],
      category_id: '',
      images: [],
      length: '',
      editshopRules: {},
      item: '',
      isClickT: false,
      isClick: false,
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

  methods: {
    getValue (value) {
      this.editshop.describe = value
    },
    uploadUrl () {
      return this.fxCfg.image_upload_url
    },

    // 对图片删除操作也需要对images 进行重新定义
    handleRemove (file) {
      this.editshop.goods_carousel.forEach((item, i) => {
        if (item == file.response.data.image_url) {
          this.editshop.goods_carousel.splice(i, 1)
        }
      })
    },
    handlePictureCardPreview () {
      this.dialogVisible = true
    },
    handleProgressT () {
      this.isClickT = true
    },
    handleProgress () {
      this.isClick = true
    },
    /* 缩略图 */
    thumbnail (res) {
      this.isClickT = false
      this.$message('图片上传成功')
      this.editshop.goods_thumb = res.data.image_url
    },
    // 轮播图
    handleSuccess (res) {
      if (this.images.length > 1) {
        this.images = this.images.slice(0, this.length)
      } else {
        this.images = this.images.slice(0, this.length)
      }
      this.isClick = false
      this.$message('图片上传成功')
      if (this.editshop.goods_carousel.length < 5) {
        this.editshop.goods_carousel.push(res.data.image_url)
      }
    },
    // 对商品缩略图进行规定
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
    // 对轮播图片进 行规定
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      const imageLength = this.editshop.goods_carousel.length < 5
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
    /* 获取信息 */
    getGoodInfo () {
      let that = this
      let para = {
        id: that.shop_id,
      }
      that.listLoading = true
      getGoodList(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        that.func.portInit(rescode, resmsg, function () {
          that.editshop = res.data.data.list[0]
          that.images = that.editshop.goods_carousel
          that.length = that.images.length
          that.listLoading = false
          that.editor.txt.html(that.editshop.detail)
          // that.editor.$textElem[0].innerHTML = that.editshop.detail;ss
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
    delImage (i) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let index = i
        this.images.forEach((item, i) => {
          if (index == i) {
            this.images.splice(i, 1)
          }
        })
        this.editshop.goods_carousel.forEach((item, i) => {
          if (item == this.item) {
            this.editshop.goods_carousels.splice(i, 1)
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

    /* 获取商品分类 */
    getClassifications () {
      let that = this
      let para = {}
      getGoodsList(para).then(res => {
        let rescode = res.data.rescode
        let getData = res.data.data.list
        let resmsg = res.data.resmsg
        that.func.portInit(rescode, resmsg, function () {
          that.goodsOptions = getData
        })
      }).catch(function (err) {
        console.log(err)
      })
    },

    /* 选择商品分类 */
    categoryId () {
      this.category_id = this.editshop.category_id
    },

    /* 提交 */
    getContent () {
      let that = this
      if (that.editshop.on_sale == '否') {
        that.editshop.on_sale = 'N'
      } else if (that.editshop.on_sale == '是') {
        that.editshop.on_sale = 'Y'
      }
      that.$refs.addShop.validate(valid => {
        let that = this
        if (valid) {
          that.$confirm('确认提交吗？', '提示', {}).then(() => {
            that.listLoading = false
            let para = {
              id: that.editshop.id,
              name: that.editshop.name,
              category_id: that.editshop.category_id,
              market_price: that.editshop.market_price,
              shop_price: that.editshop.shop_price,
              quantity: that.editshop.quantity,
              sale_num: that.editshop.sale_num,
              detail: that.editor.txt.html(),
              description: that.editshop.description,
              original_link: that.editshop.original_link,
              on_sale: that.editshop.on_sale,
              goods_thumb: that.editshop.goods_thumb,
              goods_carousel: that.editshop.goods_carousel,
            }
            editGoods(para).then(res => {
              let rescode = res.data.rescode
              let resmsg = res.data.resmsg
              that.func.portInit(rescode, resmsg, function () {
                that.listLoading = true
                that.$message({
                  message: '提交成功',
                  type: 'success',
                })
                that.$refs['addShop'].resetFields()
                that.$router.push({
                  path: '/administration',
                })
              })
            }).catch(function (err) {
              console.log(err)
            })
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
  mounted () {
    let that = this
    that.shop_id = this.$route.query.id
    that.getGoodInfo()
    that.getClassifications()
    that.$refs.edit.$el.lastChild.style.zIndex = 100
    // that.$refs.edit.$el.lastChild.firstChild.lastChild.offsetParent.style.zIndex = 100;
    // let editor = new E('#editorElem')
    // editor.create()
    // that.editor = editor
  },
  created () {

  },
}
</script>
