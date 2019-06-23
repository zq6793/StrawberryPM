const request = require('../../common/request.js');
Page({
 
    /**
    * 页面的初始数据
    */
    data: {
        bookInfo  : '',
        phone     : ''
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad (options) {
        let that = this,
            para = { resident_id : options.id};

        request.getResident(para).then(res=>{
            that.setData({
                bookInfo : res.data,
                phone    : res.data.phone
            })
        })
    },

    calling(e) {
        let phone   = e.currentTarget.dataset.phone_number;

        wx.makePhoneCall({
            phoneNumber : phone
        });
    }
})