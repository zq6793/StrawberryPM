<template>
  <section class="fx-pages-main edit-coupon">
    <!--工具条-->
    <el-form ref="editCoupon" label-width="100px" style="margin:20px; min-width:200px;" :model="editCoupon" :rules="editCouponRs" class="cont" v-loading="listLoading">
      <el-form-item label="优惠券名称" prop="name">
        <el-col :span="3">
          <el-input placeholder="请填写优惠券名称" v-model="editCoupon.name"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="简要描述" prop="description">
        <el-col :span="6">
        <el-input placeholder="请填写简要描述" v-model="editCoupon.description"></el-input>
      </el-col>
      </el-form-item>
      <el-form-item label="优惠方式" class="white-el-select">
        <el-select placeholder="请选择优惠方式" v-model="editCoupon.type">
          <el-option v-for="item in preferential" :key="item.label" :label="item.label" :value="item.value" style="background: #fafafa; color: #000; border-radius: 0; border-bottom:1px solid #D8D8D8"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="使用范围" class="white-el-select">
        <el-select placeholder="请选择使用范围" v-model="editCoupon.limit">
          <el-option v-for="item in useRange" :key="item.label" :label="item.label" :value="item.value" style="background: #fafafa; color: #000; border-radius: 0; border-bottom:1px solid #D8D8D8"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="优惠金额" prop="discount">
        <el-col :span="2">
        <el-input placeholder="优惠金额货折扣，比如8折，请填写80；比如80元代金券，请填写80" v-model="editCoupon.discount"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="截止日期">
        <el-date-picker type="date" placeholder="请选择日期" @change="endData" v-model="editCoupon.deadline"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="add-btn" @click="submit" :loading="listLoading">提交</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>
<script type="text/javascript">
import { listCoupon, updateCoupon } from '@/api/api'
export default {
  data () {
    return {
      editCoupon: {},
      editCouponRs: {
        // name: [{
        //   required: true,
        //   message: '请输入优惠券名称',
        //   trigger: 'blur'
        // }],
        // description: [{
        //   required: true,
        //   message: '请输入优惠券描述',
        //   trigger: 'blur'
        // }],
        // discount: [{
        //   required: true,
        //   message: '请输入优惠券金额',
        //   trigger: 'blur'
        // }],
      },
      preferential: [{
        label: '代金券',
        value: 'CASH',
      }, {
        label: '折扣券',
        value: 'DISCOUNT',
      } ],
      useRange: [{
        label: '房租',
        value: 'ROOM',
      }, {
        label: '水费',
        value: 'WATER',
      }, {
        label: '电费',
        value: 'ELECTRICITY',
      }, {
        label: '燃气费',
        value: 'GAS',
      }, {
        label: '服务管理费',
        value: 'MANAGEMENT',
      }, {
        label: '通用',
        value: 'NONE',
      } ],
      listLoading: false,
      id: '',
    }
  },
  created () {
    this.id = this.$route.query.id
    this.geteditInfo()
  },
  methods: {
    /* 选择截止日期 */
    endData (val) {
      this.editCoupon.deadline = val
    },
    // 获取编辑信息
    geteditInfo () {
      let that = this
      let para = {
        id: this.id,
      }
      that.listLoading = true
      listCoupon(para).then((res) => {
        let rescode = res.data.rescode
        let getData = res.data.data
        let resmsg = res.data.resmsg
        that.func.portInit(rescode, resmsg, function () {
          that.editCoupon = getData.coupon[0]
          that.listLoading = false
        })
      }).catch(function (err) {
        console.log(err)
      })
    },

    /* 提交 */
    submit () {
      let that = this
      that.$refs.editCoupon.validate((valid) => {
        if (valid) {
          that.$confirm('确认提交吗？', '提示', {}).then(() => {
            that.listLoading = true
            let para = Object.assign({}, that.editCoupon)
            updateCoupon(para).then((res) => {
              that.listLoading = false
              let rescode = res.data.rescode
              let resmsg = res.data.resmsg
              that.func.portInit(rescode, resmsg, function () {
                that.$message({
                  message: '提交成功',
                  type: 'success',
                })
                that.$refs['editCoupon'].resetFields()
                that.$router.push({
                  path: '/coupon',
                })
              })
            }).catch(function (err) {
              console.log(err)
            })
          }).catch(function () {
            that.listLoading = false
            that.$message({
              type: 'info',
              message: '已取消提交',
            })
          })
        }
      })
    },
  },
}
</script>
