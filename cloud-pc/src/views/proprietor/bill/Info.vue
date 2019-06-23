<template>
  <section class="fx-pages-main lookOrderList">
    <el-form v-loading="listLoading" label-width="200px">
      <div class="fx-head-m">银行卡信息</div>
      <el-form-item label="姓名:" size="small">
        {{lookList.house.owner.name}}
      </el-form-item>
      <el-form-item label="账号:" size="small">
        {{lookList.house.owner.bank_card_number}}
      </el-form-item>
      <el-form-item label="开户行:" size="small">
        {{lookList.house.owner.bank_name}}
      </el-form-item>
      <el-form-item label="合同周期:" size="small">
        {{lookList.house.owner.start_date}}--{{lookList.house.owner.end_date}}
      </el-form-item>
      <el-form-item label="是否本人持有:" size="small">
        {{lookList.house.owner.own_account}}
      </el-form-item>
      <div class="fx-head-m">账单信息</div>
      <el-form-item label="账单日期:" size="small">
        {{lookList.owner_earning.start_date}}--{{lookList.owner_earning.end_date}}
        <el-button :plain="true" type="text" @click="billimg" class="look">查看打款凭证</el-button>
      </el-form-item>
      <el-form-item label="账单金额:" size="small">
        {{ lookList.owner_earning.earnings }}元
      </el-form-item>
      <el-form-item label="总租金:" size="small">
        {{ lookList.owner_earning.amount }}元/3个月
      </el-form-item>
      <el-form-item label="维修费用:" size="small">
        {{lookList.money}}
      </el-form-item>
      <el-form-item label="备注信息:" size="small">
        {{lookList.remark}}
      </el-form-item>
      <el-form-item label="支付流水号:" size="small">
        <el-col :span="6">
          <el-input type="text" placeholder="" size="small" v-model="lookList.owner_earning.sequence_number" disabled></el-input>
        </el-col>
        <el-col :span="6">
          <div class="fx-text-tips">由财务打款后填写</div>
        </el-col>
      </el-form-item>
      <el-dialog title="查看" :visible.sync="digimg" width="30%" center>
        <img :src="images" alt="">
      </el-dialog>
    </el-form>
  </section>
</template>
<script type="text/javascript">
import { showearning } from '@/api/api'
export default {
  data () {
    return {
      listLoading: false,
      digimg: false,
      id: '',
      lookList: {
        house: {
          owner: {},
        },
        owner_earning: {},
      },
      images: '',
    }
  },
  created () {
    this.id = this.$route.query.id
  },
  mounted () {
    this.getList()
  },
  methods: {
    // 获取查看信息
    getList () {
      let that = this
      let para = {
        id: that.id,
      }
      that.listLoading = true
      showearning(para).then((res) => {
        if (res.data.rescode == 0) {
          let getData = res.data.data
          if (getData.data[0].house.owner.own_account == '1') {
            getData.data[0].house.owner.own_account = '是'
          } else {
            getData.data[0].house.owner.own_account = '否'
          }
          that.lookList = getData.data[0]
          that.listLoading = false
        }
      })
    },
    backimg () {
      this.digimg = true
      this.images = this.lookList.house.owner.bank_card_urls
    },
    billimg () {
      this.digimg = true
      this.images = this.lookList.owner_earning.receipt_path
    },
  },
}
</script>
