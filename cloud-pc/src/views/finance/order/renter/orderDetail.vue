<template>
  <el-dialog title="账单详情" :visible.sync="show" v-if="show" width="80%" @close="closeDialog">
    <div class="fx-head-s">
      {{title.store_name}}&nbsp;&nbsp;
      {{title.room_number}}&nbsp;&nbsp;
      {{title.resident_name}}&nbsp;&nbsp;
      {{title.pay_circle}}
    </div>
    <el-row class="fx-head-s">
      <el-col :span="9">应收:￥<span style="color:rgb(231,174,94);">{{ allmoney|money }}</span></el-col>
      <el-col :span="9">已收:￥<span style="color:rgb(231,174,94);">{{ allpayd|money }}</span></el-col>
    </el-row>

    <el-table v-if="flashlist" :data="list" border :summary-method="getSummaries">
      <el-table-column label="费用类型" prop="fee_name">
      </el-table-column>
      <el-table-column label="详细信息" prop="detail" min-width="100">
      </el-table-column>
      <el-table-column label="应收" prop="money">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input :min="0.1" v-model="scope.row.newVal" :placeholder="scope.row.money" type="number" size="small"/>
          </template>
          <span v-else>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已收" prop="paid">
      </el-table-column>
      <el-table-column label="状态" prop="status">
      </el-table-column>
      <el-table-column label="备注" prop="remark" width="280">
        <template slot-scope="scope" v-if="scope.row.edit">
          <el-input size="small" placeholder="请填写修改原因(必填 *)" v-model="scope.row.newRemark"></el-input>
        </template>
        <template slot-scope="scope" v-else>
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span v-if="scope.row.edit">
            <el-button type="text" size="small"  @click="cancelEdit(scope.$index, scope.row)">取消</el-button>
          </span>
          <el-button
            type="text"
            size="small"
            v-if="isEnableEdit(scope.row)&&!scope.row.edit"
            @click="addEdit(scope.$index, scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--添加额外费用-->
    <el-table v-if="addCostShow" :data="addlist" :show-header="false"  border style="border-top:0px;">
      <el-table-column label="费用类型" width="200">
        <template slot-scope="scope">
          <fee-type-select @set="handleSetFeeType" :index="scope.$index"></fee-type-select>
        </template>
      </el-table-column>
      <el-table-column label="详细信息" min-width="350">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.circle"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions2" size="small">
          </el-date-picker>
        </template>
      </el-table-column>
        <el-table-column label="已收" prop="paid" width="100">
      </el-table-column>
      <el-table-column label="应收" width="150">
        <template slot-scope="scope">
          <el-input :min="0.1" size="small" type="number" v-model="scope.row.money" />
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" width="280">
        <template slot-scope="scope">
          <template>
            <el-input size="small" placeholder="请填写添加原因(必填 *)" v-model="scope.row.remark"></el-input>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作"  width="80">
        <template slot-scope="scope">
           <el-button type="text" size="small"  @click.native.prevent="deleteRow(scope.$index, addlist)" style="color: rgb(201,103,98);">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-row class="fx-head-b">
      <el-col :span="3">
        <el-button type="text" @click="addOneExpense()">添加费用</el-button>
      </el-col>
      <el-col :offset="18" :span="3">
        <el-button type="primary" @click="submit">确认修改</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { updateOrder2 } from '@/api/api'
