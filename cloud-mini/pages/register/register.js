const utils   = require('../../utils/util.js');
const time    = utils.formatDate(new Date());
const request = require('../../common/request.js');
Page({
    data: {
        accounts         : [
            { id: 'VISIT',  accountName: '现场看房' },
            { id: 'PHONE',  accountName: '电话来访' },
            { id: 'WECHAT', accountName: '微信' },
            { id: 'WEB', accountName: '在线咨询' }
        ],
        accountIndex     : 0,
        name             : '',
        phone            : '',
        openHomeDate     : time,
        workingAdd       : '',
        sourcesInfos     : [ '选择信息来源','58同城','豆瓣','租房网','嗨住','zuber','链家','中介',
        '路过','老带新','朋友介绍','微信','同行转介','闲鱼','蘑菇租房','微博','其它'],
        sourcesInfoIndex : 0,
        roomTypeArray    : [],
        roomTypeIndex    : 0,
        occupancy        : 1,
        checkInInfo      : [ '很着急','一星期内','半月内','不着急，随便看'],
        checkInIndex     : 0,
        customer         : [ 'A','B','C','D'],
        customerIndex    : 0,
        customerDemand   : '',
        remarks          : ''
    },

    onLoad(){
        var that         = this;
        var roomtypeList = [];
        /*获取房型*/
        request.getRoomType().then((res)=>{
            res.list.map(function (roomtype) {
                roomtypeList.push({'id':roomtype.id,'name':roomtype.name})
            });

            that.setData({
                roomTypeArray   : roomtypeList,
            });
            that.data.room_type_id = that.data.roomTypeArray[that.data.roomTypeIndex].id;
        }).catch(e =>{
            console.log(e)
        });

        that.data.time  = time;
        that.default();
    },

    default(){
        var room_type_id  = '',
            work_address  = '',
            require       = '',
            remark        = '';
    },

    bindAccountChange(e){   //来访类型
        var that = this;
        that.setData({
            accountIndex: e.detail.value
        })
        that.data.visit_by = that.data.accounts[that.data.accountIndex].id;
    },

    customerName(e){   //姓名
        var that = this;
        that.setData({
            name : e.detail.value
        })
        that.data.name = e.detail.value;
        that.default();
    },

    customerPhone(e){   //电话号码
        var that = this;
        that.setData({
            phone : e.detail.value
        })
        that.data.phone = e.detail.value;
        that.default();
    },

    openHomeDateChange(e){   //看房时间
        var that = this;
        that.setData({
            openHomeDate: e.detail.value
        })
        that.data.time = e.detail.value;
        that.default();
    },

    workingPlace(e){   //工作地点
        var that = this;
        that.setData({
            workingAdd: e.detail.value
        })
        that.data.work_address = e.detail.value;
        that.default();
    },


    sourcesInfoChange(e){   //信息来源
        var that = this;
        that.setData({
            sourcesInfoIndex: e.detail.value
        })
        that.data.info_source = that.data.sourcesInfos[that.data.sourcesInfoIndex].name;
    },

    roomTypeChange(e){   //房型
        var that = this;
        that.setData({
            roomTypeIndex: e.detail.value
        })
        that.data.room_type_id = that.data.roomTypeArray[that.data.roomTypeIndex].id;
    },

    occupancy(e){   //入住人数
        var that = this;
        that.setData({
            occupancy: e.detail.value
        })
        that.data.people_count = e.detail.value;
    },

    checkInDateChange(e){   //入住时间
        var that = this;
        that.setData({
            checkInIndex: e.detail.value
        })
        that.data.check_in_time = that.data.checkInInfo[that.data.checkInIndex].name;
    },

    customerChange(e){   //客户分类
        var that = this;
        that.setData({
            customerIndex: e.detail.value
        })
        that.data.guest_type = that.data.customer[that.data.customerIndex].name;
    },

    customerDemandC(e){   //客户需求
        var that = this;
        that.setData({
            customerDemand: e.detail.value
        })
        that.data.require = e.detail.value;
        that.default();
    },

    remarkChange(e){   //备注
        var that = this;
        that.setData({
           remarks : e.detail.value
        })
        that.data.remark = e.detail.value;
        that.default();
    },

    registerCon(){
        var that = this.data;
        this.default();

        if(!that.name){
            request.showToast('请输入客户姓名');
            return;
        }

        if(!that.phone){
            request.showToast('请输入电话号码');
            return;
        }

        if(!that.work_address){
            request.showToast('请输入工作地点');
            return;
        }

        let para = {
            visit_by      : that.visit_by ? that.visit_by : 'VISIT',
            name          : that.name,
            phone         : that.phone,
            time          : that.time,
            work_address  : that.work_address,
            room_type_id  : that.room_type_id,
            info_source   : that.info_source === undefined ? '其他' : that.info_source,
            people_count  : that.people_count ? that.people_count : '1' ,
            check_in_time : that.check_in_time ? that.check_in_time : '很着急',
            guest_type    : that.guest_type ? that.guest_type : 'A',
            require       : that.customerDemand ? that.customerDemand : '无',
            remark        : that.remarks ? that.remarks : '无'
        };
        request.visit(para).then(res=>{
            wx.showModal({
                content    : '您已预约成功！',
                showCancel : false,
                success    : function (res) {
                    wx.switchTab({
                        url: '/pages/index/index'
                    })
                }
            });
        }).catch(e =>{
            console.log(e)
        });
    }
})
