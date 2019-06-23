// 登录用户信息
import {
  SET_ALL_POSITIONS,
} from '../types'

const state = {
  list: [],
}

const getters = {
  positionsList: (state) => {
    return state.list
  },
  getPositionByID: (state) => (id) => {
    return state.list.find(item => item.ID === id)
  },
}

const actions = {
  setAllPositions ({ commit }, item) {
    commit(SET_ALL_POSITIONS, { item })
  },
}

const mutations = {
  [SET_ALL_POSITIONS] (state, { item }) {
    state.list = item
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
