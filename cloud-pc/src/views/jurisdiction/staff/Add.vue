<template>
  <section class="fx-pages-main add-staff">
    <!--工具条-->
    <el-form ref="addStaff" :model="addStaff" label-width="100px" v-loading="listLoading">
      <div class="fx-head-m">员工信息</div>
      <el-form-item label="员工姓名" prop='name' size="small">
        <el-col :span="4">
        <el-input placeholder="请填写员工姓名" v-model='addStaff.name'></el-input>
      </el-col>
      </el-form-item>
      <el-form-item label="联系方式" prop='phone' size="small">
        <el-col :span="4">
        <el-input placeholder="请填写员工联系方式" v-model='addStaff.phone'></el-input>
      </el-col>
      </el-form-item>
      <el-form-item label="入职职位" size="small">
        <el-select v-model="addStaff.position" placeholder="请选择">
          <el-option v-for="item in jobList" :key="item.Id" :label="item.name" :value="item.name"></el-option>
        </el-select>
        <el-button @click="addPosition" type="primary" size="small">添加</el-button>
      </el-form-item>
      <el-form-item label="" size="small">
         <el-tag :key="tag" v-for='tag in nameList' closable :disable-transitions="false" @close="handleClose(tag)" style="margin-right: 5px;">
          {{tag}}
        </el-tag>
      </el-form-item>
      <el-form-item label="入职时间" prop="hiredate" size="small">
        <el-date-picker type="date" placeholder="请选择日期" v-model='addStaff.hiredate' @change="hiredate" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <div class="fx-head-m">负责区域</div>
      <el-form-item label="">
<!--         <div>请选择负责城市</div>
        <el-checkbox :indeterminate="cityIndete" v-model="checkAllCity" @change="checkAllCitys">全选</el-checkbox>
        <el-checkbox-group v-model="checkedCities" @change="checkedCitiesChange" class="city">
          <el-checkbox v-for="city in cityList" :label="city" :key="city.input">{{ city }}</el-checkbox>
        </el-checkbox-group>
        <div>请选择负责门店</div> -->
        <el-checkbox :indeterminate="stroeIndete" v-model="checkAllStore" @change="checkAllStores">全选</el-checkbox>
        <el-form-item class="storesty" v-for="(values, key) in cityAll" :key="key">
          <span class="titlecity">{{ key }}：</span>
          <el-checkbox-group v-model="checkedStore" @change="checkedStoresChange" style="padding-left:60px">
            <el-checkbox v-for="names in values" :label="names.name" :key="names.id" ref="checked">{{ names.name }}<span style="display:none">{{names.id}}</span></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form-item>
      <el-form-item label="">
      </el-form-item>
      <el-button type="primary" @click="submit" class="add">提交</el-button>
    </el-form>

    <el-dialog title="绑定新员工微信" :visible.sync="centerDialogVisible" width="30%" center :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false" append-to-body>
      <div id="qrcode"></div>
      <p style="color:red; margin-top:-22px;">*注意: 此二维码只能让被添加的新员工使用手机镜头微信的扫一扫功能绑定新员工微信，截图长按识别无效</p>
    </el-dialog>
  </section>

