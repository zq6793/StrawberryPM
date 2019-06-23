<template>
  <section class="fx-pages-main administration">
    <!--工具条-->
      <el-form :inline="true" class="fx-table-sort-head">
        <el-form-item size="small">
          <el-button type="primary" @click="handleAdd">+新增商品</el-button>
          <el-button type="danger" @click="batchShelf" :disabled="this.sels.length===0">批量上架</el-button>
          <el-button type="danger" @click="batchLowerFrame" :disabled="this.sels.length===0">批量下架</el-button>
          <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">删除</el-button>
        </el-form-item>
        <el-form-item size="small">
          <goods-list :route-query="true" @set="setGoodClassify"></goods-list>
        </el-form-item>
        <el-form-item size="small">
          <shelf-status-select :route-query="true" @set="setShelfStatus"></shelf-status-select>
        </el-form-item>
        <el-form-item size="small">
          <el-input v-model="filters.name" type="text" class="input" placeholder="输入商品名称" @keyup.enter="getGoodsList">
          <template slot="append" class="iconfont icon-ali-sousuo" @click="searchAll">
          搜索
        </template>
        </el-input>
        </el-form-item>
      </el-form>
    <!--列表-->
    <el-table :data="commodity" highlight-current-row @selection-change="selsChange" style="width: 100%;" v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column prop="id" type="selection">
      </el-table-column>
  <!--     <el-table-column prop="id" label="ID">
      </el-table-column> -->
      <el-table-column prop="goods_thumb" label="图片">
        <template slot-scope="scope">
          <img v-if="scope.row.goods_thumb" :src="scope.row.goods_thumb+'?x-oss-process=image/resize,m_lfit,h_80,w_80'" style="width:60px;height:60px;display:block;margin:auto;cursor: pointer; padding:10px;" />
          <el-button style="color: #0ab6ab" type="text" size="small" v-else>暂无图片</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名称">
      </el-table-column>
      <el-table-column prop="shop_price" label="售价">
      </el-table-column>
      <el-table-column prop="market_price" label="市场价格">
      </el-table-column>
      <el-table-column prop="quantity" label="数量">
      </el-table-column>
      <el-table-column prop="on_sale" label="是否上架">
      </el-table-column>
      <el-table-column label="操作" width="53">
        <template slot-scope="scope">
          <span size="small" @click="handleEdit(scope.$index, scope.row)" class="textchange">修改</span>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total" :current-page.sync="page">
      </el-pagination>
    </el-col>
  </section>
</template>
<script type="text/javascript">
import { ShelfStatusSelect, GoodsList } from '@/components/mall'
import { getGoodList, updateOnsale, deleteGoods } from '@/api/api'
export default {
  components: {
    ShelfStatusSelect,
    GoodsList,
  },
  data () {
    return {
      filters: {
        on_sale: '',
        category_id: '',
        name: '',
      },
      shelfValue: '',
      sels: [], // 列表选中列删除
      commodity: [],
      total: 0,
      page: 1,
      listLoading: false,
      category_id: '' /* 查询需要 商品分类id */,
      on_sale: '', /* 查询需要 是否上架 */
    }
  },
  created () {
    if (sessionStorage.getItem('page')) {
      this.page = Number(sessionStorage.getItem('page'))
    }
  },
  mounted () {
    this.getGoodsList()
  },
  destroyed () {
    if (this.$route.path !== '/editshop') {
      sessionStorage.removeItem('page')
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.page = val
      this.getGoodsList()
    },

    /* 获取商品列表 */
    getGoodsList () {
      let that = this
      let para = {
        page: that.page,
        on_sale: that.on_sale,
        category_id: that.category_id,
        name: that.filters.name,
      }
      that.listLoading = true
      getGoodList(para).then(res => {
        let rescode = res.data.rescode
        let getData = res.data.data
        let on_sale = ''
        let resmsg = res.data.resmsg
        that.func.portInit(rescode, resmsg, function () {
          for (let key in getData.list) {
            if (getData.list[key].on_sale === 'Y') {
              on_sale = '是'
            } else {
              on_sale = '否'
            }
            getData.list[key].market_price = '￥' + getData.list[key].market_price
            getData.list[key].shop_price = '￥' + getData.list[key].shop_price
            getData.list[key].on_sale = on_sale
          }
          that.commodity = getData.list
          that.total = getData.count
          that.listLoading = false
        })
      }).catch(function (err) {
        console.log(err)
      })
    },

    /* 选择商品分类 */
    setGoodClassify (val) {
      console.log(val)
      this.category_id = val
      this.getGoodsList()
    },

    /* 选择是否上架 */
    setShelfStatus (val) {
      this.on_sale = val
      this.getGoodsList()
    },

    /* 批量删除 */
    batchRemove () {
      let that = this
      let ids = that.sels.map(item => item.id).toString()
      that.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning',
      }).then(() => {
        that.listLoading = true
        let para = { id: ids }
        deleteGoods(para).then(res => {
          let rescode = res.data.rescode
          let resmsg = res.data.resmsg
          that.func.portInit(rescode, resmsg, function () {
            that.listLoading = false
            that.$message({
              message: '删除成功',
              type: 'success',
            })
            that.getGoodsList()
          })
        }).catch(function (err) {
          console.log(err)
        })
      }).catch(() => {
        that.listLoading = false
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      })
    },

    /* 批量上架 */
    batchShelf () {
      let that = this
      let ids = that.sels.map(item => item.id).toString()
      that.$confirm('确认上架选中记录吗？', '提示', {
        type: 'warning',
      }).then(() => {
        that.listLoading = true
        let para = {
          id: ids,
          on_sale: 'Y',
        }
        updateOnsale(para).then(res => {
          let rescode = res.data.rescode
          let resmsg = res.data.resmsg
          that.func.portInit(rescode, resmsg, function () {
            that.listLoading = false
            that.$message({
              message: '上架成功',
              type: 'success',
            })
            that.getGoodsList()
          })
        }).catch(function (err) {
          console.log(err)
        })
      }).catch(() => {
        that.listLoading = false
        this.$message({
          type: 'info',
          message: '已取消上架',
        })
      })
    },

    /* 批量下架 */
    batchLowerFrame () {
      let that = this
      let ids = that.sels.map(item => item.id).toString()
      that.$confirm('确认下架选中记录吗？', '提示', {
        type: 'warning',
      }).then(() => {
        that.listLoading = true
        let para = {
          id: ids,
          on_sale: 'N',
        }
        updateOnsale(para).then(res => {
          let rescode = res.data.rescode
          let resmsg = res.data.resmsg
          that.func.portInit(rescode, resmsg, function () {
            that.listLoading = false
            that.$message({
              message: '下架成功',
              type: 'success',
            })
            that.getGoodsList()
          })
        }).catch(function (err) {
          console.log(err)
        })
      }).catch(() => {
        that.listLoading = false
        this.$message({
          type: 'info',
          message: '已取消下架',
        })
      })
    },
    searchAll () {
      this.getGoodsList()
    },
    /* 新增商品 */
    handleAdd () {
      this.$router.push({ path: '/addshop' })
    },
    /* 编辑当前 */
    handleEdit (index, row) {
      sessionStorage.setItem('page', JSON.stringify(this.page))
      this.$router.push({
        path: '/editshop',
        query: {
          id: row.id,
        },
      })
    },

    selsChange (sels) {
      this.sels = sels
    },
  },
}
</script>
