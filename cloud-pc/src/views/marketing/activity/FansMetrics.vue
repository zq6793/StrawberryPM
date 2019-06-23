<template>
  <section class="fx-pages-main help">

    <!-- 列表 -->
    <el-table :data="helpList" highlight-current-row @selection-change="selsChange" v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column prop="name" label="公寓">
      </el-table-column>
      <el-table-column prop="pc_privilege" label="扫码人数">
      </el-table-column>
      <el-table-column prop="count_z" label="实际人数">
      </el-table-column>
      <el-table-column prop="created_at" label="吸引粉丝数">
      </el-table-column>
      <el-table-column prop="created_at" label="净增粉丝数">
      </el-table-column>
      <el-table-column prop="created_at" label="等级一优惠券发放">
      </el-table-column>
      <el-table-column prop="created_at" label="等级二优惠券发放">
      </el-table-column>
      <el-table-column prop="created_at" label="等级三优惠券发放">
      </el-table-column>
      <el-table-column prop="created_at" label="优惠券发放总计">
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
