import Vue from 'vue'
import Vuex from 'vuex'

import taskflow from './modules/taskflow'
import store from './modules/store'

Vue.use(Vuex)

const DEBUG = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    taskflow,
    store,
  },
  strict: DEBUG,
})
