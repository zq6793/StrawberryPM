<template>
  <div id="app">
    <transition name="fade"
      mode="out-in">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {
  },
}
</script>

<style lang="scss" scoped>
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

.fade-enter-active,
.fade-leave-active {
  transition: all .2s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
