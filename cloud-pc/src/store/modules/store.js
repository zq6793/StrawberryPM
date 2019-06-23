import {
  LIST_CITY_STORY,
} from '../types'

const state = {
  list: {},
}

const getters = {
  getStoreByCity: (state) => (city) => {
    if (!state.list[city]) {
      return []
    }
    return state.list[city]
  },
  listCity: (state) => {
    let cities = []
    for (let city in state.list) {
      cities.push(city)
    };
    return cities
  },
}

const actions = {
  loadCityStore ({ commit }, item) {
    commit(LIST_CITY_STORY, { item })
  },
}

const mutations = {
  [LIST_CITY_STORY] (state, { item }) {
    state.list = item
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
