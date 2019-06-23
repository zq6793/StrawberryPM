<template>
  <el-form ref="form" :model="form" label-width="110px">
    <el-form-item label="任职学校">
      <school-select :u_id="profile.university_id" @set="handleSetSchool"></school-select>
    </el-form-item>
    <el-form-item label="导师类别">
      <job-title-select :value="profile.job_title" @set="handleSetJobTitle"></job-title-select>
    </el-form-item>
    <el-form-item label="专业技术职务">
      <professional-title-select :value="profile.professional_title" @set="handleSetProfTitle"></professional-title-select>
    </el-form-item>
    <el-form-item label="学历">
      <education-select :value="profile.education" @set="handleSetEducation"></education-select>
    </el-form-item>
    <el-form-item label="研究方向">
      <el-tag
        :key="tag"
        v-for="tag in directionTags"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)">
        {{tag}}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="directionInputVisible"
        v-model="directionInput"
        ref="saveTagInput"
        size="small"
        placeholder="回车添加新的研究方向"
        @keyup.enter.native="handleInputConfirm"
      >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showDirectionInput">+ 添加</el-button>
    </el-form-item>
    <el-form-item label="涉及学科" class="white-el-select btn-add">
      <el-tag class="subject-tag"
        :key="index"
        v-for="(tag, index) in subjectTags"
        closable
        :disable-transitions="false"
        @close="handleCloseSubject(index)">
        {{tag.label}}
      </el-tag>
      <subject-select @set="handleSetSubject"></subject-select>
      <el-button @click="addSubject" type="primary" size="small">添加</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit" :disabled="disabledSubmit">保存</el-button>
      <el-button @click="cancleSubmit">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { subjectSelect, schoolSelect } from '@/components/selects'
import { jobTitleSelect, professionalTitleSelect, educationSelect } from '@/components/professor'
import { pUpdateSubjectInfo } from '@/api/api'

export default {
  components: {
    subjectSelect,
    schoolSelect,
    jobTitleSelect,
    professionalTitleSelect,
    educationSelect,
  },
  props: {
    profile: Object,
  },
  data() {
    return {
      info: {},
      disabledSubmit: true,
      directionTags: [],
      directionInputVisible: false,
      directionInput: '',
      subjectTags: [],
      selectedSubject: {},
      form: {
        direction: '',
        subjects: [],
      },
    }
  },
  computed: {
    allSubjectTree() {
      return this.$store.getters.subjectsTree
    },
    allSubjectList() {
      return this.$store.getters.subjectsList
    },
  },
  watch: {
    profile () {
      this.reload()
    }
  },
  methods: {
    reload () {
      this.directionTags = []
      if (this.profile.direction) {
        for (const str of this.profile.direction.split(',')) {
          if (str) {
            this.directionTags.push(str)
          }
        }
      }
      this.subjectTags = []
      for (const item of this.profile.subjects) {
        item.label = '(' + item.level2_number + ')' + item.level2_name
        item.name = item.level2_name
        this.subjectTags.push(item)
      }
      this.disabledSubmit = true
    },
    handleSetJobTitle(val) {
      this.disabledSubmit = false
      this.form.job_title = val
    },
    handleSetProfTitle(val) {
      this.disabledSubmit = false
      this.form.professional_title = val
    },
    handleSetEducation(val) {
      this.disabledSubmit = false
      this.form.education = val
    },
    handleSetSubject(id, sbj) {
      this.disabledSubmit = false
      this.selectedSubject = sbj
    },
    cancleSubmit() {
      this.reload()
    },
    addSubject() {
      let sbj = this.selectedSubject
      if (!sbj.ID) {
        return
      }
      let exists = false
      this.subjectTags.forEach(values => {
        if (values.ID == sbj.ID) {
          exists = true
        }
      })
      if (!exists) {
        this.subjectTags.push(sbj)
      }
      this.selectedSubject = {}
      this.disabledSubmit = false
    },
    handleCloseSubject(index) {
      this.subjectTags.splice(index, 1)
      this.disabledSubmit = false
    },
    handleClose(tag) {
      this.directionTags.splice(this.directionTags.indexOf(tag), 1)
      this.disabledSubmit = false
    },
    showDirectionInput() {
      this.directionInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
      this.disabledSubmit = false
    },
    handleInputConfirm() {
      let inputValue = this.directionInput
      if (inputValue) {
        this.directionTags.push(inputValue)
      }
      this.directionInputVisible = false
      this.disabledSubmit = false
      this.directionInput = ''
    },
    onSubmit () {
      let that = this
      let form = this.form
      for (const item of this.subjectTags) {
        form.subjects.push(item.ID)
      }
      form.direction = this.directionTags.join(',')
      pUpdateSubjectInfo(form).then((res) => {
        that.$message({
          type: 'success',
          message: '更新成功',
        })
      }).catch((err) => {
        that.$message({
          type: 'error',
          message: '更新出错',
        })
      })
    },
  },
}
</script>
