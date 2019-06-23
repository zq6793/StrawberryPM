<template>
  <section class="fx-pages-main househould">
    <el-form :inline="true" class="fx-table-sort-head">
      <el-form-item  size="small">
         <el-button @click="allExport = true" type="primary" size="small">批量导出</el-button>
      </el-form-item>
      <el-form-item size="small">
        <city-store-select :route-query="true" @set="refresh"></city-store-select>
      </el-form-item>
      <el-form-item class="searchs" size="small">
        <text-search :route-query="true" :options="searchOptions" @set="refresh"></text-search>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="contractList" highlight-current-row @selection-change="selsChange" v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="name" label="姓名">
      </el-table-column>
      <el-table-column prop="phone" label="联系方式" width="120">
      </el-table-column>
      <el-table-column prop="card_number" label="证件号码" width="260">
      </el-table-column>
      <el-table-column prop="address" label="房间地址" width="300">
      </el-table-column>
      <el-table-column prop="createdat" label="创建时间">
      </el-table-column>
      <el-table-column prop="status" label="状态">
      </el-table-column>
      <el-table-column label="操作" width="53">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <pagination-select :route-query="true" :total="total" @set="refresh"></pagination-select>
    </el-col>
        <!-- 批量导出 -->
    <el-dialog title="提示" v-model="allExport" :visible.sync="allExport" class="export" @close="exportClose">
      <el-form label-width="68px" :inline="true">
        <el-form-item label="选择门店" size="small">
          <city-store-select @set="handleSetStore"></city-store-select>
        </el-form-item>
        <el-form-item label="选择时间" size="small">
          <el-date-picker type="month" placeholder="请选择日期" @change="exportTime" v-model="adjExport.data"></el-date-picker>
        </el-form-item>
        <el-form-item size="small">
        <el-button class="comfirs" type="primary" @click="comfirExport" :disabled="isClick" v-loading="exportLoading">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </section>
</template>
<script type="text/javascript">
import { CityStoreSelect, TextSearch, PaginationSelect } from '@/components/selects'
import { showreSident, residentExport } from '@/api/api'
export default {
  components: {
    CityStoreSelect,
    TextSearch,
    PaginationSelect,
  },
  data () {
    return {
      contractList: [],
      listLoading: false,
      sels: [],
      name: '',
      total: 0,
      allExport: false,
      exportLoading: false,
      isClick: false,
      adjExport: {
        // city: '',
        store_id: '',
        data: '',
      },
      searchOptions: [
        { label: '姓名', key: 'name' },
        { label: '房间号', key: 'number' },
      ],
    }
  },
  mounted () {
    this.getContrantList()
  },
  methods: {
    refresh() {
      this.getContrantList()
    },
    /* 获取住户列表 */
    getContrantList () {
      let that = this
      let para = this.queryOption()
      that.listLoading = true
      showreSident(para).then((res) => {
        let rescode = res.data.rescode
        let getData = res.data.data
        let resmsg = res.data.resmsg
        that.func.portInit(rescode, resmsg, function () {
          getData.list.forEach((item) => {
            item.address = `${item.room.store_name}${item.room.number}`
            item.status = that.func.residentTre(item.status)
          })
          that.contractList = getData.list
          that.total = getData.count
          that.listLoading = false
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
    searchName () {
      this.name = this.name
      this.page = 1
      this.getContrantList()
    },
    searchAll () {
      this.searchName()
    },
    // 性别转化
    genderTra (gender) {
      if (gender == 'W') {
        gender = '女'
      } else if (gender == 'M') {
        gender = '男'
      } else {
        gender = '未知'
      }
      return gender
    },
    /* 批量导出 */
    batchExport () {

    },

    /* 编辑页面 */
    handleEdit (index, row) {
      sessionStorage.setItem('page', JSON.stringify(this.page))
      this.$router.push({
        path: '/householdinfo',
        query: {
          id: row.id,
        },
      })
    },

    selsChange (sels) {
      this.sels = sels
    },
    // 批量导出
    // searchCityE () {
    //   this.adjExport.store_id = ''
    //   this.adjExport.city = this.adjExport.city
    // },
    // getStoreListE () {
    //   let that = this
    //   let para = {
    //     city: that.adjExport.city,
    //   }
    //   getStoreList(para).then((res) => {
    //     let rescode = res.data.rescode
    //     let resmsg = res.data.resmsg
    //     let getData = res.data.data.stores
    //     getData.unshift({
    //       id: '',
    //       name: '请选择',
    //     })
    //     that.func.portInit(rescode, resmsg, function () {
    //       that.storesList = getData
    //     })
    //   }).catch(function (err) {
    //     console.log(err)
    //   })
    // },
    handleSetStore (val, store_id) {
      this.adjExport.store_id = store_id
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
        // that.storesList.forEach((item) => {
        // if (item.id == para.store_id) {
        //   name = item.name
        // }
        // })
        let month = (para.data.getMonth() + 1) < 10 ? '0' + (para.data.getMonth() + 1) : (para.data.getMonth() + 1)
        time = para.data.getFullYear() + '-' + month
        residentExport(para).then((res) => {
          if (res.status == 200) {
            let blob = new Blob([res.data ], { type: 'application/octet-stream;charset=utf-8' }) // 创建一个blob对象
            let a = document.createElement('a') // 创建一个<a></a>标签
            a.href = URL.createObjectURL(blob) // response is a blob
            a.download = time + name + '住户' + '.xlsx' // 文件名称
            a.style.display = 'none'
            document.body.appendChild(a)
            a.click()
            a.remove()
            that.$message({
              message: '住户信息导出成功',
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
      // this.func.clearVul(this.storesList)
      // this.storesList.length = 0
      this.exportLoading = false
      this.isClick = false
    },
  },
}
</script>
