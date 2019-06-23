const utils   = require('../../utils/util.js');
const time    = utils.formatDate(new Date());
const request = require('../../common/request.js');
const commonJ = require('../../common/commonJs.js');
const config  = require('../../common/config.js');
const requestV4   = require('../../common/request_v4.js');
Page({
    data: {
        checkout_id      : '', //退房ID
        room_id          : '', //房间id
        resident_id      : '', //住户id
        store_name       : '', //门店名称
        isInputRoom      : false,
        roomNumber       : '',
        newRoomNumber    : '',
        userInfo         : {},
        countryCodes     : [{id:"NORMAL_REFUND",countryName:"正常退房"},
                            {id:"UNDER_CONTRACT",countryName:"违约退房"}],
        countryCodeIndex : 0,
        checkoutData     : time,
        endContract      : '', //合同结束时间
        checkoutReason   : ["工作调动","室友不和","结束单身","买房","对火花不满","火花清退","不接受涨租","其他原因"],
        reasonIndex      : 0,
        showTScheck      : false,
        checkoutReasonTS : ["换租","转租","纠纷"],
        reasonTSIndex    : 0,
        remark           : '',
        messageContent   : {}, //设备读数
        weightsContent   : {}, //设备权重
        readingList      : [], //读数列表
        readingImage     : [], //读数图片
        imgFiles         : [], //验房照片
        showAddImg       : true,
        object           : {},
        utility          : [], //存储水电表读数
        coldwater_img    : '',
        hotwater_img     : '',
        electric_img     : '',
        gas_img          : '',
        startTime        : commonJ.fun_date(-7),
        endTime          : commonJ.fun_date(7)
    },

    onLoad (options) {
        let that       = this,
            isShowRoom;
            wx.removeStorageSync('checkoutInfo');

        if(options.checkid){
            isShowRoom = true;
            that.getRoomInfo(options.checkid);

            that.setData({
                checkout_id : options.checkid,
            })
        }else{
            isShowRoom = false;
        }
        that.setData({
            isInputRoom : isShowRoom,
        })

        /*获取门店名称*/
        request.getUserInfos().then(res=>{
            that.setData({
                store_name : res[0].store.name,
            });
        }).catch(e=>{
            console.log(e);
        });

        that.data.object.type            = "NORMAL_REFUND";
        that.data.object.reason_e        = that.data.checkoutReason[that.data.reasonIndex];
        that.data.object.special_reason  = that.data.checkoutReasonTS[that.data.reasonTSIndex];
        that.data.object.under_calc_type = "MONTH";
    },
    onshow(){
        wx.removeStorageSync('checkoutInfo');
    },
    /*获取房间信息*/
    getRoomInfo(checkid){
        let that = this,
            para = { checkout_id : checkid };
        request.checkoutInfo(para).then(res=>{
            that.setData({
                roomNumber : res.room.number,
                userInfo   : {
                    name                : res.resident.name,
                    phone               : res.resident.phone,
                    begin_time          : res.resident.begin_time,
                    end_time            : res.resident.end_time,
                    deposit_rent        : res.deposit_r_sum,
                    deposit_other       : res.deposit_o_sum,
                    real_property_costs : res.resident.real_property_costs,
                    real_rent_money     : res.resident.real_rent_money
                }
            })
            that.judgementReading(res.room.id);
            that.data.object.room_id       = res.room.id;
            that.data.object.refund_time_e = time;
            that.data.object.resident_id   = res.resident.id;
        }).catch(e=>{
            console.log(e)
        })
    },

    roomNumberInput(e){   //房间号
        let that = this;
        if (!that.data.newRoomNumber || (e.detail.value && that.data.roomNumber != e.detail.value)) {
            that.setData({
                roomNumber: e.detail.value,
                newRoomNumber : true
            });
        }
    },

    /*判断显示的表读数*/
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
    /*获取退房和住户信息*/
    room(){
        let that      = this,
            roomInfos = [],
            para      = { room_number : that.data.roomNumber };
        if (!that.data.newRoomNumber) {
            return;
        }
        request.checkoutUserInfo(para).then(res=>{
            let checkout_data = "";
            if(res.room_id){
                that.judgementReading(res.room_id);
            }
            if(that.data.object.type === "NORMAL_REFUND"){
                checkout_data = res.end_time;
            }else{
                checkout_data = "";
            }
            that.setData({
                checkoutData : checkout_data,
                userInfo     : res,
                room_id      : res.room_id,
                resident_id  : res.resident_id
            });
            that.data.object.room_id = res.room_id;
            that.data.object.refund_time_e = checkout_data;
            that.data.endContract = checkout_data;
            that.data.object.resident_id = res.resident_id;
        }).catch(e=>{
            console.log(e)
        });
    },
    /*退房类型*/
    bindCountryCodeChange(e){
        let that = this,
            times = that.data.checkoutData,
            show_by_day,
            this_time = that.data.endContract,
            show_ts_check;
        that.setData({
            countryCodeIndex: e.detail.value
        })
        if(e.detail.value != "0" || e.detail.value != 0){
            times = time;
            show_by_day = true;
        }else{
            times = this_time;
            show_by_day = false;
        }
        if(e.detail.value === 2 || e.detail.value === "2"){
            show_ts_check = true;
        }else{
            show_ts_check = false;
        }
        that.setData({
            checkoutData : times,
            showTScheck  : show_ts_check
        })
        that.data.object.type = that.data.countryCodes[that.data.countryCodeIndex].id;
        that.data.object.refund_time_e = times;
        that.data.object.reason_e = that.data.checkoutReason[that.data.reasonIndex];
    },

    /*退租日期*/
    checkoutDate(e){
        this.setData({
            checkoutData : e.detail.value
        })
        this.data.object.refund_time_e = e.detail.value;
    },

    /*退租原因*/
    checkoutReasonChange(e){
        this.setData({
            reasonIndex : e.detail.value
        })
        this.data.object.reason_e = this.data.checkoutReason[this.data.reasonIndex];
    },

    /*特殊退房原因*/
    checkoutReasonTSChange(e){
        this.setData({
            reasonTSIndex : e.detail.value
        })
        this.data.object.special_reason = this.data.checkoutReasonTS[this.data.reasonTSIndex];
    },

    /*备注*/
    inputBankName(e){
        this.setData({
           remark : e.detail.value
        })
        this.data.object.remark_e = e.detail.value;
    },
    
    /*抄表读数*/
    templatesValue(e){
        let that    = this,
            content = that.data.messageContent;
        content[e.target.dataset.key] = e.detail.value;

        that.setData({
            messageContent : content
        });
    },

    /*抄表权重*/
    weightsValue(e){
        let that    = this,
            content = that.data.weightsContent;
        that.setData({
            weightsContent : content
        })
    },

    weights(e){
        let that    = this,
            content = that.data.weightsContent;
        content[e.target.dataset.key] = that.filters(e.detail.value);
        
        that.setData({
            weightsContent : content
        })    
    },

    filters(value){
        var reg = /(^(\d|[1-9]\d)(\.\d{1,2})?$)|(^100(\.0{1,2})?$)/;

        if (!reg.test(value)) {
            value = '';
            request.showToast('输入有误');
            return;
        } else { 
            value = value;
        }
        return value; 
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
                tempArray[index].img = tempFilePaths;

                request.uploadFile(tempArray[index].img).then(respone=>{
                    if(JSON.parse(respone).rescode=== 0){
                        var data = JSON.parse(respone).data.image_url;
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

    /*上传验房图片*/
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
                        request.showToast('上传失败!');
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

    /*下一步*/
    next(e){
        let that          = this.data,
            content       = that.messageContent,
            weights       = that.weightsContent,
            reading_list  = that.readingList,
            reading_image = that.readingImage;

        if(!that.roomNumber){
            request.showToast('请输入房间号');
            return;
        }

        if(!that.remark){
            request.showToast('请输入备注');
            return;
        }

        if(that.showTScheck){
            if(!that.object.special_reason){
                request.showToast("选择特殊退房原因");
                return;
            }
        }else{
            that.object.special_reason = ""; 
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

            if(reading_list[key].field === "coldwater_reading" && !weights.coldwater_reading){
                weights.coldwater_reading = "100";
            }else if(reading_list[key].field === "hotwater_reading" && !weights.hotwater_reading){
                weights.hotwater_reading = "100";
            }else if(reading_list[key].field === "electric_reading" && !weights.electric_reading){
                weights.electric_reading = "100";
            }else if(reading_list[key].field === "gas_reading" && !weights.gas_reading){
                weights.gas_reading = "100";
            }else{}
        }

        for(var key in reading_image){
            if("coldwater_reading" === reading_image[key].type && !reading_image[key].img){
                request.showToast('请传冷水表照片');
                return; 
            }else if("hotwater_reading" === reading_image[key].type && !reading_image[key].img){
                request.showToast('请传热水表照片');
                return;
            }else if("electric_reading" === reading_image[key].type && !reading_image[key].img){
                request.showToast('请传电表照片');
                return;
            }else if("gas_reading" === reading_image[key].type && !reading_image[key].img){
                request.showToast('请传燃气表照片');
                return;
            }
        }
        that.utility = [];
        if(content.coldwater_reading){
            that.utility.push({ type : "COLD_WATER_METER", reading : parseFloat(parseFloat(content.coldwater_reading).toFixed(2)) , time : time , image : that.coldwater_img, weight : parseFloat(parseFloat(weights.coldwater_reading).toFixed(2)) });
        }
        if(content.hotwater_reading){
            that.utility.push({ type : "HOT_WATER_METER", reading : parseFloat(parseFloat(content.hotwater_reading).toFixed(2)) , time : time , image : that.hotwater_img, weight : parseFloat(parseFloat(weights.hotwater_reading).toFixed(2)) });
        }
        if(content.electric_reading){
            that.utility.push({ type : "ELECTRIC_METER", reading : parseFloat(parseFloat(content.electric_reading).toFixed(2)) , time : time , image : that.electric_img, weight : parseFloat(parseFloat(weights.electric_reading).toFixed(2)) });
        }
        if(content.gas_reading){
            that.utility.push({ type : "GAS_METER", reading : parseFloat(parseFloat(content.gas_reading).toFixed(2)) , time : time , image : that.gas_img, weight : parseFloat(parseFloat(weights.gas_reading).toFixed(2)) });
        }
        that.object.meters = that.utility;
        if(that.imgFiles.length == 0){
            request.showToast('请上传验房照片');
            return
        }
        // console.log(that.object)
        // 文件
        let new_object = that.object;
        if(new_object.refund_time_e.length<20){
             new_object.refund_time_e = new_object.refund_time_e+'T00:00:00.0+08:00';
        }
        requestV4.checkoutCalcfee(new_object).then(res=>{
            wx.setStorageSync('checkoutInfo',new_object);
            wx.setStorageSync('checkoutInfo_order',res);
            wx.navigateTo({ url : "/pages/checkOut/calculate"});
        }).catch(e =>{
            console.log(e)
        });
    },

    /*取消办理*/
    goBack(){
        wx.navigateBack({
            data : 1
        })
    },
})
