const utils   = require('../../utils/util.js');
const requestV4 = require('../../common/request_v4.js');
const request = require('../../common/request.js');
const app     = getApp();
Page({
    data: {
        inputShowed    : false,
        doloading      : true,
        inputVal       : "",
        loadingState   : 'hide',
        footerState    : 'hide',
        perPage        : 15,
        total          : 0,
        totalPages     : 0,
        page           : 0,
        roomChange     : [],
        searchInfo     : [],
        showAddRoom    : false,
        store_id       : ""
    },
    onLoad (options) {
        let that = this,
            show_add_room;
        // /*app.globalData.isShow 为true时候可以使用*/
        if(app.globalData.isShow){
            show_add_room = true;
            wx.getStorage({
                key     : 'currentApartmentId',
                success : function (res) {
                    that.setData({
                        store_id : res.data,
                    });
                    that.requestData();
                },
            });
        }else{
            show_add_room = false;
        }

        this.setData({
            showAddRoom : show_add_room
        })
    },
    onShow(){
    },
    requestData(){
        let that = this;
        let para = {
            offset   : that.data.page ,
            limit    : that.data.perPage,
            store_id : that.data.store_id,
            group_status : 'DOING',
        };
        requestV4.listChangeroom(para).then(res=>{
            res.items.forEach((item) => {
                item.CreatedAt = request.goTime(item.CreatedAt)
            })
            let resData = res.items  
            that.setData({
                roomChange   : resData,
            });
            wx.stopPullDownRefresh();
            wx.hideNavigationBarLoading();
        }).catch(e=>{
            console.log(e)
        });
    },
    /*下拉刷新*/
    onPullDownRefresh () {
        this.setData({
            loadingState    : 'show',
            page            : 0,
            totalPages      : 0,
            total           : 0
        });

        this.requestData();
    },
    /*触底加载*/
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
            inputVal: e.detail.value
        });
        if (e.detail.value.length > 2){
            let para = {number : e.detail.value};
            request.changeList(para).then(res=>{
                that.setData({
                    searchInfo   : res,
                    loadingState : 'hide',
                    footerState  : 'hide'
                })
            }).catch(e=>{
                console.log(e)
            })
        }
    },
    nextPage(e){
        wx.navigateTo({
            url : "/pages/changeRoom/oldRoomInfo"
        })
    }
})
