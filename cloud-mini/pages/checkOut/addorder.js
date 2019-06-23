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
    },
    //事件处理函数
    onLoad(option) {
        wx.removeStorageSync('add_order_fee');
    },
    onShow(){
    },
    /*支付金额*/
    paymentAmout(e){
        // this.setData({
        //     money : e.detail.value
        // });
        this.data.money = parseFloat(e.detail.value);
        this.data.addInfo.money = parseFloat((this.data.money).toFixed(2));
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

    /*删除验房图片*/
    deteleImage(e){
        let that       = this,
            images     = that.data.imgFiles,
            index      = e.currentTarget.dataset.imgindex,
            addPicture = true;

        request.deteleImage(images,index,res=>{
            if(res.length > 5){
                addPicture = false;
            }else{
                addPicture = true;
            }
            that.setData({
                imgFiles   : res,
                showAddImg : addPicture
            });
      });
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
    /*添加费用*/
    // choosePay(){
    //     let that = this;
    //     that.setData({
    //         isShow      : false,
    //         receivables : true
    //     });
    //     that.data.addInfo.types = that.data.costType[that.data.costTypeIndex].countryName;
    //     that.data.addInfo.type = that.data.costType[that.data.costTypeIndex].id;
    // },

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
        console.log(that.data.addInfo)
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
        let temp_data = [];
            temp_data[0]= that.data.addInfo;
        wx.setStorageSync('add_order_fee', temp_data);
        wx.navigateBack({
            delta : 1
        })
        // wx.navigateTo({
        //    url : '/pages/checkOut/examine?checkId='+this.data.checkId,
        // })

    }
})