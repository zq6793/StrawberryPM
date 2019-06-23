<template>
  <section class="fx-pages-main ownerList">
    <el-form :inline="true" class="fx-table-sort-head">
      <el-form-item  size="small">
        <el-button type="primary" @click="handleAdd" class="btn"> + 新增小业主</el-button>
      </el-form-item>
      <el-form-item size="small">
        <city-store-select :route-query="true" @set="refresh"></city-store-select>
      </el-form-item>
      <el-form-item class="searchs inputs white-el-select" size="small">
        <text-search :route-query="true" :options="searchOptions" @set="refresh"></text-search>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="storeList" highlight-current-row @selection-change="selsChange" style="width: 100%;" v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column prop="house.store.name" label="门店名称" width="210">
      </el-table-column>
      <el-table-column prop="house.number" label="房间号">
      </el-table-column>
      <el-table-column prop="name" label="业主姓名">
      </el-table-column>
      <el-table-column prop="phone" label="联系方式" width="110">
      </el-table-column>
      <el-table-column prop="time" label="合同日期" width="200">
      </el-table-column>
      <el-table-column prop="status" label="合同状态">
      </el-table-column>
      <el-table-column prop="address" label="具体地址" width="210">
      </el-table-column>
      <el-table-column label="操作" width="53">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.$index, scope.row)">
            修改
          </el-button>
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
import { CityStoreSelect, TextSearch, PaginationSelect } from '@/components/selects'
import { getownerList } from '@/api/api'
export default {
  components: {
    CityStoreSelect,
    TextSearch,
    PaginationSelect,
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
      searchOptions: [
        { label: '房间号', key: 'search' },
        { label: '姓名', key: 'search' },
      ],
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    refresh () {
      this.getList()
    },
    getList () {
      let that = this
      let para = this.queryOption()
      that.listLoading = true
      getownerList(para).then((res) => {
        if (res.data.rescode == 0) {
          let getData = res.data.data
          that.total = getData.total_pages
          getData.data.forEach((item) => {
            item.status = that.func.ownerStatus(item.status)
            item.time = item.start_date + ' -- ' + item.end_date
          })
          that.storeList = getData.data
          that.listLoading = false
        }
      })
    },
    handleAdd () {
      this.$router.push({
        path: '/addowner',
      })
    },
    /* 编辑当前 */
    handleEdit (index, row) {
      sessionStorage.setItem('page', JSON.stringify(this.page))
      this.$router.push({
        path: '/editowner',
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
