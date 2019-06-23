const request = require('../../common/request.js');
Page({
    data: {
        checkout_id : '', //房间id
        userInfo    : {},
        bankList    : [],
        idCardList  : []
    },

    onLoad (options) {
        let that = this;

        that.setData({
            checkout_id : options.checkId
        })
    },

    onShow(){
        let that = this,
            para = { checkout_id : that.data.checkout_id};

        request.checkoutInfo(para).then(res=>{
            let bank_list = [],
                id_card   = [];

            bank_list.push(res.checkout.bank_card_back_img,res.checkout.bank_card_front_img);
            id_card.push(res.checkout.card_back_img,res.checkout.card_front_img);
            that.setData({
                userInfo   : res,
                bankList   : bank_list,
                idCardList : id_card
            })
        }).catch(e=>{
            console.log(e)
        });
    },

    /*预览银行卡图片*/
    previewBank(e){
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.bankList // 需要预览的图片http链接列表
        })
    },

    /*预览身份证图片*/
    previewIdCard(e){
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.idCardList // 需要预览的图片http链接列表
        })
    },

    /*办理*/
    handle(e){
        let that = this,
            type = e.currentTarget.dataset.status,
            para = {checkout_id : that.data.checkout_id , status : type};
        
        request.userCheckout(para).then(res=>{
            wx.switchTab({
                url: '/pages/index/index'
            })
        }).catch(e=>{
            console.log(e);
        })
    },

})
