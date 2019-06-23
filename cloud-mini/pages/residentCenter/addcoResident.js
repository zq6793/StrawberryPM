const request = require('../../common/request.js');

//获取应用实例
var app = getApp();
Page({
	data: {
        user_id        : "",
    	name           : '',
        phone          : '',
        documentArray  : request.cardSelect,
        documentIndex  : 0,
        idcard         : "",
        address        : "",
        imageSrc       : [],
        card_one       : "",
        card_two       : "",
        card_three     : "",
        isShowCode: false,
        codeUrl: ''
    },
    onLoad (option) {
      	let that = this;
        that.setData({
            user_id : option.id
        })
    },

    /*住户姓名*/
    name(e){
        this.setData({
            name : e.detail.value
        })
    },

    /*联系方式*/
    phone(e){
        this.setData({
            phone : e.detail.value
        })
    },

    /*证件类型*/
    documentChange(e) {
        var that = this;
        that.setData({
          documentIndex : e.detail.value
        })
    },

    /*证件号码*/
    householdID(e) {
        var that = this;
        that.setData({
          idcard: e.detail.value
        })
    },

    /*通讯地址*/
    emergencyadd(e){
        var that =this;
        that.setData({
           address: e.detail.value
        })
    },

    /*上传图片*/
    catchChooseImage(e) {
        let that      = this,
            index     = e.currentTarget.dataset.imgindex,
            tempArray = that.data.imageSrc;
        wx.chooseImage({
            count      : 1,
            sizeType   : ['compressed'],
            sourceType : ['album', 'camera'],
            success    : (res) => {
                var tempFilePaths = res.tempFilePaths[0];
                tempArray[index]  = tempFilePaths;

                request.uploadCardPhoto(tempArray[index]).then(res=>{
                    if(JSON.parse(res).rescode=== 0){
                        var data = JSON.parse(res).data.image_url;
                        if (index == 0) {
                          var card_one             = data;
                          that.data.card_one = card_one;
                        } else if (index == 1) {
                          var card_two             = data;
                          that.data.card_two = card_two;
                        } else {
                          var card_three             = data;
                          that.data.card_three = card_three;
                        }
                        request.showToast('上传成功');
                        that.setData({
                            imageSrc : tempArray,
                        });
                    }else{
                        request.showToast('上传失败！');
                    }
                }).catch(e =>{
                    console.log(e)
                });                
            },
        })
    },

    /*返回*/
    goBack(){
        wx.navigateBack({
            delta : 1
        })
    },

    confirm(e){
        let that = this,
            thatD = that.data,
            requestData = {
                id          : thatD.user_id,
                name        : thatD.name,
                phone       : thatD.phone,
                card_type   : thatD.documentIndex,
                card_number : thatD.idcard,
                card_one    : thatD.card_one,
                card_two    : thatD.card_two,
                card_three  : thatD.card_three
            };

        if(!thatD.name){
            request.showToast('请输入姓名');
            return;
        }

        if(!thatD.phone){
            request.showToast('请输入电话');
            return;
        }

        if(!thatD.card_one){
            request.showToast('请输入证件号码');
            return;
        }

        request.addCoresident(requestData).then(res=>{
            that.setData({
                isShowCode: true,
                codeUrl: res.url
            });
        }).catch(e=>{
            console.log(e)
        });
    },
    colseCode() {
        wx.switchTab({
            url: '/pages/index/index'
        })
    }
});
