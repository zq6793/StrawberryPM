import config from '@/common/config.js'
import requestV3 from './request'
import requestV4 from './requestv4'

let base = config.api_url + '/'
// --------------------------------- 登录 ---------------------------------

// 扫码登录
export const vLogin = params => { return requestV4.post(`login/wechat_web`, params).then(res => res.data) }
// 验证码登录
export const getCode = params => { return requestV4.post(`validate_code`, params).then(res => res.data) }
export const pLogin = params => { return requestV4.post(`login/validate_code`, params).then(res => res.data) }

// --------------------------------- 公司信息 ---------------------------------

// 注册获取验证码
export const sendCode = params => { return requestV4.post(`validate_code`, params).then(res => res.data) }
// 注册信息
export const register = params => { return requestV4.post(`sign_up`, params).then(res => res.data) }
// 注册后进行扫码
export const registerWechat = (id, params) => { return requestV4.put(`bind_wechat/` + id, params).then(res => res.data) }
// 获取注册信息
export const companyInfo = params => { return requestV4.get(`company/${params}`).then(res => res.data) }
// 提交认证信息
export const certification = (id, params) => { return requestV4.put(`company/${id}/commit`, params).then(res => res.data) }
// 绑定公众号
export const authLocation = params => { return requestV4.get(`company_wxinfo_auth_url`, { params }).then(res => res.data) }
// 成功绑定
export const accredit = params => { return requestV4.post(`company_wxinfo`, params).then(res => res.data) }
// 取消绑定
export const unAccredit = params => { return requestV4.patch(`company_wxinfo/${params}/unauth`).then(res => res.data) }
// 成功后获取的信息
export const companywxInfo = params => { return requestV4.get(`company_wxinfo/${params}`).then(res => res.data) }

/** **************************************  门店信息  ****************************************/
/* 获取门店 */
export const storeList = params => { return requestV4.get(`store`, { params: params }).then(res => res.data) }
/* 获取门店 */
export const getStore = id => { return requestV4.get(`store/${id}`).then(res => res.data) }
/* 编辑门店 */
export const editStore = (id, params) => { return requestV4.put(`store/${id}`, params).then(res => res.data) }
/* 添加门店 */
export const addStore = params => { return requestV4.post(`store`, params).then(res => res.data) }
/* 删除门店 */
export const deleteStores = (id, params) => { return requestV4.patch(`store/${id}/close`, params).then(res => res.data) }

/** **************************************  房型  ****************************************/
/* 获取房型列表 */
export const roomType = params => { return requestV4.get(`roomtype`, { params }).then(res => res.data) }
/* 获取房型列表 */
export const getRoomType = id => { return requestV4.get(`roomtype/${id}`).then(res => res.data) }
/* 编辑房型 */
export const editRoomType = (id, params) => { return requestV4.put(`roomtype/${id}`, params).then(res => res.data) }
/* 删除房型 */
export const deleteRoomtypes = params => { return requestV4.delete(`roomtype/batch_delete`, params).then(res => res.data) }
/* 添加房型 */
export const addRoomtypes = params => { return requestV4.post(`roomtype`, params).then(res => res.data) }

/** **************************************  小区  ****************************************/

/** **************************************  房间  ****************************************/
/* 获取房间列表 */
export const roomList = params => { return requestV4.get(`room`, { params }).then(res => res.data) }
/* 获取房间 */
export const getRoom = id => { return requestV4.get(`room/${id}`).then(res => res.data) }
/* 添加房间 */
export const addRoom = params => { return requestV4.post(`room/`, params).then(res => res.data) }// 没写
/* 编辑房间 */
export const editRoom = (id, params) => { return requestV4.put(`room/${id}`, params).then(res => res.data) }
/* 删除房间 */
export const deleteRoom = params => { return requestV4.patch(`room/batch_close`, params).then(res => res.data) }
/* 集中式导入 */
export const unionImport = params => { return requestV4.post(`room/union`, params).then(res => res.data) }// 没写
/* 分布式导入 */
export const dotImport = params => { return requestV4.post(`room/dot`, params).then(res => res.data) }// 没写

/** **************************************  角色  ****************************************/
/* 角色列表 */
export const roleList = params => { return requestV4.get(`position`, { params }).then(res => res.data) }
/* 角色 */
export const getRole = id => { return requestV4.get(`position/${id}`).then(res => res.data) }
/* 编辑角色 */
export const editRole = (id, params) => { return requestV4.put(`position/` + id, params).then(res => res.data) }
/* 获取权限列表 */
export const permissionList = () => { return requestV4.get(`permissions`).then(res => res.data) }
/* 删除角色 */
export const deleteRole = params => { return requestV4.patch(`position/batch_delete`, params).then(res => res.data) }
/* 添加角色 */
export const addRole = params => { return requestV4.post(`position`, params).then(res => res.data) }

/** **************************************  员工  ****************************************/
/* 员工列表 */
export const staffList = params => { return requestV4.get(`employee`, { params }).then(res => res.data) }
/* 员工 */
export const getStaff = id => { return requestV4.get(`employee/${id}`).then(res => res.data) }
/* 添加员工 */
export const addStaff = params => { return requestV4.post(`employee`, params).then(res => res.data) }
/* 绑定员工 */
export const bindStaff = (id, params) => { return requestV4.patch(`employee_wxinfo/${id}`, params).then(res => res.data) }// 没写
/* 修改员工 */
export const editStaff = (id, params) => { return requestV4.put(`employee/${id}`, params).then(res => res.data) }// 没写完
/* 离职员工 */
export const quitStaff = (id, params) => { return requestV4.patch(`employee/${id}/dimission`, params).then(res => res.data) }
/* 获取所有职位 */
export const jobList = params => { return requestV4.get(`common/position`, params).then(res => res.data) }

