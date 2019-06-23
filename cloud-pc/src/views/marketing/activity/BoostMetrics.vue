<template>
  <section class="fx-pages-main help">
    <!-- 列表 -->
    <el-table :data="helpList" highlight-current-row @selection-change="selsChange" v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column prop="name" label="微信昵称">
      </el-table-column>
      <el-table-column prop="pc_privilege" label="住户姓名">
      </el-table-column>
      <el-table-column prop="count_z" label="当前助力">
      </el-table-column>
      <el-table-column prop="created_at" label="是否已经领券">
      </el-table-column>
      <el-table-column prop="created_at" label="活动二维码">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total">
      </el-pagination>
    </el-col>
  </section>
</template>
<script type="text/javascript">
export default {
  data () {
    return {
      helpList: [],
      listLoading: false,
      sels: [],
      name: '',
      page: 1,
      total: 0,
    }
  },
  mounted () {
    this.getHelpList()
  },
  methods: {
    handleCurrentChange (val) {
      this.page = val
    },

    /* 获取助力列表 */
    getHelpList () {
      //   let that = this,
      //       para = {
      //         page : that.page,
      //       };
      //   jobLists(para).then((res) => {
      //     let rescode = res.data.rescode,
      //         getData = res.data.data,
      //         resmsg  = res.data.resmsg;
      //     that.func.portInit(rescode, resmsg, function() {
      //       that.helpList = getData.list;
      //       that.total = getData.count;
      //     })
      //   }).catch(function (err) {
      //     console.log(err)
      //   });
    },

    selsChange (sels) {
      this.sels = sels
    },
  },
}
</script>
