<template>
  <section class="fx-pages-main staff-manage">
    <!--工具条-->
      <el-form :inline="true" class="fx-table-sort-head">
        <el-form-item size="small">
          <el-button @click="handleAdd" type="primary"  size="small">+ 新增员工</el-button>
         </el-form-item>
        <el-form-item size="small">
          <city-store-select :route-query="true" @set="refresh"></city-store-select>
        </el-form-item>
        <el-form-item class="searchs" size="small">
          <text-search :route-query="true" :options="searchOptions" @set="refresh"></text-search>
        </el-form-item>
      </el-form>
    <!--列表-->
    <el-table :data="staffList" highlight-current-row @selection-change="selsChange" v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="100">
      </el-table-column>
      <el-table-column prop="phone" label="联系方式" width="140">
      </el-table-column>
      <el-table-column prop="position_name" label="角色">
      </el-table-column>
      <el-table-column prop="store_name" label="负责门店">
        <template slot-scope="scope">
          <el-button type="text" @click="look(scope.row)">{{ scope.row.store_name }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="hiredate" label="入职时间" width="104">
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80">
      </el-table-column>
      <el-table-column label="操作" width="53">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row)" type="text">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="负责门店" :visible.sync="isShow" width="30%" center>
      <span style="line-height: 30px;font-size: 14px;">{{ lookinfo }}</span>
<!--       <el-form :inline="true">
        <el-input type="textarea" v-model="lookinfo" :rows='4' disabled="true"></el-input>
      </el-form> -->
    </el-dialog>
    <!--工具条-->
    <pagination-select :route-query="true" :total="total" @set="refresh"></pagination-select>
  </section>
</template>
<script type="text/javascript">
import { CityStoreSelect, PaginationSelect, TextSearch } from '@/components/selects'
import { staffList, quitStaff } from '@/api/api'
export default {
  components: {
    CityStoreSelect,
    PaginationSelect,
    TextSearch,
  },
  data () {
    return {
      staffList: [],
      listLoading: false,
      sels: [],
      name: '',
      total: 0,
      isShow: false,
      lookinfo: '',
      searchOptions: [
        { label: '姓名', key: 'name' },
      ],
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
    this.refresh()
  },
  methods: {
    refresh () {
      this.getStaffList()
    },

    /* 新建角色 */
    handleAdd () {
      this.$router.push({
        path: '/addstaff',
      })
    },

    /* 获取员工列表 */
    getStaffList () {
      let that = this
      let para = this.queryOption()
      that.listLoading = true
      staffList(para).then(res => {
        let list = res.items
        that.listLoading = false
        list.forEach(item => {
          item.status = that.status(item.status)
          item.hiredate = that.func.year(item.hiredate)
          item.store_name = item.store_name.replace(/\,/g, '/')
          // item.responsible.store_ids = item.responsible.store_ids.toString().replace(/\,/g, '/')
        })
        that.staffList = list
        that.total = res.count
      }).catch(err => {
        console.log(err)
      })
    },
    /* 转换状态 */
    status (text) {
      let status = ''
      switch (text) {
        case 'DISABLE':
          status = '离职'
          break
        case 'ENABLE':
          status = '在职'
          break
      }
      return status
    },
    /* 删除 */
    batchRemove () {
      let that = this
      let ids = that.sels.map(item => item.ID).toString()
      that.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning',
      }).then(() => {
        that.listLoading = true
        quitStaff(ids).then(() => {
          that.listLoading = false
          that.$message({
            message: '删除成功',
            type: 'success',
          })
          that.getStaffList()
        }).catch(err => {
          console.log(err)
        })
      }).catch(function () {
        that.listLoading = false
        that.$message({
          type: 'info',
          message: '已取消删除',
        })
      })
    },
    look (row) {
      this.lookinfo = row.store_name
      this.isShow = true
    },
    /* 编辑页面 */
    handleEdit (row) {
      sessionStorage.setItem('page', JSON.stringify(this.page))
      this.$router.push({
        path: '/editstaff',
        query: {
          id: row.ID,
        },
      })
    },

    selsChange (sels) {
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
