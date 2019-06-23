const rootPath    = '../';
const currentPath = './';

const config  = require(currentPath + 'config.js');
const common  = require(currentPath + 'common.js');
const Promise = require(rootPath + 'utils/promise.js');

function httpRequest(url, loading = false, method, data, needAuth = true) {
    let header = {
        // "Content-Type": "application/json",
        'content-type': 'application/x-www-form-urlencoded',
    };
    if (needAuth) {
        let token = common.getAccessTokenSync();
        header.Token = token.token;
    } 

    if(loading){
        wx.showLoading({title : '加载中'});
    }

    return new Promise((resolve, reject) => {
        wx.request({
            url      : url,
            loading  : loading,
            method   : method,
            data     : data,
            header   : header,
            success: res => {
                res = res.data;
                wx.hideLoading();

                if(res.rescode != 0){
                    if(res.rescode === 1001 || res.rescode === '1001'){
                        wx.navigateTo({
                            url : "/pages/index/homePage"
                        })

                        try {
                            wx.removeStorageSync(config.key.access_token_key)
                        } catch (e) {
                            console.log(e)
                        }
                    }else{
                        if(res.rescode === 1002 || res.rescode === '1002'){
                            wx.showModal({
                                content    : res.data.error,
                                showCancel : false,
                                success: function (resp) {
                                    if (resp.confirm) {
                                    }
                                }
                            });
                            return;
                        }else{
                            wx.showModal({
                                content    : res.resmsg,
                                showCancel : false,
                                success: function (resp) {
                                    if (resp.confirm) {

                                    }
                                }
                            });
                            return;
                        }
                    }
                }

                resolve(res.data);

                // console.log('data', res);
                // wx.hideLoading();

                // // API 错误返回文档 https://git.funxdata.com/funxcloud/funxcloud/src/master/docs/README.md
                // if(res.statusCode >= 400){
                //     switch (res.statusCode) {
                //         case 400:
                //             wx.showModal({
                //                 content    : res.data.message,
                //                 showCancel : false,
                //                 success: function (resp) {
                //                     if (resp.confirm) {
                //                     }
                //                 }
                //             });
                //             return;
                //         case 401:
                //             wx.navigateTo({
                //                 url : "/pages/index/homePage"
                //             })
                //             try {
                //                 wx.removeStorageSync(config.key.access_token_key)
                //             } catch (e) {
                //                 console.log(e)
                //             }
                //             return;
                //         case 403:
                //         case 404:
                //         case 500:
                //         case 501:
                //         case 503:
                //             if (res.data) {
                //                 wx.showModal({
                //                     content    : res.data.message,
                //                     showCancel : false,
                //                     success: function (resp) {
                //                         if (resp.confirm) {

                //                         }
                //                     }
                //                 });
                //             } else {
                //                 wx.showModal({
                //                     content    : '网络连接异常',
                //                     showCancel : false,
                //                     success: function (resp) {
                //                         if (resp.confirm) {
                //                         }
                //                     }
                //                 });
                //             }
                //             return;
                //     }
                // }

                // resolve(res.data);
            },
            fail : e => reject(e),
        });
    });
}


//GET 请求 需要携带token 的请求
function httpGet(url, data = {}) {
    return httpRequest(url, true, 'GET', data, true);
}
//GET 请求 不需要携带token 的请求
function httpGetPublic(url, data = {}) {
    return httpRequest(url, true, 'GET', data, false);
}

//POST  请求 需要需要携带token 的请求
function httpPost(url, data = {}) {
    return httpRequest(url, true, 'POST', data, true);
}
//POST 请求 不需要携带token的请求
function httpPostPublic(url, data = {}) {
    return httpRequest(url, true, 'POST', data, false);
}
//DELETE 请求 需要携带token的请求
function httpDelete(url, data = {}) {
    return httpRequest(url, true, 'DELETE', data, true);
}

/************************授权************************/
function wechatLogin() {
    return new Promise((resolve, reject) => {
        wx.login({
            success: res => resolve(res),
            fail: e => reject(e),
        });
    });
}


/************************获取用户个人信息************************/
function saveWechatUserInfo(info) {
    let url = config.api.auth.info;
    let data = {
        'encryptData': info.encryptData,
        'encryptedData': info.encryptedData,
        'rawData': info.rawData,
        'signature': info.signature,
        'userInfo': info.userInfo,
        'iv': info.iv,
    };

    return httpPost(url, data);
}

