<template>
  <div>
    <el-col :span="4">
      <el-select placeholder="请选择省" v-model="form.province" @change="provinceSelect">
        <el-option v-for="item in provinceList" :key="item.province_id" :label="item.province" :value="item.province_id"></el-option>
      </el-select>
    </el-col>
    <el-col :span="4">
      <el-select placeholder="请选择市" v-model="form.city" @change="citySelect">
        <el-option v-for="item in cityList" :key="item.city_id" :label="item.city" :value="item.city_id"></el-option>
      </el-select>
    </el-col>
    <el-col :span="4">
      <el-select placeholder="请选择区" v-model="form.district">
        <el-option v-for="item in districtList" :key="item.district_id"
         :label="item.district" :value="item.district"></el-option>
      </el-select>
    </el-col>
    <el-col :span="6">
      <el-input placeholder="请输入详细地址" v-model="form.address" class="place">
      </el-input>
    </el-col>
  </div>
</template>

<script>
import { province, citys, districts } from '@/api/api'
export default {
  props: {
    defaultValue: Object,
  },
  data() {
    return {
      provinceList: [],
      cityList: [],
      districtList: [],
      form: {
        province: '110100',
        city: '',
        district: '',
        address: '',
      },
    }
  },
  mounted() {
    this.getProvince()
  },
  updated() {
    this.change()
  },
  watch: {
    defaultValue () {
      if (this.defaultValue) {
        this.form.province = this.defaultValue.province
        this.form.city = this.defaultValue.city
        this.form.district = this.defaultValue.district
        this.form.address = this.defaultValue.address
        this.getCity(this.defaultValue.province)
        this.getDistrict(this.defaultValue.city)
      }
    },
  },
  methods: {
    change() {
      this.$emit('set', this.form.province, this.form.city, this.form.district, this.form.address)
    },
    /* 获取 省列表 */
    getProvince() {
      let that = this
      let para = {}
      this.districtList = []
      this.form = {
        province: '',
        city: '',
        district: '',
      },
      province(para).then((res) => {
        that.provinceList = res
      }).catch(function(err) {
        console.log(err)
      })
    },
    /* 选择省 */
    provinceSelect(province_id) {
      if (province_id) {
        this.getCity(province_id)
      }
      let obj = {}
      obj = this.provinceList.find((item) => {
        return item.province_id === province_id
      })
      this.form.province = obj.province
    },

    /* 获取 市列表 */
    getCity(province_id) {
      let that = this
      citys(province_id).then((res) => {
        that.cityList = res
      }).catch(function(err) {
        console.log(err)
      })
    },
    /* 选择市 */
    citySelect(city_id) {
      if (city_id) {
        this.getDistrict(city_id)
      }
      let obj = {}
      obj = this.cityList.find((item) => {
        return item.city_id === city_id
      })
      this.form.city = obj.city
    },
    /* 获取 区列表 */
    getDistrict(city_id) {
      let that = this
      districts(city_id).then((res) => {
        that.districtList = res
      }).catch(function(err) {
        console.log(err)
      })
    },
  },
}
</script>
