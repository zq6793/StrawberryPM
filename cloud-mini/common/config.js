/************** url 公寓云测试系统接口 **************/
 const api_host = "https://tapi.boss.funxdata.com/";
// appid: wx5721f56e75cc901e

/************** url 草莓预生产测试系统接口 **************/
// const api_host = "https://api.boss-pre.strongberry.cn/";
// const come_me_url = "http://api.web-pre.strongberry.cn/";
// appid: wxeca3c25ecb7fdfbf

/************** url 草莓正式系统接口 **************/
//const api_host    = "https://api.boss.strongberry.cn/";
// const come_me_url = "http://tapi.web.funxdata.com";
// appid: wxeca3c25ecb7fdfbf
/*
    hupan@gemdalepi.com
*/

/************** 公寓云  系统接口  **************/
// const api_host    = "https://api.cloud.funxdata.com/";
// appid: wxc339484c8c910598
/*
    hyf@funxdata.com
*/
const api_hostV4 = api_host + 'v4/';

exports = module.exports = {
   	key :{
        access_token_key             : 'uwp_access_token',
        upload_key                   : 'image',
        env                          : 'env',
   	},
   	api :{
        auth: {
            login                    : api_hostV4 + 'login/wechat_mini',// 微信授权
        },
        image : {
            store                    : api_host + 'common/imageupload', //上传图片
        },
    },

    common : {
        show_activity_url            : api_host + "mini/activity/showactivity",           //获取门店下的活动
        check_roomunion_url          : api_host + "mini/resident/checkroomunion",         //检查房间状态
        get_resident_url             : api_host + "mini/resident/getresident",            //获取住户信息
        show_center_url              : api_host + "mini/employee/showcenter",             //获取个人信息
        qr_code_url                  : api_host + "mini/resident/showqrcode",             //生成二维码
        room_type_url                : api_host + "mini/reserve/room_type",               //获取房型
        reserve_info_url             : api_host + "taskflow/taskflow/show",               //获取预约信息
        order_list_url               : api_host + "mini/order/showbyroom",                //订单列表
        search_order_url             : api_host + "mini/order/listorder",                 //搜索订单列表,
        audit_apply_url              : api_host + "taskflow/taskflow/audit",              //驳回/通过申请
        need_upload_url              : api_host + "utility/meter/meterofroom",            //门店需要上传读数
        bank_list_url                : api_host + "common/bank",                          //获取银行
        province_list_url            : api_host + "common/province",                      //获取省份列表
        city_list_url                : api_host + "common/city",                          //获取城市列表
        table_type_url               : api_host + "utility/meter/meterofstore",           //获取门店下的表类型
        get_urser_info_url           : api_host + "mini/newroom/getresidentbyroom",       //获取住户信息
        contract_award_url           : api_host + "mini/contract/listunsign",             //合同签约列表
        send_bill_notice             : api_host + "bill/order/notifyresident",            //推送账单通知
    },
    commonV4: {
        room_user_info_url           : api_hostV4 + "room/resident/info:id",              // 根据房间号获取用户信息
        room_resident_info_url       : api_hostV4 + "room_resident",                      // 根据房间号获取住户信息
        resident_Unpaidlist_url      : api_hostV4 + "order",                              // 获取所有未交费用列表
        resident_info                : api_hostV4 + "resident",                           // 获取住户信息
        sublet_calcfee               : api_hostV4 + "transform_rent/calcfee",             // 转租账单计算
        sublet_confirm               : api_hostV4 + "transform_rent",                     // 转租账单计算
        sublet_room_url              : api_hostV4 + "transform_rent",                     // 获取转租列表信息
        sublet_room_info             : api_hostV4 + "transform_rent",                     // 获取转详情信息
        sublet_approval_url          : api_hostV4 + "transform_rent/approval",            // 提交审批
        checkOut_list                : api_hostV4 + "check_out/_/list",                   // 退租列表 
        checkOut_list_detail         : api_hostV4 + "check_out",                          // 退租详情 
        checkOut_order               : api_hostV4 + "check_out/order",                    // 退租账单
        checkOut_calcfee             : api_hostV4 + "check_out/calcfee",                  // 提交退租信息
        checkOut_approval_url        : api_hostV4 + "check_out/approval",                 // 提交退租审批
        Taskflow_view_url            : api_hostV4 + "taskflow",                           // 提交退租审批
        priceDetailByTaskflow_url    : api_hostV4 + "price/taskflow",
    },

    index : {
        stroe_id_url                 : api_host + "mini/login/authority",                 //获取公寓ID
        room_number_url              : api_host + "mini/room/countroom",                  //获取首页房间列表数量
        order_number_url             : api_host + "mini/home/lists",                      //获取首页订单数量 
        sign_a_contrac_url           : api_host + "mini/order/confirm",                   //合同签约
        coupon_list_url              : api_host + "mini/order/getavailablecoupons",       //优惠券列表
        close_coupon_url             : api_host + "mini/order/amountwithdiscount",        //关闭优惠券,
        destroy_renew_url            : api_host + "mini/renew/destroy",                   //取消续租,     
        approve_detail_url           : api_host + "mini/server/show",                     //请求审批记录详情
        checkout_list_url            : api_host + "mini/checkoutnew/listrecord",          //退房列表
        checkout_user_url            : api_host + "mini/checkoutnew/getresidentinfo",     //获取退房和住户信息
        checkout_money_url           : api_host + "mini/checkoutnew/showinitmoney",       //计算退房金额
        checkout_info_url            : api_host + "mini/checkoutnew/showcheckoutdetail",  //退房信息
        check_out_url                : api_host + "mini/checkoutnew/confirmcheck",        //确认退房
        user_checkot_url             : api_host + "mini/checkoutnew/confirm",             //租户端发起退房确认或驳回
        check_signature_url          : api_host + "mini/checkoutnew/signature",           //退房签字
        dismissal_url                : api_host + "mini/checkoutnew/submitunapprovedaudit", //驳回后重新发起审核
        notice_info_url              : api_host + "mini/messagesnd/templatefields",        //获取通知信息
        list_renew_url               : api_host + "mini/renew/listrenew",                  //续租列表
        search_renew_url             : api_host + "mini/renew/getresidentbyroom",          //续租搜索
        search_old_url               : api_host + "mini/renew/getrenewroomstatus",         //续租原房间搜索
        confirm_renew_url            : api_host + "mini/renew/renew",                      //确认续租
        notice_type_url              : api_host + "mini/messagesnd/sendmsgtype",           //获取通知类型
        send_notice_url              : api_host + "mini/messagesnd/submit",                //发送通知
        server_status_url            : api_host + "mini/server/serverstatus",              //服务订单的完成及取消
        this_village_url             : api_host + "store/community/communityofstore",      //获取当前门店下的小区
        village_empty_url            : api_host + "store/roomdot/blankroomofcommunity",    //获取小区下的空房间
        checkin_url                  : api_host + "mini/resident/checkin",                 //办理入住
        destroy_checkin_url          : api_host + "mini/resident/destroy",                 //取消办理
        book_to_checkin_url          : api_host + "mini/resident/bookingtocheckin",        //预订转入住
        list_reserve_url             : api_host + "mini/reserve/listreserve",              //来访登记列表
        visit_record_url             : api_host + "mini/visitrecord/visit",                //来访登记
        reserve_status_url           : api_host + "mini/reserve/reservestatus",            //确认获取取消预约看房
        book_list_url                : api_host + "mini/resident/listresident",            //预订列表
        reservation_url              : api_host + "mini/resident/reservation",             //办理预订
        change_room_number           : api_host + "mini/resident/roominfo",                //输入换房房间号
        destroy_change_url           : api_host + "mini/newroom/destroy",                  //取消换房
        server_create_url            : api_host + "mini/server/create",                    //确定服务订单
    },
    indexV4: {
        wait_taskflow_url            : api_hostV4 + "taskflow_list/formybeing",            //待我审批工作流列表
        all_taskflow_url             : api_hostV4 + "taskflow_list/all",                   //全部审批工作流列表
        launch_task_url              : api_hostV4 + "taskflow_list/mycreate",              //发起审批工作流列表
        complete_task_url            : api_hostV4 + "taskflow_list/formyapproved",         //完成审批工作流列表
        pay_url                      : api_hostV4 + "pay/manual_confirm",                  //支付
        change_room_url              : api_hostV4 + "changeroom",                          //获取换房信息
        new_room_record_url          : api_hostV4 + "changeroom/calcfee",                  //计算换房信息账单
        confirm_change_url           : api_hostV4 + "changeroom/confirm",                  //确认办理换房
        Changeroom_TransferOut       : api_hostV4 + "changeroom_order/old_adjust",         //确认办理换房
        Changeroom_oldRoomUnpaid     : api_hostV4 + "changeroom_order/old_input",          //确认办理换房
        Changeroom_TransferIn        : api_hostV4 + "changeroom_order/new_adjust",         //确认办理换房
        Changeroom_newRoomUnpaid     : api_hostV4 + "changeroom_order/new_input",          //确认办理换房
    },
    
    household : {
        household_list_url           : api_host + "mini/residentct/showcenter",             //住户列表
        search_resident_url          : api_host + "mini/residentct/searchResident",         //搜索住户
        household_url                : api_host + "mini/residentct/showdetail",             //住户详情
        add_coresident_url           : api_host + "mini/coresident/addcoresident",          //添加同住人
        list_coresident_url          : api_host + "mini/coresident/listcoresident",         //同住人列表
        delete_dcoresident           : api_host + "mini/coresident/deletedcoresident",      //删除同住人
        get_predeposit_url           : api_host + "premoney/premoney/getresidentpremoney",  //预存金
        deposit_othermoney           : api_host + "premoney/premoney/premoneyshifttodeposit",//预存金转为其他押金
    },

    user : {
        change_store_id_url          : api_host + "mini/residentct/changecurrentstore",     //选择公寓
        room_building_url            : api_host + "mini/room/building",                     //获取楼栋
        room_info_url                : api_host + "mini/room/listroom",                     //获取房间信息
        dotrooms_list_url            : api_host + "mini/room/dotrooms",                     //获取分布式房间
        data_checkin_url             : api_host + "mini/residentct/datacheckin",            //获取入住率并绘制饼图
        data_visit_url               : api_host + "mini/residentct/datavisit",              //获取来访登记并绘制饼图
        data_apartment_url           : api_host + "mini/residentct/dataapartment",          //数据清单
        data_free_url                : api_host + "mini/residentct/datafree",               //空闲数据
        listemp_url                  : api_host + "mini/employee/listemp",                  //员工列表
        owner_list_url               : api_host + "mini/owner/listowners",                  //小业主列表
        search_owner_url             : api_host + "mini/owner/searchOwner",                 //搜索小业主
        owner_detail_url             : api_host + "mini/owner/showdetail",                  //小业主详情
        saveid_photo_url             : api_host + "mini/owner/saveidphoto",                 //保存小业主图片
        owner_order_url              : api_host + "mini/owner/showearning",                 //小业主账单
    }
}