/** **************************************  公共接口   ****************************************/
/* 获取城市 门店 */
// export const getCity = params => { return requestV4.get(`common/store`, params).then(res => res.data); };

export const listStoreByCity = params => { return requestV4.get(`common/store`, params) }

export const listCityStore = () => { return requestV4.get('common/store/city') }

export const listMyCityStore = () => { return requestV4.get('common/employee_store').then(res => res.data) }

export const getStoreList = params => { return requestV3.post(`${base}employee/employee/showmystores`, params) }

// 上传图片
export const baseimageupload = params => { return requestV3.post(`${base}common/baseimageupload`, params).then(res => res.data) }

/* 对权限接口进判断 */
export const listMenu = params => { return requestV4.get(`permissions`, params).then(res => res.data) }
// export const listMenu = params => { return requestV3.post(`${base}account/login/listmenu`, params).then(res => res.data) }
export const getName = params => { return requestV3.post(`${base}account/login/getcurrentinfo`, params).then(res => res.data) }
// 首页
export const home = params => { return requestV3.post(`${base}home/home/home`, params).then(res => res.data) }
/* 公共接口 */
/* 城市列表 */
export const getCityList = params => { return requestV3.post(`${base}employee/employee/showmycities`, params) }
/* 获取门店名 */

/* 获取 全国省份 */
export const province = params => { return requestV4.get(`common/public/province`, params).then(res => res.data) }
/* 获取 省份下的城市 */
export const citys = id => { return requestV4.get(`common/public/city/${id}`).then(res => res.data) }
/* 获取 区 */
export const districts = id => { return requestV4.get(`common/public/district/${id}`).then(res => res.data) }


/* 获取门店下的小区 */
export const showCommunity = params => { return requestV3.post(`${base}store/community/showcommunity`, params) }
/* 获取门店下的楼栋 */
export const showBuilding = params => { return requestV3.post(`${base}store/roomunion/showbuilding`, params) }

/* 公寓管理 */
/* 公寓管理门店列表 */
export const storeManage = params => { return requestV3.post(`${base}store/store/liststore`, params) }

/* 公寓管理
删除门店 */
export const deletestore = params => { return requestV3.post(`${base}store/store/deletestore`, params) }

/* 公寓管理
批量删除门店 */
export const destroyStore = params => { return requestV3.post(`${base}store/store/destroystore`, params) }

/* 添加集中式的门店 */
export const addstoreunion = params => { return requestV3.post(`${base}store/store/addstore`, params) }

/* 查看门店信息 */
// export const getStore = params => { return requestV3.post(`${base}store/store/getstore`, params) }

/* 公寓管理
  编辑门店 */
export const updateStore = params => { return requestV3.post(`${base}store/store/updatestore`, params) }

/* 公寓管理
  小区管理 */
export const listCommunity = params => { return requestV3.post(`${base}store/community/listcommunity`, params) }

/* 公寓管理
  添加小区 */
export const addCommunity = params => { return requestV3.post(`${base}store/community/addcommunity`, params) }

/* 公寓管理
  删除小区 */
export const delCommunity = params => { return requestV3.post(`${base}store/community/deletecommunity`, params) }

/* 公寓管理
  批量删除小区 */
export const destroyCommunity = params => { return requestV3.post(`${base}store/community/destroycommunity`, params) }

/* 公寓管理
  查看小区信息 */
export const getCommunity = params => { return requestV3.post(`${base}store/community/getcommunity`, params) }

/* 公寓管理
  编辑小区 */
export const updateCommunity = params => { return requestV3.post(`${base}store/community/updatecommunity`, params) }

/* 公寓管理
  房间列表 集中式 -- */
export const listunion = params => { return requestV3.post(`${base}store/roomunion/listroom`, params) }

/* 公寓管理
  房间列表 分布式-- */
export const listdot = params => { return requestV3.post(`${base}store/roomdot/listdot`, params) }

/* 公寓管理
  批量 长短租 */
export const showTemplate = params => { return requestV3.post(`${base}store/template/showtemplate`, params) }

/* 房间管理
  删除集中式房间  */
export const destroy = params => { return requestV3.post(`${base}store/roomunion/destroy`, params) }

/* 房间管理
  添加集中式  */
export const addunion = params => { return requestV3.post(`${base}store/roomunion/addunion`, params) }

/* 房间下载模板 */
export const upTemplate = params => { return requestV3.post(`${base}store/roomunion/getuniontemplate`, params, { responseType: 'blob' }) }

/* 房间管理
  添加分布式 */
export const addDot = params => { return requestV3.post(`${base}store/roomdot/adddot`, params) }

/* 房间管理
  删除列表 */
export const destroys = params => { return requestV3.post(`${base}/store/roomdot/destroy`, params) }

/* 房间管理
  查看集中式  */
export const getUnion = params => { return requestV3.post(`${base}store/roomunion/getunion`, params) }

/* 房间管理
  查看分布式 */
export const getDot = params => { return requestV3.post(`${base}store/roomdot/getdot`, params) }

/* 房间管理
  编辑集中式房间 */
export const submitUnion = params => { return requestV3.post(`${base}store/roomunion/submitunion`, params) }

/* 房间管理
  批量 分布式 */
export const batchUpdatedot = params => { return requestV3.post(`${base}store/roomdot/batchupdatedot`, params) }

/* 房间管理
分布式下载模板 */
export const getdotTemplate = params => { return requestV3.post(`${base}store/roomunion/getdottemplate`, params, { responseType: 'blob' }) }

