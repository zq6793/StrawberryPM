<template>
  <section class="fx-pages-main ">
    <!-- 增加按钮 -->
    <el-form  class="fx-table-sort-head">
      <el-from-item size="small">
        <el-button type="primary" class="add-btn" @click="handleAdd">增加</el-button>
        <el-button type="danger" @click="handleAdd">删除所选</el-button>
      </el-from-item>
    </el-form>
    <!--列表-->
    <el-table :data="obtainGoods" highlight-current-row style="width: 100%;" v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column prop="name" label="轮播图指向网址" align="center">
      </el-table-column>
      <el-table-column prop="address" label="是否显示" align="center">
      </el-table-column>
      <el-table-column prop="contact_user" label="排序" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" @click="handleDel(scope.$index, scope.row)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--编辑界面-->
    <el-dialog title="编辑" v-model="editCommodity" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="生活用品" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-radio-group v-model="editForm.sex">
            <el-radio class="radio" :label="1">显示</el-radio>
            <el-radio class="radio" :label="0">不显示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editCommodity = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
export default {
  data () {
    return {
      obtainGoods: [],
      total: 0,
      page: 1,
      listLoading: false,
      editCommodity: false, // 是否显示编辑页面
      // 编辑界面数据
      editForm: {
        id: 0,
        name: '',
        sex: -1,
        age: 0,
      },
    }
  },

  methods: {
    handleCurrentChange (val) {
      this.page = val
      this.getobtainGoods()
    },
    /* 获取商品列表 */
    getobtainGoods () {

    },
    /* 新增商品 */
    handleAdd () {
      this.$router.push({ path: '/addRotation' })
    },
    /* 是否显示编辑 */
    handleEdit (index, row) {
      this.editCommodity = true
      this.editForm = Object.assign({}, row)
    },
    /* 删除商品 */
    handleDel (index, row) {

    },

  },
}
</script>
