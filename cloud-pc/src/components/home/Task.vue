<template>
  <div class="head-navbar-item head-navbar-tips task-tips">
  <el-dropdown trigger="hover" show-timeout='0' hide-timeout='500' @command="handleCommand">
    <span class="el-dropdown-link userinfo-inner twonav">
      <i class="iconfont icon-ali-lingdang"></i>
      <span class="sign" v-show="flowLists.count !=0">
        {{flowLists.count}}
      </span>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="" class="flowtitle"  @click="allInfo">
          <em class="flowtitle-l">当前有{{flowLists.count}}个未处理的任务</em>
          <em class="flowtitle-l">查看全部<i class="iconfont icon-ali-jiantou_xiangyouliangci"></i></em>
      </el-dropdown-item>
      <el-dropdown-item class="flowtext" v-for="item in flowLists.items" :key="item.id" :command="item">
        <h5>
          <em>{{item.taskflow.type}}审批 {{item.taskflow.name}}</em>
          <span>{{item.taskflow.status}}</span>
        </h5>
        <p>更新于&nbsp;{{item.taskflow.UpdatedAt}}</p>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
  <!-- <span class="navspan spantext" @mouseenter="enter" @mouseleave="leave">
    <i class="iconfont icon-ali-lingdang"></i>
    <span class="sign" v-show="flowLists.count !=0">
      {{flowLists.count}}
    </span>
    <div class="taskbox" :class="{isactive: isActive}" @mouseenter="enter" @mouseleave="leave">
      <div class="flowtitle">
        <span>当前有{{flowLists.count}}个未处理的任务</span>
        <span @click="allInfo"> <i class="iconfont icon-ali-jiantou_xiangyouliangci"></i>查看全部</span>
      </div>

      <div class="flowtext" v-for="(item,i) in flowLists.audits" :key="item.id" v-if="i <= 5">
        <div class="flowinfo" @click="lookmeFlow(item)">
          <h5>
            {{item.type}}审批 {{item.taskflow.store.name}}<span>{{item.taskflow.status}}</span>
          </h5>
          <p>更新于&nbsp;{{item.updated_at}}</p>
        </div>
      </div>
    </div>
  </span> -->
</div>
</template>

<script>
import { listFormBeing } from '@/api/api'
export default {
  data () {
    return {
      isActive: true,
      allTask: '',
      flowLists: {},
    }
  },
  mounted () {
    listFormBeing({}).then((res) => {
      let that = this
      let getData = res.data
      console.log(getData)
      getData.items.forEach((item) => {
        item.taskflow.type = that.fxFilter.taskflowType(item.taskflow.type)
        item.taskflow.status = that.fxFilter.taskflowStatus(item.taskflow.status)
        item.taskflow.UpdatedAt = that.fxFilter.goTime(item.taskflow.UpdatedAt)
        if (item.taskflow.step) {
          item.taskflow.step.status = that.fxFilter.taskflowStepStatus(item.taskflow.step.status)
        }
      })
      that.flowLists = getData
    }).catch(function (err) {
      console.log(err)
    })
  },
  methods: {
    // 查看待我审批
    lookmeFlow (item) {
      if (item.type == '正常退房' || item.type == '特殊退房' || item.type == '违约退房' || item.type == '换房') {
        this.$router.push({
          path: '/checkoutflow',
          query: {
            id: item.taskflow.id,
            name: 'wait',
          },
        })
      } else if (item.type == '调价') {
        this.$router.push({
          path: '/adjustflow',
          query: {
            id: item.taskflow.id,
            name: 'wait',
          },
        })
      } else if (item.type == '预约看房') {
        this.$router.push({ path: '/reservationorder' })
      } else if (item.type == '服务订单') {
        this.$router.push({ path: '/serviceorder' })
      }
    },
    enter () {
      this.isActive = false
    },
    leave () {
      this.isActive = true
    },
    allInfo () {
      this.$router.push({ path: '/examine' })
    },
    handleCommand (command) {
      if (command === '') {
        this.allInfo()
        return
      }
      this.lookmeFlow(command)
    },
  },
}
</script>
<style scoped>
.flowtitle {
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #eeeeee;
    font-size:14px;
    font-weight: 100px;
  }
.task-tips .flowtext h5 {
  padding-top: 6px;
  display: block;
  justify-content: space-between;
}
.flowtext h5 em{
  text-align: left;
  font-size: 13px;
}
.flowtext h5 span {
    color: #e51c23;
    text-align: right;
    font-size:13px;
}
.flowtext p {
    margin-top: -10px;
    font-size: 12px;
    color: #9999a1;
}
.task-tips .sign{
    position: absolute;
    top: 5px;
    min-width: 20px;
    height: 14px;
    background: #f19114;
    font-size: 12px;
    text-align: center;
    line-height: 14px;
    border-radius: 2px;
    color: #ffffff;
}
</style>