/************************更新用户个人信息************************/
function getUserInfo() {
    return new Promise((resolve, reject) => {
        wx.getUserInfo({
            success: res => resolve(res),
            fail: e => reject(e),
        });
    });
}

/*提示框 有地址跳转*/
const showWarningUrl = function(text,url){
    wx.showModal({
        content    : text,
        showCancel : false,
        success    : function () {
            wx.navigateTo({
                url: url
            })
        }
    });
}

/*提示框 没地址跳转*/
const showWarning = function(text,title = "警告"){
    wx.showModal({
        title       : title,
        content     : text,
        showCancel  : false,
    });
}

/*自动关闭弹出框*/
const showToast = function(text){
    wx.showToast({
        title    : text,
        icon     : 'success',
        duration : 2000
    })
}

/*获取公寓ID*/
function getStroeId(data){
    let url = config.index.stroe_id_url;
    return httpPost(url,data);
}

/*获取首页房间列表数量*/
function getRoomCount(data){
    let url = config.index.room_number_url;
    return httpPost(url,data);
}

/*获取首页订单数量*/
function getOrderCount(data){
    let url = config.index.order_number_url;
    return httpPost(url,data);
}



/*确认签约*/
function signAContrac(data){
    let url = config.index.sign_a_contrac_url;
    return httpPost(url,data);
}

/*优惠券列表*/
function getCouponList(data){
    let url = config.index.coupon_list_url;
    return httpPost(url,data);
}

/*关闭优惠券*/
function closeCoupon(data){
    let url = config.index.close_coupon_url;
    return httpPost(url,data);
}

/*取消续租*/
function destroyRenew(data){
    let url = config.index.destroy_renew_url;
    return httpPost(url,data);
}





/*请求审批记录详情*/
function getApproveDetail(data){
    let url = config.index.approve_detail_url;
    return httpPost(url,data);
}

/*退房列表*/
function getCheckoutList(data){
    let url = config.index.checkout_list_url;
    return httpPost(url,data);
}

/*获取退房和住户信息*/
function checkoutUserInfo(data){
    let url = config.index.checkout_user_url;
    return httpPost(url,data);
}

/*计算退房金额*/
function checkOutMOney(data){
    let url = config.index.checkout_money_url;
    return httpPost(url,data);
}

/*退房信息*/
function checkoutInfo(data){
    let url = config.index.checkout_info_url;
    return httpPost(url,data);
}

/*确认退房*/
function checkOut(data){
    let url = config.index.check_out_url;
    return httpPost(url,data);
}

/*租户端发起退房确认或驳回*/
function userCheckout(data){
    let url = config.index.user_checkot_url;
    return httpPost(url,data);
}

/*退房签字*/
function checkSignature(data){
    let url = config.index.check_signature_url;
    return httpPost(url,data);
}

/*驳回之后从新审核*/
function dismissal(data){
    let url = config.index.dismissal_url;
    return httpPost(url,data);
}
/*续租列表*/
function getRenewList(data){
    let url = config.index.list_renew_url;
    return httpPost(url,data);
}

/*续租搜索*/
function searchRenew(data){
    let url = config.index.search_renew_url;
    return httpPost(url,data);
}

/*续租原房间号搜索*/
function searchOldRenew(data){
    let url = config.index.search_old_url;
    return httpPost(url,data);
}

/*确认续租*/
function confirmRenew(data){
    let url = config.index.confirm_renew_url;
    return httpPost(url,data);
}

/*获取通知类型*/
function noticeType(data){
    let url = config.index.notice_type_url;
    return httpPost(url,data);
}

/*发送通知*/
function sendNotice(data){
    let url = config.index.send_notice_url;
    return httpPost(url,data);
}

/*服务订单的完成及取消*/
function serverStatus(data){
    let url = config.index.server_status_url;
    return httpPost(url,data);
}

/*获取通知信息*/
function noticeInfo(data){
    let url = config.index.notice_info_url;
    return httpPost(url,data);
}

/*门店需要上传读数*/
function getStroeReading(data){
    let url = config.common.need_upload_url;
    return httpPost(url,data);
}

