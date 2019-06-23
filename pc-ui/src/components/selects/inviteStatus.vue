<template>
  <el-select v-model="seleted" placeholder="请选择状态">
    <el-option
      v-for="item in inviteStatus"
      :key="item.key"
      :label="item.value"
      :value="item.key">
    </el-option>
  </el-select>
</template>

<script>

export default {
  props: {
    value: String,
  },
  data () {
    return {
      seleted: '',
      inviteStatus: [
        { key: '', value: '请选择' },
        { key: 'WILL_INVITE', value: '将被邀请' },
        { key: 'HAS_INVITED', value: '已发邮件' },
        { key: 'WATCH_EMAIL', value: '已看邮件' },
        { key: 'HAS_LOHIN', value: '已有登录' },
        { key: 'BIND_PHONE', value: '已绑手机' },
        { key: 'BIND_WECHAT', value: '已绑微信' },
      ],
    }
  },
  watch: {
    value () {
      for (const item of this.inviteStatus) {
        if (item.key == this.value || item.value == this.value) {
          this.seleted = item.key
          return
        }
      }
    },
  },
  updated () {
    this.$emit('set', this.seleted)
  },
}
</script>
