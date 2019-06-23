<template>
  <section class="fx-pages-main roomManage">
    <el-form :inline="true"  class="fx-table-sort-head">
      <el-form-item class="teil" size="small">
        <el-button type="primary" @click="handleAdd">+新建房间</el-button>
        <el-button type="primary" @click="dialogFormVisible = true">+批量导入</el-button>
        <el-button type="danger" @click="handleDel" :disabled="this.sels.length==0">删除</el-button>
      </el-form-item>
      <el-form-item size="small">
        <city-store-select :route-query="true" @set="refresh"></city-store-select>
      </el-form-item>
      <el-form-item class="select" size="small">
        <el-select v-model="community_id" placeholder="小区名称" size="small" @change="searchCommunity">
          <el-option v-for="item in communityList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="searchs inputs" size="small">
        <text-search :route-query="true" :options="searchOptions" @set="refresh"></text-search>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="storeList" highlight-current-row @selection-change="selsChange" style="width: 100%;" v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="store_name" label="房屋地址" width="260">
      </el-table-column>
      <el-table-column prop="number" label="房间号">
      </el-table-column>
      <el-table-column prop="room_type" label="房型">
      </el-table-column>
      <el-table-column prop="rent_price" label="住宿服务费(￥/月)">
      </el-table-column>
      <el-table-column prop="room_type" label="房间类型">
      </el-table-column>
      <el-table-column prop="status" label="房间状态">
      </el-table-column>
      <el-table-column label="操作" width="53">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <pagination-select :route-query="true" :total="total" @set="refresh"></pagination-select>
    </el-col>
    <!-- 批量导入 -->
    <el-dialog title="批量导入" :visible.sync="dialogFormVisible" class="allUpload" @close="close">
      <el-form label-width="70px">
        <el-form-item label="选择门店">
          <city-store-select @set="handleSetImportStore"></city-store-select>
        </el-form-item>
        <br>
        <el-form-item label="文件上传" class="upload">
          <el-upload
            class="upload-demo"
            drag :action="uploadUrl()" name='file' multiple :on-success="handleAvatarSuccess" :before-upload="beforeLoad" ref="upload" :headers="headers" :on-progress="progressE">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">请下载模板文件，严格按照模板关键词顺序进行填写上传，且不超过500kb
            </div>
          </el-upload>
       <!--    <input type="file" class="input_inner" placeholder="请上传文件" size="small" @change="onFileChangeCard" />
          <span class="digadds">+</span> -->
        </el-form-item>
        <el-form-item>
          <p>
            <el-button type="text" @click="centralize" :disabled="isClick">点击下载集中式模板</el-button>
          </p>
          <p>
            <el-button type="text" @click="disperse">点击下载分布式模板</el-button>
          </p>
        </el-form-item>
        <el-form-item label="">
        <el-button class="comfirs" type="primary" @click="comfirExport" :disabled="isClick" v-loading="exportLoading">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </section>
