const request = require('../../common/request.js');
Page({
    data: {
        inputShowed  : false,
        postid       : "",
        inputVal     : "",
        bookList     : [],
        loadingState : "hide",
        footerState  : "hide",
        searchInfo   : [],
        doloading    : false,
        perPage      : 15,
        total        : 0,
        totalPages   : 0,
        page         : 0,
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad(options) {
    },

    onShow(){
        this.getDataList();
    },

    getDataList(){
        var that = this;
        if (that.data.doloading) {
            return false;
        }

        if (0 < that.data.page && that.data.page > that.data.totalPages) {
            return false;
        }

        that.setData({
            doloading    : true,
            loadingState : 'show',
            footerState  : 'hide',
        });

        wx.showNavigationBarLoading();

        let para = { status : "RESERVE", page : that.data.page +1, per_page : that.data.perPage};
        request.getBookList(para).then(res=>{
            that.setData({
                page         : parseInt(res.current_page),
                totalPages   : res.total_page,
                // total        : res.total,
                bookList     : that.data.bookList.concat(res.residents),
                doloading    : false,
                footerState  : res.current_page >= res.total_page ? 'show' : 'hide',
                loadingState : 'hide'
            });
            
            wx.stopPullDownRefresh();
            wx.hideNavigationBarLoading();
        }).catch(e=>{
            console.log(e)
        })
    },

    onPullDownRefresh(){
        this.setData({
            loadingState    : 'show',
            page            : 0,
            totalPages      : 0,
            total           : 0
        });

        this.getDataList();
    },

    onReachBottom () {
        this.getDataList();
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

        if (e.detail.value.length > 2){
            let para = { type : "RESERVE", room_number : e.detail.value };
            request.searchOrder(para).then(res=>{
                that.setData({
                    searchInfo   : res.data.data,
                    loadingState : 'hide',
                    footerState  : 'hide'
                })
            }).catch(e =>{
                console.log(e)
            });
        }
    },

    toCheck(e){
        var id = e.currentTarget.dataset.postid;
        wx.redirectTo({
            url: '/pages/information/checkIn?resident_id='+id,
        })
    },

    toDelete(e){
        let that = this,
            id   = e.currentTarget.dataset.postid;
        wx.showModal({
            title   : '提示',
            content : '确定删除订单?',
            success : function (res) {
                if (res.confirm) {
                    let para = { resident_id : id };
                    request.destroyCheckin(para).then(respone=>{
                        if(respone.rescode==="0" || respone.rescode===0){
                            request.showToast("您已删除成功！");
                        }else{
                            wx.switchTab({
                                url : '/pages/index/index',
                            });
                        }
                    }).catch(e=>{
                        console.log(e)
                    })
                }
            }
        })
    }
})