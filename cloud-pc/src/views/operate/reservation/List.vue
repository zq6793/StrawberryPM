<template>
  <section class="fx-pages-main reservation-order">
    <!--工具条-->
    <el-form :inline="true" class="fx-table-sort-head">
      <el-form-item size="small">
        <el-button @click="allExport = true" type="primary" size="small">批量导出</el-button>
      </el-form-item>
      <el-form-item size="small">
        <city-store-select :route-query="true" @set="refresh"></city-store-select>
      </el-form-item>
      <el-form-item prop="visit_type" size="small">
        <visit-list-select :route-query="true" @set="refresh"></visit-list-select>
      </el-form-item>
      <el-form-item class="searchs" size="small">
        <text-search :route-query="true" :options="searchOptions" @set="refresh"></text-search>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="rservationList" highlight-current-row v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="store.name" label="门店名称" width="210">
      </el-table-column>
      <el-table-column prop="time" label="预约日期" width="160">
      </el-table-column>
      <el-table-column prop="visit_by" label="来访类型" width="107">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="80px">
      </el-table-column>
      <el-table-column prop="phone" label="手机号码" width="120">
      </el-table-column>
      <el-table-column prop="work_address" label="工作地点">
      </el-table-column>
      <el-table-column prop="require" label="需求">
      </el-table-column>
      <el-table-column prop="info_source" label="信息来源">
      </el-table-column>
      <el-table-column prop="employee.name" label="接待人">
      </el-table-column>
      <el-table-column prop="status" label="状态">
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="80px">
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <pagination-select :route-query="true" :total="total" @set="refresh"></pagination-select>
    </el-col>
    <!-- 批量导出 -->
    <el-dialog title="导出预约来访记录" v-model="allExport" :visible.sync="allExport" class="export" @close="exportClose">
      <el-form label-width="68px" :inline="true">
        <el-form-item label="选择门店">
          <city-store-select @set="handleSetExportStore"></city-store-select>
        </el-form-item>
        <br>
        <el-form-item label="选择时间">
          <el-date-picker type="month" placeholder="请选择日期" @change="exportTime" v-model="adjExport.data"></el-date-picker>
        </el-form-item>
        <br>
        <el-button class="comfirs" type="primary" @click="comfirExport" :disabled="isClick" v-loading="exportLoading">确认</el-button>
      </el-form>
    </el-dialog>
  </section>
</template>

<script type="text/javascript">
import { CityStoreSelect, TextSearch, PaginationSelect } from '@/components/selects'
import { VisitListSelect } from '@/components/operate'
import { reserveOrder, reserveExport } from '@/api/api'
export default {
  components: {
    CityStoreSelect,
    TextSearch,
    PaginationSelect,
    VisitListSelect,
  },
  data () {
    return {
      apartment: [],
      /* 来访列表 */
      total: 0,
      page: 1,
      rservationList: [],
      store_id: '',
      /* 查询需要 公寓id */
      visit_type: '',
      /* 查询需要 访问类型英文 */
      listLoading: false,
      name: '',
      allExport: false,
      exportLoading: false,
      isClick: false,
      adjExport: {
        city: '',
        store_id: 0,
        data: '',
      },
      searchOptions: [
        { label: '姓名', key: 'name' },
      ],
    }
  },

  mounted () {
    this.refresh()
  },

  methods: {
    refresh() {
      this.getReserveOrder()
    },
    handleSetExportStore (city, storeId) {
      this.adjExport.store_id = storeId
      this.adjExport.city = city
    },
    /* 获取服务管理
        预约订单列表 */
    getReserveOrder () {
      let that = this
      let para = this.queryOption()
      that.listLoading = true
      reserveOrder(para).then((res) => {
        let getData = res.data.data
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        that.func.portInit(rescode, resmsg, function () {
          getData.list.forEach((item) => {
            item.status = that.stateTransition(item.status)
            item.visit_by = that.visiting(item.visit_by)
            if (item.info_source == 0 || item.info_source == '选择信息来源') {
              item.info_source = ''
            }
          })
          that.rservationList = getData.list
          that.total = getData.count
          that.listLoading = false
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
    searchAll () {
      this.getReserveOrder()
    },

    /* 搜索城市 */
    searchCity () {
      let that = this
      that.store_id = ''
      if (that.city == '请选择') {
        that.store_id = ''
      } else {
        that.getReserveOrder()
      }
    },

    /* 来访类型转换 */
    visiting (visit_by) {
      if (visit_by === 'PHONE') {
        visit_by = '电话咨询'
      } else if (visit_by === 'VISIT') {
        visit_by = '现场看房'
      } else if (visit_by === 'WEB') {
        visit_by = '官网预约'
      } else if (visit_by === 'WECHAT') {
        visit_by = '订房系统预约'
      } else {
        visit_by = ''
      }
      return visit_by
    },

    /* 状态转换 */
    stateTransition (text) {
      if (text === 'NO') {
        text = '未到访'
      } else if (text === 'WAIT') {
        text = '等待看房'
      } else if (text === 'INVALID') {
        text = '取消'
      } else if (text === 'END') {
        text = '完成看房'
      } if (text === 'BEGIN') {
        text = '开始看房'
      } else {
      }

      return text
    },

    handleCurrentChange (val) {
      this.page = val
      this.getReserveOrder()
    },

    // 批量导出
    searchCityE () {
      this.adjExport.store_id = ''
      this.adjExport.city = this.adjExport.city
      this.getStoreListE()
    },
    exportTime (val) {
      this.adjExport.data = val
    },
    comfirExport () {
      let that = this
      let name = ''
      let time = ''
      let para = Object.assign({}, that.adjExport)
      that.exportLoading = true
      that.isClick = true
      that.func.emptyVul(para, function () {
        that.exportLoading = false
        that.isClick = false
      }, function () {
        that.storesList.forEach((item) => {
          if (item.id == para.store_id) {
            name = item.name
          }
        })
        time = para.data
        reserveExport(para).then((res) => {
          if (res.status == 200) {
            let blob = new Blob([res.data ], { type: 'application/octet-stream;charset=utf-8' }) // 创建一个blob对象
            let a = document.createElement('a') // 创建一个<a></a>标签
            a.href = URL.createObjectURL(blob) // response is a blob
            a.download = time + name + '预访' + '.xlsx' // 文件名称
            a.style.display = 'none'
            document.body.appendChild(a)
            a.click()
            a.remove()
            that.$message({
              message: '预访信息导出成功',
              type: 'success',
            })
            that.allExport = false
            that.exportLoading = false
            setTimeout(() => {
              that.isClick = false
            }, 1200)
          }
        })
      })
    },
    exportClose () {
      this.func.clearVul(this.adjExport)
      this.func.clearVul(this.storesList)
      this.storesList.length = 0
      this.exportLoading = false
      this.isClick = false
    },

  },
}
</script>
