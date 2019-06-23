import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/pages/Login'
import chooseIdentity from '@/views/pages/choose'
import bindwWchat from '@/views/pages/bindWechat'
// import mailbox from '@/views/pages/mailbox'
// import professorFirstLogin from '@/views/professor/FirstLogin'

// import NotFound from '@/views/pages/NotFound'
// import config from '@/common/config'
// import manager from './manager'
// import student from './student'
import professor from './professor'

// import { ENTRA_STUDENT, ENTRA_MANAGER, ENTRA_PROFESSOR } from '@/common/constants'

Vue.use(VueRouter)

let routes = [
  // { path: '/404', component: NotFound , hidden: true},
  // { path: '*', redirect: { path: '/404' }, hidden: true },
  { path: '/', redirect: { path: '/login' }, name: '登录', hidden: true },
  { path: '/login', component: Login, name: '登录', hidden: true },
  { path: '/login/choose', component: chooseIdentity, name: '选择身份', hidden: true },
  { path: '/login/bindwechat', component: bindwWchat, name: '绑定微信', hidden: true },
  // { path: '/login/mailbox', component: mailbox, name: '邮箱登录', hidden: true },
  { path: '/login/invite', redirect: { path: '/login' }, name: '专家首次登陆', hidden: true },
  // { path: '/login/invite', component: professorFirstLogin, name: '专家首次登陆', hidden: true },
]

let r = new VueRouter({
  routes: [
    ...routes,
    // ...manager,
    // ...student,
    ...professor,
  ],
})

// r.beforeEach((to, from, next) => {
//     let token = sessionStorage.getItem('token');
//     if(to.path === '/login') {
//         sessionStorage.clear();
//     }

//     if(!token && to.path != '/login') {
//         return next({ path: '/login' })
//     }else {
//         next();
//     }
// })

export const router = r
export const baseRoutes = routes