/*获取银行列表*/
function getBankList(data){
    let url = config.common.bank_list_url;
    return httpPost(url,data);
}

/*获取省列表*/
function getProvinceList(data){
    let url = config.common.province_list_url;
    return httpPost(url,data);
}

/*获取城市*/
function getCityList(data){
    let url = config.common.city_list_url;
    return httpPost(url,data);
}

/*获取门店下面的表类型*/
function storeTableType(data){
    let url = config.common.table_type_url;
    return httpPost(url,data);
}

/*获取住户信息  换房*/
function getUserInfo(data){
    let url = config.common.get_urser_info_url;
    return httpPost(url,data);
}

/*合同签约列表*/
function getContractList(data){
    let url = config.common.contract_award_url;
    return httpPost(url,data);
}

/*获取当前门店下的小区*/
function getStroeVillage(data){
   let url = config.index.this_village_url;
    return httpPost(url,data); 
}

/*获取小区下的空房间*/
function getBlankRoom(data){
    let url = config.index.village_empty_url;
    return httpPost(url,data);
}

/*办理入住*/
function checkin(data){
    let url = config.index.checkin_url;
    return httpPost(url,data);
}

/*取消办理入住*/
function destroyCheckin(data){
    let url = config.index.destroy_checkin_url;
    return httpPost(url,data);
}

/*预订转入住*/
function bookToCheckin(data){
    let url = config.index.book_to_checkin_url;
    return httpPost(url,data);
}

/*来访登记列表*/
function getListServe(data){
    let url = config.index.list_reserve_url;
    return httpPost(url,data); 
}

/*来访登记*/
function visit(data){
    let url = config.index.visit_record_url;
    return httpPost(url,data);
}

/*预约看房取消或确认*/
function reserveStatus(data){
    let url = config.index.reserve_status_url;
    return httpPost(url,data);
}

/*预订列表*/
function getBookList(data){
    let url = config.index.book_list_url;
    return httpPost(url,data);
}

/*办理预订*/
function reservation(data){
    let url = config.index.reservation_url;
    return httpPost(url,data);
}

/*换房房间号*/
function changeRoomNumber(data){
    let url = config.index.change_room_number;
    return httpPost(url,data);
}

/*取消换房*/
function destroyChange(data){
    let url = config.index.destroy_change_url;
    return httpPost(url,data); 
}

/*确定服务订单*/
function serverCreate(data){
    let url = config.index.server_create_url;
    return httpPost(url,data);
}

/*住户中心列表*/
function householdList(data){
    let url = config.household.household_list_url;
    return httpPost(url,data);
}

/*搜索住户*/
function searchResident(data){
    let url = config.household.search_resident_url;
    return httpPost(url,data);
}

/*住户详情*/
function household(data){
    let url = config.household.household_url;
    return httpPost(url,data);   
}

/*添加同住人*/
function addCoresident(data){
    let url = config.household.add_coresident_url;
    return httpPost(url,data); 
}

/*同住人列表*/
function listCoresident(data){
    let url = config.household.list_coresident_url;
    return httpPost(url,data); 
}

/*删除同住人*/
function deleteDcoresident(data){
    let url = config.household.delete_dcoresident;
    return httpPost(url,data);
}

/*获取预存金*/
function getPredeposit(data){
    let url = config.household.get_predeposit_url;
    return httpPost(url,data);
}

/*预存金转为其他押金*/
function depositOthermoney(data){
    let url = config.household.deposit_othermoney;
    return httpPost(url,data);
}

/*获取门店数据*/
function getChangeStroe(data){
    let url = config.user.change_store_id_url;
    return httpPost(url,data)
}

/*获取楼栋*/
function getBuilding(data){
    let url = config.user.room_building_url;
    return httpPost(url,data);
}

/*获取房间信息*/
function getRoomInfo(data){
    let url = config.user.room_info_url;
    return httpPost(url,data);
}

/*获取分布式房间*/
function getDotroomList(data){
    let url = config.user.dotrooms_list_url;
    return httpPost(url,data);
}

/*获取入住率并绘制饼图*/
function getDataCheckin(data){
    let url = config.user.data_checkin_url;
    return httpPost(url,data);
}

/*获取来访登记并绘制饼图*/
function getDataVisit(data){
    let url = config.user.data_visit_url;
    return httpPost(url,data);
}

