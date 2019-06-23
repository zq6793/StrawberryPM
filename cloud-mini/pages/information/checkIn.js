const utils        = require('../../utils/util.js');
const time         = utils.formatDate(new Date());
const request      = require('../../common/request.js');
const userDataInfo = wx.getStorageSync('userDataInfo') || {};
//获取应用实例
var app = getApp()
Page({
    data: {
        userId          : '',
        roomNumber      : '',
        newRoomNumber   : false,
        selectRoom      : false,
        roomArray       : [], //房间列表
        rentDate        : time,
        rentType        : 'LONG', //合同时长
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
        otherDeposits   : 0,
        deposits        : "",
        firstPayMoney   : 0,
        occupancyNumber : 1,
        evaContent      : '',
        // preferences     : [],
        discountRent    : 0,
        object          : {},
        bookingMoney    : 0,
        contractData    : '',
        contractMonth   : '',
        provisions      : '',
        messageContent  : {}, //设备读数
        readingList     : [], //读数列表
        readingImage    : [], //读数图片
        imgFiles        : [], //验房图片
        showAddImg      : true,
        showTip         : true
    },

    //事件处理函数
    onLoad(options) {
        let that            = this,
            thatD           = that.data,
            show_tip,
            discountArrays  = [{'id':'0','discountName':'没有折扣','discount':'100'}];  //房租折扣

        // var preferencesList = []; //优惠列表
        if(options.resident_id){
            that.pre_checkin(options.resident_id);
        }

        /*app.globalData.scence 为1的时候是公寓云，此时不显示提示文字
            为0的时候是草莓，此时显示提示文字*/
        if(app.globalData.scence){
            show_tip = false;
        }else{
            show_tip = true;
        }

        that.setData({
            showTip : show_tip,
            userId  : options.resident_id
        });

        let para = { type : 'DISCOUNT' };
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
            thatD.object.pay_frequency = thatD.discountArray[0][thatD.discountIndex[0]].id;
        }).catch(e=>{
            console.log(e);
        });

        thatD.object.begin_time    = thatD.rentDate;
        thatD.object.people_count  = '1';
        thatD.object.discount_id   = '0';
        thatD.object.tmp_deposit   = '0';
        thatD.object.deposit_month = thatD.depositArray[thatD.depositIndex].id;
    },

    pre_checkin(userId){
        let that = this;
        if(that.data.roomNumber == ''){
            let para = { resident_id : userId };
            request.getResident(para).then(res=>{
                let resData      = res.data,
                    contractName = '';

                if(resData.rent_type === "LONG"){
                    contractName = "长租";
                }else{
                    contractName = "短租";
                }

                that.setData({
                    roomNumber    : resData.room.number,
                    rentDate      : resData.booking.time,
                    contractData  : contractName,
                    contractMonth : resData.reserve_contract_time +"个月",
                    evaContent    : resData.remark,
                    bookingMoney  : resData.booking ? resData.booking.money : 0
                });

                that.data.object.remark        = resData.remark;
                that.data.object.contract_time = resData.reserve_contract_time;
                that.data.object.rent_type     = resData.rent_type;
                that.data.object.begin_time    = resData.booking.time;

                setTimeout(function () {
                    let data = { room_number : that.data.roomNumber, status : 'RESERVE'};
                    request.getRoomStauts(data).then(res=>{
                        let contract         = [],
                            short_rent_price = res.short_rent_price,
                            rent_type        = res.rent_type;

                        for(var key in rent_type){
                            contract.push({'id':rent_type[key].key,'multiName':rent_type[key].value});
                        }
                 
                        that.setData({
                            rentPrice       : res.rent_price,
                            managementPrice : res.property_price,
                            rentDeposit     : res.rent_price,
                            discountRent    : res.rent_price,
                            getBeOverdue    : short_rent_price,
                            multiArray      : [contract,that.data.content],
                            multiIndex      : [0,0]
                        });
                        that.data.object.room_id = res.room_id;
                        that.calcFirstPay();
                        that.judgementReading(res.room_id);
                    }).catch(e=>{
                        console.log(e);
                    });
                })

            }).catch(e=>{
                console.log(e);
            });
        }
    },

    roomNumberInput(e){   //房间号
        let that = this;
        if (!that.data.newRoomNumber || (e.detail.value && that.data.roomNumber != e.detail.value)) {
            that.setData({
                roomNumber    : e.detail.value,
                newRoomNumber : true
            });
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

    room(){
        let that = this;

        if (!that.data.newRoomNumber) {
            return;
        }

        let para = { number : that.data.roomNumber, status : 'BLANK' };
        request.changeRoomNumber(para).then(res=>{
            let contract         = [],
                short_rent_price = res.contract.short_rent_price, //是否短租
                rent_type        = res.contract.rent_type, //长租或者短租
                // selectRoom, //是否选择房间
                is_be_overdue,
                room_array       = [], //房间列表 
                room_number      = '', //房间号
                room_info_array  = res.res[0],
                rentPrice        = "", //月租原价
                discountRent     = "", //折后房租
                rentDeposit      = "", //住宿押金
                managementPrice  = ""; //物业服务费

            if(res.res.length === 0){
                request.showWarning('此房间不能出租!');
                that.setData({
                    // selectRoom      : false,
                    rentPrice       : 0,
                    discountRent    : 0,
                    rentDeposit     : 0,
                    managementPrice : 0,
                  
                });
            }

            if(room_info_array.rooms.length > 0){
                // selectRoom = true;

                if("1" === room_info_array.rooms[0].room_level || 1 === room_info_array.rooms[0].room_level){
                    room_number = room_info_array.rooms[0].number;
                }else{
                    room_number = that.data.roomNumber;
                    // room_number = that.data.roomNumber +"-整租";
                }
                
                room_info_array.rooms.forEach(item=>{
                    room_array.push({ id: item.id, number : item.number, rent_price : item.rent_price, property_price : item.property_price});
                });

                rentPrice       = room_info_array.rooms[0].rent_price;
                discountRent    = room_info_array.rooms[0].rent_price;
                rentDeposit     = room_info_array.rooms[0].rent_price;
                managementPrice = room_info_array.rooms[0].property_price;
                that.data.object.room_id = room_info_array.rooms[0].id;
                that.judgementReading(room_info_array.rooms[0].id);
            }else if(room_info_array.rooms.length === 0){
                request.showWarning('此房间不能出租!');
                that.setData({
                    // selectRoom      : false,
                    rentPrice       : 0,
                    discountRent    : 0,
                    rentDeposit     : 0,
                    managementPrice : 0,
                  
                });
            }

            if("YES" === short_rent_price){
                is_be_overdue = true;
            }else{
                is_be_overdue = false;
            }


            for(var key in rent_type){
                contract.push({'id':rent_type[key].key,'multiName':rent_type[key].value});
            }
     
            that.setData({
                rentPrice       : rentPrice,
                discountRent    : discountRent,
                rentDeposit     : rentDeposit,
                managementPrice : managementPrice,
                roomNumber      : room_number,
                // selectRoom      : selectRoom,
                roomArray       : room_array,
                getBeOverdue    : short_rent_price,
                multiArray      : [contract,that.data.content],
                multiIndex      : [0,0],
                contractData    : contract[0].multiName,
                contractMonth   : that.data.content[0].multiName,
                isBeOverdue     : is_be_overdue
            });
           
            that.calcFirstPay();
            that.data.object.rent_type     = contract[0].id;
            that.data.object.contract_time = that.data.multiArray[1][that.data.multiIndex[1]].id;
        }).catch(e=>{
            console.log(e);
        });
    },

    selectRoom(e){ //选择房间号
        let that = this;

        that.setData({
            roomIndex       : e.detail.value,
            roomNumber      : that.data.roomArray[e.detail.value].number,
            rentPrice       : that.data.roomArray[e.detail.value].rent_price,
            rentDeposit     : that.data.roomArray[e.detail.value].rent_price,
            managementPrice : that.data.roomArray[e.detail.value].property_price,
        })
        that.data.object.room_id = that.data.roomArray[e.detail.value].id;
        that.judgementReading(that.data.roomArray[e.detail.value].id);
    },

    rentDateChange(e){ //起租日期
        this.setData({
            rentDate : e.detail.value
        })

        this.data.object.begin_time = e.detail.value;
        this.calcFirstPay();
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
            overdueAmount : e.detail.value
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

    provisions(e){  //特别条款
        this.setData({
            provisions: e.detail.value
        })
        this.data.object.special_term = e.detail.value
    },

    // preferencesChange(e){   //优惠列表
    //     var that        = this,
    //         preferences = that.data.preferences,
    //         values      = e.detail.value;
    //     for (let i = 0; i < preferences.length; i++) {
    //         preferences[i].checked = false;
    //         for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
    //             if(preferences[i].id == values[j]){
    //                 preferences[i].checked = true;
    //                 break;
    //             }
    //         }
    //     }
    //     that.setData({
    //         preferences: preferences
    //     });
    //     that.data.object.normal_discount_ids = e.detail.value;
    // },

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

    /*输入读数*/
    templatesValue(e){
        var that    = this,
            content = that.data.messageContent;
        content[e.target.dataset.key] = e.detail.value;

        that.setData({
            messageContent : content,
        });

        if(content.coldwater_reading){
            that.data.object.coldwater_reading = content.coldwater_reading;
        }
        if(content.hotwater_reading){
            that.data.object.hotwater_reading = content.hotwater_reading;
        }
        if(content.electric_reading){
            that.data.object.electric_reading = content.electric_reading;
        }
        if(content.gas_reading){
            that.data.object.gas_reading = content.gas_reading;
        }
    },

    /*上传水电表读数照片*/
    uploadOrPreview(e){
        let that      = this,
            index     = e.currentTarget.dataset.imgindex,
            imgtype   = e.currentTarget.dataset.imgtype,
            tempArray = that.data.readingImage;

        wx.chooseImage({
            count      : 1,
            sizeType   : ['compressed'],
            sourceType : ['album', 'camera'],
            success    : (res) => {
                var tempFilePaths = res.tempFilePaths[0];
                tempArray[index].img  = tempFilePaths;

                request.uploadFile(tempArray[index].img).then(res=>{
                    if(JSON.parse(res).rescode=== 0){
                        var data = JSON.parse(res).data.image_url;

                        that.data.readingImage[index].img = data;
                        if("coldwater_reading" === imgtype){
                            that.data.object.coldwater_image = data;
                        }
                        if("hotwater_reading" === imgtype){
                            that.data.object.hotwater_image = data;
                        }
                        if("electric_reading" === imgtype){
                            that.data.object.electric_image = data;
                        }
                        if("gas_reading" === imgtype){
                            that.data.object.gas_image = data;
                        }

                        request.showToast('上传成功!');
                        that.setData({
                            readingImage : tempArray,
                        });
                    }else{
                        request.showToast('上传失败!');
                    }
                }).catch(e =>{
                    console.log(e)
                });

            },
        })
    },

    /*上传验房照片*/
    roomPicture(e) {
        let that       = this,
            index      = e.currentTarget.dataset.imgindex,
            tempArray  = that.data.imgFiles,
            addPicture = true;

        wx.chooseImage({
            count      : 1,
            sizeType   : ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType : ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                let tempFilePaths = res.tempFilePaths[0];
                tempArray[index] = tempFilePaths;

                request.uploadFile(tempArray[index]).then(respone=>{
                    if(JSON.parse(respone).rescode=== 0){
                        var img = JSON.parse(respone).data.image_url;
                        that.data.imgFiles[index] = img;

                        request.showToast('上传成功!');
                        if(index >= 4){
                            addPicture = false;
                        }else{
                            addPicture = true;
                        }

                        that.setData({
                            imgFiles   : tempArray,
                            showAddImg : addPicture
                        });
                        that.data.object.check_images = tempArray;
                    }else{
                        request.showToast('上传失败！');
                    }
                }).catch(e =>{
                    console.log(e)
                });
            }
        })
    },

    /*预览验房图片*/
    previewImage(e){
        wx.previewImage({
            current : e.currentTarget.id, // 当前显示图片的http链接
            urls    : this.data.imgFiles // 需要预览的图片http链接列表
        })
    },

    /*删除验房图片*/
    deteleImage(e){
        let that       = this,
            images     = that.data.imgFiles,
            index      = e.currentTarget.dataset.imgindex,
            addPicture = true;

        request.deteleImage(images,index,res=>{
            if(res.length > 5){
                addPicture = false;
            }else{
                addPicture = true;
            }
            that.setData({
                imgFiles   : res,
                showAddImg : addPicture
            });
            that.data.object.check_images = res;
        });
    },

    /*判断需要传什么读数*/
    judgementReading(roomid){
        let that = this,
            para = { room_id : roomid };
        request.getStroeReading(para).then((respone)=>{
            let reading = respone.meter,
                newList = [],
                imgList = [];
            for(var key in reading){
                if(reading[key] === "COLD_WATER_METER"){
                    newList.push({name : "冷水表", field : "coldwater_reading"});
                    imgList.push({index : key, name : "冷水表", type : "coldwater_reading"});
                }else if(reading[key] === "HOT_WATER_METER"){
                    newList.push({name : "热水表", field : "hotwater_reading"});
                    imgList.push({index : key, name : "热水表", type : "hotwater_reading"});
                }else if(reading[key] === "ELECTRIC_METER"){
                    newList.push({name : "电表", field : "electric_reading"});
                    imgList.push({index : key, name : "电表", type : "electric_reading"});
                }else if(reading[key] === "GAS_METER"){
                    newList.push({name : "燃气表", field : "gas_reading"});
                    imgList.push({index : key, name : "燃气表", type : "gas_reading"});
                }else{}
            }

            that.setData({
                readingList  : newList,
                readingImage : imgList
            })
        }).catch(e =>{
            console.log(e)
        });
    },

    NextStep(){
        var thatD = this.data;
        wx.setStorageSync('userDataInfo', thatD.object);
    
        if(!thatD.roomNumber){
            request.showToast('请输入房间号');
            return;
        }
        
        if(thatD.isBeOverdue){
            if(!thatD.overdueAmount){
                request.showToast('请输入短租单日费用');
                return;
            }

            if(thatD.occupancyNumber >= 1 || thatD.occupancyNumber <= 0){
                request.showToast('人数为1~2');
                return;
            }
        }else{
            if(thatD.occupancyNumber >= 7 || thatD.occupancyNumber <= 0){
                request.showToast('人数为1~6');
                return;
            }
            thatD.object.short_rent_price = "";
        }
        
        let reading_list = thatD.readingList;
        for(var key in reading_list){
            if(reading_list[key].field === "coldwater_reading" && !thatD.messageContent.coldwater_reading){
                request.showToast('请输入冷水读数');
                return; 
            }else if(reading_list[key].field === "hotwater_reading" && !thatD.messageContent.hotwater_reading){
                request.showToast('请输入热水读数');
                return; 
            }else if(reading_list[key].field === "electric_reading" && !thatD.messageContent.electric_reading){
                request.showToast('请输入电读数');
                return;
            }else if(reading_list[key].field === "gas_reading" && !thatD.messageContent.gas_reading){
                request.showToast('请输入燃气读数');
                return;
            }
        }

        let reading_image = thatD.readingImage;

        for(var key in reading_image){
            if("coldwater_reading" === reading_image[key].type && !reading_image[key].img){
                request.showToast('请上传冷水表照片');
                return; 
            }else if("hotwater_reading" === reading_image[key].type && !reading_image[key].img){
                request.showToast('请上传热水表照片');
                return;
            }else if("electric_reading" === reading_image[key].type && !reading_image[key].img){
                request.showToast('请上传电表照片');
                return;
            }else if("gas_reading" === reading_image[key].type && !reading_image[key].img){
                request.showToast('请上传燃气表照片');
                return;
            }
        }

        if(!thatD.imgFiles.length === 0){
            request.showToast('请上传验房照片');
            return;
        }
        
        if(thatD.userId){
            wx.navigateTo({
              url: '/pages/information/personInfo?id='+thatD.userId
            })
        }else{
            wx.navigateTo({
              url: '/pages/information/personInfo'
            })
        }
    }
})
