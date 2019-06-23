const rootPath    = '../';
const currentPath = './';

const config  = require(currentPath + 'config.js');
const common  = require(currentPath + 'common.js');
const Promise = require(rootPath + 'utils/promise.js');

function httpRequest(url, loading = false, method, data, needAuth = true) {
    let header = {
        "Content-Type": "application/json",
        'X-Client-Agent': 'mini',
        'X-Client-Version': getApp().globalData.vNumber,
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
                //  res = res.data;
                console.log('data', res);
                wx.hideLoading();

                // API 错误返回文档 https://git.funxdata.com/funxcloud/funxcloud/src/master/docs/README.md
                if(res.statusCode >= 400){
                    switch (res.statusCode) {
                        case 400:
                            wx.showModal({
                                content    : res.data.message,
                                showCancel : false,
                                success: function (resp) {
                                    if (resp.confirm) {
                                    }
                                }
                            });
                            return;
                        case 401:
                            wx.navigateTo({
                                url : "/pages/index/homePage"
                            })
                            try {
                                wx.removeStorageSync(config.key.access_token_key)
                            } catch (e) {
                                console.log(e)
                            }
                            return;
                        case 403:
                        case 404:
                        case 500:
                        case 501:
                        case 503:
                            if (res.data) {
                                wx.showModal({
                                    content    : res.data.message,
                                    showCancel : false,
                                    success: function (resp) {
                                        if (resp.confirm) {

                                        }
                                    }
                                });
                            } else {
                                wx.showModal({
                                    content    : '网络连接异常',
                                    showCancel : false,
                                    success: function (resp) {
                                        if (resp.confirm) {
                                        }
                                    }
                                });
                            }
                            return;
                    }
                }

                resolve(res.data);
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

//PATCH  请求 需要携带token的请求
function httpPatch(url, data = {}) {
    return httpRequest(url, true, 'PATCH', data, true);
}


/************************微信小程序授权************************/
function authorize(data) {
    return httpPostPublic(config.api.auth.login, data);
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

/*支付*/
function pay(data){
    let url = config.indexV4.pay_url;
    return httpPost(url,data);
}

/*换房列表*/
function listChangeroom(data){
    let url = config.indexV4.change_room_url;
    return httpGet(url,data);
}

/*获取换房信息*/
function getChangeRoom(id){
    let url = config.indexV4.change_room_url + `/${id}`;
    return httpGet(url);
}

/*新换房间 计算账单信息*/
function changeRoomCheckBill(data) {
    let url = config.indexV4.new_room_record_url;
    return httpPost(url,data);
}

/*确认办理换房*/
function confirmChange(data){
    let url = config.indexV4.confirm_change_url;
    return httpPost(url,data);
}

/*获取换房信息转出*/
function TransferOut(id){
    let url = config.indexV4.Changeroom_TransferOut + `/${id}`;
    return httpGet(url);
}
/*获取换房信息转入*/
function TransferIn(id){
    let url = config.indexV4.Changeroom_TransferIn + `/${id}`;
    return httpGet(url);
}
/*获取换房信息转入*/
function oldRoomUnpaid(id){
    let url = config.indexV4.Changeroom_oldRoomUnpaid + `/${id}`;
    return httpGet(url);
}
/*获取换房信息转入*/
function newRoomUnpaid(id){
    let url = config.indexV4.Changeroom_newRoomUnpaid + `/${id}`;
    return httpGet(url);
}
/*转租 房间信息*/
function subletsureInfo(data) {
    let url = config.commonV4.sublet_calcfee;
    return httpPost(url,data);
}

/*转租 确认办理*/
function subletConfirm(data) {
    let url = config.commonV4.sublet_confirm;
    return httpPost(url,data);
}

/*转租列表*/
function listSubletroom(data){
    let url = config.commonV4.sublet_room_url;
    return httpGet(url,data);
}

/*转租详情*/
function SubletInfo(id){
    let url = config.commonV4.sublet_room_url + `/${id}`;
    return httpGet(url);
}

/*转租 计算账单信息*/
function subletCalcfee(data) {
    let url = config.commonV4.sublet_calcfee;
    return httpPost(url,data);
}

/*换房 换房提交审批*/
function subletApproval(id) {
    let url = config.commonV4.sublet_approval_url + `/${id}`;
    return httpPost(url);
}

/* 退租列表信息 */
function checkoutList(data){
    if(data.room_number){
       let url = config.commonV4.checkOut_list+'?room_number='+data.room_number+'&store_id='+data.store_id+'&offset='+(data.page)*10+'&limit=10&group_status=DOING';
       return httpGet(url);
    }else{
       let url = config.commonV4.checkOut_list+'?store_id='+data.store_id+'&offset='+(data.page)*10+'&limit=10&group_status=DOING';
       return httpGet(url);
    }
}
/* 获取退租详情 */
function checkoutDetail(id){
    let url = config.commonV4.checkOut_list_detail+ `/${id}` + '/detail';
    return httpGet(url);
}
/* 获取退租账单 */
function checkoutOrder(id,data){
    data.is_money_back = 1;
    let url = config.commonV4.checkOut_order+ `/${id}`;
    return httpPost(url,data);
}
/* 计算退租账单 */
function checkoutCalcfee(data){
    data.is_money_back = 1;
    let url = config.commonV4.checkOut_calcfee;
    return httpPost(url,data);
}
/* 提交确认验房 */
function checkoutSubmit(data){
    data.is_money_back = 1;
    let url = config.commonV4.checkOut_list;
    return httpPost(url,data);
}
/* 提交退房审批 */
function checkoutApproval(id,data){
    data.is_money_back = 1;
    let url = config.commonV4.checkOut_approval_url+ `/${id}`;
    return httpPost(url,data);
}

/*获取未交费用列表*/
function getUnpaidlist(id){
    let url = config.commonV4.resident_Unpaidlist_url+'?resident_id='+id+'&status=PENDING&offset=0&limit=50';
    return httpGet(url);
}

/*获取住户信息列表*/
function getResidentInfo(id){
    let url = config.commonV4.resident_info+'/'+id;
    return httpGet(url);
}

/*根据房间信息获取住户信息列表*/
function getResidentInfobyRoom(data){
    let url = config.commonV4.room_resident_info_url;
    return httpGet(url,data);
}

/* 任务流查看详情 */
function getTaskView(id){
    let url = config.commonV4.Taskflow_view_url+ `/${id}`;
    return httpGet(url);
}
/*调价信息*/
function priceDetailByTaskflow(id) {
    let url = config.commonV4.priceDetailByTaskflow_url + `/${id}`;
    return httpGet(url);
}
/* 任务流提交审批 */
function UpdateTask(id,data){
    let url = config.commonV4.Taskflow_view_url+ `/${id}`;
    return httpPost(url,data);
}

/*待我审批工作流列表*/
function getListtaskflow(data){
    let url = config.indexV4.wait_taskflow_url;
    return httpGet(url,data);
}

/*全部工作流*/
function getAllTaskflowList(data){
    let url = config.indexV4.all_taskflow_url;
    return httpGet(url,data);
}

/*发起工作流*/
function getLaunchTaskList(data){
    let url = config.indexV4.launch_task_url;
    return httpGet(url,data);
}

/*完成工作流*/
function getCompleteTask(data){
    let url = config.indexV4.complete_task_url;
    return httpGet(url,data);
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

/*截取日期*/
function interceptData(data){
    return data.substring(0, 10);
}

exports = module.exports = {
/*账单相关接口*/
getUnpaidlist,
/*获取住户信息*/
getResidentInfo,
getResidentInfobyRoom,
/****************** 公共 ******************/
/****************** 转租 ******************/
subletCalcfee,
subletConfirm,
listSubletroom,
SubletInfo,
subletApproval,
/****************** 首页 ******************/
getListtaskflow,
getAllTaskflowList,
getLaunchTaskList,
getCompleteTask,
interceptData,
authorize,
pay,
listChangeroom,
getChangeRoom,
changeRoomCheckBill,
confirmChange,
TransferOut,
TransferIn,
oldRoomUnpaid,
newRoomUnpaid,
/* 退房 */
checkoutList,
checkoutDetail,
checkoutOrder,
checkoutCalcfee,
checkoutSubmit,
checkoutApproval,
getTaskView,
priceDetailByTaskflow,
UpdateTask,
/****************** 住户中心 ******************/
/****************** 个人中心 ******************/
}
