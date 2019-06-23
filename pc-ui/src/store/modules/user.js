// 登录用户信息
import {
  SET_USER_PROFILE,
  SET_USER_IDENTITY,
  SET_PROFESSOR_PROFILE,
} from '../types'

const state = {
  student: {},
  manager: {},
  professor: {},
  school_id: 0,
  student_id: 0,
  manager_id: 0,
  professor_id: 0,
  identity: '',
  name: '',
}

const getters = {
  name: (state) => {
    return state.name
  },
  userProfile: (state) => {
    if (state.student) {
      return state.student
    }
    if (state.manager) {
      return state.manager
    }
    if (state.professor) {
      return state.professor
    }
    return {}
  },
  isProfessor: (state) => {
    return state.identity == 'professor'
  },
  professor: (state) => {
    if (state.professor) {
      return state.professor
    }
    return {}
  },
  pHasBankAccount: (state) => {
    if (!state.professor) {
      return false
    }
    let p = state.professor
    if (p.bank_card_number == '') {
      return false
    }
    if (p.bank_card_account == '') {
      return false
    }
    if (p.bank_name == '') {
      return false
    }
    if (p.bank_type == '') {
      return false
    }
    if (p.idcard_number == '') {
      return false
    }
    return true
  },
  userIdentity: (state) => {
    return state.identity
  },
  pIsAgreeRegistrationAgreement: (state) => {
    return state.professor.is_agree_registration_agreement
  },
}

const actions = {
  setUserProfile ({ commit }, item) {
    commit(SET_USER_PROFILE, { item })
  },
  setProfessorProfile ({ commit }, item) {
    commit(SET_PROFESSOR_PROFILE, { item })
  },
  setUserIdentity ({ commit }, item) {
    commit(SET_USER_IDENTITY, { item })
  },
}

const mutations = {
  [SET_USER_PROFILE] (state, { item }) {
    let user = Object.assign({}, item)
    sessionStorage.setItem('token', user.token)
    if (user.student || user.student != null) {
      state.name = user.student.name
      state.student = user.student
      state.student_id = user.student.ID
      state.school_id = user.student.university_id
      sessionStorage.setItem('id', user.student.ID)
      sessionStorage.setItem('student_id', user.student.ID)
      sessionStorage.setItem('school_id', user.student.university_id)
    }
    if (user.manager || user.ststion != null) {
      console.log('mutations.SET_USER_PROFILE manager', user.manager)
      state.name = user.manager.name
      state.manager = user.manager
      state.manager_id = user.manager.ID
      state.school_id = user.manager.university_id
      sessionStorage.setItem('id', user.manager.ID)
      sessionStorage.setItem('manager_id', user.manager.ID)
      sessionStorage.setItem('school_id', user.manager.university_id)
    }
    if (user.professor || user.professor != null) {
      console.log('mutations.SET_USER_PROFILE professor', user.professor)
      state.name = user.professor.name
      state.professor = user.professor
      state.professor_id = user.professor.ID
      state.school_id = user.professor.university_id
      sessionStorage.setItem('id', user.professor.ID)
      sessionStorage.setItem('professor_id', user.professor.ID)
      sessionStorage.setItem('school_id', user.professor.university_id)
    }
  },
  [SET_PROFESSOR_PROFILE] (state, { item }) {
    let pro = Object.assign({}, item)
    if (pro.token) {
      sessionStorage.setItem('token', pro.token)
    }
    state.professor = pro
    state.professor_id = pro.ID
    sessionStorage.setItem('id', pro.ID)
    sessionStorage.setItem('professor_id', pro.ID)
  },
  [SET_USER_IDENTITY] (state, { item }) {
    state.identity = item
    sessionStorage.setItem('identity', item)
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
