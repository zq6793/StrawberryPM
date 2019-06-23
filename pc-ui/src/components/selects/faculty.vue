<template>
  <el-cascader placeholder="请选择院系"
      :options="facultyList"
      v-model="selected"
      @change="selectCollege">
  </el-cascader>
</template>

<script>
import { organizations } from '@/api/api'
export default {
  data () {
    return {
      facultyList: [],
      selected: [],
    }
  },
  updated () {
    if (this.selected.length > 0) {
      this.$emit('set', this.selected[this.selected.length - 1])
    }
  },
  mounted () {
    let that = this
    organizations({ limit: 20 }).then(res => {
      let list = res

      list.forEach(item => {
        item.label = item.name
        item.value = item.ID
        if (item.children != null) {
          item.children.unshift({
            name: item.label,
            value: item.value,
          })
          item.children.forEach(values => {
            values.label = values.name
            values.value = values.ID
            if (values.children != null) {
              values.children.unshift({
                name: values.label,
                value: values.value,
              })
              values.children.forEach(cont => {
                cont.label = cont.name
                cont.value = cont.ID
              })
            }
          })
        }
      })
      list.unshift({
        label: '请选择院系',
        id: '',
      })
      that.facultyList = list
    }).catch(err => {
      console.log(err)
    })
  },
}
</script>
