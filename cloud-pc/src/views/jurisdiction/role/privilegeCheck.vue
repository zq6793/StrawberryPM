<template>
  <div>
    <div class="fx-head-m"></div>
    <el-form-item label="全选">
      <el-checkbox
        :indeterminate="stroeIndete"
        v-model="isCheckAllStore"
        @change="checkAllStores"
        class="all">
      </el-checkbox>
    </el-form-item>
    <el-form-item
      v-loading="listLoading"
      v-for="item in privilegeList"
      :key="item.ID"
      :label="item.name">
      <el-form-item  v-for="value in item.second" :key="value.ID" :label="value.name" label-width="100px">
        <el-checkbox-group v-model="checkedIDs" @change="change">
          <el-checkbox v-for="status in value.third" :key="status.ID" :label="status.ID">
            {{ status.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form-item>
  </div>
</template>

<script>
import { permissionList } from '@/api/api'
export default {
  props: {
    privilegeIds: Array,
  },
  data() {
    return {
      listLoading: false,
      privilegeList: [],
      checkedIDs: [],
      allIDs: [],
    }
  },
  computed: {
    stroeIndete () {
      return this.checkedIDs.length > 0 && this.checkedIDs.length < this.allIDs.length
    },
    isCheckAllStore () {
      return this.checkedIDs.length === this.allIDs.length
    },
  },
  mounted() {
    this.listAllPrivileges()
  },
  watch: {
    privilegeIds () {
      this.checkedIDs = this.privilegeIds
    },
  },
  methods: {
    // 获取所有权限的信息
    listAllPrivileges () {
      let that = this
      that.listLoading = true
      permissionList().then(res => {
        that.listLoading = false
        that.allIDs = []
        res.forEach(item => {
          item.second.forEach(lists => {
            lists.third.forEach(value => {
              that.allIDs.push(value.ID)
            })
          })
        })
        that.privilegeList = res
      }).catch(err => {
        console.log(err)
      })
    },
    checkAllStores () {
      if (this.isCheckAllStore) {
        this.checkedIDs = []
      } else {
        this.checkedIDs = this.allIDs
      }
      this.change()
    },
    change () {
      this.$emit('set', this.checkedIDs)
    },
  },
}
</script>
