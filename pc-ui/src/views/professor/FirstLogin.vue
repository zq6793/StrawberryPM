<template>
  <el-row class="login-page">
    <el-col :span="6">
      <span>.</span>
    </el-col>
    <el-col :span="12">
      <div class="herder">
        <div class="index-logoimg">
          <img src='./../../assets/img/logo1.png' />
        </div>
      </div>
      <div class="logo-container">
        <div class="thank-title">
          <p>
            <strong>感谢</strong>您对学位及研究生教育的支持。请确认您相关信息，以便能准确进行论文推送
          </p>
        </div>
        <el-form label-width="75px" height="80px">
          <el-form-item label="专家姓名">
            <el-input v-model="info.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="任职高校">
            <el-select v-model="info.university_id" filterable remote reserve-keyword placeholder="请选择学校" :remote-method="searchSchool">
              <el-option v-for="item in schoolSearchList" :key="item.ID" :label="item.name" :value="item.ID">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职称">
            <job-title-select :value="info.job_title" @set="handleSetProJobTitle"></job-title-select>
          </el-form-item>
          <el-form-item label="研究方向">
            <el-tag
              :key="tag"
              v-for="(tag,index) in directionTags"
              closable
              :disable-transitions="false"
              @close="handleCloseDirection(index)">
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="directionInputVisible"
              v-model="directionInput"
              ref="saveTagInput"
              @keyup.enter.native="handleInputDirection">
            </el-input>
            <el-button v-else class="button-new-tag" @click="showDirectionInput">+ 添加</el-button>
          </el-form-item>
          <el-form-item label="涉及学科" class="white-el-select btn-add">
            <el-tag
              :key="index"
              v-for="(tag, index) in subjectTags"
              closable
              :disable-transitions="false"
              @close="handleCloseSubject(index)">
              {{tag.label}}
            </el-tag>
            <subject-select @set="handleSetSubject"></subject-select>
            <el-button @click="addSubject" class="button-new-tag">+ 添加</el-button>
            <br>
          </el-form-item>
          <el-form-item label="绑定手机">
            <input type="tel" placeholder="请输入手机号" v-model="info.phone" autocomplete="off">
            <input type="tel" placeholder="验证码" v-model="info.code" @keyup.enter="loginent">
            <span class="code" @click="getCode" v-show="sendAuthCode" style="color:#00a69b">{{repeatsend}}</span>
            <span class="code" v-show="!sendAuthCode"> {{ countdown }} s后重新发送</span>
          </el-form-item>
          <el-button type="primary" @click="firstLogin" class="button">进 入</el-button>
        </el-form>
      </div>
      <footer>Copyright 2018 汇文数据 版权所有 陕ICP备19001216号</footer>
      <invite-info></invite-info>
    </el-col>
  </el-row>
</template>

<script>
import InviteInfo from '@/components/common/InviteInfo'
import {
  subjectSelect,
  // facultySelect,
  jobTitleSelect } from '@/components/selects'
import { loginInviteToken, getCode, searchSchool, pUpdateGeneralInfo } from '@/api/api'
export default {
  components: {
    subjectSelect,
    // facultySelect,
    jobTitleSelect,
    InviteInfo,
  },
  data() {
    return {
      info: {
        university_id: 0,
      },
      schoolSearchList: [],
      directionInput: '',
      directionInputVisible: false,
      directionTags: [],
      subjectTags: [],
      selectedSubject: {},
      sendAuthCode: true,
      countdown: 0, // 计时器的初始值
      repeatsend: '获取验证码',
    }
  },
  computed: {
    inviteToken() {
      return this.$route.query.token
    },
    professor() {
      return this.$store.getters.professor
    },
  },
  mounted() {
    this.getProfile()
  },
  watch: {
    professor() {
      this.info = this.professor
      if (this.professor.direction) {
        this.directionTags = this.professor.direction.split(',')
      }
      if (this.professor.subjects) {
        for (const item of this.professor.subjects) {
          item.label = '(' + item.level2_number + ')' + item.level2_name
          item.name = item.level2_name
          this.subjectTags.push(item)
        }
      }
      this.schoolSearchList = [{
        name: this.professor.university_name,
        ID: this.professor.university_id,
      }]
    }
  },
  methods: {
    handleSetProJobTitle(val) {
      this.info.job_title = val
    },
    handleInputDirection(val) {
      this.directionTags.push(this.directionInput)
      this.directionInput = ''
      this.directionInputVisible = false
    },
    showDirectionInput(val) {
      this.directionInputVisible = true
      console.log('asdfasdfasd', val)
    },
    handleCloseDirection(index) {
      this.directionTags.splice(index, 1)
    },
    handleCloseSubject(index) {
      this.subjectTags.splice(index, 1)
    },
    handleSetSubject(id, sbj) {
      this.selectedSubject = sbj
    },
    getProfile() {
      loginInviteToken(this.inviteToken).then((res) => {
        this.$store.dispatch('setProfessorProfile', res)
      }).catch((err) => {
        console.log('err', err)
      })
    },
    searchSchool(queryString) {
      if (queryString == '') {
        this.schoolSearchList = []
        return
      }
      let that = this
      let para = {
        name: queryString,
        limit: 8,
      }

      searchSchool(para).then(res => {
        that.schoolSearchList = res
      }).catch(err => {
        console.log(err)
      })
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
    },
    firstLogin() {
      let that = this
      let para = {
        direction: this.directionTags.join(','),
        job_title: this.info.job_title,
        phone: this.info.phone,
        code: this.info.code,
        university_id: this.info.university_id,
        subjects: this.subjectTags,
      }
      console.log('pppparpap', para)
      pUpdateGeneralInfo(para).then((res) => {
        that.$message({
          message: '登录成功',
          type: 'success',
        })
        this.$route.push({ path: '/professor' })
      }).catch((err) => {
        that.$message({
          message: 'err',
          type: 'error',
        })
      })
    },
    /* 获取验证码 */
    getCode() {
      let that = this
      let para = { phone: this.info.phone }

      if (!para.phone) {
        that.$message({
          message: '请输入手机号',
          type: 'warning',
        })
      } else {
        getCode(para).then(res => {
          if (res === '') {
            that.$message.success('验证码已发送请注意查收')
            that.sendAuthCode = false
            that.countdown = 60
            let time = setInterval(() => {
              that.countdown--
              if (that.countdown <= 0) {
                that.sendAuthCode = true
                that.repeatsend = '重发'
                clearInterval(time)
              }
            }, 1000)
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.thank-title {
  font-size: 20px;
}
.el-form {
  .el-form-item {
    margin-bottom: 0px;
  }
}
</style>
