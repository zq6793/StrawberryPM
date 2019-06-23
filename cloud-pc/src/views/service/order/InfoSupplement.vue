<template>
  <el-form ref="form" :model="form" label-width="160px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
    <el-form-item label="姓名" class="white-el-select">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="电话号码" class="white-el-select">
      <el-input v-model="form.phone"></el-input>
    </el-form-item>
    <el-form-item label="房间号码" class="white-el-select">
      <el-input v-model="form.room"></el-input>
    </el-form-item>
    <el-form-item label="证件类型">
      <el-select v-model="form.documentType" placeholder="请选择证件类型">
        <el-option label="身份证" value="身份证"></el-option>
        <el-option label="护照" value="护照"></el-option>
        <el-option label="军人身份证" value="军人身份证"></el-option>
        <el-option label="社会保障卡" value="社会保障卡"></el-option>
        <el-option label="武装警察身份证件" value="武装警察身份证件"></el-option>
        <el-option label="港澳通行证" value="港澳通行证"></el-option>
        <el-option label="台湾居民来往大陆通行证" value="台湾居民来往大陆通行证"></el-option>
        <el-option label="户口簿" value="户口簿"></el-option>
        <el-option label="临时居民身份证" value="临时居民身份证"></el-option>
        <el-option label="外国人永久居留证" value="外国人永久居留证"></el-option>
        <el-option label="其他" value="其他"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="证件号码" class="white-el-select">
      <el-input v-model="form.number"></el-input>
    </el-form-item>
    <el-form-item label="紧急联系人" class="white-el-select">
      <el-input v-model="form.emergencyContact"></el-input>
    </el-form-item>
    <el-form-item label="手机号码" class="white-el-select">
      <el-input v-model="form.emergencyPhone"></el-input>
    </el-form-item>
    <el-form-item label="起租时间">
      <el-col :span="11" class="white-el-select">
        <el-date-picker type="date" placeholder="选择日期" v-model="form.rentTime" style="width: 100%;"></el-date-picker>
      </el-col>
    </el-form-item>
    <el-form-item label="退房时间">
      <el-col :span="11" class="white-el-select">
        <el-date-picker type="date" placeholder="选择日期" v-model="form.retiringTime" style="width: 100%;"></el-date-picker>
      </el-col>
    </el-form-item>
    <el-form-item label="押金数额" class="white-el-select">
      <el-input v-model="form.depositAmount"></el-input>
    </el-form-item>
    <el-form-item label="押金月份" class="white-el-select">
      <el-input v-model="form.depositMonth"></el-input>
    </el-form-item>
    <el-form-item label="实际租金" class="white-el-select">
      <el-input v-model="form.realRent"></el-input>
    </el-form-item>
    <el-form-item label="实际管理费" class="white-el-select">
      <el-input v-model="form.actualFee"></el-input>
    </el-form-item>
    <el-form-item label="备注信息" class="white-el-select">
      <el-input v-model="form.information"></el-input>
    </el-form-item>
    <el-form-item label="5月份信息" class="white-el-select">
      <el-col :span="3">
        <el-input v-model="form.rent"></el-input>
      </el-col>
      <el-col :span="3">
        <el-input v-model="form.propertyFee"></el-input>
      </el-col>
      <el-col :span="3">
        <el-input v-model="form.hydropower"></el-input>
      </el-col>
      <el-col :span="3">
        <el-input v-model="form.itemFee"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-button type="primary">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      form: {
        name: '',
        phone: '',
        room: '',
        documentType: '',
        number: '',
        emergencyContact: '',
        emergencyPhone: '',
        rentTime: '',
        retiringTime: '',
        depositAmount: '',
        depositMonth: '',
        realRent: '',
        actualFee: '',
        information: '',
        rent: '',
        propertyFee: '',
        hydropower: '',
        itemFee: '',
      },
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    },
  },
}
</script>
