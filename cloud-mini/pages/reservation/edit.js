const utils   = require('../../utils/util.js');
const time    = utils.formatDate(new Date());
const request = require('../../common/request.js');
Page({
    data: {
        id              : 0,
        userName        : '',
        time            : time,
        phone           : '',
        remark          : '',
        source          : 0,
        infoSource      : '', 
        roomTypeArray   : [],
        roomTypeIds     : [],
        checkInStrArray : [
            { id: 0,  name: '很着急' },
            { id: 1,  name: '一星期内' },
            { id: 2,  name: '半月内' },
            { id: 3,  name: '不着急，随便看' }
        ],
        guestTypeArray  : [
            { id: 0,  name: 'A' },
            { id: 1,  name: 'B' },
            { id: 2,  name: 'C' },
            { id: 3,  name: 'D' }
        ],
        infoSourceArray : [
            { id: 0,  name: '选择信息来源' },
            { id: 1,  name: '58同城' },
            { id: 2,  name: '豆瓣' },
            { id: 3,  name: '租房网' },
            { id: 4,  name: '嗨住' },
            { id: 5,  name: 'zuber' },
            { id: 6,  name: '中介' },
            { id: 7,  name: '路过' },
            { id: 8,  name: '老带新' },
            { id: 9,  name: '朋友介绍' },
            { id: 10, name: '微信' },
            { id: 11, name: '同行转介' },
            { id: 12, name: '闲鱼' },
            { id: 13, name: '蘑菇租房' },
            { id: 14, name: '微博' },
            { id: 15, name: '其它' }
        ],
        checkInStrIndex : 0,
        infoSourceIndex : 0,
        guestTypeIndex  : 0,
        roomTypeIndex   : 0,
        status          : '',
        order_id        : ''
    },

    onLoad (options) {
        let that    = this;
        this.setData({
            id     : options.id,
            status : options.status
        });
        /*获取房型*/
        request.getRoomType().then(res=>{
            res.list.map(function (roomtype) {
                that.data.roomTypeIds.push(roomtype.id);
            });

            that.setData({
                roomTypeArray   : res.list,
            });
        }).catch(e=>{
            console.log(e);
        });
    },

    onShow () {
        let that = this,
            para = { taskflow_id : that.data.id };

        request.getServerInfo(para).then(res=>{
            let getData = res.data;
            that.setData({
                userName        : getData.name,
                time            : getData.time,
                phone           : getData.phone,
                workPlace       : getData.work_address,
                roomTypeId      : getData.room_type_id,
                peopleCount     : getData.people_count,
                remark          : getData.remark ? getData.remark : '',
                guestRequire    : getData.require ? getData.require : '',
                roomTypeName    : getData.room_type.name,
                checkInTime     : getData.check_in_time,
                guestTypeText   : getData.guest_type,
                infoSourceText  : getData.info_source === 'undefined' ? '其他' : getData.info_source,
                order_id        : getData.id
            });
        }).catch(e=>{
            console.log(e)
        });
    },

    /* 更改户型*/
    changeRoomType (e) {
        let that    = this;

        that.setData({
            // roomTypeIndex   : e.detail.value,
            roomTypeId      : that.data.roomTypeArray[e.detail.value].id,
            roomTypeName    : that.data.roomTypeArray[e.detail.value].name,
        });
    },

    /* 更改预约时间*/
    changeTime (e) {
        this.setData({
            time : e.detail.value
        });
    },

    /*输入客户姓名*/
    // inputName (e) {
    //     this.setData({
    //         name : e.detail.value
    //     });
    // },

    /* 输入客户手机号码*/
    // inputPhone (e) {
    //     this.setData({
    //         phone : e.detail.value
    //     });
    // },

    /*输入客户工作地点*/
    inputWorkPlace (e) {
        this.setData({
            workPlace : e.detail.value
        });
    },

    /*确定客户可能的入住时间*/
    changeCheckInStr (e) {
        this.setData({
            checkInStrIndex : e.detail.value,
            checkInTime     : this.data.checkInStrArray[e.detail.value].name
        });
    },

    /*输入可能的入住人数*/
    inputPeopleCount (e) {
        this.setData({
            peopleCount : e.detail.value
        });
    },

    /*输入客户的需求*/
    inputGuestRequire (e) {
        this.setData({
            guestRequire : e.detail.value
        });
    },

    /*确认客户的意向度*/
    changeGuestType (e) {
        this.setData({
            guestTypeIndex : e.detail.value,
            guestTypeText  : this.data.guestTypeArray[e.detail.value].name
        });
    },

    /*输入备注*/
    inputRemark (e) {
        this.setData({
            remark : e.detail.value
        });
    },

    /*确认客户的信息来源*/
    changeInfoSource (e) {
        this.setData({
            infoSourceIndex : e.detail.value,
            infoSourceText  : this.data.infoSourceArray[e.detail.value].name
        });
    },

    submitReserve () {
        let that        = this,
            data        = that.data,
            requestData = {
                id            : data.order_id,
                status        : 'END',
                room_type_id  : data.roomTypeId,
                work_address  : data.workPlace,
                info_source   : data.infoSourceArray[data.infoSourceIndex].name,
                people_count  : data.peopleCount,
                check_in_time : data.checkInStrArray[data.checkInStrIndex].name,
                guest_type    : data.guestTypeArray[data.guestTypeIndex].name,
                time          : data.time,
                require       : data.guestRequire,
                remark        : data.remark ? data.remark : '',
            };

        if (!requestData.time) {
            request.showToast('请选择预约时间!');
            return false;
        }

        if (!requestData.work_address) {
            request.showToast('请填写客户工作地点!');
            return false;
        }

        if (!requestData.check_in_time) {
            request.showToast('请选择客户的入住时间!');
            return false;
        }

        if (!requestData.people_count) {
            request.showToast('请填写入住人数!');
            return false;
        }

        if (!requestData.info_source) {
            request.showToast('请选择客户信息来源!');
            return false;
        }

        request.reserveStatus(requestData).then(res=>{
            wx.navigateBack({
                delta : 1
            })
        }).catch(e =>{
            console.log(e)
        });
    },

    /*取消预约*/
    cancelReserve () {
        let thatD   = this.data,
            reData = {
                id            : thatD.order_id,
                status        : 'INVALID',
                room_type_id  : thatD.roomTypeId,
                work_address  : thatD.workPlace,
                info_source   : thatD.infoSourceArray[thatD.infoSourceIndex].name,
                people_count  : thatD.peopleCount,
                check_in_time : thatD.checkInStrArray[thatD.checkInStrIndex].name,
                guest_type    : thatD.guestTypeArray[thatD.guestTypeIndex].name,
                time          : thatD.time,
                require       : thatD.guestRequire,
                remark        : thatD.remark ? thatD.remark : '',
            };

        wx.showModal({
            title       : '取消预约',
            content     : '确定取消预约吗?',
            showCancel  : true,
            success     : function (res) {
                if (res.confirm) {
                    request.reserveStatus(reData).then(res=>{
                        wx.showToast({
                            title       : '取消成功!',
                            icon        : 'success',
                            duration    : 500,
                            success     : function () {
                                wx.navigateBack({
                                    delta : 1
                                })
                            }
                        });
                    }).catch(e=>{
                        console.log(e);
                    });
                }
            }
        });
    }
});
