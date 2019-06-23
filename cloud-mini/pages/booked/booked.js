const utils   = require('../../utils/util.js');
const time    = utils.formatDate(new Date());
const request = require('../../common/request.js');
Page({
    data: {
        roomNuber       : '',
        room_id         : '',
        book_money      : '',
        book_time       : time,
        multiArray      : [
          [{'id':'LONG','multiName':'长租'},{'id':'SHORT','multiName':'短租'}],
          [{ 'id': '12', 'multiName': '12个月' }, { 'id': '11','multiName':'11个月'},{'id':'10','multiName':'10个月'},
           {'id':'9','multiName':'9个月'},{'id':'8','multiName':'8个月'},{'id':'7','multiName':'7个月'},
           {'id':'6','multiName':'6个月'},{'id':'5','multiName':'5个月'},{'id':'4','multiName':'4个月'},
           {'id':'3','multiName':'3个月'},{'id':'2','multiName':'2个月'},{'id':'1','multiName':'1个月'}]
        ],
        multiIndex      : [0, 0],
        rentPrice       : 0,   //房租原价
        managementPrice : 0,    //物业费
        name            : '',
        phone           : '',
        documentArray   : request.cardSelect,
        documentIndex   : 0,
        card_type       : '',
        idcard          : '',
        cardTypeOne     : '身份证',
        clause          : '',
        remark          : '',
        isNewRoomN      : false,
        codeUrl         : '',
        isShowCode      : false
    },

    onLoad(options) {
    },

    nameChange(e){ //姓名
        this.setData({
            name : e.detail.value
        })
    },

    phoneChange(e){ //电话
        this.setData({
            phone : e.detail.value
        })
    },

    /*证件类型*/
    documentChange(e) {
        var that = this;
        that.setData({
          documentIndex : e.detail.value,
          card_type     : that.data.documentArray[e.detail.value].id,
          cardTypeOne   : that.data.documentArray[e.detail.value].name
        })
    },

    /*证件号码*/
    householdID(e) {
        var that = this;
        that.setData({
          idcard : e.detail.value
        })
    },

    roomChange(e){ //房间号
        var that = this;
        if (!that.data.isNewRoomN || (e.detail.value && that.data.roomNuber != e.detail.value)) {
            that.setData({
                roomNuber  : e.detail.value,
                isNewRoomN : true
            })
        }
    },

    isNewRoom(e){
        let that = this;
        if (e.detail.value && e.detail.value == that.data.roomNuber) {
            that.setData({
               isNewRoomN : false
            });
        }
    },

    room(){
        let that = this;
        if(!that.data.isNewRoomN){
            return;
        }

        let para = { room_number : that.data.roomNuber, status : 'BLANK' };
        request.getRoomStauts(para).then(res=>{
            that.data.room_id = res.room_id;
            that.setData({
                rentPrice       : res.rent_price,
                managementPrice : res.property_price
            })
        }).catch(e=>{
            console.log(e)
        })
    },

    bookPriceChange(e){ //定金
        this.setData({
            book_money : e.detail.value
        })
    },

    bookedDateChange(e) { //订房日期
        this.setData({
            book_time : e.detail.value
        })
        this.data.book_time = e.detail.value;
    },

    bindMultiPickerChange(e){ //合同时长
        var that        = this;
        that.setData({
            multiIndex : e.detail.value,
            rentType   : that.data.multiArray[0][that.data.multiIndex[0]].id,
        });
    },

    /*特别条款*/
    clauseChange(e){
        this.setData({
            clause : e.detail.value
        })
    },
 
    remarkChange(e){ //备注
        this.setData({
            remark : e.detail.value
        })
    },

    colseCode() {
        wx.switchTab({
            url : '/pages/index/index',
        });
    },

    makeSure(){  //确认预订
        let this_  = this,
            that   = this_.data;
        let data   = {
            room_id       : that.room_id,
            book_money    : that.book_money,
            begin_time    : that.book_time,
            rent_type     : that.multiArray[0][that.multiIndex[0]].id,
            contract_time : that.multiArray[1][that.multiIndex[1]].id,
            name          : that.name,
            phone         : that.phone,
            card_type     : that.card_type ? that.card_type : '0',
            card_number   : that.idcard,
            special_term  : that.clause,
            remark        : that.remark ? that.remark : '无备注'
        };

        if(!that.name){
            request.showToast('请输入用户姓名');
            return;
        }
        
        if(!that.phone){
            request.showToast('请输入用户电话');
            return;
        }
        
        if(!that.idcard){
            request.showToast('请输入证件号码');
            return;
        }
        
        if(!that.book_money){
            request.showToast('请输入房间订金');
            return;
        }

        if(!that.roomNuber){
            request.showToast('请输入房间号');
            return;
        }

        if(!that.clause){
            request.showToast('请输入特别条款');
            return;
        }

        request.reservation(data).then(res=>{
            let para = { resident_id : res.data.id };
            request.getQRCode(para).then(respone=>{
                this_.setData({
                    isShowCode : true,
                    codeUrl    : respone.url
                });
            }).catch(e=>{
                console.log(e)
            });
        }).catch(e=>{
            console.log(e)
        });
    },
})
