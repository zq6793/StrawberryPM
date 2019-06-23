<template>
<section>
<el-form ref="residentInfo" :model="basicList" label-width="100px" v-loading="listLoading" :rules="editbasicRules" class="forms">
  <el-form-item label="姓名" prop="name" size="small">
    <el-col :span="2">
    <el-input v-if="isEditer" v-model="basicList.name"></el-input>
    <span v-else>{{ basicList.name }}</span>
  </el-col>
    <el-col :span="3" :offset="12">
    <el-button v-if="isEditer" type="primary" class="add-btn" @click="submit" :loading="listLoading">确认修改</el-button>
    <el-button v-else type="primary" class="add-btn" @click="doEditer" :loading="listLoading">编辑</el-button>
  </el-col>
  </el-form-item>
  <el-form-item label="性别" prop="genderl" size="small">
    <el-select v-if="isEditer" v-model="basicList.genderl" placeholder="请选择">
      <el-option v-for="item in genderlList" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <span v-else>{{ basicList.genderl }}</span>
  </el-form-item>
  <el-form-item label="联系方式" prop="phone" size="small">
    <el-col :span="3">
    <el-input v-if="isEditer" v-model="basicList.phone"></el-input>
    <span v-else>{{ basicList.phone }}</span>
    </el-col>
  </el-form-item>
  <el-form-item label="证件类型" class="white-el-select" size="small">
    <el-select v-if="isEditer" v-model="basicList.card_type" placeholder="请选择">
      <el-option v-for="item in cardList" :key="item.id" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <span v-else>{{ basicList.card_type_name }}</span>
  </el-form-item>
  <el-form-item label="证件号码" prop="card_number" size="small">
    <el-col :span="6">
    <el-input v-if="isEditer" v-model="basicList.card_number"></el-input>
    <span v-else>{{ basicList.card_number }}</span>
  </el-col>
  </el-form-item>
  <el-form-item label="证件照片:" class="image"  size="small">
    <img v-if="basicList.card_one" :src="basicList.card_one" class="avatar" @click="lookImg(basicList.card_one)" width="120px">
    <img v-if="basicList.card_two" :src="basicList.card_two" class="avatar" @click="lookImg(basicList.card_two)" width="120px">
    <img v-if="basicList.card_three" :src="basicList.card_three" class="avatar" @click="lookImg(basicList.card_three)" width="120px">
  </el-form-item>
  <el-form-item label="紧急联系人" prop="alternative"  size="small">
    <el-col :span="3">
    <el-input v-if="isEditer" placeholder="请输入紧急联系人" v-model="basicList.alternative"></el-input>
    <span v-else>{{ basicList.alternative }}</span>
  </el-col>
  </el-form-item>
  <el-form-item label="联系电话" prop="alter_phone"  size="small">
    <el-col :span="3">
    <el-input v-if="isEditer" placeholder="请输入联系电话 " v-model="basicList.alter_phone"></el-input>
    <span v-else>{{ basicList.alter_phone }}</span>
    </el-col>
  </el-form-item>
  <!--列表-->
  <el-form-item label=""  size="small">
  </el-form-item>
</el-form>
  <el-dialog title="查看照片" :visible.sync="showlookImg">
    <img :src="lookImgsrc">
  </el-dialog>
</section>
</template>
<script>
import { residentInfo, updateresident } from '@/api/api'
export default {
  data () {
    return {
      basicList: {},
      residentid: '',
      genderlList: [{
        label: '未知',
        value: '',
      }, {
        label: '女',
        value: 'W',
      }, {
        label: '男',
        value: 'M',
      }],
      cardList: [{
        label: '请选择',
        value: '',
      },
      {
        label: '身份证',
        value: '0',
      },
      {
        label: '护照',
        value: '1',
      },
      {
        label: '军人身份证',
        value: '2',
      },
      {
        label: '社会保障卡',
        value: '6',
      },
      {
        label: '武装警察身份证件',
        value: 'A',
      },
      {
        label: '港澳通行证',
        value: 'B',
      },
      {
        label: '户口簿',
        value: 'E',
      },
      {
        label: '临时居民身份证',
        value: 'F',
      },
      {
        label: '外国人永久居留证',
        value: 'P',
      },
      {
        label: '营业执照',
        value: 'BL',
      },
      {
        label: '其他',
        value: 'OTHER',
      },
      ],
      isEditer: false,
      showlookImg: false,
      lookImgsrc: '',
    }
  },
  created () {
    this.residentid = this.$route.query.id
  },
  computed: {
    headers () {
      return {
        Token: sessionStorage.getItem('token'),
      }
    },
  },
  mounted () {
    this.getBasic()
  },
  methods: {
    uploadUrl () {
      return this.fxCfg.image_upload_url
    },
    getBasic () {
      let that = this
      let para = {
        id: this.residentid,
      }
      residentInfo(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data
        that.cardList.forEach(function(value, index, array) {
          if (value.value == getData[0].card_type) {
            getData[0].card_type_name = value.label
          }
        })
        that.func.portInit(rescode, resmsg, function () {
          that.genderTra(getData[0])
          that.basicList = getData[0]
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
    // 性别转化
    genderTra (getData) {
      if (getData.customer_s.gender == 'W') {
        getData.genderl = '女'
      } else if (getData.customer_s.gender == 'M') {
        getData.genderl = '男'
      } else {
        getData.genderl = '未知'
      }
    },
    submit () {
      let that = this
      if (that.basicList.genderl == '男') {
        that.basicList.gender = 'M'
      } else if (that.basicList.genderl == '女') {
        that.basicList.gender = 'W'
      } else {
        that.basicList.gender = 'N'
      }
      let para = Object.assign({}, that.basicList)
      that.$refs.residentInfo.validate((valid) => {
        if (valid) {
          that.$confirm('确认提交吗？', '提示', {}).then(() => {
            that.listLoading = true
            updateresident(para).then((res) => {
              that.listLoading = false
              let rescode = res.data.rescode
              let resmsg = res.data.resmsg
              that.func.portInit(rescode, resmsg, function () {
                that.$message({
                  message: '提交成功',
                  type: 'success',
                })
                that.$refs['residentInfo'].resetFields()
                that.$router.push({
                  path: '/household',
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
    doEditer () {
      this.isEditer = true
    },
    lookImg (val) {
      this.showlookImg = true
      this.lookImgsrc = val
    }
  },
}
</script>
