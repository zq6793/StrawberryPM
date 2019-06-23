<template>
  <section class="fx-pages-main storeManage">
    <!--工具条-->
    <el-form :inline="true" class="fx-table-sort-head">
      <el-form-item>
        <el-button type="primary" @click="handleAdd" size="small">+ 添加门店</el-button>
        <el-button type="danger" @click="handleDels" :disabled="this.sels.length == 0" size="small">停业</el-button>
      </el-form-item>
      <el-form-item>
        <el-select v-model="city" placeholder="所属城市" size="small" @change="handleSetCity">
          <el-option v-for="item in citys" :key="item" :label="item.city" :value="item.city">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="typeValue" placeholder="门店类型" size="small" @change="handleSetRendType">
          <el-option v-for="item in type" :key="item.rent_type" :label="item.rent_type" :value="item.rent_type">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="statusValue" placeholder="门店状态" size="small" @change="handleSetStatus">
          <el-option v-for="item in status" :key="item.input" :label="item.status" :value="item.status">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="searchs inputs">
        <text-search :options="textSearchOption" :routeQuery="true" @set="refresh"></text-search>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="storeList" @selection-change="selsChange" v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column type="selection">
      </el-table-column>
      <!-- <el-table-column prop="id" label="门店ID" width="90">
      </el-table-column> -->
      <el-table-column prop="name" label="门店名称" width="210">
      </el-table-column>
      <el-table-column prop="city" label="所属城市">
      </el-table-column>
      <el-table-column prop="rent_type" label="门店类型">
      </el-table-column>
      <el-table-column prop="address" label="门店地址" width="300">
      </el-table-column>
      <el-table-column prop="contact_user" label="联系人">
      </el-table-column>
      <el-table-column prop="counsel_phone" label="联系电话" width="120">
      </el-table-column>
      <el-table-column prop="status" label="门店状态">
      </el-table-column>
      <el-table-column prop="CreatedAt" label="创建时间" width="160">
      </el-table-column>
      <el-table-column label="操作" width="53">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.$index, scope.row)">
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <pagination-select :route-query="true" :total="total" @set="refresh"></pagination-select>
    <!-- <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total" :current-page.sync="pageId">
    </el-pagination> -->
  </section>
</template>
<script type="text/javascript">
import { PaginationSelect, TextSearch } from '@/components/selects'
import { storeList, listStoreByCity, deleteStores } from '@/api/api'
export default {
  components: {
    PaginationSelect,
    TextSearch,
  },
  data() {
    return {
      listLoading: false,
      total: 0,
      storeList: [],
      storeName: [],
      citys: [],
      status: [],
      type: [],
      city: '',
      typeValue: '',
      statusValue: '',
      disRent_type: true,
      disStatus: true,
      sels: [],
      textSearchOption: [
        { key: 'name', label: '门店名称' },
      ],
    }
  },
  mounted() {
    this.getCity()
    this.getStoreManage()
    // this.listMenu()
  },
  methods: {
    refresh() {
      this.getStoreManage()
    },
    // 通过城市进行查询
    handleSetCity(city) {
      if (city === '所属城市') {
        city = ''
      }
      this.updateRouteQuery('city', city)
      this.refresh()
    },
    /* 门店类型 */
    handleSetRendType(typ) {
      let typeStr = ''
      switch (typ) {
        case '集中式':
          typeStr = 'UNION'
          break
        case '分布式':
          typeStr = 'DOT'
          break
      }
      this.updateRouteQuery('type', typeStr)
      this.refresh()
    },
    // 通过状态进行查找
    handleSetStatus(status) {
      let statusStr = ''
      if (status === '停业') {
        statusStr = 'CLOSE'
      } else if (status === '即将开业') {
        statusStr = 'WAIT'
      } else if (status === '营业中') {
        statusStr = 'NORMAL'
      }
      this.updateRouteQuery('status', statusStr)
      this.refresh()
    },
    /* 获取城市 */
    getCity() {
      let that = this
      let para = {}
      listStoreByCity(para).then(res => {
        res = res.data
        let citys = res.city
        let type = res.rent_type
        let status = res.status

        citys.unshift({
          city: '所属城市',
        })
        that.citys = citys

        type.unshift({
          rent_type: '门店类型',
        })
        that.type = type
        type.forEach(item => {
          item.rent_type = that.storeTransition(item.rent_type)
        })

        status.unshift({
          status: '门店状态',
        })
        that.status = status
        status.forEach(item => {
          item.status = that.stateTransition(item.status)
        })
      }).catch(err => {
        console.log(err)
      })
    },

    // 获取门店列表
    getStoreManage() {
      let that = this
      let para = this.queryOption()
      that.listLoading = true
      storeList(para).then(res => {
        let list = res.items
        /* 列表 */
        for (let key in list) {
          list[key].rent_type = that.storeTransition(list[key].rent_type)
          list[key].status = that.stateTransition(list[key].status)
          list[key].CreatedAt = that.func.year(list[key].CreatedAt)
        }
        that.storeList = list
        that.total = res.count
        that.listLoading = false
      }).catch(err => {
        console.log(err)
      })
    },

    searchAll() {
      this.getStoreManage()
    },

    // 状态转换
    stateTransition(text) {
      let status = ''
      if (text === 'CLOSE') {
        status = '停业'
      } else if (text === 'WAIT') {
        status = '即将开业'
      } else if (text === 'NORMAL') {
        status = '营业中'
      } else {
        status = '门店状态'
      }
      return status
    },

    // 门店类型的转换
    storeTransition(text) {
      let rent_type = ''
      if (text === 'UNION') {
        rent_type = '集中式'
      } else if (text === 'DOT') {
        rent_type = '分布式'
      } else {
        rent_type = '门店类型'
      }
      return rent_type
    },

    // 查找门店名
    searchStore() {
      this.getStoreManage()
    },

    /* 新增门店 */
    handleAdd() {
      this.$router.push({
        path: '/addstoremanage',
      })
    },
    /* 删除门店 */
    handleDels() {
      let that = this
      let ids = that.sels.map(item => item.ID).toString()

      that.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning',
      }).then(() => {
        that.listLoading = true
        deleteStores(ids).then(res => {
          that.listLoading = false
          that.$message({
            message: '已停业',
            type: 'success',
          })
          that.getStoreManage()
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
        that.listLoading = false
        this.$message({
          type: 'info',
          message: '已取消停业',
        })
      })
    },
    // 编辑门店管理
    handleEdit(index, row) {
      sessionStorage.setItem('page', JSON.stringify(this.page))
      let that = this
      that.$router.push({
        path: '/editstoremanage',
        query: {
          id: row.ID,
        },
      })
    },

    selsChange(sels) {
      if (sels.length > 1) {
        sels = []
        this.$message({
          type: 'info',
          message: '只能选择一个',
        })
      } else {
        this.sels = sels
      }
    },
  },
}

</script>
