<template>
  <el-cascader placeholder="请选择学科"
    :options="allSubjectTree"
    :show-all-levels="false"
    v-model="subjectSeleted"
    >
  </el-cascader>
</template>

<script>
import { subject } from '@/api/api'

export default {
  props: {
    subject_id: Number,
    routeQuery: Boolean,
  },
  data () {
    return {
      subjectSeleted: [],
    }
  },
  computed: {
    allSubjectTree () {
      return this.$store.getters.subjectsTree
    },
  },
  updated () {
    if (this.subjectSeleted.length > 0) {
      let sbj = this.subjectSeleted[this.subjectSeleted.length - 1]
      if (this.routeQuery) {
        this.updateRouteQuery('subject_id', sbj.ID)
      }
      this.$emit('set', sbj.ID, sbj)
    }
  },
  mounted () {
    this.listAllSubjects()
    if (this.subject_id) {
      this.subjectSeleted[2] = this.subject_id
    } else if (this.routeQuery) {
      this.subjectSeleted[2] = parseInt(this.$route.query.subject_id)
    }
  },
  methods: {
    listAllSubjects () {
      let that = this

      subject().then(res => {
        that.$store.dispatch('setAllSubjects', res.items)
      }).catch(err => {
        console.log(err)
      })
    },
  },
}
</script>
