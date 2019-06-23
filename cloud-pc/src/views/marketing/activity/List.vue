<template>
  <section class="fx-pages-main">
    <!--工具条-->
      <el-form :inline="true" class="fx-table-sort-head">
        <el-form-item size="small">
          <city-store-select :route-query="true" @set="refresh"></city-store-select>
        </el-form-item>
        <el-form-item prop="city" size="small">
          <active-type-select :route-query="true" @set="refresh"></active-type-select>
        </el-form-item>
        <el-form-item class="searchs inputs white-el-select" size="small">
          <text-search :route-query="true" :options="searchOptions" @set="refresh"></text-search>
        </el-form-item>
      </el-form>
    <!--列表-->
    <el-table :data="activityList" highlight-current-row @selection-change="selsChange" v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="name" label="活动名称" width="120">
      </el-table-column>
      <el-table-column prop="type" label="活动类型">
      </el-table-column>
      <el-table-column prop="limit" label="参与限制">
      </el-table-column>
      <el-table-column prop="time" label="活动时间" width="260">
      </el-table-column>
      <el-table-column prop="prize" label="奖品明细">
        <template slot-scope="scope">
          <el-button type="text" @click="look(scope.row)">{{ scope.row.prize}}</el-button>
        </template>
      </el-table-column>
      <!-- store_name -->
      <el-table-column prop="store_name" label="参与门店">
        <template slot-scope="scope">
          <el-button type="text" @click="looks(scope.row)">{{ scope.row.store_name}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="draw" label="中奖/参与" width="100">
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span :class='{activess: (scope.row.status==="进行中") ?true:false}'>{{ scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="user" label="创建人">
      </el-table-column>
      <el-table-column prop="info" label="详情">
        <template slot-scope="scope">
          <el-button type="text" @click="getInfo(scope.$index, scope.row)">
            {{ scope.row.info}}
          </el-button>
        </template>
      </el-table-column>
       <el-table-column prop="info" label="活动统计">
        <template slot-scope="scope">
          <el-buttn type="text" @click="getdataInfo(scope.row)">
            {{ scope.row.info}}
          </el-buttn>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.$index, scope.row)">下架</el-button>
          <el-button type="text" v-if='scope.row.type != "吸粉"' @click="getCode(scope.$index, scope.row)" class="links" :class="{nolinks: scope.row.type == '老带新'|| scope.row.type == '入住送好礼'?true:false}">{{ scope.row.look}}</el-button>
          <el-button v-else @click="getQrcode(scope.$index, scope.row)" type="text" >
            {{ scope.row.look}}
          </el-button>
       <!--    <span size="small" @click="handleEdit(scope.$index, scope.row)" style="padding-left:6px;" class="textchange">下架</span>
          <span v-if='scope.row.type != "吸粉"' @click="getCode(scope.$index, scope.row)" class="links" :class="{nolinks: scope.row.type == '老带新'|| scope.row.type == '入住送好礼'?true:false}">{{ scope.row.look}}</span> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 门店明细 -->
    <el-dialog title="查看" :visible.sync="isShows" width="30%" center class="text">
      <el-form :inline="true">
        <p>门店列表：</p>
        <div class="textbox" style="line-height: 28px;">
          {{store_name}}
        </div>
      </el-form>
    </el-dialog>
    <!-- 奖品明细 -->
    <el-dialog title="查看" :visible.sync="isShow" width="30%" center class="text">
      <el-form :inline="true">
        <p>奖品明细：</p>
        <div class="textbox">
          <p v-for="(item, i) in lookinfo" :key="item.id">
            <span>{{i}}：</span> {{item}}
          </p>
        </div>
      </el-form>
    </el-dialog>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <pagination-select :route-query="true" :total="total" @set="refresh"></pagination-select>
    </el-col>
    <el-dialog title="提示" :visible.sync="codeBox" width="30%" :close-on-click-modal="false" append-to-body class="codeImg">
      <div v-if="isQCode == ''">
        <qriously :value="initQCode" :size="180" />
      </div>
      <div v-else>
        <img :src="url" alt="" style="width:200px; height:200px">
      </div>
      <p>请点击鼠标右键保存二维码</p>
      <button class="tag-read link" :data-clipboard-text="initQCode" @click="copy">复制链接</button>
    </el-dialog>
  </section>
</template>
<script type="text/javascript">
import { CityStoreSelect, TextSearch, PaginationSelect } from '@/components/selects'
import { ActiveTypeSelect } from '@/components/marketing'
import Vue from 'vue'
import VueQriously from 'vue-qriously'
import { listActivity, LowerActivity, activityCode } from '@/api/api'
import Clipboard from 'clipboard'

Vue.use(VueQriously)

export default {
  components: {
    CityStoreSelect,
    TextSearch,
    PaginationSelect,
    ActiveTypeSelect,
  },
  data () {
    return {
      initQCode: '',
      city: '',
      store_id: '',
      store_name: '',
      url: '',
      isQCode: '',
      activityList: [],
      listLoading: false,
      sels: [],
      name: '',
      page: 1,
      total: 0,
      lookinfo: [],
      isShow: false,
      isShows: false,
      codeBox: false,
      islinks: false,
      searchOptions: [
        { label: '活动名称', key: 'activity_name' },
        // { label: '房型特点', key: 'search' },
      ],
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    refresh () {
      this.getActivityList()
    },
    copy () {
      let clipboard = new Clipboard('.tag-read')
      clipboard.on('success', () => {
        this.$message({
          message: '复制成功',
          type: 'success',
        })
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', () => {
        // 不支持复制
        this.$message({
          message: '该浏览器不支持复制',
          type: 'error',
        })
        // 释放内存
        clipboard.destroy()
      })
    },
    /* 吸粉统计 */
    report () {
      this.$router.push({
        path: '/report',
      })
    },

    /* 助力统计 */
    Helplist () {
      this.$router.push({
        path: '/helplist',
      })
    },

    /* 获取活动列表 */
    getActivityList () {
      let that = this
      let para = this.queryOption()
      that.listLoading = true
      listActivity(para).then((res) => {
        let rescode = res.data.rescode
        let getData = res.data.data
        let resmsg = res.data.resmsg
        that.func.portInit(rescode, resmsg, function () {
          getData.list.forEach((item) => {
            item.time = item.start_time + '~' + item.end_time
            item.status = that.statusTre(item.status)
            item.limit = that.numberTre(item.limit)
            item.type = that.func.activetre(item.type)
            item.look = '链接/二维码'
            item.info = '查看'
            if (item.type != '吸粉') {
              item.draw = item.lucky_draw + '/' + item.participate
            } else {
              item.draw = ''
            }

            item.number = item.participate + '/' + item.Lottery_number
          })
          that.activityList = getData.list
          that.total = getData.count
          that.listLoading = false
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
    look (row) {
      let obj = {}
      let objold = {}
      let arr = ['一等奖', '二等奖', '三等奖' ]
      let arrold = ['一季度', '半年', '一年' ]
      this.lookinfo = row.prize.split('/').slice(0, 3)
      for (let key in this.lookinfo) {
        obj[arr[key]] = this.lookinfo[key]
        objold[arrold[key]] = this.lookinfo[key]
      }
      if (row.type == '老带新' || row.type == '入住送好礼') {
        this.lookinfo = objold
      } else {
        this.lookinfo = obj
      }
      this.isShow = true
    },
    looks (row) {
      this.store_name = row.store_name
      this.isShows = true
    },
    statusTre (status) {
      if (status == 'Lowerframe') {
        status = '已下架'
      } else if (status == 'Notbeginning') {
        status = '未开始'
      } else if (status == 'End') {
        status = '已结束'
      } else if (status == 'Normal') {
        status = '进行中'
      }
      return status
    },
    numberTre (limit) {
      if (limit == '1') {
        limit = '一人一次'
      } else if (limit == '2') {
        limit = '一天一次'
      } else if (limit == '3') {
        limit = '一天两次'
      }
      return limit
    },
    /* 搜索 */
    searchJob () {},

    /* 删除 */
    batchRemove () {

    },
    // 修改状态
    handleEdit (index, row) {
      if (row.status == '已下架') {
        this.$message({
          message: '此活动已经下架过了',
          type: 'warning',
        })
      } else {
        let that = this
        that.$confirm('此操作会使活动下架', '提示', {
          type: 'warning',
        }).then(() => {
          that.listLoading = true
          let para = {
            id: row.id,
          }
          LowerActivity(para).then(res => {
            let rescode = res.data.rescode
            let resmsg = res.data.resmsg
            that.func.portInit(rescode, resmsg, function () {
              that.listLoading = false
              that.$message({
                message: '下架成功',
                type: 'success',
              })
              that.getActivityList()
            })
          }).catch(function (err) {
            console.log(err)
          })
        }).catch(function () {
          that.listLoading = false
          that.$message({
            type: 'info',
            message: '已取消下架',
          })
        })
      }
    },
    /* 编辑页面 */
    // 获取二维码
    getCode (index, row) {
      let that = this
      let para = {
        id: row.id,
      }
      this.isQCode = ''
      if (row.type == '老带新' || row.type == '入住送好礼') {
        that.$message({
          message: '该活动无二维码链接',
          type: 'warning',
        })
      } else {
        if (row.status == '未开始') {
          this.$message.error('活动未开始')
        } else if (row.status == '已结束') {
          this.$message.error('活动已结束')
        } else {
          activityCode(para).then((res) => {
            if (res.data.rescode == 0) {
              that.initQCode = 'http://' + res.data.data.url
              that.codeBox = true
            }
          }).catch(function (err) {
            console.log(err)
          })
        }
      }
    },
    getQrcode (index, row) {
      if (row.status == '已下架') {
        this.$message.error('活动已下架')
      } else if (row.status == '已结束') {
        this.$message.error('活动已结束')
      } else if (row.status == '未开始') {
        this.$message.error('活动未开始')
      } else {
        this.isQCode = 'y'
        this.initQCode = row.qrcode_url
        this.url = row.qrcode_url
        this.codeBox = true
      }
    },
    selsChange (sels) {
      this.sels = sels
    },
    // 产看活动详情
    getInfo (index, row) {
      sessionStorage.setItem('page', JSON.stringify(this.page))
      this.$router.push({
        path: '/lookactivity',
        query: {
          id: row.id,
        },
      })
    },
    // 活动统计
    getdataInfo (row) {
      this.$router.push({ path: '/activedata',
        query: {
          id: row.id,
        } })
    },
  },

}
</script>
<style lang="scss" scoped>

</style>
