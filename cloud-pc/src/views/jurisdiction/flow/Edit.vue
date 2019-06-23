<template>
  <section class="fx-pages-main editflow">
    <h3 class="info-upload-titles">{{names}}</h3>
    <el-form label-width="100px" style="margin:30px 0px 0px 80px;">
      <!-- <p class="initiators">发起人</p> -->
      <el-form-item size="small" v-for="(item, index) in nameList" :key="item.input">
        <span style="position:absolute; left:-110px; color:#48576a">第{{index+1}}步：</span>
        <i class="iconfont icon-ali-jianhao6 del" @click='delName($event)' v-show="(index == stepLength-1)?true:false"></i>
        <editcommon @set='childByValue' :name="item" :index="index"></editcommon>
      </el-form-item>

      <el-form-item>
        <el-button @click="addstep" type="primary" size="small" class="addstep">添加下一步</el-button>
      </el-form-item>
      <el-button @click="submit" type="primary" size="small" class="addflow" v-loading="listLoading">提交</el-button>
    </el-form>
  </section>
</template>
<script>
import editcommon from './editcommon.vue'
import { showPosition, showTaskStep, editTaskFlow } from '@/api/api'
export default {
  data () {
    return {
      name: {},
      index: 0,
      listLoading: false,
      template_id: '',
      peopleList: [],
      nameList: [],
      steps: [],
      stepLength: '',
      type: '',
      names: '',
    }
  },
  components: {
    editcommon,
  },
  created () {
    this.template_id = this.$route.query.template_id
    this.showPosition()
  },
  mounted () {
  },
  updated () {
    this.stepLength = this.nameList.length
  },
  methods: {
    // 展示职位名称
    showPosition () {
      let that = this
      let para = {}
      showPosition(para).then(res => {
        let rescode = res.data.rescode
        let getData = res.data.data
        let resmsg = res.data.resmsg
        that.func.portInit(rescode, resmsg, function () {
          that.peopleList = getData
          that.showTask()
        })
      })
        .catch(function (err) {
          console.log(err)
        })
    },
    // 获取审批流详情
    showTask () {
      let that = this
      that.listLoading = true
      showTaskStep(this.template_id).then((res) => {
        let getData = res
        let arr = []
        getData.forEach(item => {
          let val = []
          item.positions.forEach((item2, index) => {
            val.push(item2.name)
          })
          arr.push(val)
        })
        that.nameList = arr
        that.stepLength = that.nameList.length
        that.listLoading = false
      }).catch(err => {
        console.log(err)
      })
    },
    childByValue (childValue) {
      // 应该是 index 传过来的是什么值 就将其赋给index
      // 这样就可以一只保证其变化了
      // 若是拿到的 数据只有其中一条发生了改变 那么 其他条该如何处理
      // 那么就将其所有的拿过来 然后去在现在的数组里面去找看是否有这一项
      if (childValue.index !== this.index) {
        this.index = childValue.index
        this.name = childValue.id
        this.steps[this.index] = this.name
      } else {
        this.name = childValue.id
        this.steps[this.index] = this.name
      }
    },
    // 点击下一步时将其上一步选中的职位保存起来
    // 问题 ： 每一次都会将上一次的id 覆盖掉
    // push 之前就应该是一个对象了
    addstep () {
      this.nameList.push([])
    },
    // 删除员工
    delName (e) {
      this.$confirm('您确认要删除该步吗', '提示', {
        type: 'warning',
      })
        .then(() => {
          e.path[2].style.display = 'none',
          this.nameList.pop()
          this.steps.pop()
        })
    },
    // 提交审批流
    submit () {
      let that = this
      let para = {
        step_template: that.steps,
      }
      if (that.steps.length < 1) {
        this.$message({
          message: '最少需要添加一步审批',
          type: 'warning',
        })
      } else {
        let flag = 1
        that.steps.forEach((item) => {
          if (item.position_ids == '') {
            flag = 2
            this.$message({
              message: '请完整填写步数信息',
              type: 'warning',
            })
          }
        })
        if (flag == 1) {
          that.$confirm('确认提交审批流吗', '提示', {
            type: 'warning',
          }).then(() => {
            that.listLoading = true
            editTaskFlow(that.template_id, para).then(res => {
              that.listLoading = false
              that.$message({
                message: '提交成功',
                type: 'success',
              })
              that.$router.push({ path: '/examineflow' })
            }).catch(function (err) {
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
      }
    },
  },
}
</script>
