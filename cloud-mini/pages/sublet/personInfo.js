const request = require('../../common/request.js');
const requestV4   = require('../../common/request_v4.js');
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
        imageSrc         : [],
        userId           : '',
        newroomInfo      : {}
    },

    onLoad() {
        let that  = this;
        let newroomInfo = new Object();
        newroomInfo.card_type     = '0';
        newroomInfo.card_type_two = '0'; //随住人员的证件类型
        this.setData({
            newroomInfo : newroomInfo
        })
    },

    onShow(){
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
                emergencyaddress : resData.address,
            });

            if(resData.mate){
                that.setData({
                    seconduserName   : resData.mate.name,
                    seconduserPhone  : resData.mate.phone,
                    idcards          : resData.mate.card_number,
                    isShowU          : true
                });
                that.data.newroomInfo.name_two        = that.data.seconduserName;
                that.data.newroomInfo.phone_two       = that.data.seconduserPhone;
                that.data.newroomInfo.card_number_two = that.data.idcards;
                that.data.newroomInfo.card_type_two   = resData.mate.card_type;
            }else{
                that.setData({
                    seconduserName   : '',
                    seconduserPhone  : '',
                    idcards          : '',
                    cardTypeTwo      : '身份证',
                    isShowU          : false 
                });               
            }

            that.data.newroomInfo.name            = that.data.firstUserName;
            that.data.newroomInfo.phone           = that.data.userphone;
            that.data.newroomInfo.card_number     = that.data.idcard;
            that.data.newroomInfo.alternative     = that.data.emergencyName;
            that.data.newroomInfo.alter_phone     = that.data.emergencyNumber;
            that.data.newroomInfo.address         = that.data.emergencyaddress;
            that.data.newroomInfo.card_type       = resData.card_type;
            that.data.newroomInfo.remark          = resData.remark ? resData.remark : ''
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
            url: '/pages/sublet/personInfo'
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
                          that.data.newroomInfo.card_one = card_one;
                        } else if (index == 1) {
                          var card_two             = data;
                          that.data.newroomInfo.card_two = card_two;
                        } else {
                          var card_three             = data;
                          that.data.newroomInfo.card_three = card_three;
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
        that.data.newroomInfo.name = e.detail.value;
        wx.setStorageSync('newroomInfo', that.data.newroomInfo);
    },

    /*住户一来联系方式*/
    householdNumber(e) {
        var that = this;
        that.setData({
          userphone: e.detail.value
        })
        that.data.newroomInfo.phone = e.detail.value;
        wx.setStorageSync('newroomInfo', that.data.newroomInfo);
    },

    /*住户一证件类型*/
    documentChange(e) {
        var that = this;
        that.setData({
          documentIndex : e.detail.value,
          cardTypeOne   : that.data.documentArray[e.detail.value].name
        })
        that.data.newroomInfo.card_type = that.data.documentArray[that.data.documentIndex].id;
        wx.setStorageSync('newroomInfo', that.data.newroomInfo);
    },

    /*住户一证件号码*/
    householdID(e) {
        var that = this;
        that.setData({
          idcard: e.detail.value
        })
        that.data.newroomInfo.card_number = e.detail.value;
        wx.setStorageSync('newroomInfo', that.data.newroomInfo);
    },

    /*住户二姓名*/
    householdName2(e) {
        var that = this;
        that.setData({
          seconduserName: e.detail.value
        })
        that.data.newroomInfo.name_two = e.detail.value;
        wx.setStorageSync('newroomInfo', that.data.newroomInfo);
    },

    /*住户二联系方式*/
    householdNumber2(e) {
        var that = this;
        that.setData({
          seconduserPhone: e.detail.value
        })
        that.data.newroomInfo.phone_two = e.detail.value;
        wx.setStorageSync('newroomInfo', that.data.newroomInfo);
    },

    /*住户二证件类型*/
    documentsChange(e) {
        var that = this;
        that.setData({
            documentsIndex : e.detail.value,
            cardTypeTwo    : that.data.documentArray[e.detail.value].name
        })
        that.data.newroomInfo.card_type_two = that.data.documentArray[that.data.documentsIndex].id;
        wx.setStorageSync('newroomInfo', that.data.newroomInfo);
    },

    /*住户二证件号码*/
    householdID2(e) {
        var that = this;
        that.setData({
            idcards: e.detail.value
        })
        that.data.newroomInfo.card_number_two = e.detail.value;
        wx.setStorageSync('newroomInfo', that.data.newroomInfo);
    },

    /*紧急联系人姓名*/
    emergencyContact(e) {
        var that = this;
        that.setData({
          emergencyName: e.detail.value
        })
        that.data.newroomInfo.alternative = e.detail.value;
        wx.setStorageSync('newroomInfo', that.data.newroomInfo);
    },
    
    /*紧急联系方式*/
    emergencyNumber(e) {
        var that = this;
        that.setData({
          emergencyNumber: e.detail.value
        })
        that.data.newroomInfo.alter_phone = e.detail.value;
        wx.setStorageSync('newroomInfo', that.data.newroomInfo);
    },

    /*紧急联系地址*/
    emergencyadd(e){
        var that =this;
        that.setData({
           emergencyaddress: e.detail.value
        })
        that.data.newroomInfo.address = e.detail.value;
        wx.setStorageSync('newroomInfo', that.data.newroomInfo);
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

        if (that.newroomInfo.card_one === undefined || that.newroomInfo.card_two === undefined || that.newroomInfo.card_three === undefined){
            request.showToast('请上传身份证照片');
            return;
        }
    },

    confirm() {
        let that        = this.data;
        console.log(that.newroomInfo);
        let para = new Object();
        para = wx.getStorageSync('subletRoomInfo');
        para.new_room = that.newroomInfo;
        console.log(para);
        wx.showModal({
            title: '提示',
            content: '确定提交，提交后将释放房态且不可撤销！',
            success: function (res) {
                if (res.confirm) {
                    requestV4.subletConfirm(para).then(res=>{
                        wx.switchTab({
                           url : '/pages/index/index',
                        });
                    }).catch(e =>{
                        console.log(e)
                    });
                }else{
                    console.log("点击了取消")
                }
            }
        })
    }
})
