<template>
<section>
<el-table :data="CouponList" highlight-current-row @selection-change="selsChange" border tooltip-effect="dark">
<el-table-column type="selection">
</el-table-column>
<el-table-column prop="created_at" label="发放时间" width="160">
</el-table-column>
<el-table-column prop="coupon_type.name" label="名称">
</el-table-column>
<el-table-column prop="coupon_type.discount" label="金额￥" width="80">
</el-table-column>
<el-table-column prop="time" label="有效期" width="315">
</el-table-column>
<el-table-column prop="coupon_type.description" label="用途">
</el-table-column>
<el-table-column prop="status" label="状态" width="80">
</el-table-column>
<el-table-column prop="updated_at" label="使用时间" width="160">
</el-table-column>
</el-table>
</section>
</template>
<script>
import { getCoupon } from '@/api/api'
export default {
  data () {
    return {
      residentid: '',
      CouponList: '',
    }
  },
  created () {
    this.residentid = this.$route.query.id
  },
  computed: {
    headers () {
      return {
        Token: sessionStorage.getItem('token'),
      }
    },
  },
  mounted () {
    this.getCoupon()
  },
  methods: {
    getCoupon () {
      let that = this
      let para = {
        resident_id: that.residentid,
      }
      getCoupon(para).then((res) => {
        let getData = res.data.data
        that.CouponList = getData.coupon
        that.CouponList.forEach((item) => {
          item.status = that.func.constatusTra(item.status)
          item.time = `${item.created_at}--${item.deadline}`
          if (item.status == '已使用') {
          } else {
            item.updated_at = ''
          }
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
  }
}
</script>
