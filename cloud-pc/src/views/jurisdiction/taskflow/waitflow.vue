<template>
  <section class="waitflow">
    <el-form :inline="true" class="fx-table-sort-head">
      <el-form-item label="选择门店">
        <city-store-select :route-query="true" @set="refresh"></city-store-select>
      </el-form-item>
      <el-form-item label="审批类目" prop="city">
        <taskflow-type-select @set="handleSetType"></taskflow-type-select>
      </el-form-item>
      <el-form-item>
        <p class="page">
          <span>合计：{{count}}</span>
          <span>每页：10</span>
        </p>
      </el-form-item>
    </el-form>
    <el-table :data="flowLists" highlight-current-row @selection-change="selsChange" style="width: 100%;" v-loading="listLoading" border tooltip-effect="dark">
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
          <span size="small" @click="serviceFree(scope.row)" style="color: #00a69b; cursor: pointer;" v-if='scope.row.type == "服务订单"'>查看</span>
          <span size="small" @click="lookFree(scope.row)" style="color: #00a69b; cursor: pointer;" v-else-if='scope.row.type == "预约看房"'>查看</span>
          <span size="small" @click="modifyFree(scope.row)" style="color: #00a69b; cursor: pointer;" v-else>审批</span>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <pagination-select :route-query="true" :total="total" @set="refresh"></pagination-select>
  </section>
</template>
<script>
import { CityStoreSelect, PaginationSelect } from '@/components/selects'
import { TaskflowTypeSelect } from '@/components/taskflow'
import { listFormBeing } from '@/api/api'
export default {
  components: {
    CityStoreSelect,
    PaginationSelect,
    // TextSearchSelect,
    TaskflowTypeSelect,
  },
  data() {
    return {
      search: '',
      inspect: true,
      flowLists: [],
      count: '',
      type: '',
      total: 1,
      listLoading: false,
      value: 'first',
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
    refresh() {
      this.getFlow()
    },
    getFlow() {
      let para = this.queryOption()
      let that = this
      that.listLoading = true
      listFormBeing(para).then((res) => {
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
        that.flowLists = getData
        that.count = getData.count
        that.total = getData.count
        that.listLoading = false
      }).catch(function (err) {
        console.log(err)
      })
    },

    // 查看详情
    modifyFree(row) {
      // console
      if (row.taskflow.type == '调价') {
        this.$router.push({
          path: '/adjustflow',
          query: {
            id: row.taskflow.ID,
            name: 'wait',
          },
        })
      } else if (row.taskflow.type == '转租') {
        this.$router.push({
          path: '/sublet',
          query: {
            id: row.taskflow.ID,
            name: 'wait',
          },
        })
      } else if (row.taskflow.type == '预约看房') {
        console.log(row.taskflow.type)
        this.$router.push({
          path: '/reservationorder',
          query: {
            id: row.taskflow.ID,
            name: 'wait',
          },
        })
      } else if (row.taskflow.type == '服务订单') {
        this.$router.push({
          path: '/serviceorder',
          query: {
            id: row.taskflow.ID,
            name: 'wait',
          },
        })
      } else {
        this.$router.push({
          path: '/checkoutflow',
          query: {
            id: row.taskflow.ID,
            name: 'wait',
          },
        })
      }
    },
    lookFree() {
      this.$router.push({ path: '/reservationorder' })
    },
    serviceFree() {
      this.$router.push({ path: '/serviceorder' })
    },
  },
}

</script>
