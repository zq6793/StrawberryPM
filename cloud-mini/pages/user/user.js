const request = require('../../common/request.js');
const app     = getApp();
//获取应用实例
Page({
    data: {
        userInfo     : {},
        userPic      : '',
        user_name    : '',
        userName     : '',
        apartment    : '',
        positionName : '',
        isSwitch     : true,
        // staffId      : '',
        // apartmentId  : '',
        store_id     : '',
        vNumber      : app.globalData.vNumber
    },
    onLoad(options) {
        
    },

    onShow(){
        var that = this;
        wx.getStorage({
            key     : 'currentApartmentId',
            success : function (res) {
                that.setData({
                    store_id : res.data,
                });
            },
        });

        var user = wx.getStorageSync('userInfo');
        wx.getUserInfo({
            success(res) {
              var userInfo = res.userInfo;
              that.setData({
                userinfo  : userInfo,
                userPic   : userInfo.avatarUrl,
                user_name : userInfo.nickName
              })
            }
        });

        request.getUserInfos().then((res) =>{
            that.setData({
                userName       : res[0].name,
                // staffId  　　    : res[0].id,
                // apartmentId    : res[0].store_id,
                positionName   : res[0].position.name,
                apartment　　    :　res[0].store.name,
                store_type     : res[0].store.rent_type
            });
            wx.setStorage({
                key   : 'currentApartmentId',
                data  : res[0].store_id,
            });
        }).catch(e =>{
            console.log(e)
        });
    },

    switchApartment(){
        wx.navigateTo({
            // url: '/pages/user/apartmentList?id='+this.data.staffId
            url: '/pages/user/apartmentList?store_id=' + this.data.store_id
        })
    },

    switchModify(){
        // wx.navigateTo({
        //   url: '/pages/staffManagement/modify?id=' + this.data.staffId
        // })
    }

})