<template>
  <section class="editcommon">
    <el-select v-model="people" placeholder="请选择" style="width:230px">
      <el-option v-for="item in value.peopleList" :key="item.id" :label="item.name" :value="item.name"></el-option>
    </el-select>
    <el-button @click="addPosition(index)" type="primary" size="small">添加</el-button>
    <br>
    <el-tag :key="tag" v-for='tag in name' closable :disable-transitions="false" @close="handleClose(tag)" v-show="(tag == '')?false:true" style="margin-left: 5px;margin-top: 10px;">
      {{tag}}
    </el-tag>
  </section>
</template>
<script>
import { showPosition } from '@/api/api'
export default {
  props: ['name', 'index'],
  data() {
    return {
      people: '',
      value: {
        peopleList: [],
        id: {},
        index: '',
      },
      nameLength: '',
    }
  },
  mounted() {
    this.showPosition()
    // 在去重的时候 因为 name 是传过来的;
    // 组件里面需要进行去重操作 同时传过来的name 也是需要进行去重操作的;
    // this.name = Array.from(new Set(this.name));
  },
  methods: {
    childClick() {
      this.$emit('set', this.value)
    },
    handleClose(tag) {
      this.name.splice(this.name.indexOf(tag), 1)
      let id = []
      for (let i = 0; i < this.value.peopleList.length; i++) {
        for (let j = 0; j < this.name.length; j++) {
          if (this.value.peopleList[i].name == this.name[j]) {
            id.push(this.value.peopleList[i].id)
          }
        }
      }
      this.value.id.position_ids = id.toString()
      this.childClick()
    },
    // 展示职位名称
    showPosition() {
      let that = this
      let para = {}
      showPosition(para).then(res => {
        let rescode = res.data.rescode
        let getData = res.data.data
        let resmsg = res.data.resmsg
        that.func.portInit(rescode, resmsg, function() {
          that.value.peopleList = getData
          that.addPosition()
        })
      }).catch(function(err) {
        console.log(err)
      })
    },
    addPosition() {
      if (this.name.indexOf(this.people) == -1) {
        this.name.push(this.people)
      } else {
        this.$message({
          message: '您已经选取过该职位了，请重新选取',
          type: 'warning',
        })
      }
      let id = []
      for (let i = 0; i < this.value.peopleList.length; i++) {
        for (let j = 0; j < this.name.length; j++) {
          if (this.value.peopleList[i].name == this.name[j]) {
            id.push(this.value.peopleList[i].id)
          }
        }
      }
      this.value.id.position_ids = id.toString()
      this.value.index = this.index
      this.childClick()
    },
  },
}

</script>
