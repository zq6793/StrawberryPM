const utils       = require('../../utils/util.js');
const time        = utils.formatDate(new Date());
const request     = require('../../common/request.js');
const requestV4   = require('../../common/request_v4.js');
Page({
    data: {
        userInfo         : {},
        roomNumber       : '',
        store_name       : '',
        store_id         : '',
        countryCodes     : [{id:"CUSTOMER",countryName:"租客自己转租"},
                            {id:"COMPANY",countryName:"委托甲方转租"}],
        countryCodeIndex : 0,
        transform_time_e : time,
        showTScheck      : false,
        remark           : '',
        messageContent   : {}, //设备读数
        weightsContent   : {}, //设备权重
        readingList      : [], //读数列表
        readingImage     : [], //读数图片
        imgFiles         : [], //验房照片
        showAddImg       : true,
        utility          : [], //存储水电表读数
        coldwater_img    : '',
        hotwater_img     : '',
        electric_img     : '',
        gas_img          : '',
        userInfo_temp    : '',
        subletRoomInfo   : new Object(),
    },
    onLoad (options) {
        let that       = this;
        // that.setData({
        //         transform_time_e : util.formatDate(new Date()),
        //     });      

        /*获取门店名称*/
        request.getUserInfos().then(res=>{
            that.setData({
                store_name : res[0].store.name,
                store_id   : res[0].store_id
            });
        }).catch(e=>{
            console.log(e)
        });

        that.data.subletRoomInfo.type   = "CUSTOMER";
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
        let that      = this;
        let para = {
            store_id: that.data.store_id,
            number: that.data.roomNumber,
            }
            requestV4.getResidentInfobyRoom(para).then(res=>{
            res.resident.begin_time = requestV4.interceptData(res.resident.begin_time)
            res.resident.end_time = requestV4.interceptData(res.resident.end_time)
            that.setData({
               userInfo       : res.resident,
               userInfo_temp  : res,
               room_id        : res.room.ID,
               resident_id    : res.resident.ID
            });
            that.judgementReading(res.room.ID);
            that.data.subletRoomInfo.room_id = res.room.ID;
            that.data.subletRoomInfo.resident_id = res.resident.ID;
        }).catch(e=>{
            console.log(e);
        });
    },

    /*退房类型*/
    bindCountryCodeChange(e){
        let that = this;
        that.setData({
            countryCodeIndex: e.detail.value
        })

        that.data.subletRoomInfo.type = that.data.countryCodes[that.data.countryCodeIndex].id;
    },

    /*退租日期*/
    checkoutDate(e){
        this.setData({
            transform_time_e : e.detail.value
        })
        this.data.subletRoomInfo.transform_time_e = e.detail.value;
    },

    /*备注*/
    inputBankName(e){
        this.setData({
           remark : e.detail.value
        })
        this.data.subletRoomInfo.remark = e.detail.value;
    },
    
    /*抄表读数*/
    templatesValue(e){
        let that    = this,
            content = that.data.messageContent;
        content[e.target.dataset.key] = parseFloat(e.detail.value);

        that.setData({
            messageContent : content
        });
    },

    /*抄表权重*/
    weightsValue(e){
        let that    = this,
            content = parseFloat(that.data.weightsContent);

        // if(e.detail.value >= 100 && e.detail.value >= 0){
        //     request.showToast('请输入0~100');
        //     return;
        // }

        // content[e.target.dataset.key] = that.filters(e.detail.value);
        
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
                        that.data.subletRoomInfo.check_images = tempArray;
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

            that.data.subletRoomInfo.check_images = res;
        });
    },

    /*下一步*/
    next(e){
        let that          = this.data,
            content       = that.messageContent,
            weights       = that.weightsContent,
            reading_list  = that.readingList,
            reading_image = that.readingImage;

        if(!that.subletRoomInfo.room_id){
            request.showToast('请输入房间号');
            return;
        }
        if(!that.subletRoomInfo.transform_time_e){
            request.showToast('请选择退租时间!');
            return;
        }

        if(!that.remark){
            request.showToast('请输入备注');
            return;
        }

        // if(that.showTScheck){
        //     if(!that.object.special_reason){
        //         request.showToast("选择特殊退房原因");
        //         return;
        //     }
        // }
        // // commonJ.readingInfo(content,weights,reading_list,reading_image,that.utility,time,that.coldwater_img,that.hotwater_img,that.electric_img,that.gas_img,res=>{
        //     console.log(res)
        //     // that.object.utility = JSON.stringify(res);
        // });
        // return
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
                weights.coldwater_reading = 100;
            }else if(reading_list[key].field === "hotwater_reading" && !weights.hotwater_reading){
                weights.hotwater_reading = 100;
            }else if(reading_list[key].field === "electric_reading" && !weights.electric_reading){
                weights.electric_reading = 100;
            }else if(reading_list[key].field === "gas_reading" && !weights.gas_reading){
                weights.gas_reading = 100;
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
            that.utility.push({ type : "COLD_WATER_METER", reading : parseFloat((content.coldwater_reading).toFixed(2)) , time : time , image : that.coldwater_img, weight : parseFloat((weights.coldwater_reading).toFixed(2)) });
        }
        if(content.hotwater_reading){
            that.utility.push({ type : "HOT_WATER_METER", reading : parseFloat((content.hotwater_reading).toFixed(2)) , time : time , image : that.hotwater_img, weight : parseFloat((weights.hotwater_reading).toFixed(2)) });
        }
        if(content.electric_reading){
            that.utility.push({ type : "ELECTRIC_METER", reading : parseFloat((content.electric_reading).toFixed(2)) , time : time , image : that.electric_img, weight : parseFloat((weights.electric_reading).toFixed(2)) });
        }
        if(content.gas_reading){
            that.utility.push({ type : "GAS_METER", reading : parseFloat((content.gas_reading).toFixed(2)) , time : time , image : that.gas_img, weight : parseFloat((weights.gas_reading).toFixed(2)) });
        }

        that.subletRoomInfo.meters = that.utility;

        if(that.imgFiles.length == 0){
            request.showToast('请上传验房照片');
            return
        }
        that.subletRoomInfo.transform_time_e = that.transform_time_e+'T00:00:00.0+08:00';
        let cache = new Object();
        cache.old_room = that.subletRoomInfo
   requestV4.subletCalcfee(cache).then(res=>{
            /*判断退租的类型*/
        wx.setStorageSync('subletRoomInfo', cache);
        wx.setStorageSync('subletRoomInfoCalcfee', res);
        wx.navigateTo({
            url : "/pages/sublet/subletBalance"
        });
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