/*数据清单*/
function getDataApartment(data){
    let url = config.user.data_apartment_url;
    return httpPost(url,data);
}

/*空闲数据*/
function getDataFree(data){
    let url = config.user.data_free_url;
    return httpPost(url,data);   
}

/*员工列表*/
function getListemp(data){
    let url = config.user.listemp_url;
    return httpPost(url,data);
}

/*小业主列表*/
function getOwnweList(data){
    let url = config.user.owner_list_url;
    return httpPost(url,data);
}

/*搜索小业主*/
function searchOwner(data){
    let url = config.user.search_owner_url;
    return httpPost(url,data);
}

/*小业主详情*/
function ownerDetail(data){
    let url = config.user.owner_detail_url;
    return httpPost(url,data);
}

/*保存小业主图片*/
function saveidPhoto(data){
    let url = config.user.saveid_photo_url;
    return httpPost(url,data);
}

/*小业主账单*/
function ownerOrder(data){
    let url = config.user.owner_order_url;
    return httpPost(url,data);
}

/*公共接口*/
/*获取门店下的活动*/
function getStroeActivity(data){
    let url = config.common.show_activity_url;
    return httpPost(url,data);
}

/*检查房间状态*/
function getRoomStauts(data){
    let url = config.common.check_roomunion_url;
    return httpPost(url,data);
}

/*获取住户信息*/
function getResident(data){
    let url = config.common.get_resident_url;
    return httpPost(url,data);
}

/*获取个人信息*/
function getUserInfos(data){
    let url = config.common.show_center_url; 
    return httpPost(url,data);
}

/*生成二维码*/
function getQRCode(data){
    let url = config.common.qr_code_url;
    return httpPost(url,data);
}

/*获取房型*/
function getRoomType(data){
    let url = config.common.room_type_url;
    return httpPost(url,data);
}

/*获取预约信息*/
function getServerInfo(data){
    let url = config.common.reserve_info_url;
    return httpPost(url,data);
}

/*订单列表*/
function contractAward(data){
    let url = config.common.order_list_url;
    return httpPost(url,data);
}

/*搜索订单列表*/
function searchOrder(data){
    let url = config.common.search_order_url;
    return httpPost(url,data);
}

/*驳回/通过申请*/
function auditApply(data){
    let url = config.common.audit_apply_url;
    return httpPost(url,data);
}

/*推送账单通知*/
function sendBillnotice(data){
    let url = config.common.send_bill_notice;
    return httpPost(url,data);
}

/*身份证类型转换*/
function cardType(text){
    let type = '';
    switch(text){
        case '0':
            type = '身份证';
            break;
        case '1':
            type = '护照';
            break;
        case '2':
            type = '军人身份证';
            break;
        case '6':
            type = '社会保障卡';
            break;
        case 'A':
            type = '武装警察身份证';
            break;
        case 'B':
            type = '港澳通行证';
            break;
        case 'C':
            type = '台湾居民来往大陆通行证';
            break;
        case 'E':
            type = '户口簿';
            break;
        case 'F':
            type = '临时身份证';
            break;
        case 'P':
            type = '外国人永久居留证';
            break;
        }
    return type;
}

/*身份证选项*/
const cardSelect = [
    { 'id': "0", 'name': '身份证' },
    { 'id': "1", 'name': '护照' },
    { 'id': "2", 'name': '军人身份证' },
    { 'id': "6", 'name': '社会保障卡' },
    { 'id': "A", 'name': '武装警察身份证' },
    { 'id': "B", 'name': '港澳通行证' },
    { 'id': "C", 'name': '台湾居民来往大陆通行证' },
    { 'id': "E", 'name': '户口簿' },
    { 'id': "F", 'name': '临时身份证' },
    { 'id': "P", 'name': '外国人永久居留证' }
]

/*上传图片*/
function uploadFile(wxfile){
    return uploadfile(config.api.image.store, wxfile);
}

/*上传证件图片*/
function uploadCardPhoto(wxfile){
    return uploadfile(config.api.image.store+'?watermark=idcard', wxfile);
}

