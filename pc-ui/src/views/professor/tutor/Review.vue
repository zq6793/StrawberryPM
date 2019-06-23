<template>
  <div class="block-tutor">
    <el-form ref="form" :model="reviewForm" :disabled="disabled" label-width="100px">
      <el-form-item label="项目名称">
        <strong>{{info.name}}</strong>
      </el-form-item>
      <el-form-item label="熟悉程度">
        <el-select v-model="reviewForm.familiarity">
          <el-option v-for="item in familiarityOptions" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">
          </el-option>
        </el-select>
        <span>请根据真实感受，选择您自身对此评议的熟悉程度</span>
      </el-form-item>
      <el-form-item label="评审意见">
        <p class="review-content">
          （对申请人的学术水平、培养条件以及培养能力等多方面进行综合评议，并对是否同意申请人具备博士研究生指导教师资格给出意见，可参考
            <a target="_blank" href="https://paperchain.oss-cn-shenzhen.aliyuncs.com/resource/2019-05-29/5cee0962d5bde268.pdf">《陕西师范大学教育博士指导教师岗位管理办法》</a>)
        </p>
        <el-input type="textarea" v-model="reviewForm.overallSuggestion" rows="6" placeholder="请输入至少200个字">
        </el-input>
        <el-checkbox v-model="reviewForm.isPass">同意申请人具备博士研究生指导教师资格</el-checkbox>
      </el-form-item>
      <el-form-item label="评审结果">
        <tutor-score-tag :isPass="reviewForm.isPass"></tutor-score-tag>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="saveReview">保存</el-button>
        <el-button @click="toDetail">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getReviewTemplate, savePaperReview, getPaperReview, pPaperTutorDetail } from '@/api/api'
import { TutorScoreTag } from '@/pcc/reviews'
const paramSeq = '---o---'
export default {
  components: {
    TutorScoreTag,
  },
  props: {
    paper: Object,
  },
  data() {
    return {
      info: {},
      tpl: {},
      minScope: 1,
      familiarityOptions: [{
        value: 'SCANTY',
        label: '一般'
      }, {
        value: 'COMMONLY',
        label: '熟悉'
      }, {
        value: 'HIGHLY',
        label: '非常熟悉'
      }],
      reviewForm: {
        overallSuggestion: '',
        familiarity: 'COMMONLY',
        recommend: false,
        isPass: false,
        params: [],
      },
    }
  },
  computed: {
    disabled() {
      return this.$store.getters.userIdentity != 'professor'
    },
    totalScoreDesc: function () {
      if (this.reviewForm.isPass) {
        return '通过'
      } else {
        return '不通过'
      }
    },
    paperId: function() {
      return parseInt(this.$route.params.id)
    },
    tplId() {
      return parseInt(this.$route.query.tpl_id)
    },
    reviewId() {
      return parseInt(this.$route.query.review_id)
    },
  },
  mounted() {
    // this.loadTpl()
    // this.getPaperReview()
    if (this.paper) {
      this.info = this.paper
      this.reviewForm.overallSuggestion = this.paper.general_opinion
      this.reviewForm.recommend = this.paper.recommend
      this.reviewForm.familiarity = this.paper.familiarity
    } else {
      this.getPaper()
    }
  },
  methods: {
    isGroup: function(row) {
      return row.group == paramSeq
    },
    loadTpl: function() {
      if (!this.tplId) {
        // console.log('ffffff', this.paperId, this.tplId)
        return
      }
      let that = this
      getReviewTemplate(this.tplId).then((res) => {
        this.tpl = res
        let ps = res.parameters
        if (ps.length === 0) {
          return
        }
        let params = []
        let lastGroup = ps[0].group
        for (const i in ps) {
          if (i == 0) {
            params.push({
              group: paramSeq,
              name: lastGroup,
            })
          } else if (ps[i].group != lastGroup) {
            // console.log('push group', i, lastGroup, ps[i].group)
            params.push({
              group: paramSeq,
              name: ps[i].group,
            })
          }
          lastGroup = ps[i].group
          params.push(ps[i])
        }
        that.reviewForm.params = params
        that.getPaperReview()
      }).catch((err) => {
        // console.log('got template failed,', err)
      })
    },
    getPaperReview: function() {
      let that = this
      getPaperReview(this.reviewId).then((res) => {
        for (const p of res) {
          for (const fp of that.reviewForm.params) {
            if (p.ID == fp.ID) {
              fp.value = p.value
            }
          }
        }
      }).catch((err) => {
        console.log('err', err)
      })
    },
    getPaper() {
      let that = this
      pPaperTutorDetail(this.paperId).then((res) => {
        res.status = that.fxFilters.pPaperReviewStatus(res.status)
        res.recommend = that.fxFilters.boolx(res.recommend)
        that.info = res
        if (res.status == '评审中') {
          that.getPaperReview()
        }
        that.reviewForm.familiarity = res.familiarity
        that.reviewForm.overallSuggestion = res.general_opinion
        that.reviewForm.recommend = res.recommend
        if (res.pass == 'PASSED') {
          that.reviewForm.isPass = true
        }
      }).catch((err) => {
        console.log('err', err)
      })
    },
    arraySpanMethod: function({ row, column, rowIndex, columnIndex }) {
      if (this.isGroup(row)) {
        if (columnIndex == 0) {
          return {
            rowspan: 1,
            colspan: 3,
          }
        }
        return {
          rowspan: 0,
          colspan: 0,
        }
      }
    },
    tableRowClassName: function({ row, rowIndex }) {
      if (this.isGroup(row)) {
        return 'group-row'
      }
      return ''
    },
    toDetail: function() {
      this.$router.push({ name: '资格申请概览', params: { id: this.paperId } })
    },
    saveReview: function() {
      let that = this
      if (this.reviewForm.overallSuggestion.length < 200) {
        that.$message.error('评审意见篇幅至少在200个字。')
        return
      }
      let parm = {
        id: this.reviewId,
        paper_id: this.paperId,
        general_opinion: this.reviewForm.overallSuggestion, // 总体意见
        familiarity: this.reviewForm.familiarity, // 熟悉程度
        pass: this.reviewForm.isPass ? 'PASSED' : 'NO_PASS',
        score: this.reviewForm.isPass ? 100 : 0,
        data: [],
      }
      for (const p of this.reviewForm.params) {
        if (!this.isGroup(p)) {
          parm.data.push({ param_id: p.ID, value: parseInt(p.value) })
        }
      }
      // console.log('submit', parm)
      that.$confirm('确认保存修改记录吗？', '提示', {
        type: 'warning',
      }).then(() => {
        savePaperReview(parm).then((res) => {
          console.log(res)
          that.$message.success('保存成功')
          that.toDetail()
          // this.$router.push({ name: '论文评审信息概览', params: { id: this.paperId } })
        }).catch((err) => {
          console.log('err', err)
          that.$message.error('保存失败')
        })
      }).catch((err) => {
        that.$message({
          type: 'info',
          message: '已取消保存',
        })
      })
    },
  },
}

</script>
<style scoped>
.group-row {
  background-color: #f00;
}
.review-content a {
  color: #409EFF;
}
</style>
