<template>
  <section class="tab-title">
    <el-tabs type="card" v-model="activeName">
      <el-tab-pane label="退房单" name="checkout">
        <template v-if="activeName=='checkout'">
          <checkoutbylist v-if="tabName=='list'" class="fx-pages-main"  @set="refresh">
          </checkoutbylist>
          <checkoutbydetail v-else class="fx-pages-main"  @set="refresh">
          </checkoutbydetail>
        </template>
      </el-tab-pane>
      <el-tab-pane label="换房单" name="changeroom">
      <template v-if="activeName=='changeroom'">
          <changeroombylist v-if="tabName=='list'" class="fx-pages-main"  @set="refresh">
          </changeroombylist>
          <changeroombydetail v-else class="fx-pages-main"  @set="refresh">
          </changeroombydetail>
      </template>
      </el-tab-pane>
      <el-tab-pane label="转租单" name="sublet">
        <template v-if="activeName=='sublet'">
          <subletbylist v-if="tabName=='list'" class="fx-pages-main"  @set="refresh">
          </subletbylist>
          <subletbydetail v-else class="fx-pages-main"  @set="refresh">
          </subletbydetail>
        </template>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
<script type="text/javascript">
import checkoutbylist from './checkout/List.vue'
import checkoutbydetail from './checkout/Detail.vue'
import changeroombylist from './changeroom/List.vue'
import changeroombydetail from './changeroom/Detail.vue'
import subletbylist from './sublet/List.vue'
import subletbydetail from './sublet/Detail.vue'

export default {
  data() {
    return {
      activeName: 'checkout',
      page: 1,
      tabName: 'list',
    }
  },
  components: {
    checkoutbylist,
    checkoutbydetail,
    changeroombylist,
    changeroombydetail,
    subletbylist,
    subletbydetail
  },
  created() {},
  mounted() {
    let routePaths = this.$route.path.split('/')
    this.activeName = routePaths[2]
    if (routePaths.length > 3) {
      this.tabName = routePaths[3]
    } else {
      switch (this.activeName) {
        case 'checkout':
          this.tabName = 'list'
          break
        case 'changeroom':
          this.tabName = 'list'
          break
        case 'sublet':
          this.tabName = 'list'
          break
      }
    }
  },
  watch: {
    activeName() {
      this.clearRouteQuery()
      this.tabName = 'list'
      this.$router.push({ path: `/billnotes/${this.activeName}` })
    },
    // tabName() {
    //   this.clearRouteQuery()
    //   this.$router.push({ path: `/billnotes/${this.activeName}/${this.tabName}` })
    // }
  },
  methods: {
    refresh(activeName, tabName) {
      this.activeName = activeName
      this.tabName = tabName
    }
  },
}
</script>
