<template>
  <section class="editprice tab-title">
    <el-tabs type="border-card" @tab-click="handleClick">
      <el-tab-pane label="集中式">
        <el-form :inline="true">
          <el-form-item label="所属城市" prop="city">
            <el-select v-model="city" placeholder="请选择" size="small" @change="searchCity">
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
          <!-- <el-form-item label="选择门店" size="small">
            <city-store-select @set="handleSetStore"></city-store-select>
          </el-form-item> -->
          <!-- ------------------------------------------选择门店组件---------------------------- -->
          <div class="changeprice">
            <el-tabs v-model="activeName" @tab-click="changeclick">
              <el-tab-pane label="住宿物业" name="first"></el-tab-pane>
              <el-tab-pane label="水电" name="second"></el-tab-pane>
            </el-tabs>
          </div>
          <hr>
          <el-form-item class="waterprice">
            <el-form-item label="热水单价">
              <el-input placeholder="请输入热水单价" v-model='info.hot_water_price'></el-input>
            </el-form-item>
            <span>元/立方</span>
            <br>
            <el-form-item label="冷水单价">
              <el-input placeholder="请输入冷水单价" v-model='info.water_price'></el-input>
            </el-form-item>
            <span>元/立方</span>
            <br>
            <el-form-item label="电费单价">
              <el-input placeholder="请输入电费单价" v-model='info.electricity_price'></el-input>
            </el-form-item>
            <span>元/度</span>
            <br>
          </el-form-item>
          <br>
          <el-button type="primary" class="submit" @click='updatePrice'>提交</el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="分布式">
        <el-form :inline="true">
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
          <!-- <el-form-item label="选择门店" size="small">
            <city-store-select @set="handleSetStore"></city-store-select>
          </el-form-item> -->
          <!-- ------------------------------------------选择门店组件---------------------------- -->
          <el-form-item label="小区名称" class="select">
            <el-select v-model="templateLists.community_id" placeholder="请选择" size="small" @change="searchVill">
              <el-option v-for="item in communityList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <div class="changeprices">
            <el-tabs v-model="activeNames" @tab-click="changeclick" style="width:190px">
              <el-tab-pane label="住宿物业" name="first"></el-tab-pane>
              <el-tab-pane label="水电" name="second"></el-tab-pane>
            </el-tabs>
          </div>
          <hr>
          <el-form-item class="waterprice">
            <el-form-item label="热水单价" prop="name">
              <el-input placeholder=""></el-input>
            </el-form-item>
            <span>元/立方</span>
            <br>
            <el-form-item label="冷水单价" prop="name">
              <el-input placeholder=""></el-input>
            </el-form-item>
            <span>元/立方</span>
            <br>
            <el-form-item label="电费单价" prop="name">
              <el-input placeholder=""></el-input>
            </el-form-item>
            <span>元/度</span>
            <br>
          </el-form-item>
          <br>
          <el-button type="primary" class="submit">提交</el-button>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
<script>
import { getCityList, getStoreList, showCommunity, utilities, updataUtility } from '@/api/api'
export default {
  data() {
    return {
      listLoading: false,
      activeName: 'second',
      activeNames: 'second',
      info: {
        hot_water_price: '',
        water_price: '',
        electricity_price: '',
      },
      city: '',
      storesList: [],
      cityList: [],
      // buildingList  : [],
      communityList: [],
      citySplice: '',
      label: '',
      templateList: {
        store_id: '',
        building_id: '',
      },
      templateLists: {
        tore_id: '',
        community_id: '',
      },
    }
  },

  mounted() {
    this.getCity()
  },
  methods: {
    handleClick(tab) {
      if (tab.label == '集中式') {
        this.label = tab.label
      } else {
        this.label = tab.label
      }
    },

    changeclick(tab) {
      if (tab.label == '水电') {
        setTimeout(() => {
          this.$router.push({ path: '/editprice' })
        }, 300)
      } else {
        setTimeout(() => {
          this.$router.push({ path: '/adjustprice' })
        }, 300)
      }
    },

    /* 获取城市 */
    getCity() {
      let that = this
      let para = {}

      getCityList(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data.cities
        getData[0] = '请选择'

        that.func.portInit(rescode, resmsg, function() {
          that.cityList = getData
        })
      }).catch(function(err) {
        console.log(err)
      })
    },

    /* 选择城市 */
    searchCity() {
      let that = this
      let para = {
        city: that.city,
      }
      if (that.label == '分布式') {
        para.city = that.citySplice
        that.getStoreList()
      }
      that.getStoreList()
    },

    /* 获取门店名称 */
    getStoreList() {
      let that = this
      let para = {
        city: that.city,
      }

      if (that.label === '分布式') {
        para.city = that.citySplice
      }

      getStoreList(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data.stores

        that.func.portInit(rescode, resmsg, function() {
          that.storesList = getData
        })
      }).catch(function(err) {
        console.log(err)
      })
    },

    // ---------------------------- 集中式 ------------------------------
    /* 选择门店 */
    searchName() {
      let that = this
      // that.templateList.store_id = that.templateList.store_id
      that.requestData()
    },

    /* 获取信息 */
    requestData() {
      let that = this
      let para = {
        store_id: that.templateList.store_id,
      }
      utilities(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data

        that.func.portInit(rescode, resmsg, function() {
          that.info = getData[0]
        })
      }).catch(function(err) {
        console.log(err)
      })
    },

    /* 提交修改价格 */
    updatePrice() {
      let that = this
      let para = {
        store_id: that.templateList.store_id,
        hot_water_price: that.info.hot_water_price,
        water_price: that.info.water_price,
        electricity_price: that.info.electricity_price,
      }
      updataUtility(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        // let getData = res.data.data

        that.func.portInit(rescode, resmsg, function() {
          that.$message('修改成功')
        })
      }).catch(function(err) {
        console.log(err)
      })
    },

    // ---------------------------- 分布式 ------------------------------
    /* 通过门店 获取小区列表 */
    searchNameSplice() {
      let that = this
      let para = {
        store_id: that.templateLists.store_id,
      }

      that.listLoading = true
      showCommunity(para).then(res => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data.community

        that.func.portInit(rescode, resmsg, function() {
          that.communityList = getData
          that.listLoading = false
        })
      }).catch(function(err) {
        console.log(err)
      })
    },

    /* 选择小区名称 */
    searchVill() {

    },
  },
}

</script>
