<template>
  <section class="fx-pages-main water">
    <el-form :inline="true" class="fx-table-sort-head">
      <el-form-item label="" size="small">
        <city-store-select :route-query="true" @set="refresh"></city-store-select>
      </el-form-item>
      <el-form-item label="" class="selectl" size="small">
        <withdraw-type-select :route-query="true" @set="refresh"></withdraw-type-select>
      </el-form-item>
      <el-form-item class="searchs inputs white-el-select" size="small">
        <text-search :route-query="true" :options="searchOptions" @set="refresh"></text-search>
      </el-form-item>
      <el-form-item size="small">
      <el-button type="primary" @click="handleAdd">批量导出</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="storeList" highlight-current-row style="width: 100%;" v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="store_name" label="门店名称" width="220">
      </el-table-column>
      <el-table-column prop="room_number" label="房间号">
      </el-table-column>
      <el-table-column prop="resident_name" label="姓名">
      </el-table-column>
      <el-table-column prop="type" label="退房类型">
      </el-table-column>
      <el-table-column prop="CreatedAt" label="创建时间">
      </el-table-column>
      <el-table-column prop="real_refund_money" label="退款金额">
      </el-table-column>
      <el-table-column prop="status" label="状态">
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
import { WithdrawTypeSelect } from '@/components/finance'
import { backRoomList, backRoomExport } from '@/api/api'
export default {
  components: {
    CityStoreSelect,
    PaginationSelect,
    TextSearch,
    WithdrawTypeSelect,
  },
  data () {
    return {
      total: 0,
      listLoading: false,
      name: '',
      backRoomList: '',
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
    // 获取退房列表
    getList () {
      let that = this
      let para = this.queryOption()
      para.group_status = 'DONE'
      that.listLoading = true
      backRoomList(para).then(res => {
        that.storeList = res.data.items
        that.storeList.forEach((item) => {
          item.CreatedAt = that.fxFilter.goTime(item.CreatedAt)
          item.status = that.func.checkoutStatus(item.status)
          item.type = that.func.residentTre(item.type)
          if (item.refund < 0) {
            item.refund = 0
          }
        })
        that.total = res.data.count
        that.listLoading = false
      }).catch(function (err) {
        console.log(err)
      })
    },
    // 退房类型进行转化
    typeTra (type) {
      if (type == 'UNDER_CONTRACT') {
        type = '违约退房'
      } else if (type == 'NORMAL_REFUND') {
        type = '正常退房'
      } else if (type == 'NO_LIABILITY') {
        type = '特殊退房'
      }
      return type
    },
    // 房间状态转化
    statusTar (status) {
      if (status == 'COMPLETED') {
        status = '已退房'
      } else {
        status = '未退房'
      }
      return status
    },
    // 查看房间
    handleEdit (index, row) {
      // sessionStorage.setItem('page', JSON.stringify(this.page))
      this.$route.query.billnote_id = row.ID
      this.$emit('set', 'checkout', 'detail')
      // this.$router.push({
      //   path: '/lookcheckout',
      //   query: {
      //     id: row.id,
      //   },
      // })
    },
    /* 批量导出 */
    handleAdd () {
      console.log('批量导出')
      let that = this
      // let time = ''
      let para = this.queryOption()
      para.group_status = 'DONE'
      console.log(para)
      // that.startTime = para.begin_time.substr(0, 10)
      // that.endTime = para.end_time.substr(0, 10)
      // time = that.startTime + '--' + that.endTime
      that.$confirm('确认导出选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        backRoomExport(para).then((res) => {
          let blob = new Blob([res.data ], { type: 'application/octet-stream;charset=utf-8' }) // 创建一个blob对象
          let a = document.createElement('a') // 创建一个<a></a>标签
          a.href = URL.createObjectURL(blob) // response is a blob
          a.download = '退房单汇总导出.xlsx' // 文件名称
          a.style.display = 'none'
          document.body.appendChild(a)
          a.click()
          a.remove()
          setTimeout(() => {
            that.isclick = false
          }, 1200)
          that.$message({
            message: '导出表成功',
            type: 'success',
          })
        })
      })
    }

  },
}
</script>
