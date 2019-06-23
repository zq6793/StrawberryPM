const utils        = require('../../utils/util.js');
const requestV4 = require('../../common/request_v4.js');
const request   = require('../../common/request.js');
const time      = utils.formatDate(new Date());
//获取应用实例
var app = getApp()
Page({
    data: {
    resident_id        : '',
    Topayinfo          : '',
    money              : '',
    begin_time         : "",
    begin_time_e       : "",
    end_time           : "",
    end_time_e         : "",
    show_pay_date      : "",
    out_trade_no       : "",
    images             : '',
    imgFiles           : [],
    showAddImg         : true,
    remarks            : '',
    costTypeIndex      : 0,
    addInfo            : new Object(),
    costType           : request.orderTypeSelect, //添加账单类型 
    checkId            : '',
    addMoney           : 0,
    },
    //事件处理函数
    onLoad(option) {
        wx.removeStorageSync('add_order_fee');
    },
    onShow(){
    },
    /*支付金额*/
    paymentblur(e){
        let that = this
        this.setData({
            addMoney   :   parseFloat(e.detail.value)
        })
    },
    paymentAmout(e){
        this.data.addInfo.money = parseFloat(e.detail.value);
    },
    
    filters(value){
        var reg = /(^\d+$)|(^\d+\.{1}\d{1})|(^\d+\.{1}\d{2}$)/;

        if (!reg.test(value)) {
            value = '';
            request.showToast('请保留2位小数');
            return;
        } else { 
            value = value;
        }
        return value; 
    },
    /*支付日期*/
    bindtbegintimeChange(e){
        this.setData({
            begin_time_e   : e.detail.value,
            begin_time     : e.detail.value+"T00:00:00+08:00",
        });
        this.data.addInfo.begin_time_e = e.detail.value;
        this.data.addInfo.begin_time   = e.detail.value+"T00:00:00+08:00";
    },
    /*支付日期*/
    bindendtimeChange(e){
        this.setData({
            end_time_e   : e.detail.value,
            end_time     : e.detail.value+"T00:00:00+08:00",
        });
        this.data.addInfo.end_time_e = e.detail.value;
        this.data.addInfo.end_time   = e.detail.value+"T00:00:00+08:00";
    },
    /*备注*/
    remarks(e){
        this.setData({
            remarks : e.detail.value
        });
    },
    /*取消*/
    goBack(){
        wx.navigateBack({
            data : 1
        });
    },
    /*选择费用类型*/
    costType(e){
        this.setData({
            costTypeIndex : e.detail.value
        });
        this.data.addInfo.types = this.data.costType[this.data.costTypeIndex].countryName;
        this.data.addInfo.type = this.data.costType[this.data.costTypeIndex].id;
    },
    /*确定*/
    confirm(){
        let that = this;
        if(!that.data.addInfo.money){
            request.showToast('请输交易金额');
            return;
        }
        if(!that.data.addInfo.type){
            request.showToast('请选择费用类型');
            return;
        }
        if(!that.data.addInfo.begin_time){
            request.showToast('请选择开始时间');
            return;
        }
        if(!that.data.addInfo.end_time){
            request.showToast('请选择结束时间');
            return;
        }
        let temp_data = []
        temp_data[0]= that.data.addInfo;
        wx.setStorageSync('add_order_fee', temp_data);
        wx.navigateBack({
            delta : 1
        })
    }
})