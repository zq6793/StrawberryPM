<template>
  <el-date-picker
    v-model="timeDataValues"
    format="yyyy-MM-dd HH:mm"
    value-format="yyyy-MM-ddTHH:mm"
    type="datetimerange"
    :picker-options="pickerTimes"
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    @change="searchTimes"
    align="right">
  </el-date-picker>
</template>

<script>
import dateFormat from 'dateformat'
export default {
  props: {
    routeQuery: Boolean,
  },
  data() {
    return {
      timeDataValues: [],
      pickerTimes: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
            picker.$emit('pick', [start, end])
          }
        }]
      },
    }
  },
  mounted() {
    if (this.routeQuery && this.$route.query.begin_time && this.$route.query.end_time) {
      this.timeDataValues = [
        this.$route.query.begin_time,
        this.$route.query.end_time,
      ]
      return
    }
    this.setcurrTime()
    // this.searchTimes()
  },
  methods: {
    reset() {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      this.timeDataValues = [
        dateFormat(start, 'yyyy-mm-dd HH:MM').replace(' ', 'T'),
        dateFormat(end, 'yyyy-mm-dd HH:MM').replace(' ', 'T'),
      ]
    },
    setcurrTime () {
      this.reset()
      let begin_time = this.timeDataValues[0]
      let end_time = this.timeDataValues[1]
      if (this.routeQuery) {
        this.updateRouteQuery('begin_time', begin_time)
        this.updateRouteQuery('end_time', end_time)
      }
      this.$emit('set', begin_time, end_time)
    },
    searchTimes () {
      let begin_time = ''
      let end_time = ''
      if (this.timeDataValues) {
        begin_time = this.timeDataValues[0]
        end_time = this.timeDataValues[1]
      } else {
        begin_time = ''
        end_time = ''
      }
      if (this.routeQuery) {
        this.updateRouteQuery('begin_time', begin_time)
        this.updateRouteQuery('end_time', end_time)
      }
      this.$emit('set', begin_time, end_time)
    },
  },
}
</script>
