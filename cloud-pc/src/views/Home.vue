<template>
  <el-container class="allpage">
    <el-header style="height: 48px;">
      <el-row>
        <div class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
          <img class="logo-b" src='../assets/img/caomei_logo.png' />
          <img class="logo-m" src='../assets/img/caomei_2.png' />
        </div>
        <div class="navbar" @click="navbar">
          <i class="iconfont icon-ali-ego-menu"></i>
        </div>
        <div class="head-navbar-items">
          <task></task>
          <user></user>
        </div>
      </el-row>
    </el-header>
    <el-container style="overflow: hidden;">
      <el-aside :width="collapsed?'64px':'200px'" :class="collapsed?'menu-collapsed':'menu-expanded'">
        <left-menu :collapsed="collapsed"></left-menu>
      </el-aside>
      <el-main>
        <el-row class="grid-content bg-purple-light">
          <el-col :span="19.5" class="breadcrumb-container">
            <sub-page-title></sub-page-title>
          </el-col>
        </el-row>
        <el-row class="content-wrapper">
          <div class="title">
            {{routeDesc}}
          </div>
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { SubPageTitle, User, Task, LeftMenu } from '@/components/home'
export default {
  components: {
    SubPageTitle,
    User,
    Task,
    LeftMenu,
  },
  data() {
    return {
      collapsed: false,
    }
  },
  computed: {
    routeDesc() {
      if (this.$route.matched.length > 0) {
        return this.$route.matched[this.$route.matched.length - 1].meta.desc
      }
      return ''
    },
  },
  mounted() {},
  methods: {
    navbar() {
      this.collapsed = !this.collapsed
    },
  },

  watch: {},
}

</script>
