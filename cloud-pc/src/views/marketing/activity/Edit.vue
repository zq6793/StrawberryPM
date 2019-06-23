<template>
  <section class="fx-pages-main edit-activity">
    <!--工具条-->
    <el-form ref="addActivity" :model="addActivity" label-width="100px" style="margin:20px; min-width:200px;" :rules="addActivityRs" class="cont">
      <div class="titles">活动信息</div>
      <hr/>
      <el-form-item label="活动类型" class="white-el-select">
        <el-select placeholder="请选择活动类型">
          <el-option v-for="item in activitys" :key="item.label" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动名称">
        <el-input placeholder="请填写活动名称"></el-input>
      </el-form-item>
      <el-form-item label="开始日期" prop="">
        <el-date-picker type="date" placeholder="请选择日期" @change="startData"></el-date-picker>
      </el-form-item>
      <el-form-item label="截止日期" prop="">
        <el-date-picker type="date" placeholder="请选择日期" @change="endData"></el-date-picker>
      </el-form-item>
      <el-form-item label="参与公寓">
        <el-checkbox-group class="checkBox" @change="apartmentChange">
          <el-checkbox v-for="item in apartment" :label="item" :key="item">{{ item }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <div class="titles">内容分级</div>
      <hr/>
      <el-form-item label="等级一" class="white-el-select">
        <el-select placeholder="请选择活优惠券">
          <el-option v-for="item in coupons" :key="item.label" :label="item.label" :value="item.value"></el-option>
        </el-select>
        </br>
        <el-input placeholder="请输入赠送张数" type="number"></el-input>
        </br>
        <el-input placeholder="请输入获取该优惠券的最低助理数量"></el-input>
        </br>
      </el-form-item>
      <el-form-item label="等级二" class="white-el-select">
        <el-select placeholder="请选择活优惠券">
          <el-option v-for="item in coupons" :key="item.label" :label="item.label" :value="item.value"></el-option>
        </el-select>
        </br>
        <el-input placeholder="请输入赠送张数" type="number"></el-input>
        </br>
        <el-input placeholder="请输入获取该优惠券的最低助理数量"></el-input>
        </br>
      </el-form-item>
      <el-form-item label="等级三" class="white-el-select">
        <el-select placeholder="请选择活优惠券">
          <el-option v-for="item in coupons" :key="item.label" :label="item.label" :value="item.value"></el-option>
        </el-select>
        </br>
        <el-input placeholder="请输入赠送张数" type="number"></el-input>
        </br>
        <el-input placeholder="请输入获取该优惠券的最低助理数量"></el-input>
        </br>
      </el-form-item>
      <el-form-item label="简要描述">
        <el-input placeholder="请对该活动简要描述" :rows="5" type="textarea"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="add-btn" @click="submit" :loading="addLoading">提交</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>
<script type="text/javascript">
// import {  } from "../../api/api";
export default {
  data () {
    return {
      addActivity: {

      },
      addActivityRs: {

      },
      activitys: [{
        label: '普通活动',
        value: '普通活动',
      }, {
        label: '吸粉活动',
        value: '吸粉活动',
      }, {
        label: '房租打折活动',
        value: '房租打折活动',
      } ],
      apartment: ['金地草莓社区', 'we', '优城店' ],
      coupons: [],
      addLoading: false,
    }
  },
  mounted () {},

  methods: {
    /* 选择开始日期 */
    startData (val) {
      // console.log(val)
    },

    /* 选择截止日期 */
    endData (val) {
      // console.log(val)
    },

    /* 选择参与公寓 */
    apartmentChange (value) {
      // console.log(value)
    },

    /* 提交 */
    submit () {

    },
  },
}
</script>
