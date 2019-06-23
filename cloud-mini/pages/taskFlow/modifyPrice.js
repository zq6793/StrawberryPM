const request = require('../../common/request.js');
const requestV4 = require('../../common/request_v4.js');
//获取应用实例
var app = getApp()
Page({
    data: {
        taskflow     : {},
        nameInfo     : {},
        taskflow_id  : '',
        status       : '',
        remark       : '',   
        name         : '',
        subletInfo: {},
        resident: {},
        receivables: {},
        receivables_total: 0,
        depositables: {},
        depositables_total: 0,
        paidFee: {},
        paidFee_total: 0,
        refund_money: 0,
        income_money: 0,
        loss_money: 0,
        showItems: '',
        nextApproval : ''
    },

    //事件处理函数
    onLoad(options) {
        this.setData({
            taskflow_id : options.id,
            name        : options.name
       });
    },

    onShow(){
        this.getFlow();
    },

    getFlow() {
        let that = this,
            para = { taskflow_id: that.data.taskflow_id };
            console.log(para)
            requestV4.getTaskView( para.taskflow_id ).then(res=>{
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
                    showItem = showItem.substring(0, showItem.length - 1)
                }
                showItem = showItem.substring(0, showItem.length - 1)
                let taskflowInfo = res.taskflow
                taskflowInfo.CreatedAt = request.goTime(taskflowInfo.CreatedAt)
                that.setData({
                    subletInfo: res.task_detail,
                    taskflow: taskflow_records,
                    participant: res.participant,
                    current_step: current_step,
                    showItems: showItem,
                    taskflow_status: res.taskflow.status,
                    taskflowInfo: taskflowInfo,
                })
                requestV4.priceDetailByTaskflow(para.taskflow_id).then(res2 => {
                    console.log(res2)
                    res2.UpdatedAt = request.goTime(res2.UpdatedAt)
                    let nameInfo = res2;
                    that.setData({
                        nameInfo: nameInfo,
                    })
                }).catch(e => {
                    console.log(e)
                })
        }).catch(e=>{
            console.log(e);
        });
    },
    
    /*不通过*/
    getText(e) {
      this.setData({
        remark : e.detail.value
       });
    },

    goBack(){
        let that = this,
            para = { taskflow_id: parseInt(that.data.taskflow_id), remark: that.data.remark, status: 'UNAPPROVED'};
        if(!that.data.remark){
            request.showToast('请输入意见');
            return;
        }
        wx.showModal({
            content    : '驳回会终止审批流程，请谨慎操作',
            success: function (resp) {
                if (resp.confirm) {
                    requestV4.UpdateTask(that.data.taskflow_id, para).then(res=>{
                        wx.navigateBack({
                            data : 1
                        })
                    }).catch(e=>{
                        console.log(e);
                    });             
                }
            }
        });
    },

    /*通过*/
    confirm(){
        let that = this,
            para = { taskflow_id: parseInt(that.data.taskflow_id), remark: that.data.remark, status: 'APPROVED'};
        if(!that.data.remark){
            request.showWarning("请输入意见");
            return;
        }

        wx.showModal({
            content    : '通过继续审批流程，请谨慎操作',
            success: function (resp) {
                if (resp.confirm) {
                    requestV4.UpdateTask(that.data.taskflow_id, para).then(res=>{
                        wx.navigateBack({
                            data : 1
                        })
                    }).catch(e=>{
                        console.log(e);
                    });
                }
            }
        });
    }
})