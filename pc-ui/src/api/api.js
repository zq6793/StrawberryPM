import axios from 'axios'
import Vue from 'vue'
import config from '@/common/config.js'

function getAgentSeq() {
  let as = localStorage.getItem('agent-seq')
  if (as) {
    return as
  }
  as = Math.random().toString(36).substr(2)
  localStorage.setItem('agent-seq', as)
  return as
}

let prefix = 'p1/'
let base = config.api_domain
if (config.entra == 'student') {
  prefix = 's1/'
}
if (sessionStorage.getItem('identity') == 'manager') {
  prefix = 'r1/'
}

let request = axios.create({
  baseURL: base + prefix,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client-Agent': getAgentSeq(),
    'X-Client-Version': 'pc-1.1.8',
  },
  // transformRequest: 对接口返回数据进行处理
})
// 对发送请求进行处理，请求头部带上token
request.interceptors.request.use(function (cfg) {
  if (sessionStorage.getItem('token')) {
    cfg.headers.Token = sessionStorage.getItem('token')
  }
  let adt = sessionStorage.getItem('identity')
  if (config.entra == 'student') {
    cfg.url = cfg.url.replace(prefix, 's1/')
  } else if (adt == 'professor') {
    cfg.url = cfg.url.replace(prefix, 'p1/')
  }
  cfg.url = cfg.url.replace(prefix + 'inner/', 'f1/')
  return cfg
}, function (error) {
  return Promise.reject(error)
})

// 对响应数据进行处理
request.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response) {
    console.log(error.response.data.message)
    switch (error.response.status) {
      case 400:
      case 500:
        Vue.prototype.$message.error(error.response.data.message)
        break
      case 401:
        location.href = '/#/login'
        sessionStorage.clear()
        Vue.prototype.$message.error(error.response.data.message)
        break
      case 404:
        Vue.prototype.$message.error('接口没有发现')
        break
      default:
        return Vue.prototype.$message.error(error.response.data.message)
    }
  }
})

export const token = () => { return sessionStorage.getItem('token') }

/** *************************************** 公共接口 *****************************************/
/* 获取省 */
export const province = params => { return request.get(`province`, params).then(res => JSON.parse(res.data)) }
/* 获取城市 */
export const citys = params => { return request.get(`city${params}`).then(res => res.data) }
/* 获取区县 */
export const districts = params => { return request.get(`district${params}`).then(res => res.data) }
/* 获取学生信息 学生列表 */
export const studentProfile = () => { return request.get(`profile`).then(res => res.data) }
/* 权限模块 */
export const listPrivilege = params => { return request.get(`permissions`, params).then(res => res.data) }
/* 用户菜单 */
export const listMenu = () => { return request.get(`list_menu`).then(res => res.data) }
/* 获取学科列表 */
export const subject = params => { return request.get(`subjects`, params).then(res => res.data) }


/** *************************************** 登录 *****************************************/
/* 学生端首次登录 */
export const studentsFirstLogin = params => { return request.post(`login_first`, params).then(res => res.data) }
/* 获取验证码 */
export const getCode = params => { return request.post(`phone_code`, params).then(res => res.data) }
/* 学生手机号登录 */
export const loginPhone = params => { return request.post(`login_phone`, params).then(res => res.data) }
/* 学生绑定微信 */
export const studentWe = (id, params) => { return request.post(`bind_wechat/${id}`, params).then(res => res.data) }
/* 专家绑定微信 */
export const professorWe = (id, params) => { return request.post(`p_bind_wechat/${id}`, params).then(res => res.data) }
/* 学校绑定微信 */
export const managerWe = (id, params) => { return request.post(`m_bind_wechat/${id}`, params).then(res => res.data) }
/* 选择登录 */
export const chooseStation = params => { return request.post(`choose_station`, params) }
/* 微信登录 */
export const loginWx = params => { return request.post(`login_wechat`, params).then(res => res.data) }


/** *************************************** 学生端 *****************************************/
/* 论文列表 */
export const paper = (id, params) => { return request.get(`draft${id}`, params).then(res => res.data) }
/* 上传论文 */
export const uploadPaper = params => { return request.post(`pdf`, params) }
/* 提交论文 */
export const submitThesis = params => { return request.post(`draft`, params) }
/* 修改论文 */
export const editPaper = (id, params) => { return request.put(`draft/${id}`, params).then(res => res.data) }
/* 获取学校 */
export const school = params => { return request.get(`universitys${params}`).then(res => res.data) }
/* 获取导师列表 */
export const tutorList = params => { return request.get(`manager`, params).then(res => res.data) }
/* 提交论文到老师端 */
export const submitPaperT = id => { return request.patch(`draft/${id}/commit`).then(res => res.data) }
/* 模糊查找学校 */
export const searchSchool = params => { return request.get(`school`, { params }).then(res => res.data) }
export const getSchool = id => { return request.get(`school/${id}`).then(res => res.data) }
/* 修改学生手机号码 */
export const editStudentPhone = (params) => { return request.put(`profile_phone`, params).then(res => res.data) }

