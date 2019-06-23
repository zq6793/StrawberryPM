<template>
  <section class="title-page paper-detail block-paper">
    <el-row :gutter="20">
      <el-col :span="18" :offset="1" class="std-btn">
        <el-button type="success" v-if="enableReceive" @click="receiveP">接受评阅</el-button>
        <el-button type="danger" v-if="enableReceive" @click="clickReject">放弃评阅</el-button>
        <button type="button" class="el-button el-button--primary" v-if="enableReview">
          <span><a :href="downloadPaperURL">下载论文</a></span>
        </button>
        <el-button type="primary" v-if="enableReview" @click="reviewOnline">在线查看</el-button>
        <el-button type="success" v-if="enableReview" @click="toReview">继续评阅</el-button>
        <el-button type="success" v-if="enableSubmit" @click="clickSubmitReview">提交评阅</el-button>
      </el-col>
    </el-row>
    <el-form class="paper-detail-list alltable">
      <el-row :gutter="20" class="paper-detail-title">
        <el-col :span="4" class="paper-detail-t">论文标题(中文)：</el-col>
        <el-col :span="20" class="paper-detail-m">
          <div class="mess ">
            {{ info.title }}
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="paper-detail-title">
        <el-col :span="4" class="paper-detail-t">论文标题(其它语言)：</el-col>
        <el-col :span="20" class="paper-detail-m">
          <div class="mess ">
            {{ info.title_other }}
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="paper-detail-title">
        <el-col :span="4" class="paper-detail-t">论文关键词:</el-col>
        <el-col :span="20" class="paper-detail-m">
          <div class="mess">
            {{ info.key_words }}
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="paper-detail-title">
        <el-col :span="4" class="paper-detail-t">论文关键词(其它语言):</el-col>
        <el-col :span="20" class="paper-detail-m">
          <div class="mess">
            {{ info.key_words_other }}
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="paper-detail-message">
        <el-col :span="4" class="paper-detail-t">论文摘要:(中文)</el-col>
        <el-col :span="20" class="paper-detail-m">
          <div class="mess ">
            {{ info.summary }}
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="paper-detail-message">
        <el-col :span="4" class="paper-detail-t">论文摘要:(其它语言)</el-col>
        <el-col :span="20" class="paper-detail-m">
          <div class="mess ">
            {{ info.summary_other }}
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
    <el-form v-if="isShow == false" ref="addPaperde" :model="addPaperde" :rules="addRules" label-width="180px" class="demo-ruleForm alltable">
      <el-form-item label="论文标题（中文）：" prop="title">
        <el-input type="text" v-model="addPaperde.title"></el-input>
      </el-form-item>
      <el-form-item label="论文标题（其他语言）：" prop="title_other">
        <el-input type="text" v-model="addPaperde.title_other"></el-input>
      </el-form-item>
      <el-form-item label="涉及的研究方向：" prop="direction">
        <el-input type="text" v-model="addPaperde.direction"></el-input>
      </el-form-item>
      <el-form-item label="第一导师：" prop="teacher_id">
        <el-select placeholder="请选择导师" size="small" v-model="addPaperde.teacher_id" @change="searchProvince">
          <el-option v-for="item in tutor" :key="item.name" :label="item.name" :value="item.ID" style="background: #fafafa; color: #000; border-radius: 0; border-bottom:1px solid #D8D8D8"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="导师研究方向：">
        <el-tag :key="tag" v-for="tag in direction" closable :disable-transitions="false" @close="tagClose(tag,direction)">
          {{tag}}
        </el-tag>
        <el-input class="input-new-tag" v-model="directionV" size="small" @keyup.enter="inputConfirm(directionV,direction)" placeholder="添加关键字"></el-input>
        <el-button class="button-new-tag" size="small" @click="inputConfirm(directionV,direction)">添加</el-button>
      </el-form-item>
      <el-form-item label="正式论文上传：" class="upload" prop="title">
        <el-input class="input_inner" placeholder="请上传文件" v-loading="loading2" element-loading-spinner="el-icon-loading" size="small" v-model="addPaperde.draft"></el-input>
        <input type="file" class="digadd" style="opacity: 1; background: #fff" @change="uploadPDF" />
        <div class="tipText">格式为PDF</div>
      </el-form-item>
      <el-form-item label="盲审论文上传：" class="upload" prop="title">
        <el-input class="input_inner" placeholder="请上传文件" size="small" v-loading="loading3" element-loading-spinner="el-icon-loading" v-model="addPaperde.draft"></el-input>
        <input type="file" class="digadd" style="opacity: 1; background: #fff" @change="uploadBlindPDF" />
        <div class="tipText">格式为PDF，同时需删除个人信息、导师信息、高校信息、致谢部分，如因未删除信息，导致盲审失败，自行承担责任。</div>
      </el-form-item>
      <!-- 关键词 -->
      <el-form-item label="关键词（中文）：">
        <el-tag :key="tag" v-for="tag in keyWordCTag" closable :disable-transitions="false" @close="tagClose(tag,keyWordCTag)">
          {{tag}}
        </el-tag>
        <el-input class="input-new-tag" v-model="keyWordC" size="small" @keyup.enter="inputConfirm(keyWordC,keyWordCTag)" placeholder="添加关键字"></el-input>
        <el-button class="button-new-tag" size="small" @click="inputConfirm(keyWordC,keyWordCTag)">添加</el-button>
      </el-form-item>
      <el-form-item label="关键词（其它语言）：">
        <el-tag :key="tag" v-for="tag in keyWordETag" closable :disable-transitions="false" @close="tagClose(tag,keyWordETag)">
          {{tag}}
        </el-tag>
        <el-input class="input-new-tag" v-model="keyWordE" size="small" @keyup.enter="inputConfirm(keyWordE,keyWordETag)" placeholder="添加关键字"></el-input>
        <el-button class="button-new-tag" size="small" @click="inputConfirm(keyWordE,keyWordETag)">添加</el-button>
      </el-form-item>
      <!-- 摘要 -->
      <el-form-item label="论文摘要：(中文)" prop="summary">
        <el-input type="textarea" v-model="addPaperde.summary" :autosize="{ minRows: 6, maxRows: 8}"></el-input>
      </el-form-item>
      <el-form-item label="论文摘要（其它语言）" prop="summary_other">
        <el-input type="textarea" v-model="addPaperde.summary_other" :autosize="{ minRows: 6, maxRows: 8}"></el-input>
      </el-form-item>
    </el-form>

    <el-dialog
      title="论文提交"
      :visible.sync="showCommit"
      center>
      {{withdrawMsg}}
      <el-form label-width="120px" v-if="showCommit" label-position="top">
        <el-form-item label="评阅意见">
          <el-input disabled="true" type="textarea" v-model="info.general_opinion" rows="6">
          </el-input>
        </el-form-item>
        <el-form-item label="存在问题及修改建议">
          <el-input disabled="true" type="textarea" v-model="info.amendments" rows="4">
          </el-input>
        </el-form-item>
        <el-form-item label="总体评价">
          <el-tag v-if="info.score>=60" type="success"><strong>{{info.score}}分</strong> </el-tag>
          <el-tag v-else type="danger"><strong>{{info.score}}分</strong> </el-tag>
          <el-tag v-if="info.pass=='PASSED'" type="info">同意答辩</el-tag>
          <el-tag v-else-if="info.pass=='NEED_MODIFY'" type="info">修改后直接答辩</el-tag>
          <el-tag v-else type="info">不同意答辩</el-tag>
        </el-form-item>
        <el-form-item>
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
  pPaperDetail,
  receiveP,
  rejectP,
  downloadPaperBlindURL,
  getPaperReview,
  submitPaperReview,
  pAgreeRegistrationAgreement,
} from '@/api/api'
// import RegistrationAgreement from './RegistrationAgreement'
export default {
  components: {
    // RegistrationAgreement,
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
    isAgreeRegistrationAgreement() {
      return this.$store.getters.pIsAgreeRegistrationAgreement
    },
    downloadPaperURL() {
      return downloadPaperBlindURL(this.paperId)
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
      pPaperDetail(this.paperId).then((res) => {
        res.degree_type = that.fxFilters.degreeType(res.degree_type)
        // res.send_time = that.fxFilters.time(res.send_time)
        // res.limit_time = that.fxFilters.countdown(res.limit_time)
        res.review_status = that.fxFilters.pPaperReviewStatus(res.review_status)
        res.recommend = that.fxFilters.boolx(res.recommend)
        that.info = res
        if (res.review_status == '评阅中') {
          that.getPaperReview(res.review_id)
        }
      }).catch((err) => {
        console.log('err', err)
      })
    },
    getPaperReview(reviewId) {
      let that = this
      getPaperReview(reviewId).then((res) => {
        if (res && res.length > 0) {
          that.enableSubmit = true
        }
      }).catch((err) => {
        console.log('err', err)
      })
    },
    viewPDF() {
      let r = {
        name: '论文PDF浏览',
        params: { id: this.paperId },
        query: { review_id: this.info.review_id, tpl_id: this.info.review_tpl_id },
      }
      this.$router.push(r)
    },
    /* 接受论文 */
    receiveP() {
      // if (!this.isAgreeRegistrationAgreement && !this.registrationAgreementSuccess) {
      //   this.showRegistrationAgreement = true
      //   return
      // }
      let that = this

      receiveP(that.paperId).then(res => {
        that.$message.success('您已接受论文')
        that.refresh()
        // that.viewPDF()
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
        that.$message.success('您已拒绝论文')
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
        name: '论文评阅',
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
