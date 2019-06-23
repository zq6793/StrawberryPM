<template>
  <section class="fx-pages-main addowner">
    <el-form :inline="true" style="padding: 8px 22px">
      <!-- <el-form-item label="所属城市" prop="city">
        <el-select v-model="city" placeholder="请选择" size="small" @change="searchCity" style="color:#fff">
          <el-option v-for="item in cityList" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="门店名称" class="select">
        <el-select v-model="ownerList.store_id" placeholder="请选择" size="small">
          <el-option v-for="item in storesList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="选择门店">
        <city-store-select @set="handleSetStore"></city-store-select>
      </el-form-item>
      <strong class="smalltitle">房间信息</strong>
      <hr>
      <el-form-item class="houseSplice">
        <el-form-item label="总楼层">
          <el-input placeholder="总楼层" v-model="ownerList.layer_total"></el-input>
        </el-form-item>
        <el-form-item label="所在层">
          <el-input placeholder="所在层" v-model="ownerList.layer"></el-input>
        </el-form-item>
        <el-form-item label="单元">
          <el-input placeholder="单元" v-model="ownerList.unit"></el-input>
        </el-form-item>
        <el-form-item label="房间号" class="number">
          <el-input placeholder="房间号" v-model="ownerList.number"></el-input>
        </el-form-item>
      </el-form-item>
      <br>
      <el-form-item class="featureSplice" label="户型特点">
        <el-form-item label="" class="select">
          <el-select v-model="ownerList.room_count" placeholder="0室" size="small">
            <el-option v-for="item in room_number" :key="item.value" :label="item.label" :value="item.value" style="background: #fafafa; color: #000; border-radius: 0; border-bottom:1px solid #D8D8D8">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" class="select">
          <el-select v-model="ownerList.hall_count" placeholder="0厅" size="small">
            <el-option v-for="item in hall_number" :key="item.value" :label="item.label" :value="item.value" style="background: #fafafa; color: #000; border-radius: 0; border-bottom:1px solid #D8D8D8">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" class="select">
          <el-select v-model="ownerList.kitchen_count" placeholder="0厨" size="small">
            <el-option v-for="item in cook_number" :key="item.value" :label="item.label" :value="item.value" style="background: #fafafa; color: #000; border-radius: 0; border-bottom:1px solid #D8D8D8">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" class="select">
          <el-select v-model="ownerList.bathroom_count" placeholder="0卫" size="small">
            <el-option v-for="item in toilet_number" :key="item.value" :label="item.label" :value="item.value" style="background: #fafafa; color: #000; border-radius: 0; border-bottom:1px solid #D8D8D8">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" class="housenum">
          <el-input placeholder="大小" v-model="ownerList.area"></el-input>
          <span>m²</em></span>
        </el-form-item>
      </el-form-item>
      <strong class="smalltitle">业主信息</strong>
      <hr>
      <el-form-item class="ownerinfo">
        <el-form-item label="姓名" class="ownername">
          <el-input placeholder="请输入小业主名称" v-model="ownerList.name" size="small"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="联系电话">
          <el-input placeholder="请输入小业主联系电话" v-model="ownerList.phone" size="small"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="身份证号">
          <el-input placeholder="请输入小业主身份证号" v-model="ownerList.card_number" size="small"></el-input>
        </el-form-item>
        <el-form-item label="具体地址">
          <el-input placeholder="请输入小业主具体地址" v-model="ownerList.address" size="small"></el-input>
        </el-form-item>
      </el-form-item>
      <strong class="smalltitle">银行卡信息</strong>
      <hr>
      <el-form-item class="ownercard">
        <el-form-item label="持卡人">
          <el-input placeholder="请输入持卡人姓名" v-model="ownerList.account" size="small"></el-input>
        </el-form-item>
        <el-form-item label="是否本人持有" class="owner">
          <el-select v-model="ownerList.own_account" placeholder="请选择" size="small">
            <el-option v-for="item in caretList" :key="item.id" :label="item.value" :value="item.id" style="background: #fafafa; color: #000; border-radius: 0; border-bottom:1px solid #D8D8D8">
            </el-option>
          </el-select>
        </el-form-item>
        <br>
        <el-form-item label="银行卡账号" class="ownername">
          <el-input placeholder="请输入银行卡卡号" v-model="ownerList.bank_card_number" size="small"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="开户行">
          <el-input placeholder="请输入开户行名称" v-model="ownerList.bank_name" size="small"></el-input>
        </el-form-item>
      </el-form-item>
      <strong class="smalltitle">合同信息</strong>
      <hr>
      <el-form-item class="ownerinfo">
        <el-form-item label="保底租金">
          <el-input placeholder="请输入保底租金" v-model="ownerList.minimum_rent" size="small"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="交付日期">
          <el-date-picker type="date" placeholder="请输入交付日期" @change="changeStart" v-model="ownerList.start_date"></el-date-picker>
        </el-form-item>
        <br>
        <el-form-item label="托管日期">
          <el-date-picker type="date" placeholder="请输入托管日期" @change="changeEnd" v-model="ownerList.end_date"></el-date-picker>
        </el-form-item>
        <br>
        <el-form-item label="合同时长">
          <el-input placeholder="请输入合同时长" v-model="ownerList.contract_years" size="small"></el-input>
        </el-form-item>
      </el-form-item>
      <strong class="smalltitle">合同信息</strong>
      <hr>
      <el-form-item class="rentrise">
        <el-form-item label="第1年" class="cent">
          <el-input placeholder="第1年" size="small" v-model="ownerList.rent_increase_rate[0]"></el-input>
          <span>%</span>
        </el-form-item>
        <el-form-item label="免租期限" class="cent">
          <el-input placeholder="免租期限" size="small" v-model="ownerList.no_rent_days[0]"></el-input>
          <span>天</span>
        </el-form-item>
        <br>
        <el-form-item label="第2年" class="cent">
          <el-input placeholder="第2年" size="small" v-model="ownerList.rent_increase_rate[1]"></el-input>
          <span>%</span>
        </el-form-item>
        <el-form-item label="免租期限" class="cent">
          <el-input placeholder="免租期限" size="small" v-model="ownerList.no_rent_days[1]"></el-input>
          <span>天</span>
        </el-form-item>
        <br>
        <el-form-item label="第3年" class="cent">
          <el-input placeholder="第3年" size="small" v-model="ownerList.rent_increase_rate[2]"></el-input>
          <span>%</span>
        </el-form-item>
        <el-form-item label="免租期限" class="cent">
          <el-input placeholder="免租期限" size="small" v-model="ownerList.no_rent_days[2]"></el-input>
          <span>天</span>
        </el-form-item>
        <br>
        <el-form-item label="第4年" class="cent">
          <el-input placeholder="第4年" size="small" v-model="ownerList.rent_increase_rate[3]"></el-input>
          <span>%</span>
        </el-form-item>
        <el-form-item label="免租期限" class="cent">
          <el-input placeholder="免租期限" size="small" v-model="ownerList.no_rent_days[3]"></el-input>
          <span>天</span>
        </el-form-item>
        <br>
        <el-form-item label="第5年" class="cent">
          <el-input placeholder="第5年" size="small" v-model="ownerList.rent_increase_rate[4]"></el-input>
          <span>%</span>
        </el-form-item>
        <el-form-item label="免租期限" class="cent">
          <el-input placeholder="免租期限" size="small" v-model="ownerList.no_rent_days[4]"></el-input>
          <span>天</span>
        </el-form-item>
        <br>
        <el-form-item>
          <el-button type="primary" @click="submit" class="btn" v-loading="listLoading">提交</el-button>
        </el-form-item>
      </el-form-item>
    </el-form>
  </section>
</template>
<script type="text/javascript">
import { CityStoreSelect } from '@/components/selects'
import { addownerList } from '@/api/api'
export default {
  components: {
    CityStoreSelect,
    // TextSearchSelect,
  },
  data () {
    return {
      listLoading: false,
      city: '',
      building_id: '',
      storesList: '',
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
        id: '0',
        value: '否',

      },
      {
        id: '1',
        value: '是',
      },
      ],
      ownerList: {
        store_id: '',
        layer_total: '',
        address: '',
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
        contract_years: '',
        rent_increase_rate: ['', '', '', '', '' ],
        no_rent_days: ['', '', '', '', '' ],
      },
    }
  },
  mounted () {

  },
  methods: {
    handleSetStore (city, storeId) {
      this.city = city
      this.store_id = storeId
      this.getSmartDevices()
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
        that.func.emptyVul(para, function () {
          that.listLoading = false
        }, function () {
          that.$confirm('确认新增小业主吗', '提示', { type: 'warning' }).then(() => {
            addownerList(para).then((res) => {
              if (res == undefined) {
                that.listLoading = false
              }
              if (res.data.rescode == 0) {
                that.$message.success('提交成功')
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
