<template>
  <section class="fx-pages-main addClassification">
    <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="100px" style="padding:20px;width:40%;min-width:600px;" class="white-el-select">
      <el-form-item label="分类名称:" prop='name'>
        <el-input placeholder="请输入需要添加的分类名称" v-model='addForm.name'></el-input>
      </el-form-item>
      <el-form-item label="是否显示" prop="is_show">
        <el-radio-group v-model='addForm.is_show'>
          <el-radio class="radio" :label="0">显示</el-radio>
          <el-radio class="radio" :label="1">不显示</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序:" prop='sort'>
        <el-input placeholder="请输入该类型的排序" v-model='addForm.sort'></el-input>
      </el-form-item>
      <el-button type="primary" @click="submit" :loading="addLoading" class="add-btn">提交</el-button>
    </el-form>
  </section>
</template>
<script>
import { addCategory } from '@/api/api'
export default {
  data () {
    return {
      addForm: {
        name: '',
        is_show: '',
        sort: '',
      },
      addFormRules: {
        name: [{ required: true, message: '请输入要添加的分类名称', trigger: 'blur' } ],
        sort: [{ required: true, message: '请输入该类型排序', trigger: 'blur' } ],
      },
      addLoading: false,
    }
  },
  methods: {
    /* 提交 */
    submit () {
      let that = this
      that.$refs.addForm.validate(valid => {
        if (valid) {
          that.$confirm('确认提交吗？', '提示', {}).then(() => {
            that.addLoading = true
            let para = Object.assign({}, that.addForm)
            para.is_show = (para.is_show === 0) ? 'Y' : 'N'
            addCategory(para).then(res => {
              let rescode = res.data.rescode
              let resmsg = res.data.resmsg
              that.func.portInit(rescode, resmsg, function () {
                that.addLoading = false
                that.$message({
                  message: '提交成功',
                  type: 'success',
                })
                that.$refs['addForm'].resetFields()
                that.$router.push({ path: '/classification' })
              })
            }).catch(function (err) {
              console.log(err)
            })
          }).catch(() => {
            that.addLoading = false
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
