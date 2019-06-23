<template>
  <section class="title-page paper">
    <div class="title">
      费用列表
    </div>
    <el-col :span="24">
      <el-form :inline="true">
      <!--   <el-form-item label="费用列表：">
            <el-button type="primary" class="open-review" @click="tryWithdraw">提取
            </el-button>
        </el-form-item> -->
      </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="orerList" highlight-current-row @selection-change="selsChange" v-loading="listLoading" border class="alltable">
      <el-table-column prop="paper_title" label="论文题目">
      </el-table-column>
      <el-table-column prop="reviewed_at" label="评阅意见提交时间">
      </el-table-column>
      <el-table-column prop="money" label="评阅费用">
      </el-table-column>
      <el-table-column prop="status" label="状态">
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <pagination :total="total" :route-query="true" @set="refresh"></pagination>
    </el-col>
    <!--提取弹窗-->
    <el-dialog
      title="提取申请"
      :visible.sync="showWithdraw"
      center>
      {{withdrawMsg}}
      <el-form label-width="120px" v-if="this.showWithdraw">
        <el-form-item label="提取到银行卡:" size="small" >
          {{ formInfo.bank_card_number }}
        </el-form-item>
        <el-form-item label="请输入取现金额:" size="small">
          <el-input placeholder="￥" class="withdrawInput" v-model="realMoney"></el-input>
        </el-form-item>
        <el-form-item label="可取现金额:" size="small" >
          ￥{{ account.balance }}
          <el-button type="text" @click="changeMoney" class="getAllMoney">全部提取</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showWithdraw=false">取 消</el-button>
        <el-button type="primary" @click="sendRequest">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import { Pagination } from '@/pcc/pages'
import { reviewOrder, pWithdraProfile, pRequestWithdraw, pGetAccountInfo } from '@/api/api'
export default {
  components: {
    Pagination,
  },
  data() {
    return {
      college: [],
      subject: [],
      orerList: [],
      startTime: '',
      endTime: '',
      page: 1,
      total: 0,
      showWithdraw: false,
      searchOption: {
        status: '',
      },
      realMoney: '',
      formInfo: {},
      account: {},
    }
  },

  computed: {
    hasBankAccount() {
      return this.$store.getters.pHasBankAccount
    },
  },
  mounted() {
    this.getOrder()
  },
  updated() {},
  methods: {
    refresh() {
      this.getOrder()
    },
    chooseStatus(status) {
      this.searchOption.status = status
      this.getOrder()
    },
    /* 获取论文列表 */
    getOrder() {
      let that = this
      let para = this.queryOption()
      para.status = this.searchOption.status
      that.listLoading = true
      reviewOrder(para).then(res => {
        that.total = res.count
        that.orerList = res.items
        that.orerList.forEach(item => {
          item.reviewed_at = this.fxFilters.time(item.reviewed_at)
          item.status = this.fxFilters.reviewStatus(item.status)
        })
        that.listLoading = false
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取用户可用金额
    getAccountInfo () {
      let that = this
      pGetAccountInfo().then((res) => {
        that.account = res
      }).catch((err) => {
        console.log('error', err)
      })
    },
    // 尝试提款
    tryWithdraw() {
      if (!this.hasBankAccount) {
        this.withdrawMsg = '请先到个人中心完善提款账户信息'
        this.showWithdraw = true
        return
      }
      this.withdrawMsg = ''
      this.getCardNum()
      this.getAccountInfo()
      this.showWithdraw = true
    },
    // 改变input框中金额
    changeMoney() {
      let that = this
      that.realMoney = that.account.balance
    },
    // 获取银行卡号
    getCardNum() {
      let that = this
      pWithdraProfile().then((res) => {
        that.formInfo = res
      }).catch(err => {
        console.log(err)
      })
    },
    sendRequest() {
      let that = this
      let para = {
        money: that.realMoney,
        way: 'BANK'
      }
      that.$confirm('确认申请取现吗？', '提示', {
        type: 'warning',
      }).then(() => {
        pRequestWithdraw(para).then((res) => {
          that.$message.success('提交申请成功')
          that.showWithdraw = false
        }).catch((err) => {
          console.log('err', err)
          that.$message.error('提交失败')
        })
      }).catch((err) => {
        that.$message({
          type: 'info',
          message: '已取消申请',
        })
      })
    },
  },
}

</script>
