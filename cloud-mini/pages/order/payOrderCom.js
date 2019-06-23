const request = require('../../common/request.js');
//获取应用实例
var app = getApp()
Page({
    data: {
   		roomId     : '',
   		ids        : [],
   		pay        : [],
   		user       : {},
   		total      : 0,
   		userId     : ''
    },
    //事件处理函数
    onLoad(option) {
      	this.setData({
      		roomId : option.id,
            userId : option.resident
      	})
    },
    onShow(){
    	let that  = this,
            total = 0,
            id_s  = [],
            para  = { resident_id : that.data.userId, room_id : that.data.roomId, status : 'CONFIRM'};

        request.contractAward(para).then(res=>{
            for(var key in res.orders){
                total += parseFloat(res.orders[key].paid);
                res.orders[key].type = request.orderType(res.orders[key].type);
                id_s.push(res.orders[key].id);
            }
            that.setData({
                total  : total.toFixed(2),
                ids    : id_s,
                user   : res.resident,
                pay    : res.orders
            })
        }).catch(e=>{
            console.log(e);
        });
    },

    /*拨打电话*/
    calling(e){
        let phone   = e.currentTarget.dataset.phone;

        wx.makePhoneCall({
            phoneNumber : phone
        });
    },

    moneyBtn(){
    	let that = this.data,
            para = { room_id : that.roomId, resident_id : that.userId, order_ids : that.ids};

        request.signAContrac(para).then(res=>{
            request.showToast('您已确认成功！');
            setTimeout(function(){
                wx.switchTab({
                    url: '/pages/index/index'
                })
            },3000)
        }).catch(e=>{
            console.log(e)
        });
    }
})
