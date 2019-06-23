<template>
  <section class="fx-pages-main cation">
    <!-- 增加按钮 -->
    <!-- <el-col :span="24" class="add-btn"> -->
    <el-form :inline="true" class="fx-table-sort-head">
      <el-form-item size="small">
        <el-button type="primary" @click="handleAdd">+新增类别</el-button>
      </el-form-item>
    </el-form>
      <!--列表-->
      <el-table :data="obtainGoods" highlight-current-row style="width: 100%;" v-loading="listLoading" border tooltip-effect="dark">
        <el-table-column prop="sort" label="商品顺序">
        </el-table-column>
        <el-table-column prop="name" label="分类名称">
        </el-table-column>
        <el-table-column prop="name" label="商品数量">
        </el-table-column>
        <el-table-column prop="is_show" label="是否显示">
        </el-table-column>

        <el-table-column label="操作" width="53">
          <template slot-scope="scope">
            <span size="small" @click="handleEdit(scope.$index, scope.row)" class= "textchange">修改</span>
          </template>
        </el-table-column>
      </el-table>

      <!--编辑界面-->
      <el-dialog title="编辑" v-model="isEdit" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="80px" ref="editForm">
          <el-form-item label="生活用品" prop="name" class="white-el-select">
            <el-input v-model="editForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="是否显示">
            <el-radio-group v-model="editForm.is_show">
              <el-radio class="radio" :label="0">显示</el-radio>
              <el-radio class="radio" :label="1">不显示</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排序" class="white-el-select">
            <el-input-number v-model="editForm.sort" :min="0"></el-input-number>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="isEdit = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
        </div>
      </el-dialog>
      <!--工具条-->
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total" :current-page.sync="page">
        </el-pagination>
  </section>
</template>

<script type="text/javascript">
import { getGoodsList, editCategory } from '@/api/api'
export default {
  data () {
    return {
      obtainGoods: [],
      total: 0,
      page: 1,
      listLoading: false,
      isEdit: false, // 是否显示编辑页面
      // 编辑界面数据
      editForm: {
        id: 0,
        name: '',
        is_show: 0,
        sort: 0,
      },
      editLoading: false,
    }
  },

  mounted () {
    this.getobtainGoods()
  },

  methods: {
    handleCurrentChange (val) {
      this.page = val
      this.getobtainGoods()
    },

    /* 获取商品列表 */
    getobtainGoods () {
      let that = this
      let para = {
        page: that.page,
      }
      that.listLoading = true
      getGoodsList(para).then(res => {
        let getData = res.data.data
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        that.func.portInit(rescode, resmsg, function () {
          let is_show = ''
          for (let key in getData.list) {
            if (
              getData.list[key].is_show === 'Y' ||
                getData.list[key].is_show === 0
            ) {
              is_show = '是'
            } else {
              is_show = '否'
            }
            getData.list[key].is_show = is_show
          }
          that.obtainGoods = getData.list
          that.total = getData.count
          that.listLoading = false
        })
      }).catch(function (err) {
        console.log(err)
      })
    },

    /* 新增商品 */
    handleAdd () {
      this.$router.push({ path: '/addclassification' })
    },

    /* 是否显示编辑 */
    handleEdit (index, row) {
      let is_show = ''
      this.isEdit = true
      if (row.is_show === '否') {
        is_show = 1
      } else {
        is_show = 0
      }
      row.is_show = is_show
      this.editForm = Object.assign({}, row)
    },

    // 编辑提交
    editSubmit () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.listLoading = true
            let para = Object.assign({}, this.editForm)
            para.is_show = (para.is_show === 1) ? 'N' : 'Y'
            editCategory(para).then(() => {
              this.editLoading = false
              this.$message({
                message: '提交成功',
                type: 'success',
              })
              this.$refs['editForm'].resetFields()
              this.isEdit = false
              this.getobtainGoods()
            }).catch(function (err) {
              console.log(err)
            })
          }).catch(() => {})
        }
      })
    },
  },
}
</script>
