<template>
  <el-container class="professor-page">
    <el-header>
      <el-row>
        <div class="logo" :class="isCollapse?'logo-collapse-width':'logo-width'">
          <img src='./../../assets/img/logo2.png' />
        </div>
          <div class="navbar" @click="navbar">
            <i class="iconfont icon-ali-ego-menu"></i>
          </div>
          <div class="head-navbar-items">
            <!-- <div class="head-navbar-item head-navbar-tips">
            <el-dropdown trigger="hover" class="navspan" style="width: 35px;">
              <span class="el-dropdown-link userinfo-inner twonav" style="cursor: pointer">
              <el-badge :value="tasks_num" class="item" type="warning">
                <i class="iconfont icon-ali-lingdang"></i>
              </el-badge>
              </span>
              <el-dropdown-menu slot="dropdown" class="hove-lo" style="width:340px">
                <el-dropdown-item @click.native="jumpToTaskList">
                  <span>当前有{{ tasks_num }}个未读消息</span>
                  <a>查看全部</a>
                </el-dropdown-item>
                <el-dropdown-item class="tasks_lists" v-for="(item,i) in tasks_lists" :key="item.id" v-if="i <= 5">
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div> -->
            <div class="head-navbar-item head-navbar-user">
              <el-dropdown trigger="hover" class="navspan">
                <span class="el-dropdown-link userinfo-inner twonav">
                <img :src="user_info.avatar" style="width:30px;margin: 15px 5px;"/>
                <span>{{ user_info.name }}</span>
                </span>
                <el-dropdown-menu slot="dropdown" class="hove-lo" style="width:176px">
                  <el-dropdown-item @click.native="profileSetting">账户设置</el-dropdown-item>
                  <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="auto">
        <el-menu default-active="1-4-1" class="el-menu-vertical-demo" :collapse="isCollapse" :collapse-transition="false">
          <div v-for="(items,indexs) in menulist" :key="items.ID">
            <el-submenu v-if="!items.hidden&&!items.leaf" :index="indexs+'_'">
              <template slot="title">
                <i :class="items.iconCls"></i>
                <span slot="title">{{ items.name }}</span>
              </template>
              <el-menu-item v-for="(item,index) in items.children" v-if="!item.hidden" :key="item.path" :index="indexs+'_'+index+''" @click="$router.push(items.path+'/'+item.path)">
                <i class="fa fa-dot"></i>{{ item.name }}
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-if="!items.hidden&&items.leaf&&items.children.length>0" :index="indexs+'_'" @click="$router.push(items.path+'/'+items.children[0].path)">
              <i :class="items.iconCls"></i>
              <span v-if="isHidden">{{items.name}}</span>
            </el-menu-item>
          </div>
        </el-menu>
      </el-aside>
      <el-main>
        <div class="topbar">
          <div class="breadcrumbs">
            <!-- <a class="level level-zone level-zone-2 pek3" data-permalink="">{{routeName}}</a> -->
            <a class="level instances" data-permalink="">{{ routeName }}</a>
          </div>
        </div>
        <div class="allmain">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import '@/assets/professor.scss'

import { managerProfile, listMyBeingTasks } from '@/api/api'
import professor from '@/router/professor'

export default {
  data() {
    return {
      isCollapse: false,
      menulist: professor,
      user_info: '',
      tasks_num: '',
      tasks_lists: [],
      isHidden: true,
    }
  },
  computed: {
    routeName() {
      return this.$route.name
    },
  },
  mounted() {
    this.get_user_info()
    // this.listMyBeingTasks()
  },
  methods: {
    navbar() {
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) {
        console.log(this.isHidden)
        this.isHidden = false
      } else {
        this.isHidden = true
      }
    },
    get_user_info() {
      let that = this
      managerProfile().then(res => {
        that.user_info = res
        this.$store.dispatch('setProfessorProfile', res)
      })
    },
    listMyBeingTasks() {
      let that = this
      listMyBeingTasks().then(res => {
        that.tasks_num = res.count
        that.tasks_lists = res.items
      })
    },
    /* 退出登录 */
    logout() {
      let that = this
      that.$confirm('确认退出吗?', '提示', {}).then(() => {
        that.$router.push('/login')
      }).catch(() => {})
    },
    profileSetting() {
      this.$router.push({ name: '专家个人信息修改' })
    },
    jumpToTaskList() {
      this.$router.push('/professor/tasks')
    },
  },
}

</script>
