// 路由和菜单管理
import {
  SET_ROUTES_MENU,
  SET_PERMISSION_MENU,
} from '../types'

const state = {
  list: [],
}

const getters = {
  menus: (state) => {
    return state.list
  },
}

const actions = {
  setRoutes ({ commit }, items) {
    commit(SET_ROUTES_MENU, { items })
  },
  setPermissons ({ commit }, items) {
    commit(SET_PERMISSION_MENU, { items })
  },
}

const mutations = {
  [SET_ROUTES_MENU] (state, { items }) {
    state.list = items
  },
  [SET_PERMISSION_MENU] (state, { items }) {
    state.list = items
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
