const request = require('../../common/request.js');
//获取应用实例
var app = getApp()
Page({
    data: {
        radioItems  : [],
        staffId     : '',
        store_id    : ''
    },

    onLoad(options) {
        this.setData({
            store_id : options.store_id
        })
    },

    onShow(){
        let that = this;

        request.getStroeId().then(res=>{
            that.setData({
                radioItems : res.store
            })
        });
    },

    radioChange(e) {
        var that = this;
        var radioItems = that.data.radioItems;

        for (var i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == e.detail.value;
        }

        that.setData({
            radioItems : radioItems
        });

        wx.setStorage({
            key   : 'currentApartmentId',
            data  : e.detail.value,
        });

        let para = { store_id : e.detail.value };
        request.getChangeStroe(para).then(res=>{
            wx.switchTab({
                url: '/pages/user/user'
            })
        }).catch(e=>{
            console.log(e);
        })
    }
})
