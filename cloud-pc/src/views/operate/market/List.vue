<template>
  <section class="marketing fx-pages-main">
    <el-form :inline="true" style="padding:10px 5px" v-loading="listLoading">
      <el-form-item label="选择门店">
        <city-store-select :route-query="true" @set="refresh" :require="true"></city-store-select>
      </el-form-item>
      <el-form-item class="searchs">
        <text-search :route-query="true" :options="searchOptions" @set="refresh"></text-search>
      </el-form-item>
      <div class="markinfo" ref="markinfo">
        <div class="info">
          <span @click="searchTotal()" :class="{rese: textColor == ''}">全部 <i class="all">{{total_count}}</i></span>
          <span @click="searchReserve()" :class="{rese: textColor == 'RESERVE'}">已预订<i>{{reserve_count}}</i></span>
          <span @click="searchRent()" :class="{rese: textColor == 'RENT'}">已出租<i>{{rent_count}}</i></span>
          <span @click="searckBlank()" :class="{rese: textColor == 'BLANK'}">空置中<i>{{blank_count}}</i></span>
          <span @click="searchArrears()" :class="{rese: textColor == 'ARREARS'}">欠费<i>{{arrears_count}}</i></span>
          <el-select  white-el-select v-model="dayNum" placeholder="请选择" size="small" @change="searchDay">
            <el-option v-for="item in dayList" :key="item.value" :label="item.label" :value="item.value" ref="daynum">
            </el-option>
          </el-select>
        </div>

        <div class="chart">
          <span><i class="over"></i>已租</span>
          <span><i class="res"></i>预订</span>
          <span><i class="lack"></i>欠费</span>
        </div>
      </div>
      <div class="collapse">
        <el-collapse v-model="activeNames" @change="handleChange" ref="status">
          <el-collapse-item :title='isNaN(Number(i)) == true? i:i+"层"' :name='i' v-for="(tier, i) in detailsList" :key="tier.input">
            <div class="content" :class='{
                  reserve:(item.status == "预订") ? true :false,
                  rent:(item.status == "正常出租") ? true :false,
                  annears:(item.status == "欠费出租") ? true :false,
                 }' v-for="item in tier" :key="item.id" @click="residentInfo(item.resident_id, item.status)">
              <p class="housenum">
                <span>{{item.room_number}}<i>{{item.name}}</i></span>
                <span :class='{
                  reserves:(item.status == "预订") ? true :false,
                  rents:(item.status == "正常出租") ? true :false,
                  annearss:(item.status == "欠费出租") ? true :false,
                 }' v-if='item.status == "预订" || item.status == "正常出租" || item.status == "欠费出租"'></span>
                <span v-else>{{item.status}} </span>
              </p>
              <div class="housef">
                <p>{{item.room_price}}元/月</p>
                <p>{{item.room_type}}</p>
                <p v-show='(item.status == "欠费出租")?true:false' @click="reminder($event,item.room_id)">催缴账单</p>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-form>
  </section>
</template>
<script>
import { CityStoreSelect, TextSearch } from '@/components/selects'
import { details, pushbill } from '@/api/api'
export default {
  components: {
    CityStoreSelect,
    TextSearch,
  },
  data () {
    return {
      textColor: '',
      communityList: '',
      dayNum: '',
      number: '',
      status: '',
      listLoading: false,
      dayList: [{
        value: '空置天数',
        label: '空置天数',
      },
      {
        value: '1',
        label: '小于10天',
      },
      {
        value: '2',
        label: '11至20天',
      },
      {
        value: '3',
        label: '21至30天',
      },
      {
        value: '4',
        label: '大于30天',
      },
      ],
      detailsList: [],
      activeNames: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15',
        '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26',
      ],
      searchOptions: [
        { label: '房间号', key: 'number' },
        // { label: '房型特点', key: 'search' },
      ],
    }
  },
  computed: {
    headers () {
      return {
        'Token': sessionStorage.getItem('token'),
      }
    },
  },
  created () {
    // this.getstatus()
    // this.refresh()
  },
  methods: {
    refresh () {
      this.getInfo()
    },
    // 获取门店列表
    getInfo () {
      let that = this
      let para = this.queryOption()
      if (!para.store_id || para.store_id == 0) {
        return
      }
      para.status = that.status
      para.days = that.dayNum
      that.listLoading = true
      details(para).then((res) => {
        let rescode = res.data.rescode
        let getData = res.data.data
        if (rescode == 0) {
          for (let key in getData.rooms) {
            getData.rooms[key].forEach((item) => {
              item.status = that.houseTran(item.status)
              if (item.name != null) {
                item.name = '(' + item.name.substr(0, 1) + ')'
              }
            })
          }
          that.detailsList = getData.rooms
          that.listLoading = false
        }
      }).catch(err => {
        that.listLoading = false
      })
    },
    // 搜索
    searchStore () {
      this.number = this.number
      this.getInfo()
    },
    searchAll () {
      this.searchStore()
    },
    // 搜索全部
    searchTotal () {
      sessionStorage.setItem('color', '')
      this.textColor = ''
      this.status = ''
      this.getInfo()
    },
    // 已预订的
    searchReserve () {
      sessionStorage.setItem('color', 'RESERVE')
      this.textColor = 'RESERVE'
      this.status = 'RESERVE'
      this.getInfo()
    },
    // 已出租的
    searchRent () {
      sessionStorage.setItem('color', 'RENT')
      this.textColor = 'RENT'
      this.status = 'RENT'
      this.getInfo()
    },
    // 空置中的
    searckBlank () {
      sessionStorage.setItem('color', 'BLANK')
      this.textColor = 'BLANK'
      this.status = 'BLANK'
      this.getInfo()
    },
    // 欠费中的
    searchArrears () {
      sessionStorage.setItem('color', 'ARREARS')
      this.textColor = 'ARREARS'
      this.status = 'ARREARS'
      this.getInfo()
    },
    // 获取信息
    getstatus () {
      let color = sessionStorage.getItem('color')
      if (color == '') {
        this.searchTotal()
      } else if (color == 'RESERVE') {
        this.searchReserve()
      } else if (color == 'RENT') {
        this.searchRent()
      } else if (color == 'BLANK') {
        this.searckBlank()
      } else if (color == 'ARREARS') {
        this.searchArrears()
      }
    },
    // 通过空置天数来查找
    searchDay () {
      this.dayNum = this.dayNum
      this.getInfo()
    },
    // 状态转化
    houseTran (status) {
      if (status == 'BLANK') {
        status = '空'
      } else if (status == 'RESERVE') {
        status = '预订'
      } else if (status == 'RENT') {
        status = '正常出租'
      } else if (status == 'ARREARS') {
        status = '欠费出租'
      } else if (status == 'OCCUPIED') {
        status = '占用'
      } else {

      }
      return status
    },
    // 跳转界面
    residentInfo (id, status) {
      if (status != '空') {
        this.$router.push({
          path: '/householdinfo',
          query: {
            id: id,
          },
        })
      }
    },
    // 催缴账单
    reminder (e, id) {
      let para = {
        room_id: id,
      }
      pushbill(para).then((res) => {
        if (res.data.rescode == 0) {
          this.$message({
            message: '催缴账单成功',
            type: 'success',
          })
        }
      })
      e.stopPropagation()
    },
  },

}
</script>
<style scoped>
.marketing .markinfo {
  position: relative;
  margin-bottom: 20px;
  height: 30px;
  line-height: 30px;
  }
