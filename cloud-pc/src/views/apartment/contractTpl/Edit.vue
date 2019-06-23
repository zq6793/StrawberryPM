<template>
  <section class="fx-pages-main edit-temlate">
    <!--工具条-->
      <div class="fx-head-b">&nbsp;</div>
      <el-form ref="editTemp" :model="editTemp" label-width="100px" v-loading="listLoading">
          <el-form-item label="所属城市" prop="city">
            <el-select v-model="city" placeholder="请选择" size="small" @change="searchCity">
              <el-option v-for="item in cityList" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="门店名称" class="select">
            <el-select v-model="editTemp.store_id" placeholder="请选择" size="small" @change="searchName">
              <el-option v-for="item in storesList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模板名称" prop="name">
            <el-col :span="6">
            <el-input class="input_inner" placeholder="请输入模板名称" size="small" v-model="editTemp.name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="模板类型" prop="rent_type" size="small">
            <el-select placeholder="请选择模板类型" v-model="editTemp.type">
              <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
  <!--         <el-form-item label="模板上传" prop="url">
            <el-input class="input_inner" size="small" v-model="editTemp.file_url" disabled></el-input>
          </el-form-item> -->
          <el-form-item label="模板上传" prop="url">
          <el-upload
            class="upload-demo"
            drag
           :action="uploadUrl()" multiple :on-success="handleAvatarSuccess" ref="upload" :before-upload="beforeLoad" :headers="headers" :on-progress="handleProgress">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传pdf文件，且不超过4M</div>
          </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="add-btn" @click="submit" v-loading="listLoadings">确定</el-button>
          </el-form-item>
      </el-form>
  </section>
</template>
<script type="text/javascript">
import { updateTemplate, getTemplate, getCityList, getStoreList } from '@/api/api'
export default {
  data () {
    return {
      template_id: '',
      rent_type: '',
      url: '',
      types: [{
        value: 'LONG',
        label: '长租',
      }, {
        value: 'SHORT',
        label: '短租',
      }, {
        value: 'RESERVE',
        label: '预定',
      } ],
      editTemp: {
        template_id: '',
        name: '',
        type: '',
        file_url: '',
        store_id: '',
      },
      city: '',
      cityList: [],
      storesList: [],
      listLoading: false,
      isClick: false,
      listLoadings: false,
    }
  },
  created () {
    this.template_id = this.$route.query.template_id
    this.getCity()
    this.getStoreInfo()
    this.getTemplate()
  },

  ready () {
    this.createEditor()
  },
  computed: {
    headers () {
      return {
        'Token': sessionStorage.getItem('token'),
      }
    },
  },
  methods: {
    uploadUrl () {
      return this.fxCfg.file_upload_url
    },

    // 使文件上传文件隐藏
    isShow () {
      this.$refs.upload.$el.lastElementChild.style.display = 'none'
    },
    handleProgress () {
      this.listLoadings = true
      this.isClick = true
    },
    beforeLoad (file) {
      const isfile = file.type == 'application/pdf'
      if (!isfile) {
        this.$message.error('请上传pdf格式文件!')
      }
      return isfile
    },
    handleAvatarSuccess (res, file) {
      this.listLoadings = false
      this.isClick = false
      this.editTemp.url = file.response.data.file_url
      this.editTemp.file_url = file.response.data.file_url
      this.$message({
        message: '上传文件成功',
        type: 'success',
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
      if (that.city == '请选择') {
        that.store_id = ''
      }
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
          that.storesList = getData
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
    // 获取编辑详情
    getTemplate () {
      let that = this
      let para = {
        template_id: that.template_id,
      }
      that.listLoading = true
      getTemplate(para).then(res => {
        let getData = res.data.data.template
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        getData.template_id = that.template_id
        that.func.portInit(rescode, resmsg, function () {
          that.city = getData.store.city
          getData.type = getData.rent_type
          getData.file_url = getData.url
          that.editTemp = getData
          that.listLoading = false
        })
      }).catch(function (err) {
        console.log(err)
      })
    },

    submit () {
      let that = this
      that.$refs.editTemp.validate((valid) => {
        if (valid) {
          let para = Object.assign({}, that.editTemp)
          that.func.emptyVul(para, function () {
            that.listLoadings = false
          }, function () {
            that.$confirm('确认提交吗？', '提示', {}).then(() => {
              that.listLoadings = true
              updateTemplate(para).then((res) => {
                let rescode = res.data.rescode
                let resmsg = res.data.resmsg
                that.func.portInit(rescode, resmsg, function () {
                  that.listLoadings = false
                  that.$message({
                    message: '提交成功',
                    type: 'success',
                  })
                  that.$refs['editTemp'].resetFields()
                  that.$router.push({
                    path: '/contracttemplate',
                  })
                })
              }).catch(function (err) {
                console.log(err)
              })
            }).catch(() => {
              that.listLoadings = false
              this.$message({
                type: 'info',
                message: '已取消提交',
              })
            })
          })
        }
      })
    },
  },

}
</script>
