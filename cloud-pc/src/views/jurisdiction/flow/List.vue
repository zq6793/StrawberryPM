<template>
  <section class="fx-pages-main examineflow">
    <el-row :gutter="22">
      <el-col :span="8" style="border-right:1px #eeeeee solid;">
        <el-card shadow="hover" class="contents" v-for="item in flowList"
        :key="item.ID" ref="contents">
        <div class="contents-main" @click="flowInfo(item.ID)">
          <h3>{{item.name}}审批流</h3>
        </div>
        <el-button type="text" class="contents-btn" @click="handleEdit(item.ID)">设置</el-button>
        </el-card>
      </el-col>
      <el-col :span="8" :offset="2">
        <h4 class="fx-head-m">{{type}}审批流程</h4>
          <span class="task-flow-begin">开始</span>
        <el-timeline>
          <el-timeline-item v-for="(item, index) in infoList"
          :key="index"
          color="#00AD94"
          >
            <div class="task-flow-position-msg">
              <div class="task-flow-position-head">第{{ (index+1) }}步</div>
              <div class="task-flow-position-msg-body">{{item}}</div>
            </div>
          </el-timeline-item>
        </el-timeline>
        <span class="task-flow-over">结束</span>
      </el-col>
    </el-row>
  </section>
</template>
<script>
import { showTaskStep, taskflowTpl } from '@/api/api'
export default {
  data () {
    return {
      type: '',
      flowList: '',
      infoList: [],
      peopleList: [],
      length: '',
      isStart: false,
      isEnd: false,
      template_id: '',
    }
  },
  created () {
    this.getList()
  },
  mounted () {
  },
  methods: {
    // 获取审批流列表
    getList() {
      let that = this
      taskflowTpl().then((res) => {
        that.flowList = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取审批流程图
    flowInfo (id) {
      let that = this
      showTaskStep(id).then((res) => {
        let getData = res
        that.infoList = []
        getData.forEach(item => {
          let val = ''
          item.positions.map((item2, index) => {
            if (index == 0) {
              val += item2.name
            } else {
              val += '/' + item2.name
            }
          })
          that.infoList.push(val)
        })
        if (that.infoList.length != 0) {
          that.isStart = true
          that.isEnd = true
        } else {
          that.isStart = false
          that.isEnd = false
        }
      }).catch(function (err) {
        console.log(err)
      })
    },
    // 新建
    addFlow () {
      this.$router.push({
        path: '/addflow',
      })
    },
    // 修改
    handleEdit (id) {
      this.$router.push({
        path: '/editflow',
        query: {
          template_id: id,
        },
      })
    },
  },
}
</script>
<style scoped>
  .examineflow .contents{
    /*height: 0px;*/
    margin-top: 5px;
    width: 100%;
    border:0px;
    border-bottom:1px #eeeeee solid;
    line-height: 30px;
    padding-bottom: 10px;
  }
  .examineflow .el-card__body{
    padding: 0px 20px;
  }
  .examineflow .contents .contents-main{
    display: inline-block;
    width: 80%;
     padding:10px 0px;
  }
  .examineflow .contents .contents-btn{
     width: 20%;
     position: relative;
     float: right;
     padding-top:20px;
  }
  .examineflow .contents .contents-main h3 {
    font-weight: 400;
    color: #101010;
    display: inline-block;
    font-size: 14px;
  }
  .contents .contents-main p {
    display: block;
    color: #00a69b;
    font-size: 12px;
    width: 30px;
    float: right;
    }
  .contents .contents-main span {
    color: #606266;
    padding-left: 10px;
    }
  .examineflow .flowtitle{
    height: 40px;
    line-height: 40px;
    font-size:16px;
  }
  .task-flow-position-msg .task-flow-position-head{
    color:#909399;
    line-height: 20px;
  }
  .task-flow-position-msg .task-flow-position-msg-body{
    color:#606266;
  }
  .task-flow-begin{
    display: block;
    position: relative;
    top: 12px;
    color:#E6A23C;
  }
  .task-flow-over{
    display: block;
    position: relative;
    margin-top: -63px;
    color: #F56C6C;
  }
</style>

