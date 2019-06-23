<template>
  <section class="fx-pages-main det_device">
    <!--工具条-->
    <el-form :inline="true" :model="filters" class="fx-table-sort-head">
      <el-form-item label="选择日期" class="time" size="small">
        <el-col :span="10">
        <el-date-picker v-model="filters.begin_time" type="date" placeholder="开始时间" @change="beginTime" size="small"></el-date-picker>
        </el-col>
        <el-col :span="1">至</el-col>
        <el-col :span="10">
        <el-date-picker v-model="filters.end_time" type="date" placeholder="结束时间" @change="endTime" size="small"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item prop="device_type" class="store" size="small">
        <device-status-select :route-query="true" @set="setDeviceStatus"></device-status-select>
      </el-form-item>
    </el-form>
    <!--列表-门锁-->
    <el-table :data="datailsList" v-if="isShowLlock" highlight-current-row v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column prop="smart_device_type" label="设备类型">
      </el-table-column>
      <el-table-column prop="unlock_person" label="开锁人">
      </el-table-column>
      <el-table-column prop="unlock_way" label="开锁方式">
      </el-table-column>
      <el-table-column prop="updated_at" label="开锁时间">
      </el-table-column>
    </el-table>
    <!--列表-水表-->
    <el-table :data="datailsLists" highlight-current-row @selection-change="selsChange" style="width: 100%;" v-loading="listLoading" border tooltip-effect="dark"  v-show="isshow">
      <el-table-column prop="resident.name" label="住户姓名">
      </el-table-column>
      <el-table-column prop="this_reading" label="读数">
      </el-table-column>
      <el-table-column prop="image" label="图片">
        <template slot-scope="scope">
          <span style="color: #00a69b; cursor: pointer;" @click="lookImgs(scope.row)">查看</span>
        </template>
      </el-table-column>
      <el-table-column prop="this_time" label="日期" width="160">
      </el-table-column>
      <el-table-column prop="status" label="类型">
      </el-table-column>
      <el-table-column prop="order_status" label="状态">
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total">
      </el-pagination>
    </el-col>
    <el-dialog title="提示" :visible.sync="imgBoxs" width="30%" :close-on-click-modal="false" append-to-body class="img">
      <img :src="this_image" alt="" class="images_url" ref="imgs">
    </el-dialog>
  </section>
</template>
<script type="text/javascript">
import { record, showhistoryData } from '@/api/api'
import { DeviceStatusSelect } from '@/components/apartment'
export default {
  components: {
    DeviceStatusSelect
  },
  data () {
    return {
      id: '',
      type: '',
      number: '',
      imgBoxs: false,
      filters: {
        begin_time: '',
        end_time: '',
      },
      datailsList: [],
      datailsLists: [],
      total: 0,
      page: 1,
      listLoading: false,
      isShowLlock: true,
      isshow: false,
      room_id: '',
      status: '',
      typeList: [{
        id: '',
        value: '请选择',
      },
      {
        id: 'NORMAL',
        value: '日常读数',
      },
      {
        id: 'NEW_RENT',
        value: '入住读数',
      },
      {
        id: 'CHANGE_NEW',
        value: '新表读数',
      },
      {
        id: 'CHANGE_OLD',
        value: '旧表读数',
      },
      ],
      order_status: '',
    }
  },

  mounted () {
    this.id = this.$route.query.id
    this.type = this.$route.query.type
    this.number = this.$route.query.number
    this.room_id = this.$route.query.room_id
    if (this.type === 'LOCK') {
      this.isShowLlock = true
      this.isshow = false
    } else {
      this.isShowLlock = false
      this.isshow = true
    }
    this.getRecord()
    this.getInfo()
  },
  methods: {
    handleCurrentChange (val) {
      this.page = val
    },

    /* 获取详情界面 */
    getRecord () {
      let that = this
      let para = {
        page: that.page,
        id: that.id,
        type: that.type,
        begin_time: that.filters.begin_time,
        end_time: that.filters.end_time,
        room_id: that.room_id,
      }
      record(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data
        that.func.portInit(rescode, resmsg, function () {
          for (let key in getData.list) {
            getData.list[key].smart_device_type = that.deviceType(getData.list[key].smart_device_type)
            getData.list[key].unlock_way = that.passWord(getData.list[key].unlock_way)
          }
          that.datailsList = getData.list
          that.total = getData.count
        })
      })
    },
    getInfo () {
      let that = this
      let para = {
        page: that.page,
        device_id: that.id,
        start_time: that.filters.begin_time,
        end_time: that.filters.end_time,
        status: that.status,
        order_status: that.order_status,
      }
      that.listLoading = true
      showhistoryData(para).then((res) => {
        if (res.data.rescode == 0) {
          res.data.data.record.forEach((item) => {
            item.status = that.func.facilityTrat(item.status)
            item.order_status = that.func.facilityTras(item.order_status)
          })
          that.datailsLists = res.data.data.record
          that.listLoading = false
        }
      })
    },
    searchStatus () {
      this.status = this.status
      this.getInfo()
    },
    setDeviceStatus (val) {
      this.order_status = val
      this.getInfo()
    },
    lookImgs (row) {
      if (!row.image) {
        this.$message({
          message: '无本次读数图片',
          type: 'warning',
        })
      } else {
        this.imgBoxs = true
        this.this_image = row.image
      }
    },
    /* 类型转换 */
    deviceType (text) {
      switch (text) {
        case 'LOCK':
          text = '门锁'
          break
        case 'HOT_WATER_METER':
          text = '热水表'
          break
        case 'COLD_WATER_METER':
          text = '冷水表'
          break
        case 'ELECTRIC_METER':
          text = '电表'
          break
      }
      return text
    },

    /* 密码转换 */
    passWord (text) {
      switch (text) {
        case 'SERVER_COMMAND':
          text = '服务器接受命令'
          break
        case 'NORMAL':
          text = '机械开门(传统方式)'
          break
        case 'CALL_API':
          text = '远程网络开门'
          break
        case 'PASSWORD':
          text = '密码开门'
          break
        case 'DYNAMIC_PWD':
          text = '动态密码'
          break
      }
      return text
    },

    /* 选择开始日期 */
    beginTime (val) {
      if (!val) {
        val = ''
      }
      this.filters.begin_time = val
      this.getRecord()
      this.getInfo()
    },
    /* 结束日期 */
    endTime (val) {
      if (!val) {
        val = ''
      }
      this.filters.end_time = val
      this.getRecord()
      this.getInfo()
    },
  },
}
</script>
