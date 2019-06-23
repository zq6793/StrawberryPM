<template>
  <section class="adjustprice fx-pages-main">
    <el-form :inline="true" class="fx-table-sort-head">
      <el-form-item size="small">
        <el-button type="primary" size="small" @click="dialogFormVisible = true">+批量导入</el-button>
        <el-button type="primary" size="small" @click="isbatch = true">水电批量调价</el-button>
        <el-button type="primary" size="small" @click="comfirExport">批量导出</el-button>
      </el-form-item>
      <el-form-item size="small">
        <city-store-select :route-query="true"  @set="refresh"></city-store-select>
      </el-form-item>
      <el-form-item class="searchs" size="small">
        <text-search :route-query="true" :options="searchOptions" @set="refresh"></text-search>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="storeList" style="width: 100%;" v-loading="listLoading" border>
      <el-table-column prop="store_name" label="门店名称" width="260">
      </el-table-column>
      <el-table-column prop="number" label="房间号">
      </el-table-column>
      <el-table-column prop="rent_price" label="住宿服务费">
      </el-table-column>
      <el-table-column prop="property_price" label="物业服务费">
      </el-table-column>
      <el-table-column prop="hot_water_price" label="热水单价">
      </el-table-column>
      <el-table-column prop="cold_water_price" label="冷水单价">
      </el-table-column>
      <el-table-column prop="electricity_price" label="电费单价">
      </el-table-column>
      <el-table-column prop="gas_price" label="燃气单价">
      </el-table-column>
      <el-table-column prop="UpdatedAt" label="修改时间">
      </el-table-column>
      <el-table-column label="操作" width="53">
        <template slot-scope="scope">
          <el-button type="text" @click="modifyFree(scope.row)">调价</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <pagination-select :route-query="true" :total="total" @set="refresh"></pagination-select>
    <!--修改价格 -->
    <el-dialog title="调价设置" v-model="isPrivilege" :visible.sync="isPrivilege" @close="close" class="adjusechange">
      <el-form label-width="90px">
        <el-form-item label="调价类型">
          <el-select v-model="upPrice.type" placeholder="请选择调价类型" size="small">
            <el-option v-for="item in adjList" :key="item.id" :label="item.value" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请新价格">
          <el-input v-model="upPrice.new_price" placeholder="请输入新价格" size="small"></el-input>
        </el-form-item>
        <el-form-item label="调价原因">
          <el-input type="textarea" :rows="5" placeholder="请输入调价原因" v-model="upPrice.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <span class="text">确认调价后进入调价审批流程，审批通过后调价完成。</span>
          <el-button class="comfir" type="primary" @click="updatedFree" v-loading="listLoadings">
            确认调价
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--批量修改价格 -->
    <el-dialog title="批量修改价格" v-model="isbatch" :visible.sync="isbatch" @close="closes" class="batchchange">
      <el-form label-width="90px">
        <el-form-item label="选择门店" size="small">
          <city-store-select @set="handleSetStore"></city-store-select>
        </el-form-item>
        <el-form-item label="小区名称" class="select">
          <el-select v-model="digcommunity_id" placeholder="请选择" size="small">
            <el-option v-for="item in communityList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="change">
          <el-form-item label="热水单价" class="price">
            <el-col :span="12">
              <el-input v-model="info.hot_water_price" placeholder="请输入新热水价格" size="small">
                <template slot="append">(￥/吨)</template>
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="冷水单价" class="price">
            <el-col :span="12">
              <el-input v-model="info.cold_water_price" placeholder="请输入新冷水价格" size="small">
                <template slot="append">(￥/吨)</template>
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="电费单价" class="price">
            <el-col :span="12">
              <el-input v-model="info.electricity_price" placeholder="请输入新电费价格" size="small">
                <template slot="append">(￥/度)</template>
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="燃气单价" class="price">
            <el-col :span="12">
              <el-input v-model="info.gas_price" placeholder="请输入新燃气价格" size="small">
                <template slot="append">(￥/方)</template>
              </el-input>
            </el-col>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button class="comfir" type="primary" @click="upBatch" v-loading="listLoadings">确认调价</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 批量导出 -->
