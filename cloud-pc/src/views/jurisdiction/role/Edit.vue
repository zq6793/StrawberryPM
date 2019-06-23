<template>
  <section class="fx-pages-main add-job">
    <!--工具条-->
    <el-form ref="addJob" :model="editJob" label-width="80px" class="addform" :rules="addJobRules">
      <div class="fx-head-m"></div>
      <el-form-item label="职位名称" prop="name" class="name" size="small">
        <el-col :span="4">
          <el-input placeholder="请填写职位名称" v-model="editJob.name"></el-input>
        </el-col>
      </el-form-item>
      <privilege-check :privilege-ids="oldPrivilegeIDs" @set="handleSetPrivilegeIDs"></privilege-check>
      <el-button type="primary" class="add-btn" @click="submit" :loading="listLoading">提交</el-button>
    </el-form>
  </section>
</template>
<script type="text/javascript">
import privilegeCheck from './privilegeCheck'
import { getRole, editRole } from '@/api/api'
export default {
  components: {
    privilegeCheck,
  },
  data () {
    return {
      privilegeIDs: [],
      oldPrivilegeIDs: [],
      editJob: {
        name: '',
        pc_privilege_ids: [],
        id: 0,
      },
      addJobRules: {
        name: [{
          required: true,
          message: '请填写职位名称',
          trigger: 'blur',
        } ],
      },
      listLoading: false,
    }
  },
  created () {
    this.editJob.id = parseInt(this.$route.query.id)
  },
  mounted () {
    // this.showPrivilegedetail()
    this.getPosition()
  },
  methods: {
    handleSetPrivilegeIDs(ids) {
      this.privilegeIDs = ids
    },
    // 获取个人信息
    getPosition () {
      let that = this
      that.listLoading = true
      getRole(that.editJob.id).then(res => {
        that.editJob.name = res.name
        that.oldPrivilegeIDs = res.pc_privilege_ids.split(',').map(Number)
        that.listLoading = false
      }).catch(err => {
        console.log(err)
      })
    },
    // 提交表单
    submit () {
      let that = this
      that.editJob.pc_privilege_ids = that.privilegeIDs.join(',')
      let id = that.editJob.id
      let para = Object.assign({}, that.editJob)
      that.$refs.addJob.validate((valid) => {
        if (valid) {
          that.$confirm('确认提交吗？', '提示', {}).then(() => {
            that.listLoading = true
            editRole(id, para).then(() => {
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
          }).catch(function () {
            that.listLoading = false
            that.$message({
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
