const request = require('../../common/request.js'); 

Page({
    data: {
        residentInfo  : '',
        residentArray : [],
        searchInfo    : [],
        inputVal      : "",
        inputShowed   : false,
        pagestate     : 'hide',
        doloading     : false,
        loadingState  : 'hide',
        footerState   : 'hide',
        page          : 0,
        doloading     : false,
        totalPages    : 0,
        total         : 0,
        perPage       : 15,
    },

    onLoad () {
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

    onShow() {
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

        let para = { status : 'NORMAL', per_page : that.data.perPage, page : that.data.page + 1};
        request.householdList(para).then(res=>{
            that.setData({
                page          : parseInt(res.current_page),
                totalPages    : res.total_pages,
                total         : res.total,
                residentArray : that.data.residentArray.concat(res.data),
                doloading     : false,
                pagestate     : 'show',
                footerState   : res.current_page >= res.total_pages ? 'show' : 'hide',
                loadingState  : 'hide'
            });

            wx.stopPullDownRefresh();
            wx.hideNavigationBarLoading();
        }).catch(e=>{
            console.log(e);
        });
    },

    showInput() {
        this.setData({
            inputShowed : true
        });
    },

    inputTyping(e) {
        var that = this;
        that.setData({
            inputVal    : e.detail.value,
            footerState : 'hide'
        });

        if (e.detail.value.length >2){

            let para = { status : 'NORMAL', number : e.detail.value};
            request.searchResident(para).then(res=>{
                that.setData({
                    searchInfo: res.data,
                })
            }).catch(e=>{
                console.log(e);
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
          inputVal: ""
        });
    },

    find(){
        wx.navigateTo({
           url: '/pages/residentCenter/residentInformation',
        })
    },

    /**
     * 下拉刷新
     */
    onPullDownRefresh () {
        this.setData({
            loadingState    : 'show',
            residentArray   : [],
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
    }
})