/*上传证件图片*/
function uploadfile(url, wxfile){
    wx.showLoading({ title : '上传中' });
    let token   = common.getAccessTokenSync();
    let header  = {
        "content-type" : "multipart/form-data",
        "Token"        : token.token
    };
  
    return new Promise((resolve, reject) => {
        wx.uploadFile({
            url      : url,
            filePath : wxfile,
            header   : header,
            name     : config.key.upload_key,
            success  : res => {
                wx.hideLoading();
                resolve(res.data);
            },
            fail     : e => reject(e),
        });
    });
}

/*删除照片*/
function deteleImage(pictureList,pictureIndex,callback){
    let that   = this,
        images = pictureList,
        index  = pictureIndex;

    wx.showModal({
        title: '提示',
        content: '确定要删除此图片吗？',
        success: function (res) {
            if (res.confirm) {
                images.splice(index, 1);
            } else if (res.cancel) {
                return false;    
            }
            callback(images)
        }
    })
}

/*账单类型选择*/
/*账单类型选择*/
const orderTypeSelect = [{
    id:"ROOM",countryName:"住宿服务费"},{
    id:"CLEAN",countryName:"清洁服务费"},{
    id:"DEIVCE",countryName:"设备租赁费"},{
    id:"UTILITY",countryName:"水电服务费"},{
    id:"REFUND",countryName:"退租"},{
    id:"RESERVE",countryName:"定金"},{
    id:"MANAGEMENT",countryName:"物业服务费"},{
    id:"DEPOSIT_O",countryName:"其他押金"},{
    id:"DEPOSIT_R",countryName:"住宿押金"},{
    id:"WATER",countryName:"冷水服务费"},{
    id:"HOT_WATER",countryName:"热水服务费"},{
    id:"ELECTRICITY",countryName:"用电服务费"},{
    id:"GAS",countryName:"燃气服务费"},{
    id:"COMPENSATION",countryName:"物品赔偿费"},{
    id:"PETCLEAN",countryName:"宠物消杀费"},{
    id:"OTHER",countryName:"其他"}];
const exorderTypeSelect = [{id:"ADD_REFUND",countryName:"额外退费"}];
/*账单类型*/
function orderType(text) {
    var type = '';
    switch(text) {
        case 'ROOM':
            type = '住宿服务费';
            break;
        case 'CLEAN':
            type = '清洁服务费';
            break;
        case 'DEIVCE':
            type = '设备租赁费';
            break;
        case 'UTILITY':
            type = '水电服务费';
            break;
        case 'REFUND':
            type = '退租';
            break;
        case 'RESERVE':
            type = '定金';
            break;
        case 'MANAGEMENT':
            type = '物业服务费';
            break;
        case 'DEPOSIT_R':
            type = '住宿押金';
            break;
        case 'DEPOSIT_O':
            type = '其他押金';
            break;
        case 'ELECTRICITY':
            type = '用电服务费';
            break;
        case 'WATER':
            type = '冷水服务费';
            break;
        case 'HOT_WATER':
            type = '热水服务费';
            break;
        case 'REPAIR':
            type = '物品维修费';
            break;
        case 'COMPENSATION':
            type = '物品赔偿费';
            break;
        case 'OVERDUE':
            type = '滞纳金';
            break;
        case 'GAS':
            type = '燃气服务费';
            break;
        case 'BREAK':
            type = '违约金';
            break;
        case 'PETCLEAN':
            type = '宠物消杀费';
            break;
        case 'OTHER':
            type = '其他收费';
            break;
    }
    return type;
}

/*房间状态*/
function roomStatus(text) {
    var type = '';
    switch(text) {
        case 'NOT_PAY':
            type = '办理入住未支付';
            break;
        case 'PRE_RESERVE':
            type = '办理预订未支付';
            break;
        case 'PRE_CHECKIN':
            type = '预订转入住未支付';
            break;
        case 'PRE_CHANGE':
            type = '换房未支付';
            break;
        case 'PRE_RENEW':
            type = '续约未支付';
            break;
        case 'RESERVE':
            type = '预订';
            break;
        case 'NORMAL':
            type = '正常';
            break;
        case 'UNDER_CONTRACT':
            type = '违约退房';
            break;
        case 'INVALID':
            type = '无效';
            break;
    }
    return type;
}

