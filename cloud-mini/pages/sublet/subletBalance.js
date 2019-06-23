const utils   = require('../../utils/util.js');
const time    = utils.formatDate(new Date());
const request = require('../../common/request.js');
const requestV4   = require('../../common/request_v4.js');
Page({
    data: {
        unpay_fees          : '',
        unpay_fees_total    : 0,
        payd_fees           : '',
        payd_fees_total     : 0, 
        fees_total          : 0, 
        costTypeIndex       : 0,
        costType        : request.orderTypeSelect, //添加账单类型 
        bankAccount     : '',
        bankCardNumber  : '',
        bankList        : [],
        bankIndex       : 0,
        bankListCity    : [],
        cityIndex       : [0,0],
        branchInfo      : '',
        bankPhoto       : [],
        idPhoto         : [],
        provinceList    : [], //省列表
        bank_name       : '', //开户银行
        provinces       : '', //省
        citys           : '', //市
        object          : {},
        showCheck       : true,
        account         : {},
        bankImg         : [],
        idCardImg       : [],
        checkoutType    : '',
        add_order_fee   : [],
        addReceivables  : [],
    },

    onLoad (options) {
        let that  = this;
        let temp_all_pay_fee = wx.getStorageSync('subletRoomInfoCalcfee'),
        addReceivables = wx.getStorageSync('add_order_fee'),
        unpay_fees           = temp_all_pay_fee.input_order,
        unpay_fees_total    = 0,
        payd_fees           = temp_all_pay_fee.output_order,
        payd_fees_total     = 0, 
        fees_total          = 0,
        cache               = wx.getStorageSync('subletRoomInfo');
        for(var key in unpay_fees){
            unpay_fees_total += parseFloat(unpay_fees[key].money);
        }
        if(addReceivables.length>0){
            for(var key in addReceivables){
                unpay_fees.concat(addReceivables[key].money)
                unpay_fees_total += parseFloat(addReceivables[key].money)
            }
        }
        // 旧房间待支付信息
        for(var key in payd_fees){
            payd_fees_total += parseFloat(payd_fees[key].money);
        }
        that.setData({
                payd_fees              : payd_fees,
                payd_fees_total        : payd_fees_total.toFixed(2),
                unpay_fees             : unpay_fees,
                unpay_fees_total       : unpay_fees_total.toFixed(2),
                fees_total             : (parseFloat(payd_fees_total.toFixed(2)) - parseFloat(unpay_fees_total.toFixed(2))),
                object                 : cache.old_room,
            })
        /*获取银行*/
        request.getBankList().then(res=>{
            that.setData({
                bankList  : res
            })
        }).catch(e =>{
            console.log(e)
        });

        /*获取省*/
        request.getProvinceList().then(res=>{
            that.setData({
                provinceList : res.province
            })

            that.getCity(res.province[0].province_id);
        }).catch(e =>{
            console.log(e)
        });
        wx.removeStorageSync('add_order_fee');
    },

    onShow(){
        let that = this,
        addReceivables = wx.getStorageSync('add_order_fee');
        if(addReceivables){
            console.log("ee")
            let add_order_fee  = that.data.add_order_fee;
            if(add_order_fee.length>=1){
                add_order_fee[add_order_fee.length] = addReceivables[0];
            }else{
                add_order_fee = addReceivables;
            }
            that.setData({
                add_order_fee   : add_order_fee,
            })
            that.sumfee();
        }
        wx.removeStorageSync('add_order_fee');
    },

    /*预览银行卡图片*/
    previewBank(e){
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.bankImg // 需要预览的图片http链接列表
        })
    },

    /*预览身份证图片*/
    previewIdCard(e){
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.idCardImg // 需要预览的图片http链接列表
        })
    },

    /*获取城市信息*/
    getCity(province_id){
        let that  = this,
            citys = [],
            para  = { province_id : province_id };

        request.getCityList(para).then(res=>{
            for(var key in res.city){
                citys.push({ province: res.city[key].city});
            }

            that.setData({
                bankListCity : [ that.data.provinceList, citys]
            })
        }).catch(e =>{
            console.log(e)
        });
    },

    /*添加费用*/
    choosePay(){
        wx.navigateTo({
            url : '/pages/sublet/addorder',
        });
    },

    /*删除添加的应收费用*/
    deteleOrder(e){
        let that = this;
        that.delfee();
        wx.removeStorageSync('add_order_fee');
        let new_order = that.data.add_order_fee;
        new_order.splice(e.currentTarget.dataset.index,1);
        that.setData({
        add_order_fee   : new_order
        })
    },
    //费用计算
    sumfee(){
        // 获取添加的费用
        let that  = this,
        new_order = that.data.add_order_fee,
        unpay_fees_total = that.data.unpay_fees_total,
        fees_total       = that.data.fees_total,
        temp_fee      = 0;
        //添加费用的总和
        if(new_order.length>=1){
        temp_fee = parseFloat(new_order[(new_order.length-1)].money);
        // 应付金额 unpay_fees_total
        // 应退金额 fees_total
        }
        unpay_fees_total = parseFloat(unpay_fees_total) + temp_fee;
        fees_total = parseFloat(fees_total) - temp_fee;
        if(fees_total<0){
            new_order.splice((new_order.length-1),1);
            that.setData({
              add_order_fee   : new_order
            })
            request.showToast('退款额不能小于0');
        }else{
            that.setData({
                unpay_fees_total   : unpay_fees_total.toFixed(2),
                fees_total   : fees_total.toFixed(2)
            })
        }
    },
       //费用计算
    delfee(){
        // 获取添加的费用
        let that  = this,
        new_order = that.data.add_order_fee,
        unpay_fees_total = that.data.unpay_fees_total,
        fees_total       = that.data.fees_total,
        temp_fee      = 0;
        //添加费用的总和
        if(new_order.length>=1){
        temp_fee = parseFloat(new_order[(new_order.length-1)].money);
        // 应付金额 unpay_fees_total
        // 应退金额 fees_total
        }
        unpay_fees_total = parseFloat(unpay_fees_total) - temp_fee;
        fees_total = parseFloat(fees_total) + temp_fee;   
        that.setData({
            unpay_fees_total   : unpay_fees_total.toFixed(2),
            fees_total   : fees_total.toFixed(2)
        })
    },
    /*输入退款账户开户人姓名*/
    inputAccount (e) {
        this.setData({
            bankAccount : e.detail.value
        });
        this.data.object.account = e.detail.value;
    },

    /*输入退款账户银行卡号码*/
    inputBankCardNumber (e) {
        this.setData({
            bankCardNumber  : e.detail.value,
        });
        this.data.object.bank_card_number = e.detail.value
    },

    /*选择退款银行*/
    bankList(e){
        this.setData({
            bankIndex : e.detail.value
        })
        this.data.object.bank_name = this.data.bankList[e.detail.value];
    },

    /*选择退款银行省市信息*/
    bankListCity(e){
        let that =this;
        that.setData({
            cityIndex : e.detail.value
        });
        that.data.object.provinces = that.data.bankListCity[0][that.data.cityIndex[0]].province;
        that.data.object.citys     = that.data.bankListCity[1][that.data.cityIndex[1]].province;
    },

    bankListCitys(e){
        let that = this;
        let data = {
            bankListCity : that.data.bankListCity,
            cityIndex    : that.data.cityIndex
        };
        switch (e.detail.column) {
            case 0:
                that.getCity(that.data.bankListCity[0][e.detail.value].province_id);
                break;
            data.cityIndex[1] = 0;
        }
    },

    /*请填写开户行支行信息*/
    branchInfos(e){
        let that =this;
        that.setData({
            branchInfo : e.detail.value,
        })
        that.data.object.branchInfo = e.detail.value;
    },

    /*上传银行卡照片*/
    uploadOrPreview(e){
        let that      = this,
            index     = e.currentTarget.dataset.imgindex,
            tempArray = that.data.bankPhoto;

        wx.chooseImage({
            count      : 1,
            sizeType   : ['compressed'],
            sourceType : ['album', 'camera'],
            success    : (res) => {
                var tempFilePaths = res.tempFilePaths[0];
                tempArray[index] = tempFilePaths;

                request.uploadCardPhoto(tempArray[index]).then(respone=>{
                    if(JSON.parse(respone).rescode=== 0){
                        var data = JSON.parse(respone).data.image_url;

                        that.data.bankPhoto[index] = data;
                        if('0' === index){
                            that.data.object.bank_card_front_img = data;
                        }

                        if('1' === index){
                            that.data.object.bank_card_back_img = data;
                        }

                        if('2' === index){
                            that.data.object.card_front_img = data;
                        }
                        
                        if("3" === index){
                            that.data.object.card_back_img = data;
                        }
                        request.showToast('上传成功!');
                        that.setData({
                            bankPhoto : tempArray,
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

    /*确认验房*/
    confirm(e){
        let that         = this,
            that_d       = that.data.object;
            that_d.bank  = that_d.bank_name+that_d.provinces+that_d.citys+that_d.branchInfo;
        let new_order = that.data.add_order_fee;
        if(new_order.length>=1){
            that_d.add_fee = new_order;
        }

        if(!that.data.object.account){
            request.showToast('输入退款账户名');
            return;
        }

        if(!that.data.object.bank_card_number){
            request.showToast('输入退款账号');
            return;
        }

        if(!that_d.branchInfo){
            request.showToast('输入支行信息');
            return;
        }

        if(!that.data.object.bank_card_front_img || !that.data.object.bank_card_back_img){
            request.showToast('请传银行卡照片');
            return;
        }

        if(!that.data.object.card_front_img || !that.data.object.card_back_img){
            request.showToast('请传身份证照片');
            return;
        }
        let cache = new Object();
        cache.old_room = that_d;
        wx.setStorageSync('subletRoomInfo', cache);
        wx.navigateTo({
            url : "/pages/sublet/personInfo"
        });
    },

    /*取消办理*/
    goBack(){
        wx.removeStorageSync('checkout');
        wx.switchTab({
            url : '/pages/index/index',
        });
    },
})
