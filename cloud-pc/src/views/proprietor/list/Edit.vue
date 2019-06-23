<template>
  <section class="fx-pages-main editowner">
    <div class="fx-head-s"></div>
    <el-form v-loading="listLoadings" label-width="120px">
      <div class="fx-head-ss">房间信息</div>
      <el-form-item label="所属城市" prop="city" size="small">
        <el-col :span="6">
        <el-select v-model="city" placeholder="请选择" size="small" @change="searchCity">
          <el-option v-for="item in cityList" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
        </el-col>
        <el-col :span="6">
          <el-select placeholder="请选择门店" v-model="ownerList.store_id" @change="stores">
          <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="房间信息" class="houseSplice" size="small">
        <el-col :span="1" class="fx-text-center">
          总楼层
        </el-col>
        <el-col :span="3">
          <el-input placeholder="总楼层" v-model="ownerList.layer_total"></el-input>
        </el-col>
           <el-col :span="1" class="fx-text-center">
          所在层
        </el-col>
        <el-col :span="3">
          <el-input placeholder="所在层" v-model="ownerList.layer"></el-input>
        </el-col>
        <el-col :span="1" class="fx-text-center">
          单元
        </el-col>
        <el-col :span="3">
          <el-input placeholder="单元" v-model="ownerList.unit"></el-input>
        </el-col>
        <el-col :span="1" class="fx-text-center">
          房间号
        </el-col>
        <el-col :span="3">
          <el-input placeholder="房间号" v-model="ownerList.number"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item class="featureSplice" label="户型特点" size="small">
        <el-col :span="3">
          <el-select v-model="ownerList.room_count" placeholder="0室" size="small">
            <el-option v-for="item in room_number" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="ownerList.hall_count" placeholder="0厅" size="small">
            <el-option v-for="item in hall_number" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="ownerList.kitchen_count" placeholder="0厨" size="small">
            <el-option v-for="item in cook_number" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="ownerList.bathroom_count" placeholder="0卫" size="small">
            <el-option v-for="item in toilet_number" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input placeholder="大小" v-model="ownerList.area" style="width: 80px"></el-input>
          <span>m²</em></span>
        </el-col>
      </el-form-item>
      <div class="fx-head-ss">业主信息</div>
        <el-form-item label="姓名" size="small">
          <el-col :span="3">
          <el-input placeholder="请输入小业主名称" v-model="ownerList.name"></el-input>
        </el-col>
        </el-form-item>
        <el-form-item label="联系电话" size="small">
          <el-col :span="6">
          <el-input placeholder="请输入小业主联系电话" v-model="ownerList.phone"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="身份证号" size="small">
          <el-col :span="6">
          <el-input placeholder="请输入小业主身份证号" v-model="ownerList.card_number"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="具体地址" size="small">
          <el-col :span="6">
          <el-input placeholder="请输入小业主具体地址" v-model="ownerList.address" size="small"></el-input>
        </el-col>
        </el-form-item>
      <div class="fx-head-ss">银行卡信息</div>
        <el-form-item label="持卡人">
          <el-col :span="6">
          <el-input placeholder="请输入持卡人姓名" v-model="ownerList.account"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="是否本人持有" class="owner">
          <el-col :span="6">
          <el-select v-model="ownerList.own_account" placeholder="请选择" size="small">
            <el-option v-for="item in caretList" :key="item.id" :label="item.value" :value="item.id">
            </el-option>
          </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="银行卡账号" class="ownername">
          <el-col :span="6">
          <el-input placeholder="请输入银行卡卡号" v-model="ownerList.bank_card_number"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="开户行">
          <el-col :span="6">
          <el-input placeholder="请输入开户行名称" v-model="ownerList.bank_name"></el-input>
        </el-col>
        </el-form-item>
      <div class="fx-head-ss">合同信息</div>

        <el-form-item label="保底租金" size="small">
          <el-col :span="3">
          <el-input placeholder="请输入保底租金" v-model="ownerList.minimum_rent"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="交付日期" size="small">
          <el-date-picker type="date" placeholder="请输入交付日期" @change="changeStart" v-model="ownerList.start_date"></el-date-picker>
        </el-form-item>
        <el-form-item label="托管日期" size="small">
          <el-date-picker type="date" placeholder="请输入托管日期" @change="changeEnd" v-model="ownerList.end_date"></el-date-picker>
        </el-form-item>
        <el-form-item label="合同时长" size="small">
          <el-col :span="3">
          <el-input placeholder="请输入合同时长" v-model="ownerList.contract_years" size="small"></el-input>
        </el-col>
        </el-form-item>
      <div class="fx-head-ss">租约信息</div>
        <el-form-item label="第1年" class="cent">
          <el-col :span="3">
          <el-input placeholder="第1年" size="small" v-model="ownerList.rent_increase_rate[0]"></el-input>
        </el-col>
        </el-col>
          <span>%</span>
        </el-form-item>
        <el-form-item label="免租期限" class="cent">
          <el-col :span="3">
          <el-input placeholder="免租期限" size="small" v-model="ownerList.no_rent_days[0]"></el-input>
        </el-col>
          <span>天</span>
        </el-form-item>
        <el-form-item label="第2年" class="cent">
          <el-col :span="3">
          <el-input placeholder="第2年" size="small" v-model="ownerList.rent_increase_rate[1]"></el-input>
        </el-col>
          <span>%</span>
        </el-form-item>
        <el-form-item label="免租期限" class="cent">
          <el-col :span="3">
          <el-input placeholder="免租期限" size="small" v-model="ownerList.no_rent_days[1]"></el-input>
        </el-col>
          <span>天</span>
        </el-form-item>
        <el-form-item label="第3年" class="cent">
          <el-col :span="3">
          <el-input placeholder="第3年" size="small" v-model="ownerList.rent_increase_rate[2]"></el-input>
        </el-col>
          <span>%</span>
        </el-form-item>
        <el-form-item label="免租期限" class="cent">
          <el-col :span="3">
          <el-input placeholder="免租期限" size="small" v-model="ownerList.no_rent_days[2]"></el-input>
        </el-col>
          <span>天</span>
        </el-form-item>
        <el-form-item label="第4年" class="cent">
          <el-col :span="3">
          <el-input placeholder="第4年" size="small" v-model="ownerList.rent_increase_rate[3]"></el-input>
        </el-col>
          <span>%</span>
        </el-form-item>
        <el-form-item label="免租期限" class="cent">
          <el-col :span="3">
          <el-input placeholder="免租期限" size="small" v-model="ownerList.no_rent_days[3]"></el-input>
        </el-col>
          <span>天</span>
        </el-form-item>
        <el-form-item label="第5年" class="cent">
          <el-col :span="3">
          <el-input placeholder="第5年" size="small" v-model="ownerList.rent_increase_rate[4]"></el-input>
        </el-col>
          <span>%</span>
        </el-form-item>
        <el-form-item label="免租期限" class="cent">
          <el-col :span="3">
          <el-input placeholder="免租期限" size="small" v-model="ownerList.no_rent_days[4]"></el-input>
        </el-col>
          <span>天</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit" class="btn" v-loading="listLoading">提交</el-button>
        </el-form-item>
    </el-form>
  </section>