.marketing .markinfo .info .rese {
  color: #00a69b;
}
.marketing .markinfo .info span {
  margin-right: 3%;
  color: #4c4f5b;
  cursor: pointer;
}
.marketing .markinfo .chart {
    position: absolute;
    right: 0;
    top: 0;
}
.marketing .markinfo .chart span {
    color: #4c4f5b;
    margin: 0;
    margin-right: 39px;
}
.marketing .markinfo .chart i {
    display: inline-block;
    margin-right: 10px;
}
.marketing .markinfo .chart .over {
    height: 0;
    border-width: 6px;
    border-style: solid;
    border-color: transparent #46cdc4 #46cdc4 transparent;
}
.marketing .markinfo .chart .res {
    height: 10px;
    width: 10px;
    background: #7cd66a;
}
.marketing .markinfo .chart .lack {
    height: 10px;
    width: 10px;
    background: #ff6969;
}
.marketing .collapse .el-collapse-item__header {
    font-size: 16px;
    font-weight: 400;
    padding-left: 10px;
    line-height: 70px;
    height: 70px;
    color: #48576a;
}
.el-collapse-item__header__arrow {
    position: absolute;
    top: 40%;
    right: 0;
}
.marketing .collapse .el-collapse-item__header__arrow {
    font-weight: 700;
}
.el-collapse-item__header__arrow {
    margin-right: 8px;
    transition: transform .3s;
}
.marketing .collapse .content {
    height: 90px;
    width: 150px;
    background: #f3f3f3;
    z-index: 1;
    margin-left: 18px;
    margin-bottom: 30px;
    box-sizing: border-box;
    padding: 10px;
    border: 1px solid #f3f3f3;
    position: relative;
    float: left;
    cursor:pointer;
}
.marketing .collapse .rent {
    border: 1px solid #46cdc4;
}
.marketing .collapse .annears {
    border: 1px solid #ff6969;
}
.marketing .collapse .content .housenum {
    margin: 0;
    margin-top: -3px;
    padding: 0;
    display: flex;
    justify-content: space-between;
}
.collapse .content .housef {
    color: #999;
}
.marketing .collapse .content .housenum span {
    color: #4d4d4d;
}
.marketing .collapse .content .housenum span:first-of-type {
    font-weight: 200;
    font-size: 14px;
    color: #4d4d4d;
}
.marketing .collapse .content .housenum span:first-of-type i{
  font-style:normal;
  font-size:14px;
}
.marketing .collapse .rent {
    border: 1px solid #46cdc4;
}
.marketing .collapse .rents {
    position: absolute;
    height: 0;
    border-width: 8px;
    border-style: solid;
    border-color: transparent #46cdc4 #46cdc4 transparent;
    bottom: 0;
    right: 0;
}
.marketing .collapse .annearss {
    height: 14px;
    width: 14px;
    background: #ff6969;
    margin-top: 4px;
}
.marketing .collapse .content .housef p:last-of-type {
    position: absolute;
    right: 10px;
    bottom: 6px;
    z-index: 999;
    width: 74px;
    text-align: right;
    color: #00a69b;
    font-size: 12px;
}

</style>
