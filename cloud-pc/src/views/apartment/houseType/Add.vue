<template>
  <section class="fx-pages-main add-house">
    <el-form ref="addHouse" :model="houseParams" :rules="addHouseRules" label-width="160px">
      <div class="white-el-select built">
        <span class="info-upload-titles">房型信息</span>
        <el-form-item label="选择门店:" prop="store_id">
          <city-store-select @set="handleSetStore"></city-store-select>
        </el-form-item>
        <el-form-item label="房型名称:" prop="name">
          <el-col :span="6">
          <el-input placeholder="请填写房型名称" v-model="houseParams.name"></el-input>
        </el-col>
        </el-form-item>
        <el-form-item label="房型特点:" prop="feature">
          <el-col :span="6">
          <el-input placeholder="请填写房型特点，如朝向、装修风格" v-model="houseParams.feature"></el-input>
        </el-col>
        </el-form-item>
        <el-form-item label="房型面积:" class="widinp selectcl white-el-select">
          <el-col :span="4">
            <el-select placeholder="0室" v-model="houseParams.room_number">
            <el-option v-for="item in room_number" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          </el-col>
          <el-col :span="4">
          <el-select placeholder="0厅" v-model="houseParams.hall_number">
            <el-option v-for="item in hall_number" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          </el-col>
          <el-col :span="4">
          <el-select placeholder="0卫" v-model="houseParams.toilet_number">
            <el-option v-for="item in toilet_number" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          </el-col>
          <el-col :span="4">
          <el-select placeholder="朝南" v-model="houseParams.toward">
            <el-option v-for="item in direction_number" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input v-model="houseParams.area" placeholder="0" class="houseSize" style="width: 80px"></el-input>
          <span>m²</em></span>
        </el-col>
        </el-form-item>

        <el-form-item label="配套设施:">
          <el-checkbox-group class="checkBox" v-model="facility" prop="facility" ref='temdata'>
            <el-col :span="3">
              <el-checkbox label="WIFI"></el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-checkbox label="独卫"></el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-checkbox label="沙发"></el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-checkbox label="衣橱"></el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-checkbox label="独立厨房"></el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-checkbox label="空调"></el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-checkbox label="电视"></el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-checkbox label="微波炉"></el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-checkbox label="大床"></el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-checkbox label="桌椅"></el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-checkbox label="飘窗"></el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-checkbox label="冰箱"></el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-checkbox label="烘干机"></el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-checkbox label="电梯"></el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-checkbox label="独立阳台"></el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-checkbox label="智能门锁"></el-checkbox>
            </el-col>
          </el-checkbox-group>
        </el-form-item>
      </div>

      <div class="white-el-select built">
        <el-form-item label="是否展示在官网:">
          <el-checkbox-group v-model="houseParams.display" :max="1">
            <el-checkbox v-for="item in limitList" :label="item.id" :key="item.id">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="添加图片:" class="shangchaun" prop="license">
          <el-upload :action="uploadUrl()" list-type="picture-card" :headers="headers" :on-preview="handlePictureCardPreview" :on-success="handleSuccess" name='image' :before-upload="beforeAvatarUpload" :on-remove="handleRemove" :on-progress="handleProgress" :disabled="isClick">
            <i class="el-icon-plus"></i>
            <span class="imgPosition">上传图片</span>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="houseParams.images" alt="">
          </el-dialog>
            <p class="size1">（温馨提示：最多能上传5张图片，每张大小不能超过2M，分辨率建议为750*420，支持jpg/jpeg/png格式图片）</p>
        </el-form-item>
        <el-form-item label="房型描述:" prop="description" ref="edit">
          <editor @editorValue="getValue" :describe='houseParams.description'></editor>
        </el-form-item>
      </div>
      <el-form-item label="">
             <el-button type="primary" class="add-btn" @click="submit" v-loading="listLoading">提交</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>
