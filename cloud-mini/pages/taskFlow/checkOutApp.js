const request   = require('../../common/request.js');
const requestV4 = require('../../common/request_v4.js');
//获取应用实例
var app = getApp()
Page({
data: {
    checkOutInfo        : {},
    resident            : {},
    taskflow_id         : '',
    name                : '',
    receivables         : {},
    receivables_total   : 0,
    depositables        : {},
    depositables_total  : 0,
    paidFee             : {},
    paidFee_total       : 0,
    refund_money        : 0,
    income_money        : 0,
    loss_money          : 0,
    taskflow            : {},
    ex_refund           : {},    // 额外退款
    ex_refund_total     : 0,     // 额外退款合计
    real_refund_money   : 0,     // 合计退款金额 实际退款
    add_exorder_fee     : [],
    taskflow_status     : '',    // 审批流整体状态

},
//事件处理函数
onLoad(options) {
    let that = this;
    that.setData({
        taskflow_id : options.id,
        name        : options.name
    });
    requestV4.getTaskView(options.id).then(res=>{
        // 退房信息
        res.task_detail.refund_time_e = request.goTime(res.task_detail.refund_time_e)
        res.task_detail.CreatedAt = request.goTime(res.task_detail.CreatedAt)
        res.task_detail.check_time = request.goTime(res.task_detail.check_time)
        let taskflow_records = res.taskflow_records
        taskflow_records.forEach(item => {
            item.CreatedAt = request.goTime(item.CreatedAt)
        })
        let current_step = res.current_step
        let showItem = ''
        if (current_step != null) {
            current_step.positions.forEach(item => {
                showItem += item.name + '/'
            })
            showItem = showItem.substring(0,showItem.length-1)
        }
        that.setData({
            checkOutInfo : res.task_detail,
            taskflow     : taskflow_records,
            current_step : current_step,
            showItems    : showItem,
            taskflow_status: res.taskflow.status
        })
        // 住户信息
        requestV4.getResidentInfo(res.task_detail.resident_id).then(res=>{
            res.resident.begin_time = res.resident.begin_time.substr(0,10)
            res.resident.end_time = res.resident.end_time.substr(0,10)
                that.setData({
                    resident   : res,
                })
            }).catch(e=>{
                console.log(e);
            });
        // 退房账单信息
        let data = new Object();
        requestV4.checkoutOrder(res.task_detail.ID,data).then(res=>{
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
                ex_refund_total     : res.add_refund_money,
                real_refund_money   : res.real_refund_money,
            })
        }).catch(e =>{
            console.log(e)
        });
    }).catch(e=>{
        console.log(e);
    });
},

onShow(){
    
},
showImg(e){
    wx.previewImage({
        current  : e.currentTarget.dataset.imgsrc, // 当前显示图片的http链接
        urls     : [e.currentTarget.dataset.imgsrc], // 需要预览的图片http链接列表
    })
},
/*查看退租单PDF*/
lookPDF(){
    let url = this.data.signature_url;
    wx.downloadFile({
        url : url,
        success: function(res) {
            const filePath = res.tempFilePath
            wx.openDocument({
                filePath: filePath,
                success: function(res) {
                    console.log('打开文档成功')
                }
            })
        }
    })
},

/*不通过*/
getText(e) {
    this.setData({
        remark : e.detail.value
    });
},

goBack(){
    let that = this,
        para = { taskflow_id : parseInt(that.data.taskflow_id), remark : that.data.remark, status : 'UNAPPROVED'};
    if(!that.data.remark){
        request.showToast('请输入意见');
        return;
    }
    wx.showModal({
        content    : '该操作会驳回审批，请谨慎操作',
        success: function (resp) {
            if (resp.confirm) {
             requestV4.UpdateTask(that.data.taskflow_id,para).then(res=>{
                    wx.navigateBack({
                        data : 1
                    })
                }).catch(e=>{
                    console.log(e)
                });
            }
        }
    });
},
/*通过*/
confirm(){
    let that = this,
        para = { taskflow_id : parseInt(that.data.taskflow_id), remark : that.data.remark, status: 'APPROVED'};
    if(!that.data.remark){
        request.showToast('请输入意见');
        return;
    }
    wx.showModal({
        content    : '通过继续审批流程，请谨慎操作',
        success: function (resp) {
            if (resp.confirm) {
                requestV4.UpdateTask(that.data.taskflow_id,para).then(res=>{
                    request.showToast('已通过成功');
                    wx.navigateBack({
                        data : 1
                    })
                }).catch(e=>{
                    console.log(e)
                });
            }
        }
    });  
}
})