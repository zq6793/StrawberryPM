<template>
  <section class="fx-pages-main activedata">
    <el-form :inline="true" v-loading="listLoading">
      <div class="activeinfo">
        <div class="activetop">
          <p class="text">
            <i class="iconfont icon-ali-xiangqingjingyanliebiaoshuxing"></i>
            <strong style="font-size: 16px;">活动详情</strong></p>
          <p>
            <el-form-item label="所属城市" prop="city">
              <el-select v-model="city" placeholder="请选择" @change="searchCity">
                <el-option v-for="item in cityList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="门店名称" prop="store_id" class="select">
              <el-select v-model="store_id" placeholder="请选择" @change="getstores">
                <el-option v-for="item in storesList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="选择门店" size="small">
              <city-store-select @set="handleSetStore"></city-store-select>
            </el-form-item> -->
            <!-- ----------------------------------选择门店组件---------------------------------------- -->
          </p>
        </div>
        <div class="activebottom">
          <div class="left">
            <p>
              <span><strong>奖品明细</strong></span>
              <span><strong>已领/份</strong></span>
              <span><strong>已核销/份</strong></span>
              <span><strong>剩余/份</strong></span>
            </p>
            <p>
              <span><strong>奖品一</strong></span>
              <span>{{baseList.prize.used.one}}</span>
              <span>{{baseList.prize.receive.one}}</span>
              <span>{{baseList.prize.surplus.one}}</span>
            </p>
            <p>
              <span><strong>奖品二</strong></span>
              <span>{{baseList.prize.used.two}}</span>
              <span>{{baseList.prize.receive.two}}</span>
              <span>{{baseList.prize.surplus.two}}</span>
            </p>
            <p>
              <span><strong>奖品三</strong></span>
              <span>{{baseList.prize.used.three}}</span>
              <span>{{baseList.prize.receive.three}}</span>
              <span>{{baseList.prize.surplus.three}}</span>
            </p>
          </div>
          <div class="right">
            <p><strong>活动名称：</strong>{{baseList.activity.name}}</p>
            <p><strong>活动时间：</strong>{{baseList.activity.start_time}} -- {{baseList.activity.end_time}}</p>
            <p><strong>活动状态：</strong>{{baseList.activity.status}}</p>
          </div>
        </div>
      </div>
      <div class="datall">
        <p class="top"><i class="iconfont icon-ali-shuju"></i><strong style="font-size: 16px;">数据总览</strong>统计数据截止至今日{{now}}</p>
        <div class="info">
          <div class="box">
            <span>中奖人数</span>
            <p>{{baseList.draw.lottery}}</p>
            <div class="text">
              <span>今日<em>{{baseList.draw.lottery_today}}</em></span>
              <span>昨日<em>{{baseList.draw.lottery_yesterday}}</em></span>
            </div>
          </div>
          <div class="box">
            <span>抽奖人数</span>
            <p>{{baseList.draw.luck_draw}}</p>
            <div class="text">
              <span>今日<em>{{baseList.draw.luck_draw_today}}</em></span>
              <span>昨日<em>{{baseList.draw.luck_draw_yesterday}}</em></span>
            </div>
          </div>
          <div class="box">
            <span>分享人数</span>
            <p>{{baseList.draw.share}}</p>
            <div class="text">
              <span>今日<em>{{baseList.draw.share_today}}</em></span>
              <span>昨日<em>{{baseList.draw.share_yesterday}}</em></span>
            </div>
          </div>
          <div class="box">
            <span>总浏览量</span>
            <p>{{baseList.draw.visit}}</p>
            <div class="text">
              <span>今日<em>{{baseList.draw.visit_today}}</em></span>
              <span>昨日<em>{{baseList.draw.visit_yesterday}}</em></span>
            </div>
          </div>
        </div>
      </div>
      <div class="chart">
        <div class="chartop">
          <div class="chartte"><i class="iconfont icon-ali-qushi"></i><strong style="font-size: 16px;">整体趋势</strong></div>
          <div class="range">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="最近7天" name="7">用户管理</el-tab-pane>
              <el-tab-pane label="最近20天" name="20">配置管理</el-tab-pane>
            </el-tabs>
          </div>
          <div class="date">
            <el-form-item label="活动期间">
              <el-date-picker type="date" placeholder="请选择日期" @change="changeStart" v-model="value1" :picker-options="pickerOptions0"></el-date-picker>
            </el-form-item>
            <el-form-item label="——">
              <el-date-picker type="date" placeholder="请选择日期" @change="changeEnd" v-model="value2" :picker-options="pickerOptions1"></el-date-picker>
            </el-form-item>
          </div>
        </div>
        <div class="charbottom">
          <div class="bottomtit">
            <div class="left">
              <p><span></span>中奖人数</p>
              <p><span></span>抽奖人数</p>
              <p><span></span>分享人数</p>
              <p><span></span>总浏览量</p>
            </div>
            <div class="right">
              <p>中奖人数<span>{{datas.lottery}}</span></p>
              <p>抽奖人数<span>{{datas.luck_draw}}</span></p>
              <p>分享人数<span>{{datas.share}}</span></p>
              <p>总浏览量<span>{{datas.visit}}</span></p>
            </div>
          </div>
          <div class="linechart">
            <div id="lineChart" style="height:500px; width:100%"></div>
          </div>
        </div>
      </div>
    </el-form>
  </section>
