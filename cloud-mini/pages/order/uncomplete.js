const request = require('../../common/request.js');
Page({

    /*页面的初始数据*/
    data: {
        isShowCode   : false,
        codeUrl      : '',
        userId       : '',
        uncompletes  : {},
        renewCancel  : false
    },

    /*生命周期函数--监听页面加载*/
    onLoad(options) {
        var that         = this;
        that.data.userId = options.id

        let para = { resident_id : options.id };
        request.getResident(para).then(res=>{
            let requsetData  = res.data,
                renewCancels;

            if("RENEWAL" === requsetData.type){
                renewCancels = true;
            }else{
                renewCancels = false;
            }

            that.setData({
                uncompletes : requsetData,
                renewCancel : renewCancels
            });
        }).catch(e=>{
            console.log(e);
        });
    },

    checkIn() {
        var that = this;
        var para = { resident_id : that.data.userId };

        request.getQRCode(para).then(res=>{
            that.setData({
                isShowCode : true,
                codeUrl    : res.url
            });
            wx.removeStorageSync('cache');
        })
    },

    /*拨打电话*/
    calling(e){
      let phone   = e.currentTarget.dataset.phone;

      wx.makePhoneCall({
        phoneNumber : phone
      });
    },

    /*正常取消*/
    goback() {
        var para = { resident_id : this.data.userId };

        wx.showModal({
            content : '您确定取消办理',
            success: function (resp) {

                if (resp.confirm) {
                    request.destroyCheckin(para).then(res=>{
                        wx.navigateBack({
                            delta : 1
                        })
                        wx.switchTab({
                            url: '/pages/index/index'
                        });
                    }).catch(e=>{
                        console.log(e);
                    });
                }else{
                    wx.navigateBack({
                        delta : 2
                    })
                }
            }
        });
    },
    
    /*续租取消*/
    gobackRenewCancel(){
        let that = this.data;
        
        wx.showModal({
            content : '您确定取消办理',
            success : function (resp) {
                if (resp.confirm) {

                    let para = { resident_id : that.userId };
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

    colseCode() {
        wx.navigateBack({
            delta : 1
        })
    }
})