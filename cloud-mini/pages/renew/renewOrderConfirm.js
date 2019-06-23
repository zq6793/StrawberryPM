const request = require('../../common/request.js');
Page({
    data: {
        confirmInfo : {},
        isShowCode  : false,
        resident_id : '',
    },

    onLoad(options) {
        let that = this,
            para = { resident_id : options.resident_id };

        that.setData({
            resident_id : options.resident_id
        })
        request.getResident(para).then(res=>{
            that.setData({
                confirmInfo : res.data
            });
        }).catch(e=>{
            console.log(e);
        });  
    },

    /*拨打电话*/
    calling(e){
        let phone   = e.currentTarget.dataset.phone_number;

        wx.makePhoneCall({
            phoneNumber : phone
        });
    },

    /*确认办理*/
    submitConfirm(){
        let that = this,
            para = { resident_id : that.data.resident_id };

        request.getQRCode(para).then(res=>{
            that.setData({
                isShowCode : true,
                codeUrl    : res.url
            });
        }).catch(e=>{
            console.log(e);
        });
    },

    /*关闭二维码*/
    colseCode(){
        wx.switchTab({
            url: '/pages/index/index'
        })
    },

    /*取消办理*/
    cancellation(){
        let that = this;
        wx.showModal({
            content : '您确定取消办理',
            success : function (resp) {
                if (resp.confirm) {
                    let para = { resident_id : that.data.resident_id };
                    request.destroyRenew(para).then(res=>{
                        wx.navigateBack({
                            delta : 2
                        })
                    }).catch(e=>{
                        console.log(e);
                    });
                }
            }
        });
    },
})