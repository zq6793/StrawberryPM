<template>
  <section class="fx-pages-main water">
    <el-form :inline="true" class="fx-table-sort-head">
      <el-form-item label="" size="small">
        <city-store-select :route-query="true" @set="refresh"></city-store-select>
      </el-form-item>
      <el-form-item class="searchs inputs white-el-select" size="small">
        <text-search :route-query="true" :options="searchOptions" @set="refresh"></text-search>
      </el-form-item>
      <el-form-item size="small">
      <el-button type="primary" @click="handleAdd">批量导出</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="listitems" highlight-current-row @selection-change="selsChange" style="width: 100%;" v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column prop="store_name" label="门店名称" width="220">
      </el-table-column>
      <el-table-column prop="room_number" label="房间号">
      </el-table-column>
      <el-table-column prop="old_resident_name" label="原住户姓名">
      </el-table-column>
      <el-table-column prop="new_resident_name" label="新住户姓名">
      </el-table-column>
      <el-table-column prop="type" label="转租类型">
      </el-table-column>
      <el-table-column prop="transform_time_e" label="换房日期">
      </el-table-column>
      <el-table-column prop="status" label="状态">
      </el-table-column>
      <el-table-column prop="employee_name" label="业务申请人">
      </el-table-column>
      <el-table-column label="操作" width="53">
        <template slot-scope="scope">
          <el-button type="text"  @click="handleEdit(scope.$index, scope.row)">查看</el-button>
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
import { CityStoreSelect, PaginationSelect, TextSearch } from '@/components/selects'
import { subletList } from '@/api/api'
export default {
  components: {
    CityStoreSelect,
    PaginationSelect,
    TextSearch,
  },
  data () {
    return {
      total: 0,
      listLoading: false,
      name: '',
      listitems: '',
      type: '',
      searchOptions: [
        { label: '房间号', key: 'room_number' },
        { label: '姓名', key: 'resident_name' },
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

    searchAll () {
      this.updateRouteQuery('search', this.input)
      this.refresh()
    },
    handleSetType (val) {
      this.updateRouteQuery('type', val)
      this.refresh()
    },
    // 获取退房列表
    getList () {
      let that = this
      let para = this.queryOption()
      para.group_status = 'DONE'
      // para.type = that.type
      that.listLoading = true
      subletList(para).then(res => {
        that.listitems = res.data.items
        that.listitems.forEach((item) => {
          item.transform_time_e = that.fxFilter.goTime(item.transform_time_e)
          item.status = that.func.checkoutStatus(item.status)
          item.type = that.func.transType(item.type)
        })
        that.total = res.data.count
        that.listLoading = false
      }).catch(function (err) {
        console.log(err)
      })
    },
    // 查看房间
    handleEdit (index, row) {
      this.$route.query.billnote_id = row.ID
      this.$emit('set', 'sublet', 'detail')
      // this.$router.push({
      //   path: '/billnotes/checkout/detail',
      //   query: {
      //     id: row.id,
      //   },
      // })
    },

  },
}
</script>
