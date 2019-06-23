<template>
  <section class="dataanalysis fx-pages-main">
    <el-row :gutter="24" class="dataanalysis-top">
      <el-col :span="8">
        <div class="grid-content bg-purple bc1" @click="visitor">
          <el-tooltip class="item" effect="dark" content="截至当前所有预约来访看房未完成的数量" placement="top">
            <span class="text">预约来访 <i class="iconfont icon-ali-tishi"></i></span>
          </el-tooltip>
          <span class="number">{{homeList.home.count_visit}}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple bc2" @click="expire">
          <el-tooltip class="item" effect="dark" content="当前时间到未来一个月内到期的合同数量" placement="top">
            <span class="text">即将到期 <i class="iconfont icon-ali-tishi"></i></span>
          </el-tooltip>
          <span class="number">{{homeList.home.count_order}}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple bc3" @click="serviceorder">
          <el-tooltip class="item" effect="dark" content="截止当前所有服务订单未完成的数量" placement="top">
            <span class="text">服务订单 <i class="iconfont icon-ali-tishi"></i></span>
          </el-tooltip>
          <span class="number">{{homeList.home.count_confirm}}</span>
        </div>
      </el-col>
      <!-- <el-col :span="6">
        <div class="grid-content bg-purple bc4" @click="bill">
          <el-tooltip class="item" effect="dark" content="截止当前所有未缴费账单的数量" placement="top">
            <span class="text">未缴费账单 <i class="iconfont icon-ali-tishi"></i></span>
          </el-tooltip>
          <span  class="number">{{homeList.home.count_bills}}</span>
        </div>
      </el-col> -->
    </el-row>
    <div class="daytable">
      <table cellspacing="0" cellpadding="0" style="width: 100%;">
        <tr style="height: 50px;">
          <th colspan="4" style=" padding-left: 50px; font-weight: normal;">日报表（当日实时数据）
          </th>
        </tr>
        <tr>
          <td><span class="td-t">预约看房</span><span class="td-n">{{homeList.day.view}}</span></td>
          <td><span class="td-t">新签住户数</span><span class="td-n">{{homeList.day.sign}}</span></td>
          <td><span class="td-t">应收</span><span class="td-n">{{homeList.day.recmoney}}</span></td>
          <td><span class="td-t">实收</span><span class="td-n">{{homeList.day.paymoney}}</span></td>
        </tr>
        <tr>
          <td><span class="td-t">退房</span><span class="td-n">{{homeList.day.checkout}}</span></td>
          <td><span class="td-t">维修订单</span><span class="td-n">{{homeList.day.server}}</span></td>
          <td><span class="td-t">清洁订单</span><span class="td-n">{{homeList.day.clean}}</span></td>
          <td><span class="td-t">投诉</span><span class="td-n">{{homeList.day.complaint}}</span></td>
        </tr>
      </table>
    </div>
    <el-row class="housetable">
      <strong>房源统计(间)&nbsp;全部房源实时数据</strong>
      <el-col :span="18">
          <div id="chartColumn1" style="height:220px; width:720px"></div>
      </el-col>
      <el-col :span="6">
        <div id="chartColumn" style="height:260px; width:300px"></div>
      </el-col>
    </el-row>
    <div class="mouthtable">
      <strong>月报表(当月实时数据)</strong>
      <el-row class="mouthcontent">
        <el-col :span="6">
          <p>总收（实）</p>
          <p>￥{{homeList.month.total.all}}</p>
          <p>住宿服务费<span>¥{{homeList.month.total.server}}</span></p>
          <p>物业服务费<span>¥{{homeList.month.total.management}}</span></p>
          <p>水电服务费<span>¥{{homeList.month.total.utility}}</span></p>
          <p>其他服务费<span>¥{{homeList.month.total.other}}</span></p>
        </el-col>
        <el-col :span="6">
          <el-tooltip class="item" effect="dark" content="住户增减=新签住户数-退租住户数" placement="top">
            <p>住户增减 <i class="iconfont icon-ali-tishi" style="color:red"></i></p>
          </el-tooltip>
          <p>{{homeList.month.resident.all}}</p>
          <p>新签数<span>{{homeList.month.resident.server}}</span></p>
          <p>退房数<span>{{homeList.month.resident.other}}</span></p>
        </el-col>
        <el-col :span="6">
          <el-tooltip class="item" effect="dark" content="续租率=续租住户数/到期住户数" placement="top">
            <p>续租率 <i class="iconfont icon-ali-tishi" style="color:red"></i></p>
          </el-tooltip>
          <p>{{relet}}%</p>
          <p>续约住户数<span>{{homeList.month.resident.renewal}}</span></p>
          <p>到期住户数<span>{{homeList.month.resident.expire}}</span></p>
        </el-col>
        <el-col :span="6">
          <el-tooltip class="item" effect="dark" content="空置率=空置房间数/总房间数" placement="top">
            <p>空置率 <i class="iconfont icon-ali-tishi" style="color:red"></i></p>
          </el-tooltip>
          <p>{{air}}%</p>
          <p>总房间数&nbsp;&nbsp;&nbsp;<span>{{homeList.house.all}}</span></p>
          <p>空置房间数<span>{{homeList.house.free}}</span></p>
        </el-col>
      </el-row>
    </div>

  </section>
