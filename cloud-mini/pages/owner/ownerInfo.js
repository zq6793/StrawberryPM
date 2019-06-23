const request = require('../../common/request.js');
const config  = require('../../common/config.js');
const common  = require('../../common/common.js');
//获取应用实例
var app = getApp()
Page({
    data: {
       ownerId        : '',
       owner          : {},
       cardUrls       : {
           id_card     : {'front' : '', 'back' : '', 'owner' : ''},
           bank_card   : {'front' : '', 'back' : ''},
       },
       increase       : [],   //租金递增比例
       noRent         : [],   //免租期限
       touchStartTime : 0,    //触摸开始时间
       touchEndTime   : 0,    //触摸结束时间
       lastTapTime    : 0,    //最后一次单击事件点击发生时间
       lastTapTimeout : null, //单击事件点击后要触发的函数
       tapType        : null,
    },

    //事件处理函数
    onLoad(option) {
        let that = this,
            para = { id : option.id };

         request.ownerDetail(para).then(res=>{
            for (let key in res.id_card_urls) {
                that.data.cardUrls['id_card'][key] = res.id_card_urls[key];
            }

            for (let key in res.bank_card_urls) {
                that.data.cardUrls['bank_card'][key] = res.bank_card_urls[key];
            }

            that.setData({
                ownerId       : option.id,
                owner         : res,
                cardUrls      : that.data.cardUrls,
                increase      : res.rent_increase_rate,
                noRent        : res.no_rent_days
            });
        }).catch(e=>{
            console.log(e);
        });
    },

    checkBill(){
        wx.navigateTo({
            url : "/pages/owner/ownerBill?id=" + this.data.ownerId
        });
    },

    // 按钮触摸开始触发的事件
    touchStart(e) {
        let lastTapTime = this.data.touchStartTime;

        this.setData({
            lastTapTime     : lastTapTime,
            touchStartTime  : e.timeStamp
        });
    },

    // 按钮触摸结束触发的事件
    touchEnd(e) {
        let tapType = this.data.tapType;

        if (350 > e.timeStamp - this.data.touchStartTime) {
            if (300 > e.timeStamp - this.data.lastTapTime) {
                tapType = 'double';
            } else {
                tapType = 'single';
            }
        }

        this.setData({
            touchEndTime : e.timeStamp,
            tapType      : tapType,
        });
    },

    /**
     * 上传或者预览图片
     */
    uploadOrPreview (e) {
        let that    = this,
            data    = that.data,
            side    = e.currentTarget.dataset.imgSide,
            type    = e.currentTarget.dataset.cardType,
            tapType = that.data.tapType;

        switch (tapType) {
            case 'single' :
                that.lastTapTimeout = setTimeout(function () {
                    wx.previewImage({
                        current : data.cardUrls[type][side],
                        urls    : Object.values(data.cardUrls[type])
                    });
                }, 300);
                break;
            case 'double' :
                clearTimeout(that.lastTapTimeout);
                wx.chooseImage({
                    count      : 1,
                    sizeType   : ['compressed'],
                    sourceType : ['album', 'camera'],
                    success    : (res) => {
                        console.log(res.tempFilePaths[0])
                        that.uploadImg (type, side, res.tempFilePaths[0]);
                        return;
                        data.cardUrls[type][side] = res.tempFilePaths[0];
                        that.setData({
                            cardUrls : data.cardUrls,
                        });

                    }
                });
                break;
        }

        return;
    },

    /*上传图片*/
    uploadImg (cardType, side, filePath) {
        let that            = this,
            access_token    = wx.getStorageSync('strawberry_token');

        let ownerId         = that.data.ownerId;

        wx.showLoading({
            title   : '上传中',
            mask    : true,
        });

        wx.uploadFile({
            url      : config.api.image.store,
            filePath : filePath,
            header   : {
                "Content-type"  : "multipart/form-data",
                'Token'         : access_token.token
            },
            formData : {
                type : cardType,
                side : side,
            },
            name     : 'image',
            success  : (res) => {
                wx.hideLoading();
                if (0 == JSON.parse(res.data).rescode) {
                    that.data.cardUrls[cardType][side] = filePath;
                    that.setData({
                        cardUrls : that.data.cardUrls,
                    });

                    if(200 === res.statusCode){
                        let urls = JSON.stringify(that.data.cardUrls);
                        let para = { id : ownerId, url : urls};
                        request.saveidPhoto(para).then(resp=>{
                            console.log(resp)
                        }).catch(e=>{
                            console.log(e);
                        });
                    }
                } else {
                    request.showToast('上传失败!');
                }
            }
        });
    },

    calling(e){
        let phone = e.currentTarget.dataset.phone;

        wx.makePhoneCall({
            phoneNumber: phone
        });
    }
});