</template>
<script>
import echarts from 'echarts'
import { activityCount, activeTrend, activeStore } from '@/api/api'
export default {
  data () {
    return {
      id: '',
      city: '',
      cityList: [],
      store_id: '',
      storesList: [],
      activeName: '7',
      value1: '',
      value2: '',
      baseList: {
        activity: {},
        draw: {},
        now: '',
        prize: {
          receive: {},
          surplus: {},
          used: {},

        },
      },
      start_time: '',
      end_time: '',
      num: '',
      time: [],
      // 抽奖
      lottery: [],
      // 中奖
      luckList: [],
      // 分享
      share: [],
      // 总浏览量
      browse: [],
      trendList: {
        start: '',
        end: '',
      },
      datas: {},
      pickerOptions0: {
        disabledDate: (time) => {
          return time.getTime() < new Date(this.baseList.activity.start_time) || time.getTime() > new Date(this.baseList.activity.end_time)
        },
      },
      pickerOptions1: {
        disabledDate: (time) => {
          return time.getTime() < new Date(this.baseList.activity.start_time) || time.getTime() > new Date(this.baseList.activity.end_time)
        },
      },
      listLoading: false,
      now: '',
      max: 0,
    }
  },
  created () {
    this.id = this.$route.query.id
    this.getInfo()
    this.getStoreInfo()
  },
  mounted () {
    this.handleClick()
  },
  methods: {
    handleSetStore (city, storeId) {
      this.city = city
      this.store_id = storeId
    },
    /* 搜索城市 */
    searchCity () {
      let that = this
      that.getStoreInfo()
    },
    getStoreInfo () {
      let that = this
      let para = {
        city: that.city,
        id: that.id,
      }
      activeStore(para).then((res) => {
        let rescode = res.data.rescode
        let getData = res.data.data.data
        if (rescode == 0) {
          getData.forEach((item) => {
            that.cityList.push(item.city)
          })
          that.cityList = [...new Set(that.cityList) ]
          if (para.city) {
            that.storesList = []
            that.storesList = getData
          }
        }
      }).catch(function (err) {
        console.log(err)
      })
    },
    getstores () {
      this.store_id = this.store_id
      this.getInfo()
    },
    handleClick () {
      this.lottery = []
      this.luckList = []
      this.share = []
      this.browse = []
      this.value1 = ''
      this.value2 = ''
      this.start_time = ''
      this.end_time = ''
      this.getTime()
    },
    // 获取时间
    getTime () {
      let time = new Date()
      let year = time.getFullYear()
      let month = time.getMonth() + 1 > 9 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1)
      let day = time.getDate() > 9 ? time.getDate() : '0' + (time.getDate())
      let now = new Date(year + '-' + month + '-' + day)
      let nowyear = ''
      let nowmonth = ''
      let nowday = ''
      let mm = time.getMinutes()
      let hh = time.getHours()
      let i = 0
      let num = Number(this.activeName)
      let differ = 24 * 60 * 60 * 1000
      let agotime = []
      mm = mm > 9 ? mm : '0' + mm
      hh = hh > 9 ? hh : '0' + hh
      this.now = year + '-' + month + '-' + day + ' ' + hh + ':' + mm
      while (i < num) {
        nowyear = now.getFullYear(),
        nowmonth = now.getMonth() + 1 > 9 ? now.getMonth() + 1 : '0' + (now.getMonth() + 1),
        nowday = now.getDate() > 9 ? now.getDate() : '0' + (now.getDate()),
        agotime.push(nowyear + '-' + nowmonth + '-' + nowday)
        now = new Date(now - 24 * 60 * 60 * 1000)
        i++
      }
      this.end_time = year + '-' + month + '-' + day
      this.start_time = agotime.pop()
      this.num = (new Date(this.end_time).getTime() - new Date(this.start_time).getTime()) / differ
      if (this.num > 7) {
        this.num = 7
      } else {
        this.num++
      }
      this.lookTrend()
    },
    // 时间
    changeStart (vul) {
      this.start_time = vul
    },
    changeEnd (vul) {
      this.end_time = vul
      let differ = 24 * 60 * 60 * 1000
      this.num = Number((new Date(this.end_time).getTime() - new Date(this.start_time).getTime()) / differ)
      if (this.num > 7) {
        this.num = 7
      } else {
        this.num++
      }
      if (this.end_time && this.start_time) {
        this.lottery = []
        this.luckList = []
        this.share = []
        this.browse = []
        this.lookTrend()
      }
    },
    // 活动和统计基本信息
    getInfo () {
      let that = this
      let para = {
        id: that.id,
        store_id: that.store_id,
      }
      activityCount(para).then((res) => {
        if (res.data.rescode == 0) {
          let getData = res.data.data
          getData.activity.status = that.statusTra(getData.activity.status)
          if (that.now > getData.activity.end_time) {
            that.now = getData.activity.end_time
          }
          that.baseList = getData
        }
      })
    },
    statusTra (status) {
      if (status == 'NORMAL') {
        status = '进行中'
      } else {
        status = '已下架'
      }
      return status
    },
    // 活动趋势图数据
    lookTrend () {
      let that = this
      let para = {
        id: that.id,
        store_id: that.store_id,
        start_time: that.start_time,
        end_time: that.end_time,
        num: that.num,
      }
      that.listLoading = true
      activeTrend(para).then((res) => {
        if (res.data.rescode == 0) {
          let getData = res.data.data
          that.time = getData.date
          for (let i = 0; i < getData.date.length; i++) {
            that.lottery.push(getData[getData.date[i]].lottery)
            that.luckList.push(getData[getData.date[i]].luck_draw)
            that.share.push(getData[getData.date[i]].share)
            that.browse.push(getData[getData.date[i]].visit)
            that.listLoading = false
          }
          let maxList = []
          maxList.push(Math.max.apply(null, that.lottery))
          maxList.push(Math.max.apply(null, that.luckList))
          maxList.push(Math.max.apply(null, that.share))
          maxList.push(Math.max.apply(null, that.browse))
          let max = Math.max.apply(null, maxList)
          if (max < 4) {
            that.max = 4
          } else {
            that.max = max
          }
          getData.lottery = eval(that.lottery.join('+'))
          getData.luck_draw = eval(that.luckList.join('+'))
          getData.share = eval(that.share.join('+'))
          getData.visit = eval(that.browse.join('+'))
          that.datas = getData
          if (that.lottery) {
            that.getChart()
          }
        }
      })
    },
    funNumber (arr) {
      arr.forEach((item) => {
        if (item > 3) {
          this.min = 0
        } else {
          this.min = 4
        }
      })
    },
    getChart () {
      let that = this
      this.chartColumn = echarts.init(document.getElementById('lineChart'))
      this.chartColumn.setOption({
        xAxis: {
          name: '日期',
          type: 'category',
          data: that.time,
        },
        yAxis: {
          name: '访问量',
          type: 'value',
          max: that.max,
        },
        series: [{
          data: this.lottery,
          type: 'line',
          hoverAnimation: false,
          animation: false,
          symbolSize: 12,
          itemStyle: {
            normal: {
              color: '#E44242', // 折线点的颜色
              lineStyle: {
                color: '#E44242', // 折线的颜色
              },
            },
          },
        },
        {
          data: this.luckList,
          type: 'line',
          hoverAnimation: false,
          animation: false,
          symbolSize: 12,
          //  symbol: 'circle',
          itemStyle: {
            normal: {
              color: '#F79559', // 折线点的颜色
              lineStyle: {
                color: '#F79559', // 折线的颜色
              },
            },
          },
        },
        {
          data: this.share,
          type: 'line',
          hoverAnimation: false,
          animation: false,
          symbolSize: 12,
          //  symbol: 'circle',
          itemStyle: {
            normal: {
              color: '#00C5C0', // 折线点的颜色
              lineStyle: {
                color: '#00C5C0', // 折线的颜色
              },
            },
          },
        },
        {
          data: this.browse,
          type: 'line',
          hoverAnimation: false,
          animation: false,
          symbolSize: 12,
          //  symbol: 'circle',
          itemStyle: {
            normal: {
              color: '#6D53D6', // 折线点的颜色
              lineStyle: {
                color: '#6D53D6', // 折线的颜色
              },
            },
          },
        },
        ],
      })
    },
  },
}
</script>
