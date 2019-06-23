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
        transfer_out    : '',
        transfer_in     : '',
        old_room_unpaid : '',
        new_room_unpaid : '',
    },
    onLoad (option) {
        let that = this,
        newChangroomInfo='';
        //判断信息来源的渠道
        that.setData({
            status     : option.status,
        })
        requestV4.getChangeRoom(option.id).then(res=>{
            newChangroomInfo  = res;
            requestV4.getResidentInfo(newChangroomInfo.new_resident_id).then(res=>{
                let resData = res
                resData.resident.begin_time = request.goTime(resData.resident.begin_time)
                that.setData({
                  newroomInfo : res,
                })
            })
            requestV4.getResidentInfo(newChangroomInfo.old_resident_id).then(res=>{
                let resData = res
                resData.resident.begin_time = request.goTime(resData.resident.begin_time)
                that.setData({
                  oldroomInfo : resData,
                })
            })
            /*调账转入*/
            requestV4.TransferOut(newChangroomInfo.old_resident_id).then(res=>{
                that.setData({
                  transfer_out : res,
                })
            })
            /*调账转出*/
            requestV4.TransferIn(newChangroomInfo.new_resident_id).then(res=>{
                that.setData({
                  transfer_in : res,
                })
            })
            /*旧房间应收*/
            requestV4.oldRoomUnpaid(newChangroomInfo.old_resident_id).then(res=>{
                that.setData({
                  old_room_unpaid : res,
                })
            })
            /*新房间应收*/
            requestV4.newRoomUnpaid(newChangroomInfo.new_resident_id).then(res=>{
                that.setData({
                  new_room_unpaid : res,
                })
            })
        }).catch(e=>{
            console.log(e)
        });
    },
    /*添加费用*/
    choosePay(){
        let that = this;
        console.log(that.data.costType);
        that.setData({
            isShow      : false,
            receivables : true,
        });
        that.data.addInfo.types = that.data.costType[that.data.costTypeIndex].countryName;
        that.data.addInfo.type = that.data.costType[that.data.costTypeIndex].id;
    },
    
    /*选择费用类型*/
    costType(e){
        this.setData({
            costTypeIndex : e.detail.value
        });
        this.data.addInfo.types = this.data.costType[this.data.costTypeIndex].countryName;
        this.data.addInfo.type = this.data.costType[this.data.costTypeIndex].id;
    },

    /*添加应收费用 费用金额*/
    costMoney(e){
        this.setData({
            costMoney : parseFloat(e.detail.value)
        });
        this.data.addInfo.money = parseFloat(costMoney.toFixed(2));
    },

    /*添加应收费用 其他备注*/
    otherRemarks(e){
        this.setData({
            otherRemarks : e.detail.value
        });
        this.data.addInfo.remark = e.detail.value;
    },

    /*确认添加应收费用*/
    confirmReceivables(e){
        let that = this;

        if(!that.data.addInfo.money){
            request.showToast('请输入费用金额!');
            return;
        }

        if(!that.data.otherRemarks){
           request.showToast('请输入备注信息!');
            return;
        }
        that.closeReceivables();
        that.setData({
            addReceivables : that.data.addReceivables.concat(that.data.addInfo)
        })

        that.totals(that.data.addInfo.money);
        that.setData({
            addInfo : {}
        })
    },

    /*添加应收费用之后 应收费用合计 应退金额 计算*/
    totals(money){
        let that        = this,
            total_money = that.data.totalReceivable,
            final_total = 0; //最终应收金额

        final_total = parseFloat(money) + parseFloat(that.data.totalReceivable);

        that.setData({
            totalReceivable : final_total.toFixed(2),
        });
    },

    /*取消添加应收费用*/
    cancel(e){
        let that = this;
        that.closeReceivables();
        that.setData({
            addReceivables : that.data.addReceivables.concat()
        })

    },

    /*关闭添加应收费用*/
    closeReceivables(){
        let that = this;
        that.setData({
            costMoney    : "",
            otherRemarks : "",
            isShow       : true,
            receivables  : false,
        })
    },

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
    /*确认办理入住*/
    checkChangroom(){
        let that          = this;
         let para = wx.getStorageSync('newChangroomInfo'); 
             para.add_fee = that.data.addReceivables;
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
