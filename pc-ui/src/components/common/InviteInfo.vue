<template>
  <div></div>
</template>

<script>
import { sendInviteToken } from '@/api/api'
export default {
  data() {
    return {
      name: '',
    }
  },
  mounted() {
    if (this.$route.query.token) {
      sendInviteToken(this.$route.query.token)
    }
  },
}
</script>