/* 房间管理
分布式导入 */
export const importRoomdot = params => { return requestV3.post(`${base}store/roomunion/importroomdot`, params) }

/* 房间管理
  批量 集中式 */
export const batchUpdateunion = params => { return requestV3.post(`${base}store/roomunion/batchupdateunion`, params) }

/* 房间批量导入 */
export const homeLead = params => { return requestV3.post(`${base}store/roomunion/importroomunion`, params) }
/* 房型管理
  列表 */
export const listRoomtype = params => { return requestV3.post(`${base}store/roomtype/listroomtype`, params) }

/* 房型管理
  删除房型 */
export const deleteroomtype = params => { return requestV3.post(`${base}store/roomtype/deleteroomtype`, params) }

/* 房型管理
  批量删除 */
export const destroyRoomtype = params => { return requestV3.post(`${base}store/roomtype/destroyroomtype`, params) }

/* 房型管理
  添加房型 */
export const addroomtype = params => { return requestV3.post(`${base}store/roomtype/addroomtype`, params) }

/* 房型管理
  查找房型 */
export const searchRoomtype = params => { return requestV3.post(`${base}store/roomtype/searchroomtype`, params) }

/* 房型管理
  房型信息 */
export const getRoomtype = params => { return requestV3.post(`${base}store/roomtype/getroomtype`, params) }

/* 房型管理
  编辑房型 */
export const updateRoomtype = params => { return requestV3.post(`${base}store/roomtype/updateroomtype`, params) }

/* 门店管理
  查找门店 */
export const searchStore = params => { return requestV3.post(`${base}store/store/searchstore`, params) }

/* 合同模板
  模板列表 */
export const listtemplate = params => { return requestV3.post(`${base}store/template/listtemplate`, params) }

/* 合同模板
  删除模板 */
export const deletetemplate = params => { return requestV3.post(`${base}store/template/deletetemplate`, params) }

/* 合同模板
  批量删除模板 */
export const destroyTemplate = params => { return requestV3.post(`${base}store/template/destroytemplate`, params) }

/* 合同模板
  获取模板信息 */
export const getTemplate = params => { return requestV3.post(`${base}store/template/gettemplate`, params) }

/* 合同模板
  编辑模板 */
export const updateTemplate = params => { return requestV3.post(`${base}store/template/updatetemplate`, params) }

/* 合同模板
  添加模板 */
export const addtemplate = params => { return requestV3.post(`${base}store/template/addtemplate`, params) }

/* 合同模板
  搜索模板 */
export const searchTemplate = params => { return requestV3.post(`${base}store/template/searchtemplate`, params) }

/* 公寓管理
  智能设备列表 */
export const smartDevices = params => { return requestV3.post(`${base}smartdevice/smartdevice/listsmartdevice`, params) }

/* 智能设备详情 */
export const showhistoryData = params => { return requestV3.post(`${base}/smartdevice/smartdevice/showhistorydata`, params) }

/* 公寓管理
  查看数据状态 */
export const record = params => { return requestV3.post(`${base}smartdevice/smartdevice/record`, params) }

/* 服务管理
  类型列表 某个服务信息 */
export const serviceTypes = params => { return requestV3.post(`${base}service/servicetype/listservicetype`, params) }

/* 服务管理
  编辑服务 */
export const editService = params => { return requestV3.post(`${base}service/servicetype/updateservicetype`, params) }

/* 服务管理
  添加服务 */
export const addService = params => { return requestV3.post(`${base}service/servicetype/addservicetype`, params) }

/* 服务管理
  服务订单列表 */
export const serviceLists = params => { return requestV3.post(`${base}service/serviceorder/listserviceorder`, params) }
export const serviceList = params => { return requestV4.get(`service`, { params }).then(res => res.data) }

/* 服务管理
  服务订单
  服务列表 */
export const getServiceType = params => { return requestV3.post(`${base}service/serviceorder/getservicetype`, params) }

/* 服务管理
  服务订单
  详情 */
export const getOrderDetail = params => { return requestV3.post(`${base}service/serviceorder/getdetail`, params) }

/*
  获取服务管理
  预约订单列表 */
export const reserveOrder = params => { return requestV3.post(`${base}service/reserveorder/listreserveorder`, params) }

/* 服务管理
  获取服务管理
  来访类型列表 */
export const getVisitType = params => { return requestV3.post(`${base}service/reserveorder/getvisittype`, params) }

/* 预访批量导出 */
export const reserveExport = params => { return requestV3.post(`${base}service/reserveorder/reserveordertoexcel`, params, { responseType: 'blob' }) }

/* 商城管理
  商品分类 */
export const getGoodsList = params => { return requestV3.post(`${base}shop/goodscategory/goodscategory`, params) }

/* 商城管理
  编辑商品分类 */
export const editCategory = params => { return requestV3.post(`${base}shop/goodscategory/updatecategory`, params) }

/* 商城管理
  添加商品分类 */
export const addCategory = params => { return requestV3.post(`${base}shop/goodscategory/addcategory`, params) }

/* 商城管理
  删除商品分类 */
export const deleteCategory = params => { return requestV3.post(`${base}shop/goodscategory/deletecategory`, params) }

/* 商城管理
  商品列表 */
export const getGoodList = params => { return requestV3.post(`${base}shop/goods/listgoods`, params) }

/* 商城管理
  批量上、下架 */
export const updateOnsale = params => { return requestV3.post(`${base}shop/goods/updateonsale`, params) }

/* 商城管理
  删除商品 */
export const deleteGoods = params => { return requestV3.post(`${base}shop/goods/deletegoods`, params) }

