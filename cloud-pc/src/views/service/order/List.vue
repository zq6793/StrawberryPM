<template>
  <section class="fx-pages-main service-order">
    <!--工具条-->
    <el-form :inline="true" :model="filters" class="fx-table-sort-head">
      <el-form-item size="small">
        <city-store-select :route-query="true" @set="refresh"></city-store-select>
      </el-form-item>
      <el-form-item prop="service_id" size="small">
        <service-type-select :route-query="true" @set="refresh"></service-type-select>
      </el-form-item>
      <el-form-item prop="service_id" size="small">
        <service-status-select :route-query="true" @set="refresh"></service-status-select>
      </el-form-item>
      <el-form-item size="small">
        <date-interval-select :route-query="true" @set="refresh"></date-interval-select>
      </el-form-item>
      <el-form-item class="searchs inputs" size="small">
        <text-search :route-query="true" :options="searchOptions" @set="refresh"></text-search>
      </el-form-item>
    </el-form>

    <!--列表-->
    <el-table :data="serviceList" highlight-current-row @selection-change="handleCurrentChange" style="width: 100%;" v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column prop="number" label="订单号">
      </el-table-column>
      <el-table-column prop="store_name" label="公寓" width="210">
      </el-table-column>
      <el-table-column prop="room_number" label="房间号">
      </el-table-column>
      <!-- <el-table-column prop="estimate_money" label="预估金额">
      </el-table-column> -->
      <!-- <el-table-column prop="pay_money" label="支付金额">
      </el-table-column> -->
      <el-table-column prop="type" label="服务类型">
      </el-table-column>
      <!-- <el-table-column prop="status" label="服务状态">
        <template slot-scope="scope">
          <span class='circles' :class='{ complete: (scope.row.status==="已完成") ? true :false,
                          serving: (scope.row.status==="处理中") ? true :false,
                          canceled: (scope.row.status==="已取消") ? true :false,
                          pening: (scope.row.status==="待支付") ? true :false}'></span><span>{{ scope.row.status }}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="deal" label="处理情况">
      </el-table-column>
      <el-table-column label="详情" width="53">
        <!-- <template slot-scope="scope">
          <el-button type="text" @click="details(scope.$index, scope.row)">查看</el-button>
        </template> -->
      </el-table-column>
    </el-table>

    <!-- 弹出的订单详情 -->
    <el-dialog v-model="orderDetails" :close-on-click-modal="false" title="订单详情">
      <el-form :model="detail" class="white-el-select">
        <el-form-item label="订单号：" :label-width="formWidt">
          <el-input v-model="detail.number" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="流水号：" :label-width="formWidt">
          <el-input v-model="detail.sequence_number" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="公寓：" :label-width="formWidt">
          <el-input v-model="detail.store.name" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="房间号：" :label-width="formWidt">
          <el-input v-model="detail.room_id" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="客户姓名：" :label-width="formWidt">
          <el-input v-model="detail.name" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="预估金额：" :label-width="formWidt">
          <el-input v-model="detail.estimate_money" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="支付金额：" :label-width="formWidt">
          <el-input v-model="detail.pay_money" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <pagination-select :route-query="true" :total="total" @set="refresh"></pagination-select>
    </el-col>
  </section>
</template>

<script type="text/javascript">
import { CityStoreSelect, PaginationSelect, TextSearch, DateIntervalSelect } from '@/components/selects'
import { ServiceTypeSelect, ServiceStatusSelect } from '@/components/service'
import { serviceList } from '@/api/api'
// getOrderDetail
export default {
  components: {
    CityStoreSelect,
    PaginationSelect,
    TextSearch,
    DateIntervalSelect,
    ServiceTypeSelect,
    ServiceStatusSelect,
  },
  data () {
    return {
      filters: {
        store_id: '',
        city: '',
        service_id: '',
        begin_time: '',
        end_time: '',
        deal: '',
      },
      status: '',
      input: '',
      /* 城市列表 */
      apartment: [],
      /* 服务列表 */
      orderDetails: false,
      /* 是否显示订单详情 */
      serviceList: [],
      total: 0,
      service_id: '',
      /* 查询需要 服务id */
      store_id: '',
      /* 查询需要 公寓id */
      begin_time: '',
      /* 查询需要 开始日期 */
      end_time: '',
      /* 查询需要 结束日期 */
      type: '',
      listLoading: false,
      detail: {
        id: '',
        number: '',
        sequence_number: '',
        store: {
          name: '',
        },
        room_id: '',
        name: '',
        estimate_money: '',
        pay_money: '',
      },
      formWidt: '130px',
      searchOptions: [
        { label: '名称', key: 'number' },
      ],
    }
  },
  mounted () {
    this.refresh()
  },

  methods: {
    refresh() {
      this.getService()
    },
    /* 获取数据列表 */
    getService () {
      let that = this
      let para = this.queryOption()
      that.listLoading = true
      serviceList(para).then((res) => {
        let getData = res
        let list = getData.items
        getData.items.forEach((item) => {
          item.status = that.func.serviceStatus(item.status)
          item.type = that.func.notypeTra(item.type)
          item.deal = that.func.serviceTypes(item.deal)
        })
        // 暂不清楚这一段逻辑
        // if (!item.service_type) {
        //   if (item.service_type_id === item.service_type.id) {
        //     item.service_type_id = item.service_type.name
        //   }
        // }

        // if (item.store) {
        //   if (item.store_id === item.store.id) {
        //     item.store_id = item.store.name
        //   }
        // }
        // item.deal = that.func.serviceTypes(item.deal)
        that.serviceList = list
        that.total = getData.count
        that.listLoading = false
      }).catch(function (err) {
        console.log(err)
      })
    },

    servicStatus () {
      this.updateRouteQuery('deal', this.filters.deal)
      this.refresh()
    },

    /* 选择服务 */
    serviceType () {
      this.updateRouteQuery('type', this.filters.type)
      this.refresh()
    },

    /* 订单处理情况转换 */
    // serviceTypes (text) {
    //   let deal = ''
    //   switch (text) {
    //     case 'UNDONE':
    //       deal = '未处理'
    //       break
    //     case 'SDOING':
    //       deal = '处理中'
    //       break
    //     case 'SDONE':
    //       deal = '已处理'
    //       break
    //   }
    //   return deal
    // },

    /* 服务状态转换 */
    // serviceStatus (datas) {
    //   let status = ''
    //   switch (datas) {
    //     case 'COMPLETED':
    //       status = '已完成'
    //       break
    //     case 'SERVING':
    //       status = '处理中'
    //       break
    //     case 'SUBMITTED':
    //       status = '已提交'
    //       break
    //     case 'PENDING':
    //       status = '待支付'
    //       break
    //     case 'PAID':
    //       status = '已支付'
    //       break
    //     case 'CANCELED':
    //       status = '已取消'
    //       break
    //     case 'EXPIRED':
    //       status = '已过期'
    //       break
    //   }

    //   return status
    // },

    /* 详情 */
    details (index, row) {
      this.$router.push({
        path: '/',
        query: {
          id: row.id,
        },
      })
      // getOrderDetail(para).then((res) => {
      //   that.orderDetails = true
      //   let rescode = res.data.rescode
      //   let resmsg = res.data.resmsg
      //   that.func.portInit(rescode, resmsg, function () {
      //     that.func.portInit(rescode, resmsg, function () {
      //       that.detail = res.data.data[0]
      //     })
      //   })
      // }).catch(function (err) {
      //   console.log(err)
      // })
    },
  },
}
</script>
