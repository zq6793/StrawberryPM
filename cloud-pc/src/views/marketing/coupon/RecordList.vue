<template>
  <section>
    <el-form :inline="true" style="padding: 8px 22px">
      <el-form-item label="选择门店" size="small">
        <city-store-select :routeQuery="true" @set="refresh"></city-store-select>
      </el-form-item>
      <el-form-item size="small">
        <text-search :options="textSearchOption" :routeQuery="true" @set="refresh"></text-search>
      </el-form-item>
      <p class="page">
        <span>合计：{{count_number}}</span>
        <span>每页：10</span>
      </p>
    </el-form>
    <!--列表-->
    <el-table :data="storeList" highlight-current-row @selection-change="selsChange" style="width: 100%;" v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column prop="store_name" label="门店名称" width="220">
      </el-table-column>
      <el-table-column prop="room_number" label="房间号">
      </el-table-column>
      <el-table-column prop="resident_name" label="住户姓名">
      </el-table-column>
      <el-table-column prop="coupon_type_name" label="优惠券名称">
      </el-table-column>
      <el-table-column prop="coupon_type_name" label="金额(￥)">
      </el-table-column>
      <el-table-column prop="status" label="状态">
      </el-table-column>
      <el-table-column prop="CreatedAt" label="发放时间" width="160">
      </el-table-column>
      <el-table-column prop="employee_name" label="操作人">
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <pagination-select :route-query="true" :total="total" @set="refresh"></pagination-select>
    </el-col>
  </section>
</template>
<script type="text/javascript">
import { CityStoreSelect, TextSearch, PaginationSelect } from '@/components/selects'
import { couponRecordList } from '@/api/api'
export default {
  components: {
    CityStoreSelect,
    TextSearch,
    PaginationSelect,
  },
  data () {
    return {
      total: 0,
      count_number: '',
      listLoading: false,
      storeList: [],
      textSearchOption: [
        { key: 'room_number', label: '房间号' },
        { key: 'resident_name', label: '姓名' },
      ],
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    refresh () {
      this.getList()
    },
    // 获取优惠券记录列表
    getList () {
      let that = this
      let para = this.queryOption()
      that.listLoading = true
      couponRecordList(para).then(res => {
        let getData = res.data
        that.total = getData.count
        that.count_number = getData.count
        getData.items.forEach((item) => {
          item.status = that.func.constatusTra(item.status)
          item.CreatedAt = that.fxFilter.goTime(item.CreatedAt)
        })
        that.storeList = getData.items
        that.listLoading = false
      }).catch(function (err) {
        console.log(err)
      })
    },
  },
}
</script>
