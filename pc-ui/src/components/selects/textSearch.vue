<template>
  <el-input
    placeholder="请输入搜索内容"
    v-model="value"
    class="input-with-select"
    size="small"
    @keyup.enter.native="chooseTextSearch">
    <el-select v-model="key" slot="prepend" placeholder="请选择检索字段类别" style="width:100px">
      <el-option
        v-for="item in options"
        :key="item.key"
        :label="item.label"
        :value="item.key"
        label-width="100px">
      </el-option>
    </el-select>
    <el-button slot="append" icon="el-icon-search" @click="chooseTextSearch"></el-button>
  </el-input>
</template>

<script>
export default {
  props: {
    options: Array,
    routeQuery: Boolean,
  },
  data () {
    return {
      key: '',
      value: '',
    }
  },
  mounted () {
    if (this.options.length > 0) {
      this.key = this.options[0].key
    }
    if (this.routeQuery) {
      for (const key in this.$route.query) {
        for (const opt of this.options) {
          if (key == opt.key && this.$route.query[key] != '') {
            this.key = key
            this.value = this.$route.query[key]
            this.chooseTextSearch()
            return
          }
        }
      }
    }
  },
  watch: {
    key (newv, old) {
      if (!old) {
        return
      }
      this.reset()
    },
  },
  methods: {
    reset () {
      this.value = ''
      this.chooseTextSearch()
    },
    /* 文本搜索 */
    chooseTextSearch () {
      if (this.routeQuery) {
        for (const item of this.options) {
          if (item.key == this.key) {
            this.updateRouteQuery(this.key, this.value)
          } else {
            this.updateRouteQuery(item.key, '')
          }
        }
      }
      this.$emit('set', this.key, this.value)
    },
  },
}
</script>
