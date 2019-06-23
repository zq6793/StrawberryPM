<template>
  <section class="title-page paper-detail block-tutor">
    <el-row :gutter="20">
      <el-col :span="16" :offset="1" class="std-btn">
        <el-button type="primary" v-if="enableReceive" @click="receiveP">接受评阅</el-button>
        <el-button type="danger" v-if="enableReceive" @click="clickReject">放弃评阅</el-button>
        <button type="button" class="el-button el-button--primary" v-if="enableReview">
          <span><a :href="downloadFundURL">下载申请表</a></span>
        </button>
        <el-button type="primary" v-if="enableReview" @click="reviewOnline">在线查看</el-button>
        <el-button type="success" v-if="enableReview" @click="toReview">继续评阅</el-button>
        <el-button type="success" v-if="enableSubmit" @click="clickSubmitReview">提交评阅</el-button>
      </el-col>
    </el-row>
    <el-form class="paper-detail-list">
      <el-row :gutter="20" class="paper-detail-title">
        <el-col :span="4" class="paper-detail-t">申请人姓名：</el-col>
        <el-col :span="20" class="paper-detail-m">
          <div class="mess ">
            <strong>{{ info.tutor_name }}</strong>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="paper-detail-title">
        <el-col :span="4" class="paper-detail-t">申请资格名称：</el-col>
        <el-col :span="20" class="paper-detail-m">
          <div class="mess ">
            <strong>{{ info.project_type }}</strong>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="paper-detail-title">
        <el-col :span="4" class="paper-detail-t">二级学科：</el-col>
        <el-col :span="20" class="paper-detail-m">
          <div class="mess ">
            <strong>({{ info.subject_number }}){{ info.subject_name }}</strong>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="paper-detail-message">
        <el-col :span="4" class="paper-detail-t">研究方向:</el-col>
        <el-col :span="20" class="paper-detail-m">
          <div class="mess ">
            {{ info.direction }}
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="paper-detail-message">
        <el-col :span="20" class="paper-detail-m">
          &nbsp;
        </el-col>
        <el-col :span="2" class="paper-detail-t">评议费用:</el-col>
        <el-col :span="2" class="paper-detail-m">
          <div class="professor_price">
            <span>{{ info.professor_price }}</span> 元
          </div>
        </el-col>
      </el-row>
    </el-form>

    <el-dialog
      title="论文提交"
      :visible.sync="showCommit"
      center>
      {{withdrawMsg}}
      <el-form label-width="120px" v-if="showCommit" label-position="top">
        <el-form-item label="评阅意见">
          <el-input disabled="true" type="textarea" v-model="info.general_opinion" rows="6" placeholder="请输入至少50个字">
          </el-input>
        </el-form-item>
        <el-form-item label="论文学术水平">
          <tutor-score-tag :isPass="info.pass"></tutor-score-tag>
        </el-form-item>
        <el-form-item label="论文学术水平">
          <el-checkbox v-model="registrationAgreementSuccess" class="agreement-link">
            同意<a target="_blank" href="/static/professor-agreement-info.html">《平台协议》</a>
          </el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showCommit=false">取 消</el-button>
        <el-button type="primary" @click="submitReview" :disabled="!registrationAgreementSuccess">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="放弃评阅"
      :visible.sync="showReject"
      center>
      <el-form v-if="showReject" label-position="top">
        <el-form-item label="放弃评阅原因">
          <el-select v-model="rejectInfo.reason" placeholder="请选择">
            <el-option
              v-for="item in rejectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="更多">
          <el-input type="textarea" v-model="rejectInfo.remark" rows="4" placeholder="请输入详细原因">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showReject = false">取 消</el-button>
        <el-button type="primary" @click="rejectP">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {
  managerProfile,
  pPaperTutorDetail,
  receiveP,
  rejectP,
  pPaperTutorAttachmentURL,
  pPaperTutorPDFURL,
  submitPaperReview,
  pAgreeRegistrationAgreement,
} from '@/api/api'
import { TutorScoreTag } from '@/pcc/reviews'
export default {
  components: {
    TutorScoreTag,
  },
  data() {
    return {
      name: '',
      info: {},
      rejectInfo: {
        reason: '',
        remark: '',
      },
      enableSubmit: false,
      // showRegistrationAgreement: false,
      // 签署成功了，但可能store数据还没来得及同步，需要用到此字段
      registrationAgreementSuccess: true,
      showCommit: false,
      showReject: false,
      rejectOptions: [{
        value: '没有时间评阅',
        label: '没有时间评阅'
      }, {
        value: '论文内容与我专业领域不匹配',
        label: '论文内容与我专业领域不匹配'
      }, {
        value: '其它原因',
        label: '其它原因'
      }],
    }
  },
  computed: {
    paperId: function() {
      return parseInt(this.$route.params.id)
    },
    enableReceive: function() {
      return this.info.review_status === '待接收'
    },
    enableReview: function() {
      return this.info.review_status === '评阅中'
    },
    ebableAttr: function() {
      return this.info.review_status === '评阅中'
    },
    isAgreeRegistrationAgreement() {
      return this.$store.getters.pIsAgreeRegistrationAgreement
    },
    downloadFundURL() {
      return pPaperTutorPDFURL(this.paperId)
    },
    downloadAttachmentURL() {
      return pPaperTutorAttachmentURL(this.paperId)
    },
  },
  mounted() {
    this.refresh()
  },
  methods: {
    refresh() {
      this.getPaper()
    },
    regetProfile() {
      let that = this
      managerProfile().then(res => {
        that.user_info = res
        that.$store.dispatch('setProfessorProfile', res)
      })
    },
    getPaper() {
      let that = this
      pPaperTutorDetail(this.paperId).then((res) => {
        res.review_status = that.fxFilters.pPaperReviewStatus(res.review_status)
        res.recommend = that.fxFilters.boolx(res.recommend)
        that.info = res
        if (this.enableReview && res.general_opinion.length > 100) {
          that.enableSubmit = true
        }
      }).catch((err) => {
        console.log('err', err)
      })
    },
    viewPDF() {
      let r = {
        name: '资格申请材料浏览',
        params: { id: this.paperId },
        query: { review_id: this.info.review_id, tpl_id: this.info.review_tpl_id },
      }
      this.$router.push(r)
    },
    /* 接受论文 */
    receiveP() {
      let that = this

      receiveP(that.paperId).then(res => {
        that.$message.success('您已接受论文')
        that.refresh()
      }).catch(err => {
        console.log(err)
      })
    },
    clickReject() {
      this.showReject = true
      this.rejectInfo = {
        reason: '没有时间评阅',
        remark: '',
      }
    },
    /* 拒绝接受 */
    rejectP() {
      let that = this
      let para = {
        ID: that.paperId,
        refuse_reason: this.rejectInfo.reason,
        refuse_remark: this.rejectInfo.remark,
      }

      rejectP(that.paperId, para).then(res => {
        that.$message.success('您已拒绝评议')
        this.showReject = false
        this.refresh()
      }).catch(err => {
        console.log(err)
      })
    },
    reviewOnline() {
      this.viewPDF()
    },
    toReview() {
      let r = {
        name: '资格申请评阅',
        params: { id: this.paperId },
        query: { review_id: this.info.review_id, tpl_id: this.info.review_tpl_id },
      }
      this.$router.push(r)
    },
    clickSubmitReview() {
      this.showCommit = true
    },
    submitReview() {
      let that = this
      submitPaperReview(this.info.review_id).then((res) => {
        that.$message.success('提交成功')
        that.$router.push({ name: '评议列表' })
        this.showCommit = false
      }).catch((err) => {
        that.$message.error('提交错误')
      })
    },
    cancleRegistrationAgreement() {
      // this.showRegistrationAgreement = false
    },
    agreeRegistrationAgreement() {
      let that = this
      pAgreeRegistrationAgreement().then((res) => {
        that.registrationAgreementSuccess = true
        that.regetProfile()
        that.receiveP()
      }).catch((err) => {
        that.$message.error('提交错误')
      })
      // that.showRegistrationAgreement = false
    },
  },
}

</script>

<style lang="scss" scoped>
.agreement-link a {
  color: #409EFF;
}
.professor_price span {
  font-size: 18px;
}
</style>
