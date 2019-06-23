<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
// import manager from '@/router/manager'
import professor from '@/router/professor'
// import student from '@/router/student'

export default {
  name: 'app',
  data () {
    return {
    }
  },
  components: {
  },
  computed: {
    // isManager () {
    //   return this.identity == 'manager'
    // },
    // isStudent () {
    //   return this.identity == 'student'
    // },
    isProfessor () {
      return this.identity == 'professor'
    },
    isLogin () {
      return this.identity == ''
    },
    identity () {
      return this.$store.getters.userIdentity
    },
  },

  created () {
    let idt = sessionStorage.getItem('identity')
    this.$store.dispatch('setUserIdentity', idt)
  },

  watch: {
    'identity' (to, from) {
      if (to === from) {
        return
      }
      // let routes = []
      // switch (to) {
      //   case 'manager':
      //     routes = manager
      //     break
      //   case 'student':
      //     routes = student
      //     break
      //   case 'professor':
      //     routes = professor
      //     break
      // }
      this.$store.dispatch('setRoutes', professor)
    },
  },
}
</script>

<style lang="scss">
body {
  margin: 0px;
  padding: 0px;
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
}

#app {
  width: 100%;
  height: 100%;
  min-width: 1242px;
  min-height: 700px;
  position: absolute;
  top: 0;
  left: 0;
  overflow : auto;
  background: rgb(245,245,245);
}

.el-submenu [class^=fa],
.el-menu-item [class^=fa]{
  vertical-align: baseline;
  margin-right: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: all .2s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
