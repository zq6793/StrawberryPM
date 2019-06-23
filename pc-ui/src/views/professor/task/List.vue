<template>
  <section class="title-page students">
    <el-col :span="24">
      <el-form :inline="true">
        <el-form-item size="small" label="院系：" prop="faculty_id">
          <faculty-select @set="chooseFaculty"></faculty-select>
        </el-form-item>
        <el-form-item class="searchs" size="small">
          <el-input type="text" v-model="name" placeholder="请输入学号、学生名、论文等关键字" @keyup.enter="searchTasks" />
          </el-input>
        </el-form-item>
        <el-form-item size="small">
          <el-button type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="taskList" highlight-current-row @selection-change="selsChange" v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="serial_number" label="审批编号">
      </el-table-column>
      <el-table-column prop="name" label="审批类目">
      </el-table-column>
      <el-table-column prop="status" label="状态">
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <span size="small" @click="handleApproval(scope.row)" class="textchange">审批</span>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" :current-page.sync="page">
      </el-pagination>
    </el-col>
  </section>
</template>
<script>
import { facultySelect } from '@/components/selects'
import { listMyBeingTasks } from '@/api/api'
export default {
  components: {
    facultySelect,
  },
  data() {
    return {
      taskList: [],
    }
  },

  computed: {

  },
  mounted() {
    let that = this
    listMyBeingTasks().then(res => {
      that.taskList = res.items
      that.taskList.forEach(item => {
        item.CreatedAt = that.fxFilters.date(item.CreatedAt)
        item.status = that.fxFilters.taskflowStatus(item.status)
      })
    })
  },

  methods: {
    /* 选择院系 列表 */
    chooseFaculty(val) {
      this.college = val
    },

    /* 选择院系导入 */
    choiceFaculty(value) {
      this.adjExport.organization_id = value.pop()
    },

    handleCurrentChange(val) {
      this.page = val
    },


    /* 编辑审批信息 */
    handleApproval(row) {
      this.$router.push({ name: '审批详情', params: { id: row.ID } })
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

    /* 搜索任务信息 */
    searchTasks() {

    },
  },
}

</script>