import { FeeTypeSelect } from '@/components/finance'
export default {
  components: {
    FeeTypeSelect,
  },
  props: {
    show: Boolean,
    list: Array,
    title: Object,
    data: Object,
    addCostShow: Boolean,
  },
  data() {
    return {
      addlist: [],
      isSubmit: false,
      useable: false,
      flashlist: true,
    }
  },
  computed: {
    allmoney () {
      let m = 0
      let arr = this.list
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].status == '已关闭') {
          arr.splice(i, 1)
        }
      }
      for (const fee of arr) {
        m += fee.money
      }
      return m
    },
    allpayd () {
      let m = 0
      for (const fee of this.list) {
        m += fee.has_paid
      }
      return m
    },
    residentId () {
      if (this.data && this.data.resident_id) {
        return this.data.resident_id
      }
      return 0
    }
  },
  mounted() {
    this.addlist = []
  },
  watch: {
    show() {
      if (this.isSubmit) {
        this.$emit('set', this.isSubmit, this.residentId, this.title.pay_circle)
        this.isSubmit = false
      }
    }
  },
  methods: {
    isEnableEdit (item) {
      if (item.paid > 0) {
        return false
      }
      if (item.is_pay) {
        return false
      }
      if (item.status == '已完成' || item.status == '已关闭') {
        return false
      }
      return true
    },
    confirmEdit (row) {
      row.edit = false
      row.originalTitle = row.title
      this.$message({
        message: '提交成功',
        type: 'success'
      })
    },
    addEdit(idx, row) {
      console.log(idx, row, 'asdzxqwer')
      row.edit = true
      this.$emit('set-row-edit', idx, true)
      this.$emit('set-row-edit', idx, false)
      this.$emit('set-row-edit', idx, true)
      // this.list[idx].edit = true
      this.flashlist = true
      this.flashlist = false
      this.flashlist = true
      // row.newVal = row.money
      // row.newRemark = row.remark
    },
    cancelEdit(idx, row) {
      // row.title = row.originalTitle
      // row.edit = false
      this.$emit('set-row-edit', idx, false)
    },
    addOneExpense () {
      this.addlist = []
      this.addCostShow = true
      this.addlist.push({
        type: '',
        pay_circle: this.title.pay_circle,
        money: 0.0,
        begin_time: '',
        end_time: '',
        // resident_id: this.residentId,
        remark: '',
        circle: [],
      })
    },
    closeDialog() {
      this.addList = []
      this.$emit('close')
    },
    handleSetFeeType(typ, index) {
      this.addlist[index].type = typ
    },
    deleteRow(index, rows) {
      if (this.addlist.length <= 0) {
        this.addCostShow = false
      }
      rows.splice(index, 1)
    },
    submit() {
      let that = this
      for (const item of that.addlist) {
        console.log(item)
        if (item.type == '') {
          that.$message({
            type: 'error',
            message: '请选择费用类型'
          })
        }
        if (item.circle.length == 0) {
          that.$message({
            type: 'error',
            message: '请选择账单周期',
          })
          return
        }
        if (item.remark == '') {
          that.$message({
            type: 'error',
            message: '请填写添加原因',
          })
          return
        }
        if (item.circle.length != 0 && item.type != '' && item.remark != '') {
          item.begin_time = item.circle[0] + 'T00:00:01.0+08:00'
          item.end_time = item.circle[1] + 'T00:00:01.0+08:00'
          item.money = parseFloat(item.money)
          that.useable = true
        }
      }
      let modifyList = []
      for (const item of that.list) {
        if (item.newVal && item.newVal != item.money) {
          modifyList.push({
            id: item.id,
            money: parseFloat(item.newVal),
            remark: item.newRemark,
          })
          that.useable = true
        }
      }
      let body = {
        resident_id: that.residentId,
        pay_circle: that.title.pay_circle,
        adds: that.addlist,
        modifies: modifyList,
      }
      if (that.useable) {
        updateOrder2(body).then((res) => {
          if (res) {
            that.$message({
              type: 'success',
              message: '更新成功',
            })
            that.isSubmit = true
            that.show = false
            that.useable = false
            that.addlist = []
          } else {
            that.$message({
              type: 'error',
              message: res.message,
            })
            that.useable = false
            that.addlist = []
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    getSummaries(param) {
      console.log(param)
      // const { columns, data } = param;
      // const sums = [];
      // columns.forEach((column, index) => {
      // if (index === 0) {
      //   sums[index] = '总价';
      //   return;
      // }
      // console.log(column);
      // const values = data.map(item => Number(item[column.property]));
      // if (!values.every(value => isNaN(value))) {
      //   sums[index] = values.reduce((prev, curr) => {
      //     const value = Number(curr);
      //     if (!isNaN(value)) {
      //       return prev + curr;
      //     } else {
      //       return prev;
      //     }
      //   }, 0);
      //   sums[index] += ' 元';
      // } else {
      //   sums[index] = 'N/A';
      // }
      // });
      // return sums;
    },
  },
}
</script>
