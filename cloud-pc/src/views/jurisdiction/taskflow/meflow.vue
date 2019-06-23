<template>
  <section class="meflow">
    <el-form :inline="true" class="fx-table-sort-head">
      <el-form-item label="选择门店">
        <city-store-select :route-query="true" @set="refresh"></city-store-select>
      </el-form-item>
      <el-form-item label="审批类目" prop="city">
        <taskflow-type-select @set="handleSetType"></taskflow-type-select>
      </el-form-item>
      <el-form-item label="审批状态" prop="city">
        <taskflow-status-select @set="handleSetStatus"></taskflow-status-select>
      </el-form-item>
      <el-form-item>
        <p class="page">
          <span>合计：{{count}}</span>
          <span>每页：10</span>
        </p>
      </el-form-item>
    </el-form>
    <!-- <el-form-item class="searchs white-el-select">
      <input v-model="number" placeholder="请输入房间号" @keyup.enter="getPrice" class="input" />
      <i class="iconfont icon-ali-sousuo" @click="searchAll"></i>
    </el-form-item> -->
    <!--列表-->
    <el-table :data="flowList" highlight-current-row @selection-change="selsChange" style="width: 100%;" v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column prop="taskflow.serial_number" label="审批编号" width="170">
      </el-table-column>
      <el-table-column prop="store_name" label="门店名称" width="250">
      </el-table-column>
    <el-table-column prop="room_number" label="房间号">
      </el-table-column>
      <el-table-column prop="taskflow.type" label="审批类目" width="220">
        <template slot-scope="scope">
          <span size="small">{{scope.row.taskflow.type}}审批</span>
        </template>
      </el-table-column>
      <el-table-column prop="current_step_show" label="审批环节">
      </el-table-column>
      <el-table-column prop="flow_person" label="审批人" width="100">
      </el-table-column>
      <el-table-column prop="CreatedAt" label="审批时间" width="180">
      </el-table-column>
      <el-table-column prop="last_record_status" label="审批结果">
      </el-table-column>
      <el-table-column prop="taskflow.status" label="审批状态" width="130">
      </el-table-column>
      <el-table-column label="操作" width="50">
        <template slot-scope="scope">
          <span size="small" @click="modifyFree(scope.row)" style="color: #00a69b; cursor: pointer;">查看</span>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <pagination-select :route-query="true" :total="total" @set="refresh"></pagination-select>
  </section>
</template>
<script>
import { CityStoreSelect, PaginationSelect } from '@/components/selects'
import { TaskflowStatusSelect, TaskflowTypeSelect } from '@/components/taskflow'
import { listMyCreate } from '@/api/api'
export default {
  components: {
    CityStoreSelect,
    PaginationSelect,
    // TextSearchSelect,
    TaskflowStatusSelect,
    TaskflowTypeSelect,
  },
  data() {
    return {
      flowList: [],
      type: '',
      count: '',
      status: '',
      total: 0,
      listLoading: false,
      value: 'second',
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    handleSetStatus (val) {
      this.updateRouteQuery('status', val)
      this.refresh()
    },
    handleSetType (val) {
      this.updateRouteQuery('type', val)
      this.refresh()
    },
    refresh(page) {
      this.getFlow()
    },

    // 获取任务流列表
    getFlow() {
      let that = this
      let para = this.queryOption()
      that.listLoading = true
      listMyCreate(para).then((res) => {
        let getData = res.data.items
        getData.count = res.data.count
        getData.forEach((item) => {
          let val = ''
          if (item.current_step) {
            that.hasFlowStep = true
            item.current_step.positions.forEach((item2, index) => {
              if (index == 0) {
                val += item2.name
              } else {
                val += '/' + item2.name
              }
              item.current_step_show = val
            })
          }
          if (item.last_record) {
            that.hasFlowPerson = true
            item.flow_person = item.last_record.employee.name
            item.CreatedAt = this.fxFilter.goTime(item.last_record.CreatedAt)
            item.last_record_status = this.fxFilter.taskflowStepStatus(item.last_record.status)
          }
          item.taskflow.status = this.fxFilter.taskflowStatus(item.taskflow.status)
          item.taskflow.type = this.func.typeTre(item.taskflow.type)
        })
        that.flowList = getData
        that.count = getData.count
        that.total = getData.count
        that.listLoading = false
      }).catch(function(err) {
        console.log(err)
      })
    },
    searchAll() {
      this.updateRouteQuery('search', this.search)
      this.getFlow()
    },
    getPrice() {
      this.searchAll()
    },
    // 查看详情
    modifyFree(row) {
      // console
      if (row.taskflow.type == '调价') {
        this.$router.push({
          path: '/adjustflow',
          query: {
            id: row.taskflow.ID,
            name: 'me',
          },
        })
      } else if (row.taskflow.type == '转租') {
        this.$router.push({
          path: '/sublet',
          query: {
            id: row.taskflow.ID,
            name: 'me',
          },
        })
      } else if (row.taskflow.type == '预约看房') {
        console.log(row.taskflow.type)
        this.$router.push({
          path: '/reservationorder',
          query: {
            id: row.taskflow.ID,
            name: 'me',
          },
        })
      } else if (row.taskflow.type == '服务订单') {
        this.$router.push({
          path: '/serviceorder',
          query: {
            id: row.taskflow.ID,
            name: 'me',
          },
        })
      } else {
        this.$router.push({
          path: '/checkoutflow',
          query: {
            id: row.taskflow.ID,
            name: 'me',
          },
        })
      }
    },
  },
}

</script>
