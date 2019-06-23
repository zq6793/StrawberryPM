<template>
  <section class="dataanalysis professor">
    <!--操作提示-->
    <el-dialog
      title="论文评阅使用提示"
      :visible.sync="centerDialogVisible"
      center width="80%" style="margin-top:-8vh">
      <el-carousel class="homepage-tips" arrow="always" :autoplay="false" trigger="click" ref="carousel">
        <el-carousel-item>
          <img src="/static/imgs/pp_tips1.png" @click="next">
        </el-carousel-item>
        <el-carousel-item>
          <img src="/static/imgs/pp_tips2.png" @click="next">
        </el-carousel-item>
        <el-carousel-item>
          <img src="/static/imgs/pp_tips3.png" @click="next">
        </el-carousel-item>
        <el-carousel-item>
          <img src="/static/imgs/pp_tips4.png" @click="next">
        </el-carousel-item>
        <el-carousel-item>
          <img src="/static/imgs/pp_tips5.png" @click="next">
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
    <!-- 评审费 -->
    <div class="housetable">
      <strong>评审费</strong>
      <div class="right"></div>
      <el-row :gutter="24" class="paper-progress">
        <el-col :span="6">
          <div class="grid-content bg-purple" @click="gotoFeeDeatil">
            <div class="number">￥{{account.total}}</div>
            <div class="number-title">
              评审费总计
              <el-tooltip class="item" effect="light" content="您已完成提交的评议费用总金额。" placement="bottom">
                <i class="fa fa-info"></i>
              </el-tooltip>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple" @click="gotoFeeDeatil">
            <div class="number">￥{{account.booked}}</div>
            <div class="number-title">
              已入账金额
              <el-tooltip class="item" effect="light" content="平台已确认的评议费用总金额。" placement="bottom">
                <i class="fa fa-info"></i>
              </el-tooltip>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple" @click="tryWithdraw">
            <div class="number">￥{{account.balance}}</div>
            <div class="number-title">
              可提取金额
              <el-tooltip class="item" effect="light" content="您可提取到个人银行卡上的金额。" placement="bottom">
                <i class="fa fa-info"></i>
              </el-tooltip>
            </div>
            <div class="number-title">
              <el-button type="text" class="btn-number-title">提取申请</el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple" @click="gotoWithdrowDeatil">
            <div class="number">￥{{account.withdrawn + account.frozen}}</div>
            <div class="number-title">
              已提取金额
              <el-tooltip class="item" effect="light" content="您已提取的总金额。" placement="bottom">
                <i class="fa fa-info"></i>
              </el-tooltip>
            </div>
            <div class="number-title">
              <!-- <el-button type="text" class="btn-number-title">查看详情</el-button> -->
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 论文处理 -->
    <div class="housetable">
      <strong>待处理论文</strong>
      <div class="right" @click="lookMorePapers">查看更多>></div>
      <el-row :gutter="24" class="cont home-paper-block">
        <el-col :span="12" v-for="item in paperList" :key="item.ID">
          <div class="grid-content bg-purple" :class="paperClass(item)" @click="look(item)">
            <div class="tip">
              <b>{{ item.title }} &nbsp;</b>
              <span class="color-bule">{{ item.review_status }}</span>
            </div>
            <div class="tip">
              <br/>
            </div>
            <div class="tip">
              <p>评议编号：{{item.match_number}}</p>
              <p>评议类别：{{item.paper_type}}</p>
              <p>评议标题：{{item.title}}</p>
              <p>学科：{{ item.subject }}</p>
              <!-- <p>关键词：{{item.key_words}}</p> -->
              <!-- <p>攻读学位类别： {{item.degree_type}}</p> -->
              <p v-if="item.review_status=='待接收'">重新分配时间： {{item.limit_time}}</p>
              <p v-else-if="item.review_status=='已评阅'"></p>
              <p v-else>剩余评阅时间： {{item.limit_time}}</p>
            </div>
            <!-- <div class="data-time tip"> -->
              <!-- <div>评阅结束时间：{{ item.dead_line |time }}</div> -->
              <!-- <span class="color-bule">{{ item.message }}</span>
            </div> -->
          </div>
        </el-col>
      </el-row>
    </div>

    <el-dialog
      title="提取"
      :visible.sync="showWithdraw"
      center>
      <span class="showWithdraw" v-html="withdrawMsg"></span>
      <el-form label-width="120px" v-if="enableWithdraw">
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
        <el-button type="primary" @click="doWithdraw">确 定</el-button>
      </span>
    </el-dialog>

    <!-- <el-dialog
      title="提取"
      :visible.sync="showWithdraw"
      center>
      {{withdrawMsg}}
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doWithdraw">确 定</el-button>
      </span>
    </el-dialog> -->
  </section>
