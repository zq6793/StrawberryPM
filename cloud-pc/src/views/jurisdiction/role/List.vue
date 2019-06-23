<template>
  <section class="fx-pages-main job">
    <!--工具条-->
    <el-form :inline="true" class="fx-table-sort-head">
      <el-form-item size="small">
        <el-button @click="handleAdd" type="primary">+ 新建角色</el-button>
        <!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">删除</el-button> -->
      </el-form-item>
      <el-form-item class="searchs"  size="small">
        <text-search :route-query="true" :options="searchOptions" @set="refresh"></text-search>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="jobList" @selection-change="selsChange" v-loading="listLoading" border>
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="name" label="角色名称" width="120">
      </el-table-column>
      <el-table-column prop="pc_privilege" label="PC端权限" >
        <template slot-scope="scope">
          <el-button type="text" @click="see(scope.row)">
            <span v-if="scope.row.pc_privilege">pc端权限：{{ scope.row.pc_privilege }};</span>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="pc_privilege" label="移动端权限" >
        <template slot-scope="scope">
          <el-button type="text" @click="see(scope.row)">
            <span v-if="scope.row.mini_privilege">小程序段端权限：{{ scope.row.mini_privilege }}</span>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="people_number" label="在职人数" width="120">
      </el-table-column>
      <el-table-column prop="CreatedAt" label="创建时间" width="180">
      </el-table-column>
      <el-table-column label="操作" width='53'>
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--查看权限 -->
    <el-dialog title="提示" v-model="isPrivilege" :visible.sync="isPrivilege">
      <el-form label-width="180px">
        <el-form-item label="PC基础信息修改权限" v-if="pc_privilege">
          <el-input type="textarea" v-model="pc_privilege" :disabled="true" :rows='4'></el-input>
        </el-form-item>
        <el-form-item label="小程序基础信息修改权限" v-if="mini_privilege">
          <el-input type="textarea" v-model="mini_privilege" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--工具条-->
    <pagination-select :route-query="true" :total="total" @set="refresh"></pagination-select>
  </section>
</template>
<script type="text/javascript">
import { PaginationSelect, TextSearch } from '@/components/selects'
import { roleList, deleteRole } from '@/api/api'
export default {
  components: {
    PaginationSelect,
    TextSearch,
  },
  data () {
    return {
      city: '',
      store_id: '',
      jobList: [],
      listLoading: false,
      sels: [],
      name: '',
      page: 1,
      total: 0,
      isPrivilege: false,
      pc_privilege: '',
      mini_privilege: '',
      searchOptions: [
        { label: '角色名称', key: 'name' },
      ],
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    refresh() {
      this.getJobList()
    },

    /* 新建角色 */
    handleAdd () {
      this.$router.push({
        path: '/addjob',
      })
    },

    /* 获取角色列表 */
    getJobList () {
      let that = this
      let para = this.queryOption()
      that.listLoading = true
      roleList(para).then(res => {
        let list = res.items
        list.forEach(item => {
          item.CreatedAt = that.func.year(item.CreatedAt)
        })
        that.jobList = list
        that.total = res.count
        that.listLoading = false
      }).catch(err => {
        console.log(err)
      })
    },

    /* 删除 */
    batchRemove () {
      let that = this
      let ids = that.sels
      that.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning',
      }).then(() => {
        that.listLoading = true
        let para = { ids: ids }
        deleteRole(para).then(() => {
          that.listLoading = false
          that.$message({
            message: '删除成功',
            type: 'success',
          })
          that.getJobList()
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
    /* 编辑页面 */
    handleEdit (index, row) {
      sessionStorage.setItem('page', JSON.stringify(this.page))
      this.$router.push({
        path: '/editjob',
        query: {
          id: row.ID,
        },
      })
    },

    /* 查看角色权限 */
    see (row) {
      let that = this
      that.isPrivilege = true
      that.pc_privilege = row.pc_privilege
      that.mini_privilege = row.mini_privilege
    },

    selsChange (sels) {
      this.sels = []
      for (let i = sels.length - 1; i >= 0; i--) {
        this.sels.push(sels[i].ID)
      }
    },
  },
}
</script>