/* 商城管理
  添加商品 */
export const addGoods = params => { return requestV3.post(`${base}shop/goods/addgoods`, params) }

/* 商城管理
  编辑商品 */
export const editGoods = params => { return requestV3.post(`${base}shop/goods/updategoods`, params) }

/* 商城管理
  商品订单列表 */
export const goodOrderList = params => { return requestV3.post(`${base}shop/goodsorder/listgoodsorder`, params) }

/* 商城管理
  商品订单详情 */
export const goodsDetail = params => { return requestV3.post(`${base}shop/goodsorder/detail`, params) }

/* 运营 职位管理
  列表 */
export const jobLists = params => { return requestV3.post(`${base}employee/position/listposition`, params) }

/* 运营 销控
  列表 */
export const details = params => { return requestV3.post(`${base}sellcontrol/sellcontrol/details`, params) }

/* 运营 调价
  列表 */
export const priceControl = params => { return requestV3.post(`${base}pricecontrol/pricecontrol/pricecontrol`, params) }

/* 运营 调价
  查看水电费 */
export const utilities = params => { return requestV3.post(`${base}pricecontrol/pricecontrol/utilities`, params) }

/* 运营 调价
  修改 */
export const updataRentpPice = params => { return requestV3.post(`${base}pricecontrol/pricecontrol/create`, params) }

/* 运营 调价
  批量修改 */
export const batchCreate = params => { return requestV3.post(`${base}pricecontrol/pricecontrol/batchcreate`, params) }

/* 运营 调价
  修改水电费 */
export const updataUtility = params => { return requestV3.post(`${base}pricecontrol/pricecontrol/changeutility`, params) }

/* 运营 调价
  批量导出 */
export const adjExport = params => { return requestV3.post(`${base}pricecontrol/pricecontrol/pricecontroltoexcel`, params, { responseType: 'blob' }) }

/* 运营 调价
  下载模板 */
export const priceTemplate = params => { return requestV3.post(`${base}pricecontrol/pricecontrol/pricetemplate`, params, { responseType: 'blob' }) }

/* 运营 调价
  导入模板 */
export const importPrice = params => { return requestV3.post(`${base}pricecontrol/pricecontrol/importprice`, params) }

/* 运营 调价
  根据任务流ID查看调价详情 */
export const priceDetailByTaskflow = (id) => { return requestV4.get(`/price/taskflow/${id}`) }

/* 权限 职位管理
  列表 搜索 */
export const searchJob = params => { return requestV3.post(`${base}employee/position/searchposition`, params) }

/* 权限 职位管理
  新增职位 */
export const addPosition = params => { return requestV3.post(`${base}employee/position/addposition`, params) }

/* 权限 删除 */
export const deletePosition = params => { return requestV3.post(`${base}employee/position/deleteposition`, params) }

/* 权限
  显示所有权限 */
export const showPrivilegedetail = params => { return requestV3.post(`${base}employee/position/showprivilegedetail`, params) }

/* 权限 职位管理 查看编辑
  某条职位信息 */
export const getPosition = params => { return requestV3.post(`${base}employee/position/getposition`, params) }

/* 权限 职位管理
  编辑某条职位信息 */
export const submitJob = params => { return requestV3.post(`${base}employee/position/submitposition`, params) }

/* 权限 新增门店 */
export const setupposition = params => { return requestV3.post(`${base}employee/employee/setupposition`, params) }

/* 权限 员工管理
  员工列表 */
export const listemp = params => { return requestV3.post(`${base}employee/employee/listemp`, params) }

/* 权限 员工管理
  模糊查询 */
export const searcheMp = params => { return requestV3.post(`${base}employee/employee/searchemp`, params) }

/* 权限 员工管理
  新增员工 */
export const addStaffs = params => { return requestV3.post(`${base}employee/employee/submitemp`, params) }

/* 权限 员工管理
  二维码新增员工 */
export const qrcodeaddCompany = params => { return requestV3.post(`${base}employee/employee/bindwechat`, params) }

/* 权限 员工管理
  二维码判断是否添加成功 */
export const isBindwxid = params => { return requestV3.post(`${base}employee/employee/isbindwxid`, params) }

/* 权限 员工管理
  新增员工 职位 */
export const showPositions = params => { return requestV3.post(`${base}employee/position/showpositions`, params) }

/* 权限 员工管理
  新增员工 门店 */
export const getAddStaffStore = params => { return requestV3.post(`${base}employee/employee/showstore`, params) }

/* 权限 员工管理
  新增员工 城市 */
export const showmycompanycities = params => { return requestV3.post(`${base}employee/employee/showmycompanycities`, params) }

/* 权限 员工管理
  编辑员工 */
export const updaTeemp = params => { return requestV3.post(`${base}employee/employee/updateemp`, params) }

/* 权限 员工管理
删除 */
export const delemp = params => { return requestV3.post(`${base}employee/employee/delemp`, params) }

// 权限 审批流列表
// export const flowList = params => { return requestV3.post(`${base}taskflow/template/listtemplate`, params) }
export const taskflowTpl = params => { return requestV4.get(`taskflow_tpl`, params) }
// 权限 查看审批流详情
// export const showTask = params => { return requestV3.post(`${base}taskflow/template/show`, params) }
export const showTaskStep = (id, params) => { return requestV4.get(`taskflow_tpl/${id}/steps`, params).then(res => res.data) }

// 权限 展示职位名称
export const showPosition = params => { return requestV3.post(`${base}employee/position/showposition`, params) }

// 权限 新建审批流
export const createFlow = params => { return requestV3.post(`${base}taskflow/template/create`, params) }

