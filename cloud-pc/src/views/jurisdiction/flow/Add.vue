<template>
  <section class="fx-pages-main editflow">
    <div class="title">
      审批流：.
    </div>
    <el-form ref="addStore" label-width="100px" style="margin:30px;  min-width:200px; margin-left: 80px">
      <el-form-item label="名称：" style="width:420px">
        <el-input placeholder="请输入审批流名称" size="small" v-model="addList.name"></el-input>
      </el-form-item>
      <el-form-item label="类别：" class="white-el-select">
        <el-select v-model="addList.type" placeholder="请选择" style="width:320px">
          <el-option v-for="item in typeList" :key="item.type" :label="item.name" :value="item.type" style="background: #fafafa; color: #000; border-radius: 0; border-bottom:1px solid #D8D8D8"></el-option>
        </el-select>
      </el-form-item>
      <p class="initiator">发起人</p>
      <el-form-item class="white-el-select step" v-for="(item, index) in stepList" :key="item.input">
        <span style="position:absolute; left:-110px; color:#48576a">第{{index+1}}步：</span>
        <common @func='childByValue'></common>
      </el-form-item>

      <el-form-item>
        <el-button @click="addstep" type="primary" size="small" class="addstep">添加下一步</el-button>
      </el-form-item>
      <el-button @click="submit" type="primary" size="small" class="addflow" v-loading="listLoading">提交</el-button>
    </el-form>
  </section>
</template>
<script>
import common from '../common.vue'
import { createFlow } from '@/api/api'
export default {
  data () {
    return {
      typeList: [{
        type: 'CHECKOUT',
        name: '退房',
      },
      {
        type: 'CHECKOUT',
        name: '调价',
      },
      {
        type: 'CHECKOUT',
        name: '预约看房',
      },
      ],
      addList: {
        name: '',
        type: '',
        steps: [],
      },
      stepList: [{
        position_ids: '',
      } ],
      name: {},
      index: 0,
      listLoading: false,
    }
  },
  components: {
    common,
  },
  mounted () {},
  methods: {
    childByValue (childValue) {
      this.name = childValue.id
      this.addList.steps[this.index] = this.name
    },
    // 点击下一步时将其上一步选中的职位保存起来
    // 问题 ： 每一次都会将上一次的id 覆盖掉
    // push 之前就应该是一个对象了
    addstep () {
      this.index++
      this.stepList.push({
        dynamicTags: '',
      })
    },
    // 提交审批流
    submit () {
      let that = this
      let para = Object.assign({}, that.addList)
      if (!para.name || !para.type || para.steps.length == 0) {
        this.$message({
          message: '请完整填写表单',
          type: 'warning',
        })
      } else {
        para.steps.forEach(item => {
          if (item.position_ids == '') {
            return this.$message({
              message: '请完整填写表单',
              type: 'warning',
            })
          } else {
            that.$confirm('确认提交审批流吗', '提示', {
              type: 'warning',
            })
              .then(() => {
                that.listLoading = true
                createFlow(para)
                  .then(res => {
                    let rescode = res.data.rescode
                    let resmsg = res.data.resmsg
                    that.func.portInit(rescode, resmsg, function () {
                      that.listLoading = false
                      that.$message({
                        message: '提交成功',
                        type: 'success',
                      })
                      that.$router.push({ path: '/examineflow' })
                    })
                  })
                  .catch(function (err) {
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
      }
    },
  },
}
</script>
