const request = require('../../common/request.js');
//获取应用实例
var app = getApp()
Page({
    data: {
        checkLength  : 0,
        isShowNumber : 'hide',
        info         : {}
    },
    onLoad(options) {
    
    },

    onShow(){
        let that  = this,
            statu = "";
        // base.srever({
        //     url     : "residentct/waittodo",
        // }, (resp) =>{
        //     that.setData({
        //         info : resp
        //     })
        // })
    
        // base.srever({
        //     url     : "residentct/waittodo",
        //     method  : "GET"
        // }, (resp) =>{
        //     if(resp.name != ''){
        //       that.setData({
        //         userName  : resp.name
        //       })
        //     }

        //     switch (resp.position){
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
        
        //     base.srever({
        //         loading : true,
        //         url     : 'checkout',
        //         method  : 'GET',
        //         data    : {
        //             status   : that.data.status 
        //         }
        //     },(res)=>{
        //         if(res.length === 0){
        //             that.setData({
        //                 isShowNumber : "hide"
        //             })
        //         }else{            
        //             that.setData({
        //                 checkLength  : res.length,
        //                 isShowNumber : "show"
        //             })
        //         }
        //     })
        // })
    }
})