<!--     <el-dialog title="批量导出房间价格" v-model="allExport" :visible.sync="allExport" class="exports" @close="exportClose">
      <el-form label-width="68px">
        <el-form-item label="选择门店" size="small">
          <city-store-select @set="handleSetStore"></city-store-select>
        </el-form-item>
        <el-button class="comfirs" type="primary" @click="comfirExport" :disabled="isClick" v-loading="exportLoading">确认</el-button>
      </el-form>
    </el-dialog> -->
    <!-- 批量导入 -->
    <el-dialog title="批量上传" :visible.sync="dialogFormVisible" class="allUpload" @close="closeLead">
      <el-form label-width="70px">
        <el-form-item label="选择门店">
          <city-store-select @set="handleSetStore"></city-store-select>
          <el-button type="text primary" @click="upFile">点击下载模板</el-button>
        </el-form-item>
        <el-form-item label="文件上传" class="upload">
          <el-col :span="16">
            <el-upload class="upload-demo" drag :action="uploadUrl()" name='file' multiple :on-success="handleAvatarSuccess" :before-upload="beforeLoad" ref="upload" :headers="headers" :on-progress="progressE">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">请下载模板文件，修改对应价格后进行上传</div>
            </el-upload>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button class="comfirs" type="primary" @click="comfirLead" :disabled="isClick" v-loading="exportLoading">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="错误" :visible.sync="textInfo" width="30%" :close-on-click-modal="false" append-to-body class="errortext">
      <p v-for="(i, item) in errorList" :key=i tem><span>{{item+1}}.</span>{{i}} </p>
    </el-dialog>
  </section>
