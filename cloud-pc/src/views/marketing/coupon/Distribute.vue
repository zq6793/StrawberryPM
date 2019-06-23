<template>
  <section class="fx-pages-main coupon">
    <el-col :span="24">
      <el-form :inline="true">
        <el-form-item label="选择门店" size="small">
          <city-store-select :routeQuery="true" @set="refresh"></city-store-select>
        </el-form-item>
        <el-form-item class="searchs" size="small">
          <text-search :options="searchOptions" :routeQuery="true" @set="refresh"></text-search>
        </el-form-item>
        <el-form-item size="small">
          <el-button type="primary" @click="payouts">派发</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="couponUserList" highlight-current-row @selection-change="selsChange" v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="store_name" label="门店名称" width="210">
      </el-table-column>
      <el-table-column prop="room_number" label="房间号">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="phone" label="联系方式" width="180">
      </el-table-column>
      <el-table-column prop="card_number" label="证件号码">
      </el-table-column>
      <!-- <el-table-column prop="limit" label="创建时间">
      </el-table-column> -->
      <el-table-column prop="status" label="状态">
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <pagination-select :route-query="true" :total="total" @set="refresh"></pagination-select>
    </el-col>
  </section>
</template>
<script type="text/javascript">
import { TextSearch, CityStoreSelect, PaginationSelect } from '@/components/selects'
import { couponResidentList, assignCoupon } from '@/api/api'
export default {
  components: {
    TextSearch,
    CityStoreSelect,
    PaginationSelect,
  },
  data () {
    return {
      coupon_id: '',
      city: '',
      cityList: [],
      store_id: '',
      storesList: [],
      couponUserList: [],
      listLoading: false,
      sels: [],
      // name: '1',
      page: 1,
      total: 0,
      community_id: '',
      // showCommunityList : '',
      searchOptions: [
        { key: 'room_number', label: '房间号' },
        { key: 'resident_name', label: '姓名' },
      ],
    }
  },
  created () {
    this.coupon_id = this.$route.query.id
  },

  mounted () {
    this.getResidentList()
  },

  methods: {
    refresh () {
      this.getResidentList()
    },

    /* 获取派发用户列表 */
    getResidentList () {
      let that = this
      let para = this.queryOption()
      that.listLoading = true
      couponResidentList(para).then((res) => {
        let getData = res.data
        getData.items.forEach((item) => {
          item.status = that.func.residentTre(item.status)
        })
        that.couponUserList = getData.items
        that.total = getData.count
        that.listLoading = false
      }).catch(function (err) {
        console.log(err)
      })
    },

    /* 派发优惠券 */
    payouts () {
      let that = this
      let ids = that.sels.map(item => item.ID)
      let para = {
        coupon_id: that.coupon_id,
        resident_ids: ids,
      }
      assignCoupon(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        that.func.portInit(rescode, resmsg, function () {
          that.$message({
            message: '发送成功',
            type: 'success',
          })
        })
      }).catch(function (err) {
        console.log(err)
      })
    },

    selsChange (sels) {
      this.sels = sels
    },
  },
}
</script>
