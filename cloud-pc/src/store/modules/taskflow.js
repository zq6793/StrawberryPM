import {
  LIST_TASKFLOW,
} from '../types'

const state = {
  list: {},
}

const getters = {
  taskflows: (state) => {
    return state.list
  },
}

const actions = {
  loadFlowLists ({ commit }, params) {
    commit(LIST_TASKFLOW, { params })
  },
}

const mutations = {
  [LIST_TASKFLOW] (state, { params }) {
    state.list = params
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
