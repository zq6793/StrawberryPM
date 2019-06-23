<template>
  <section class="fx-pages-main coupon">
    <!--工具条-->
      <el-form :inline="true" class="fx-table-sort-head">
        <el-form-item size="small">
          <el-button @click="handleAdd" type="primary">+ 增加优惠券</el-button>
          <el-button type="primary" @click="lookRecord">优惠券记录</el-button>
          <el-button type="primary" @click="payout" :disabled="this.sels.length===0">派发</el-button>
        </el-form-item>
        <el-form-item v-if="false" size="small">
          <text-search :route-query="true" :options="searchOptions" @set="refresh"></text-search>
        </el-form-item>
      </el-form>
    <!--列表-->
    <el-table :data="couponList" highlight-current-row @selection-change="selsChange" v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="id" label="优惠券ID">
      </el-table-column>
      <el-table-column prop="name" label="名称">
      </el-table-column>
      <el-table-column prop="type" label="类型">
      </el-table-column>
      <el-table-column prop="limit" label="用途">
      </el-table-column>
      <el-table-column prop="deadline" label="截止日期">
      </el-table-column>
      <el-table-column label="操作" width="53">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <pagination-select :route-query="true" :total="total" @set="refresh"></pagination-select>
    </el-col>
  </section>
</template>
<script type="text/javascript">
import { TextSearch, PaginationSelect } from '@/components/selects'
import { listCoupon } from '@/api/api'
export default {
  components: {
    TextSearch,
    PaginationSelect,
  },
  data () {
    return {
      city: '',
      store_id: '',
      couponList: [],
      listLoading: false,
      sels: [],
      name: '',
      page: 1,
      total: 0,
      searchOptions: [
        { label: '名称', key: 'name' },
      ],
      handleExport: false,
      pushExcel: {
        store_id: '',
        startYear: '',
        startMonth: '',
        endYear: '',
        endMonth: '',
        startTime: '',
        endTime: '',
      },
    }
  },
  mounted () {
    this.getCouponList()
  },
  methods: {
    refresh () {
      this.getCouponList()
    },
    /* 选择门店 */
    handleSetExpStore(city, storeId) {
      this.pushExcel.store_id = storeId
    },

    /* 增加优惠券 */
    handleAdd () {
      this.$router.push({
        path: '/addcoupon',
      })
    },
    /* 获取优惠券列表 */
    getCouponList () {
      let that = this
      let para = this.queryOption()
      that.listLoading = true
      listCoupon(para).then((res) => {
        let rescode = res.data.rescode
        let getData = res.data.data
        let resmsg = res.data.resmsg
        that.func.portInit(rescode, resmsg, function () {
          getData.list.forEach((item) => {
            item.type = that.func.contypeTra(item.type)
            item.limit = that.func.limitTra(item.limit)
            item.deadline = item.deadline.substr(0, 10)
          })
          that.couponList = getData.list
          that.total = getData.count * 10
          that.listLoading = false
        })
      }).catch(function (err) {
        console.log(err)
      })
    },

    /* 搜索 */
    searchJob () {
      // let that = this,
      //     para = {
      //       page : that.page,
      //       name : that.name
      //     };
      // searchJob(para).then((res) => {
      //   let rescode = res.data.rescode,
      //       getData = res.data.data,
      //       resmsg  = res.data.resmsg;
      //   that.func.portInit(rescode, resmsg, function() {
      //     that.jobList = getData.list;
      //     that.total = getData.count;
      //   })
      // }).catch(function (err) {
      //   console.log(err)
      // });
    },

    /* 派发优惠券 */
    payout () {
      sessionStorage.setItem('page', JSON.stringify(this.page))
      let that = this
      let ids = that.sels.map(item => item.id)
      if (that.sels.length > 1) {
        that.$message({
          message: '只能选择一个优惠券',
          type: 'warning',
        })
      } else {
        ids = ids.toString()
        that.$router.push({
          path: '/payoutcoupon',
          query: {
            id: ids,
          },
        })
      }
    },
    // 优惠券记录
    lookRecord () {
      this.$router.push({ path: '/record' })
    },
    /* 编辑页面 */
    handleEdit (index, row) {
      sessionStorage.setItem('page', JSON.stringify(this.page))
      this.$router.push({
        path: '/editcoupon',
        query: {
          id: row.id,
        },
      })
    },

    selsChange (sels) {
      this.sels = sels
    },
  },
}
</script>
