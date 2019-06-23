// 登录用户信息
import {
  SET_ALL_SUBJECTS,
} from '../types'

const state = {
  trees: [],
  list: [],
}

const getters = {
  subjectsTree: (state) => {
    return state.trees
  },
  subjectsList: (state) => {
    return state.list
  },
  getSubjectByNumber: (state) => (number) => {
    return state.list.find(item => item.number === number)
  },
  getSubjectParent: (state) => (id) => {
    return state.list.find(item => {
      if (item.ID === id) {
        return item.parent
      }
    })
  },
}

const actions = {
  setAllSubjects ({ commit }, item) {
    commit(SET_ALL_SUBJECTS, { item })
  },
}

const mutations = {
  [SET_ALL_SUBJECTS] (state, { item }) {
    let list = item
    state.list = []
    list.forEach(it => {
      it.label = `(${it.number}) ${it.name}`
      it.value = it.number
      if (it.children != null) {
        it.children.forEach(values => {
          values.label = `(${values.number}) ${values.name}`
          values.value = values.number
          if (values.children != null) {
            values.children.forEach(cont => {
              cont.label = `(${cont.number}) ${cont.name}`
              cont.value = cont
              cont.parent = values
              state.list.push(cont)
            })
          }
        })
      }
    })
    list.unshift({
      label: '请选择学科',
      value: 0,
    })
    state.trees = list
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
