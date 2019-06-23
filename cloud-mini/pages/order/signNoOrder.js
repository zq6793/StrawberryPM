const request = require('../../common/request.js');
//获取应用实例
var app = getApp()
Page({
    data: {
        inputShowed  : false,
        inputVal     : "",
        pending      : [],
        page         : 0,
        doloading    : false,
        loadingState : 'hide',
        footerState  : 'hide',
        searchInfo   : [],
        // isDelete     : false,
        edit         : false,
        perPage      : 15,
        total        : 0,
        totalPages   : 0
    },

    //事件处理函数
    onLoad() {
        this.getRoomsOccupied();
    },

    onShow(){
        this.onLoad();
    },

    getRoomsOccupied () {
        let that  = this;

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
        request.getContractList(para).then(res=>{

            that.setData({
                page         : parseInt(res.current_page),
                totalPages   : res.total_page,
                total        : res.total,
                pending      : that.data.pending.concat(res.data),
                doloading    : false,
                footerState  : res.current_page >= res.total_page ? 'show' : 'hide',
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
    onPullDownRefresh () {
        this.setData({
            loadingState    : 'show',
            page            : 0,
            totalPages      : 0,
            total           : 0
        });

        this.getRoomsOccupied();
    },

    /**
     * 触底加载
     */
    onReachBottom () {
        this.getRoomsOccupied();
    },

    showInput() {
      this.setData({
        inputShowed : true,
        edit        : true
      });
    },

    hideInput() {
      this.setData({
        inputVal    : "",
        inputShowed : false,
        edit        : false
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
            inputVal: e.detail.value
        });
        if (e.detail.value.length > 2){
            let para = { room_number : e.detail.value};
            request.getContractList(para).then(res=>{
                that.setData({
                    searchInfo　 　: res.data,
                    loadingState　: 'hide',
                    footerState　　: 'hide'
                })
            }).catch(e=>{
                console.log(e);
            });
        }
    },

    // edit(){
    //     var that = this;
    //     that.setData({
    //         isDelete :　!that.data.isDelete
    //     });
    // },

    // delete(e){
    //     var that = this;
    //     wx.showModal({
    //         title      : '确认删除订单信息',
    //         content    : '删除后订单将无法恢复，请确认是否删除',
    //         showCancel : false,
    //         success    : function (res) {
    //             that.setData({
    //                 isDelete : false
    //             });
    //         }
    //     });
    // }
})