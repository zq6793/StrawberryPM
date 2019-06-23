<template>
  <section>
    <el-menu
      :unique-opened="true"
      :collapse="collapsed"
      :default-active="active"
      :router="true"
      @select="handleopen">
      <template v-for="(items,indexs) in menuList">
        <el-submenu :key="items.ID" v-if="!items.leaf" :index="indexs+''">
          <template slot="title">
            <i :class="items.iconCls"></i>
            <span slot="title">{{ items.name }}</span>
          </template>
          <el-menu-item v-for="(item,index) in items.children" :key="indexs+'-'+index" :index="indexs+'-'+index" :route="item">
            <i class="circle"></i>
            {{ item.name }}
          </el-menu-item>
        </el-submenu>
        <el-menu-item
          v-else-if="items.leaf&&items.children.length>0"
          :key="indexs+'-0'"
          :index="indexs+'-0'"
          :route="items.children[0]">
          <i :class="items.iconCls"></i>
          <span slot="title">{{items.children[0].name}}</span>
        </el-menu-item>
      </template>
    </el-menu>
    <el-button
      type="text"
      @click="education"
      style="position: absolute;bottom: 5%;text-align: center;padding-left: 10px;">
      <span class="iconfont icon-ali-wenhao"></span>
      教程
    </el-button>
  </section>
</template>
<script>
import Vue from 'vue'
import { listMenu } from '@/api/api'
export default {
  props: {
    collapsed: Boolean,
  },
  data() {
    return {
      menuList: [],
      active: '',
      isFirstLoad: true,
    }
  },
  mounted() {
    this.listMenu()
  },
  updated() {
    if (this.isFirstLoad) {
      this.getCurrentItem(this.menuList)
    }
    this.isFirstLoad = false
  },
  methods: {
    handleopen(idx, path) {
      // console.log(idx, path)
    },
    handleclose() {},
    handleselect() {},
    showMenu(i, status) {
      this.$refs.menuCollapsed.getElementsByClassName('w-' + i)[0].style.display = status ? 'block' : 'none'
    },
    // 教程
    education() {
      if (this.fxCfg.isSAAS) {
        window.open('http://docs.funxdata.com/web/#/2?page_id=3')
      } else {
        window.open('https://shimo.im/docs/D2dgDCWcHwY5oaod/')
      }
    },
    listMenu() {
      let para = {}
      let that = this
      listMenu(para).then((res) => {
        let mlist = res
        let menuMap = {}
        for (const items of mlist) {
          let child = {}
          if (items.second && items.second.length > 0) {
            for (const item of items.second) {
              Vue.set(child, item.name, item)
            }
          }
          Vue.set(menuMap, items.name, child)
        }
        that.topTrim(menuMap)
      })
    },
    topTrim(menuMap) {
      let menuList = this.$router.options.routes
      for (let topIdx = 0; topIdx < menuList.length;) {
        const top = menuList[topIdx]
        if (top && top.hidden) {
          menuList.splice(topIdx, 1)
          continue
        }
        if (!menuMap.hasOwnProperty(top.name)) {
          menuList.splice(topIdx, 1)
          continue
        }
        if (top.leaf) {
          topIdx++
          continue
        }
        // 二级菜单
        const secondMap = menuMap[top.name]
        this.secondTrim(top, secondMap)
        topIdx++
      }
      this.menuList = menuList
    },
    secondTrim(top, secondMap) {
      for (let secondIdx = 0; secondIdx < top.children.length;) {
        const second = top.children[secondIdx]
        if (second && second.hidden) {
          top.children.splice(secondIdx, 1)
          continue
        }
        if (!secondMap.hasOwnProperty(second.name)) {
          top.children.splice(secondIdx, 1)
          continue
        }
        if (second.leaf) {
          secondIdx++
          continue
        }
        secondIdx++
      }
    },
    getCurrentItem(menuList) {
      let r = this.$route
      for (const idx in menuList) {
        let t = menuList[idx]
        for (const sidx in t.children) {
          let s = t.children[sidx]
          if (s.name && s.name == r.name) {
            this.active = idx + '-' + sidx
            return
          }
        }
      }
    },
  },
}

</script>
