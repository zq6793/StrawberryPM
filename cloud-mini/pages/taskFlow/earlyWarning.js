const request = require('../../common/request.js');
//获取应用实例
var app = getApp()
Page({
    data: {
        roomInfo     : {},
        userInfo     : {},
        remark       : '',
        taskflow_id  : '',
        status       : '',
        isSHow       : false
    },

    //事件处理函数
    onLoad(option) {
        this.setData({
            taskflow_id : option.id
        })
    },

    onShow(){
         let that = this,
            para = { taskflow_id: that.data.taskflow_id};

        request.getServerInfo(para).then(res=>{
            if(res.taskflow.status === "APPROVED"){
                that.setData({
                    remark : res.taskflow.record[0].remark,
                    isSHow : true
                });
            }
            that.setData({
                roomInfo : res.data,
                userInfo : res.taskflow
            });
        }).catch(e=>{
            console.log(e)
        });
    },

    /*拨打电话*/
    calling(e){
        let phone   = e.currentTarget.dataset.phone_number;

        wx.makePhoneCall({
            phoneNumber : phone
        });
    },

    /*备注*/
    remarkChange(e){
        this.setData({
            remark : e.detail.value
        })
    },

    /*确认*/
    makeSure(){
        let that = this,
            para = { taskflow_id : that.data.taskflow_id, remark : that.data.remark, audit: 'APPROVED'};
        if(!that.data.remark){
            request.showToast('请填写备注');
            return;
        }

        request.auditApply(para).then(res=>{
            wx.switchTab({
                url: '/pages/index/index'
            });
        }).catch(e=>{
            console.log(e)
        });
    }
})