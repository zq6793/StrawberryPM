<template>
  <section class="fx-pages-main add-job">
    <!--工具条-->
    <el-form ref="addJob" :model="addJob" label-width="100px" :rules="addJobRules">
      <div class="fx-head-m">角色信息</div>
      <el-form-item label="角色名称" prop="name" class="name" size="small">
        <el-col :span="4">
        <el-input placeholder="请填写角色名称" v-model="addJob.name"></el-input>
      </el-col>
      </el-form-item>
      <privilege-check @set="handleSetPrivilegeIDs"></privilege-check>
      <el-form-item label="" size="small">
        <el-button type="primary" class="add-btn" @click="submit" :loading="listLoading">提交</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>
<script type="text/javascript">
import privilegeCheck from './privilegeCheck'
import { addRole } from '@/api/api'
export default {
  components: {
    privilegeCheck,
  },
  data () {
    return {
      privilegeIDs: [],
      addJob: {
        name: '',
        pc_privilege_ids: [],
      },
      listLoading: false,
    }
  },
  methods: {
    handleSetPrivilegeIDs (ids) {
      this.privilegeIDs = ids
    },

    submit () {
      let that = this
      that.addJob.pc_privilege_ids = this.privilegeIDs.join(',')
      let para = Object.assign({}, that.addJob)
      that.$refs.addJob.validate((valid) => {
        if (valid) {
          that.$confirm('确认提交吗？', '提示', {}).then(() => {
            that.listLoading = true
            addRole(para).then(() => {
              that.$message({
                message: '提交成功',
                type: 'success',
              })
              that.$refs['addJob'].resetFields()
              that.$router.push({
                path: '/jobmanagement',
              })
            }).catch(err => {
              console.log(err)
            })
          }).catch(() => {
            that.listLoading = false
            this.$message({
              type: 'info',
              message: '已取消提交',
            })
          })
        }
      })
    },
  },
}
</script>
