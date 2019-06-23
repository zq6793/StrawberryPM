const request = require('../../common/request.js');
//获取应用实例
var app = getApp()
Page({
    data: {
        ownerId      : '',
        ownerBill    : [],
        loadingState : 'hide',
        footerState  : 'hide',
        doloading    : false,
        perPage      : 10,
        total        : 0,
        totalPages   : 0,
        page         : 0
    },
    //事件处理函数
    onLoad(option) {
      	this.setData({
      		ownerId : option.id
      	})
    },

    onShow(){
        var that     = this;
        
        that.requestData();
    },

    requestData(){
        let that     = this;
        var ownersid = that.data.ownerId;

        if (that.data.doloading) {
            return false;
        }

        if (0 < that.data.page && that.data.page > that.data.totalPages) {
            return false;
        }
        that.setData({
            doloading       : true,
            loadingState    : 'show',
            footerState     : 'hide',
        });

        wx.showNavigationBarLoading();

        let para = {per_page : that.data.perPage, page : that.data.page + 1, id : that.data.ownerId};
        request.ownerOrder(para).then(res=>{
            let way = '';
            for(var key in res){
                if(res[key].pay_way === 'TRANSFER'){
                    way = '银行卡转账';
                }else{
                    way = '其他';
                }

                res[key].pay_way = way;
            }

            that.setData({
                // page         : parseInt(res.meta.pagination.current_page),
                // totalPages   : res.meta.pagination.total_pages,
                // total        : res.meta.pagination.total,
                ownerBill    : that.data.ownerBill.concat(res),
                // doloading    : false,
                // footerState  : res.meta.pagination.current_page >= res.meta.pagination.total_pages ? 'show' : 'hide',
                loadingState : 'hide'
            });

            wx.stopPullDownRefresh();
            wx.hideNavigationBarLoading();
        }).catch(e=>{
            console.log(e);
        });
    },

    onPullDownRefresh () {
        this.setData({
            loadingState    : 'show',
            page            : 0,
            totalPages      : 0,
            total           : 0
        });

        this.requestData();
    },

    onReachBottom(){
        this.requestData();
    },
})