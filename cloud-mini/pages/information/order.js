const request = require('../../common/request.js');
Page({
    data: {
        confirmInfo : {},
        payType     : '',
        total       : 0,
        isShowCode  : false,
        codeUrl     : '',
        userId      : ''
    },

    onLoad(options) {
        var that = this;
        that.setData({
          userId : options.id
        })
        var id = that.data.userId;

        let para = { resident_id : id };
        request.getResident(para).then((res)=>{
            let payType = '',
                total   = 0;

            if(res.data.pay_type === 12){
                payType = "年付";
            }else if(res.data.pay_type === 6){
                payType = "半年付";
            }else if(res.data.pay_type === 3){
                payType = "季付";
            }else if(res.data.pay_type === 1){
                payType = "月付";     
            }
            total = parseInt(res.data.first_pay)+parseInt(res.data.deposit_money_rent)+parseInt(res.data.deposit_money_other);
            that.setData({
                confirmInfo : res.data,
                payType     : payType,
                total       : total
            })
        }).catch(e =>{
            console.log(e)
        });
    },

    goback(){
        var resident_id = this.data.userId;
        wx.showModal({
            content : '您确定取消办理',
            success : function (resp) {
                if (resp.confirm) {
                    let para = { resident_id : resident_id };
                    request.destroyCheckin(para).then(res=>{
                        wx.switchTab({
                            url : '/pages/index/index'
                        })
                    }).catch(e=>{
                        console.log(e);
                    });
                }
            }
        });
    },
  
    checkIn(){
        let that = this,
            para = { resident_id : that.data.userId };
        request.getQRCode(para).then(res=>{
            that.setData({
                isShowCode : true,
                codeUrl    : res.url
            });
        }).catch(e =>{
            console.log(e)
        });
    },

    colseCode(){
        wx.switchTab({
            url: '/pages/index/index'
        })
    }
})