// 权限 修改审批流
// export const updateFlow = params => { return requestV3.post(`${base}taskflow/template/edit`, params) }
export const editTaskFlow = (id, params) => { return requestV4.patch(`taskflow_tpl/${id}`, params).then(res => res.data) }

// 权限 任务流(列表)
// 权限 任务流 待我审批
export const listFormBeing = (params) => { return requestV4.get(`taskflow_list/formybeing`, { params }) }
// 权限 任务流 我发起的
export const listMyCreate = (params) => { return requestV4.get(`taskflow_list/mycreate`, { params }) }
// 权限 任务流 我完成的
export const listFormApproved = (params) => { return requestV4.get(`taskflow_list/formyapproved`, { params }) }
// 权限 任务流 全部
export const listAll = (params) => { return requestV4.get(`taskflow_list/all`, { params }) }


// 权限 任务流查看详情
// export const TaskFlowDetail = id => { return requestV4.get(`taskflow/${id}`) }
export const TaskFlowDetail = params => { return requestV3.post(`${base}taskflow/taskflow/show`, params) }
export const NewTaskFlowDetail = (id) => { return requestV4.get(`taskflow/${id}`) }

// 权限 任务流通过
// 权限 任务流驳回

// 权限 任务流提醒列表/待我审批
export const listtaskFlow = params => { return requestV3.post(`${base}taskflow/taskflow/listtaskflow`, params) }

// 权限 任务流确认审批
export const affirmAudit = params => { return requestV3.post(`${base}taskflow/taskflow/audit`, params) }
export const affirmAuditV4 = (id, params) => { return requestV4.post(`taskflow/${id}`, params) }

// 权限 任务流确认审批
export const UpdateTask = (id, params) => { return requestV4.post(`taskflow/${id}`, params).then(res => res.data) }

/* 运营 合同
预定列表 */
export const booking = params => { return requestV3.post(`${base}contract/operation/booking`, params) }

/* 运营 合同
查看预定列表 */
export const lookBook = params => { return requestV3.post(`${base}contract/operation/book`, params) }

/* 运营 合同
入住列表 */
export const operatList = params => { return requestV3.post(`${base}contract/contract/showcontract`, params) }

/* 运营 合同批量导出 */
export const contractExport = params => { return requestV3.post(`${base}contract/contract/export`, params, { responseType: 'blob' }) }

/* 运营 合同
查看入住列表 */
export const operationFind = params => { return requestV3.post(`${base}contract/operation/operationfind`, params) }

/* 运营 合同
查看pdf */
export const pdfLook = params => { return requestV3.post(`${base}contract/operation/pdflook`, params) }

/* 运营 合同
查看pdf */
export const uploadPd = params => { return requestV3.post(`${base}contract/operation/uploadpdfcontract`, params) }

/* 运营 合同
列表 */
export const showreSident = params => { return requestV3.post(`${base}resident/resident/showresident`, params) }

/* 运营 合同 获取解除时间 */
export const limitContract = params => { return requestV3.post(`${base}mini/server/limitcontract`, params) }

/* 运营 批量签署合同 */
export const batchSign = params => { return requestV3.post(`${base}mini/contract/batchsign`, params) }

/* 运营 合同
查看基本信息 */
export const residentInfo = params => { return requestV3.post(`${base}resident/resident/residentinfo`, params) }

/* 运营 合同
修改基本信息 */
export const updateresident = params => { return requestV3.post(`${base}resident/resident/updateresident`, params) }

/* 运营 住户
查看住户列表 */
export const resident = params => { return requestV3.post(`${base}contract/resident/resident`, params) }
export const residentInfoDetail = (id) => { return requestV4.get(`/resident/${id}`) }

/* 运营 住户
账单信息 */
export const getCoupon = params => { return requestV3.post(`${base}resident/resident/getcoupon`, params) }

/* 运营 同住人 */
export const residentPeo = id => { return requestV4.get(`/resident/${id}/co_resident`) }

/* 运营 删除同住人 */
export const deleteResident = id => { return requestV4.delete(`/resident/${id}/co_resident_delete`) }

/* 运营 住户
账单信息 */
export const moneyList = params => { return requestV3.post(`${base}resident/resident/getresidentorder`, params) }

/* 住户 批量导出 */
export const residentExport = params => { return requestV3.post(`${base}resident/resident/residenttoexcel`, params, { responseType: 'blob' }) }

/* 住户 门禁卡列表 */
export const itemInfo = params => { return requestV3.post(`${base}store/item/iteminfo`, params) }

/* 住户 添加门禁卡 */
export const addItem = params => { return requestV3.post(`${base}store/item/additem`, params) }

/* 住户 编辑门禁卡 */
export const updateItem = params => { return requestV3.post(`${base}store/item/updateitem`, params) }

/* 住户 删除门禁卡 */
export const delItem = params => { return requestV3.post(`${base}store/item/delitem`, params) }

/* 住户 删除门禁卡 */
export const item = params => { return requestV3.post(`${base}store/item/item`, params) }

/* 营销 优惠卷 */
export const listCoupon = params => { return requestV3.post(`${base}coupon/coupon/listcoupon`, params) }

/* 营销 添加优惠卷 */
export const addCoupon = params => { return requestV3.post(`${base}coupon/coupon/addcoupon`, params) }

/* 营销 编辑优惠卷 */
export const updateCoupon = params => { return requestV3.post(`${base}coupon/coupon/updatecoupon`, params) }

/* 营销 活动列表 */
export const listActivity = params => { return requestV3.post(`${base}activity/activity/listactivity`, params) }

/* 营销 活动状态修改 */
export const LowerActivity = params => { return requestV3.post(`${base}activity/activity/LowerActivity`, params) }

