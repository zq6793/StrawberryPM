const request = require('../../common/request.js');
//获取应用实例
var app = getApp()
Page({
    data: {
        todo         : [],
        pagestate    : 'hide',
        loadingState : 'hide',
        footerState  : 'hide',
        doloading    : true,
        page         : 1,
        status       : ""
    },
    onLoad() {
    
    },

    onShow(){
        var that  = this;
        var statu = "";
        // base.srever({
        //     url     : "employees/profile",
        //     method  : "GET"
        // }, (res) =>{
        //     if(res.name != ''){
        //       that.setData({
        //         userName  : res.name
        //       })
        //     }

        //     switch (res.position){
        //         case "MANAGER":
        //             statu = "BY_MANAGER";
        //             break;
        //         case "BY_MANAGER":
        //             statu = "MANAGER_APPROVED";
        //             break;
        //         case "MANAGER_APPROVED":
        //             statu = "PRINCIPAL_APPROVED";
        //             break;
        //     }

        //     that.setData({
        //         status : statu
        //     })
            
        //     // base.srever({
        //     //     loading : true,
        //     //     url     : 'checkout',
        //     //     method  : 'GET',
        //     //     data    : {
        //     //         per_page : 7,
        //     //         page     : 1,
        //     //         status   : that.data.status 
        //     //     }
        //     // },(res)=>{
        //     //     that.setData({
        //     //         todo      : res,
        //     //         pagestate : 'show'
        //     //     })
        //     //     that.data.page++;
        //     // })
        // })
    },

    onPullDownRefresh(){
        var that = this;
        that.setData({
          loadingState : 'show'
        });
        // base.srever({
        //     url     : 'checkout',
        //     method  : "GET",
        //     data    : {
        //         per_page : 7,
        //         page     : that.data.page,
        //         status   : that.data.status 
        //     }
        // },(res)=>{
        //     that.data.page++;
        //     var sum = that.data.todo.length;
        //     var num = res.data.length;
        //     if(num == 0){
        //         that.setData({
        //             doloading:  false
        //         });
        //     }else{
        //         that.setData({
        //             doloading:  true
        //         });
        //     }
        //     for(var i = 0; i<num; i++){
        //         that.data.todo[sum+i]=res.data[i];
        //     }
        //     that.setData({
        //         todo        : that.data.todo,
        //         pagestate   : 'show',
        //         page        : that.data.page,
        //         loadingState: 'hide',
        //         footerState : 'show'
        //     });
        //     wx.hideNavigationBarLoading();    //完成停止加载
        //     wx.stopPullDownRefresh() ;        //停止下拉刷新
        // })
    },

    scroll(e){
        var that = this;
        if(e.detail.scrollTop <10 && that.data.doloading) {
            that.data.doloading = false;
            this.setData({
                doloading  :false
            });
        this.onPullDownRefresh();
        }
    },


    examine(e){
        var checkid = e.currentTarget.dataset.checkid,
            status  = e.currentTarget.dataset.status;
        wx.navigateTo({
            url : "/pages/checkOut/checkoutExamine?id=" + checkid +"&status=" + status
        })
    }
})
