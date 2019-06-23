<template>
  <section class="fx-pages-main service-type">
    <!--工具条-->
      <el-form :inline="true" class="fx-table-sort-head">
        <el-form-item label="" size="small">
          <el-button type="primary" @click="handleAdd">增加</el-button>
        </el-form-item>
      </el-form>
    <!-- 列表 -->
    <el-table :data="storeList" highlight-current-row style="width: 100%;" v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column prop="id" label="ID" width="80">
      </el-table-column>
      <el-table-column prop="image_url" label="图片">
        <template slot-scope="scope">
          <img v-if="scope.row.image_url" :src="scope.row.image_url" style="display:block;margin:auto;cursor: pointer; padding:10px;" />
          <span v-else>暂无图片</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="类型名称">
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
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total" :current-page.sync="page">
      </el-pagination>
  </section>
</template>

<script type="text/javascript">
import { serviceTypes } from '@/api/api'
export default {
  data () {
    return {
      listLoading: false,
      storeList: [],
      sels: [], // 选中
      total: 0,
      page: 1,
    }
  },
  created () {
    if (sessionStorage.getItem('page')) {
      this.page = Number(sessionStorage.getItem('page'))
    }
  },
  mounted () {
    this.getServiceTypes()
  },
  destroyed () {
    if (this.$route.path !== '/editserver') {
      sessionStorage.removeItem('page')
    }
  },
  methods: {
    /* 获取服务类型 */
    getServiceTypes () {
      let that = this
      let para = {
        page: that.page,
      }
      that.listLoading = true
      serviceTypes(para).then((res) => {
        let rescode = res.data.rescode
        let getData = res.data.data
        let resmsg = res.data.resmsg
        that.func.portInit(rescode, resmsg, function () {
          for (let key in getData.list) {
            if (getData.list[key].image_url) {
              // getData.list[key].image_url = getData.cdn_path + getData.list[key].image_url+'?x-oss-process=image/resize,m_lfit,h_80,w_80';
              getData.list[key].image_url = getData.list[key].image_url + '?x-oss-process=image/resize,m_lfit,h_80,w_80'
            }
          }
          that.storeList = getData.list
          that.total = getData.count
          that.listLoading = false
        })
      }).catch(function (err) {
        console.log(err)
      })
    },

    /* 添加服务 */
    handleAdd () {
      this.$router.push({
        path: '/addserver',
      })
    },

    /* 编辑服务 */
    handleEdit (index, row) {
      sessionStorage.setItem('page', JSON.stringify(this.page))
      this.$router.push({
        path: '/editserver',
        query: {
          id: row.id,
        },
      })
    },

    handleCurrentChange (val) {
      this.page = val
      this.getServiceTypes()
    },

  },
}
</script>