/* 营销 活动统计基础信息 */
export const activityCount = params => { return requestV3.post(`${base}activity/activity/activitycount`, params) }

/* 营销 活动统计数据趋势 */
export const activeTrend = params => { return requestV3.post(`${base}activity/activity/date`, params) }

/* 营销 活动门店 */
export const activeStore = params => { return requestV3.post(`${base}activity/activity/getactivitystore`, params) }

/* 营销 二维码 */
export const activityCode = params => { return requestV3.post(`${base}activity/activity/activityCode`, params) }

/* 营销 刮刮乐 */
export const addScratch = params => { return requestV3.post(`${base}activity/activity/addScratch`, params) }

/* 营销 刮刮乐 */
export const getStores = params => { return requestV3.post(`${base}activity/activity/getStore`, params) }

/* 营销 转盘 */
export const addTrntable = params => { return requestV3.post(`${base}activity/activity/addTrntable`, params) }

/* 营销 活动奖品 */
export const activityIni = params => { return requestV3.post(`${base}activity/activity/activityIni`, params) }

/* 营销 办理入住 */
export const checkIn = params => { return requestV3.post(`${base}activity/activity/checkIn`, params) }

// 营销 吸粉
export const getAttract = params => { return requestV3.post(`${base}activity/activity/addattractactivity`, params) }

// /*营销 老带新*/
export const oldbeltNew = params => { return requestV3.post(`${base}activity/activity/oldbeltNew`, params) }

/* 营销 获取住户列表 */
export const couponResident = params => { return requestV3.post(`${base}coupon/coupon/resident`, params) }
export const couponResidentList = (params) => { return requestV4.get(`resident_list`, { params }) }

/* 营销 派发优惠券 */
export const assignCoupon = params => { return requestV3.post(`${base}coupon/coupon/assigncoupon`, params) }

/* 营销 优惠券记录 */
export const couponstatistics = params => { return requestV3.post(`${base}coupon/coupon/couponstatistics`, params) }
export const couponRecordList = (params) => { return requestV4.get(`coupon`, { params }) }

/* 营销 获取租户钱包 */
export const getWallet = (id) => { return requestV4.get(`wallet/${id}`) }

/* 营销 获取租户钱包流水 */
export const getWalletNum = (id, customer_id) => { return requestV4.get(`wallet/${id}/bill?customer_id=${customer_id}`) }

/* 财务 流水列表 */
// export const billList = params => { return requestV3.post(`${base}bill/bill/listbill`, params) }
export const billList = params => { return requestV4.get(`bill_list`, { params: params }) }

/* 财务 流水详情 */
export const showBill = params => { return requestV3.post(`${base}bill/bill/showbill`, params) }

/* 财务 查看章子 */
export const billSeal = params => { return requestV3.post(`${base}bill/bill/billtickertape`, params) }

/* 财务 业务单 */
/* 财务 业务单(退房单列表) */
export const backRoomList = params => { return requestV4.get(`check_out/_/list`, { params: params }) }
/* 财务 业务单(退房单列表 导出excel) */
export const backRoomExport = params => { return requestV4.get(`check_out/_/list/export`, { params: params, responseType: 'blob' }) }
/* 财务 业务单(退房单详情) */
export const backRoomDetail = (id) => { return requestV4.get(`check_out/${id}/detail`) }
/* 财务 业务单(导出退房单明细 导出excel) */
export const backRoomDetailExport = (id) => { return requestV4.get(`check_out/${id}/detail/export`, { responseType: 'blob' }) }
/* 财务 业务单(获取退房单账单) */
export const backRoomOrder = (id, params) => { return requestV4.post(`check_out/order/${id}`, params).then(res => res.data) }
/* 财务 业务单(退房单详情 导出pdf) */
export const checkOutRoom_Refund = (id, params) => { return requestV4.patch(`check_out/refund/${id}`, params).then(res => res.data) }

/* 财务 业务单(换房单列表) */
export const ChangeroomList = params => { return requestV4.get(`changeroom`, { params: params }) }
/* 财务 业务单(换房单列表 导出excel) */
export const ChangeroomListToExcel = params => { return requestV4.get(`transform_rent`, { params: params }) }
/* 财务 业务单(换房单详情) */
export const ChangeroomDetail = (id) => { return requestV4.get(`changeroom/${id}`) }
export const TransferOut = (id) => { return requestV4.get(`changeroom_order/old_adjust/${id}`) }
export const oldRoomUnpaid = (id) => { return requestV4.get(`changeroom_order/old_input/${id}`) }
export const TransferIn = (id) => { return requestV4.get(`changeroom_order/new_adjust/${id}`) }
export const newRoomUnpaid = (id) => { return requestV4.get(`changeroom_order/new_input/${id}`) }
/* 财务 业务单(换房单详情 导出pdf) */

/* 财务 业务单(换房单详情 导出pdf) */

/* 财务 业务单(转租单列表) */
export const subletList = params => { return requestV4.get(`transform_rent`, { params: params }) }
/* 财务 业务单(转租单列表 导出excel) */
export const subletListToExcel = params => { return requestV4.get(`transform_rent`, { params: params }) }
/* 财务 业务单(转租单详情) */
export const subletDetail = (id) => { return requestV4.get(`transform_rent/${id}`) }
export const subletRefund = (id, params) => { return requestV4.patch(`transform_rent/refund/${id}`, params) }
/* 财务 业务单(转租单详情 导出pdf) */


/* 财务 新增流水列表 */
export const billList1 = (params) => { return requestV4.get(`bill_list`, { params }) }

