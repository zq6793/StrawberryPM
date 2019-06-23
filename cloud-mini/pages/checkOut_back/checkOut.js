const request = require('../../common/request.js');
Page({
    data: {
        inputShowed  : false,
        doloading    : false,
        inputVal     : "",
        loadingState : 'hide',
        footerState  : 'hide',
        page         : 0,
        total        : 0,
        totalPages   : 0,
        perPage      : 15,
        checkOut     : [],
        searchInfo   : []
    },

    onLoad (options) {
    },

    onShow(){
        this.requestData();
    },

    requestData() {
        var that = this;

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

        let para = { page : that.data.page + 1 , pre_count : that.data.perPage,};
        request.getCheckoutList(para).then(res=>{
            that.setData({
                page         : parseInt(res.current_page),
                totalPages   : res.total_page,
                total        : res.count,
                checkOut     : that.data.checkOut.concat(res.list),
                doloading    : false,
                footerState  : parseInt(res.current_page) >= res.total_page ? 'show' : 'hide',
                loadingState : 'hide'
            });

            wx.stopPullDownRefresh();
            wx.hideNavigationBarLoading();
        }).catch(e=>{
            console.log(e);
        });
    },

    /**
     * 下拉刷新
     */
    onPullDownRefresh () {
        this.setData({
            loadingState    : 'show',
            page            : 0,
            totalPages      : 0,
            total           : 0
        });

        this.requestData();
    },

    /**
     * 触底加载
     */
    onReachBottom () {
        this.requestData();
    },

    showInput() {
        this.setData({
            inputShowed  : true
        });
    },

    hideInput() {
        this.setData({
            inputVal    : "",
            inputShowed : false
        });
    },

    clearInput() {
        this.setData({
            inputVal: ""
        });
    },

    inputTyping(e) {
        var that = this;
        that.setData({
            inputVal: e.detail.value,
            page  : 0
        });

        if (e.detail.value.length > 2){
            let para = { pre_count : that.data.perPage,  page : that.data.page, room_number : e.detail.value};
            request.getCheckoutList(para).then(res=>{
                that.setData({
                    searchInfo   : res.list,
                    loadingState : 'hide',
                    footerState  : 'hide'
                })
            }).catch(e=>{
                console.log(e);
            });
        }
    },

    next(e){
        var checkid    = e.currentTarget.dataset.checkid,
            residentid = e.currentTarget.dataset.residentid,
            status     = e.currentTarget.dataset.status,
            roomid     = e.currentTarget.dataset.roomid;

        if(status === "APPLIED"){
            wx.navigateTo({
                url : "/pages/checkOut/userCheckout?checkId="+ checkid
            })
        }else if(status === "CONFIRM"){
            wx.navigateTo({
                url : "/pages/checkOut/checkoutInfo?status="+ status +"&checkid="+ checkid
            })
        }else{
            wx.navigateTo({
                url : "/pages/checkOut/examine?status="+ status +"&checkId="+ checkid
            })
        }
    }
})