/** *************************************** 学校端 *****************************************/
/** ************** 首页 **************** /
/*论文进度 */
export const paperProgress = params => { return request.get(`home/progress`, params).then(res => res.data) }
/* 论文通过率 */
export const paperPassRate = params => { return request.get(`home/passing_rate`, params).then(res => res.data) }
/** ************** 学校设置 **************** /
/*获取学校 */
export const schoolInfo = (id, params) => { return request.get(`university/${id}`, params).then(res => res.data) }
/* 编辑学校 */
export const editSchool = (id, params) => { return request.put(`university/${id}`, params).then(res => res.data) }
// /*添加学校*/
// export const addSchool = params => { return request.post(`university`, params).then(res => res.data ); };
/* 获取用户的个人信息 */
export const managerProfile = () => { return request.get(`profile`).then(res => res.data) }

/* 获取任务流通知信息 */
export const noticeInfo = () => { return request.get(`taskflow_list/formybeing`).then(res => res.data) }
/* 学校列表 */
export const shcoolLists = params => { return request.get(`universitys`, params).then(res => res.data) }
/** ************** 学生管理 **************** /
/*获取学生列表 */
export const listStudent = params => { return request.get(`student`, { params }).then(res => res.data) }
/* 获取学生信息 */
export const student = (id) => { return request.get(`student/${id}`).then(res => res.data) }
/* 学生管理 下载模板 */
export const downloadStudent = (id) => { return request.get(`student_tpl/${id}`, { responseType: 'blob' }).then(res => res.data) }
/* 学生管理 导入模板 */
export const importStudent = (id, params) => { return request.post(`student/${id}`, params).then(res => res.data) }
/* 修改学生信息 */
export const editStudent = (id, params) => { return request.put(`student/${id}`, params).then(res => res.data) }
/* 删除学生 */
export const passStudent = (id, params) => { return request.delete(`student/${id}`, params).then(res => res.data) }
/** ************** 科研项目 ****************/
/* 学生信息 */
export const listFundStudents = (params) => { return request.get(`student_fund`, { params }).then(res => res.data) }
export const getfundStudent = (id) => { return request.get(`student_fund/${id}`).then(res => res.data) }
export const editFundStudent = (id, params) => { return request.put(`student_fund/${id}`, params).then(res => res.data) }
/* 论文/材料信息 */
export const listFundPapers = (params) => { return request.get(`paper_fund`, { params }).then(res => res.data) }
export const getFundPaper = (id) => { return request.get(`paper_fund/${id}`).then(res => res.data) }
export const updateFundPaper = (id, params) => { return request.put(`paper_fund/${id}`, params).then(res => res.data) }
export const listFundReview = (params) => { return request.get(`review_fund`, { params }).then(res => res.data) }
export const listFundResult = (params) => { return request.get(`fund_result`, { params }).then(res => res.data) }

// 下载附件
export const downloadFundPDF = (id) => { return request.get(`paper_fund/${id}/download_pdf`, { responseType: 'blob' }).then(res => res.data) }
export const downloadFundAttachment = (id) => { return request.get(`paper_fund/${id}/download_attachment`, { responseType: 'blob' }).then(res => res.data) }
// EXCEL导出
export const draftReviewExcel = () => { return request.get(`paper_review/export`, { responseType: 'blob' }).then(res => res.data) }
export const draftResultExcel = () => { return request.get(`review_result/export`, { responseType: 'blob' }).then(res => res.data) }
export const fundReviewExcel = () => { return request.get(`review_fund/export`, { responseType: 'blob' }).then(res => res.data) }
export const fundResultExcel = () => { return request.get(`fund_result/export`, { responseType: 'blob' }).then(res => res.data) }

/** ************** 资格申请 遴选导师管理 **************** /
/* 导师管理 下载模板 */
export const downloadTutorTpl = () => { return request.get(`tutor_tpl`, { responseType: 'blob' }).then(res => res.data) }
/* 导师管理 导入模板 */
export const importTutor = (params) => { return request.post(`tutor`, params).then(res => res.data) }
/* 获取导师列表 */
export const listTutor = params => { return request.get(`tutor`, { params }).then(res => res.data) }
/* 获取导师信息 */
export const tutor = (id) => { return request.get(`tutor/${id}`).then(res => res.data) }
/* 修改学生信息 */
export const editTutor = (id, params) => { return request.put(`tutor/${id}`, params).then(res => res.data) }
/* 导师遴选项目列表 */
export const paperTutorList = (params) => { return request.get(`paper_tutor`, { params }).then(res => res.data) }

