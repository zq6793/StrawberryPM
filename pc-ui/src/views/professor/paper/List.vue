<template>
  <section class="title-page dissertation">
    <div class="title">
      评议列表：您可以查看论文状态，并可进行评阅操作。
    </div>
    <el-form :inline="true">
      <!-- <el-form-item class="searchs">
        <subject-select></subject-select>
      </el-form-item> -->
      <el-form-item label="送达时间:" prop="">
        <date-interval-select :routeQuery="true" @set="refresh">
        </date-interval-select>
      </el-form-item>
      <el-form-item label="评议类型:" prop="">
        <paper-type-select :routeQuery="true" @set="refresh">
        </paper-type-select>
      </el-form-item>
      <el-form-item label="评议状态:" prop="">
        <review-status-select :routeQuery="true" @set="refresh">
        </review-status-select>
      </el-form-item>
      <!-- <el-form-item class="searchs">
        <text-search-select :routeQuery="true" :options="textSearchOption" @set="refresh">
        </text-search-select>
      </el-form-item> -->
    </el-form>
    <!--列表-->
    <el-table :data="paperList" highlight-current-row @selection-change="selsChange" v-loading="listLoading" class="alltable" :row-class-name="tableRowClassName">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="match_number" label="评议编号">
      </el-table-column>
      <el-table-column prop="title" label="评议标题">
      </el-table-column>
      <el-table-column prop="paper_type" label="评议类型">
      </el-table-column>
      <el-table-column prop="degree_type" label="学位/项目类别">
      </el-table-column>
      <el-table-column prop="subject" label="二级学科">
      </el-table-column>
      <el-table-column prop="match_time" label="送达时间">
      </el-table-column>
      <el-table-column prop="limit_time" label="评阅期限">
      </el-table-column>
      <el-table-column prop="tag" label="论文状态" :filter-method="filterTag" filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag :type="scope.row.review_status === '评阅中' ? 'success' : 'primary'">
            {{scope.row.review_status}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span
            @click="view(scope.row)"
            class="textchange">
            查看
          </span>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <pagination :total="total" :route-query="true" @set="refresh"></pagination>
    </el-col>
  </section>
</template>
<script>
import { Pagination } from '@/pcc/pages'
import {
  // subjectSelect,
  // textSearchSelect,
  DateIntervalSelect,
  PaperTypeSelect,
  ReviewStatusSelect,
} from '@/components/selects'
import { pPaperList } from '@/api/api'
export default {
  components: {
    Pagination,
    // subjectSelect,
    // textSearchSelect,
    DateIntervalSelect,
    PaperTypeSelect,
    ReviewStatusSelect,
  },
  data() {
    return {
      total: 0,
      name: '',
      paperList: [],
      textSearchOption: [
        { label: '论文标题', key: 'title' },
      ],
    }
  },
  mounted() {
    this.listPapers()
  },
  methods: {
    refresh() {
      this.listPapers()
    },
    listPapers: function() {
      let that = this
      let para = this.queryOption()
      pPaperList(para).then((res) => {
        that.paperList = res.items
        that.total = res.count
        that.paperList.forEach(item => {
          item.match_time = this.fxFilters.time(item.match_time)
          item.review_status = this.fxFilters.pPaperReviewStatus(item.review_status)
          if (item.review_status == '待接收' || item.review_status == '评阅中') {
            item.limit_time = this.fxFilters.countdown(item.limit_time)
          } else {
            item.limit_time = ''
          }
        })
      }).catch((err) => {
        console.log('pPaperList', err)
      })
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.paper_type == '科研项目') {
        return 'block-fund'
      } else if (row.paper_type == '资格申请') {
        return 'block-tutor'
      } else {
        return 'block-paper'
      }
    },
    view: function(item) {
      if (item.paper_type == '科研项目') {
        this.$router.push({ name: '科研项目概览', params: { id: item.ID } })
      } else if (item.paper_type == '资格申请') {
        this.$router.push({ name: '资格申请概览', params: { id: item.ID } })
      } else {
        this.$router.push({ name: '论文信息概览', params: { id: item.ID } })
      }
    },
  },
}

</script>
