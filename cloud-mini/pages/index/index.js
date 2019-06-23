const config = require('../../common/config.js');
const request = require('../../common/request.js');
const requestV4 = require('../../common/request_v4.js');
//获取应用实例
var app = getApp();
Page({
    data: {
        pending       : '',
        confirm       : '',
        occupied      : '',
        reserveInfo   : null,
        serviceOrder  : null,
        services      : '',
        len           : '',
        phone         : '',
        statusNumber  : {
            blank   : 0,
            rent    : 0,
            arrears : 0,
            other   : 0,
        },
        store_id      : '',
        taskflowList  : []
    },

    onLoad() {       
    },

    onShow() {
        let that  = this,
            title = "";

        request.getUserInfos().then(res=>{
            that.setData({
                store_id : res[0].store_id,
            });
            
            wx.setStorage({
                key   : 'currentApartmentId',
                data  : res[0].store_id,
            });

            that.getData();
        }).catch(e=>{
            console.log(e)
        });
        /*app.globalData.scence 为1的时候是公寓云，此时不显示提示文字
            为0的时候是草莓，此时显示提示文字*/
        if(app.globalData.scence){
            title = "公寓云";
        }else{
            title = "草莓社区"+wx.getStorageSync(config.key.env);;
        }

        wx.setNavigationBarTitle({
            title: title 
        })

        // wx.onUserCaptureScreen(function(res) {
        //     console.log('用户截屏了')
        // })
    },

    getData(){
        let that = this,
            data = { store_id : that.data.store_id },
            para = { page : 1, per_page : 10};
        
        /*获取最上面房间数*/
        request.getRoomCount(data).then(res=>{
            that.setData({
                statusNumber : {
                    blank   : res.count_blank,
                    rent    : res.count_rent,
                    arrears : res.count_arrears,
                    other   : res.count_total - res.count_blank - res.count_rent
                }
            })
        }).catch(e=>{
            console.log(e)
        });

        /*获取订单数量 未缴费订单 缴费订单确定 合同签约*/
        request.getOrderCount(data).then(res=>{
            let getData = res.tipsnum;
        
            that.setData({
                pending  : getData.order,
                confirm  : getData.sureorder,
                occupied : getData.noorder
            });
        }).catch(e=>{
            console.log(e)
        });

        /*工作流列表*/
        requestV4.getListtaskflow(para).then(res=>{
            let taskflow_list = res.items
            taskflow_list.forEach((item) => {
                item.taskflow.CreatedAt = request.goTime(item.taskflow.CreatedAt)
                let val = ''
                if(item.current_step){
                    item.current_step.positions.forEach((item2, index) => {
                        if (index == 0) {
                          val += item2.name
                        } else {
                          val += '/' + item2.name
                        }
                        item.current_step_show = val
                    })
                }
            })
            that.setData({
                taskflowList : taskflow_list
            })
        }).catch(e=>{
            console.log(e)
        });
    },

    //首页预约看房-拨打电话
    calling(e){
        let phone   =  e.currentTarget.dataset.phone_number;

        wx.makePhoneCall({
            phoneNumber : phone
        });
    },

    /*服务订单*/
    showServiceDetail (e) {
        let deal = e.currentTarget.dataset.deal,
            id   = e.currentTarget.dataset.id;
            
        let url     = '/pages/serviceOrder/serviceOrderinfo?id=' + id;

        if (deal == 'SUBMITTED') {
            url     = '/pages/serviceOrder/edit?id=' + id;
        }

        wx.navigateTo({
            url     : url
        });
    },
})
