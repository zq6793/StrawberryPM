<template>
  <section class="fx-pages-main goods">
    <div class="title">
      物品：您可以查看、管理住户在入住期间额外租赁的物品详情，如物品类型（冰箱、沙发等）、租赁金额、支付状态灯。
    </div>
    <el-form :inline="true" style="padding: 8px 22px">
      <el-form-item label="所属城市" prop="city">
        <el-select v-model="city" placeholder="请选择" size="small" @change="searchCity" style="color:#fff">
          <el-option v-for="item in cityList" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="门店名称" class="select">
        <el-select v-model="store_id" placeholder="请选择" size="small" @change="searchName">
          <el-option v-for="item in storesList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" class="selectl">
        <el-select v-model="building_id" placeholder="请选择" size="small">
          <el-option v-for="item in buildingList" :key="item.building_id" :label="item.building_name" :value="item.building_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年费" class="selectl">
        <el-select v-model="building_id" placeholder="请选择" size="small">
          <el-option v-for="item in buildingList" :key="item.building_id" :label="item.building_name" :value="item.building_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="月份" class="selectl">
        <el-select v-model="building_id" placeholder="请选择" size="small">
          <el-option v-for="item in buildingList" :key="item.building_id" :label="item.building_name" :value="item.building_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="btn">
        <el-button type="primary" @click="handleAdd">增加</el-button>
        <el-button type="primary" @click="dialogFormSplit = true">导入</el-button>
      </el-form-item>
      <el-form-item class="searchs white-el-select">
        <input v-model="input" placeholder="请输入门店名称" @keyup.enter="searchStore" class="input" />
      </el-form-item>
    </el-form>
    <!-- 批量导入 -->
    <el-dialog title="批量上传" :visible.sync="dialogFormSplit" class="allUpload">
      <p>请选择需要导入的Excel文件</p>
      <el-form :model="form">
        <el-form-item label="">
          <el-input class="input_inner" placeholder="" size="small"></el-input>
        </el-form-item>
        <el-upload class="upload-demo" :action="uploadUrl()" multiple :on-success="handleAvatarSuccess" ref="upload">
          <span class="upload">+</span>
          <div slot="tip" class="el-upload__tip"></div>
        </el-upload>
        <el-button type="primary">开始上传</el-button>
      </el-form>
    </el-dialog>
    <!--列表-->
    <el-table :data="storeList" highlight-current-row @selection-change="selsChange" style="width: 100%;" v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column prop="room_id" label="房间号">
      </el-table-column>
      <el-table-column prop="store_name" label="年份">
      </el-table-column>
      <el-table-column prop="address" label="月份">
      </el-table-column>
      <el-table-column prop="room_type_name" label="金额">
      </el-table-column>
      <el-table-column prop="rent_price" label="状态">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span size="small" @click="handleEdit(scope.$index, scope.row)">编辑</span>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total">
      </el-pagination>
    </el-col>
  </section>
</template>
<script type="text/javascript">
import { getCityList, getStoreList, showBuilding } from '@/api/api'
export default {
  data () {
    return {
      total: 0,
      page: 1,
      listLoading: false,
      city: '',
      cityList: [],
      store_id: '',
      building_id: '',
      storesList: [],
      buildingList: '',
      input: '',
      dialogFormSplit: false,

    }
  },
  mounted () {
    this.getCity()
  },
  methods: {
    uploadUrl () {
      return this.fxCfg.image_upload_url
    },

    handleCurrentChange (val) {
      this.page = val
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
        that.building_id = ''
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

    /* 选择门店 */
    searchName () {
      let that = this
      let para = {
        store_id: that.store_id,
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
          that.buildingList = getData.buildings
          that.listLoading = false
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
    selsChange (sels) {
      this.sels = sels
    },
    // 查看房间
    handleEdit () {
      this.$router.push({ path: '/editgoods' })
    },
    // 添加账单
    handleAdd () {
      this.$router.push({ path: '/addgoods' })
    },

  },
}
</script>
