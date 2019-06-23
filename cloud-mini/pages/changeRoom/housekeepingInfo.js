const utils   = require('../../utils/util.js');
const time    = utils.formatDate(new Date());
const request = require('../../common/request.js');
const requestV4 = require('../../common/request_v4.js');
Page({
    data : {
        status          : "", //状态
        newroomInfo     : {}, //确认换房信息
        oldroomInfo     : {}, //之前房间的信息
        chagne_id       : '',
        isShow          : true,
        isShowBtn       : true,
        charge_order_old : '',
        charge_order_new : '',
        spend_order_old  : '',
        spend_order_new  : '',
        charge_old_money : '',
        charge_new_money : '',
        spend_old_money : '',
        add_order_fee   :[],
 
    },
    onLoad (option) {
        let that = this,
        newChangroomInfo='';
        //判断信息来源的渠道 
        newChangroomInfo = wx.getStorageSync('newChangroomInfo'); 
        that.setData({
            newroomInfo      : newChangroomInfo.new_room,
            oldroomInfo      : newChangroomInfo.old_room
        })
        requestV4.changeRoomCheckBill(newChangroomInfo).then(res=>{
        let charge_order_old  = res.old_input_order,
            charge_order_new  = res.new_input_order,
            spend_order_old   = res.old_adjust_order,
            spend_order_new   = res.new_adjust_order,
            spend_money       = 0,
            add_money       = 0,
            lod_money       = 0;

            // 新房间的支付
            for(var key in spend_order_old){
                spend_money += parseFloat(spend_order_old[key].money);
            }
            // 新房间的支付
            for(var key in charge_order_new){
                add_money += parseFloat(charge_order_new[key].money);
            }
            // 旧房间待支付信息
            for(var key in charge_order_old){
                lod_money += parseFloat(charge_order_old[key].money);
            }
            that.setData({
                charge_order_new : charge_order_new,
                charge_order_old : charge_order_old,
                spend_order_old  : spend_order_old,
                spend_order_new  : spend_order_new,
                charge_old_money : lod_money.toFixed(2),
                charge_new_money : add_money.toFixed(2),
                spend_old_money  : spend_money.toFixed(2),
            })
        }).catch(e=>{
            console.log(e)
        });
        wx.removeStorageSync('add_order_fee');
    },
    onShow() {
        let that = this,
        addReceivables = wx.getStorageSync('add_order_fee'),
        add_order_fee  = that.data.add_order_fee;
        if(addReceivables){
            if(add_order_fee.length>=1){
                add_order_fee[add_order_fee.length] = addReceivables[0];
            }else{
                add_order_fee = addReceivables;
            }
        }
        // 技术
        that.setData({
            add_order_fee   : add_order_fee
        })
        that.totals()
        wx.removeStorageSync('add_order_fee');
    },
    deteleOrder(e){
        let data = new Object(),that = this;
        wx.removeStorageSync('add_order_fee');
        let new_order = that.data.add_order_fee
        new_order.splice(e.currentTarget.dataset.index,1);
        that.setData({
          add_order_fee   : new_order
        })
        that.totals()
    },
    /*添加费用*/
    choosePay(){
        wx.navigateTo({
          url : '/pages/changeRoom/addorder',
        });
    },

    /*添加应收费用之后 应收费用合计 应退金额 计算*/
    totals(){
        let that        = this,
            temp_money  = 0,
            new_orders =  that.data.charge_order_old,
            add_orders =  that.data.add_order_fee;
        for(var key in new_orders){
            temp_money += parseFloat(new_orders[key].money);
        }
        for(var key in add_orders){
            temp_money += parseFloat(add_orders[key].money);
        }
        that.setData({
            charge_old_money : temp_money.toFixed(2),
        });
    },
    /*取消办理入住*/
    goback(){
        let that = this,
            para = {change_id : that.data.chagne_id};
        request.destroyChange(para).then(res=>{
            wx.switchTab({
                url: '/pages/index/index'
            })
        }).catch(e=>{
            console.log(e);
        });
    },
    /*确认办理入住*/
    checkChangroom(){
        let that          = this;
        let para = wx.getStorageSync('newChangroomInfo'); 
        console.log(that.data.add_order_fee)
        if(that.data.add_order_fee){
          para.add_fee = that.data.add_order_fee;
        }
        requestV4.confirmChange(para).then(res=>{
          wx.switchTab({
            url: '/pages/index/index'
          })
        }).catch(e=>{
            console.log(e)
        });
    },
    /*关闭二维码*/
});
