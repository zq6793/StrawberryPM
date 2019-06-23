const utils   = require('../../utils/util.js');
const time    = utils.formatDate(new Date());
const request = require('../../common/request.js');
const requestV4 = require('../../common/request_v4.js');
Page({
    data : {
        status          : "", //状态
        resident        : {}, //之前房间的信息
        transform_rent  : {}, //转租信息
        receivablesList : [], //应收费用
        totalReceivable : 0, //应收总费用
        otherRemarks    : '', //添加应收费用 其他备注
        addInfo         : {},
        addReceivables  : [], //添加应收费用列表
        costTypeIndex   : 0,
        costType        : request.orderTypeSelect,
        addCostData     : time,
        costMoney       : '', //添加费用备注
        paidFee         : [], //已缴费用
        totalpaidFee    : '', //已缴总费用
        receivables     : false, //添加应收费用
        isShow          : true,
        codeUrl         : "", //二维码地址
        isShowCode      : false, //是否显示二维码
        colseCode       : '', //二维码地址
        isShowBtn       : true,
        isShowOrder     : false,
    },
    onLoad (option) {
      let that = this;
      //判断信息来源的渠道
      that.setData({
        status     : option.status,
      })
      requestV4.SubletInfo(option.id).then(res=>{
        // 获取换房原房间信息
        // 获取退租信息
        let temp_totalReceivable = 0;
        let temp_totalpaidFee = 0;
        for (let i = 0; i < res.input_order.length; i++) {
           temp_totalReceivable = temp_totalReceivable + res.input_order[i].money
        }
        for (let i = 0; i < res.output_order.length; i++) {
           temp_totalpaidFee = temp_totalpaidFee + res.output_order[i].money
        }
        let refundComputed = temp_totalpaidFee - temp_totalReceivable;
        res.transform_rent.transform_time_e = res.transform_rent.transform_time_e.substr(0,10)
        that.setData({
          transform_rent  : res.transform_rent,
          receivablesList : res.input_order,
          totalReceivable : temp_totalReceivable.toFixed(2),
          paidFee         : res.output_order,
          totalpaidFee    : temp_totalpaidFee,
          refundAmount    : refundComputed.toFixed(2),
        })
        //获取住户信息
        requestV4.getResidentInfo(res.transform_rent.old_resident_id).then(res2=>{
            res2.resident.begin_time = res2.resident.begin_time.substr(0,10)
            res2.resident.end_time = res2.resident.end_time.substr(0,10)
            that.setData({
              resident        : res2,
            })
        }).catch(e=>{
            console.log(e)
        })

    }).catch(e=>{
        console.log(e)
    });
},
/*添加费用*/
choosePay(){
    let that = this;
    that.setData({
        isShow      : false,
        receivables : true,
    });
    that.data.addInfo.types = that.data.costType[that.data.costTypeIndex].countryName;
    that.data.addInfo.type = that.data.costType[that.data.costTypeIndex].id;
},
/*添加应收费用之后 应收费用合计 应退金额 计算*/
/*删除新添加的应收费用*/
deteleOrder(e){
    let that    = this,
        num     = e.currentTarget.dataset.index,
        list    = that.data.addReceivables,
        money   = e.currentTarget.dataset.money,
        total   = that.data.totalReceivable,
        final   = 0; //总的应收金额

    list.splice(num,1);

    final = parseFloat(total - money);

    that.setData({
        addReceivables  : list,
        totalReceivable : final.toFixed(2)
    })
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
/*推送缴费提醒*/
paymentReminder(){
    let that = this;
    let requestDatas = {
        resident_id : that.data.resident.resident.ID,
    };
    request.sendBillnotice(requestDatas).then(res=>{
        request.showToast('已推送成功');
    }).catch(e=>{
        console.log(e);
    });
},
/*驳回 返回*/
rejectGoback(){
    wx.navigateBack({
        data : 1
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
/*确认办理入住*/
/*驳回 提交审核*/
rejectSubmit(){
        let that          = this;
        wx.showModal({
            content     : '确认提交审核',
            showCancel  : true,
            success: function () {
                requestV4.subletApproval(that.data.transform_rent.ID).then(res=>{
                    request.showToast('提交成功');
                    wx.switchTab({
                       url : '/pages/index/index',
                    });
                }).catch(e=>{
                    console.log(e);
                });
            }
        });
    },
    /*关闭二维码*/
});
