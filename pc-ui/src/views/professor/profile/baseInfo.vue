<template>
  <el-form ref="form" :model="form" label-width="110px">
    <el-form-item label="用户姓名">
      <el-input v-model="form.name" :disabled="!edit"></el-input>
    </el-form-item>
    <el-form-item label="手机">
      <el-input v-model="form.phone" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model="form.email" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item v-if="edit">
      <el-button type="success" @click="onSubmit">保存</el-button>
      <el-button @click="cancleEdit">取消</el-button>
    </el-form-item>
    <el-form-item v-else>
      <!-- <el-button type="primary" @click="openEdit">编辑</el-button> -->
    </el-form-item>
  </el-form>
</template>

<script>
// import { schoolSelect } from '@/components/selects'
import { pUpdateGeneralInfo } from '@/api/api'
export default {
  components: {
    // schoolSelect,
  },
  props: {
    profile: Object,
  },
  data() {
    return {
      edit: false,
      form: {},
    }
  },
  watch: {
    profile () {
      this.form = this.profile
    }
  },
  mounted() {
  },
  methods: {
    handleSetSchool(id) {
      this.form.university_id = id
    },
    openEdit () {
      this.edit = true
      this.form.name = this.profile.name
    },
    cancleEdit () {
      this.edit = false
      this.form.name = this.profile.name
    },
    onSubmit () {
      let that = this
      console.log('commmmit', this.form)
      pUpdateGeneralInfo(this.form).then((res) => {
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
