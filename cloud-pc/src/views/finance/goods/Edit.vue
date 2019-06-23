<template>
  <section class="fx-pages-main editgoods">
    <el-form ref="addStore" label-width="100px" style="margin:20px;  min-width:200px;" class="addform">
      <el-form-item label="选择公寓" prop="name">
        <el-select v-model="city" placeholder="请选择公寓" size="small" @change="searchCity" style="color:#fff">
          <el-option v-for="item in cityList" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择户型" prop="name">
        <el-select v-model="city" placeholder="请选择户型" size="small" @change="searchCity" style="color:#fff">
          <el-option v-for="item in cityList" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择房间" prop="name">
        <el-select v-model="city" placeholder="请选择房间" size="small" @change="searchCity" style="color:#fff">
          <el-option v-for="item in cityList" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择年份">
        <el-date-picker type="year" placeholder="请选择年份" @change="startTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="选择月份">
        <el-date-picker type="month" placeholder="请选择月份" @change="endTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="填写费用" prop="name">
        <el-input v-model="input" placeholder="请填写缴纳费用金额" class="input" style="width:400px"></el-input><span class="money">元</span>
      </el-form-item>
      <el-button type="primary" class="submit">提交</el-button>
    </el-form>
  </section>
</template>
<script type="text/javascript">
export default {
  data () {
    return {
      city: '',
      cityList: [],
      store_id: '',
      storeList: '',
      input: '',
    }
  },
  mounted () {

  },
  methods: {

  },
}
</script>
