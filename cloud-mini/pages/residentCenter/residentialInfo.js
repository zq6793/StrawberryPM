const request = require('../../common/request.js'); 
const requestV4 = require('../../common/request_v4.js');
Page({
    data: {
        resident_id : "",
        list        : [],
        cardType    : '',
        status      : '',
        isShowCode  : false,
        codeUrl     : '',
    },

    onLoad(options) {
        let that  = this;
        that.setData({
            resident_id : options.id
        })
    },

    onShow() {
        let that = this,
            para = {resident_id : that.data.resident_id};

        request.listCoresident(para).then(res=>{
            let data = res.resindet;

            for(var key in data){
                data[key].card_type = data[key].card_type ? request.cardType(data[key].card_type) : null;

                if(data[key].customer_id != "0" || data[key].customer_id != 0){
                    data[key].status = "正常";
                }else if(data[key].customer_id === "0" || data[key].customer_id === 0){
                    data[key].status = "未扫码";
                }else{}
            }
            that.setData({
                list : data
            })
        }).catch(e=>{
            console.log(e);
        });
    },

    /*拨打电话*/
    calling(e){
        let phone   = e.currentTarget.dataset.phone;

        wx.makePhoneCall({
            phoneNumber : phone
        });
    },

    /*查看二维码*/
    code(e){
        let that = this,
            id   = e.currentTarget.dataset.id,
            para = { resident_id :id};

        request.getQRCode(para).then(res=>{
            that.setData({
                isShowCode : true,
                codeUrl    : res.url
            });
        }).catch(e=>{
            console.log(e);
        });
    },

    colseCode(){
        wx.switchTab({
            url: '/pages/index/index'
        })
    },

    /*返回*/
    cancellation(){
        wx.navigateBack({
            delta : 1
        })
    },

    /*删除*/
    delete(e){
        let that = this,
            id = e.target.id;

        wx.showModal({
            content     : '确定删除该同住人',
            showCancel  : true,
            success: function (resp) {
                if (resp.confirm) {
                    let para = { id : id };
                    request.deleteDcoresident(para).then(res=>{
                        wx.navigateBack({
                            delta : 2
                        })
                    }).catch(e=>{
                        console.log(e);
                    }); 
                }
            }
        });
    }
})