</template>
<script>
import echarts from 'echarts'
import { home } from '../api/api'
export default {
  data () {
    return {
      homeList: {
        home: {},
        month: {
          total: {
            all: '',
          },
          resident: {
            all: '',
          },
          keeprent: {
            all: '',
          },
          free: {},
        },
        house: {},
        day: {},
      },
      air: '',
      have: '',
      relet: '',
      chartColumn: null,
    }
  },
  created () {
    this.getHome()
  },
  updated () {
    this.drawColumnChart()
    this.drawColumnChart1()
  },
  methods: {
    getHome () {
      let that = this
      let para = {

      }
      home(para).then((res) => {
        let rescode = res.rescode
        let getData = res.data
        let resmsg = res.resmsg
        that.func.portInit(rescode, resmsg, function () {
          that.homeList = getData
          if (getData.house.all !== 0) {
            that.have = parseInt(getData.house.use / getData.house.all * 100)
            that.air = parseInt(getData.house.free / getData.house.all * 100)
            that.relet = (getData.month.resident.renewal / getData.month.resident.expire * 100).toFixed(2)
          } else {
            that.air = 0
            that.have = 0
          }
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
    drawColumnChart () {
      this.chartColumn = echarts.init(document.getElementById('chartColumn'))
      this.chartColumn.setOption({

        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}%',
        },
        series: [{
          name: '',
          type: 'pie',
          radius: ['50%', '70%' ],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center',
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '22',
                color: '#00C5C0',
              },
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },

          data: [
            { value: this.air, name: '空置率', itemStyle: { normal: { color: '#00C5C0' } } },
            { value: this.have, name: '出租率', itemStyle: { normal: { color: '#eee' } } },
          ],
        } ],

      })
    },
    drawColumnChart1 () {
      // let that = this
      this.chartColumn = echarts.init(document.getElementById('chartColumn1'))
      this.chartColumn.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {},
        grid: {
          left: '10%',
          right: '4%',
          bottom: '10%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.1 ],
        },
        yAxis: {
          type: 'category',
          data: ['全部', '已出租', '空置中' ],
        },
        series: [{
          type: 'bar',
          data: [
            { value: this.homeList.house.all, itemStyle: { normal: { color: '#00C5C0', height: '10px' } } },
            { value: this.homeList.house.use, itemStyle: { normal: { color: '#6D53D6' } } },
            { value: this.homeList.house.free, itemStyle: { normal: { color: '#B3A8EB' } } },
          ],
        } ],
      })
    },
    // 预约来访
    visitor () {
      this.$router.push({ path: '/reservationorder' })
    },
    expire () {
      let stime = new Date().toLocaleDateString().replace(/\//g, '-')
      let etime = `${new Date().getFullYear()}-${new Date().getMonth() + 2}-${new Date().getDate()}`
      this.$router.push({
        path: '/contractmanage',
        query: {
          from: stime,
          to: etime + ' 23:59:59',
        },
      })
    },
    serviceorder () {
      this.$router.push({ path: '/serviceorder' })
    },
    bill () {
      this.$router.push({
        path: '/bill2',
        query: {
          status: 'NOTPAY',
        },

      })
    },
  },
}
</script>
<style scoped>
.dataanalysis .dataanalysis-top{
  margin-top: 20px;
}
.dataanalysis .grid-content {
    border-radius: 4px;
    box-sizing: border-box;
    text-align: center;
    padding:10px 0px;
}
.dataanalysis .bc1 {
    background: #00c5c0;
    cursor: pointer;
}
.dataanalysis .bc2 {
    background: #038a77;
    cursor: pointer;
}
.dataanalysis .bc3 {
    background: #b3a8eb;
    cursor: pointer;
}
.dataanalysis .bc4 {
    background: #6d53d6;
    cursor: pointer;
}
.dataanalysis .grid-content{
    color: #fff;
}
.dataanalysis .grid-content span{
  display: block;
  width: 100%;
  line-height: 40px;
}
.dataanalysis .grid-content .text {
    height: 30px;
}
.dataanalysis .grid-content .number {
    font-size: 42px;
    height: 60px;
    line-height: 60px;
    font-weight: 100;
}
.daytable,.housetable{
  margin-top: 20px;
}
.daytable th,.housetable th{
  text-align: left;
  background: #e4ebec;
  color:#000000;
}
.dataanalysis .daytable tr:nth-of-type(2) td, .dataanalysis .daytable tr:nth-of-type(3) td {
    flex: 1;
    border-right: 1px solid #e4ebec;
    border-bottom: 1px solid #e4ebec;
    padding-left: 60px;
    height: 60px;line-height: 60px;
    background-color: #ffffff;
}
.dataanalysis .daytable .td-t{
  width: 100px;
  display: inline-block;
}
.dataanalysis .daytable .td-t{
  width: 80px;
  display: inline-block;
}
.dataanalysis strong {
    font-weight: 400;
    padding-left: 40px;
    display: block;
    background: #e4ebec;
    line-height: 50px;
}
.dataanalysis .mouthcontent .el-col{
  text-align: center;
  padding-top: 20px;
}
.dataanalysis .mouthcontent .el-col p{
  line-height: 24px;
}
.dataanalysis .mouthcontent .el-col p:first-of-type {
    cursor: pointer;
}
.dataanalysis .mouthcontent .el-col p:nth-of-type(2) {
    color: #6d53d6;
    font-size: 30px;
    line-height: 40px;
}

</style>


