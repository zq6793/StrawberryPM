const request = require('../../common/request.js');

Page({
    data: {
        id        : '',
        money     : '',
        remark    : '',
        image     : [],
        type_name : ''
    },

    /*生命周期函数--监听页面加载*/
    onLoad(options) {
        this.setData({
            id  : options.id,
        });
    },


    onShow(){
        let that      = this,
            type_name = '',
            para      = { taskflow_id: that.data.id };

        //请求该记录详情
        request.getServerInfo(para).then(res=>{
            if('CLEAN' === res.data.type){
                type_name = '清洁服务';
            }else if('REPAIR' === res.data.type){
                type_name = '维修服务';
            }
            that.setData({
                detail    : res.data,
                remark    : res.data.remark,
                money     : res.data.money > 0 ? res.data.money : '',
                image     : res.data.paths,
                type_name : type_name
            })
        }).catch(e=>{
            console.log(e);
        });
    },


    /*服务费用*/
    inputMoney (e) {
        this.setData({
            money : e.detail.value,
        });
    },


    /*填写备注*/
    inputRemark (e) {
        this.setData({
            remark : e.detail.value,
        });
    },

    repair(e){ //展示维修照片
        wx.previewImage({
            current : e.currentTarget.dataset.postid, // 当前显示图片的http链接
            urls    : this.data.image   // 需要预览的图片http链接列表
        })
    },

    /*发送订单, 确认金额*/
    confirmService () {
        let that    = this,
            data    = that.data;

        // base.srever({
        //     url     : 'server/comfirmorder',
        //     data    : {
        //         // action  : 'CONFIRM',
        //         id      : data.id,
        //         money   : data.money ? data.money : 0,
        //         remark  : data.remark ? data.remark : '',
        //     }
        // }, (response) => {
        //     wx.navigateBack({
        //         delta : 1
        //     });
        // });
    },
});