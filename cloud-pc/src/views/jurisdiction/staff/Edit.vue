<template>
  <section class="fx-pages-main edit-staff">
    <!--工具条-->
    <div class="fx-head-m">员工信息</div>
    <el-form ref="editStaff" :model="editStaff" label-width="100px" v-loading="listLoading" :rules="editStaffRs">
      <el-form-item label="员工姓名" prop="" size="small">
        <el-col :span="6">
        <el-input placeholder="请填写员工姓名" v-model="editStaff.name"></el-input>
      </el-col>
      </el-form-item>
      <el-form-item label="联系方式" prop="" size="small">
        <el-col :span="6">
        <el-input placeholder="请填写员工联系方式" v-model="editStaff.phone"></el-input>
      </el-col>
      </el-form-item>
      <el-form-item label="职位" prop="" size="small">
        <el-select placeholder="请选择" v-model="editStaff.position" size="small">
          <el-option v-for="item in positionList"
            :key="item.ID"
            :label="item.name"
            :value="item.ID"></el-option>
        </el-select>
        <el-button @click="addPosition()" type="primary" size="small">添加</el-button>
      </el-form-item>
      <el-form-item label="">
         <el-tag :key="tag" v-for='tag in positionIDs' closable :disable-transitions="false" @close="handleClose(tag)" style="margin-right: 10px;">
          {{tag | getPositionName(positionList)}}
        </el-tag>
      </el-form-item>
      <el-form-item label="状态" prop="">
        <el-radio-group v-model="editStaff.status">
          <el-radio label="DISABLE">离职</el-radio>
          <el-radio label="ENABLE">在职</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="fx-head-m">负责区域</div>
      <el-form-item label="">
        <el-checkbox :indeterminate="stroeIndete" v-model="checkAllStore" @change="checkAllStores">全选</el-checkbox>
        <el-form-item class="storesty" v-for="(values, key) in cityAll" :key="key">
          <span class="titlecity">{{ key }}:</span>
          <el-checkbox-group v-model="checkedStore" @change="checkedStoresChange" style="padding-left:60px">
            <el-checkbox v-for="names in values" :label="names.name" :key="names.id" ref="checked">{{ names.name }}<span style="display:none">{{names.id}}</span></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="submit" :loading="listLoading">提交</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>
<script type="text/javascript">
import { editStaff, getStaff, jobList, getAddStaffStore } from '@/api/api'
export default {
  data () {
    return {
      listLoading: false,
      // nameList: [],
      editStaff: {
        id: '',
        name: '',
        phone: '',
        permissions: [],
        status: '',
      },
      checkAllCity: false,
      cityIndete: true,
      checkedCities: [],
      checkAllStore: false,
      stroeIndete: true,
      cityAll: {},
      checkedStores: [],
      checkedStore: [],
      id: '',
      positionList: [],
      editStaffRs: {
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
      positionIDs: [],
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
  created () {
    this.id = this.$route.query.id
  },
  mounted () {
    this.getAddStore()
    this.showPositions()
    this.getStaff()
  },
  filters: {
    getPositionName (id, list) {
      for (let i = list.length - 1; i >= 0; i--) {
        if (list[i].ID == id) {
          return list[i].name
        }
      }
      return ''
    },
  },
  methods: {

    // /*获取门店信息*/
    getAddStore () {
      let that = this
      let para = {}
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
        })
      }).catch(function (err) {
        console.log(err)
      })
    },

    // 获取职位
    showPositions () {
      let that = this

      jobList().then(res => {
        that.positionList = res.items
      }).catch(err => {
        console.log(err)
      })
    },

    /* 获取信息 */
    getStaff () {
      let that = this

      that.listLoading = true
      getStaff(that.id).then(res => {
        that.checkedStore = res.store_name.split(',')
        that.editStaff = res
        that.listLoading = false
        if (res.position_ids != '') {
          res.position_ids.split(',').forEach(item => {
            that.positionIDs.push(parseInt(item))
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },

    /* 全选城市 */
    checkAllCitys () {
      let that = this
      let citys = that.cityAll
      for (let key in citys) {
        if (that.checkAllCity) {
          that.checkedCities.push(key)
        } else {
          that.checkedCities = []
        }
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
      let citys = that.cityAll

      for (let key in citys) {
        for (let name in citys[key]) {
          if (that.checkAllStore) {
            that.checkedStore.push(citys[key][name].name)
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

    // 添加职位
    addPosition () {
      let that = this
      if (!that.editStaff.position) return that.$message.error('请选择职位在进行添加')
      if (that.positionIDs.indexOf(that.editStaff.position) == -1) {
        that.positionIDs.push(that.editStaff.position)
      } else {
        that.$message.error('您已经选取过该职位了，请重新选取')
      }

      this.positionList.some(item => {
        if (item.ID === that.editStaff.ID) {
          that.position.push(item.ID)
          return true
        }
      })
    },

    handleClose (tag) {
      this.positionIDs.splice(this.positionIDs.indexOf(tag), 1)
    },

    /* 提交 */
    submit () {
      let that = this
      let list = {}
      let arr = []; let // 门店ID
        position = that.positionIDs; let // 职位ID
        ids = []
      that.$refs.checked.forEach((item) => {
        list[item.$el.lastChild.lastElementChild.innerText] = item.$el.innerText
      })

      that.checkedStore.forEach((item) => {
        for (let key in list) {
          if (list[key] == item) {
            arr.push(key)
          }
        }
      })

      position.forEach(item => {
        arr.forEach(items => {
          ids.push({ store_id: parseInt(items), position_id: item })
        })
      })
      that.$refs.editStaff.validate((valid) => {
        if (valid) {
          that.$confirm('确认提交吗？', '提示', {}).then(() => {
            that.listLoading = true
            let id = that.id
            let para = {
              id: parseInt(that.id),
              name: that.editStaff.name,
              phone: that.editStaff.phone,
              permissions: ids,
              status: that.editStaff.status,
            }

            editStaff(id, para).then(() => {
              that.listLoading = false
              that.$message.success('提交成功')
              that.$refs['editStaff'].resetFields()
              that.$router.push({
                path: '/staffmanagement',
              })
            }).catch(err => {
              console.log(err)
            })
          }).catch(function () {
            that.listLoading = false
            that.$message.info('已取消提交')
          })
        }
      })
    },
  },
}
</script>
