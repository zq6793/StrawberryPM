const request = require('../../common/request.js');
var app  = getApp();
Page({
    data: {
        documentArray    : request.cardSelect,
        documentIndex    : 0,
        cardTypeOne      : '',
        cardTypeTwo      : '',
        isShowU          : false,
        documentsIndex   : 0,
        filePaths        : [],
        firstUserName    : '',
        userphone        : '',
        idcard           : '',
        seconduserName   : '',
        seconduserPhone  : '',
        idcards          : '',
        emergencyName    : '',
        emergencyNumber  : '',
        emergencyaddress : '',
        emergencyaddressTwo : '',
        imageSrc         : [],
        userId           : '',
        cache            : {}
    },

    onLoad(options) {
        let that  = this;
        let cache = wx.getStorageSync('userDataInfo');

        if(options.id){
            that.pre_person(options.id);
            that.setData({
                userId      : options.id,
                cache       : cache,
                cardTypeOne : "身份证",
                cardTypeTwo : "身份证",
            })
        }
        
        that.setData({
            cache       : cache,
            cardTypeOne : "身份证",
            cardTypeTwo : "身份证",
        });

        that.data.cache.card_type     = '0';
        that.data.cache.card_type_two = '0'; //随住人员的证件类型
    },

    onShow(){
        let that = this.data,
            cache = wx.getStorageSync('userDataInfo'),
            infoObject = wx.getStorageSync('cache');

        if(infoObject.name){
            this.setData({
                firstUserName    : infoObject.name,
                userphone        : infoObject.phone,
                idcard           : infoObject.card_number,
                cardTypeOne      : request.cardType(infoObject.card_type),
                seconduserName   : infoObject.name_two,
                seconduserPhone  : infoObject.phone_two,
                cardTypeTwo      : request.cardType(infoObject.card_type_two),
                idcards          : infoObject.card_number_two,
                emergencyName    : infoObject.alternative,
                emergencyNumber  : infoObject.alter_phone,
                emergencyaddress : infoObject.address,
                emergencyaddressTwo: infoObject.address_two
            })
            that.cache.name            = that.firstUserName;
            that.cache.phone           = that.userphone;
            that.cache.card_number     = that.idcard;
            that.cache.card_type       = infoObject.card_type;
            that.cache.name_two        = that.seconduserName;
            that.cache.phone_two       = that.seconduserPhone;
            that.cache.card_type_two   = infoObject.card_type_two
            that.cache.card_number_two = that.idcards;
            that.cache.alternative     = that.emergencyName;
            that.cache.alter_phone     = that.emergencyNumber;
            that.cache.address         = that.emergencyaddress;
            that.cache.address_two     = that.emergencyaddressTwo;
        }
    },

    pre_person(userId){
        let that      = this,
            imageSrcs = [],
            para      = { resident_id : userId};

        request.getResident(para).then(res=>{
            let resData = res.data;

            that.setData({
                firstUserName    : resData.name,
                userphone        : resData.phone,
                idcard           : resData.card_number,
                emergencyName    : resData.emergency_name,
                emergencyNumber  : resData.emergency_phone,
                emergencyaddress: resData.address
            });

            if(resData.mate){
                that.setData({
                    seconduserName   : resData.mate.name,
                    seconduserPhone  : resData.mate.phone,
                    idcards          : resData.mate.card_number,
                    emergencyaddressTwo: resData.mate.address,
                    isShowU          : true
                });
                that.data.cache.name_two        = that.data.seconduserName;
                that.data.cache.phone_two       = that.data.seconduserPhone;
                that.data.cache.card_number_two = that.data.idcards;
                that.data.cache.card_type_two   = resData.mate.card_type;
                that.data.cache.address_two = that.data.emergencyaddressTwo;
            }else{
                that.setData({
                    seconduserName   : '',
                    seconduserPhone  : '',
                    idcards          : '',
                    emergencyaddressTwo : '',
                    cardTypeTwo      : '身份证',
                    isShowU          : false 
                });               
            }

            that.data.cache.name            = that.data.firstUserName;
            that.data.cache.phone           = that.data.userphone;
            that.data.cache.card_number     = that.data.idcard;
            that.data.cache.alternative     = that.data.emergencyName;
            that.data.cache.alter_phone     = that.data.emergencyNumber;
            that.data.cache.address         = that.data.emergencyaddress;
            that.data.cache.card_type       = resData.card_type;
            that.data.cache.remark          = resData.remark ? resData.remark : ''
        }).catch(e =>{
            console.log(e)
        });
    },

    isShowUser() {
        this.setData({
          isShowU: !this.data.isShowU,
        })
    },

    goBack() {
        wx.navigateBack({
            url: '/pages/information/checkIn'
        })
    },

    catchChooseImage(e) {
        let that      = this,
            index     = e.currentTarget.dataset.imgindex,
            tempArray = that.data.imageSrc;
        wx.chooseImage({
            count      : 1,
            sizeType   : ['compressed'],
            sourceType : ['album', 'camera'],
            success    : (res) => {
                var tempFilePaths = res.tempFilePaths[0];
                tempArray[index]  = tempFilePaths;

                request.uploadCardPhoto(tempArray[index]).then(res=>{
                    if(JSON.parse(res).rescode=== 0){
                        var data = JSON.parse(res).data.image_url;
                        if (index == 0) {
                          var card_one             = data;
                          that.data.cache.card_one = card_one;
                        } else if (index == 1) {
                          var card_two             = data;
                          that.data.cache.card_two = card_two;
                        } else {
                          var card_three             = data;
                          that.data.cache.card_three = card_three;
                        }
                        request.showToast('上传成功');

                        that.setData({
                            imageSrc : tempArray,
                        });
                    }else{
                        request.showToast('上传失败！');
                    }
                   
                }).catch(e =>{
                    console.log(e)
                });
            },
        })
    },
    
    /*住户一姓名*/
    householdName(e) {
        var that = this;
        that.setData({
            firstUserName : e.detail.value
        })
        that.data.cache.name = e.detail.value;
        wx.setStorageSync('cache', that.data.cache);
    },

    /*住户一来联系方式*/
    householdNumber(e) {
        var that = this;
        that.setData({
          userphone: e.detail.value
        })
        that.data.cache.phone = e.detail.value;
        wx.setStorageSync('cache', that.data.cache);
    },

    /*住户一证件类型*/
    documentChange(e) {
        var that = this;
        that.setData({
          documentIndex : e.detail.value,
          cardTypeOne   : that.data.documentArray[e.detail.value].name
        })
        that.data.cache.card_type = that.data.documentArray[that.data.documentIndex].id;
        wx.setStorageSync('cache', that.data.cache);
    },

    /*住户一证件号码*/
    householdID(e) {
        var that = this;
        that.setData({
          idcard: e.detail.value
        })
        that.data.cache.card_number = e.detail.value;
        wx.setStorageSync('cache', that.data.cache);
    },

    /*住户二姓名*/
    householdName2(e) {
        var that = this;
        that.setData({
          seconduserName: e.detail.value
        })
        that.data.cache.name_two = e.detail.value;
        wx.setStorageSync('cache', that.data.cache);
    },

    /*住户二联系方式*/
    householdNumber2(e) {
        var that = this;
        that.setData({
          seconduserPhone: e.detail.value
        })
        that.data.cache.phone_two = e.detail.value;
        wx.setStorageSync('cache', that.data.cache);
    },

    /*住户二证件类型*/
    documentsChange(e) {
        var that = this;
        that.setData({
            documentsIndex : e.detail.value,
            cardTypeTwo    : that.data.documentArray[e.detail.value].name
        })
        that.data.cache.card_type_two = that.data.documentArray[that.data.documentsIndex].id;
        wx.setStorageSync('cache', that.data.cache);
    },

    /*住户二证件号码*/
    householdID2(e) {
        var that = this;
        that.setData({
            idcards: e.detail.value
        })
        that.data.cache.card_number_two = e.detail.value;
        wx.setStorageSync('cache', that.data.cache);
    },
    /* 住户二紧急联系人地址*/
    emergencyadd2(e){
        var that = this;
        that.setData({
            emergencyaddressTwo: e.detail.value
        })
        that.data.cache.address_two = e.detail.value;
        wx.setStorageSync('cache', that.data.cache);
    },
    /*紧急联系人姓名*/
    emergencyContact(e) {
        var that = this;
        that.setData({
          emergencyName: e.detail.value
        })
        that.data.cache.alternative = e.detail.value;
        wx.setStorageSync('cache', that.data.cache);
    },
    
    /*紧急联系方式*/
    emergencyNumber(e) {
        var that = this;
        that.setData({
          emergencyNumber: e.detail.value
        })
        that.data.cache.alter_phone = e.detail.value;
        wx.setStorageSync('cache', that.data.cache);
    },

    /*住户一紧急联系人地址*/
    emergencyadd(e){
        var that =this;
        that.setData({
           emergencyaddress: e.detail.value
        })
        that.data.cache.address = e.detail.value;
        wx.setStorageSync('cache', that.data.cache);
    },

   
    submit(){
        var that = this.data;

        if (!that.firstUserName) {
            request.showToast('请输入住户姓名');
            return;
        } 

        if (!that.userphone) {
            request.showToast('请输入住户电话');
            return;
        } 
        if (!that.idcard) {
            request.showToast('请输入身份证');
            return;
        } 

        if (!that.emergencyName) {
            request.showToast('请输入联系人姓名');
            return;
        } 

        if (!that.emergencyNumber) {
            request.showToast('请输入联系人电话');
            return;
        }

        if (!that.emergencyaddress) {
            request.showToast('请输入联系人地址');
            return;
        }

        if (that.cache.card_one === undefined || that.cache.card_two === undefined || that.cache.card_three === undefined){
            request.showToast('请上传身份证照片');
            return;
        }
    },

    confirm() {
        let that        = this.data;
        let use_id      = that.userId,
            requestUrl  = "/pages/information/order?id="+use_id;

        let requestData = {
            room_id             : that.cache.room_id,
            begin_time          : that.cache.begin_time,
            people_count        : that.cache.people_count,
            rent_type           : that.cache.rent_type,
            short_rent_price    : that.cache.short_rent_price ? that.cache.short_rent_price : '',
            contract_time       : that.cache.contract_time,
            discount_id         : that.cache.discount_id,
            first_pay_money     : that.cache.first_pay_money,
            deposit_money       : that.cache.deposit_money,
            deposit_month       : that.cache.deposit_month,
            tmp_deposit         : that.cache.tmp_deposit,
            name                : that.cache.name,
            phone               : parseInt(that.cache.phone),
            card_type           : that.cache.card_type,
            card_number         : that.cache.card_number,
            card_one            : that.cache.card_one,
            card_two            : that.cache.card_two,
            card_three          : that.cache.card_three,
            alternative         : that.cache.alternative,
            alter_phone         : parseInt(that.cache.alter_phone),
            address             : that.cache.address,
            pay_frequency       : that.cache.pay_frequency,
            real_rent_money     : that.cache.real_rent_money,
            real_property_costs : that.cache.real_property_costs,
            name_two            : that.cache.name_two ? that.cache.name_two : '',
            phone_two           : parseInt(that.cache.phone_two) ? parseInt(that.cache.phone_two) : '',
            card_type_two       : that.cache.card_type_two,
            card_number_two     : that.cache.card_number_two ? that.cache.card_number_two : '',
            remark              : that.cache.remark ? that.cache.remark : '无',
            special_term        : that.cache.special_term ? that.cache.special_term : "",
            electric_reading    : that.cache.electric_reading ? that.cache.electric_reading : '',
            coldwater_reading   : that.cache.coldwater_reading ? that.cache.coldwater_reading : '',
            hotwater_reading    : that.cache.hotwater_reading ? that.cache.hotwater_reading : '',
            gas_reading         : that.cache.gas_reading ? that.cache.gas_reading : '',
            electric_image      : that.cache.electric_image ? that.cache.electric_image : '',
            coldwater_image     : that.cache.coldwater_image ? that.cache.coldwater_image : '',
            gas_image           : that.cache.gas_image ? that.cache.gas_image : '',
            hotwater_image      : that.cache.hotwater_image ? that.cache.hotwater_image : '',
            check_images        : that.cache.check_images ? that.cache.check_images.join(',') : ''
        }

        if(use_id){
            if(!that.firstUserName || !that.userphone || !that.idcard || !that.emergencyName 
                || !that.emergencyNumber || !that.emergencyaddress 
                || that.cache.card_one === undefined || that.cache.card_two === undefined || that.cache.card_three === undefined){
                this.submit();
            }else{
                requestData['resident_id'] = use_id;
                request.bookToCheckin(requestData).then(res=>{
                    wx.navigateTo({
                        url : requestUrl
                    })
                    wx.removeStorageSync('cache');
                }).catch(e=>{
                    console.log(e);
                })
            }
        }else{
            if(!that.firstUserName || !that.userphone || !that.idcard || !that.emergencyName 
                || !that.emergencyNumber || !that.emergencyaddress
                || that.cache.card_one === undefined || that.cache.card_two === undefined || that.cache.card_three === undefined){
                this.submit();
            }else{
                request.checkin(requestData).then(res=>{
                    wx.navigateTo({
                        url : "/pages/information/order?id=" + res.resident_id
                    })
                    wx.removeStorageSync('cache');
                }).catch(e=>{
                    console.log(e)
                });
            }
        }
    }
})