/* 财务 新增流水汇总 导出excel */
export const billListExcel = params => { return requestV4.get(`bill_list/excel`, { params: params, responseType: 'blob' }) }

/* 财务 新增流水汇总 导出excel */
export const billListExcelBill = params => { return requestV4.get(`statistical/general/bill`, { params: params, responseType: 'blob' }) }

/* 财务 新增流水详情 */
export const showBill1 = (params) => { return requestV4.get(`bill_list/sequence_number`, { params }) }

/* 财务 新增流水明细 */
export const billList2 = params => { return requestV4.get(`bill_list/subsets`, { params: params }) }

/* 财务 新增流水明细 导出excel */
export const subSetsExcel = params => { return requestV4.get(`bill_list/subsets/excel`, { params: params, responseType: 'blob' }) }

/* 财务 新增流水 费用项汇总 */
export const billListCostMerge = (params) => { return requestV4.get(`bill_list/cost_merge`, { params }) }

/* 财务 新增流水 费用项汇总 导出 */
export const CostMergeExcel = params => { return requestV4.get(`bill_list/cost_merge/excel`, { params: params, responseType: 'blob' }) }

/* 财务 新增流水 费用项门店 */
export const billListCostStore = (params) => { return requestV4.get(`bill_list/cost_scatter_store`, { params }) }

/* 财务 新增流水 费用项门店 导出 */
export const CostStoreExcel = params => { return requestV4.get(`bill_list/cost_scatter_store/excel`, { params: params, responseType: 'blob' }) }

/* 财务 新增流水费用项房间 */
export const billListCostRoom = (params) => { return requestV4.get(`bill_list/cost_scatter_room`, { params }) }

/* 财务 新增流水 费用项房间 导出 */
export const CostRoomExcel = params => { return requestV4.get(`bill_list/cost_scatter_room/excel`, { params: params, responseType: 'blob' }) }

/* 财务 新增流水费用项租户 */
export const billListCostResident = (params) => { return requestV4.get(`bill_list/cost_scatter_resident`, { params }) }

/* 财务 新增流水 费用项租户 导出 */
export const CostResidentExcel = params => { return requestV4.get(`bill_list/cost_scatter_resident/excel`, { params: params, responseType: 'blob' }) }

/* 财务 新增流水 按月度门店 */
export const billListMonthStore = (params) => { return requestV4.get(`bill_list/month_store`, { params }) }

/* 财务 新增流水 按月度门店 导出 */
export const MonthStoreExcel = params => { return requestV4.get(`bill_list/month_store/excel`, { params: params, responseType: 'blob' }) }

/* 财务 新增流水按月度房间 */
export const billListMonthRoom = (params) => { return requestV4.get(`bill_list/month_room`, { params }) }

/* 财务 新增流水 按月度房间 导出 */
export const MonthRoomExcel = params => { return requestV4.get(`bill_list/month_room/excel`, { params: params, responseType: 'blob' }) }

/* 财务 新增流水渠道按月 */
export const billListMonth = (params) => { return requestV4.get(`bill_list/payway_month`, { params }) }

/* 财务 新增流水 渠道按月 导出 */
export const PaywayMonthExcel = params => { return requestV4.get(`bill_list/payway_month/excel`, { params: params, responseType: 'blob' }) }

/* 财务 新增流水渠道按天 */
export const billListDay = (params) => { return requestV4.get(`bill_list/payway_day`, { params }) }

/* 财务 新增流水 渠道按天 导出 */
export const PaywayDayExcel = params => { return requestV4.get(`bill_list/payway_day/excel`, { params: params, responseType: 'blob' }) }

/* 财务 流水导出 */
export const billExcel = (params) => { return requestV3.post(`${base}bill/bill/billexcel`, params, { responseType: 'blob' }) }

export const listOrder = params => { return requestV3.post(`${base}bill/order/listorder`, params) }
export const listOrder2 = params => { return requestV4.get(`order_list`, { params }) }
export const listOrderExpense = params => { return requestV4.get(`order`, { params }) }
export const getOrder2Detail = (params) => { return requestV4.get(`order_list/detail`, { params }) }
export const updateOrder2 = (params) => { return requestV4.patch(`order_list/detail`, params) }

/* 财务 修改账单 */
export const amendList = (params) => { return requestV4.post(`order`, params) }

/* 财务 确认审核 */
export const approve = params => { return requestV3.post(`${base}bill/order/approve`, params) }

/* 财务 生成账单 */
export const generate = params => { return requestV3.post(`${base}bill/bill/generate`, params) }

/* 财务 推送账单 */
export const pushbill = params => { return requestV3.post(`${base}bill/order/notify`, params) }

/* 财务 导出账单 */
// export const oedertoExcel = params => { return requestV3.post(`${base}bill/order/ordertoexcel`, params, { responseType: 'blob' }) }
export const oedertoExcel = params => { return requestV4.get(`order_list/export_order`, { params: params, responseType: 'blob' }) }

/* 财务 导出回款表 */
// export const recycleExcel = params => { return requestV3.post(`${base}bill/order/exportorder`, params, { responseType: 'blob' }) }
export const exportRecycleExcel = params => { return requestV4.get(`statistical/general/return_money`, { params: params, responseType: 'blob' }) }

/* 财务 获取账单信息 */
export const getresidentbyroom = params => { return requestV3.post(`${base}bill/order/getresidentbyroom`, params) }

/* 财务 提交账单信息 */
export const addOrder = params => { return requestV3.post(`${base}bill/order/addorder`, params) }

/* 财务 编辑账单信息 */
export const editOrder = params => { return requestV3.post(`${base}bill/order/editorder`, params) }

