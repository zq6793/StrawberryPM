<template>
  <section class="fx-pages-main house-type">
    <!--工具条-->
      <el-form :inline="true" class="fx-table-sort-head">
        <el-form-item size="small">
          <el-button size="small" type="primary" @click="handleAdd">+ 新建房型</el-button>
          <el-button size="small" type="danger" @click="handleDels" :disabled="this.sels.length===0">删除</el-button>
        </el-form-item>
        <el-form-item size="small">
          <city-store-select :route-query="true" @set="refresh"></city-store-select>
        </el-form-item>
        <el-form-item size="small">
          <text-search :route-query="true" :options="searchOptions" @set="refresh"></text-search>
        </el-form-item>
      </el-form>
    <!--列表-->
    <el-table :data="storeList" highlight-current-row @selection-change="selsChange" v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="store_name" label="门店名称">
      </el-table-column>
      <el-table-column prop="name" label="房型名称">
      </el-table-column>
      <el-table-column prop="feature" label="房型特点">
      </el-table-column>
      <el-table-column prop="display" label="是否展示">
      </el-table-column>
      <el-table-column label="操作" width="53">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <pagination-select :route-query="true" :total="total" @set="refresh"></pagination-select>
  </section>
</template>
<script type="text/javascript">
import { CityStoreSelect, TextSearch, PaginationSelect } from '@/components/selects'
import { roomType, deleteRoomtypes } from '@/api/api'
export default {
  components: {
    CityStoreSelect,
    TextSearch,
    PaginationSelect,
  },
  data () {
    return {
      input: '',
      listLoading: false,
      total: 0,
      filters: {
        name: '',
      },
      sels: [],
      searchOptions: [
        { label: '房型名称', key: 'name' },
        // { label: '房型特点', key: 'search' },
      ],
    }
  },
  mounted () {
    this.refresh()
  },
  computed: {
    cityList () {
      return this.$store.getters.listCity
    },
    storesList () {
      return this.$store.getters.getStoreByCity(this.cityValue)
    },
  },
  methods: {
    refresh() {
      this.getRoomType()
    },
    /* 获取门店列表 */
    getRoomType () {
      let that = this
      let para = this.queryOption()
      that.listLoading = true
      roomType(para).then(res => {
        res.items.forEach((item) => {
          item.display = that.displayTre(item.display)
        })
        that.storeList = res.items
        that.total = res.count
        that.listLoading = false
      }).catch(err => {
        console.log(err)
      })
    },
    // 门店状态转化
    displayTre (display) {
      if (display == 0) {
        display = '不展示'
      } else if (display == 1) {
        display = '展示'
      }
      return display
    },
    // 根据城市名称搜索
    searchCity () {
      let that = this
      if (that.city == '请选择') {
        that.cityValue = ''
      }
      // that.getCity();
    },
    // 通过门店名进行搜索
    searchName () {
      this.getRoomType()
    },
    searchAll () {
      this.getRoomType()
    },
    /* 新增门店 */
    handleAdd () {
      this.$router.push({
        path: '/addHouseType',
      })
    },
    // 批量删除
    handleDels () {
      let that = this
      let ids = that.sels.map(item => item.ID)

      that.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning',
      }).then(() => {
        that.listLoading = true
        let para = { ids: ids }
        deleteRoomtypes(para).then(res => {
          that.listLoading = false
          that.$message({
            message: '删除成功',
            type: 'success',
          })
          that.getRoomType()
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
        that.addLoading = false
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      })
    },
    // 编辑当前
    handleEdit (index, row) {
      sessionStorage.setItem('page', JSON.stringify(this.page))
      this.$router.push({
        path: '/edithousetype',
        query: {
          id: row.ID,
        },
      })
    },
    selsChange (sels) {
      this.sels = sels
    },
  },
}
</script>
