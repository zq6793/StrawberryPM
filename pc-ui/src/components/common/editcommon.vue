<template>
  <section class="editcommon">
    <el-select v-model="checkedPositionID" placeholder="请选择" style="width:230px">
      <el-option
        v-for="item in positionList"
        :key="item.ID"
        :label="item.name"
        :value="item.ID"
        style="background: #fafafa; color: #000; border-radius: 0; border-bottom:1px solid #D8D8D8">
      </el-option>
    </el-select>
    <el-button @click="addPosition(index)" type="primary" size="small">添加</el-button>
    <br>

    <el-tag
      :key="id"
      v-for='id in checkedPIDs'
      closable
      :disable-transitions="false"
      @close="handleClose(id)"
      v-show="id?true:false">
      {{id | positionName(positionList)}}
    </el-tag>
  </section>

</template>
<script>
export default {
  props: [
    'ids',
    'index',
  ],
  data () {
    return {
      checkedPositionID: '',
      checkedPIDs: [],
    }
  },
  computed: {
    positionList () {
      return this.$store.getters.positionsList
    },
  },
  filters: {
    positionName (id, list) {
      let it = list.find(item => item.ID == id)
      if (it) { return it.name }
      return ''
    },
  },
  mounted () {
    if (this.ids) {
      this.checkedPIDs = this.ids.split(',')
    }
  },
  methods: {
    childClick () {
      let val = {
        pids: this.checkedPIDs.join(','),
        index: this.index,
      }
      this.$emit('func', val)
    },
    handleClose (id) {
      this.checkedPIDs.splice(this.checkedPIDs.indexOf(id), 1)
      this.childClick()
    },
    addPosition () {
      if (!this.checkedPositionID) {
        return
      }
      if (this.checkedPIDs.indexOf(this.checkedPositionID) == -1) {
        this.checkedPIDs.push(this.checkedPositionID)
        this.childClick()
      } else {
        this.$message({
          message: '您已经选取过该职位了，请重新选取',
          type: 'warning',
        })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
  .editcommon {
    .el-form-item__label {
      text-align: left;
    }
    .step {
      .el-tag {
        background: #fff;
        color: #000;
        .el-icon-close {
          top: -6px;
          right: 0px;
          color: #e51c23;
        }
      }
      .el-button {
        position: absolute;
        margin-left: 10px;
        background: #fff;
        color: #000;
        border: 1px solid #d8d8d8;
        border-radius: 4px;
        margin-top: 3px;
      }
    }
    .addstep {
      margin-top: 40px;
    }
    .addflow {
      margin-top: 200px;
    }
    .el-input .el-input__inner[icon="caret-top"],
    .el-select-dropdown__item,
    .el-select-dropdown__list {
      background: #fafafa;
      border: 1px solid #d8d8d8;
      border-radius: 4px;
    }
    .el-select input::-webkit-input-placeholder {
      color: #adadad !important;
    }
  }
</style>