/* 财务 关闭账单 */
export const closeOrder = params => { return requestV3.post(`${base}bill/order/closeorder`, params) }

/* 财务 退房列表 */
export const checkoutList = params => { return requestV3.post(`${base}checkout/checkout/listRecord`, params) }

/* 财务 退房信息 */
export const checkoutInfo = params => { return requestV3.post(`${base}checkout/checkout/showcheckoutdetail`, params) }

/* 退房 详情 */
export const newCheckOutInfo = id => { return requestV4.get(`check_out/${id}/detail`).then(res => res.data) }

/* 财务 退房账单信息 */
export const checkoutOrderByone = (id, params) => { return requestV4.post(`check_out/order/${id}`, params).then(res => res.data) }

/* 财务 确定正常退房 */
export const sure = params => { return requestV3.post(`${base}checkout/checkout/refund`, params) }

/* 财务 放弃收益 */
export const breach = params => { return requestV3.post(`${base}checkout/checkout/giveup`, params) }

/* 水电列表 */
export const listutility = (params) => { return requestV3.post(`${base}utility/utility/record`, params) }

/* 生成水电列表 */
export const confirm = params => { return requestV3.post(`${base}utility/meter/utility`, params) }

/* 导入水电 */
export const leadImport = params => { return requestV3.post(`${base}utility/meter/normaldevicereading`, params) }

/* 导出水电模板 */
export const readingtemplate = params => { return requestV3.post(`${base}utility/meter/readingtemplate`, params, { responseType: 'blob' }) }

/* 获取上传水电表的数据 */
export const getRead = params => { return requestV3.post(`${base}utility/meter/normaldevicereading`, params) }

/* 上传水电读数 */
export const saveReading = params => { return requestV3.post(`${base}utility/meter/savereading`, params) }

/* 修改水电 */
export const updateNumber = params => { return requestV3.post(`${base}utility/utility/updatenumber`, params) }

/* 水电换表 */
export const changeMeter = params => { return requestV3.post(`${base}utility/utility/changemeter`, params) }

/* 小业主列表 */
export const getownerList = params => { return requestV3.post(`${base}owner/owner/listowners`, params) }

/* 添加小业主 */
export const addownerList = params => { return requestV3.post(`${base}owner/owner/addowner`, params) }

/* 编辑小业主 */
export const editownerList = params => { return requestV3.post(`${base}owner/owner/editowner`, params) }

/* 小业主账单列表 */
export const showearning = params => { return requestV3.post(`${base}owner/owner/showearning`, params) }

// 数据报表 出租率
export const getOccupancyRate = params => { return requestV3.post(`${base}mini/residentct/dataapartment`, params).then(res => res.data) }

// 数据报表 空置率 Vacancy Rate
export const getVacancyRate = params => { return requestV3.post(`${base}mini/residentct/datafree`, params).then(res => res.data) }

/* 报表================================================= */
/* 报表 运营报表 经营报表 门店 */
export const chartOperationStore = (params) => { return requestV4.get(`statement/operation/operation_store`, { params }) }

/* 报表 运营报表 经营报表 门店 导出excel */
export const operationStoreExcel = params => { return requestV4.get(`statement/operation/operation_store/excel`, { params: params }) }

/* 报表 运营报表 经营报表 房型 */
export const chartOperationRoomType = (params) => { return requestV4.get(`statement/operation/operation_roomtype`, { params }) }

/* 报表 运营报表 经营报表 房型 导出excel */
export const operationRoomTypeExcel = params => { return requestV4.get(`statement/operation/operation_roomtype/excel`, { params: params }) }

/* 报表 运营报表 经营报表 房间 */
export const chartOperationRoom = (params) => { return requestV4.get(`statement/operation/operation_room`, { params }) }

/* 报表 运营报表 经营报表 房间 导出excel */
export const operationRoomExcel = params => { return requestV4.get(`statement/operation/operation_room/excel`, { params: params }) }

/* 报表 运营报表 出房报表 门店 */
export const chartOperationRentoutStore = (params) => { return requestV4.get(`statement/operation/rentout_store`, { params }) }

/* 报表 运营报表 出房报表 门店 导出excel */
export const rentoutStoreExcel = params => { return requestV4.get(`statement/operation/rentout_store/excel`, { params: params }) }

/* 报表 运营报表 出房报表 员工 */
export const chartOperationRentoutEmployee = (params) => { return requestV4.get(`statement/operation/rentout_employee`, { params }) }

/* 报表 运营报表 出房报表 员工 导出excel */
export const rentoutEmployeeExcel = params => { return requestV4.get(`statement/operation/rentout_employee/excel`, { params: params }) }

/* 报表 运营报表 应收报表 门店 */
export const chartReceiptStore = (params) => { return requestV4.get(`statement/operation/receipt_store`, { params }) }

/* 报表 运营报表 出房报表 门店 导出excel */
export const receiptStoreExcel = params => { return requestV4.get(`statement/operation/receipt_store/excel`, { params: params }) }

/* 报表 运营报表 应收报表 房间 */
export const chartReceiptRoom = (params) => { return requestV4.get(`statement/operation/receipt_room`, { params }) }

/* 报表 运营报表 应收报表 房间 导出excel */
export const receiptRoomExcel = params => { return requestV4.get(`statement/operation/receipt_room/excel`, { params: params }) }

/* 报表 运营报表 应收报表 租户 */
export const chartReceiptResident = (params) => { return requestV4.get(`statement/operation/receipt_resident`, { params }) }

/* 报表 运营报表 应收报表 租户 导出excel */
export const receiptResidentExcel = params => { return requestV4.get(`statement/operation/receipt_resident/excel`, { params: params }) }
