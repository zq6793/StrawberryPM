<template>
  <section class="fx-pages-main">
      <el-form :inline="true"  class="fx-table-sort-head">
        <el-form-item label="流水号:" prop="name" size="small">
          <el-input class="input_inner" placeholder="请输入公司名称"></el-input>
        </el-form-item>
        <el-form-item label="订单号:" prop="name" size="small">
          <el-input class="input_inner" placeholder="请输入公司名称"></el-input>
        </el-form-item>
        <el-form-item label="开始日期:" size="small">
        <el-date-picker v-model="startDate" type="date" placeholder="选择日期">
        </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期:" size="small">
        <el-date-picker v-model="endDate" type="date" placeholder="选择日期">
        </el-date-picker>
        </el-form-item>
      </el-form>
    <!--列表-->
    <el-table :data="storeList" highlight-current-row @selection-change="selsChange" style="width: 100%;" v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column prop="name" label="流水号" align="center">
      </el-table-column>
      <el-table-column prop="address" label="订单号" align="center">
      </el-table-column>
      <el-table-column prop="contact_user" label="付款人" align="center">
      </el-table-column>
      <el-table-column prop="contact_phone" label="商品金额" align="center">
      </el-table-column>
      <el-table-column prop="license" label="金额/元" align="center">
      </el-table-column>
      <el-table-column prop="status" label="支付时间" align="center">
      </el-table-column>
    </el-table>
    <!-- 弹出的订单详情 -->
    <el-dialog v-model="orderDetails" :close-on-click-modal="false">
      <div style="display: flex; justify-content: center;">125</div>
    </el-dialog>
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
      chooseCityValue: '',
      chooseCityOptions: [{
        value: '深圳市',
        label: '深圳市',
      }, {
        value: '上海市',
        label: '上海市',
      }, {
        value: '杭州市',
        label: '杭州市',
      } ],
      filters: {
        name: '',
      },
      sels: [], // 列表选中列删除
      storeList: [],
      total: 0,
      page: 1,
      listLoading: false,
    }
  },

  methods: {
    handleCurrentChange (val) {
      this.page = val
      this.getStoreInfo()
    },

    /* 获取门店列表 */
    getStoreInfo () {

    },

    /* 批量删除 */
    batchRemove () {

    },

    /* 新增门店 */
    handleAdd () {

    },

    /* 删除当前 */
    handleDel (index, row) {

    },

    /* 编辑当前 */
    handleEdit (index, row) {

    },

    selsChange (sels) {
      this.sels = sels
    },

  },
}
</script>
