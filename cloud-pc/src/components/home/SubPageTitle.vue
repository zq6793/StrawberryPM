<template>
  <el-breadcrumb separator="/" class="breadcrumb-inner">
    <el-breadcrumb-item class="list-menu"
      v-for="item in matchedRoutes"
      :key="item.path"
      :value="item.path"
      :to="item.path">
      {{ item.name }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script>
export default {
  name: 'subPageTitle',
  computed: {
    matchedRoutes () {
      return this.$route.matched
    },
  },
  mounted () {
    // console.log('asdfasdfasdfasdfasdfas')
  },
}
</script>
<style scoped>
.breadcrumb-inner{
  margin-bottom: 10px;
}
</style>
