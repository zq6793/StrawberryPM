const utils   = require('../../utils/util.js');
const request = require('../../common/request.js');
Page({
    data: {
        inputVal     : "",
        searchInfo   : [],
        perPage      : 15,
        reserveData  : [],
        page         : 0,
        doloading    : false,
        totalPages   : 0,
        total        : 0,
        loadingState : 'hide',
        footerState  : 'hide',
    },

    onLoad() {
       this.onShow();
    },

    onShow(){
        this.requestData();
    },

    showInput() {
        this.setData({
            inputShowed: true
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
        this.setData({
            inputVal : e.detail.value
        });

        // if (e.detail.value.length > 2){
        //     let para = { type : "RESERVE", room_number : e.detail.value };
        //     request.searchOrder(para).then(res=>{
        //         that.setData({
        //             searchInfo   : res.data.data,
        //             loadingState : 'hide',
        //             footerState  : 'hide'
        //         })
        //     }).catch(e =>{
        //         console.log(e)
        //     });
        // }
    },

    /**
     * 请求预约看房的列表
     */
    requestData () {
        let that = this;

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

        let para = { page_count : that.data.perPage, page : that.data.page + 1};
        request.getListServe(para).then(res=>{
            that.setData({
                page            : parseInt(res.page),
                totalPages      : res.count_total,
                total           : res.count,
                reserveData     : that.data.reserveData.concat(res.list),
                doloading       : false,
                footerState     : res.page >= res.count ? 'show' : 'hide',
                loadingState    : 'hide'
            });

            wx.stopPullDownRefresh();
            wx.hideNavigationBarLoading();
        }).catch(e =>{
            console.log(e)
        });
    },

    /**
     * 下拉刷新
     */
    onPullDownRefresh () {
        this.setData({
            reserveData : [],
            page        : 0,
            totalPages  : 0,
            total       : 0
        });

        this.requestData();
    },

    /**
     * 触底加载
     */
    onReachBottom () {
        let that    = this;

        that.requestData();
    },

    toCheck(e){
        var id = e.currentTarget.dataset.postid;

        wx.navigateTo({
            url: '/pages/reservation/edit?id='+id,
        })
    },

    /**
     * 拨打预约记录预留的电话
     */
    calling(e) {
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.phone
        });
    }
})