/** ************** 机构 **************** /
/*机构信息 */
export const collegeInfo = (id) => { return request.get(`organization/${id}`).then(res => res.data) }
/* 机构列表 */
export const collegeList = (params) => { return request.get(`organization`, { params }).then(res => res.data) }
/* 修改机构 */
export const editCollege = (id, params) => { return request.put(`organization/${id}`, params).then(res => res.data) }
/* 添加机构 */
export const addCollege = params => { return request.post(`organization`, params).then(res => res.data) }
/** ************** 职位 **************** /
/*职位列表 */
export const job = (id, params) => { return request.get(`position${id}`, params).then(res => res.data) }
export const getJob = (id) => { return request.get(`position/${id}`).then(res => res.data) }
/* 职位列表 */
export const listPositions = (params) => { return request.get(`position`, { params }).then(res => res.data) }
/* 职位详情 */
export const getPosition = (id) => { return request.get(`position/${id}`).then(res => res.data) }
/* 修改职位 */
export const editJob = (id, params) => { return request.put(`position/${id}`, params).then(res => res.data) }
/* 添加职位 */
export const addJob = params => { return request.post(`position`, params).then(res => res.data) }
/* 删除职位 */
export const passJob = (id) => { return request.delete(`position`, { params: { ids: id } }).then(res => res.data) }
/** ************** 账户 **************** /
/*管理员信息 */
export const manager = (id) => { return request.get(`manager/${id}`).then(res => res.data) }
/* 管理员列表 */
export const listManager = (params) => { return request.get(`manager`, { params }).then(res => res.data) }
/* 获取机构 */
export const organizations = params => { return request.get(`organizations`, params).then(res => res.data) }
/* 添加账户 */
export const addManager = params => { return request.post(`manager`, params).then(res => res.data) }
/* 修改职位 */
export const editManager = (id, params) => { return request.put(`manager/${id}`, params).then(res => res.data) }
/** ************** 论文 **************** /
/*论文进度 */
export const progress = params => { return request.get(`paper_progress`, params).then(res => res.data) }
/* 论文列表 */
export const paperList = (params) => { return request.get(`paper`, { params }).then(res => res.data) }
/* 论文列表 */
export const paperInfo = (id) => { return request.get(`paper/${id}`).then(res => res.data) }
/* 送审论文 */
export const submitPaper = (params) => { return request.put(`paper/batch_send`, params).then(res => res.data) }
/* 通过论文 */
export const adoptPaper = (id, params) => { return request.patch(`paper/${id}/pass`, params).then(res => res.data) }
/* 否决论文 */
export const vetoPaper = (id, params) => { return request.patch(`paper/${id}/no_pass`, params).then(res => res.data) }
/* 下载论文 */
export const downloadPaper = (id) => { return request.get(`paper/${id}/download`, { responseType: 'blob' }).then(res => res.data) }
export const downloadPaperBlind = (id) => { return request.get(`paper/${id}/download_blind`, { responseType: 'blob' }).then(res => res.data) }
export const downloadPaperBlindURL = (id) => {
  let token = sessionStorage.getItem('token')
  return `${base}p1/paper/${id}/download_blind?token=${token}`
}
/* 评议结果 */
export const reviewResultList = (params) => { return request.get(`review_result`, { params }).then(res => res.data) }

