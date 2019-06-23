// 登录用户信息
import {
  SET_ALL_ORGS,
} from '../types'

const state = {
  trees: [],
  list: [],
}

const getters = {
  orgsTree: (state) => {
    return state.trees
  },
  orgsList: (state) => {
    return state.list
  },
  getOrgByNumber: (state) => (number) => {
    return state.list.find(item => item.number === number)
  },
}

const actions = {
  setAllOrgs ({ commit }, item) {
    commit(SET_ALL_ORGS, { item })
  },
}

const mutations = {
  [SET_ALL_ORGS] (state, { item }) {
    let list = item
    state.list = []
    list.forEach(it => {
      it.label = it.name
      it.value = it.number
      if (it.children != null) {
        it.children.forEach(values => {
          values.label = values.name
          values.value = values.number
          if (values.children != null) {
            values.children.forEach(cont => {
              cont.label = cont.name
              cont.value = cont.number
              state.list.push(cont)
            })
          }
        })
      }
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
