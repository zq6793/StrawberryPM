<template>
  <section class="fx-pages-main lookCheckouts" v-loadimg="listLoading">
    <el-form :inline="true" class="fx-table-sort-head">
      <el-form-item size="small">
      <el-button type="primary" @click="backlist">返回</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="20">
      <el-col :span="10">
        <div class="fx-head-s">换房信息</div>
  <!--       <div class="clearfix bottom bill-card-foot">
            <span>换房信息:</span>
            <strong class="sumprice"></strong>
        </div> -->
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="原合同信息:" name="1">
            <el-form label-width="160px">
              <el-form-item label="合同编号:" size="small" v-if="new_resident.contract.length>0">
                {{ new_resident.contract[0].contract_id }}
              </el-form-item>
              <el-form-item label="住户姓名:" size="small">
                {{ new_resident.resident.name }}
              </el-form-item>
              <el-form-item label="联系方式:" size="small">
                {{ new_resident.resident.phone}}
              </el-form-item>
              <el-form-item label="合同周期:" size="small">
                {{ new_resident.resident.begin_time.substr(0, 10) }} — {{ new_resident.resident.end_time.substr(0, 10) }}
              </el-form-item>
              <el-form-item label="住宿服务费(￥/月):" size="small">
                {{ new_resident.resident.real_rent_money }}元
              </el-form-item>
              <el-form-item label="物业服务费(￥/月):" size="small">
                {{ new_resident.resident.real_property_costs }}元
              </el-form-item>
              <el-form-item label="押金(￥):" size="small">
                {{ new_resident.deposit_rent }}元
              </el-form-item>
              <el-form-item label="其他押金(￥):" size="small">
                {{ new_resident.deposit_tmp }}元
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="新房间合同信息:" name="2">
            <el-form label-width="160px">
              <el-form-item label="合同编号:" size="small" v-if="old_resident.contract.length>0">
                {{ old_resident.contract[0].contract_id }}
              </el-form-item>
              <el-form-item label="住户姓名:" size="small">
                {{ old_resident.resident.name }}
              </el-form-item>
              <el-form-item label="联系方式:" size="small">
                {{ old_resident.resident.phone}}
              </el-form-item>
              <el-form-item label="合同周期:" size="small">
                {{ old_resident.resident.begin_time.substr(0, 10) }} — {{ old_resident.resident.end_time.substr(0, 10) }}
              </el-form-item>
              <el-form-item label="住宿服务费(￥/月):" size="small">
                {{ old_resident.resident.real_rent_money }}元
              </el-form-item>
              <el-form-item label="物业服务费(￥/月):" size="small">
                {{ old_resident.resident.real_property_costs }}元
              </el-form-item>
              <el-form-item label="押金(￥):" size="small">
                {{ old_resident.deposit_rent }}元
              </el-form-item>
              <el-form-item label="其他押金(￥):" size="small">
                {{ old_resident.deposit_tmp }}元
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="调账转入:" name="3">
            <div v-for="item in transfer_out" :key="item.id" class="bill-card-item">
            <span class="bill-card-type">{{item.type}}</span>
            <span class="bill-card-money">{{item.money}}</span>
            <span class="bill-card-status">{{item.created_at}}</span>
            </div>
<!--      <div class="clearfix bottom bill-card-foot">
            <span>总额:</span>
            <strong class="sumprice">{{ transfer_out_total }}</strong>
            </div> -->
          </el-collapse-item>
          <el-collapse-item title="调账转出" name="4">
            <div v-for="item in transfer_in" :key="item.id" class="bill-card-item">
            <span class="bill-card-type">{{item.type}}</span>
            <span class="bill-card-money">{{item.money}}</span>
            <span class="bill-card-status">{{item.created_at}}</span>
            </div>
<!--             <div class="clearfix bottom bill-card-foot">
            <span>总额:</span>
            <strong class="sumprice">{{ transfer_in_total }}</strong>
            </div> -->
          </el-collapse-item>
          <el-collapse-item title="原房间应收" name="5">
            <div v-for="item in old_room_unpaid" :key="item.id" class="bill-card-item">
            <span class="bill-card-type">{{item.type}}</span>
            <span class="bill-card-money">{{item.money}}</span>
            <span class="bill-card-status">{{item.remark}}</span>
            </div>
