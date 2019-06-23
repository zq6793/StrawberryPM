<template>
  <section class="fx-pages-main roomBath">
    <el-tabs type="border-card" @tab-click="handleClick">
      <el-tab-pane label="集中式">
        <el-form :inline="true" style="padding: 8px 22px">
          <el-form-item label="所属城市" prop="city">
            <el-select v-model="city" placeholder="请选择" size="small" @change="searchCity" style="color:#fff">
              <el-option v-for="item in cityList" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="门店名称" class="select">
            <el-select v-model="templateList.store_id" placeholder="请选择" size="small" @change="searchName">
              <el-option v-for="item in storesList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择楼栋" class="selectl">
            <el-select v-model="templateList.building_id" placeholder="请选择" size="small">
              <el-option v-for="item in buildingList" :key="item.building_id" :label="item.building_name" :value="item.building_id">
              </el-option>
            </el-select>
          </el-form-item>
          <strong class="size">合同模板</strong>
          <hr>
          <el-form-item class="template">
            <el-form-item label="长租" class="select">
              <el-select v-model="templateList.contract_template_long_id" placeholder="请选择" size="small">
                <el-option v-for="item in longList" :key="item.id" :label="item.name" :value="item.id" ref="long" style="background: #fafafa; color: #000; border-radius: 0; border-bottom:1px solid #D8D8D8">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="短租" class="select">
              <el-select v-model="templateList.contract_template_short_id" placeholder="请选择" size="short">
                <el-option v-for="item in shortList" :key="item.id" :label="item.name" :value="item.id" ref="long" style="background: #fafafa; color: #000; border-radius: 0; border-bottom:1px solid #D8D8D8">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="预定" class="select">
              <el-select v-model="templateList.contract_template_reserve_id" placeholder="请选择" size="small">
                <el-option v-for="item in reserveList" :key="item.id" :label="item.name" :value="item.id" ref="reserve" style="background: #fafafa; color: #000; border-radius: 0; border-bottom:1px solid #D8D8D8">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
          <br>
          <el-button type="primary" class="sub-btn" @click="submit" :loading="listLoading">确定</el-button>
        </el-form>
      </el-tab-pane>
      <!-- <el-tab-pane label="分布式">
        <el-form :inline="true" style="padding: 8px 22px">
          <el-form-item label="所属城市" prop="city" ref="addTemplates">
            <el-select v-model="citySplice" placeholder="请选择" size="small" @change="searchCity" style="color:#fff">
              <el-option v-for="item in cityList" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="门店名称" class="select">
            <el-select v-model="templateLists.store_id" placeholder="请选择" size="small" @change="searchNameSplice">
              <el-option v-for="item in storesList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="小区名称" class="select">
            <el-select v-model="templateLists.community_id" placeholder="请选择" size="small">
              <el-option v-for="item in showCommunityList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <strong class="size">合同模板</strong>
          <hr>
          <el-form-item class="template">
            <el-form-item label="长租" class="select">
              <el-select v-model="templateLists.contract_template_long_id" placeholder="请选择" size="small">
                <el-option v-for="item in longList" :key="item.id" :label="item.name" :value="item.id" style="background: #fafafa; color: #000; border-radius: 0; border-bottom:1px solid #D8D8D8">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="短租" class="select">
              <el-select v-model="templateLists.contract_template_short_id" placeholder="请选择" size="small">
                <el-option v-for="item in shortList" :key="item.id" :label="item.name" :value="item.id" style="background: #fafafa; color: #000; border-radius: 0; border-bottom:1px solid #D8D8D8">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="预定" class="select">
              <el-select v-model="templateLists.contract_template_reserve_id" placeholder="请选择" size="reserve">
                <el-option v-for="item in reserveList" :key="item.id" :label="item.name" :value="item.id" style="background: #fafafa; color: #000; border-radius: 0; border-bottom:1px solid #D8D8D8">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
          <br>
          <el-button type="primary" class="sub-btn" @click="submits" :loading="listLoading">确定</el-button>
        </el-form>
      </el-tab-pane> -->
    </el-tabs>
  </section>
