const request            = require('../../common/request.js');
const view_contract_link = wx.getStorageSync('view_contract_link') || {};
const app                = getApp();
Page({
    data: {
        resident_id       : '',
        imageList         : [],
        userInfo          : {},
        cardType          : '',
        mateCardType      : '',
        password          : '',
        roomId            : 0,
        status            : '',
        contract_id       : '',
        contract_url      : '',
        isCheckContract   : false,
        book_contract_id  : '',
        book_contract_url : '',
        isContractBook    : false,
        pre_contract_id   : '',
        pre_contract_url  : '',
        isDepositContract : false,
        fellowResidents   : [], //同住人
        preDeposit        : '', //预存金
        object            : {},
        cohabit           : false, 
    },

    onLoad (options) {
        let that = this,
            cohabit;

        if(app.globalData.tongzhuren){
            cohabit = true;
        }else{
            cohabit = false;
        }
    

        that.setData({
            resident_id : options.id,
            cohabit     : cohabit
        })

        that.getUserInfo();

        /*获取预存金*/
        let para = { resident_id : options.id };
        request.getPredeposit(para).then(res=>{
            that.setData({
                preDeposit : res.premoney
            })
        }).catch(e=>{
            console.log(e);
        });

        /*获取同住人信息*/
        request.listCoresident(para).then(res=>{
            that.setData({
                fellowResidents : res.resindet
            })
        }).catch(e=>{
            console.log(e);
        });
    },

    getUserInfo(){
        let that = this,
            para = {id : that.data.resident_id};

        request.household(para).then(res=>{
            let data       = res,
                card_one   = data.card_one,
                card_two   = data.card_two,
                card_three = data.card_three;

            if(data.contract.length > 0){
                that.setData({
                    contract_id  : data.contract[0].id,
                    contract_url : data.contract[0].view_url,
                    isContract   : data.contract[0].status === 'SIGNING' ? true : false,
                });
                that.data.object.checkin_url = data.contract[0].view_url;
            }

            that.setData({
                userInfo     : data,
                imageList    : [card_one, card_two, card_three],
                roomId       : data.room_id,
                cardType     : request.cardType(data.card_type),
                mateCardType : data.card_type_two ? request.cardType(data.card_type_two) : null,
                status       : request.roomStatus(res.status),
            });

            if(data.reserve_contract.length > 0){
                that.setData({
                    book_contract_id  : data.reserve_contract[0].id,
                    book_contract_url : data.reserve_contract[0].view_url,
                    isContractBook    : data.reserve_contract[0].status === 'SIGNING' ? true : false,
                })
                that.data.object.book_url = data.reserve_contract[0].view_url;
            }

            if(data.deposit_contract.length > 0){
                that.setData({
                    pre_contract_id   : data.deposit_contract[0].id,
                    pre_contract_url  : data.deposit_contract[0].view_url,
                    isDepositContract : data.deposit_contract[0].status === 'SIGNING' ? true : false,
                })
                that.data.object.deposit_url = data.deposit_contract[0].view_url;
            }

            wx.setStorageSync('view_contract_link', that.data.object);
        }).catch(e=>{
            console.log(e);
        });
    },
    
    resetPassword(){
        let that    = this,
            roomId  = that.data.roomId;

        wx.showModal({
            title       : '提醒',
            content     : '该操作会导致现有密码失效，确定重置吗？',
            showCancel  : true,
            success     : function (res) {
              
            }
        });
    },

    /*转为其他押金*/
    conversionOtherDeposit(e){
        let that = this,
            para = { resident_id : that.data.resident_id };

        request.depositOthermoney(para).then(res=>{
            request.showToast("您已转成功！");
            that.getUserInfo();
        }).catch(e=>{
            console.log(e);
        });
    },

    /*查看详情*/
    info(){
        wx.navigateTo({
            url : '/pages/residentCenter/residentialInfo?id='+ this.data.resident_id
        });
    },

    showIdCardImg (e) {
        wx.previewImage({
            current : e.currentTarget.dataset.url,
            urls    : this.data.imageList
        });
    },

    /*拨打电话*/
    calling(e){
        let phone   = e.currentTarget.dataset.phone;

        wx.makePhoneCall({
            phoneNumber : phone
        });
    },

    /*查看合同*/
    viewContract(e){
        let contract_type = e.currentTarget.dataset.type;
        wx.navigateTo({
            url : '/pages/residentCenter/viewContract?type='+contract_type
        });
    },

    /*签署合同*/
    signingContract(e){
        let that          = this.data,
            contract_id   = '',
            contract_type = e.currentTarget.dataset.type,
            para          = { contract_ids : contract_id};
            
        if(contract_type === "checkin"){
            contract_id = data.contract_id;
        }else if(contract_type === "book"){
            contract_id = data.book_contract_id;
        }else if(contract_type === "predeposit"){
            contract_id = data.pre_contract_id;
        }
        
        request.contractAward(para).then(res=>{
            request.showToast('您已签署成功');
        }).catch(e=>{
            console.log(e);
        });
    }
});