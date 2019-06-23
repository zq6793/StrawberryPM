const request = require('../../common/request.js');
//获取应用实例
var app = getApp();
Page({
    data: {
        store_name   : '',
        store_id     : '',
        country      : [],
        countryIndex : 0,
        time         : '',
        range        : '',
        content      : ''
    },

    onLoad(options) {
        
    },

    onShow() {
        let that     = this;
        /*获取门店名称*/
        request.getUserInfos().then(res=>{
            that.setData({
                store_name : res[0].store.name,
                store_id   : res[0].store.id
            })
        }).catch(e=>{
            console.log(e);
        });
        
        request.noticeType().then(res=>{
            var countrys = [],
                data     = res.type;

            for (var key in data) {
                countrys.push({ id : data[key].field, noticeName: data[key].name});
            }

            that.setData({
               country : countrys
            })

            that.setData({
               template_id : that.data.country[that.data.countryIndex].id
            })
        }).catch(e=>{
            console.log(e);
        });
    },

    /*选择通知类型*/
    bindCountryChange(e) {
        var that = this;
        that.setData({
            countryIndex : e.detail.value,
            template_id  : that.data.country[e.detail.value].id
        })
    },

    /*填写时间*/
    changeTime(e){
        this.setData({
            time : e.detail.value
        });
    },

    /*填写范围*/
    changeRange(e){
        this.setData({
            range : e.detail.value
        });
    },

    /*填写原因*/
    changeContent(e){
        this.setData({
            content : e.detail.value
        });
    },

    confirmSending(){
        let that        = this,
            data        = that.data,
            requestData = {};

        if (!data.time) {
            request.showToast("请填写时间");
            return false;
        }

        if (!data.range) {
            request.showToast("请填写范围");
            return false;
        }

        if (!data.content) {
            request.showToast("请填写原因");
            return false;
        }

        requestData['type']       = data.template_id;
        requestData['time_range'] = data.time;
        requestData['area_range'] = data.range;
        requestData['reason']     = data.content;

        that.setData({
            buttonClicked : true
        });

        request.sendNotice(requestData).then(res=>{
            request.showWarning("请勿重复提交");
            wx.switchTab({
                url: '/pages/index/index'
            })
        }).catch(e=>{
            console.log(e);
        });
    }
})
