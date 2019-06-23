<template>
  <section class="fx-pages-main add-temlate">
    <!--工具条-->
      <el-form ref="addtemplate" :model="addtemplate" :rules="addTemplateRules" label-width="100px">
        <el-form-item label="选择门店">
          <city-store-select @set="handleSetStore"></city-store-select>
        </el-form-item>
          <el-form-item label="模板名称" prop="name">
            <el-col :span="8">
            <el-input class="input_inner" placeholder="请输入模板名称" size="small" v-model="addtemplate.name"></el-input>
          </el-col>
          </el-form-item>
          <el-form-item label="模板类型" prop="type"  size="small">
            <el-select placeholder="请选择模板类型" v-model="addtemplate.type">
              <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模板上传" prop="file_url">
            <el-col :span="8">
            <el-input class="input_inner" placeholder="请上传模板" size="small" v-model="addtemplate.file_url" disabled></el-input>
          </el-col>
            <el-upload class="upload-demo" :action="uploadUrl()" multiple :on-success="handleAvatarSuccess" ref="upload" :before-upload="beforeLoad" :headers="headers" :on-progress="handleProgress">
            <el-button size="small" type="primary" @click="isShow" class="upload" :disabled="isClick">+</el-button>
            <div slot="tip" class="el-upload__tip"></div>
          </el-upload>
          </el-form-item>
          <el-form-item>
               <el-button type="primary" class="add-btn" @click="submit" v-loading="listLoadings">确定</el-button>
          </el-form-item>
      </el-form>

  </section>
</template>
<script type="text/javascript">
import { CityStoreSelect } from '@/components/selects'
import { addtemplate } from '@/api/api'
export default {
  components: {
    CityStoreSelect,
    // TextSearchSelect,
  },
  data () {
    return {
      dialogVisible: false,
      city: '',
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
      addtemplate: {
        name: '',
        type: '',
        file_url: '',
        store_id: 0,
      },
      addTemplateRules: {
        name: [{
          required: true,
          message: '请输入模板名称',
          trigger: 'blur',
        } ],
        file_url: [{
          required: true,
          message: '请上传模板',
          trigger: 'blur',
        } ],
      },
      listLoadings: false,
      isClick: false,
    }
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
  mounted () {

  },
  methods: {
    handleSetStore (city, storeId) {
      this.city = city
      this.addtemplate.store_id = storeId
    },
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
      this.addtemplate.file_url = file.response.data.file_url
      this.listLoadings = false
      this.isClick = false
      this.$message({
        message: '上传文件成功',
        type: 'success',
      })
    },

    //  提交
    submit () {
      let that = this
      that.listLoadings = true
      that.$refs.addtemplate.validate((valid) => {
        if (valid) {
          let para = Object.assign({}, that.addtemplate)
          that.func.emptyVul(para, function () {
            that.listLoadings = false
          }, function () {
            that.$confirm('确认提交吗？', '提示', {}).then(() => {
              if (!para.type) {
                that.listLoadings = false
                that.$message({
                  message: '请选择模板类型',
                  type: 'error',
                })
              } else {
                addtemplate(para).then((res) => {
                  let rescode = res.data.rescode
                  let resmsg = res.data.resmsg
                  that.func.portInit(rescode, resmsg, function () {
                    that.listLoadings = false
                    that.$message({
                      message: '提交成功',
                      type: 'success',
                    })
                    that.$refs['addtemplate'].resetFields()
                    that.$router.push({
                      path: '/contracttemplate',
                    })
                  })
                }).catch(function (err) {
                  console.log(err)
                })
              }
            }).catch(function () {
              that.listLoadings = false
              that.$message({
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
