import {
  LIST_TASKFLOW,
} from '../types'

const state = {
  list: [],
  count: 0,
}

const getters = {
  taskflows: (state) => {
    return [ ...state.list ]
  },
  taskflowCount: (state) => {
    return state.count
  },
}

const actions = {
  listTaskFlow ({ commit }, items) {
    commit(LIST_TASKFLOW, { items })
  },
}

const mutations = {
  [LIST_TASKFLOW] (state, { items }) {
    state.list = items
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
