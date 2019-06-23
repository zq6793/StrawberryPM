const request = require('../../common/request.js');
const requestV4   = require('../../common/request_v4.js');
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
        let that = this;
        
        wx.getStorage({
            key     : 'currentApartmentId',
            success : function (res) {
                that.setData({
                    apartmentId : res.data,
                });
            },
            fail    : function (res) {
                that.setData({
                    apartmentId : 0,
                });
            }
        });
        
        that.requestData();
    },
    onShow(){
        let that = this;

        wx.getStorage({
            key     : 'currentApartmentId',
            success : function (res) {
                if (res.data != that.data.apartmentId) {
                    that.setData({
                        apartmentId     : res.data,
                    });
                    that.onPullDownRefresh();
                }
            },
        });
    },
    requestData() {
        var that = this;
        let store_id = wx.getStorageSync('currentApartmentId')
        if (that.data.doloading) {
            return false;
        }
        if (0 < that.data.offset && that.data.offset > that.data.total) {
            return false;
        }
        that.setData({
            doloading       : true,
            loadingState    : 'show',
            footerState     : 'hide',
        });
        wx.showNavigationBarLoading();
        let para = { 
            store_id     : store_id,
            page         : that.data.page, 
            group_status : 'DOING',
        };
        requestV4.checkoutList(para).then(res=>{
            res.items.forEach((item) => {
              item.CreatedAt = request.goTime(item.CreatedAt)
            })
            let resData = res.items          
            that.setData({
                page         : (that.data.page+1),
                total        : res.count,
                checkOut     : that.data.checkOut.concat(resData),
                doloading    : false,
                footerState  : (para.page)*10 +10 >= res.count ? 'show' : 'hide',
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
            checkOut        : [],
            page            : 0,
            total           : 0,
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
        let store_id = wx.getStorageSync('currentApartmentId')
        that.setData({
            inputVal: e.detail.value,
            page  : 0
        });

        if (e.detail.value.length > 2){
            let para = { 
                store_id  : store_id,
                pre_count : that.data.perPage,  
                page : that.data.page, 
                room_number : e.detail.value
                };
            requestV4.checkoutList(para).then(res=>{
                that.setData({
                    searchInfo   : res.items,
                    loadingState : 'hide',
                    footerState  : 'hide'
                })
            }).catch(e=>{
                console.log(e);
            });
        }
    },
    next(e){
        if(e.currentTarget.dataset.status === "APPLIED"){
            wx.navigateTo({
                url : "/pages/checkOut/examine?status="+ e.currentTarget.dataset.status +"&checkId="+ e.currentTarget.dataset.checkid
            })
        }else if(e.currentTarget.dataset.status === "CONFIRM"){
            wx.navigateTo({
                url : "/pages/checkOut/examine?status="+ e.currentTarget.dataset.status +"&checkId="+ e.currentTarget.dataset.checkid
            })
        }else{
            wx.navigateTo({
                url : "/pages/checkOut/examine?status="+ e.currentTarget.dataset.status +"&checkId="+ e.currentTarget.dataset.checkid
            })
        }
    }
})