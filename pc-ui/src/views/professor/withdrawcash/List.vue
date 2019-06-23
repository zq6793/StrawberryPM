<template>
  <section class="title-page paper">
    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane label="提取记录" name="first">
        <!--列表-->
        <el-table :data="formList" highlight-current-row v-loading="listLoading" boredr class="alltable">
          <el-table-column prop="CreatedAt" label="提取日期">
          </el-table-column>
          <el-table-column prop="money" label="提取金额">
          </el-table-column>
          <el-table-column prop="status" label="提取状态">
          </el-table-column>
          <el-table-column label="查看">
          </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
          <pagination :total="total" :route-query="true" @set="refresh"></pagination>
        </el-col>
      </el-tab-pane>
      <!-- <el-tab-pane label="结算设置" name="second">
        <div class="account-detail">
          <el-form class="account-detail-list">
            <el-row :gutter="20" class="account-detail-title">
              <el-col :span="4" class="account-detail-t">持卡人姓名：</el-col>
              <el-col :span="20">{{ formInfo.bank_card_account }}
              </el-col>
            </el-row>
            <el-row :gutter="20" class="account-detail-title">
              <el-col :span="4" class="account-detail-t">银行卡号：</el-col>
              <el-col :span="20">{{ formInfo.bank_card_number }}
              </el-col>
            </el-row>
            <el-row :gutter="20" class="account-detail-title">
              <el-col :span="4" class="account-detail-t">身份证号：</el-col>
              <el-col :span="20">{{ formInfo.idcard_number }}
              </el-col>
            </el-row>
            <el-row :gutter="20" class="account-detail-title">
              <el-col :span="4" class="account-detail-t">交易银行：</el-col>
              <el-col :span="20">{{ formInfo.bank_name }}</el-col>
            </el-row>
          </el-form>
        </div>
      </el-tab-pane> -->
    </el-tabs>
  </section>
</template>
<script>
import { Pagination } from '@/pcc/pages'
import { pListWithdraw, pWithdraProfile } from '@/api/api'
export default {
  components: {
    Pagination,
  },
  data() {
    return {
      total: 0,
      activeTab: 'first',
      formList: {},
      formInfo: {},
      id: '',
    }
  },
  mounted() {
    if (this.$route.query.active_tab) {
      this.activeTab = this.$route.query.active_tab
    }
    this.getWithdrawList()
    this.getWithdrawInfo()
  },
  methods: {
    refresh() {
      this.getWithdrawList()
    },
    /* 获取提取列表 */
    getWithdrawList() {
      let that = this
      let para = this.queryOption()
      that.listLoading = true
      pListWithdraw(para).then(res => {
        that.total = res.count
        that.formList = res.items
        that.formList.forEach(item => {
          item.CreatedAt = this.fxFilters.time(item.CreatedAt)
        })
        that.listLoading = false
      }).catch(err => {
        console.log(err)
      })
    },
    getWithdrawInfo() {
      let that = this
      pWithdraProfile().then(res => {
        that.formInfo = res
      }).catch(err => {
        console.log(err)
      })
    },
  },
}

</script>