</template>
<script>
import { getCityList, getStoreList, showBuilding, showCommunity, showTemplate, batchUpdatedot, batchUpdateunion } from '@/api/api'
export default {
  data () {
    return {
      input: '',
      listLoading: false,
      sels: [],
      page: 1,
      total: 0,
      city: '',
      storesList: [],
      cityList: [],
      buildingList: [],
      showCommunityList: [],
      storeList: [],
      storeListsplice: [],
      citySplice: '',
      label: '',
      longList: [],
      shortList: [],
      reserveList: [],
      templateList: {
        store_id: '',
        building_id: '',
        contract_template_long_id: '',
        contract_template_short_id: '',
        contract_template_reserve_id: '',
      },
      templateLists: {
        tore_id: '',
        community_id: '',
        contract_template_long_id: '',
        contract_template_short_id: '',
        contract_template_reserve_id: '',
      },

    }
  },
  computed: {
    headers () {
      return {
        'Token': sessionStorage.getItem('token'),
      }
    },
  },
  mounted () {
    this.getCity()
  },
  methods: {
    handleClick (tab) {
      if (tab.label == '集中式') {
        this.label = tab.label
      } else {
        this.label = tab.label
      }
    },

    /* 获取城市 */
    getCity () {
      let that = this
      let para = {
        page: that.page,
      }
      getCityList(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data.cities
        getData[0] = '请选择'
        that.func.portInit(rescode, resmsg, function () {
          that.cityList = getData
        })
      }).catch(function (err) {
        console.log(err)
      })
    },

    /* 获取门店名称 */
    getStoreList () {
      let that = this
      let para = {
        page: that.page,
        city: that.city,
      }
      if (that.label == '分布式') {
        para.city = that.citySplice
      }
      getStoreList(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data.stores
        getData.unshift({
          store_id: '',
          name: '请选择',
        })
        that.func.portInit(rescode, resmsg, function () {
          that.storesList = getData
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
    searchCity () {
      let that = this
      let para = {
        page: that.page,
        city: that.city,
      }
      if (that.label == '分布式') {
        para.city = that.citySplice
      }
      that.getStoreList()
    },
    // 长租
    getLong () {
      let that = this
      let para = {
        rent_type: 'LONG',
        store_id: that.templateList.store_id,
      }
      if (that.label == '分布式') {
        // para.store_id =  that.templateLists.store_id
      }
      showTemplate(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data
        getData.template.unshift({
          id: '',
          name: '请选择',
        })
        that.func.portInit(rescode, resmsg, function () {
          that.longList = getData.template
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
    // 短租
    getshort () {
      let that = this
      let para = {
        rent_type: 'SHORT ',
        store_id: that.templateList.store_id,
      }
      if (that.label == '分布式') {
        // para.store_id =that.templateLists.store_id
      }
      showTemplate(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data
        getData.template.unshift({
          id: '',
          name: '请选择',
        })
        that.func.portInit(rescode, resmsg, function () {
          that.shortList = getData.template
        })
      }).catch(function (err) {
        console.log(err)
      })
    },

    getreserve () {
      let that = this
      let para = {
        rent_type: 'RESERVE ',
        store_id: that.templateList.store_id,
      }
      showTemplate(para).then((res) => {
        if (that.label == '分布式') {
          // para.store_id = that.templateLists.store_id
        }
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data
        getData.template.unshift({
          id: '',
          name: '请选择',
        })
        that.func.portInit(rescode, resmsg, function () {
          that.reserveList = getData.template
        })
      }).catch(function (err) {
        console.log(err)
      })
    },

    // ---------------------------- 集中式 ------------------------------
    // 通过门店来找到楼栋
    searchName () {
      let that = this
      // 选择门店id后可以调用 合同模板
      that.getLong()
      that.getshort()
      that.getreserve()

      let para = {
        store_id: that.templateList.store_id,
      }
      that.listLoading = true
      showBuilding(para).then(res => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data
        getData.buildings.unshift({
          building_id: '',
          building_name: '请选择',
        })
        that.func.portInit(rescode, resmsg, function () {
          // 页面列表
          that.buildingList = getData.buildings
          that.listLoading = false
        })
      }).catch(function (err) {
        console.log(err)
      })
    },

    // 提交批量操作
    submit () {
      let that = this
      that.$confirm('确认提交吗？', '提示', {}).then(() => {
        that.listLoading = true
        let para = Object.assign({}, that.templateList)
        batchUpdateunion(para).then((res) => {
          that.listLoading = false
          let rescode = res.data.rescode
          let resmsg = res.data.resmsg
          that.func.portInit(rescode, resmsg, function () {
            that.$message({
              message: '提交成功',
              type: 'success',
            })
            that.$router.push({
              path: '/roommanage',
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
    },
    // ---------------------------- 分布式 ------------------------------
    searchNameSplice () {
      let that = this
      // 选择门店id后可以调用 合同模板
      that.getLong()
      that.getshort()
      that.getreserve()
      let para = {
        store_id: that.templateLists.store_id,
      }
      that.listLoading = true
      showCommunity(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data
        getData.community.unshift({
          id: '',
          name: '请选择',
        })
        that.func.portInit(rescode, resmsg, function () {
          that.showCommunityList = getData.community
          that.listLoading = false
        })
      }).catch(function (err) {
        console.log(err)
      })
    },

    // 提交批量操作
    submits () {
      let that = this
      that.$confirm('确认提交吗？', '提示', {}).then(() => {
        that.listLoading = true
        let para = Object.assign({}, that.templateLists)
        batchUpdatedot(para).then((res) => {
          that.listLoading = false
          let rescode = res.data.rescode
          let resmsg = res.data.resmsg
          that.func.portInit(rescode, resmsg, function () {
            that.$message({
              message: '提交成功',
              type: 'success',
            })
            that.$router.push({
              path: '/roommanage',
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
    },
  },

}
</script>
