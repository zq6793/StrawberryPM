<template>
  <el-cascader placeholder="全部门店"
      size="small"
      :options="tree"
      :show-all-levels="false"
      v-model="seleted"
      @change="change"
      style="width:277px;">
  </el-cascader>
</template>
<script>
import { listMyCityStore } from '@/api/api'
export default {
  props: {
    city: String,
    store: Number,
    routeQuery: Boolean,
    require: Boolean,
  },
  data () {
    return {
      seleted: [],
      tree: [],
    }
  },
  computed: {
  },
  mounted () {
    this.listMyCityStore()
    if (this.store) {
      this.seleted[0] = this.city
      this.seleted[1] = this.store
    } else if (this.routeQuery) {
      this.seleted[0] = this.$route.query.city
      this.seleted[1] = parseInt(this.$route.query.store_id)
    }
  },
  watch: {
    store () {
      if (this.store) {
        this.seleted[1] = this.store
      }
    },
    city () {
      if (this.city) {
        this.seleted[0] = this.city
      }
    },
    tree () {
      if (this.tree && this.require) {
        this.seleted[0] = this.tree[0].value
        this.seleted[1] = this.tree[0].children[0].value
        this.change()
      }
    },
  },
  methods: {
    listMyCityStore () {
      let that = this
      let list = []
      if (!this.require) {
        list.push({
          label: '全部门店',
          value: '',
        })
      }
      listMyCityStore().then((res) => {
        for (let city in res) {
          let c = {
            label: city,
            value: city,
            children: [],
          }
          for (let store of res[city]) {
            c.children.push({
              label: store.name,
              value: store.ID,
            })
          }
          list.push(c)
        }
        that.tree = list
      })
    },
    change () {
      let city = ''
      let storeId = 0
      if (this.seleted.length === 2) {
        city = this.seleted[0]
        storeId = this.seleted[1]
      }
      if (this.routeQuery) {
        this.updateRouteQuery('page', 1)
        this.updateRouteQuery('city', city)
        this.updateRouteQuery('store_id', storeId)
      }
      this.$emit('set', city, storeId)
    },
  },
}
</script>
