<template>
  <section>
    <el-form class="fx-table-sort-head">
      <el-form-item label="" size="small">
        <el-button type="primary" @click="addCard" size="small">添加门禁卡</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="cardInfo" highlight-current-row @selection-change="selsChange" v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column prop="name" label="类型">
      </el-table-column>
      <el-table-column prop="count" label="数量">
      </el-table-column>
      <el-table-column prop="number" label="卡号">
      </el-table-column>
      <el-table-column prop="description" label="备注">
      </el-table-column>
      <el-table-column prop="status" label="状态">
      </el-table-column>
      <el-table-column label="操作" width="202">
        <template slot-scope="scope">
          <span size="small" @click="changeEdit(scope.row)" class="textchange">修改</span>
          <span size="small" @click="lossEdit(scope.row)" class="textchange">挂失</span>
          <span size="small" @click="recycleEdit(scope.row)" class="textchange">回收</span>
          <span size="small" @click="delEdit(scope.row)" class="textchange">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="门禁卡信息" v-model="isadd" width="30%" :visible.sync="isadd" @close="closeCard" class="forbid">
      <el-form label-width="80px">
        <el-form-item label="物品类型" class="select">
          <el-select v-model="cardInfos.name" placeholder="请选择" size="small">
            <el-option v-for="item in typeList" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物品编号">
          <el-input v-model="cardInfos.number" placeholder="请输入物品编号"></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="cardInfos.count" placeholder="请输入物品数量"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="cardInfos.description" placeholder="请输入物品备注"></el-input>
        </el-form-item>
        <el-button @click="appendCard" type="primary" :loading="listLoadings" class="append">提交</el-button>
      </el-form>
    </el-dialog>
  </section>
</template>
<script>
import { itemInfo, addItem, updateItem, residentInfoDetail, item } from '@/api/api'
export default {
  data() {
    return {
      residentid: '',
      store_id: 0,
      resident: {},
      cardInfo: [],
      cardInfos: {
        name: '',
        count: '',
        description: '',
        status: '',
        number: '',
      },
      isadd: false,
      typeList: ['房间门卡', '房间钥匙', '大门门卡', '小区门卡'],
    }
  },
  created() {
    this.residentid = this.$route.query.id
    this.getResident()
  },
  computed: {
    headers() {
      return {
        Token: sessionStorage.getItem('token'),
      }
    },
  },
  mounted() {
    this.getcardList()
  },
  methods: {
    getResident() {
      let that = this
      residentInfoDetail(that.residentid).then((res) => {
        that.resident = res.data
        that.store_id = res.data.room.store_id
      })
    },
    // 门禁卡
    getcardList() {
      let that = this
      let para = {
        resident_id: that.residentid,
      }
      itemInfo(para).then((res) => {
        let rescode = res.data.rescode
        let getData = res.data.data
        if (rescode == 0) {
          that.cardInfo = getData.list
        }
      })
    },
    addCard() {
      this.isadd = true
      this.type = 'add'
    },
    appendCard() {
      let that = this
      let para = Object.assign({}, that.cardInfos)
      console.log(that.residentList)
      para.resident_id = that.residentid
      para.store_id = that.store_id
      para.status = '生效中'
      para.price = '0'
      that.listLoadings = true
      that.func.emptyVul(para, function() {
        that.listLoadings = false
      }, function() {
        if (!isNaN(Number(para.count))) {
          if (that.type == 'add') {
            addItem(para).then((res) => {
              if (res.data.rescode == 0) {
                that.isadd = false
                that.listLoadings = false
                that.$message.success('添加成功')
                that.getcardList()
              }
            })
          } else {
            para.id = that.ids
            updateItem(para).then((res) => {
              if (res.data.rescode == 0) {
                that.isadd = false
                that.listLoadings = false
                that.$message.success('修改成功')
                that.getcardList()
              }
            })
          }
        } else {
          that.listLoadings = false
          that.$message.error('数量必须是数字')
        }
      })
    },
    closeCard() {
      this.func.clearVul(this.cardInfos)
    },
    changeEdit(row) {
      let that = this
      let para = {
        id: row.id,
      }
      that.ids = para.id
      item(para).then((res) => {
        if (res.data.rescode == 0) {
          delete res.data.data.list[0].room
          delete res.data.data.list[0].store
          delete res.data.data.list[0].id
          that.cardInfos = res.data.data.list[0]
          that.isadd = true
          that.type = 'edit'
          that.getcardList()
        }
      })
    },
    lossEdit(row) {
      let that = this
      let para = {
        id: row.id,
        status: '已挂失',
      }
      that.$confirm('是否进行挂失操作', '提示', {
        type: 'warning',
      }).then(() => {
        updateItem(para).then((res) => {
          if (res.data.rescode == 0) {
            that.$message.success('挂失成功')
            that.getcardList()
          }
        })
      }).catch(function() {
        that.$message.info('已取消挂失')
      })
    },
    recycleEdit(row) {
      let that = this
      let para = {
        id: row.id,
        status: '已收回',
      }
      that.$confirm('是否进行回收操作', '提示', {
        type: 'warning',
      }).then(() => {
        updateItem(para).then((res) => {
          if (res.data.rescode == 0) {
            that.$message.success('回收成功')
            that.getcardList()
          }
        })
      }).catch(function() {
        that.$message.info('已取消回收')
      })
    },
  }
}

</script>
