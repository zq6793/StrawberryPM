<template>
  <el-form :inline="true" class="meflow">
    <el-form-item label="所属城市" prop="city">
      <el-select v-model="city" placeholder="请选择" size="small" @change="searchCity" style="color:#fff">
        <el-option v-for="item in cityList" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="门店名称" class="select">
      <el-select v-model="store_id" placeholder="请选择" size="small" @change="searchName">
        <el-option v-for="item in storesList" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="审批类目" prop="city">
      <el-select v-model="type" placeholder="请选择" size="small" @change="searchtype" style="color:#fff">
        <el-option v-for="item in typeList" :key="item.id" :label="item.value" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="审批状态" prop="city">
      <el-select v-model="status" placeholder="请选择" size="small" @change="searchStatus" style="color:#fff">
        <el-option v-for="item in statusList" :key="item.id" :label="item.value" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <p class="page">
      <span>合计：{{count}}</span>
      <span>每页：10</span>
    </p>
    <!-- <el-form-item class="searchs white-el-select">
      <input v-model="number" placeholder="请输入房间号" @keyup.enter="getPrice" class="input" />
      <i class="iconfont icon-ali-sousuo" @click="searchAll"></i>
    </el-form-item> -->
    <!--列表-->
    <el-table :data="flowList" highlight-current-row @selection-change="selsChange" style="width: 100%;" v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column prop="serial_number" label="审批编号" width="164">
      </el-table-column>
      <el-table-column prop="store.name" label="门店名称" width="210">
      </el-table-column>
      <el-table-column prop="type" label="审批类目">
        <template slot-scope="scope">
          <span size="small">{{scope.row.type}}审批</span>
        </template>
      </el-table-column>
      <el-table-column prop="step.employee.position.name" label="审批环节">
      </el-table-column>
      <el-table-column prop="step.employee.name" label="审批人">
      </el-table-column>
      <el-table-column prop="step.updated_at" label="审批时间" width="160">
      </el-table-column>
      <el-table-column prop="step.status" label="审批结果">
      </el-table-column>
      <el-table-column prop="status" label="审批状态" width="90">
      </el-table-column>
      <el-table-column label="操作" width="50">
        <template slot-scope="scope">
          <span size="small" @click="modifyFree(scope.row)" style="color: #00a69b; cursor: pointer;">查看</span>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total" :current-page.sync="page">
      </el-pagination>
    </el-col>
  </el-form>
</template>
<script>
import { getCityList, getStoreList, showmyCreate } from '../../api/api'
export default {
  data () {
    return {
      storesList: [],
      city: '',
      store_id: '',
      cityList: [],
      flowList: [{
        step: {
          employee: {
            position: {},
          },
          store: {},
        },
      } ],
      type: '',
      typeList: [{
        id: 'CHECKOUT',
        value: '退房',
      },
      {
        id: 'PRICE',
        value: '调价',
      },
      ],
      count: '',
      status: '',
      statusList: [{
        id: 'AUDIT',
        value: '审批流程中',
      },
      {
        id: 'APPROVED',
        value: '审批已完成',
      },
      {
        id: 'CLOSED',
        value: '审批已终止',
      },
      ],
      total: 0,
      listLoading: false,
      page: 1,
      value: 'second',
    }
  },
  created () {
    if (sessionStorage.getItem('page')) {
      this.page = Number(sessionStorage.getItem('page'))
    }
  },
  destroyed () {
    if (this.$route.path !== '/adjustflow') {
      sessionStorage.removeItem('page')
    }
  },
  mounted () {
  },
  methods: {
    // 页码
    handleCurrentChange (val) {
      this.page = val
      this.getFlow()
    },
    // 获取城市
    getCity () {
      let that = this
      let para = {}
      getCityList(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data.cities
        getData[0] = '请选择'
        that.func.portInit(rescode, resmsg, function () {
          that.cityList = getData
        })
      }).catch(function (err) {
        console.log(err)
      })
    },

    // 获取门店名称
    getStoreList () {
      let that = this
      let para = {
        city: that.city,
      }
      getStoreList(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data.stores
        getData.unshift({
          store_id: '',
          name: '请选择',
        })
        that.func.portInit(rescode, resmsg, function () {
          that.storesList = getData
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
    // 选择城市
    searchCity () {
      let that = this
      that.store_id = ''
      let para = {
        city: that.city,
      }
      that.getStoreList()
    },
    // 获取任务流列表
    getFlow () {
      let that = this
      let para = {
        store_id: that.store_id,
        type: that.type,
        status: that.status,
        page: that.page,
        search: that.search,
      }
      that.listLoading = true
      showmyCreate(para).then((res) => {
        let rescode = res.data.rescode
        let getData = res.data.data
        let resmsg = res.data.resmsg
        that.func.portInit(rescode, resmsg, function () {
          that.total = getData.totalPage
          getData.taskflows.forEach((item) => {
            item.type = that.func.typeTre(item.type)
            item.status = that.func.statusTre(item.status)
            if (item.step != null) {
              item.step.status = that.func.resultTre(item.step.status)
            }
          })
          that.flowList = getData.taskflows
          that.count = getData.count
          that.listLoading = false
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
    searchtype () {
      this.type = this.type
      this.page = 1
      this.getFlow()
    },
    searchName () {
      this.store_id = this.store_id
      this.page = 1
      this.getFlow()
    },
    searchStatus () {
      this.status = this.status
      this.page = 1
      this.getFlow()
    },
    searchAll () {
      this.search = this.search
      this.page = 1
      this.getFlow()
    },
    getPrice () {
      this.searchAll()
    },
    // 查看详情
    modifyFree (row) {
      sessionStorage.setItem('page', JSON.stringify(this.page))
      sessionStorage.setItem('active', JSON.stringify(this.value))
      if (row.type == '调价') {
        this.$router.push({
          path: '/adjustflow',
          query: {
            id: row.id,
            name: 'me',
          },
        })
      } else {
        this.$router.push({
          path: '/checkoutflow',
          query: {
            id: row.id,
            name: 'me',
          },
        })
      }
    },
  },
}
</script>
<style lang="scss"  scoped="scoped">
  .meflow {
    .page {
      display: inline-block;
      position: absolute;
      right: 32px;
      span:first-of-type {
        padding-right: 12px;
      }
    }
  }
</style>
