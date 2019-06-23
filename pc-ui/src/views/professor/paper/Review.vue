<template>
  <div class="block-paper">
    <el-form ref="form" :model="reviewForm" :disabled="disabled" label-width="110px">
      <el-form-item label="论文题目">
        <strong>{{info.title}}</strong>
      </el-form-item>
      <el-form-item label="学位类别">
        <strong>{{info.degree_type}}</strong>
      </el-form-item>
      <el-form-item label="熟悉程度">
        <el-select v-model="reviewForm.familiarity">
          <el-option v-for="item in familiarityOptions" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">
          </el-option>
        </el-select>
        <span>请根据真实感受，选择您自身对此论文的熟悉程度</span>
      </el-form-item>
      <el-form-item label="评分内容">
        <el-table :data="reviewForm.params" :span-method="arraySpanMethod" :row-class-name="tableRowClassName">
          <el-table-column label="评分项" prop="name">
          </el-table-column>
          <el-table-column label="评分细则">
            <template slot-scope="scope">
              <p v-for="(item, index) in scope.row.desc" :key="index">{{item}}</p>
            </template>
          </el-table-column>
          <el-table-column label="评分">
            <template slot-scope="scope" v-if="!isGroup(scope.row)">
              <el-input-number :max="scope.row.limit_score" :min="minScope" v-model="scope.row.value">
              </el-input-number>
              (满分{{scope.row.limit_score}}分)
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="评阅意见">
        <el-input type="textarea" v-model="reviewForm.overallSuggestion" rows="6" :placeholder="tpl.placeholder_general_opinion">
        </el-input>
      </el-form-item>
      <el-form-item v-if="tpl.show_amendments" label="存在问题及修改建议">
        <el-input type="textarea" v-model="reviewForm.changeSuggestion" rows="4" :placeholder="tpl.placeholder_amendments">
        </el-input>
      </el-form-item>
      <el-form-item label="">
        <el-checkbox v-if="isExcellent" v-model="reviewForm.recommend">推荐论文此论文参与评优</el-checkbox>
      </el-form-item>
      <el-form-item v-if="tpl.show_score_count" label="总体评价">
        <el-tag v-if="isPass" type="success"><strong>{{totalScore}}分</strong></el-tag>
        <el-tag v-else type="danger"><strong>{{totalScore}}分</strong></el-tag>
      </el-form-item>
      <el-form-item v-if="tpl.absolute_pass" label="是否同意答辩">
        <el-radio-group v-model="reviewForm.pass">
          <el-radio label="PASSED">同意答辩</el-radio>
          <el-radio label="NEED_MODIFY">修改后直接答辩</el-radio>
          <el-radio label="NO_PASS">不同意答辩</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="saveReview">保存</el-button>
        <el-button @click="toDetail">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getReviewTemplate, savePaperReview, getPaperReview, pPaperDetail } from '@/api/api'
const paramSeq = '---o---'
export default {
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
        changeSuggestion: '',
        familiarity: 'COMMONLY',
        recommend: false,
        params: [],
        pass: '',
      },
    }
  },
  computed: {
    disabled() {
      return this.$store.getters.userIdentity != 'professor'
    },
    totalScore() {
      let n = 0
      for (const item of this.reviewForm.params) {
        item.value = parseInt(item.value)
        if (!this.isGroup(item)) {
          n += item.value
        }
      }
      return n
    },
    paperId: function() {
      return parseInt(this.$route.params.id)
    },
    isPass: function() {
      return this.totalScore >= 60
    },
    isExcellent: function() {
      return this.totalScore >= 90
    },
    tplId() {
      return parseInt(this.$route.query.tpl_id)
    },
    reviewId() {
      return parseInt(this.$route.query.review_id)
    },
  },
  mounted() {
    this.loadTpl()
    if (this.paper) {
      this.info = this.paper
      this.reviewForm.overallSuggestion = this.paper.general_opinion
      this.reviewForm.changeSuggestion = this.paper.amendments
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
        console.log('ffffff', this.reviewId, this.tplId)
        return
      }
      let that = this
      getReviewTemplate(this.tplId).then((res) => {
        this.tpl = res
        console.log(this.tpl)
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
            console.log('push group', i, lastGroup, ps[i].group)
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
        console.log('got template failed,', err)
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
      pPaperDetail(this.paperId).then((res) => {
        res.degree_type = that.fxFilters.degreeType(res.degree_type)
        // res.send_time = that.fxFilters.time(res.send_time)
        // res.limit_time = that.fxFilters.countdown(res.limit_time)
        res.status = that.fxFilters.pPaperReviewStatus(res.status)
        res.recommend = that.fxFilters.boolx(res.recommend)
        that.info = res
        if (res.status == '评阅中') {
          that.getPaperReview()
        }
        that.reviewForm.overallSuggestion = res.general_opinion
        that.reviewForm.changeSuggestion = res.amendments
        that.reviewForm.recommend = res.recommend
        that.reviewForm.pass = res.pass
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
      this.$router.push({ name: '论文信息概览', params: { id: this.paperId } })
    },
    saveReview: function() {
      let that = this
      if (this.reviewForm.overallSuggestion.length < 200) {
        that.$message.error('评阅意见篇幅至少在200个字。')
        return
      }
      if (this.reviewForm.changeSuggestion.length < 50) {
        that.$message.error('评阅修改建议篇幅至少在50个字。')
        return
      }
      // this.reviewForm.changeSuggestion
      let parm = {
        paper_id: this.reviewId,
        id: this.reviewId,
        general_opinion: this.reviewForm.overallSuggestion, // 总体意见
        amendments: this.reviewForm.changeSuggestion, // 修改意见
        familiarity: this.reviewForm.familiarity, // 熟悉程度
        recommend: this.isExcellent && this.reviewForm.recommend, // 是否推荐优秀
        pass: this.isPass ? 'PASSED' : 'NO_PASS',
        data: [],
      }
      if (this.tpl.absolute_pass) {
        if (this.reviewForm.pass == '') {
          that.$message.error('请选择是否同意答辩')
          return
        }
        parm.pass = this.reviewForm.pass
      }
      for (const p of this.reviewForm.params) {
        if (!this.isGroup(p)) {
          parm.data.push({ param_id: p.ID, value: parseInt(p.value) })
        }
      }
      console.log('submit', parm)
      that.$confirm('确认保存修改记录吗？', '提示', {
        type: 'warning',
      }).then(() => {
        savePaperReview(parm).then((res) => {
          console.log(res)
          that.$message.success('保存成功')
          that.toDetail()
          // this.$router.push({ name: '论文评阅信息概览', params: { id: this.reviewId } })
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

</style>
