<template>
  <section class="fx-pages-main ownerList">
    <el-form :inline="true" class="fx-table-sort-head">
      <!-- <el-form-item label="选择门店" size="small">
        <city-store-select @set="handleSetStore"></city-store-select>
      </el-form-item>
      <el-form-item label="选择年份" size="small">
        <el-date-picker v-model="year" type="year" placeholder="选择年" @change="yearTime">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="选择季度" class="selectl" size="small">
        <el-select v-model="season" placeholder="请选择" size="small" @change="getseason">
          <el-option v-for="item in seasonList" :key="item.id" :label="item.value" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支付状态" class="selectl" @change="getstatus" size="small">
        <el-select v-model="status" placeholder="请选择" size="small">
          <el-option v-for="item in statusList" :key="item.id" :label="item.value" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item class="searchs inputs white-el-select" size="small">
        <text-search :route-query="true" :options="searchOptions" @set="refresh"></text-search>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="storeList" @selection-change="selsChange" v-loading="listLoading" border>
      <el-table-column prop="house.number" label="房间号">
      </el-table-column>
      <el-table-column prop="house.owner.name" label="业主姓名">
      </el-table-column>
      <el-table-column prop="house.owner.phone" label="联系方式">
      </el-table-column>
      <el-table-column prop="time" label="账单日期" width="200">
      </el-table-column>
      <el-table-column prop="owner_earning.earnings" label="账单金额">
      </el-table-column>
      <el-table-column prop="money" label="维修费用">
      </el-table-column>
      <el-table-column prop="owner_earning.status" label="支付状态">
      </el-table-column>
      <el-table-column label="操作" width="53">
        <template slot-scope="scope">
          <el-button type="text" @click="lookInfo(scope.row)">
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total" :current-page.sync="page">
      </el-pagination>
  </section>
</template>
<script type="text/javascript">
import { TextSearch } from '@/components/selects'
import { showearning } from '@/api/api'
export default {
  components: {
    // CityStoreSelect,
    TextSearch,
  },
  data () {
    return {
      total: 0,
      page: 1,
      listLoading: false,
      city: '',
      store_id: '',
      storesList: '',
      search: '',
      status: '',
      season: '',
      year: '',
      statusList: [{
        id: '',
        value: '请选择',
      },
      {
        id: 'CANCELLED',
        value: '取消',
      },
      {
        id: 'GENERATED',
        value: '已生成',
      },
      {
        id: 'PAID',
        value: '已打款',
      },
      ],
      seasonList: [{
        id: '',
        value: '请选择',
      },
      {
        id: 1,
        value: 1,
      },
      {
        id: 2,
        value: 2,
      },
      {
        id: 3,
        value: '3',
      },
      ],
      searchOptions: [
        { label: '名称', key: 'search' },
        // { label: '房型特点', key: 'search' },
      ],
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    refresh() {
      this.getList()
    },
    handleSetStore (city, storeId) {
      this.city = city
      this.store_id = storeId
    },
    handleCurrentChange (val) {
      this.page = val
      this.getList()
    },

    getList () {
      let that = this
      // let para = this.queryOption()
      let para = {
        year: that.year,
        season: that.season,
        status: that.status,
        search: that.search,
      }
      that.listLoading = true
      showearning(para).then((res) => {
        if (res.data.rescode == 0) {
          let getData = res.data.data
          that.total = getData.total_pages
          getData.data.forEach((item) => {
            item.owner_earning.status = that.statusTra(item.owner_earning.status)
            item.time = item.owner_earning.start_date + ' -- ' + item.owner_earning.end_date
          })
          that.storeList = getData.data
          that.listLoading = false
        }
      })
    },

    statusTra (status) {
      if (status == 'GENERATED') {
        status = '已生成'
      } else if (status == 'PAID') {
        status = '已打款'
      } else if (status == 'CANCELLED') {
        status = '已取消'
      }
      return status
    },
    yearTime (val) {
      this.year = val
      this.getList()
    },
    searchName () {
      this.store_id = this.store_id
      this.getList()
    },
    getseason () {
      this.season = this.season
      this.getList()
    },
    getstatus () {
      this.status = this.status
      this.getList()
    },
    // 搜索
    searchStore () {
      this.search = this.search
      this.getList()
    },
    searchAll () {
      this.searchStore()
    },
    /* 编辑当前 */
    lookInfo (row) {
      sessionStorage.setItem('page', JSON.stringify(this.page))
      this.$router.push({
        path: '/lookorderlist',
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
<style scoped="scoped">
  .ownerList .el-form-item--small.el-form-item{
    margin-bottom: 4px;
  }
</style>


