const request = require('../../common/request.js');

Page({
    data    : {
        id      : '',
        detail  : null,
        status  : ''
    },


  /**
   * 生命周期函数--监听页面加载
   */
    onLoad (options) {
        let that    = this,
            para = { taskflow_id:  options.id };
        that.setData({
            id     : options.id,
            status : options.status
        })

        //请求该记录详情
        request.getServerInfo(para).then(res=>{
            that.setData({
                detail  : res.data
            });
        }).catch(e=>{
            console.log(e)
        })
    },


    /**
    * 将记录转为开始服务
    */
    // startServing () {
    //     let that    = this,
    //         data    = that.data;

    //     if (data.detail.status != 'PAID') {
    //         base.showWarning('客户支付后才能进行该操作');
    //         return false;
    //     }

    //     // that.updateService({ action : 'SERVING', id:  });
    // },


    /**
     * 非线上支付的订单确认
     */
    // payForService (e) {
    //     let that    = this,
    //         data    = that.data;

    //     // if ('PENDING' != data.detail.status) {
    //     //     base.showWarning('只有未支付的订单才能进行此操作!');
    //     // }

    //     // if (0 == data.detail.money) {
    //     //     base.showWarning('该订单金额为零, 不能进行此操作!');
    //     // }

    //     // that.updateService({
    //     //     action  : 'PAY',
    //     //     pay_way : e.currentTarget.dataset.payway
    //     // });
    // },


    /**
     * 确认服务已经完成
     */
    completeService () {
        let that    = this,
            data    = that.data;

        // if (data.detail.status != 'SERVING') {
        //     base.showWarning('只有服务中的订单才能进行此操作!');
        //     return false;
        // }

        that.updateService({ deal : 'SDONE' ,id : data.detail.id});
    },


    /**
     * 取消订单
     */
    cancelService () {
        let that    = this,
            data    = that.data;

        // if (data.detail.status == 'COMPLETED' || data.detail.status == 'CANCELED') {
        //     base.showWarning('当前状态不能进行该操作!');
        //     return false;
        // } else if (data.detail.status == 'SERVING' && data.detail.money > 0) {
        //     base.showWarning('客户已经完成支付, 无法取消!');
        //     return false;
        // }

        wx.showModal({
            content    : '您确定取消服务订单',
            success: function (res) {
                if (res.confirm) {
                    that.updateService({ deal : 'PDONE' ,id : data.detail.id});
                }
            }
        });
    },


    /**
     * 向服务器发送请求, 更新记录状态
     */
    updateService (options) {
        let that    = this;

        request.serverStatus(options).then(res=>{
            wx.navigateBack({
               delta : 1
            });
        }).catch(e=>{
            console.log(e);
        })
    },
});