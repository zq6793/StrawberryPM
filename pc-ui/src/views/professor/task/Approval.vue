<template>
  <section class="title-page  task-view-page">
    <div class="title">
      审批：您可以查看待您进行审批的工作事项以及您已参与的审批事项，并进行相关审批操作（通过或驳回）。
    </div>
    <el-row :gutter="24">
      <el-col :span="16">
        <el-form class="paper-detail-list">
          <el-row :gutter="20" class="paper-detail-title">
            <el-col :span="4" class="paper-detail-t">论文标题(中文)：</el-col>
            <el-col :span="20" class="paper-detail-m">
              <div class="mess ">
                {{ info.title }}
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="paper-detail-title">
            <el-col :span="4" class="paper-detail-t">论文下载</el-col>
            <el-col :span="20" class="paper-detail-m">
              <el-button @click="download()" size="small">正常版</el-button>
              <el-button @click="download('BLIND')" size="small">盲审版</el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-form ref="form" :model="remark">
          <el-form-item label="审批意见">
            <el-input type="textarea" width="300px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="onAudit('UNAPPROVED')" size="small">驳回</el-button>
            <el-button @click="onAudit('APPROVED')" type="success" size="small">通过</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8" class="task-steps">
        <div style="min-height: 500px;">
          <el-steps direction="vertical" space="100px">
            <el-step icon="." v-for="item in taskSteps" :key="item.seq" :title="'步骤'+item.seq" :description="item.remark">
            </el-step>
          </el-steps>
        </div>
      </el-col>
    </el-row>
  </section>
</template>
<script>
import { getTaskflow, updateTaskflow, downloadPaper, downloadPaperBlind } from '@/api/api'
export default {
  data() {
    return {
      taskRecords: [],
      info: {},
      taskSteps: [],
      currentStepSeq: 0,
      remark: '',
      downloadType: '盲审版',
    }
  },
  computed: {
    taskID() {
      return this.$route.params.id
    },
  },
  mounted() {
    this.getTaskflow()
  },

  methods: {
    getTaskflow() {
      let that = this
      getTaskflow(this.taskID).then(res => {
        that.taskRecords = res.taskflow_records
        that.info = res.task_detail
        that.taskSteps = res.steps
        that.currentStepSeq = res.current_step_seq
      })
    },
    recordRemark(req) {
      if (this.taskRecords.length >= req) {
        return this.taskRecords[req - 1].remark
      }
      return ''
    },
    onAudit(status) {
      let that = this
      let parm = {
        taskflow_id: this.taskID,
        status: status,
        remark: this.remark,
      }
      updateTaskflow(this.taskID, parm).then(res => {
        that.$message({
          message: '提交成功',
          type: 'success',
        })
        that.getTaskflow()
      }).catch(err => {
        console.log(err)
      })
    },
    download(ptype) {
      let that = this
      if (ptype === 'BLIND') {
        this.downloadType = '盲审版'
        downloadPaper(this.info.ID).then(that.toPDF)
      } else {
        this.downloadType = '正式版'
        downloadPaperBlind(this.info.ID).then(that.toPDF)
      }
    },
    toPDF(res) {
      let a = document.createElement('a') // 创建一个<a></a>标签
      let blob = new Blob(
        [res], { type: 'application/pdf;charset=utf-8' },
      ) // 创建一个blob对象
      a.download = `${this.info.title}(${this.downloadType}).pdf` // 文件名称
      a.href = URL.createObjectURL(blob) // response is a blob
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },
  },
}

</script>
