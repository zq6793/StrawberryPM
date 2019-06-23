<template>
  <section class="fx-pages-main water">
    <el-form :inline="true" class="fx-table-sort-head">
      <el-form-item size="small">
        <el-button type="primary" size="small" @click="importFile">导入数据</el-button>
        <el-button type="primary" size="small" @click="handleAdd">生成账单</el-button>
      </el-form-item>
      <el-form-item size="small">
        <city-store-select :route-query="true" @set="refresh"></city-store-select>
      </el-form-item>
      <el-form-item size="small">
        <water-elect-select :route-query="true" @set="refresh"></water-elect-select>
      </el-form-item>
      <el-form-item class="selectl" size="small">
        <water-elect-status-select :route-query="true" @set="refresh"></water-elect-status-select>
      </el-form-item>
      <el-form-item size="small">
        <el-date-picker type="month" placeholder="请选择日期" @change="getMonth" v-model="monthTimes" value-format="yyyy-MM"></el-date-picker>
      </el-form-item>
      <el-form-item class="searchs inputs white-el-select" size="small">
        <text-search :route-query="true" :options="searchOptions" @set="refresh"></text-search>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="storeList" highlight-current-row @selection-change="selsChange" style="width: 100%;" v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="store.name" label="门店名称" width="210">
      </el-table-column>
      <el-table-column prop="resident.name" label="姓名">
      </el-table-column>
      <el-table-column prop="room_s.number" label="房间号">
      </el-table-column>
      <el-table-column prop="type" label="类型">
      </el-table-column>
      <el-table-column prop="last_time" label="上次抄表时间" width="100">
      </el-table-column>
      <el-table-column prop="" label="上次读数" width="180">
        <template slot-scope="scope">
          <el-button type="text" @click="looklastImgs(scope.$index, scope.row)" v-if="scope.row.last_image">{{ scope.row.last_reading }} &nbsp;查看</el-button>
          <span v-else>{{ scope.row.last_reading }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="this_time" label="本次抄表时间" width="100">
      </el-table-column>
      <el-table-column prop="" label="本次读数" width="180">
        <template slot-scope="scope">
          <el-button type="text" @click="lookImgs(scope.$index, scope.row)" v-if="scope.row.this_image">{{ scope.row.this_reading }} &nbsp;查看</el-button>
          <span v-else>{{ scope.row.this_reading }}</span>
        </template>
      </el-table-column>
      <el-table-column label="差值" prop="short">
        <template slot-scope="scope">
          <span :class='{ price: (scope.row.short <= "0") ? true :false,
                          noprice: (scope.row.short=="") ? true :false}'>
              {{ scope.row.short }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="费用" prop="price">
        <template slot-scope="scope">
          <span :class='{ price:(scope.row.price == "上传读数有误")?true:false,
          noprice: (scope.row.short=="") ? true :false}'>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="order_status">
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.$index, scope.row)">
            修改
          </el-button>
          <el-button type="text" @click="replaceTable(scope.$index, scope.row)">
            换表
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改 -->
    <el-dialog title="提示" :visible.sync="isPrivilege" :close-on-click-modal="false" class="changeam" @close="closeChange">
      <el-form label-width="70px">
        <el-form-item label="本次读数">
          <el-input v-model="editRead.this_reading"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="nameImg" placeholder="请上传上次表读数的图片" disabled="true"></el-input>
        </el-form-item>
        <el-upload class="upload-demo" :action="uploadimg()" multiple :on-success="success" :before-upload="beforelo" :headers="headers" name="image" :on-progress="handleProgress">
          <el-button size="small" type="primary" class="uploads" v-loading="listLoadImg" :disabled="isClickimg">上传图片</el-button>
          <div slot="tip" class="el-upload__tip"></div>
        </el-upload>
        <el-form-item label="修改原因">
          <el-input type="textarea" placeholder="请填写修改原因" :rows="4" v-model="editRead.reason"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="comfir" type="primary" @click="updatedFree" v-loading='uploading'>提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 换表 -->
    <el-dialog title="提示" :visible.sync="isReplace" class="repalceam" @close="closeValue">
      <el-form :inline="true" :label-width="60">
        <el-form-item label="选择日期">
          <el-date-picker type="date" placeholder="请选择日期" @change="changemonth" v-model="changeRead.time"></el-date-picker>
        </el-form-item>
        <el-form-item label="旧表读数">
          <el-input v-model="changeRead.old_meter_reading" size="small"></el-input>
        </el-form-item>
        <el-form-item label="" style="margin-left:67px;">
          <el-input v-model="nameOne" placeholder="请上传旧表读数的图片" disabled="true" size="small"></el-input>
          <el-upload class="upload-demo" :action="uploadimg()" multiple :on-success="successone" :before-upload="beforelone" :headers="headers" name="image" :on-progress="progressone">
            <el-button size="small" type="primary" class="uploads" v-loading="listLoadImgone" :disabled="isClickimgone">上传图片</el-button>
            <div slot="tip" class="el-upload__tip"></div>
          </el-upload>
        </el-form-item>
        <el-form-item label="新表读数">
          <el-input v-model="changeRead.new_meter_reading" size="small"></el-input>
        </el-form-item>
        <el-form-item label="" style="margin-left:67px;">
          <el-input v-model="nameTwo" placeholder="请上传新表读数的图片" disabled="true" size="small"></el-input>
          <el-upload class="upload-demo" :action="uploadimg()" multiple :on-success="successtwo" :before-upload="beforeltwo" :headers="headers" name="image" :on-progress="progresstwo">
            <el-button size="small" type="primary" class="uploads" v-loading="listLoadImgtwo" :disabled="isClickimgtwo">上传图片</el-button>
            <div slot="tip" class="el-upload__tip"></div>
          </el-upload>
        </el-form-item>
        <el-button class="comfir" type="primary" @click="changeFree" v-loading="listLoadImgtwos">提交</el-button>
      </el-form>
    </el-dialog>
    <!-- 生成账单 -->
    <el-dialog title="生成门店的账单" v-model="showGenerateOrders" :visible.sync="showGenerateOrders" @close="close" class="produce_bill">
      <el-form label-width="68px">
        <el-form-item label="选择门店" class="select" size="small">
            <city-store-select :route-query="true" @set="pushBill"></city-store-select>
        </el-form-item>
        <el-form-item label="类型" size="small">
          <water-elect-select :route-query="true" @set="pushBill"></water-elect-select>
        </el-form-item>
        <el-form-item label="选择日期" size="small">
          <el-date-picker
            type="month"
            placeholder="请选择日期"
            @change="handleSetGOrderData"
            value-format="yyyy-MM"
            v-model="dialogmonthTimes">
          </el-date-picker>
        </el-form-item>
        <el-button class="comfirs" type="primary" @click="createBills" :disabled="isClick" v-loading="listLoadings">确认</el-button>
      </el-form>
    </el-dialog>
    <!-- 导入数据 -->
    <el-dialog title="导入水电数据" v-model="isLead" :visible.sync="isLead" class="allUpload" @close="closes">
      <el-form label-width="70px">
        <el-form-item label="选择门店" size="small">
          <city-store-select @set="handleSetStore"></city-store-select>
        </el-form-item>
        <el-form-item label="表计类型" size="small">
          <water-elect-select @set="handleSetType"></water-elect-select>
        </el-form-item>
        <el-form-item class="texts">
          <el-button type="text" @click="upFile">下载水电导入模板</el-button>
        </el-form-item>
        <el-form-item label="文件上传" class="upload">
          <el-upload
            class="upload-demo"
            drag
            :action="uploadUrl()" name='file' multiple :on-success="handleAvatarSuccess" :before-upload="beforeLoad" ref="upload" :headers="headers" :on-progress="progressE">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">请下载模板文件，填写水电读数后进行上传</div>
          </el-upload>
        </el-form-item>
        <el-button class="comfirs" type="primary" @click="comfirLead" :disabled="isClick" v-loading="exportLoading">确认</el-button>
      </el-form>
    </el-dialog>
    <!-- 获取上次表图片 -->
    <el-dialog title="水电读数照片" :visible.sync="imgBox" width="30%" :close-on-click-modal="false" append-to-body class="oldImg">
      <img :src="last_image" alt="" @click="bigImg" class="images_url" ref="img" width="100%">
    </el-dialog>
      <!-- 获取本次表图片 -->
      <el-dialog title="水电读数照片" :visible.sync="imgBoxs" width="30%" :close-on-click-modal="false" append-to-body class="oldImg">
        <img :src="this_image" alt="" @click="bigImgs" class="images_url" ref="imgs" width="100%">
    </el-dialog>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
          <pagination-select :route-query="true" :total="total" @set="refresh"></pagination-select>
        </el-col>
        <el-dialog title="提示" :visible.sync="textInfo" width="30%" :close-on-click-modal="false" append-to-body class="table_error">
          <el-table :data="readList" highlight-current-row @selection-change="selsChange" style="width: 100%;" v-loading="listLoading" border tooltip-effect="dark">
            <el-table-column prop="id" label="ID">
              <template slot-scope="scope">
                <span :class='{ errortext: scope.row.error != ""}'>{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="number" label="房间号">
              <template slot-scope="scope">
                <span :class='{ errortext: scope.row.error != ""}'>{{ scope.row.number }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="this_reading" label="本次读数">
              <template slot-scope="scope">
                <span :class='{ errortext: scope.row.error != ""}'>{{ scope.row.this_reading }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="weight" label="权重">
              <template slot-scope="scope">
                <span :class='{ errortext: scope.row.error != ""}'>{{ scope.row.weight }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="error" label="报错信息">
              <template slot-scope="scope">
                <span :class='{ errortext: scope.row.error != ""}'>{{ scope.row.error }}</span>
              </template>
            </el-table-column>
          </el-table>
          <p class="text">如果确认没问题请点击确认更新读数</p>
          <el-button type="primary" @click="primaryLead" :disabled="isClick" v-loading="exportLoading">确认</el-button>
        </el-dialog>
  </section>
</template>
<script type="text/javascript">
import { CityStoreSelect, PaginationSelect, TextSearch } from '@/components/selects'
import { WaterElectSelect, WaterElectStatusSelect } from '@/components/finance'
import { listutility, confirm, updateNumber, changeMeter, readingtemplate, getRead, saveReading } from '@/api/api'
export default {
  components: {
    CityStoreSelect,
    PaginationSelect,
    TextSearch,
    WaterElectSelect,
    WaterElectStatusSelect,
  },
  data() {
    return {
      total: 0,
      listLoading: false,
      store_id: '',
      building_id: '',
      storesList: [],
      readList: [],
      errorList: [],
      digList: [],
      buildingList: '',
      last_image: '',
      this_image: '',
      input: '',
      status: '',
      monthTimes: '',
      types: '',
      file_url: '',
      year: '',
      month: '',
      nameImg: '',
      nameOne: '',
      nameTwo: '',
      isClickimg: false,
      isClickimgone: false,
      isClickimgtwo: false,
      listLoadImg: false,
      listLoadImgone: false,
      listLoadImgtwo: false,
      listLoadImgtwos: false,
      textInfo: false,
      uploading: false,
      isClick: false,
      isclick: false,
      listLoadings: false,
      months: '',
      isPrivilege: false,
      showGenerateOrders: false,
      imgBox: false,
      imgBoxs: false,
      isReplace: false,
      changeRead: {
        id: '',
        time: '',
        old_meter_reading: '',
        old_meter_image: '',
        new_meter_reading: '',
        new_meter_image: '',
      },
      editRead: {
        this_reading: '',
        id: '',
        image: '',
        reason: '',
      },
      createBill: {
        store_id: '',
        type: '',
        year: '',
        month: '',
      },
      isLead: false,
      leadOption: {
        store_id: '',
        type: '',
      },
      adjlead: {
        store_id: '',
        url: '',
        files: '',
        type: '',
      },
      storeLead: [],
      replaceList: {},
      searchOptions: [
        { label: '房间号', key: 'number' },
        // { label: '姓名', key: 'search' },
      ],
      currTime: '',
      dialogmonthTimes: '',
    }
  },
  mounted() {
    this.getCurrTime()
    this.refresh()
  },
  computed: {
    headers() {
      return {
        'Token': sessionStorage.getItem('token'),
      }
    },
  },
  methods: {
    refresh () {
      this.listutility()
    },
    pushBill() {
      let para = this.queryOption()
      this.createBill.store_id = para.store_id
      this.createBill.type = para.type
    },
    uploadUrl() {
      return this.fxCfg.file_upload_url
    },
    // 使文件上传文件隐藏
    isShow() {
      this.$refs.upload.$el.lastElementChild.style.display = 'none'
    },
    beforeLoad(file) {
      const isFile = file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type == 'application/vnd.ms-excel'
      if (!isFile) {
        this.$message.error('上传的文件必须是.xlsx或者.xls格式的')
      }
      return isFile
    },
    progressE() {
      this.exportLoading = true
      this.isClick = true
    },
    handleAvatarSuccess(res, file) {
      this.$message.success('文件上传成功')
      this.adjlead.url = file.response.data.file_url
      this.adjlead.files = file.raw.name
      this.exportLoading = false
      this.isClick = false
    },
    handleSetStore(city, storeId) {
      this.createBill.store_id = storeId
      this.leadOption.store_id = storeId
      this.adjlead.store_id = storeId
    },
    handleSetType(val) {
      this.createBill.type = val
      this.leadOption.type = val
      this.adjlead.type = val
    },
    // ------------------ 表读数图片上传 --------------------
    uploadimg() {
      return this.fxCfg.image_upload_url
    },
    handleProgress() {
      this.listLoadImg = true
      this.isClickimg = true
    },
    beforelo(file) {
      const isJPG = file.type == 'image/jpeg' || file.type == 'image/png'
      if (!isJPG) {
        this.$message.error('上传的图片必须是png、jpeg、png的图片')
      }
      return isJPG
    },
    success(res, file) {
      this.editRead.image = file.response.data.image_url
      this.nameImg = file.name
      this.listLoadImg = false
      this.isClickimg = false
      this.$message.success('图片上传成功')
    },
    // ------------------ 换表上传图片 --------------------
    changemonth(val) {
      this.changeRead.time = val
    },
    progressone() {
      this.listLoadImgone = true
      this.isClickimgone = true
    },
    beforelone(file) {
      const isJPG = file.type == 'image/jpeg' || file.type == 'image/png'
      if (!isJPG) {
        this.$message.error('上传的图片必须是png、jpeg、png的图片')
      }
      return isJPG
    },
    successone(res, file) {
      this.changeRead.old_meter_image = file.response.data.image_url
      this.nameOne = file.name
      this.listLoadImgone = false
      this.isClickimgone = false
      this.$message('图片上传成功')
    },
    progresstwo() {
      this.listLoadImgtwo = true
      this.isClickimgtwo = true
    },
    beforeltwo(file) {
      const isJPG = file.type == 'image/jpeg' || file.type == 'image/png'
      if (!isJPG) {
        this.$message.error('上传的图片必须是png、jpeg、png的图片')
      }
      return isJPG
    },
    successtwo(res, file) {
      this.changeRead.new_meter_image = file.response.data.image_url
      this.nameTwo = file.name
      this.listLoadImgtwo = false
      this.isClickimgtwo = false
      this.$message('图片上传成功')
    },

    // 月时间
    handleSetGOrderData(val) {
      if (val != undefined) {
        this.createBill.year = val.substr(0, 4)
        this.createBill.month = val.substr(5, 2)
      }
    },
    getCurrTime() {
      this.currTime = new Date()
      this.monthTimes += this.currTime.getFullYear() + '-'
      this.monthTimes += (this.currTime.getMonth() + 1) < 10 ? '0' + (this.currTime.getMonth() + 1) : (this.currTime.getMonth() + 1)
      this.getMonth(this.monthTimes)
    },
    // 月时间
    getMonth(val) {
      if (val) {
        this.year = val.substr(0, 4)
        this.month = val.substr(5, 6)
        this.listutility()
      } else {
        this.year = ''
        this.month = ''
        this.listutility()
      }
    },
    searchType() {
      this.types = this.types
      this.listutility()
    },
    searchStatus() {
      this.status = this.status
      this.listutility()
    },
    /* 获取列表 */
    listutility() {
      let that = this
      let para = this.queryOption()
      para.month = that.month
      para.year = that.year
      // para.page = 9
      para.building_id = that.building_id
      that.listLoading = true
      listutility(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data
        that.func.portInit(rescode, resmsg, function() {
          getData.list.forEach((item) => {
            item.short = (item.this_reading - item.last_reading).toFixed(2)
            if (item.type == 'COLD_WATER_METER') {
              item.price = (item.short * Number(item.room_s.cold_water_price)).toFixed(2)
            } else if (item.type == 'HOT_WATER_METER') {
              item.price = (item.short * Number(item.room_s.hot_water_price)).toFixed(2)
            } else if (item.type == 'ELECTRIC_METER') {
              item.price = (item.short * Number(item.room_s.electricity_price)).toFixed(2)
            } else if (item.type == 'GAS_METER') {
              item.price = (item.short * Number(item.room_s.gas_price)).toFixed(2)
            }
            if (item.price < 0) {
              item.price = '上传读数有误'
            }
            if (item.last_reading === '' || item.last_time === '') {
              item.last_reading = ''
              item.price = ''
              item.short = ''
              item.last_time = ''
            }
            item.type = that.func.waterTypeTra(item.type)
            item.order_status = that.func.waterStatus(item.order_status)
            if (item.order_status == '未上传读数') {
              item.this_time = ''
              item.this_reading = ''
              item.short = ''
              item.price = ''
            }
          })
          that.storeList = getData.list
          that.total = getData.count * 10
          that.listLoading = false
        })
      }).catch(function(err) {
        console.log(err)
      })
    },
    // 查看上次表读数照片
    looklastImgs(index, row) {
      if (!row.last_image) {
        this.$message({
          message: '无上次读数图片',
          type: 'warning',
        })
      } else {
        this.imgBox = true
        this.last_image = row.last_image
      }
    },
    // 查看本次表读数照片
    lookImgs(index, row) {
      if (!row.this_image) {
        this.$message({
          message: '无本次读数图片',
          type: 'warning',
        })
      } else {
        this.imgBoxs = true
        this.this_image = row.this_image
      }
    },
    bigImg() {
      if (this.$refs.img.width == 200) {
        this.$refs.img.style.width = 300 + 'px'
        this.$refs.img.style.height = 300 + 'px'
        this.$refs.img.style.margin = -36 + 'px'
      } else {
        this.$refs.img.style.width = 200 + 'px'
        this.$refs.img.style.height = 200 + 'px'
        this.$refs.img.style.margin = 0 + 'px'
      }
    },
    bigImgs() {
      if (this.$refs.imgs.width == 200) {
        this.$refs.imgs.style.width = 300 + 'px'
        this.$refs.imgs.style.height = 300 + 'px'
        this.$refs.imgs.style.margin = -36 + 'px'
      } else {
        this.$refs.imgs.style.width = 200 + 'px'
        this.$refs.imgs.style.height = 200 + 'px'
        this.$refs.imgs.style.margin = 0 + 'px'
      }
    },
    // -------------------------------------   导入数据 ------------------------------------------
    /* 导入 */
    importFile() {
      this.isLead = true
    },
    upFile() {
      let that = this
      let name = ''
      let type = ''
      let para = Object.assign({}, that.leadOption)
      that.exportLoading = true
      that.isClick = true
      that.func.emptyVul(para, function() {
        that.exportLoading = false
        that.isClick = false
      }, function() {
        that.storeLead.forEach((item) => {
          if (item.id == para.store_id) {
            name = item.name
          }
        })
        type = that.func.waterTypeTra(para.type)
        name = name + type
        readingtemplate(para).then((res) => {
          if (res.status == 200) {
            let blob = new Blob([res.data], { type: 'application/octet-stream;charset=utf-8' }) // 创建一个blob对象
            let a = document.createElement('a') // 创建一个<a></a>标签
            a.href = URL.createObjectURL(blob) // response is a blob
            a.download = name + '.xlsx' // 文件名称
            a.style.display = 'none'
            document.body.appendChild(a)
            a.click()
            a.remove()
            that.$message.success('下载水电读数模板成功')
            that.exportLoading = false
            that.isClick = false
          }
        })
      })
    },
    comfirLead() {
      let that = this
      let para = Object.assign({}, that.adjlead)
      that.exportLoading = true
      that.isClick = true
      if (!that.adjlead.url) {
        that.$message.error('请上传文件')
        that.exportLoading = false
        that.isClick = false
      } else {
        getRead(para).then((res) => {
          if (res.data.rescode == 0) {
            that.exportLoading = false
            that.isClick = false
            that.textInfo = true
            that.readList = res.data.data
          }
        })
      }
    },
    primaryLead() {
      let that = this
      let para = {
        data: that.readList,
      }
      para.data = JSON.stringify(para.data)
      that.exportLoading = true
      that.isClick = true
      that.$confirm('此操作会导入水电读数', '提示', { type: 'warning' }).then(() => {
        saveReading(para).then((res) => {
          if (res.data.rescode == 0) {
            that.$message.success('导入数据成功')
            that.textInfo = false
            that.isLead = false
            that.exportLoading = false
            setTimeout(() => {
              that.isClick = false
            }, 1200)
          }
        })
      })
    },
    closes() {
      this.func.clearVul(this.adjlead)
      this.func.clearVul(this.storeLead)
      this.storeLead.length = 0
      this.exportLoading = false
      this.isClick = false
    },
    /* 生成订单 */
    handleAdd() {
      this.showGenerateOrders = true
      this.dialogmonthTimes = ''
      this.pushBill()
    },
    createBills() {
      let that = this
      let para = Object.assign({}, that.createBill)
      that.isClick = true
      that.listLoadings = true
      that.func.emptyVul(para, function() {
        that.isClick = false
        that.listLoadings = false
      }, function() {
        confirm(para).then((res) => {
          let rescode = res.data.rescode
          let resmsg = res.data.resmsg
          that.func.portInit(rescode, resmsg, function() {
            that.$message({
              message: '生成账单成功',
              type: 'success',
            })
            that.showGenerateOrders = false
            setTimeout(() => {
              that.isClick = false
            }, 2000)
          })
        }).catch(function(err) {
          console.log(err)
        })
      })
    },
    close() {
      this.func.clearVul(this.createBill)
      this.listLoadings = false
    },
    selsChange(sels) {
      this.sels = sels
    },
    handleEdit(index, row) {
      let that = this
      that.editRead.this_reading = row.this_reading.toString()
      that.editRead.id = row.id
      that.isPrivilege = true
    },
    // 修改表的度数
    updatedFree() {
      let that = this
      that.uploading = true
      that.func.emptyVul(that.editRead, function() {
        that.uploading = false
      }, function() {
        let para = Object.assign({}, that.editRead)
        updateNumber(para).then(res => {
          that.uploading = false
          let rescode = res.data.rescode
          let resmsg = res.data.resmsg
          that.func.portInit(rescode, resmsg, function() {
            that.$message({
              message: '修改成功',
              type: 'success',
            })
            that.listutility()
            that.isPrivilege = false
          })
        }).catch(function(err) {
          console.log(err)
        })
      })
    },
    closeChange() {
      this.nameImg = ''
      this.func.clearVul(this.editRead)
    },
    // 换表读数
    replaceTable(index, row) {
      this.changeRead.old_meter_reading = row.this_reading.toString()
      this.changeRead.id = row.id
      this.isReplace = true
    },
    changeFree() {
      let that = this
      that.listLoadImgtwos = true
      that.func.emptyVul(that.changeRead, function() {
        that.listLoadImgtwos = false
      }, function() {
        let para = Object.assign({}, that.changeRead)
        changeMeter(para).then(res => {
          that.listLoadImgtwos = false
          let rescode = res.data.rescode
          let resmsg = res.data.resmsg
          that.func.portInit(rescode, resmsg, function() {
            that.$message({
              message: '换表成功',
              type: 'success',
            })
            that.listutility()
            that.isReplace = false
          })
        }).catch(function(err) {
          console.log(err)
        })
      })
    },
    closeValue() {
      this.nameOne = ''
      this.nameTwo = ''
      this.listLoadImgtwos = false
      this.func.clearVul(this.changeRead)
    },

  },
}

</script>
