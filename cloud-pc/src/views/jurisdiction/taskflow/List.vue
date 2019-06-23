<template>
  <section class="adjustprice tab-title">
    <el-tabs type="card" v-model="activeName">
      <el-tab-pane label="待我审批" name="first">
        <waitflow ref="oneflow" v-if='activeName=="first"' class="fx-pages-main"></waitflow>
      </el-tab-pane>
      <el-tab-pane label="我发起审批" name="second">
        <meflow ref="twoflow" v-if='activeName=="second"' class="fx-pages-main"></meflow>
      </el-tab-pane>
      <el-tab-pane label="我完成审批" name="third">
        <meoverflow ref="thrflow" v-if='activeName=="third"' class="fx-pages-main"></meoverflow>
      </el-tab-pane>
      <el-tab-pane label="全部审批" name="fourth">
        <allflow ref="fourflow" v-if='activeName=="fourth"' class="fx-pages-main"></allflow>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
<script>
import waitflow from './waitflow.vue'
import meflow from './meflow.vue'
import allflow from './allflow.vue'
import meoverflow from './meoverflow.vue'
import listtaskFlow from '@/api/api'
export default {
  data () {
    return {
      activeName: 'first',
      page: 1,
    }
  },
  components: {
    waitflow,
    meflow,
    allflow,
    meoverflow,
  },
  watch: {
    activeName () {
      this.clearRouteQuery()
    },
  },
  methods: {
    getFlow () {
      listtaskFlow({}).then((res) => {
        let rescode = res.data.rescode
        let that = this
        let getData = res.data.data
        if (rescode == 0) {
          getData.audits.forEach((item) => {
            item.type = that.fxFilter.taskflowType(item.type)
            item.taskflow.status = that.fxFilter.taskflowStatus(item.taskflow.status)
            if (item.taskflow.step) {
              item.taskflow.step.status = that.fxFilter.taskflowStepStatus(item.taskflow.step.status)
            }
          })
          that.flowLists = getData
        }
      }).catch(function (err) {
        console.log(err)
      })
    },
  },

}
</script>