/*退租类型*/
function checkoutType(text) {
    let type = '';
    switch(text) {
        case 'CHECKOUT':
            type = '正常退房审批';
            break;
        case 'NO_LIABILITY':
            type = '特殊退房审批';
            break;
        case 'UNDER_CONTRACT':
        case 'UNDER_CONTRACT_LESS':
            type = '违约退房审批';
            break;
        case 'ADD_REFUND':
            type = '退房-额外退款审批';
            break;
        case 'GIVE_UP':
            type = '放弃追缴退房';
            break;
        case 'REAL_INCOME_LESS':
            type = '退房-实际收益金额小于零';
            break;
        case 'NORMAL_REFUND':
            type = '正常退房退款';
            break;
        case 'NORMAL_NOT_REFUND':
            type = '正常退房不退款';
            break;
        case 'UNDER_REFUND':
            type = '违约退房退款';
            break;
        case 'UNDER_NOT_REFUND':
            type = '违约退房不退款';
            break;
        case 'UNDER_NO_REFUND':
            type = '违约退房无可退金额';
            break;
        case 'TRANSFORM':
            type = '转租'
            break;
        default:
            return '未知类型'
    }
    return type;
}

/*审批结果*/
function examination(text) {
    let type = '';
    switch(text) {
        case 'APPROVED':
            type = '通过';
            break;
        case 'UNAPPROVED':
            type = '驳回';
            break;
    }
    return type;
}

/*审批流类型*/
function taskflowType(text){
    let type = '';
    switch(text) {
        case 'CHECKOUT':
            type = '退租';
            break;
        case 'PRICE':
            type = '调价';
            break;
    }
    return type;
}

/*换房类型*/
function ChangeroomType(text){
    let type = '';
    switch(text) {
        case 'GENERATE':
            type = '待提交';
            break;
        case 'AUDIT':
            type = '审核中';
            break;
        case 'UNAPPROVED':
            type = '未通过';
            break;
        case 'COMPLETE':
            type = '已完成';
            break;
    }
    return type;
}

/*时间展示转换*/
function goTime(value){
    let v = value.substr(0, 19)
    return v.replace('T', ' ')
}


exports = module.exports = {
/****************** 公共 ******************/    
    wechatLogin,
    getUserInfo,
    getContractList,
    saveWechatUserInfo,
    showWarningUrl,
    showWarning,
    showToast,
    searchOrder,
    auditApply,
    contractAward,
    getServerInfo,
    cardType,
    cardSelect,
    uploadFile,
    uploadCardPhoto,
    deteleImage,
    orderTypeSelect,
    exorderTypeSelect,
    orderType,
    roomStatus,
    checkoutType,
    examination,
    taskflowType,
    getStroeActivity,
    getResident,
    getRoomStauts,
    getUserInfos,
    getQRCode,
    getRoomType,
    sendBillnotice,
    goTime,
/****************** 首页 ******************/
    getStroeId,
    getRoomCount,
    getOrderCount,
    signAContrac,
    getCouponList,
    closeCoupon,
    destroyRenew,
    
    getApproveDetail,
    getCheckoutList,
    checkoutUserInfo,
    checkOutMOney,
    checkoutInfo,
    checkOut,
    userCheckout,
    checkSignature,
    dismissal,
    getRenewList,
    searchRenew,
    searchOldRenew,
    confirmRenew,
    noticeType,
    noticeInfo,
    sendNotice,
    serverStatus,
    getStroeReading,
    getBankList,
    getProvinceList,
    getCityList,
    storeTableType,
    getUserInfo,
    getStroeVillage,
    getBlankRoom,
    checkin,
    destroyCheckin,
    bookToCheckin,
    getListServe,
    visit,
    reserveStatus,
    getBookList,
    reservation,
    changeRoomNumber,
    destroyChange,
    serverCreate,
/****************** 住户中心 ******************/
    householdList,
    searchResident,
    household,
    addCoresident,
    listCoresident,
    deleteDcoresident,
    getPredeposit,
    depositOthermoney,
/****************** 个人中心 ******************/
    getChangeStroe,
    getBuilding,
    getRoomInfo,
    getDotroomList,
    getDataCheckin,
    getDataVisit,
    getDataApartment,
    getDataFree,
    getListemp,
    getOwnweList,
    searchOwner,
    ownerDetail,
    saveidPhoto,
    ownerOrder,
}
