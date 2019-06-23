<template>
  <section class="title-page paper">
    <div class="title">
      查看一些交易记录
    </div>
    <el-row :gutter="24">
      <el-form :inline="true">
        <el-form-item label="开始时间：" prop="">
          <el-date-picker v-model="startTime" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：" prop="">
          <el-date-picker v-model="endTime" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="searchs">
          <el-input v-model="name" type="text" class="input" placeholder="请输入学号、学生名、论文等关键字" />
          </el-input>
          <i class="iconfont icon-ali-sousuo"></i>
        </el-form-item>
      </el-form>
    </el-row>
    <!--列表-->
    <el-table :data="review" highlight-current-row @selection-change="selsChange" v-loading="listLoading" class="alltable">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="name" label="提款金额">
      </el-table-column>
      <el-table-column prop="phone" label="提款时间">
      </el-table-column>
      <el-table-column prop="position_name" label="提款方式">
      </el-table-column>
      <el-table-column prop="store_name" label="评阅费">
      </el-table-column>
      <el-table-column prop="hiredate" label="是否可以提取">
      </el-table-column>
      <el-table-column prop="hiredate" label="是否已提取">
      </el-table-column>
      <el-table-column prop="hiredate" label="提取时间">
      </el-table-column>
      <el-table-column label="操作" width="53">
        <template slot-scope="scope">
          <span size="small" @click="handleEdit(scope.row)" class="textchange">修改</span>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" :current-page.sync="page">
      </el-pagination>
    </el-col>
  </section>
</template>
<script>
export default {
  data() {
    return {
      college: [],
      subject: [],
      startTime: '',
      endTime: '',
      page: 1,
      total: 0,
    }
  },

  computed: {

  },
  mounted() {

  },
  updated() {},
  methods: {
    /* 添加院系 */
    handleAdd() {
      this.$router.push({
        path: '/addcollege',
      })
    },
  },
}

</script>