<script>
import { CityStoreSelect } from '@/components/selects'
import { addRoomtypes } from '@/api/api'
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
      textarea: '',
      apm_name: '', // 需要展示公寓名称
      checkList: ['冰箱' ],
      listLoading: false,
      dialogVisible: false,
      isClick: false,
      room_number: [{
        value: 1,
        label: '1室',
      }, {
        value: 2,
        label: '2室',
      }, {
        value: 3,
        label: '3室',
      }, {
        value: 4,
        label: '4室',
      } ],
      hall_number: [{
        value: 0,
        label: '0厅',
      }, {
        value: 1,
        label: '1厅',
      }, {
        value: 2,
        label: '2厅',
      }, {
        value: 3,
        label: '3厅',
      } ],
      toilet_number: [{
        value: 1,
        label: '1卫',
      }, {
        value: 2,
        label: '2卫',
      }, {
        value: 3,
        label: '3卫',
      } ],
      direction_number: [{
        value: 'S',
        label: '朝南',
      }, {
        value: 'N',
        label: '朝北',
      }, {
        value: 'E',
        label: '朝东',
      }, {
        value: 'W',
        label: '朝西',
      }, {
        value: 'EW',
        label: '东西',
      }, {
        value: 'SN',
        label: '南北',
      } ],
      houseParams: {
        display: [],
        store_id: '',
        name: '',
        feature: '',
        area: 0,
        room_number: '',
        hall_number: '',
        toilet_number: '',
        toward: '',
        provides: [],
        description: '',
        images: [],
      },
      limitList: [{
        id: 1,
        label: '展示',
      }, {
        id: 0,
        label: '不展示',
      } ],
      facility: [],
      checkedList: {},
      addHouseRules: {
        name: [{
          required: true,
          message: '请输入房型名称',
          trigger: 'blur',
        } ],
        store_id: [{
          required: true,
          message: '请输入您所属的公寓',
          trigger: 'blur',
        } ],
        feature: [{
          required: true,
          message: '请输入房型特色',
          trigger: 'blur',
        } ],
        area: [{
          required: true,
          message: '请输入房型面积',
          trigger: 'blur',
        } ],
        room_number: [{
          required: true,
          message: '请选择卧室数目',
          trigger: 'blur',
        } ],
        hall_number: [{
          required: true,
          message: '请选择大厅数目',
          trigger: 'blur',
        } ],
        toilet_number: [{
          required: true,
          message: '请选择卫生间数目',
          trigger: 'blur',
        } ],
        toward: [{
          required: true,
          message: '请选择房型的朝向',
          trigger: 'blur',
        } ],
        facility: [{
          required: true,
          message: '请选择配套设施',
          trigger: 'blur',
        } ],
        description: [{
          required: true,
          message: '请输入房型的描述',
          trigger: 'blur',
        } ],
        images: [{
          required: true,
          message: '请添加图片',
          trigger: 'blur',
        } ],
      },
    }
  },
  mounted () {

  },
  computed: {
    headers () {
      return {
        Token: sessionStorage.getItem('token'),
      }
    },
  },
  methods: {
    handleSetStore (city, storeId) {
      // this.city = city
      this.houseParams.store_id = storeId
    },
    getValue (value) {
      this.houseParams.description = value
    },
    uploadUrl () {
      return this.fxCfg.image_upload_url
    },
    // 对图片删除操作也需要对images 进行重新定义
    handleRemove (file) {
      this.houseParams.images.forEach((item, i) => {
        if (item == file.response.data.image_url) {
          this.houseParams.images.splice(i, 1)
        }
      })
    },

    handleSuccess (res) {
      this.isClick = false
      this.$message('图片上传成功')
      if (this.houseParams.images.length < 5) {
        this.houseParams.images.push(res.data.image_url)
      }
    },

    handlePictureCardPreview () {
      this.dialogVisible = true
    },
    handleProgress () {
      this.isClick = true
    },

    // 对上传图片进行规定
    beforeAvatarUpload (file) {
      const isJPG = file.type == 'image/jpeg' || file.type == 'image/png'
      const isLt2M = file.size / 1023 / 1023 < 2
      const imageLength = this.houseParams.images.length < 5
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
    // 添加房型
    submit () {
      let that = this
      // return;
      // 对房型设施进行定义
      let temdata = that.$refs.temdata.$el.children
      for (let i = 0; i < temdata.length; i++) {
        if (temdata[i].firstChild.firstChild.className.indexOf('is-checked') != -1) {
          let valueChecked = temdata[i].firstChild.firstChild.lastChild.value
          that.checkedList[valueChecked] = '1'
        } else {
          let value = temdata[i].firstChild.firstChild.lastChild.value
          that.checkedList[value] = '0'
        }
      }
      let provides = ''
      provides = JSON.stringify(this.checkedList)
      if (that.houseParams.area < 0) {
        that.$message.error('房型面积不能为负数')
      } else {
        that.$refs.addHouse.validate((valid) => {
          if (valid) {
            that.$confirm('确认提交吗？', '提示', {}).then(() => {
              that.listLoading = true
              let para = Object.assign({}, that.houseParams)
              para.provides = provides
              para.display = para.display.toString()
              let text = para.toward
              if (text === '朝东') {
                para.toward = 'E'
              } else if (text === '朝西') {
                para.toward = 'W'
              } else if (text === '朝南') {
                para.toward = 'S'
              } else if (text === '朝北') {
                para.toward = 'N'
              } else if (text === ' 东西') {
                para.toward = 'EW'
              } else if (text === '南北') {
                para.toward = 'SN'
              }
              if (para.images.length == 0) {
                that.$message({
                  message: '请上传照片',
                  type: 'error',
                })
                that.listLoading = false
              } else {
                addRoomtypes(para).then(res => {
                  that.listLoading = false
                  that.$message({
                    message: '提交成功',
                    type: 'success',
                  })
                  that.$refs['addHouse'].resetFields()
                  that.$router.push({
                    path: '/housetypemanage',
                  })
                }).catch(err => {
                  console.log(err)
                })
              }
            }).catch(function () {
              that.listLoading = false
              that.$message({
                type: 'info',
                message: '已取消提交',
              })
            })
          }
        })
      }
    },
  },

}
</script>
<style>
  .editor .ql-editor{min-height: 300px;}
</style>
