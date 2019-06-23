<template>
  <section class="fx-pages-main contract-template">
    <el-form :inline="true" :model="filters"  class="fx-table-sort-head">
      <el-form-item>
        <el-button type="primary" size="small" class="add-btn" @click="addTempalte">+ 新建模板</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" size="small" @click="batchRemove" :disabled="this.sels.length===0">删除</el-button>
      </el-form-item>
      <el-form-item size="small">
        <city-store-select :route-query="true" @set="refresh"></city-store-select>
      </el-form-item>
      <el-form-item size="small">
        <text-search :route-query="true" :options="searchOptions" @set="refresh"></text-search>
      </el-form-item>
    </el-form>

    <el-table :data="storeList" highlight-current-row @selection-change="selsChange" style="width: 100%;" v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="id" label="ID">
      </el-table-column>
      <el-table-column prop="store.name" label="门店名称" width="240">
      </el-table-column>
      <el-table-column prop="name" label="模版名称">
        <template slot-scope="scope">
          <el-button type="text" @click="lookPdf(scope.$index, scope.row)">
            {{ scope.row.name }}
         </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="rent_type" label="模版类型">
      </el-table-column>
      <el-table-column label="操作" width="50">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination-select :route-query="true" :total="total" @set="refresh"></pagination-select>
  </section>
</template>
<script type="text/javascript">
import { CityStoreSelect, TextSearch, PaginationSelect } from '@/components/selects'
import { listtemplate, searchTemplate, destroyTemplate } from '@/api/api'
export default {
  components: {
    CityStoreSelect,
    TextSearch,
    PaginationSelect,
  },
  data () {
    return {
      filters: {
        name: '',
      },
      apartmentValue: '',
      apartmentOptions: [],
      roomValue: '',
      roomOptions: [],
      sels: [], // 列表选中列删除
      storeList: [],
      total: 0,
      page: 1,
      listLoading: false,
      searchOptions: [
        { label: '模板名称', key: 'name' },
        // { label: '房型特点', key: 'search' },
      ],
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    refresh () {
      this.listTemplate()
    },
    /* 获取列表 */
    listTemplate () {
      let that = this
      let para = this.queryOption()
      that.listLoading = true
      listtemplate(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        that.func.portInit(rescode, resmsg, function () {
          let getData = res.data.data
          for (let key in getData.list) {
            getData.list[key].rent_type = that.templateType(getData.list[key].rent_type)
          }
          that.storeList = getData.list
          that.total = getData.count * 10
          that.listLoading = false
        })
      }).catch(function (err) {
        console.log(err)
      })
    },

    /* 转换模板类型 */
    templateType (rent_type) {
      if (rent_type == 'LONG') {
        rent_type = '长租'
      } else if (rent_type == 'SHORT') {
        rent_type = '短租'
      } else if (rent_type == 'RESERVE') {
        rent_type = '预定'
      } else {}
      return rent_type
    },
    searchAll () {
      this.searchTemplate()
    },
    /* 搜索模板 */
    searchTemplate () {
      let that = this
      let para = {
        name: that.filters.name,
      }
      searchTemplate(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        that.func.portInit(rescode, resmsg, function () {
          let getData = res.data.data
          getData.list.forEach((item) => {
            item.rent_type = that.templateType(item.rent_type)
          })
          that.storeList = getData.list
          that.total = getData.count
          that.listLoading = false
        })
      }).catch(function (err) {
        console.log(err)
      })
    },

    /* 新增模板 */
    addTempalte () {
      this.$router.push({
        path: '/addTemplate',
      })
    },

    // 查看pdf格式
    lookPdf (index, row) {
      window.open(row.url)
    },

    // 批量删除
    batchRemove () {
      let that = this
      let ids = that.sels.map(item => item.id)
      that.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning',
      }).then(() => {
        that.listLoading = true
        let para = {
          template_id: ids,
        }
        destroyTemplate(para).then(res => {
          let rescode = res.data.rescode
          let resmsg = res.data.resmsg
          that.func.portInit(rescode, resmsg, function () {
            that.listLoading = false
            that.$message({
              message: '删除成功',
              type: 'success',
            })
            that.getStoreInfo()
          })
        }).catch(function (err) {
          console.log(err)
        })
      }).catch(function (err) {
        console.log(err)
        that.listLoading = false
        that.$message({
          type: 'info',
          message: '已取消删除',
        })
      })
    },

    /* 编辑当前 */
    handleEdit (index, row) {
      sessionStorage.setItem('page', JSON.stringify(this.page))
      let that = this
      that.$router.push({
        path: '/editTemplate',
        query: {
          template_id: row.id,
        },
      })
    },

    selsChange (sels) {
      this.sels = sels
    },

  },
}
</script>
