<template>
  <section class="runwater">
        <el-form :inline="true" class="fx-table-sort-head">
<!--      <el-form-item size="small">
            <el-button type="primary" @click="handleExports">批量导出</el-button>
          </el-form-item> -->
          <el-form-item size="small">
            <city-store-select :route-query="true" @set="refresh"></city-store-select>
          </el-form-item>
<!--      <el-form-item label="日期" size="small">
            <date-interval-select :route-query="true" @set="refresh"></date-interval-select>
          </el-form-item> -->
        </el-form>
        <!--列表-->
        <el-table :data="billList" highlight-current-row @selection-change="selsChange" v-loading="listLoading" border tooltip-effect="dark">
          <el-table-column prop="store.name" label="门店名称" width="230" align="center">
          </el-table-column>
          <el-table-column prop="resident.name" label="总房间数" align="center">
          </el-table-column>
          <el-table-column prop="name" label="已租间数" align="center">
          </el-table-column>
          <el-table-column prop="name" label="可出租间数" align="center">
          </el-table-column>
          <el-table-column prop="name" label="维修费" align="center">
          </el-table-column>
          <el-table-column prop="name" label="占用房" align="center">
          </el-table-column>
          <el-table-column prop="name" label="平均空置率" align="center">
          </el-table-column>
          <el-table-column prop="name" label="平均出房天数" align="center">
          </el-table-column>
        </el-table>
        <!--工具条-->
        <pagination-select :route-query="true" :total="total" @set="refresh"></pagination-select>
  </section>
</template>
<script type="text/javascript">
import { CityStoreSelect, PaginationSelect } from '@/components/selects'
export default {
  components: {
    CityStoreSelect,
    PaginationSelect,
    // DateIntervalSelect,
  },
  data () {
    return {
    }
  },
  created () {
    if (sessionStorage.getItem('page')) {
      this.page = Number(sessionStorage.getItem('page'))
    }
  },
  mounted () {
    // this.getBillList()
  },
  destroyed () {
    if (this.$route.path !== '/householdinfo') {
      sessionStorage.removeItem('page')
    }
  },
  methods: {
    // handleCurrentChange (val) {
    //   this.page = val
    //   // this.getBillList()
    // },
    // 时间
  },
}
</script>
