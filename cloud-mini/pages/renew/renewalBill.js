const utils       = require('../../utils/util.js');
const request     = require('../../common/request.js');
const renewalInfo = wx.getStorageSync('renewalInfo') || {};
//获取应用实例
var app = getApp()
Page({
    data: {
        userId          : '',
        renewalNumber   : '',
        renewInfo       : {},
        roomNumber      : '',
        newRoomNumber   : false,
        rentDate        : "",
        rentType        : 'LONG',
        payType         : 1,  //支付类型
        multiArray      : [
        //   [{'id':'LONG','multiName':'长租'}],
        //   [{'id': '12', 'multiName': '12个月' }, { 'id': '11','multiName':'11个月'},{'id':'10','multiName':'10个月'},
        //    {'id':'9','multiName':'9个月'},{'id':'8','multiName':'8个月'},{'id':'7','multiName':'7个月'},
        //    {'id':'6','multiName':'6个月'},{'id':'5','multiName':'5个月'},{'id':'4','multiName':'4个月'},
        //    {'id':'3','multiName':'3个月'},{'id':'2','multiName':'2个月'},{'id':'1','multiName':'1个月'}]
        ],
        // multiIndex      : [0, 0],
        content         : [{'id': '12', 'multiName': '12个月' }, { 'id': '11','multiName':'11个月'},{'id':'10','multiName':'10个月'},
                            {'id':'9','multiName':'9个月'},{'id':'8','multiName':'8个月'},{'id':'7','multiName':'7个月'},
                            {'id':'6','multiName':'6个月'},{'id':'5','multiName':'5个月'},{'id':'4','multiName':'4个月'},
                            {'id':'3','multiName':'3个月'},{'id':'2','multiName':'2个月'},{'id':'1','multiName':'1个月'}],
        multiIndex      : [],
        overdueAmount   : '', //逾期金额
        getBeOverdue    : "",
        isBeOverdue     : false,
        rentPrice       : 0,   //房租原价
        managementPrice : 0,    //物业费
        depositArray    : [{'id':'2','depositName':'两个月'},{'id':'1','depositName':'一个月'},
                           {'id':'0','depositName':'免押金'}],
        depositIndex    : 0,
        rentDeposit     : 0,
        discountArray   : [],
        discountIndex   : [0,0],
        otherDeposits   : 0  ,
        firstPayMoney   : 0,
        occupancyNumber : 1,
        special_term      : "",
        evaContent      : '',
        preferences     : [],
        discountRent    : 0,
        resident_id     : '',
        // isShowInput     : true, //是否换房展示
        object          : {},
        showTip         : true
    },
    //事件处理函数
    onLoad(options) {
        // that.data.userId    = options.resident_id;
        let that            = this,
            thatD           = that.data,
            show_tip,
            discountArrays  = [{'id':'0','discountName':'没有折扣','discount':'100'}];  //房租折扣

        /*app.globalData.scence 为1的时候是公寓云，此时不显示提示文字
            为0的时候是草莓，此时显示提示文字*/
        if(app.globalData.scence){
            show_tip = false;
        }else{
            show_tip = true;
        }
            
        that.setData({
            discountArray : [
                [{'id':'1','discountName':'月付'},{'id':'3','discountName':'季付'},
                 {'id':'6','discountName':'半年付'},{'id':'12','discountName':'年付'}],
                discountArrays
            ],
            showTip       : show_tip
        })

        let para = { type : 'DISCOUNT'};
        request.getStroeActivity(para).then(res=>{
            let getData = res.list;
            for(var key in getData){
                discountArrays.push({'id':getData[key].id,'discountName':getData[key].name,'discount':getData[key].discount});
            }
            that.setData({
                discountArray:[
                    [{'id':'1','discountName':'月付'},{'id':'3','discountName':'季付'},
                     {'id':'6','discountName':'半年付'},{'id':'12','discountName':'年付'}],
                    discountArrays
                ],
                // preferences: preferencesList /*优惠列表现在不需要了*/
            })
            that.data.object.pay_frequency = thatD.discountArray[0][thatD.discountIndex[0]].id;
        }).catch(e=>{
            console.log(e)
        });

        // thatD.object.begin_time    = thatD.rentDate;
        // thatD.object.rent_type     = thatD.multiArray[0][thatD.multiIndex[0]].id;
        // thatD.object.contract_time = thatD.multiArray[1][thatD.multiIndex[1]].id;
        thatD.object.people_count  = '1';
        thatD.object.discount_id   = '0';
        thatD.object.tmp_deposit   = '0';
        thatD.object.deposit_month = thatD.depositArray[thatD.depositIndex].id;
    },

    /*原房间号*/
    renewalNumberInput(e){
        let that = this;
        if (!that.data.renewalNumber || (e.detail.value && that.data.renewalNumber != e.detail.value)) {
            that.setData({
                renewalNumber : e.detail.value,
                newRoomNumber : true
            });
        }
    },

    ifNewRoomsNumber(e){
        let that = this;
        if (e.detail.value && e.detail.value == that.data.renewalNumber) {
            that.setData({
               newRoomNumber : false
            });
        }
    },

    /*原房间号
        搜索*/
    renewalRoom(){
        let that = this;

        if (!that.data.renewalNumber) {
            return;
        }

        let para = { room_number : that.data.renewalNumber };
        request.searchRenew(para).then(res=>{
            res.renew.status = that.status(res.renew.status);
            let temper = Date.parse(res.renew.resident.contract_end_time),
                dt     = new Date(temper),
                nextD  = new Date(dt.getTime() + 24*60*60*1000);
            that.setData({
                renewInfo   : res.renew,
                resident_id : res.renew.resident.id,
                rentDate    : utils.formatDate(nextD)
            });

            that.data.object.resident_id    = res.renew.resident.id;
            that.data.object.resident_name  = res.renew.resident.name;
            that.data.object.resident_phone = res.renew.resident.phone;
            that.data.object.begin_time     = utils.formatDate(nextD);
        }).catch(e=>{
            console.log(e);
        });
    },

    /*拨打电话*/
    calling(e){
        let phone   = e.currentTarget.dataset.phone_number;

        wx.makePhoneCall({
            phoneNumber : phone
        });
    },

    status(text){
        let type = '';
        switch(text){
            case 'BLANK':
                type = '空闲';
                break;
            case 'RESERVE':
                type = '预订';
                break;
            case 'RENT':
                type = '入住';
                break;
            case 'OCCUPIED ':
                type = '占用';
                break;
            }
        return type;
    },

    roomNumberInput(e){   //续租房间号
        let that = this;
        if (!that.data.newRoomNumber || (e.detail.value && that.data.roomNumber != e.detail.value)) {
            that.setData({
                roomNumber: e.detail.value,
                newRoomNumber : true
            });
            that.data.object.resident_number = e.detail.value;
        }
    },

    ifNewRoomNumber(e) {
        let that = this;
        if (e.detail.value && e.detail.value == that.data.roomNumber) {
            that.setData({
               newRoomNumber : false
            });
        }
    },

    /*续租房间号
        搜索*/
    room(){
        let that = this,
            para = { room_number : that.data.roomNumber, resident_id : that.data.resident_id};

        if (!that.data.newRoomNumber) {
            return;
        }

        if(!that.data.resident_id){
            request.showToast('请输入原房间号');
            return;
        }else{
            request.searchOldRenew(para).then(res=>{
                let contract         = [],
                    is_be_overdue,
                    short_rent_price = res.tpl.short_rent_price, //是否短租
                    rent_type        = res.tpl.rent_type; //长租或者短租

                for(var key in rent_type){
                    contract.push({'id':rent_type[key].key,'multiName':rent_type[key].value});
                }

                if("YES" === short_rent_price){
                    is_be_overdue = true;
                }else{
                    is_be_overdue = false;
                }

                that.setData({
                    rentPrice       : res.room.rent_price,
                    managementPrice : res.room.property_price,
                    rentDeposit     : res.room.rent_price,
                    discountRent    : res.room.rent_price,
                    multiArray      : [contract,that.data.content],
                    multiIndex      : [0,0],
                    getBeOverdue    : short_rent_price,
                    isBeOverdue     : is_be_overdue
                });

                that.data.object.room_id       = res.room.id;
                that.data.object.rent_type     = contract[0].id;
                that.data.object.contract_time = that.data.multiArray[1][that.data.multiIndex[1]].id;
                that.calcFirstPay();
            }).catch(e=>{
                console.log(e);
            });
        }
    },

    // rentDateChange(e){ //起租日期
    //     this.setData({
    //         rentDate : e.detail.value
    //     })

    //     this.data.object.begin_time =e.detail.value;
    //     this.calcFirstPay();
    // },

    overdueAmount(e){ //逾期金额
        this.setData({
            overdueAmount: e.detail.value
        })
        this.data.object.short_rent_price = e.detail.value;
    },

    bindMultiPickerChange(e){ //合同时长
        var that          = this,
            thatD         = that.data,
            contract_data = '';

        that.setData({
            multiIndex  : e.detail.value,
            rentType    : thatD.multiArray[0][thatD.multiIndex[0]].id,     
        });

        if(thatD.multiArray[0][thatD.multiIndex[0]].id ==="LONG"){
            contract_data = "长租";
        }else{
            contract_data = "短租";
        }

        that.setData({
            contractData  : contract_data,
            contractMonth : thatD.multiArray[1][thatD.multiIndex[1]].id + "个月",
        });

        thatD.object.rent_type     = that.data.multiArray[0][that.data.multiIndex[0]].id;
        thatD.object.contract_time = that.data.multiArray[1][that.data.multiIndex[1]].id;
        that.calcFirstPay();
    },

    bindMultiPickerColumnChange(e){
        let that    = this,
            is_be_overdue;

        if(0 === e.detail.value){
            is_be_overdue = true;
        }else{
            is_be_overdue = false;
        }
        that.setData({
            isBeOverdue : is_be_overdue
        })
    },

    overdueAmount(e){ //逾期金额
        this.setData({
            overdueAmount: e.detail.value
        })
        this.data.object.short_rent_price = e.detail.value;
    },


    binddiscountChange(e){  //房租折扣
        var that =this;
        that.setData({
            discountIndex : e.detail.value,
            payType       : that.data.discountArray[0][that.data.discountIndex[0]].id,
        })
        that.data.object.pay_frequency = that.data.discountArray[0][that.data.discountIndex[0]].id;
        that.data.object.discount_id   = that.data.discountArray[1][that.data.discountIndex[1]].id;
        that.calcFirstPay();
    },

    // isChangeRoom(e){   //是否换房
    //     var that =this;
    //     that.setData({
    //         changeRoom: e.detail.value
    //     })

    //     if (e.detail.value == 1) {
    //         that.setData({
    //             isShowInput : !that.data.isShowInput
    //         })
    //     }else{
    //         that.setData({
    //             isShowInput : true
    //         })
    //     }
    // },

    // roomClaen(e){  //房屋清洁费
    //     var that =this;
    //     that.setData({
    //         claen: e.detail.value
    //     })
    // },

    // damageOfGoods(e){ //物业费
    //     var that =this;
    //     that.setData({
    //         damageFee: e.detail.value
    //     })
    // },

    bindDepositChange(e){  //押金时长
        var that =this;
        that.setData({
            depositIndex: e.detail.value
        })
        that.data.object.deposit_month = that.data.depositArray[that.data.depositIndex].id;
        that.calcFirstPay();
    },
    
    otherDeposits(e){  //其它押金
        this.setData({
            otherDeposits: e.detail.value
        })
        this.data.object.tmp_deposit = e.detail.value
    },

    occupancy(e){ //入住人数
        this.setData({
            occupancyNumber: e.detail.value
        })
        this.data.object.people_count = e.detail.value
    },

    remark(e){  //备注
        this.setData({
            evaContent: e.detail.value
        })
        this.data.object.remark = e.detail.value
    },

    max(first,second){
        return first > second ? first : second;
    },

    calcFirstPay() {
        let that              = this,
            firstPay          = 0,
            data              = that.data,
            rentOrg           = data.rentPrice,    //房租原价
            management        = data.managementPrice,   //物业费
            depositMonth      = that.data.depositArray[that.data.depositIndex].id,     //押金月数
            rentType          = that.data.multiArray[0][that.data.multiIndex[0]].id,   //租赁类型 月付、季付
            payType           = that.data.discountArray[0][that.data.discountIndex[0]].id,  //支付类型 长租、短租
            discount          = that.data.discountArray[1][that.data.discountIndex[1]].discount,  //折扣
            rentPrice         = Math.ceil(rentOrg * discount * 0.01),   //折后房租
            rentAndManagement = parseInt(rentPrice) + parseInt(management),
            rentDate          = new Date(data.rentDate),
            deposit           = that.max(Math.ceil(depositMonth * rentOrg),rentOrg); 
        let checkInDate       = rentDate.getDate(),
            curMonth          = rentDate.getMonth();

        rentDate.setMonth(curMonth + 1);
        rentDate.setDate(0);

        let daysOfMonth     = rentDate.getDate(),     //当月天数
            daysLeftMonth   = daysOfMonth - checkInDate + 1;  //剩余天数

        firstPay = Math.ceil(rentPrice * daysLeftMonth / daysOfMonth) + Math.ceil(management * daysLeftMonth / daysOfMonth);

        if ('LONG' == rentType) {
            if (1 == payType && checkInDate >= 21) {
                firstPay += rentAndManagement;
            } else if (12 == payType) {
                firstPay = 12 * rentAndManagement;
            } else {
                firstPay += rentAndManagement * (payType - 1);
            }
        }

        if(depositMonth == 0){
            deposit = 0
        }

        that.setData({
            discountRent  : rentPrice,   //折后房租
            firstPayMoney : firstPay,    //首次房租
            rentDeposit   : deposit      //押金
        });
        data.object.deposit_money       = data.rentDeposit;   //押金
        data.object.first_pay_money     = data.firstPayMoney;
        data.object.real_property_costs = data.managementPrice;
        data.object.real_rent_money     = data.discountRent;
    },

    special_term(e){  //特别条款
        this.setData({
            special_term: e.detail.value
        })
        this.data.object.special_term = e.detail.value;
    },
    confirmation(){
        let that = this.data;

        if(!that.roomNumber){
            request.showToast('请输入续租房间号');
            return;
        }

        if(that.occupancyNumber >= 7 || that.occupancyNumber <= 0){
            request.showToast('人数为1~6');
            return;
        }
        if(that.isBeOverdue){
            if(!that.overdueAmount){
                request.showToast('请输入短租单日费用');
                return;
            }
        }else{
            that.object.short_rent_price = "";
        }

        let requestData = {
            room_id             : that.object.room_id,
            resident_id         : that.object.resident_id,
            begin_time          : that.object.begin_time,
            contract_time       : that.object.contract_time,
            discount_id         : that.object.discount_id,
            rent_type           : that.object.rent_type,
            real_rent_money     : that.object.real_rent_money,
            real_property_costs : that.object.real_property_costs,
            first_pay_money     : that.object.first_pay_money,
            pay_frequency       : that.object.pay_frequency,
            deposit_money       : that.object.deposit_money,
            deposit_month       : that.object.deposit_month,
            tmp_deposit         : that.object.tmp_deposit,
            people_count        : that.object.people_count,
            special_term        : that.object.special_term ? that.object.special_term : "无",
            remark              : that.object.remark ? that.object.remark : '无',
            short_rent_price    : that.object.short_rent_price ? that.object.short_rent_price : '',
        };

        request.confirmRenew(requestData).then(res=>{
            wx.navigateTo({
                url: '/pages/renew/renewOrderConfirm?resident_id='+ res.resident_id
            })
        }).catch(e=>{
            console.log(e);
        });    
    }
})
