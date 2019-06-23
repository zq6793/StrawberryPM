<template>
  <section class="yy">
    <el-select v-model="people" placeholder="请选择" style="width:230px">
      <el-option v-for="item in value.peopleList" :key="item.id" :label="item.name" :value="item.name" style="background: #fafafa; color: #000; border-radius: 0; border-bottom:1px solid #D8D8D8"></el-option>
    </el-select>
    <el-button @click="addPosition(index)" type="primary" size="small">添加</el-button>
    <br>
    <el-tag :key="tag" v-for='tag in value.dynamicTags' closable :disable-transitions="false" @close="handleClose(tag)">
      {{tag}}
    </el-tag>
    <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small">
    </el-input>

  </section>
</template>
<script>
import { showPosition } from '@/api/api'
export default {
  data () {
    return {
      people: '',
      value: {
        peopleList: [],
        dynamicTags: [],
        id: {},
      },
    }
  },
  mounted () {
    this.showPosition()
  },
  methods: {
    childClick () {
      this.$emit('func', this.value)
    },
    handleClose (tag) {
      this.value.dynamicTags.splice(this.value.dynamicTags.indexOf(tag), 1)
      let id = []
      for (let i = 0; i < this.value.peopleList.length; i++) {
        for (let j = 0; j < this.value.dynamicTags.length; j++) {
          if (this.value.peopleList[i].name == this.value.dynamicTags[j]) {
            id.push(this.value.peopleList[i].id)
          }
        }
      }
      this.value.id.position_ids = id.toString()
      this.childClick()
    },
    // 展示职位名称
    showPosition () {
      let that = this
      let para = {}
      showPosition(para)
        .then(res => {
          let rescode = res.data.rescode
          let getData = res.data.data
          let resmsg = res.data.resmsg
          that.func.portInit(rescode, resmsg, function () {
            that.value.peopleList = getData
          })
        })
        .catch(function (err) {
          console.log(err)
        })
    },
    addPosition () {
      if (this.people == '') {
        this.$message({
          message: '请选择职位',
          type: 'error',
        })
      } else {
        this.value.dynamicTags.push(this.people)
        this.value.dynamicTags = Array.from(new Set(this.value.dynamicTags))
        let id = []
        for (let i = 0; i < this.value.peopleList.length; i++) {
          for (let j = 0; j < this.value.dynamicTags.length; j++) {
            if (this.value.peopleList[i].name == this.value.dynamicTags[j]) {
              id.push(this.value.peopleList[i].id)
            }
          }
        }
        this.value.id.position_ids = id.toString()
        this.childClick()
      }
    },
  },
}
</script>