</template>
<script>
import { CityStoreSelect, TextSearch, PaginationSelect } from '@/components/selects'
import { roomList, updataRentpPice, batchCreate, adjExport, priceTemplate, importPrice } from '@/api/api'
export default {
  components: {
    CityStoreSelect,
    TextSearch,
    PaginationSelect,
  },
  data() {
    return {
      number: '', // 搜索房间号
      listLoading: false,
      listLoadings: false,
      // sels: [],
      page: 1,
      total: 0,
      city: '',
      store_id: '',
      storesList: [],
      isPrivilege: false,
      isbatch: false,
      digcity: '',
      digstore_id: '',
      digcommunity_id: '',
      communityList: [],
      upPrice: {
        room_id: '',
        type: '',
        new_price: '',
        remark: '',
      },
      allExport: false,
      exportLoading: false,
      textInfo: false,
      isClick: false,
      adjExport: {
        city: '',
        store_id: '',
      },
      adjList: [
        {
          id: 'ELECTRICITY',
          value: '电费',
        },
        {
          id: 'WATER',
          value: '冷水',
        },
        {
          id: 'HOTWATER',
          value: '热水',
        },
        {
          id: 'GASMETER',
          value: '燃气',
        },
        {
          id: 'ROOM',
          value: '住宿服务费',
        },
        {
          id: 'MANAGEMENT',
          value: '物业服务费',
        },
      ],
      dialogFormVisible: false,
      storeLead: [],
      adjlead: {
        city: '',
        store_id: '',
        url: '',
        files: '',
      },
      searchOptions: [
        { label: '房间号', key: 'number' },
        // { label: '房型特点', key: 'search' },
      ],
      info: {
        hot_water_price: '',
        cold_water_price: '',
        electricity_price: '',
        gas_price: '',
      },
      storeList: [],
    }
  },

  mounted() {
    this.refresh()
  },
  computed: {
    flowLists() {
      return this.$store.getters.taskflows
    },
    headers() {
      return {
        'Token': sessionStorage.getItem('token'),
      }
    },
  },
  methods: {
    refresh() {
      this.getPrice()
    },
    handleSetStore(city, storeId) {
      this.city = city
      this.store_id = storeId
    },
    handleClick(tab) {
      if (tab.label == '集中式') {
        this.label = tab.label
      } else {
        this.label = tab.label
      }
    },
    /* 批量导入 */
    handleAdd() {},
    // handleCurrentChange(val) {
    //   this.page = val
    //   this.getPrice()
    // },
    searchName() {
      this.store_id = this.store_id
      this.getPrice()
    },
    searchAll() {
      this.getPrice()
    },

    getPrice() {
      let that = this
      let para = this.queryOption()
      roomList(para).then((res) => {
        that.storeList = res.items
        that.storeList.forEach((item) => {
          item.UpdatedAt = this.fxFilter.goTime(item.UpdatedAt)
        })
        that.total = res.count
      }).catch(function(err) {
        console.log(err)
      })
    },
    // selsChange(sels) {
    //   this.sels = sels
    // },
    /* 修改物业费 */
    modifyFree(row) {
      let that = this
      that.isPrivilege = true
      that.upPrice.room_id = row.ID
    },

    /* 提交修改物业费 */
    updatedFree() {
      let that = this
      that.listLoadings = true
      let para = Object.assign({}, that.upPrice)
      that.func.emptyVul(para, function() {
        that.listLoadings = false
      }, function() {
        updataRentpPice(para).then((res) => {
          that.listLoadings = false
          let rescode = res.data.rescode
          if (rescode == 0) {
            that.isPrivilege = false
            that.$message({
              message: '提交审批成功',
              type: 'success',
            })
            that.getPrice()
            // that.$store.dis('flowLists')
          }
        }).catch(function(err) {
          console.log(err)
        })
      })
    },
    close() {
      this.func.clearVul(this.upPrice)
    },
    // 批量调价
    upBatch() {
      let that = this
      that.listLoadings = true
      let para = {
        store_id: that.store_id,
        community_id: that.digcommunity_id,
        electricity_price: that.info.electricity_price,
        cold_water_price: that.info.cold_water_price,
        hot_water_price: that.info.hot_water_price,
        gas_price: that.info.gas_price,
      }
      if (!para.store_id || !para.electricity_price || !para.cold_water_price || !para.hot_water_price) {
        that.$message({
          message: '请完整填写表单',
          type: 'error',
        })
        that.listLoadings = false
      } else {
        batchCreate(para).then((res) => {
          that.listLoadings = false
          let rescode = res.data.rescode
          if (rescode == 0) {
            that.$message({
              message: '修改价格成功',
              type: 'success',
            })
            that.getPrice()
            that.isbatch = false
          }
        })
      }
    },
    comfirExport() {
      let that = this
      let name = this.$route.query.city
      let store_id = parseInt(this.$route.query.store_id)
      if (store_id == '') {
        that.$message({
          message: '请选择门店信息',
          type: 'error',
        })
        return
      }
      let para = {
        store_id: store_id,
      }
      adjExport(para).then((res) => {
        if (res.status == 200) {
          let blob = new Blob([res.data], { type: 'application/octet-stream;charset=utf-8' })
          // 创建一个blob对象
          let a = document.createElement('a') // 创建一个<a></a>标签
          a.href = URL.createObjectURL(blob) // response is a blob
          a.download = name + '调价' + '.xlsx' // 文件名称
          a.style.display = 'none'
          document.body.appendChild(a)
          a.click()
          a.remove()
          that.$message({
            message: '调价信息导出成功',
            type: 'success',
          })
          that.allExport = false
          that.exportLoading = false
          setTimeout(() => {
            that.isClick = false
          }, 1200)
        }
      })
      // that.exportLoading = true
      // that.isClick = true
      // that.func.emptyVul(para, function() {
      //   that.exportLoading = false
      //   that.isClick = false

      //   that.$message({
      //         message: "请选择门店信息",
      //         type: 'error',
      //       })
      // }, function() {
      //   // that.storesList.forEach((item) => {
      //   //   if (item.id == para.store_id) {
      //   //     name = item.name
      //   //   }
      //   // })
      //   // adjExport(para).then((res) => {
      //   //   if (res.status == 200) {
      //   //     let blob = new Blob([res.data], { type: 'application/octet-stream;charset=utf-8' }) // 创建一个blob对象
      //   //     let a = document.createElement('a') // 创建一个<a></a>标签
      //   //     a.href = URL.createObjectURL(blob) // response is a blob
      //   //     a.download = name + '调价' + '.xlsx' // 文件名称
      //   //     a.style.display = 'none'
      //   //     document.body.appendChild(a)
      //   //     a.click()
      //   //     a.remove()
      //   //     that.$message({
      //   //       message: '调价信息导出成功',
      //   //       type: 'success',
      //   //     })
      //   //     that.allExport = false
      //   //     that.exportLoading = false
      //   //     setTimeout(() => {
      //   //       that.isClick = false
      //   //     }, 1200)
      //   //   }
      //   // })
      // })
    },
    exportClose() {
      this.func.clearVul(this.adjExport)
      this.func.clearVul(this.storesList)
      this.storesList.length = 0
      this.exportLoading = false
      this.isClick = false
    },
    closes() {
      this.digcity = ''
      this.digstore_id = ''
      this.digcommunity_id = ''
      this.electricity_price = ''
      this.cold_water_price = ''
      this.gas_price = ''
      this.hot_water_price = ''
    },
    // 批量导入
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
      this.$message('文件上传成功')
      this.adjlead.url = file.response.data.file_url
      this.adjlead.files = file.raw.name
      this.exportLoading = false
      this.isClick = false
    },
    upFile() {
      let that = this
      let name = ''
      let para = {
        store_id: that.store_id,
      }
      that.exportLoading = true
      that.isClick = true
      if (!para.store_id) {
        that.exportLoading = false
        that.isClick = false
        that.$message.error('请选择门店名称')
      } else {
        that.storeLead.forEach((item) => {
          if (item.id == para.store_id) {
            name = item.name
          }
        })
        priceTemplate(para).then((res) => {
          if (res.status == 200) {
            let blob = new Blob([res.data], { type: 'application/octet-stream;charset=utf-8' }) // 创建一个blob对象
            let a = document.createElement('a') // 创建一个<a></a>标签
            a.href = URL.createObjectURL(blob) // response is a blob
            a.download = name + '调价模板' + '.xlsx' // 文件名称
            a.style.display = 'none'
            document.body.appendChild(a)
            a.click()
            a.remove()
            that.$message.success('下载调价模板成功')
            that.exportLoading = false
            that.isClick = false
          }
        })
      }
    },
    comfirLead() {
      let that = this
      let para = Object.assign({}, that.adjlead)
      that.exportLoading = true
      that.isClick = true
      that.func.emptyVul(para, function() {
        that.exportLoading = false
        that.isClick = false
      }, function() {
        importPrice(para).then((res) => {
          if (res != undefined) {
            let rescode = res.data.rescode
            // let getData = res.data.data
            if (rescode == 0) {
              that.$message.success('导入数据成功')
              that.exportLoading = false
              setTimeout(() => {
                that.isClick = false
              }, 1200)
              that.dialogFormVisible = false
            }
          } else {
            that.isClick = false
            that.exportLoading = false
            that.errorList = that.geterror()
            that.$message({
              showClose: true,
              message: '导入的表有问题，关闭查看更多',
              duration: 0,
              type: 'error',
              onClose: function() {
                that.textInfo = true
              },
            })
          }
        })
      })
    },
    closeLead() {
      this.func.clearVul(this.adjlead)
      this.func.clearVul(this.storeLead)
      this.storeLead.length = 0
      this.exportLoading = false
      this.isClick = false
    },
  },

}

</script>