</template>
<script>
import { pPaperList, pGetAccountInfo, pWithdraProfile, pRequestWithdraw } from '@/api/api'
export default {
  data() {
    return {
      searchOption: {
        limit: 20,
        offset: (this.page - 1) * 10,
      },
      account: {},
      paperList: [],
      listLoading: false,
      showWithdraw: false,
      enableWithdraw: false,
      withdrawMsg: 'a',
      realMoney: '',
      formInfo: {},
      centerDialogVisible: false,
      toEdit: false,
      withdrawConfirm: false,
    }
  },
  computed: {
    professor() {
      return this.$store.getters.professor
    },
    hasBankAccount() {
      return this.$store.getters.pHasBankAccount
    },
  },

  mounted() {
    this.getPapers()
    this.getAccountInfo()
    if (!localStorage.getItem('is_first_in')) {
      this.centerDialogVisible = true
      localStorage.setItem('is_first_in', true)
    }
  },

  methods: {
    /* 手动切换轮播图 */
    pre() {
      this.$refs.carousel.prev()
    },
    next() {
      this.$refs.carousel.next()
    },
    first() {
      this.$refs.carousel.setActiveItem(0)
    },

    /* 获取论文列表 */
    getPapers() {
      let that = this
      let para = {
        limit: 6,
        offset: 0,
      }

      that.listLoading = true
      pPaperList(para).then(res => {
        that.paperList = res.items
        that.paperList.forEach(item => {
          // item.degree_type = this.fxFilters.degreeType(item.degree_type)
          // item.send_time = this.fxFilters.time(item.send_time)
          item.limit_time = this.fxFilters.countdown(item.limit_time)
          item.review_status = this.fxFilters.pPaperReviewStatus(item.review_status)
        })
        that.listLoading = false
      }).catch(err => {
        console.log(err)
      })
    },
    getAccountInfo () {
      let that = this
      pGetAccountInfo().then((res) => {
        that.account = res
      }).catch((err) => {
        console.log('error', err)
      })
    },

    /* 查看更多论文 */
    morePaper() {
      this.$message.success('暂无更多论文查看')
    },

    /* 查看论文 */
    look(item) {
      let routeName = '论文信息概览'
      if (item.paper_type == '科研项目') {
        routeName = '科研项目概览'
      } else if (item.paper_type == '资格申请') {
        routeName = '资格申请概览'
      }
      this.$router.push({
        name: routeName,
        params: { id: item.ID },
      })
    },
    lookMorePapers() {
      this.$router.push({ name: '评议列表' })
    },
    gotoFeeDeatil() {
      this.$router.push({ name: '费用' })
    },
    gotoWithdrowDeatil() {
      this.$router.push({ name: '提取' })
    },
    // 尝试提款
    tryWithdraw() {
      if (!this.hasBankAccount) {
        this.withdrawMsg = '请先到个人中心完善提款账户信息'
        this.showWithdraw = true
        this.toEdit = true
        return
      }
      this.withdrawMsg = `专家，您好。4月15日前评阅反馈已经确认，您无需做提取操作，平台已于4月底进行银行转账付款。为报障您利益，部分专家评审费会分批支付（单月支付金额不超过800元），如有任何疑问，请与服务支持联系contact@paperchain.cn 
<br/>注：个人信息还未补充的专家请及时完善，确保评阅费用及时发放。`
      this.showWithdraw = true
      // this.enableWithdraw = true
      // this.withdrawMsg = ''
      // this.getCardNum()
      // this.showWithdraw = true
      // this.withdrawConfirm = true
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
    doWithdraw() {
      if (!this.enableWithdraw && this.toEdit) {
        this.$router.push({ name: '专家个人信息修改' })
        return
      }
      if (this.withdrawConfirm) {
        let that = this
        let para = {
          money: parseFloat(that.realMoney),
          way: 'BANK'
        }
        that.$confirm('确认申请取现吗？', '提示', {
          type: 'warning',
        }).then(() => {
          pRequestWithdraw(para).then((res) => {
            that.$message.success('提交申请成功')
            that.showWithdraw = false
            location.reload()
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
      }
    },
    paperClass(item) {
      if (item.paper_type == '科研项目') {
        return 'block-fund'
      } else if (item.paper_type == '资格申请') {
        return 'block-tutor'
      } else {
        return 'block-paper'
      }
    }
  },
}

</script>
<style lang="scss" scoped>
@import "../../assets/professor.scss";
.bg-purple {
  border: 1px #eeeeee solid;
  background-color: white;
}
.btn-number-title {
  color: #eeeeee;
  font: bold;
}
.homepage-tips img{
  width: 100%;
}
.home-paper-block {
  background-color: white;
  margin-left: 0px;
  margin-right: 0px;
}
/* 首页弹出框引导页面 */
.el-dialog--center .el-dialog__body{
  padding: 0;
  .el-carousel{
    height: 760px;
    .el-carousel__container{
      height: 100%;
    }
  }
}
.showWithdraw {
  line-height: 30px
}
</style>
