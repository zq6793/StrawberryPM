<template>
  <section class="tab-title">
    <el-tabs type="card" v-model="activeName">
      <el-tab-pane label="经营报表" name="boss">
        <template v-if="activeName=='boss'">
          <bossbyroom v-if="tabName=='room'" class="fx-pages-main"  @set="refresh">
          </bossbyroom>
          <bossbyroomtype v-else-if="tabName=='roomtype'" class="fx-pages-main"  @set="refresh">
          </bossbyroomtype>
          <bossbystore v-else class="fx-pages-main"  @set="refresh">
          </bossbystore>
        </template>
      </el-tab-pane>
      <el-tab-pane label="出房报表" name="outroom">
      <template v-if="activeName=='outroom'">
        <outroombydata v-if="tabName=='data'" class="fx-pages-main" @set="refresh"></outroombydata>
        <outroombylist v-else class="fx-pages-main" @set="refresh">
        </outroombylist>
      </template>
      </el-tab-pane>
      <el-tab-pane label="应收报表" name="money">
      <template v-if="activeName=='money'">
        <moneybyroom v-if="tabName=='room'" class="fx-pages-main" @set="refresh"></moneybyroom>
        <moneybyperson v-else-if="tabName=='person'" class="fx-pages-main"  @set="refresh"></moneybyperson>
        <moneybystore v-else class="fx-pages-main" @set="refresh"></moneybystore>
      </template>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
<script type="text/javascript">
import bossbyroom from './boss/room.vue'
import bossbyroomtype from './boss/roomtype.vue'
import bossbystore from './boss/store.vue'
import outroombylist from './outroom/List.vue'
import outroombydata from './outroom/data.vue'
import moneybystore from './money/store.vue'
import moneybyperson from './money/person.vue'
import moneybyroom from './money/room.vue'
export default {
  data() {
    return {
      activeName: 'boss',
      page: 1,
      tabName: 'store',
    }
  },
  components: {
    bossbyroom,
    bossbyroomtype,
    bossbystore,
    outroombylist,
    outroombydata,
    moneybystore,
    moneybyperson,
    moneybyroom
  },
  created() {},
  mounted() {
    let routePaths = this.$route.path.split('/')
    this.activeName = routePaths[2]
    if (routePaths.length > 2) {
      this.tabName = routePaths[3]
    } else {
      switch (this.activeName) {
        case 'boss':
          this.tabName = 'store'
          break
        case 'outroom':
          this.tabName = 'list'
          break
        case 'money':
          this.tabName = 'store'
          break
      }
    }
    console.log(this.activeName)
  },
  watch: {
    activeName() {
      this.clearRouteQuery()
      this.$router.push({ path: `/business/${this.activeName}` })
    }
  },
  methods: {
    refresh(activeName, tabName) {
      this.activeName = activeName
      this.tabName = tabName
    }
  },
}
</script>
