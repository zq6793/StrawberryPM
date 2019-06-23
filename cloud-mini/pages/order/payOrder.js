const request = require('../../common/request.js');
//获取应用实例
var app = getApp()
Page({
    data: {
        inputShowed   : false,
        inputVal      : "",
        payorderArray : [],
        loadingState  : 'hide',
        footerState   : 'hide',
        searchInfo    : [],
        doloading     : false,
        perPage       : 15,
        total         : 0,
        totalPages    : 0,
        page          : 0
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

        let para = { status : 'CONFIRM', per_page : that.data.perPage, page : that.data.page + 1};
        request.searchOrder(para).then(res=>{
            that.setData({
                page            : parseInt(res.data.current_page),
                totalPages      : res.data.total_pages,
                total           : res.data.total,
                payorderArray   : that.data.payorderArray.concat(res.data.data),
                doloading       : false,
                footerState     : res.data.current_page >= res.data.total_pages ? 'show' : 'hide',
                loadingState    : 'hide'
            });

            wx.stopPullDownRefresh();
            wx.hideNavigationBarLoading();
        }).catch(e=>{
            console.log(e)
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
            inputShowed: true
        });
    },

    inputTyping(e) {
        var that = this;
        that.setData({
            inputVal: e.detail.value
        });
        if (e.detail.value.length>2){
            let para = { status : 'CONFIRM', room_number : e.detail.value };
            request.searchOrder(para).then(res=>{
                that.setData({
                    searchInfo   : res.data.data,
                    loadingState : 'hide',
                    footerState  : 'hide'
                })
            }).catch(e=>{
                console.log(e)
            });
        }
    }, 

    hideInput () {
        this.setData({
            inputVal    : "",
            inputShowed : false
        });
    },

    clearInput () {
        this.setData({
            inputVal : ""
        });
    },
})