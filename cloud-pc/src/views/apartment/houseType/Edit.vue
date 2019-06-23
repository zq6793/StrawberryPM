<template>
  <section class="fx-pages-main ed_house">
    <el-form ref="editHouse" :model="editHouse" :rules="addHouseRules" label-width="160px" style=":100%;min-width:600px;" v-loading="listLoading">
        <span class='info-upload-titles'>房型信息</span>
        <el-form-item label="门店名称:" class="select">
          <city-store-select @set="refresh" :store="editHouse.store_id" :city="editHouse.city"></city-store-select>
        </el-form-item>
        <el-form-item label="所属公寓:" style="display: none;">
          <el-input placeholder="" v-model="store_name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="房型名称:" prop="name">
          <el-col :span="6">
            <el-input placeholder="" v-model="editHouse.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="房型特点:" prop="feature">
          <el-col :span="6">
          <el-input placeholder="" v-model="editHouse.feature"></el-input>
        </el-col>
        </el-form-item>
        <el-form-item label="房型面积:" class="widinp">
          <el-col :span="4">
          <el-select placeholder="" v-model="editHouse.room_number">
            <el-option v-for="item in room_number" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
          <el-col :span="4">
          <el-select placeholder="" v-model="editHouse.hall_number">
            <el-option v-for="item in hall_number" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
          <el-col :span="4">
          <el-select placeholder="" v-model="editHouse.toilet_number">
            <el-option v-for="item in toilet_number" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
          <el-col :span="4">
          <el-select placeholder="" v-model="editHouse.toward">
            <el-option v-for="item in direction" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
          <el-col :span="4">
          <el-input v-model="editHouse.area" placeholder="请输入内容" class="houseSize" style="width: 80px"></el-input>
          <span>m²</span>
        </el-col>
        </el-form-item>
        <el-form-item label="配套设施:">
          <el-checkbox-group class="checkBox" v-model="facility" ref='temdata'>
            <el-col :span="3">
              <el-checkbox label="独卫"></el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-checkbox label="独立厨房"></el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-checkbox label="衣厨"></el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-checkbox label="WIFI"></el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-checkbox label="沙发"></el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-checkbox label="大床"></el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-checkbox label="座椅"></el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-checkbox label="飘窗"></el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-checkbox label="空调"></el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-checkbox label="烘干机"></el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-checkbox label="电梯"></el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-checkbox label="电视"></el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-checkbox label="冰箱"></el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-checkbox label="微波炉"></el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-checkbox label="智能门锁"></el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-checkbox label="独立阳台"></el-checkbox>
            </el-col>
          </el-checkbox-group>
        </el-form-item>
        <div class="info-upload-titles">房型展示</div>
        <el-form-item>
          <el-checkbox-group v-model="display" :max="1">
            <el-checkbox v-for="item in limitList" :label="item.id" :key="item.id">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="添加图片:">
          <div :class="{out_border: length == '' ? false:true}">
            <el-upload :action="uploadUrl()" list-type="picture-card" :headers="headers" :on-preview="handlePictureCardPreview" :on-success="handleSuccess" name="image" :before-upload="beforeAvatarUpload" :on-remove="handleRemove" :on-progress="handleProgress" :disabled="isClick">
              <i class="el-icon-plus avatar-uploader-icon"></i>
              <span class="imgPosition">上传图片</span>
            </el-upload>
           <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="editHouse.images" alt="">
          </el-dialog>
            <p class="size1">（温馨提示：最多能上传5张图片，每张大小不能超过2M，分辨率建议为750*420，支持jpg/jpeg/png格式图片）
            </p>
          </div>
        </el-form-item>
        <el-form-item label="">
            <div class="old_img">
              <img class="avatar" v-for="(item, i) in images" :key="item" :src="item"  @click='delImage(i)' style="width: 200px;margin-right: 10px">
            </div>
        </el-form-item>
        <el-form-item label="房型描述:" prop="description" ref="edit">
          <editor @editorValue="getValue" :describe='editHouse.description'></editor>
        </el-form-item>
        <el-form-item label="" prop="description" ref="edit">
          <el-button type="primary" class="add-btn" @click="submit" v-loading="listLoading">
          确认修改
          </el-button>
        </el-form-item>
    </el-form>
  </section>
