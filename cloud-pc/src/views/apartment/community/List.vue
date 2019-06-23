<template>
  <section class="fx-pages-main village">
    <!--工具条-->
      <el-form :inline="true"  class="fx-table-sort-head">
        <el-form-item>
          <el-button size="small" @click="newBuilt" type="primary">+ 新建小区</el-button>
          <el-button size="small" type="danger" @click="batchRemove" :disabled="this.sels.length===0">删除</el-button>
        </el-form-item>
        <el-form-item>
          <city-store-select :route-query="true" @set="refresh"></city-store-select>
        </el-form-item>
        <el-form-item class="searchs">
          <el-input v-model="name" type="text" class="input" placeholder="请输入小区名称" @keyup.enter="searchName" size="small">
           <template slot="append" class="iconfont icon-ali-sousuo" @click="searchAll">
            搜索
          </template>
          </el-input>
        </el-form-item>
      </el-form>
    <!--列表-->
    <el-table :data="villageList" highlight-current-row @selection-change="selsChange" style="width: 100%;" v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="name" label="小区名称">
      </el-table-column>
      <el-table-column prop="address" label="小区地址" width="500">
      </el-table-column>
      <el-table-column prop="count" label="现有房间数量">
      </el-table-column>
      <el-table-column prop="sale" label="状态">
      </el-table-column>
      <el-table-column label="操作" width="84">
        <template slot-scope="scope">
          <span size="small" @click="handleEdit(scope.$index, scope.row)" class="textchange">修改</span>
          <span size="small" @click="delCommunityy(scope.row)" class="textchange" v-if="scope.row.sale == '已下架'">上架</span>
          <span size="small" @click="delCommunity(scope.row)" class="textchange" v-else style="color:red">下架</span>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
      <pagination-select :route-query="true" :total="total" @set="refresh"></pagination-select>
  </section>
</template>
<script type="text/javascript">
import { CityStoreSelect, PaginationSelect } from '@/components/selects'
import { listCommunity, delCommunity, destroyCommunity } from '@/api/api'
export default {
  components: {
    CityStoreSelect,
    PaginationSelect,
    // TextSearchSelect,
  },
  data () {
    return {
      name: '',
      villageList: [],
      listLoading: false,
      total: 0,
      sels: [],
      /* 搜索需要门店ID */
    }
  },

  mounted () {
    this.refresh()
  },
  methods: {
    refresh () {
      this.getVillageList()
    },

    // 获取小区列表
    getVillageList () {
      let that = this
      let para = {
        page: that.page,
        store_id: that.store_id,
        name: that.name,
      }
      that.listLoading = true
      listCommunity(para).then((res) => {
        let rescode = res.data.rescode
        let getData = res.data.data
        if (rescode == 0) {
          that.villageList = getData.community
          that.villageList.forEach((item) => {
            item.sale = that.saleTra(item.sale)
          })
          that.total = getData.count
          that.listLoading = false
        }
      }).catch(function (err) {
        console.log(err)
      })
    },
    saleTra (sale) {
      if (sale == 'N') {
        sale = '已下架'
      } else if (sale == 'Y') {
        sale = '正常'
      } else {

      }
      return sale
    },
    // 搜索
    searchName () {
      this.name = this.name
      this.page = 1
      this.getVillageList()
    },
    searchAll () {
      this.searchName()
    },
    // 下架小区
    delCommunity (row) {
      let that = this
      let para = {
        community_id: row.id,
      }
      that.$confirm('此操作会使小区下架,请谨慎操作', '提示', {
        type: 'warning',
      }).then(() => {
        delCommunity(para).then((res) => {
          if (res.data.rescode == 0) {
            that.$message({
              message: '下架成功',
              type: 'success',
            })
          }
          that.getVillageList()
        }).catch(function (err) {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消下架',
        })
      })
    },
    delCommunityy (row) {
      let that = this
      let para = {
        community_id: row.id,
      }
      that.$confirm('此操作会使小区上架,请谨慎操作', '提示', {
        type: 'warning',
      }).then(() => {
        delCommunity(para).then((res) => {
          if (res.data.rescode == 0) {
            that.$message({
              message: '上架成功',
              type: 'success',
            })
          }
          that.getVillageList()
        }).catch(function (err) {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消上架',
        })
      })
    },

    /* 新建小区 */
    newBuilt () {
      this.$router.push({ path: '/newbuilt' })
    },

    /* 编辑页面 */
    handleEdit (index, row) {
      sessionStorage.setItem('page', JSON.stringify(this.page))
      this.$router.push({
        path: '/editbuilt',
        query: {
          id: row.id,
        },
      })
    },
    /* 批量删除 */
    batchRemove () {
      let that = this
      let ids = that.sels.map(item => item.id)
      that.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning',
      }).then(() => {
        that.listLoading = true
        let para = { community_id: ids }
        destroyCommunity(para).then(res => {
          let rescode = res.data.rescode
          let resmsg = res.data.resmsg
          that.func.portInit(rescode, resmsg, function () {
            that.listLoading = false
            that.$message({
              message: '删除成功',
              type: 'success',
            })
            that.getVillageList()
          })
        }).catch(function (err) {
          console.log(err)
        })
      }).catch(() => {
        that.listLoading = false
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      })
    },
    selsChange (sels) {
      this.sels = sels
    },
  },
}
</script>
