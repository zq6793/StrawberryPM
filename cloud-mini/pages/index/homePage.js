const config = require('../../common/config.js');
const request = require('../../common/request.js');
const requestV4 = require('../../common/request_v4.js');
const common  = require('../../common/common.js');
const app     = getApp();
//获取应用实例
Page({

    data: {
        menuPages    : ['pages/index/index', 'pages/residentCenter/residentCenter', 'pages/user/user'],
        authorized   : true,
        targetPath   : 'pages/index/index',
        targetUrl    : '',
        isAuthorized : true,
        canIUse      : wx.canIUse('button.open-type.getUserInfo'),
        userInfo     : '',
        token        : '',
        showInfo     : false
    },

    onLoad(options) {
        let that    = this,
            targetPath  = options.page_to_redirect;

        delete options.page_to_redirect;

        if (!targetPath || targetPath && targetPath == 'pages/index/homePage') {
            targetPath = that.data.targetPath;
        }

        let query   = Object.keys(options).map(key => {
            return key + '=' + options[key]
        }).join('&');

        that.setData({
            targetUrl    : targetPath + '?' + query,
            targetPath   : targetPath
        });
    },

    onShow() {
        let that = this,
            show_info;

        /*app.globalData.scence 为1的时候是公寓云
            为0的时候是草莓*/
        console.log(app.globalData.scence);
        if(app.globalData.scence){
            show_info = false;
        }else{
            show_info = true;
        }

        that.setData({
            showInfo : show_info
        })

        wx.getSetting({
            success(res){
                if (res.authSetting['scope.userInfo']) {
                    console.log("已授权");
                    that.getUserInfo();
                }else{
                    that.setData({
                        isAuthorized : false
                    })
                    console.log("未授权");
                }
            }
        })
    },

    /*获取用户信息（利用wx.login返回的code获取用户的信息)*/
    getNeededUserInfo(code, encryptedData, iv, sign){
        let that = this,
            requestData = { code, encryptedData, iv, sign };

        requestV4.authorize(requestData).then((resp) =>{
            if(resp.length == 0){
                request.showWarning("没有查询到该员工");
                that.setData({
                    authorized : false,
                });
            }else{
                if (resp.token) {
                    common.setAccessTokenSync({
                        'token' : resp.token
                    });
                    wx.setStorageSync(config.key.env, resp.env);
                }
                if (that.data.menuPages.includes(that.data.targetPath)) {
                    wx.switchTab({
                        url : '/' + that.data.targetPath,
                    });
                } else {
                    wx.navigateTo({
                        url : '/' + that.data.targetUrl,
                    });
                }
            }
        }).catch(e =>{
            console.log(e)
        });
    },

    /*获取用信息*/
    getUserInfo(){
        let that = this,
            authorized;
        request.wechatLogin().then(res=>{
            if(res.code){
                wx.getUserInfo({
                    withCredentials: true,
                    success: function(resp){
                        that.getNeededUserInfo( res.code, resp.encryptedData, resp.iv, resp.signature );
                        var objUser       = {};
                        objUser.avatarUrl = resp.userInfo.avatarUrl;
                        objUser.nickName  = resp.userInfo.nickName;
                        wx.setStorageSync('userInfo', objUser);  //存储用户信息                            

                        authorized = true;                        
                    }
                })
            }else{
                authorized = false;
                request.showWarning("您没有授权，不能正常使用该小程序哦！");
    　　　　　　}
          
            that.setData({
                isAuthorized : authorized
            })
        }).catch(e =>{
            console.log(e)
        });
    },

    bindGetUserInfo(e){
        var that      = this,
            authorized;
        //此处授权得到userInfo
        if(!e.detail.userInfo){
            authorized = false;
            request.showWarning("您没有授权，不能正常使用该小程序哦！");
        }else{
            authorized = true;
            that.getUserInfo();
        }
        
        that.setData({
            isAuthorized : authorized
        })
    },

    comeWithMe () {
        wx.navigateTo({
            url : '/pages/index/for_wechat_web'
        });
    },
})
