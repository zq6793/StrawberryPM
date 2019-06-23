const request = require('../../common/request.js');
Page({
    data: {
        services     :'',
        inputShowed  : false,
        searchInfo   : [],
        inputVal     : "",
        loadingState : 'hide',
        footerState  : 'hide',
        pagestate    : 'hide',
        payorderArray: []
    },

    onLoad(options) {

    },

    onShow () {
        let that = this;

        // base.srever({
        //     loading : true,
        //     url     : 'server/listserver',
        //     data    : {
        //         per_page  : 50,   //现在不做分页, 一般服务记录不会很多, 取回所有的需要处理的记录
        //     },
        // }, (res) => {
        //     that.setData({
        //         payorderArray   : res.list,
        //         pagestate       : 'show',
        //     });
        // });
    },

    showInput() {
        this.setData({
            inputShowed: true
        });
    },

    hideInput () {
        this.setData({
            inputVal    : "",
            inputShowed : false
        });
    },

    clearInput () {
        this.setData({
            inputVal :  ""
        });
    },

    inputTyping(e) {
        var that = this;

        that.setData({
          inputVal: e.detail.value
        });

        if (e.detail.value.length >2){
            // base.srever({
            //     url: 'server/listserver',
            //     data : {
            //         number : e.detail.value
            //     }
            // },(res) => {

            //     that.setData({
            //         searchInfo   : res.list,
            //         loadingState : 'hide',
            //         footerState  : 'hide'
            //     })
            // })
        }
    },

    /**
     * 根据记录状态的不同跳转到不同的页面
     */
    showServiceDetail (e) {
        let id      = e.currentTarget.dataset.id,
            status  = e.currentTarget.dataset.status,
            url     = '/pages/serviceOrder/serviceOrderinfo?id=' + id;

        if (status == 'SUBMITTED') {
            url     = '/pages/serviceOrder/edit?id=' + id;
        }

        wx.navigateTo({
            url : url
        });
    }
});