/* 论文送审列表 */
export const listPaperReview = (params) => { return request.get(`paper_review`, { params }).then(res => res.data) }
/* 论文批量导出列表 */
export const reviewExcel = (params) => { return request.get(`review_excel`, { params }, { responseType: 'blob' }).then(res => res.data) }
/* 获取送审数量 */
export const sendCount = (id, params) => { return request.get(`paper_count${id}`, params).then(res => res.data) }
/* 送审多篇 */
export const batchSend = (id, params) => { return request.put(`paper/batch_send`, params).then(res => res.data) }
/** ************** 论文评阅模板 ****************/
/* 获取系统模板类型 */
export const listSysReviewTpls = (params) => { return request.get(`sys_review_tpl`, params).then(res => res.data) }
/* 获取学校自定义模板 */
export const listReviewTemplate = (params) => { return request.get(`review_tpl`, { params }).then(res => res.data) }
/* 新增模板 */
export const addReviewTemplate = (params) => { return request.post(`review_tpl`, params).then(res => res.data) }
/* 预览模板 */
export const getReviewTemplate = (id) => { return request.get(`review_tpl/${id}`).then(res => res.data) }
/* 编辑模板 */
export const editReviewTemp = (id, params) => { return request.put(`review_tpl/${id}`, params).then(res => res.data) }
/* 预览模板 */
// export const getReviewTemplateParams = (id) => { return request.get(`review_tpl/${id}/params`).then(res => res.data) }
/* 预览模板html版 */
export const htmlReviewTemplate = (id) => { return request.get(`review_tpl/${id}/html_preview`).then(res => res.data) }
/** ************** 论文评阅书 ****************/
/* 预览评阅书html版 */
// export const htmlReview = (id) => { return request.get(`review/`+id+`/html`).then(res => res.data ); };
export const htmlReview = (id) => { return request.get(`review/66/html`).then(res => res.data) }
/** ************** 任务流模板 ****************/
/* 审批流模板列表 */
export const getTaskflowTpl = (id) => { return request.get(`taskflow_tpl/${id}`).then(res => res.data) }
/* 审批流模板列表 */
export const listTaskflowTpl = (params) => { return request.get(`taskflow_tpl`, { params }).then(res => res.data) }
/* 审批流模板步骤列表 */
export const listTaskflowTplStep = (id, params) => { return request.get(`taskflow_tpl/${id}/steps`, { params }).then(res => res.data) }
/* 审批流模板步骤列表 */
export const updateTaskflowTpl = (id, params) => { return request.patch(`taskflow_tpl/${id}`, params).then(res => res.data) }
/** ************** 任务流 ****************/
/* 待我审批的列表 */
export const listMyBeingTasks = (params) => { return request.get(`taskflow_list/formybeing`, params).then(res => res.data) }
/* 我审批过的列表 */
export const listMyApprovedTasks = (params) => { return request.get(`taskflow_list/formyapproved`, params).then(res => res.data) }
/* 我创建的列表 */
export const listMyCreateTasks = (params) => { return request.get(`taskflow_list/mycreate`, params).then(res => res.data) }
/* 任务流 */
export const getTaskflow = (id) => { return request.get(`taskflow/${id}`).then(res => res.data) }
/* 更新任务流 */
export const updateTaskflow = (id, params) => { return request.post(`taskflow/${id}`, params).then(res => res.data) }

/* **************************************** 专家端 *****************************************/
// 专家通过邀请码获取个人信息
export const loginInviteToken = (token) => { return request.post(`login_invite_token`, { invite_token: token }).then(res => res.data) }
// 专家通过邀请码查看页面
export const sendInviteToken = (token) => { return request.get(`invite_view_home`, { params: { invite_token: token } }).then(res => res.data) }

// 专家端获e二维码
export const pBindWechatQrImg = () => { return request.get(`professor/bind_wechat_url`).then(res => res.data) }
export const pWechatIsBind = () => { return request.get(`professor/is_bind`).then(res => res.data) }
export const pSkipBindWechat = () => { return request.post(`professor/skip_bind_wechat`).then(res => res.data) }

export const pUploadCardImg = (body) => { return request.put(`upload/cardimg`, body).then(res => res.data) }
export const pUploadCardImgURL = () => { return `${base}p1/upload/cardimg` }
export const pUpdateGeneralInfo = (params) => { return request.put(`professor/general`, params).then(res => res.data) }
export const pUpdatePrivateInfo = (params) => { return request.put(`professor/private`, params).then(res => res.data) }
export const pUpdateSubjectInfo = (params) => { return request.put(`professor/subject`, params).then(res => res.data) }
export const pAgreeRegistrationAgreement = () => { return request.put(`professor/agree_registration_agreement`).then(res => res.data) }

// 账户信息
export const pGetAccountInfo = () => { return request.get(`account`).then(res => res.data) }
// 申请提款
export const pRequestWithdraw = (params) => { return request.post(`account/withdraw`, params).then(res => res.data) }
// 已出费用详情
export const pListOrder = (params) => { return request.get(`account/order`, { params }).then(res => res.data) }
// 提款账单
export const pListWithdraw = (params) => { return request.get(`account/withdraw`, { params }).then(res => res.data) }
/* 获取专家个人账户信息 结算设置 */
export const pWithdraProfile = () => { return request.get(`profile`).then(res => res.data) }

