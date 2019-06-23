const utils   = require('../../utils/util.js');
const time    = utils.formatDate(new Date());
const request = require('../../common/request.js');
Page({
    data: {
        inputShowed  : false,
        inputVal     : "",
        renewList    : [],
        doloading    : false,
        perPage      : 15,
        total        : 0,
        totalPages   : 0,
        page         : 0,
        loadingState : 'hide',
        footerState  : 'hide',
        searchInfo   : []
    },
    
    onLoad (options) {
    },

    onShow(){
        this.requestData();
    },

    /**
     * 向服务器请求数据
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

        let para = { per_page : that.data.perPage, page : that.data.page + 1};
        request.getRenewList(para).then(res=>{
            that.setData({
                // page         : parseInt(res.data.current_page),
                // totalPages   : res.data.total_pages,
                // total        : res.data.total,
                renewList    : res,
                // renewList      : that.data.pending.concat(res.data),
                doloading    : false,
                // footerState  : res.data.current_page >= res.data.total_pages ? 'show' : 'hide',
                loadingState : 'hide'
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
    // onPullDownRefresh () {
    //     this.setData({
    //         loadingState    : 'show',
    //         page            : 0,
    //         totalPages      : 0,
    //         total           : 0
    //     });

    //     this.requestData();
    // },

    /**
     * 触底加载
     */
    // onReachBottom () {
    //     this.requestData();
    // },

    showInput() {
        this.setData({
            inputShowed: true
        });
    },

    inputTyping(e) {
        let that = this,
            para = {room_number : e.detail.value};
        that.setData({
            inputVal: e.detail.value
        });
        if (e.detail.value.length > 2){

            request.getRenewList(para).then(res=>{
                that.setData({
                    searchInfo   : res,
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
