const utils   = require('../../utils/util.js');
const time    = utils.formatDate(new Date());
const request = require('../../common/request.js');
const requestV4   = require('../../common/request_v4.js');
Page({
data : {
    receivables           : {},  //应收
    receivables_total     : 0,  //应收合计
    depositables          : {},  //押金
    depositables_total    : 0,  //押金合计
    paidFee               : {},  //已交费用
    paidFee_total         : 0,  //已交费用合计
    refund_money          : 0,  //应退金额
    income_money          : 0,  //退房收入
    loss_money            : 0,  //退房损失
    ex_refund_total       : 0,  //额外退款
    real_refund_money     : 0,  //合计退款金额 实际退款
    isShowBtn             : true,
    bankImg               : [],      //银行卡照片
    cardImg               : [],      //身份证照片
    status                : '',
    isShowInfo            : false,
    checkOutInfo          : [],      // 退租信息
    checkOutOrder         : [],      // 退租账单信息
    resident              : [],      // 获取住户信息
    imgRentSlip           : [],      //线下签字图片
    checkId               : '',
    add_order_fee         : [],
    add_exorder_fee       : [],
    addReceivables        : [],
    after_confirm_add_exorder_fee : [],  // 验房后再次添加额外退费
},
onLoad (options) {
let that   = this;
//   获取账单信息
//   账单计算
//   退房账单
let data = new Object();
wx.removeStorageSync('add_order_fee');
wx.removeStorageSync('add_exorder_fee');
requestV4.checkoutOrder(options.checkId,data).then(res=>{
   that.setData({
        receivables         : res.input_order,
        receivables_total   : res.input_money,
        depositables        : res.deposit_order,
        depositables_total  : res.deposit_money,
        paidFee             : res.output_order,
        paidFee_total       : res.output_money,
        refund_money        : res.refund_money,
        income_money        : res.income_money,
        loss_money          : res.loss_money,
        add_exorder_fee     : res.add_refund_order,
        after_confirm_add_exorder_fee : [],   // 验房后再次添加额外退费
        ex_refund_total     : res.add_refund_money,
        real_refund_money   : res.real_refund_money,
    })
}).catch(e =>{
    console.log(e)
});
// 退房单
requestV4.checkoutDetail(options.checkId).then(res=>{
res.refund_time_e = res.refund_time_e.substr(0,10)
that.setData({
    checkOutInfo   : res,
    checkId        : options.checkId,
})
// 获取住户信息
requestV4.getResidentInfo(res.resident_id).then(res=>{
    res.resident.begin_time = res.resident.begin_time.substr(0,10)
    res.resident.end_time = res.resident.end_time.substr(0,10)
    that.setData({
        resident   : res,
     })
    }).catch(e=>{
      console.log(e);
    });
  }).catch(e =>{
      console.log(e)
});
},
onShow(){
    let that = this,
        addReceivables = wx.getStorageSync('add_order_fee'),
        exorder = wx.getStorageSync('add_exorder_fee'),
        add_order_fee  = that.data.add_order_fee,
        after_confirm_add_exorder_fee  = that.data.after_confirm_add_exorder_fee;
    if(addReceivables||exorder){
        if(addReceivables){
            if(add_order_fee.length>=1){
                add_order_fee[add_order_fee.length] = addReceivables[0];
            }else{
                add_order_fee = addReceivables;
            }
        }
        if(exorder){
            after_confirm_add_exorder_fee = exorder;
        }
        that.setData({
            add_order_fee   : add_order_fee,
            after_confirm_add_exorder_fee : after_confirm_add_exorder_fee,
        })
        let paraData = {}
        if(add_order_fee){
            paraData.add_orders = add_order_fee;
        }
        if(after_confirm_add_exorder_fee){
            paraData.add_refunds = after_confirm_add_exorder_fee;
        }
        requestV4.checkoutOrder(that.data.checkId,paraData).then(res=>{
            that.setData({
                receivables_total   : res.input_money,
                income_money        : res.income_money,
                refund_money        : res.refund_money,
                loss_money          : res.loss_money,
                paidFee_total       : res.output_money,
                ex_refund_total     : res.add_refund_money,
                real_refund_money   : res.real_refund_money,
            })
        }).catch(e =>{
            console.log(e)
        });
        wx.removeStorageSync('add_order_fee');
        wx.removeStorageSync('add_exorder_fee');
    }
},
deteleOrder(e){
        let data = new Object(),that = this;
        wx.removeStorageSync('add_order_fee');
        let new_order = that.data.add_order_fee;
        new_order.splice(e.currentTarget.dataset.index,1);
        that.setData({
        add_order_fee   : new_order
        })
        if(that.data.after_confirm_add_exorder_fee){
            data.add_refunds = that.data.after_confirm_add_exorder_fee;
        }
        if(that.data.add_order_fee){
            data.add_orders = that.data.add_order_fee;
        }
        requestV4.checkoutOrder(that.data.checkId,data).then(res=>{
        that.setData({
            receivables_total   : res.input_money,
            income_money        : res.income_money,
            refund_money        : res.refund_money,
            loss_money          : res.loss_money,
            paidFee_total       : res.output_money,
            ex_refund_total     : res.add_refund_money,
            real_refund_money   : res.real_refund_money,
        })
        }).catch(e =>{
        console.log(e)
        });
},
deteleExOrder(e){
        let data = new Object(),that = this;
        wx.removeStorageSync('add_exorder_fee');
        let new_order = that.data.after_confirm_add_exorder_fee;
        new_order.splice(e.currentTarget.dataset.index,1);
        console.log(new_order);
        console.log("aa");
        that.setData({
            after_confirm_add_exorder_fee   : new_order
        })
        if(that.data.add_order_fee){
            data.add_orders = that.data.add_order_fee;
        }
        if(that.data.after_confirm_add_exorder_fee){
            data.add_refunds = that.data.after_confirm_add_exorder_fee;
        }
        requestV4.checkoutOrder(that.data.checkId,data).then(res=>{
            that.setData({
                receivables_total   : res.input_money,
                income_money        : res.income_money,
                refund_money        : res.refund_money,
                loss_money          : res.loss_money,
                paidFee_total       : res.output_money,
                ex_refund_total     : res.add_refund_money,
                real_refund_money   : res.real_refund_money,
            })
        }).catch(e =>{
        console.log(e)
      });

},
/*预览身份证正反面图片*/
showImg(e){
    // console.log(e);
    wx.previewImage({
        current : e.currentTarget.dataset.imgsrc, // 当前显示图片的http链接
        urls : [e.currentTarget.dataset.imgsrc], // 需要预览的图片http链接列表
    })
},
/*提交数据*/
requestData(type){

},
/*添加费用*/
choosePay(){
    wx.navigateTo({
        url : '/pages/checkOut/addorder?checkId='+this.data.checkId,
    });
},
addExtraRefund(){
     wx.navigateTo({
        url : '/pages/checkOut/exorder?checkId='+this.data.checkId,
    });
},
/*提交审核*/
submit(){
    // 提交审核
    let data = new Object(), that = this;
    data.add_orders = that.data.add_order_fee;
    data.add_refunds = that.data.after_confirm_add_exorder_fee;
    requestV4.checkoutApproval(this.data.checkId,data).then(res=>{
        wx.switchTab({
            url : '/pages/index/index',
        });
    }).catch(e =>{
        console.log(e)
    });
},
/*驳回 返回*/
rejectGoback(){
    wx.navigateBack({
        data : 1
    });
},
/*推送缴费提醒*/
paymentReminder(){
    let that = this;
    let requestDatas = {
        resident_id : that.data.resident.resident.ID,
    };
    request.sendBillnotice(requestDatas).then(res=>{
        request.showToast('已推送成功');
        wx.navigateTo({
            url : '/pages/checkOut/checkOut',
        });

        }).catch(e=>{
            console.log(e);
    });
}
});