// 论文送审详情
// 论文列表
export const pPaperList = (params) => { return request.get(`paper`, { params }).then(res => res.data) }
export const pPaperDetail = (id) => { return request.get(`paper/${id}/paper`).then(res => res.data) }
export const pPaperFundDetail = (id) => { return request.get(`paper/${id}/fund`).then(res => res.data) }
export const pPaperTutorDetail = (id) => { return request.get(`paper/${id}/tutor`).then(res => res.data) }
// 接收论文
export const receiveP = (id) => { return request.patch(`paper/${id}/receive`).then(res => res.data) }
// 拒收论文
export const rejectP = (id, params) => { return request.patch(`paper/${id}/reject`, params).then(res => res.data) }
// 论文PDF URL
export const pPaperPDFURL = (id) => { return config.api_domain + `p1/paper/${id}/download_blind` }
export const pPaperFundPDFURL = (id) => {
  let token = sessionStorage.getItem('token')
  return `${base}p1/paper/${id}/download_fund_pdf?token=${token}`
}
export const pPaperAttachmentURL = (id) => {
  let token = sessionStorage.getItem('token')
  return `${base}p1/paper/${id}/download_fund_attachment?token=${token}`
}
export const pPaperTutorPDFURL = (id) => {
  let token = sessionStorage.getItem('token')
  return `${base}p1/paper/${id}/download_tutor_pdf?token=${token}`
}
export const pPaperTutorAttachmentURL = (id) => {
  let token = sessionStorage.getItem('token')
  return `${base}p1/paper/${id}/download_tutor_attachment?token=${token}`
}
// 下载评阅表
export const downloadReviewPDF = (paperId, professorId) => { return request.get(`review/${paperId}/pdf`, { params: { professor_id: professorId }, responseType: 'blob' }).then(res => res.data) }
export const downloadReviewDetailPDF = (paperId, professorId) => { return request.get(`review/${paperId}/pdf_complate`, { params: { professor_id: professorId }, responseType: 'blob' }).then(res => res.data) }

// 论文评阅
// 获取论文评阅结果
export const getPaperReview = (id) => { return request.get(`review/${id}`).then(res => res.data) }
// 保存论文评阅
export const savePaperReview = (params) => { return request.post(`review`, params).then(res => res.data) }
// 提交论文评阅
export const submitPaperReview = (id) => { return request.post(`review/${id}`).then(res => res.data) }
// 通过论文
// export const adoptP = (id) => { return request.patch(`paper/${id}/pass`).then(res => res.data) }
// 否决论文
// export const vetoP = (id) => { return request.patch(`paper/${id}/no_pass`).then(res => res.data) }

// 专家账单列表
export const reviewOrder = (params) => { return request.get(`account/order`, { params }).then(res => res.data) }

/* ************************* 导师遴选 ************************* */
// 导师遴选模板下载
export const downloadTutors = (id) => { return request.get(`tutor_tpl/${id}`, { responseType: 'blob' }).then(res => res.data) }
// 导入遴选导师
export const importTutors = (id, params) => { return request.post(`tutor/${id}`, params).then(res => res.data) }
// 导师列表
export const listTutors = params => { return request.get(`tutor`, { params }).then(res => res.data) }
// 导师详情
export const getTutors = (id) => { return request.get(`tutor/${id}`).then(res => res.data) }
// 修改导师信息
export const editTutors = (id, params) => { return request.put(`tutor/${id}`, params).then(res => res.data) }
// 导师遴选项目列表
export const listTutorsPaper = params => { return request.get(`paper_tutor`, { params }).then(res => res.data) }
// 导师详情
export const TutorsPaper = (id) => { return request.get(`paper_tutor/${id}`).then(res => res.data) }
// 修改导师信息
export const editTutorsPaper = (id, params) => { return request.put(`paper_tutor/${id}`, params).then(res => res.data) }

// /* *************************************** 内部接口 ********************************************/
// // 专家列表
// export const iProfessorList = (params) => { return request.get(`inner/professor`, { params }).then(res => res.data) }
// // 发送邀请邮件
// export const iInviteEmail = (params) => { return request.post(`inner/invite_email`, params).then(res => res.data) }
// // 待匹配论文列表
// export const iPaperSendList = (params) => { return request.get(`inner/wait_match`, { params }).then(res => res.data) }
// // 专家账单页面
// export const iProfessorOrder = (params) => { return request.get(`inner/professor_order`, { params }).then(res => res.data) }
// // 论文匹配专家
// export const iMatchPaper = (params) => { return request.post(`inner/match_paper`, params).then(res => res.data) }
// // 专家账单确认
// export const iOrderConfirm = (id) => { return request.patch(`inner/order/${id}/confirm`).then(res => res.data) }
