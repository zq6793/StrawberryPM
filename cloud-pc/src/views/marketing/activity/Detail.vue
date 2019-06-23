<template>
  <section class="fx-pages-main lookactivity">
    <!--工具条-->

    <el-form v-loading="listLoading" label-width="100px">
      <div class="fx-head-s">基本信息</div>
      <el-form-item label="活动名称:" size="small">
         <span>{{ infoList.name }}</span>
      </el-form-item>
      <el-form-item label="活动时间:" size="small">
         <span>{{infoList.start_time}} -- {{infoList.end_time}}</span>
      </el-form-item>
      <el-form-item  label="活动名称:" size="small">
         <span>{{ infoList.name }}</span>
      </el-form-item>
      <el-form-item label="活动说明:" size="small">
        <span>{{infoList.description}}</span>
      </el-form-item>
      <el-form-item v-if='infoList.type == "ATTRACT"' label="活动规则:" size="small">
        <span>{{ infoList.rule }}</span>
      </el-form-item>
      <el-form-item v-if='infoList.type == "ATTRACT"' label="助力卡:" size="small">
        <span><img :src="infoList.back_url" alt="" width="180px"></span>
      </el-form-item>
      <div class="fx-head-s">活动设置</div>
      <span v-if='infoList.type == "SCRATCH" || infoList.type == "TRNTABLE"'>
      <el-form-item  label="参与用户:" size="small">
         <span>{{infoList.customer}}</span>
      </el-form-item>
      <el-form-item label="奖品设置:" size="small">
        <table cellspacing="0" cellpadding="1">
          <tr style="height: 50px;">
            <th colspan="">奖品等级</th>
            <th colspan="">奖品名称</th>
            <th colspan="">奖品数量</th>
          </tr>
          <tr>
            <td>一等奖</td>
            <td>{{priceone}}</td>
            <td>{{infoList.count.one}}</td>
          </tr>
          <tr>
            <td>二等奖</td>
            <td>{{pricetwo}}</td>
            <td>{{infoList.count.two}}</td>
          </tr>
          <tr>
            <td>三等奖</td>
            <td>{{pricethr}}</td>
            <td>{{infoList.count.three}}</td>
          </tr>
        </table>
      </el-form-item>
      </span>
      <span  v-else-if='infoList.type == "OLDBELTNEW" || infoList.type == "CHECKIN"'>
      <el-form-item label="" size="small">
        <table cellspacing="0" cellpadding="1">
          <tr style="height: 50px;">
            <th colspan="">奖品等级</th>
            <th colspan="">奖品名称</th>
            <th colspan="">奖品总数量</th>
            <th colspan="">每人发放量</th>
          </tr>
          <tr>
            <td>一季度</td>
            <td>{{priceone}}</td>
            <td>{{infoList.count.one}}</td>
            <td>{{infoList.grant.one}}</td>
          </tr>
          <tr>
            <td>半年</td>
            <td>{{pricetwo}}</td>
            <td>{{infoList.count.two}}</td>
            <td>{{infoList.grant.two}}</td>
          </tr>
          <tr>
            <td>一年</td>
            <td>{{pricethr}}</td>
            <td>{{infoList.count.three}}</td>
            <td>{{infoList.grant.three}}</td>
          </tr>
        </table>
      </el-form-item>
      </span>
      <span v-else-if='infoList.type == "ATTRACT"'>
      <el-form-item label="" size="small">
        <table cellspacing="0" cellpadding="1">
          <tr style="height: 50px;">
            <th colspan="">吸粉数量</th>
            <th colspan="">奖品名称</th>
            <th colspan="">奖品总数量</th>
            <th colspan="">每人发放量</th>
          </tr>
          <tr>
            <td>{{infoList.prize_limit.one}}人以上</td>
            <td>{{priceone}}</td>
            <td>{{infoList.count.one}}</td>
            <td>{{infoList.grant.one}}</td>
          </tr>
          <tr>
            <td>{{infoList.prize_limit.two}}人以上</td>
            <td>{{pricetwo}}</td>
            <td>{{infoList.count.two}}</td>
            <td>{{infoList.grant.two}}</td>
          </tr>
          <tr>
            <td>{{infoList.prize_limit.three}}人以上</td>
            <td>{{pricethr}}</td>
            <td>{{infoList.count.three}}</td>
            <td>{{infoList.grant.three}}</td>
          </tr>
        </table>
      </el-form-item>
    </span>
      <span v-if='infoList.type == "SCRATCH" || infoList.type == "TRNTABLE"'>
      <div class="fx-head-s">分享设置</div>
      <el-form-item label="分享标题:" size="small">
        {{infoList.share_title}}
      </el-form-item>
      <el-form-item label="分享封面:" size="small">
        <img :src="infoList.share_img" alt="" class="img" @click="oneImg = true">
      </el-form-item>
      <el-form-item label="分享描述:" size="small">
        {{infoList.share_des}}
      </el-form-item>
      <el-dialog title="查看照片" :visible.sync="oneImg" :close-on-click-modal="false">
        <img :src="infoList.share_img" alt="" style="width:400px;">
      </el-dialog>
      </span>
    </el-form>
  </section>
</template>
<script type="text/javascript">
import { listActivity } from '@/api/api'
export default {
  data () {
    return {
      listLoading: false,
      infoList: {
        count: {},
        grant: {},
        prize_limit: {},
      },
      priceone: '',
      pricetwo: '',
      pricethr: '',
      customer: '',
      oneImg: false,
      customerList: [{
        id: '1',
        label: '新用户（首次关注用户）',
      },
      {
        id: '2',
        label: '已入住用户',
      },
      {
        id: '3',
        label: '已退房用户',
      },
      {
        id: '4',
        label: '所有用户',
      },
      ],
      limitList: [{
        id: 1,
        label: '一人一次',
      },
      {
        id: 2,
        label: '一天一次',
      },
      {
        id: 3,
        label: '一天两次',
      },
      ],
    }
  },
  created () {
    this.id = this.$route.query.id
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      let that = this
      let para = {
        id: that.id,
      }
      that.listLoading = true
      listActivity(para).then((res) => {
        if (res.data.rescode == 0) {
          let getData = res.data.data.list[0]
          if (getData.type == 'SCRATCH' || getData.type == 'TRNTABLE') {
            let customer = []
            customer = getData.customer.split(',')
            for (let i = 0; i < this.customerList.length; i++) {
              for (let j = 0; j < customer.length; j++) {
                if (this.customerList[i].id == customer[j]) {
                  customer[j] = this.customerList[i].label
                }
              }
            }
            getData.customer = customer.toString()
          }
          let lookinfo = []
          lookinfo = getData.prize.split('/').slice(0, 3)
          this.priceone = lookinfo[0]
          this.pricetwo = lookinfo[1]
          this.pricethr = lookinfo[2]
          that.infoList = getData
          that.listLoading = false
        }
      }).catch(function (err) {
        console.log(err)
      })
    },
  },
}
</script>
