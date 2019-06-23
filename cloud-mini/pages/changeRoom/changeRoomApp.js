const utils       = require('../../utils/util.js');
const request     = require('../../common/request.js');
const requestV4   = require('../../common/request_v4.js');
const time        = utils.formatDate(new Date());
const oldRoomInfo = wx.getStorageSync('roomInfo') || {};
const app         = getApp();
Page({
    data: {
        room_id         : '', //房间id
        store_id        : "",
        resident_id     : '', //住户id
        roomNumber      : '',
        store_name      : '', //门店名称
        reason          : "",
        userInfo        : {}, //住户信息
        messageContent  : {}, //设备读数
        readingList     : [], //读数列表
        readingImage    : [], //读数图片
        imgFiles        : [], //验房图片
        showAddImg      : true,
        object          : {},
        utility         : [], //存储水电表读数
        coldwater_img   : '',
        hotwater_img    : '',
        electric_img    : '',
        gas_img         : ''
    },

    onLoad (options) {
        var that = this;

        /*获取门店名称*/
        request.getUserInfos().then(res=>{
            that.setData({
                store_name : res[0].store.name,
                store_id   : res[0].store_id
            });
        }).catch(e=>{
            console.log(e)
        });
    },

    onShow(){
        
    },

    /*房间号*/
    roomNumberInput(e){
        let that = this;
        if (!that.data.newRoomNumber || (e.detail.value && that.data.roomNumber != e.detail.value)) {
            that.setData({
                roomNumber    : e.detail.value,
                newRoomNumber : true
            });
        }
    },

    /*获取退房和住户信息*/
    room(){
        let that      = this,
            roomInfos = [];
        if (!that.data.newRoomNumber) {
            return;
        }

        let para = "?store_id="+ that.data.store_id +"&number="+ that.data.roomNumber;
        requestV4.roomUserInfo(para).then(res=>{
            console.log(res)
            // let data = res.res;
            // that.setData({
            //    userInfo    : data,
            //    room_id     : data.room_id,
            //    resident_id : data.resident_id
            // });

            // that.judgementReading(data.resident.room_id);
            // that.data.object.o_room_id = data.resident.room_id;
        }).catch(e=>{
            console.log(e);
        });
    },

    /*换房理由*/
    reason(e){
        this.setData({
            reason : e.detail.value
        })
        this.data.object.reason = e.detail.value;
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
                        that.data.object.o_check_images = tempArray;
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

            that.data.object.o_check_images = JSON.stringify(res);
        });
    },

    /*判断需要传什么读数*/
    judgementReading(roomid){
        let that = this;

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
        wx.navigateBack({
            delta : 1
        })
    },

    /*确认办理*/
    nextStep(){
        let that          = this.data,
            content       = that.messageContent,
            reading_list  = that.readingList,
            reading_image = that.readingImage;

        if (!that.reason) {
            request.showToast('请输入换房理由');
            return; 
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

        that.object.o_utility = JSON.stringify(that.utility);

        if(that.imgFiles.length == 0){
            request.showToast('请上传验房照片');
            return
        }

        wx.setStorageSync('oldRoomInfo', that.object);
        
        wx.navigateTo({
            url : '/pages/changeRoom/changeRoomInfo'
        })
    }
})
