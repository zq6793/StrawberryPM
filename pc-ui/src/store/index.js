import Vue from 'vue'
import Vuex from 'vuex'

// // import menu from './modules/menu'
import taskflow from './modules/taskflow'
import user from './modules/user'
import subject from './modules/subject'
// // import position from './modules/position'

Vue.use(Vuex)

const DEBUG = false; process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    // menu,
    taskflow,
    user,
    subject,
    // position,
  },
  strict: DEBUG,
})