</template>
<script type="text/javascript">
import { getCityList, getStoreList, getownerList, editownerList } from '@/api/api'
export default {
  data () {
    return {
      listLoading: false,
      listLoadings: false,
      city: '',
      cityList: [],
      building_id: '',
      storeList: [],
      buildingList: '',
      room_number: [{
        value: 1,
        label: '1室',
      },
      {
        value: 2,
        label: '2室',
      },
      {
        value: 3,
        label: '3室',
      },
      {
        value: 4,
        label: '4室',
      },
      ],
      hall_number: [{
        value: 0,
        label: '0厅',
      }, {
        value: 1,
        label: '1厅',
      }, {
        value: 2,
        label: '2厅',
      } ],
      cook_number: [{
        value: 0,
        label: '0厨',
      }, {
        value: 1,
        label: '1厨',
      }, {
        value: 2,
        label: '2厨',
      } ],
      toilet_number: [{
        value: 1,
        label: '1卫',
      }, {
        value: 2,
        label: '2卫',
      }, {
        value: 3,
        label: '3卫',
      } ],
      caretList: [{
        id: 0,
        value: '否',

      },
      {
        id: 1,
        value: '是',
      },
      ],
      ownerList: {
        owner_id: '',
        store_id: '',
        layer_total: '',
        layer: '',
        unit: '',
        number: '',
        room_count: '',
        hall_count: '',
        kitchen_count: '',
        bathroom_count: '',
        area: '',
        name: '',
        phone: '',
        card_number: '',
        account: '',
        bank_card_number: '',
        own_account: '',
        bank_name: '',
        minimum_rent: '',
        start_date: '',
        end_date: '',
        address: '',
        contract_years: '',
        rent_increase_rate: ['', '', '', '', '' ],
        no_rent_days: ['', '', '', '', '' ],
      },
    }
  },
  created () {
    this.ownerList.owner_id = this.$route.query.id
  },
  mounted () {
    this.getCity()
    this.getStoreInfo()
    this.getList()
  },
  methods: {
    /* 获取城市 */
    getCity () {
      let that = this
      let para = {}
      getCityList(para).then((res) => {
        let rescode = res.data.rescode
        let getData = res.data.data.cities
        let resmsg = res.data.resmsg
        getData[0] = '请选择'
        that.func.portInit(rescode, resmsg, function () {
          that.cityList = getData
        })
      }).catch(function (err) {
        console.log(err)
      })
    },

    /* 搜索城市 */
    searchCity () {
      let that = this
      if (that.city == '请选择') {
        that.store_id = ''
      }
      that.getStoreInfo()
    },

    /* 获取门店列表 */
    getStoreInfo () {
      let that = this
      let para = {
        city: that.city,
      }
      getStoreList(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data.stores
        that.func.portInit(rescode, resmsg, function () {
          getData.unshift({
            id: '',
            name: '请选择',
          })
          that.storeList = getData
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
    getList () {
      let that = this
      let para = {
        owner_id: that.ownerList.owner_id,
      }
      that.listLoadings = true
      getownerList(para).then((res) => {
        if (res.data.rescode == 0) {
          let getData = res.data.data.data[0]
          getData.rent_increase_rate = JSON.parse(getData.rent_increase_rate).map((item) => {
            if (item == 0) {
              item = ''
            }
            return item
          })
          getData.no_rent_days = JSON.parse(getData.no_rent_days).map((item) => {
            if (item == 0) {
              item = ''
            }
            return item
          })
          getData.store_id = getData.house.store.id
          that.city = getData.house.store.city
          getData.layer_total = getData.house.layer_total
          getData.layer = getData.house.layer
          getData.unit = getData.house.unit
          getData.number = getData.house.number
          getData.room_count = getData.house.room_count
          getData.hall_count = getData.house.hall_count
          getData.kitchen_count = getData.house.kitchen_count
          getData.bathroom_count = getData.house.bathroom_count
          getData.area = getData.house.area
          that.ownerList = getData
          that.listLoadings = false
        }
      })
    },
    changeStart (val) {
      this.ownerList.start_date = val
    },
    changeEnd (val) {
      this.ownerList.end_date = val
    },
    // 提交
    submit () {
      let that = this
      let para = Object.assign({}, that.ownerList)
      if (Number(para.layer_total) < Number(para.layer)) {
        that.$message.error('所在层不能大于总层数')
      } else if (isNaN(Number(para.layer_total)) || isNaN(Number(para.layer))) {
        that.$message.error('层数必须是数字')
      } else {
        that.listLoading = true
        para.rent_increase_rate = para.rent_increase_rate.map((item) => {
          if (item == '') {
            item = 0
          }
          item = Number(item)
          return item
        })
        para.no_rent_days = para.no_rent_days.map((item) => {
          if (item == '') {
            item = 0
          }
          item = Number(item)
          return item
        })
        para.owner_id = para.id
        that.func.emptyVul(para, function () {
          that.listLoading = false
        }, function () {
          that.$confirm('确认修改小业主吗', '提示', { type: 'warning' }).then(() => {
            editownerList(para).then((res) => {
              if (res.data.rescode == 0) {
                that.$message.success('修改成功')
                that.$router.push({
                  path: '/ownerlist',
                })
              }
              that.listLoading = false
            })
          }).catch(function () {
            that.$message.info('已取消提交')
          })
        })
      }
    },
  },
}
</script>
<style scoped>
  .fx-head-ss{
    border-bottom:1px #eeeeee solid;
    margin-bottom: 20px;
  }
</style>


