<template>
  <section class="fx-pages-main addbill">
    <el-form ref="addStore" label-width="100px" class="addform">
        <el-form-item label="选择门店">
          <city-store-select @set="handleSetStore"></city-store-select>
        </el-form-item>
      <el-form-item label="房间号" prop="name">
        <el-input placeholder="请输入房间号" @blur="getRoom" v-model="room_number"></el-input>
      </el-form-item>
      <el-form-item label="房间地址" prop="name" >
        <el-input placeholder="请确认房间地址" v-model="address"></el-input>
      </el-form-item>
      <el-form-item label="住户姓名" prop="name" >
        <el-input placeholder="请根据房间信息确认住户姓名" v-model="name"></el-input>
      </el-form-item>
      <el-form-item label="账单周期">
        <el-date-picker type="month" placeholder="请选择日期" @change="monthTime" v-model="monthTimes"></el-date-picker>
      </el-form-item>
      <el-form-item label="账单类型" class="tyope">
        <el-col :span="1">
          <el-select placeholder="请选择" size="small" v-model="addbill.type">
            <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-form-item class="moneys">
          <el-input placeholder="填写金额" v-model="addbill.money"></el-input><span class="money">元</span>
        </el-form-item>
      </el-form-item>
      <el-button type="primary" class="submit" @click="submit">提交</el-button>
    </el-form>
  </section>
</template>
<script type="text/javascript">
import { CityStoreSelect } from '@/components/selects'
import { getresidentbyroom, addOrder } from '@/api/api'
export default {
  components: {
    CityStoreSelect,
    // TextSearchSelect,
  },
  data () {
    return {
      city: '',
      cityList: [],
      storesList: '',
      monthTimes: '',
      typeList: [{
        label: '请选择',
        value: '',
      },
      {
        label: '住宿服务费',
        value: 'ROOM',
      },
      {
        label: '清洁服务费',
        value: 'CLEAN',
      },
      {
        label: '设备租赁费',
        value: 'DEIVCE',
      },
      {
        label: '物业服务费',
        value: 'MANAGEMENT',
      },
      {
        label: '用电服务费',
        value: 'ELECTRICITY',
      },
      {
        label: '冷水服务费',
        value: 'WATER',
      },
      {
        label: '热水服务费',
        value: 'HOT_WATER',
      },
      {
        label: '燃气服务费',
        value: 'GAS',
      },
      {
        label: '物品维修费',
        value: 'REPAIR',
      },
      {
        label: '物品赔偿费',
        value: 'COMPENSATION',
      },
      {
        label: '住宿押金',
        value: 'DEPOSIT_R',
      },
      {
        label: '滞纳金',
        value: 'OVERDUE',
      },
      {
        label: '其他押金',
        value: 'DEPOSIT_O',
      },
      {
        label: '其它服务费',
        value: 'OTHER',
      },

      ],
      room_number: '',
      store_id: '',
      address: '',
      name: '',
      addbill: {
        room_id: '',
        resident_id: '',
        type: '',
        year: '',
        month: '',
        money: '',
      },
    }
  },
  mounted () {

  },
  methods: {
    handleSetStore (city, storeId) {
      this.city = city
      this.store_id = storeId
    },

    /* 选择门店 */
    monthTime (val) {
      this.monthTimes = val
      this.addbill.year = val.substr(0, 4)
      this.addbill.month = val.substr(5)
    },
    getRoom () {
      let that = this
      let para = {
        store_id: that.store_id,
        room_number: that.room_number,
      }
      getresidentbyroom(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data[0]
        that.func.portInit(rescode, resmsg, function () {
          that.address = `${getData.store.province}${getData.store.city}${getData.store.district}${getData.store.address}${para.room_number}`
          that.name = getData.resident.name
          that.addbill.room_id = getData.id
          that.addbill.resident_id = getData.resident.id
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
    submit () {
      let that = this
      let para = Object.assign({}, that.addbill)
      para.money = Number(para.money)
      console.log(para)
      if (para.room_id == '' || para.resident_id == '' || para.type == '' || para.year == '' || para.month == '' || para.money == '') {
        that.$message({
          message: '请完整填写表单',
          type: 'error',
        })
      } else {
        addOrder(para).then((res) => {
          let rescode = res.data.rescode
          let resmsg = res.data.resmsg
          // let getData = res.data.data
          that.func.portInit(rescode, resmsg, function () {
            that.$message({
              message: '提交成功',
              type: 'success',
            })
            that.$router.push({ path: '/bill' })
          })
        }).catch(function (err) {
          console.log(err)
        })
      }
    },
  },
}
</script>
