const request   = require('../../common/request.js');
const requestV4 = require('../../common/request_v4.js');
//获取应用实例
var app = getApp()
Page({
data: {
    subletInfo        : {},
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
    showItems           : '',
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
        // res.task_detail.refund_time_e = res.task_detail.refund_time_e.substr(0,10)
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
        showItem = showItem.substring(0,showItem.length-1)
        let taskflowInfo = res.taskflow
        taskflowInfo.CreatedAt = request.goTime(taskflowInfo.CreatedAt)
        that.setData({
          subletInfo : res.task_detail,
          taskflow: taskflow_records,
          participant: res.participant,
          current_step: current_step,
          showItems: showItem,
          taskflow_status: res.taskflow.status,
          taskflowInfo: taskflowInfo,
        })
        // 获取换房原房间信息
        requestV4.SubletInfo(res.taskflow.data_id).then(res=>{
            // 获取退租信息
            console.log(res)
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