</template>
<script>
import { CityStoreSelect } from '@/components/selects'
import { getRoomType, editRoomType } from '@/api/api'
import Editor from '@/components/Editor'
export default {
  components: {
    CityStoreSelect,
    Editor,
  },
  data () {
    return {
      textarea: '',
      listLoading: false,
      dialogVisible: false,
      checkedString: '',
      images: [],
      facility: [],
      length: '',
      store_id: '',
      isClick: false,
      item: '',
      editor: '',
      limitList: [{
        id: '1',
        label: '展示',
      },
      {
        id: '0',
        label: '不展示',
      },
      ],
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
      }, {
        value: 5,
        label: '5室',
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
      direction: [{
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
      room_type_id: '',
      editHouse: {
        room_type_id: '',
        store_id: '',
        name: '',
        feature: '',
        area: '',
        room_number: '',
        hall_number: '',
        toilet_number: '',
        toward: '',
        provides: '',
        description: '',
        images: [],

      },
      display: [],
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
        // toward: [{
        //   required: true,
        //   message: '请输入房型的朝向',
        //   trigger: 'blur'
        // }],
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
  created () {
    this.editHouse.room_type_id = this.$route.query.id
    this.room_type_id = this.$route.query.id
  },
  mounted () {
    this.getRoomtype()
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
      this.editHouse.description = value
    },
    uploadUrl () {
      return this.fxCfg.image_upload_url
    },

    // 对图片删除操作也需要对images 进行重新定义
    handleRemove (file) {
      this.editHouse.images.forEach((item, i) => {
        if (item == file.response.data.image_url) {
          this.editHouse.images.splice(i, 1)
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
      if (this.editHouse.images.length < 5) {
        this.editHouse.images.push(res.data.image_url)
      }
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type == 'image/jpeg' || file.type == 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      const imageLength = this.editHouse.images.length < 5
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
        this.editHouse.images.forEach((item, i) => {
          if (item == this.item) {
            this.editHouse.images.splice(i, 1)
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
    // 获取房型的信息
    getRoomtype () {
      let that = this
      that.listLoading = true
      getRoomType(that.room_type_id).then(res => {
        that.listLoading = false
        // res.provides = JSON.parse(res.provides);
        if (res.images.length > 0) {
          that.images = res.images
          that.length = that.images.length
        } else {
          that.images = []
          res.images = []
        }

        that.display.push(res.display)
        // 配套设施的选择
        let provides = JSON.parse(res.provides)
        for (let key in provides) {
          if (provides[key] == '1') {
            that.facility.push(key)
          }
        }

        that.editHouse.toward = that.getTranstion(res.toward)
        that.editHouse = res
        // that.getTranstion()
      }).catch(err => {
        console.log(err)
      })
      // getRoomtype(para).then(res => {
      //   let getData = res.data.data.room_type,
      //     rescode = res.data.rescode,
      //     resmsg = res.data.resmsg;
      //   that.func.portInit(rescode, resmsg, function() {
      //     getData.provides = JSON.parse(getData.provides)
      //     that.cityValue = getData.store.city
      //     that.store_name = getData.store.name
      //     if(getData.images == null) {
      //       that.images = [];
      //       getData.images = [];
      //     } else {
      //       that.images = getData.images;
      //       that.length = that.images.length;
      //     }
      //     that.display.push(getData.display);
      //     that.editHouse = getData;
      //     that.listLoading = false;
      //     // 配套设施的选择
      //     for(let key in getData.provides) {
      //       if(getData.provides[key] == "1") {
      //         that.facility.push(key);
      //       }
      //     }
      //     that.getTranstion()
      //   });
      // }).catch(function(err) {
      //   console.log(err)
      // });
    },
    // 房间朝向类型的转化
    getTranstion () {
      if (this.editHouse.toward === 'E') {
        this.editHouse.toward = '朝东'
      } else if (this.editHouse.toward === 'W') {
        this.editHouse.toward = '朝西'
      } else if (this.editHouse.toward === 'S') {
        this.editHouse.toward = '朝南'
      } else if (this.editHouse.toward === 'N') {
        this.editHouse.toward = '朝北'
      } else if (this.editHouse.toward === 'EW') {
        this.editHouse.toward = '东西'
      } else if (this.editHouse.toward === 'SN') {
        this.editHouse.toward = '南北'
      }
    },

    // 编辑房型
    submit () {
      let that = this
      // 对房型设施进行定义
      let checkedList = {}
      let temdata = that.$refs.temdata.$el.children
      for (let i = 0; i < temdata.length; i++) {
        if (temdata[i].firstChild.firstChild.className.indexOf('is-checked') != -1) {
          let valueChecked = temdata[i].firstChild.firstChild.lastChild.value
          checkedList[valueChecked] = '1'
        } else {
          let value = temdata[i].firstChild.firstChild.lastChild.value
          checkedList[value] = '0'
        }
      }
      let provides = ''
      provides = JSON.stringify(checkedList)
      // 对房屋朝向进行定义
      if (that.editHouse.toward === '朝东') {
        that.editHouse.toward = 'E'
      } else if (that.editHouse.toward === '朝西') {
        that.editHouse.toward = 'W'
      } else if (that.editHouse.toward === '朝南') {
        that.editHouse.toward = 'S'
      } else if (that.editHouse.toward === '朝北') {
        that.editHouse.toward = 'N'
      } else if (that.editHouse.toward === '东西') {
        that.editHouse.toward = 'EW'
      } else if (that.editHouse.toward === '南北') {
        that.editHouse.toward = 'SN'
      }
      if (that.editHouse.area < 0) {
        that.$message.error('房型面积不能为负数')
      } else {
        that.$refs.editHouse.validate((valid) => {
          if (valid) {
            that.$confirm('确认提交吗？', '提示', {}).then(() => {
              that.addLoading = true
              let id = that.room_type_id
              let para = Object.assign({}, that.editHouse)
              para.provides = provides
              para.room_type_id = that.room_type_id
              para.display = that.display.toString()
              editRoomType(id, para).then(res => {
                that.addLoading = false
                that.$message({
                  message: '提交成功',
                  type: 'success',
                })
                that.$refs['editHouse'].resetFields()
                that.$router.push({
                  path: '/housetypemanage',
                })
              }).catch(err => {
                console.log(err)
              })
              // updateRoomtype(para).then((res) => {
              //   that.addLoading = false;
              //   let rescode = res.data.rescode,
              //     resmsg = res.data.resmsg;
              //   that.func.portInit(rescode, resmsg, function() {
              //     that.$message({
              //       message: '提交成功',
              //       type: 'success'
              //     });
              //     that.$refs['editHouse'].resetFields();
              //     that.$router.push({
              //       path: '/housetypemanage'
              //     })
              //   })
              // })
            }).catch(() => {
              that.addLoading = false
              this.$message({
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
<style scoped="scoped">
  .editor .ql-editor{min-height: 300px;}
</style>