</template>
<script type="text/javascript">
import { addStaff, getAddStaffStore, qrcodeaddCompany, isBindwxid, jobList } from '@/api/api'
export default {
  data () {
    return {
      city: '',
      store_id: '',
      staffList: [],
      jobList: [],
      form: '',
      isSubmit: false,
      centerDialogVisible: false,
      id: '',
      nameList: [],
      addStaff: {
        name: '',
        phone: '',
        store_ids: [],
        store_names: [],
        hiredate: '',
        position: [],
      },
      addStaffRs: {
        name: [{
          required: true,
          message: '请填写员工姓名',
          trigger: 'blur',
        } ],
        phone: [{
          required: true,
          message: '请填写员工联系方式',
          trigger: 'blur',
        } ],
      },
      listLoading: false,
      checkAllCity: false,
      cityIndete: true,
      checkedCities: [],
      checkAllStore: false,
      stroeIndete: true,
      cityAll: [],
      checkedStore: [],
      checkedStores: [],
      dangerouslyUseHTMLString: true,
      env: {},
      position: [],
    }
  },

  computed: {
    cityList () {
      return this.$store.getters.listCity
    },
    storeList () {
      return this.$store.getters.getStoreByCity(this.city)
    },
  },
  mounted () {
    this.getAddStore()
    this.showPositions()
    this.env = process.env
  },

  updated () {
    if (this.centerDialogVisible == true) {
      this.func.getWechatCode(this.fxCfg.wx_addstaff_redirect_uri)
    }
  },
  // 在此处监听路由变化
  watch: {
    '$route.query': function () {
      this.wechat()
    },
  },
  methods: {
    submit () {
      let that = this
      let list = {}
      let ids = []
      that.addStaff.store_ids = []
      that.addStaff.store_names = []
      that.$refs.checked.forEach((item) => {
        list[item.$el.lastChild.lastElementChild.innerText] = item.$el.innerText
      })
      that.checkedStore.forEach((item) => {
        for (let key in list) {
          if (list[key] == item) {
            that.addStaff.store_ids.push(JSON.parse(key))
          }
        }
      })
      that.addStaff.store_ids = Array.from(new Set(that.addStaff.store_ids))
      that.addStaff.store_names = that.checkedStore.toString()
      let para = Object.assign({}, that.addStaff)
      para.position = that.position
      para.position.forEach(item => {
        para.store_ids.forEach(items => {
          ids.push({ 'store_id': items, 'position_id': parseInt(item) })
        })
      })
      let pars = {
        name: para.name,
        phone: para.phone,
        hiredate: para.hiredate,
        permissions: ids,
      }
      if (!para.position || !para.hiredate) {
        that.listLoading = false
        that.$message({
          message: '请完整填写表单',
          type: 'error',
        })
        that.addStaff.store_ids = []
      } else {
        addStaff(pars).then(res => {
          that.centerDialogVisible = true
          that.id = res.ID
        }).catch(err => {
          console.log(err)
        })
      }
    },

    wechat () {
      let that = this
      that.urlCode = that.$route.query
      if (!that.urlCode.code) {} else {
        that.addStaffs()
      }
    },

    /* 搜索城市 */
    searchCity () {
      this.getStaffList()
    },

    addStaffs () {
      let that = this
      if (that.urlCode.code) {
        let para = {
          code: that.urlCode.code,
          id: that.id,
        }
        qrcodeaddCompany(para).then(res => {
          let resmsg = res.data.resmsg
          let rescode = res.data.rescode
          if (rescode !== 0) {
            that.$message({
              message: resmsg,
              type: 'error',
            })
          } else {
            that.isBindwxid()
          }
        }).catch(function (err) {
          console.log(err)
        })
      } else {
        that.$message({
          message: '添加员工失败,请重新扫码',
          type: 'error',
        })
      }
    },

    isBindwxid () {
      let that = this
      let para = {
        id: that.id,
      }
      isBindwxid(para).then((res) => {
        let getData = res.data.data[0]
        if (getData == 'YES') {
          that.$message({
            message: '添加员工成功',
            type: 'success',
          })
          that.$router.push({ path: '/staffmanagement' })
        } else {
          that.$message({
            message: '添加员工失败,请重新扫码',
            type: 'error',
          })
          that.haveCode()
        }
      })
    },
    // 获取职位
    showPositions () {
      let that = this
      let para = that.id
      jobList(para).then((res) => {
        let getData = res.items
        that.jobList = getData
      }).catch(function (err) {
        console.log(err)
      })
    },
    // 添加职位
    addPosition () {
      let that = this
      if (!this.addStaff.position) return this.$message.error('请选择职位在进行添加')
      if (this.nameList.indexOf(this.addStaff.position) == -1) {
        this.nameList.push(this.addStaff.position)
      } else {
        this.$message.error('您已经选取过该职位了，请重新选取')
      }

      that.jobList.some(item => {
        if (item.name === that.addStaff.position) {
          that.position.push(item.ID)
          return true
        }
      })
    },
    handleClose (tag) {
      this.nameList.splice(this.nameList.indexOf(tag), 1)
    },
    /* 选择门店 */
    stores () {
      this.addStaff.store_id = this.store_id
    },
    /* 选择入职时间 */
    hiredate (val) {
      this.addStaff.hiredate = val + 'T00:00:00+08:00'
    },

    /* 获取门店信息 */
    getAddStore () {
      let that = this
      let para = {}
      that.listLoading = true
      getAddStaffStore(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data
        that.func.portInit(rescode, resmsg, function () {
          that.cityAll = getData
          for (let key in that.cityAll) {
            for (let name in that.cityAll[key]) {
              that.checkedStores.push(that.cityAll[key][name].name)
            }
          }
          that.checkedStores = Array.from(new Set(that.checkedStores))
          that.listLoading = false
        })
      }).catch(function (err) {
        console.log(err)
      })
    },

    /* 全选城市 */
    checkAllCitys () {
      let that = this
      if (that.checkAllCity) {
        that.checkedCities = that.cityList
      } else {
        that.checkedCities = []
      }
      that.cityIndete = false
    },

    checkedCitiesChange (value) {
      let that = this
      let checkedCount = value.length
      that.checkAllCity = checkedCount === that.cityList.length
      that.cityIndete = checkedCount > 0 && checkedCount < that.cityList.length
    },
    /* 全选门店 */
    checkAllStores () {
      let that = this
      for (let key in that.cityAll) {
        for (let name in that.cityAll[key]) {
          if (that.checkAllStore) {
            that.checkedStore.push(that.cityAll[key][name].name)
          } else {
            that.checkedStore = []
          }
        }
      }
      that.stroeIndete = false
    },
    checkedStoresChange (value) {
      let that = this
      let checkedCount = value.length
      that.checkedStore = Array.from(new Set(that.checkedStore))
      that.checkAllStore = checkedCount === that.checkedStores.length
      that.stroeIndete = checkedCount > 0 && checkedCount < that.checkedStores.length
    },
  },
}
</script>