</template>
<script>
import { CityStoreSelect, PaginationSelect, TextSearch } from '@/components/selects'
import { roomList, deleteRoom, upTemplate, getdotTemplate, showCommunity, homeLead } from '@/api/api'
export default {
  components: {
    CityStoreSelect,
    PaginationSelect,
    TextSearch,
  },
  data () {
    return {
      number: '',
      sels: [],
      total: 0,
      community_id: '',
      communityList: [],
      dialogFormVisible: false,
      textInfo: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      },
      listLoading: false,
      adjExport: {
        store_id: 0,
        url: '',
        files: '',
      },
      exportLoading: false,
      isClick: false,
      type: '',
      searchOptions: [
        { label: '房间号', key: 'number' },
      ],
    }
  },
  mounted () {
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
      this.listunion()
    },
    // 获取门店列表
    listunion () {
      let that = this
      that.listLoading = true
      roomList(this.queryOption()).then(res => {
        let roomlist = res.items
        roomlist.forEach(item => {
          item.status = that.statusTra(item.status)
          item.rent_type = that.func.storeTre(item.rent_type)
        })
        that.storeList = roomlist
        that.total = parseInt(res.count)
        that.listLoading = false
      }).catch(err => {
        console.log(err)
      })
    },
    statusTra (status) {
      if (status == 'BLANK') {
        status = '空'
      } else if (status == 'RESERVE') {
        status = '预定'
      } else if (status == 'RENT') {
        status = '正常出租'
      } else if (status == 'ARREARS') {
        status = '欠费出租'
      } else if (status == 'REFUND') {
        status = '退房'
      } else if (status == 'OCCUPIED') {
        status = '占用'
      } else if (status == 'OTHER') {
        status = '其他'
      } else if (status == 'REPAIR') {
        status = '维修'
      }
      return status
    },

    getVillageList () {
      let that = this
      let para = {
        store_id: that.store_id,
      }
      showCommunity(para).then((res) => {
        let rescode = res.data.rescode
        let getData = res.data.data
        if (rescode == 0) {
          getData.community.unshift({
            id: '',
            name: '小区名称',
          })
          that.communityList = getData.community
        }
      }).catch(function (err) {
        console.log(err)
      })
    },

    // 获取小区列表
    searchName () {
      this.page = 1
      this.store_id = this.store_id
      this.community_id = ''
      this.listunion()
      if (this.store_id != '') {
        this.getVillageList()
      }
    },

    // searchCommunity() {
    //   this.community_id = this.community_id;
    //   this.listunion()
    // },

    searchStore () {
      this.listunion()
    },

    searchAll () {
      this.listunion()
    },

    // 删除集中式房间列表
    handleDel () {
      let that = this
      let ids = that.sels.map(item => item.ID)

      that.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning',
      }).then(() => {
        let para = { ids: ids }
        that.listLoading = true
        deleteRoom(para).then(res => {
          that.listLoading = false
          that.$message({
            message: '删除成功',
            type: 'success',
          })
          that.listunion()
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
        that.listLoading = false
        this.$message({
          type: 'info',
          message: '删除',
        })
      })
    },
    // 新建房间
    handleAdd() {
      this.$router.push({ path: 'newroominfo' })
    },
    handleEdit (row) {
      sessionStorage.setItem('page', JSON.stringify(this.page))
      this.$router.push({
        path: '/editHome',
        query: {
          room_id: row.ID,
        },
      })
    },

    selsChange (sels) {
      this.sels = sels
    },
    uploadUrl () {
      return this.fxCfg.file_upload_url
    },
    // 使文件上传文件隐藏
    isShow () {
      this.$refs.upload.$el.lastElementChild.style.display = 'none'
    },
    beforeLoad (file) {
      const isFile = file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type == 'application/vnd.ms-excel'
      if (!isFile) {
        this.$message.error('上传的文件必须是.xlsx或者.xls格式的')
      }
      return isFile
    },
    progressE () {
      this.exportLoading = true
      this.isClick = true
    },
    handleAvatarSuccess(res, file) {
      this.$message.success('文件上传成功')
      this.adjExport.url = file.response.data.file_url
      this.adjExport.files = file.raw.name
      this.exportLoading = false
      this.isClick = false
    },
    /* 上传文件 */
    onFileChangeCard (e) {
      this.adjExport.file = e.target.value
      this.isClick = false
    },

    // 集中式下载模板
    centralize () {
      let that = this
      // let name = ''
      let para = {}
      that.exportLoading = true
      that.isClick = true
      upTemplate(para).then((res) => {
        if (res.status == 200) {
          let blob = new Blob([res.data ], { type: 'application/octet-stream;charset=utf-8' }) // 创建一个blob对象
          let a = document.createElement('a') // 创建一个<a></a>标签
          a.href = URL.createObjectURL(blob) // response is a blob
          a.download = '集中式房间模板' + '.xlsx' // 文件名称
          a.style.display = 'none'
          document.body.appendChild(a)
          a.click()
          a.remove()
          that.$message.success('下载集中式模板成功')
          that.exportLoading = false
          setTimeout(() => {
            that.isClick = false
          }, 1200)
        }
      })
    },
    // 分布式下载模板
    disperse () {
      let that = this
      // let name = ''
      let para = {}
      that.exportLoading = true
      that.isClick = true
      getdotTemplate(para).then((res) => {
        if (res.status == 200) {
          let blob = new Blob([res.data ], { type: 'application/octet-stream;charset=utf-8' }) // 创建一个blob对象
          let a = document.createElement('a') // 创建一个<a></a>标签
          a.href = URL.createObjectURL(blob) // response is a blob
          a.download = '分布式房间模板' + '.xlsx' // 文件名称
          a.style.display = 'none'
          document.body.appendChild(a)
          a.click()
          a.remove()
          that.$message.success('下载分布式模板成功')
          that.exportLoading = false
          setTimeout(() => {
            that.isClick = false
          }, 1200)
        }
      })
    },
    // 批量导入选择门店
    handleSetImportStore (city, storeId) {
      this.adjExport.store_id = storeId
    },
    comfirExport () {
      let that = this
      let para = Object.assign({}, that.adjExport)
      that.exportLoading = true
      that.isClick = true
      if (!that.adjExport.url) {
        that.$message.error('请上传文件')
        that.exportLoading = false
        that.isClick = false
      } else {
        homeLead(para).then((res) => {
          if (res) {
            if (res.data.rescode == 0) {
              that.exportLoading = false
              that.isClick = false
              that.$message.success('批量上传成功')
              that.dialogFormVisible = false
            }
          } else {
            that.isClick = false
            that.$message.error('上传失败,请检查数据格式')
            that.exportLoading = false
          }
        }).catch(err => {
          console.log(err)
        })
      }
      // that.func.emptyVul(para, function () {
      //   that.exportLoading = false
      //   that.isClick = false
      // }, function () {
      //   if (type === 'UNION') {
      //     that.ajaxno(unionImport, para)
      //   } else if (type === 'DOT') {
      //     that.ajaxno(dotImport, para)
      //   }
      // })

      // that.storesList.forEach((item) => {
      //   if(that.adjExport.store_id == item.id) {
      //     flag = item.rent_type
      //   }
      // })
      // that.func.emptyVul(para, function() {
      //   that.exportLoading = false;
      //   that.isClick = false;
      // }, function() {
      //   if(flag == 'UNION') {
      //     that.ajaxno(homeLead, para)
      //   } else {
      //     that.ajaxno(importRoomdot, para)
      //   }
      // })
    },

    ajaxno (call, para) {
      let that = this
      call(para).then((res) => {
        that.exportLoading = false
        // if(res != undefined) {
        //   let rescode = res.data.rescode,
        //     getData = res.data.data;
        //   if(rescode == 0) {
        //     that.$message.success('导入数据成功');
        //     that.exportLoading = false;
        //     setTimeout(() => {
        //       that.isClick = false;
        //     }, 1200)
        //     that.dialogFormVisible = false;
        //   }
        // } else {
        //   that.isClick = false;
        //   that.exportLoading = false;
        //   that.errorList = that.geterror()
        //   that.$message({
        //     showClose: true,
        //     message: '导入的表有问题，关闭查看更多',
        //     duration: 0,
        //     type: 'error',
        //     onClose: function() {
        //       that.textInfo = true;
        //     },
        //   });

        // }
      })
    },
    close () {
      this.func.clearVul(this.adjExport)
      this.func.clearVul(this.storesList)
      this.storesList.length = 0
      this.exportLoading = false
      this.isClick = false
    },
  },
}
</script>
