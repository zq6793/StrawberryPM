const utils   = require('../../utils/util.js');
const time    = utils.formatDate(new Date());
const request = require('../../common/request.js');

Page({
    data: {
        name                : '',
        phone               : '',
        time                : time,
        money               : '',
        roomNumber          : '',
        lastRoomNumber      : '',
        roomId              : '',
        remark              : '',
        serviceTypeIndex    : 0,
        serviceTypes        : [
            { type : 'CLEAN', name : '清洁' },
            { type : 'REPAIR', name : '维修' },
        ],
        repairContentIndex  : [0, 0],
        repairContentArray  : [
            [
                { index : 0, value : '选择位置' },
                { index : 1, value : '厨房' },
                { index : 2, value : '卫生间' },
                { index : 3, value : '主卧' },
                { index : 4, value : '阳台' },
                { index : 5, value : '客厅' }
            ],
            [
                { index : 0, value : '选择类别' },
                { index : 1, value : '电器' },
                { index : 2, value : '家具' },
                { index : 3, value : '灯具' },
                { index : 4, value : '墙面脱落' },
                { index : 5, value : '防水' },
                { index : 6, value : '跳闸' },
                { index : 7, value : '脚踏阀' },
                { index : 8, value : '层板' },
                { index : 9, value : '晾衣绳' },
                { index : 10, value : '门窗' }
            ],
        ],
    },

    /**
     * 选择服务内容
     */
    changRepairContent (e) {
        this.setData({
            repairContentIndex : e.detail.value,
        });
    },


    /**
     * 输入房间号码
     */
    inputRoomNumber (e) {
        this.setData({
            roomNumber  : e.detail.value,
        });
    },


    /**
     * 搜索房间信息
     */
    searchRoom (e) {
        let that    = this;

        if (that.data.roomNumber.length == 0 || that.data.roomNumber == that.data.lastRoomNumber) {
            return false;
        }

        that.setData({
            lastRoomNumber : e.detail.value,
        });

        let para = { room_number : that.data.roomNumber, status : "RENT"};
        request.getRoomStauts(para).then(res=>{
            if (!res.resident) {
                wx.showModal({
                    content    : '未检索到住户信息, 请核实后重试',
                    showCancel : false,
                });
            } else {        
                that.setData({
                    roomId  : res.room_id,
                    name    : res.resident.name,
                    phone   : res.resident.phone,
                });
            }
        }).catch(e=>{
            console.log(e);
        });
    },


    /**
     * 确认服务时间
     */
    bindTimeChange(e) {
        this.setData({
            time: e.detail.value
        });
    },


    /**
     * 选择服务类型
     */
    changeServiceType (e) {
        this.setData({
            serviceTypeIndex : e.detail.value,
        });
    },


    /**
     * 输入客户姓名
     */
    inputPhone (e) {
        this.setData({
            name : e.detail.value,
        });
    },


    /**
     * 输入客户电话
     */
    inputPhone (e) {
        this.setData({
            phone : e.detail.value,
        });
    },


    /**
     * 服务费用
     */
    inputMoney (e) {
        this.setData({
            money : e.detail.value,
        });
    },


    /**
     * 填写备注
     */
    inputRemark (e) {
        this.setData({
            remark : e.detail.value,
        });
    },


    /**
     * 发送订单
     */
    sendOrder () {
        let that    = this,
            data    = that.data;

        if (!data.roomId) {
            request.showToast('请输入需要服务房间号');
            return false;
        }

        if (!data.name) {
            request.showToast('请输入姓名');
            return false;
        }

        if (!data.phone) {
            request.showToast('请输入手机号码');
            return false;
        }

        if (!data.time) {
            request.showToast('请选择服务时间');
            return false;
        }

        let requestData = {
            room_id   : data.roomId,
            number    : data.roomNumber,  
            time      : data.time,
            name      : data.name,
            phone     : data.phone,
            type      : data.serviceTypes[data.serviceTypeIndex].type,
            money     : data.money ? data.money : 0,
            remark    : data.remark ? data.remark : '',
            addr_from : data.repairContentArray[0][data.repairContentIndex[0]].value,
            addr_to   : data.repairContentArray[1][data.repairContentIndex[1]].value
        };

        wx.showModal({
            content: '信息提交成功！',
            showCancel: false,
            success: function (res) {
                request.serverCreate(para).then(res=>{
                    wx.navigateBack({
                        delta: 1
                    })
                }).catch(e=>{
                    console.log(e);
                });
            }
        });
    },
});