<!--             <div class="clearfix bottom bill-card-foot">
            <span>总额:</span>
            <strong class="sumprice">{{ old_room_unpaid_total }}</strong>
            </div> -->
          </el-collapse-item>
          <el-collapse-item title="新房间应收" name="6">
            <div v-for="item in new_room_unpaid" :key="item.id" class="bill-card-item">
            <span class="bill-card-type">{{item.type}}</span>
            <span class="bill-card-money">{{item.money}}</span>
            <span class="bill-card-status">{{item.created_at}}</span>
            <!-- <span class="bill-card-status">{{item.status}}</span> -->
            </div>
 <!--            <div class="clearfix bottom bill-card-foot">
            <span>总额:</span>
            <strong class="sumprice">{{ new_room_unpaid_total }}</strong>
            </div> -->
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
  </section>
</template>
<script type="text/javascript">
import { ChangeroomDetail, TransferOut, TransferIn, oldRoomUnpaid, newRoomUnpaid, residentInfoDetail } from '@/api/api'
export default {
  data () {
    return {
      activeNames: ['1', '2', '3', '4', '5', '6' ],
      old_resident: {},
      new_resident: {},
      transfer_in: {},
      transfer_in_total: 0,
      transfer_out: {},
      transfer_out_total: 0,
      old_room_unpaid: {},
      old_room_unpaid_total: 0,
      new_room_unpaid: {},
      new_room_unpaid_total: 0,
      changeroomId: '',
    }
  },
  mounted () {
    this.changeroomId = this.$route.query.billnote_id
    this.changeroomInfo()
  },
  methods: {
    changeroomInfo () {
      let that = this
      ChangeroomDetail(that.changeroomId).then((res) => {
        let changeroomInfo = res.data
        // 原房间信息
        residentInfoDetail(changeroomInfo.old_resident_id).then((res) => {
          that.new_resident = res.data
        }).catch(function (err) {
          console.log(err)
        })
        // 新房间信息
        residentInfoDetail(changeroomInfo.new_resident_id).then((res) => {
          that.old_resident = res.data
        }).catch(function (err) {
          console.log(err)
        })

        // 获取原房间转入
        TransferOut(changeroomInfo.old_resident_id).then((res) => {
          that.transfer_out = res.data
        }).catch(function (err) {
          console.log(err)
        })
        // 获取原房间转出
        TransferIn(changeroomInfo.new_resident_id).then((res) => {
          console.log(res)
          that.transfer_in = res.data
        }).catch(function (err) {
          console.log(err)
        })
        // 旧房间应交
        oldRoomUnpaid(changeroomInfo.old_resident_id).then((res) => {
          that.old_room_unpaid = res.data
        }).catch(function (err) {
          console.log(err)
        })
        // 新房间应交
        newRoomUnpaid(changeroomInfo.new_resident_id).then((res) => {
          that.new_room_unpaid = res.data
        }).catch(function (err) {
          console.log(err)
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
    backlist () {
      this.$emit('set', 'changeroom', 'list')
    },
  },
}
</script>
<style scoped="scoped">
.lookCheckouts .fx-head-s{
  margin-top: 20px;
  margin-bottom: 20px;
}
.lookCheckouts .card{
  width: 100%;
  margin-top: 20px;
}
.lookCheckouts .el-card__header{
font-size:16px;
}
.lookCheckouts .bill-card-item{
  line-height: 26px;
}
.lookCheckouts .bill-card-type{
  color: #606266;
  padding-right: 20px;
  display: inline-block;
  width: 100px;
}
.lookCheckouts .bill-card-money{
  color: #606266;
  display: inline-block;
  width: 60px;
  padding-right: 20px;
}
.lookCheckouts .bill-card-status{
 color: #E6A23C;
  width: 60px;
}
.lookCheckouts .bill-card-foot{
  margin-top: 13px;
  color:#606266;
  bottom: 30px;
  line-height: 40px;
}
.lookCheckouts .bill-card-foot strong{
  font-size:16px;
  color:#F56C6C;
}
.lookCheckouts .fx-head-ss{
  border-bottom:1px #eeeeee solid;
  margin-top: 20px;
}
</style>

