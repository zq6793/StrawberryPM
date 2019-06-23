const utils   = require('../../utils/util.js');
const time    = utils.formatDate(new Date());
const request = require('../../common/request.js');
const requestV4 = require('../../common/request_v4.js');
const app = getApp();
Page({
    data: {
        userId          : '',
        roomNumber      : '',
        newRoomNumber   : false,
        selectRoom      : false,
        roomArray       : [], //房间列表
        roomIndex       : 0,
        rentDate        : time,
        rentType        : 'LONG', //合同时长
        multiArray      : [],
        content         : [{'id': '12', 'multiName': '12个月' }, 
                           { 'id': '11','multiName':'11个月'},
                           {'id':'10','multiName':'10个月'},
                            {'id':'9','multiName':'9个月'},
                            {'id':'8','multiName':'8个月'},
                            {'id':'7','multiName':'7个月'},
                            {'id':'6','multiName':'6个月'},
                            {'id':'5','multiName':'5个月'},
                            {'id':'4','multiName':'4个月'},
                            {'id':'3','multiName':'3个月'},
                            {'id':'2','multiName':'2个月'},
                            {'id':'1','multiName':'1个月'}],
        multiIndex      : [],
        overdueAmount   : '', //逾期金额
        getBeOverdue    : "",
        isBeOverdue     : false,
        rentPrice       : 0,   //房租原价
        managementPrice : 0,    //物业费
        depositArray    : [{'id':'0','depositName':'免押金'},
                           {'id':'1','depositName':'一个月'},
                           {'id':'2','depositName':'两个月'}],
        depositIndex    : 0,
        rentDeposit     : 0,
        discountArray   : [],
        discountIndex   : 0,
        otherDeposits   : 0,
        evaContent      : '',
        messageContent  : {}, //设备读数
        readingList     : [], //读数列表
        readingImage    : [], //读数图片
        imgFiles        : [], //验房图片
        showAddImg      : true,
        utility         : [], //存储水电表读数
        coldwater_img   : '',
        hotwater_img    : '',
        electric_img    : '',
        gas_img         : '',
        object          : {},
        oldRoomInfo     : '',
        payType         : 1,  //支付类型
    },

    onLoad (options) {
        let that  = this,
            thatD = that.data;
        let userInfo = wx.getStorageSync('userInfo');
        let oldRoomInfo = wx.getStorageSync('old_room');
        that.setData({
            oldRoomInfo : oldRoomInfo,
            payType     : oldRoomInfo.pay_frequency2,
            rentDate    : oldRoomInfo.change_time_e
        })
        console.log(oldRoomInfo.change_time_e)
        let discountArray  = [{'id':'0','discountName':'没有折扣','discount':'100'}];  //房租折扣

        let para = {type : 'DISCOUNT'};
        request.getStroeActivity(para).then(res=>{
            let getData = res.list;
            for(var key in getData){
                discountArray.push({'id':getData[key].id,'discountName':getData[key].name,'discount':getData[key].discount});
            }
            that.setData({
                discountArray : discountArray
            })
        }).catch(e=>{
            console.log(e)
        });
        thatD.object.tmp_deposit   = 0;
        thatD.object.deposit_month = userInfo.resident.deposit_month;
        thatD.depositIndex = userInfo.resident.deposit_month
        console.log(thatD.depositIndex)
    },

    onShow(){
        
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

        let para = {number : that.data.roomNumber, status : 'BLANK'};

        request.changeRoomNumber(para).then(res=>{
            let contract         = [],
                short_rent_price = res.contract.short_rent_price, //是否短租
                rent_type        = res.contract.rent_type, //长租或者短租
                roomInfo         = res.res[0],
                selectRoom, //是否选择房间
                room_array       = [], //房间列表 
                room_number      = '', //房间号
                room_info_array  = roomInfo.rooms,
                rentPrice        = "", //月租原价
                discountRent     = "", //折后房租
                rentDeposit      = "", //住宿押金
                managementPrice  = ""; //物业服务费

            if(room_info_array.length > 0){
                selectRoom = true;

                if("1" === room_info_array[0].room_level || 1 === room_info_array[0].room_level){
                    room_number = room_info_array[0].number;
                }else{
                    room_number = that.data.roomNumber +"-整租";
                }

                rentPrice       = room_info_array[0].rent_price;
                discountRent    = room_info_array[0].rent_price;
                rentDeposit     = room_info_array[0].rent_price;
                managementPrice = room_info_array[0].property_price;
                that.data.object.room_id = room_info_array[0].id;
                that.judgementReading(room_info_array[0].id);
            }else if(room_info_array.length === 0){
                selectRoom = false;
                request.showToast('此房间不能出租!');
            }

            room_info_array.forEach(item=>{
                room_array.push({ id: item.id, number : item.number, rent_price : item.rent_price, property_price : item.property_price});
            });

            for(var key in rent_type){
                contract.push({'id':rent_type[key].key,'multiName':rent_type[key].value});
            }
     
            that.setData({
                rentPrice       : rentPrice,
                discountRent    : discountRent,
                rentDeposit     : rentDeposit,
                managementPrice : managementPrice,
                roomNumber      : room_number,
                selectRoom      : selectRoom,
                roomArray       : room_array,
                getBeOverdue    : short_rent_price,
                multiArray      : [contract,that.data.content],
                multiIndex      : [0,0],
                contractData    : contract[0].multiName,
                contractMonth   : that.data.content[0].multiName
            });
           
            that.calcFirstPay();
        }).catch(e=>{
            console.log(e);
        });
    },
    bindMultiPickerColumnChange(e){
        let that    = this,
            is_be_overdue,
            overdue = that.data.getBeOverdue;

        if(0 === e.detail.column){
            if("YES" === overdue){
                is_be_overdue = true;
            }else{
                is_be_overdue = false;
            }
        }

        that.setData({
            isBeOverdue : is_be_overdue
        })
    },

    binddiscountChange(e){  //房租折扣
        var that =this;
        that.setData({
            discountIndex : e.detail.value,
            // payType       : that.data.discountArray[0][that.data.discountIndex[0]].id,
        })
        that.data.object.discount_id   = that.data.discountArray[that.data.discountIndex].id;
        that.calcFirstPay();
    },

    bindDepositChange(e){  //押金时长
        var that =this;
        that.setData({
            depositIndex: e.detail.value
        })
        that.data.object.deposit_month = parseInt(that.data.depositArray[that.data.depositIndex].id);
        that.calcFirstPay();
    },

    otherDeposits(e){  //其它押金
        this.setData({
            otherDeposits: parseFloat(e.detail.value)
        })
        this.data.object.tmp_deposit = parseFloat(parseFloat(e.detail.value).toFixed(2))
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
            depositMonth      = data.depositArray[that.data.depositIndex].id,     //押金月数
            depositName       = data.depositArray[that.data.depositIndex].depositName, //押金时长展示
            rentType          = that.data.multiArray[0][that.data.multiIndex[0]].id,   //租赁类型 月付、季付
            discount          = that.data.discountArray[that.data.discountIndex].discount,  //折扣
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

        // if ('LONG' == rentType) {
        //     if (1 == payType && checkInDate >= 21) {
        //         firstPay += rentAndManagement;
        //     } else if (12 == payType) {
        //         firstPay = 12 * rentAndManagement;
        //     } else {
        //         firstPay += rentAndManagement * (payType - 1);
        //     }
        // }

        if(depositMonth == 0){
            deposit = 0
        }

        that.setData({
            discountRent  : rentPrice,   //折后房租
            firstPayMoney : firstPay,    //首次房租
            rentDeposit   : deposit,     //押金
            depositName   : depositName,  //押金时长展示
        });
    },

    /*输入读数*/
    templatesValue(e){
        var that    = this,
            content = that.data.messageContent;
        content[e.target.dataset.key] = parseFloat(e.detail.value);

        that.setData({
            messageContent : content,
        });

        if(content.coldwater_reading){
            that.data.coldwater_reading = content.coldwater_reading;
        }
        if(content.hotwater_reading){
            that.data.hotwater_reading = content.hotwater_reading;
        }
        if(content.electric_reading){
            that.data.electric_reading = content.electric_reading;
        }
        if(content.gas_reading){
            that.data.gas_reading = content.gas_reading;
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
                            that.data.coldwater_img = data;
                        }
                        if("hotwater_reading" === imgtype){
                            that.data.hotwater_img = data;
                        }
                        if("electric_reading" === imgtype){
                            that.data.electric_img = data;
                        }
                        if("gas_reading" === imgtype){
                            that.data.gas_img = data;
                        }

                        request.showToast('上传成功!');
                    }else{
                        request.showToast('上传失败!');
                    }
                });

                that.setData({
                    readingImage : tempArray,
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
                });
            }
        })
    },

    /*预览验房图片*/
    previewImage(e){
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.imgFiles // 需要预览的图片http链接列表
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
            para = {room_id : roomid};

        request.storeTableType(para).then(respone=>{
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
        }).catch(e=>{
            console.log(e);
        });
    },

    /*取消办理*/
    cancellation(e){
        wx.switchTab({
            url: '/pages/index/index'
        })
    },

    /*下一步*/
    nextStep(){
        let that          = this.data,
            content       = that.messageContent,
            reading_list  = that.readingList,
            reading_image = that.readingImage;
 
        if(!that.roomNumber){
            request.showToast('请输入房间号');
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

        for(var key in reading_list){
            if(reading_list[key].field === "coldwater_reading" && !content.coldwater_reading){
                request.showToast('请输入冷水表读数');
                return; 
            }else if(reading_list[key].field === "hotwater_reading" && !content.hotwater_reading){
                request.showToast('请输入热水表读数');
                return; 
            }else if(reading_list[key].field === "electric_reading" && !content.electric_reading){
                request.showToast('请输入电表读数');
                return;
            }else if(reading_list[key].field === "gas_reading" && !content.gas_reading){
                request.showToast('请输入燃气表读数');
                return;
            }
        }
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
        that.utility = [];
        if(content.coldwater_reading){
            that.utility.push({ type : "COLD_WATER_METER", reading : parseFloat((content.coldwater_reading).toFixed(2)) , time : time ,image : that.coldwater_img });
        }
        if(content.hotwater_reading){
            that.utility.push({ type : "HOT_WATER_METER", reading : parseFloat((content.hotwater_reading).toFixed(2)) , time : time ,image : that.hotwater_img });
        }
        if(content.electric_reading){
            that.utility.push({ type : "ELECTRIC_METER", reading : parseFloat((content.electric_reading).toFixed(2)) , time : time ,image : that.electric_img });
        }
        if(content.gas_reading){
            that.utility.push({ type : "GAS_METER", reading : parseFloat((content.gas_reading).toFixed(2)) , time : time ,image : that.gas_img });
        }
        that.object.new_meters = that.utility;
        that.object.deposit_money = parseFloat(parseFloat(that.rentDeposit).toFixed(2));
        if(that.imgFiles.length == 0){
            request.showToast('请上传验房照片');
            return
        }
        that.object.new_room_id = that.object.room_id;
        that.object.begin_time = that.rentDate;
        that.object.roomNumber = that.roomNumber;
        that.object.rent_price = that.rentPrice;
        that.object.property_price = that.managementPrice;
        let para = {
                old_room: '',
                new_room: that.object,
                }
            para.old_room = wx.getStorageSync('old_room');
            if(that.rentDate.length<20){
             para.old_room.change_time_e = that.rentDate+'T00:00:00.0+08:00';
            }
            para.new_room = that.object;
            wx.setStorageSync('newChangroomInfo', para);
            wx.navigateTo({
                url : '/pages/changeRoom/housekeepingInfo'
            })
    }   
})
