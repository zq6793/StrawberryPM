const utils   = require('../../utils/util.js');
const time    = utils.formatDate(new Date());
const request = require('../../common/request.js');
const requestV4   = require('../../common/request_v4.js');
Page({
    data: {
        checkout_id           : '',
        receivables           : {},    // 应收
        receivables_total     : 0,     // 应收合计
        depositables          : {},    // 押金
        depositables_total    : 0,     // 押金合计
        paidFee               : {},    // 已交费用
        paidFee_total         : 0,     // 已交费用合计
        refund_money          : 0,     // 应退金额
        income_money          : 0,     // 退房收入
        loss_money            : 0,     // 退房损失
        add_receivables       : {},    // 全部已交
        ex_refund             : {},    // 额外退款
        ex_refund_total       : 0,     // 额外退款合计
        real_refund_money     : 0,     // 合计退款金额 实际退款
        isShow                : true,
        bankAccount           : '',
        bankCardNumber        : '',
        bankList              : [],
        bankIndex             : 0,
        bankListCity          : [],
        cityIndex             : [0,0],
        branchInfo            : '',
        bankPhoto             : [],
        idPhoto               : [],
        provinceList          : [], //省列表
        bank_name             : '', //开户银行
        provinces             : '', //省
        citys                 : '', //市
        object                : {},
        showCheck             : true,
        account               : {},
        bankImg               : [],
        idCardImg             : [],
        checkoutType          : '',
        add_order_fee         : [],
        add_exorder_fee       : [],
        addReceivables        : [],
    },

    onLoad (options) {
        let that  = this;
        // 获取 账单 列表
        wx.removeStorageSync('add_order_fee');
        wx.removeStorageSync('add_exorder_fee');
        let checkout_order = wx.getStorageSync('checkoutInfo_order');
        let checkoutInfo = wx.getStorageSync('checkoutInfo');
        // 已缴费用
        that.setData({
            receivables         : checkout_order.input_order,
            receivables_total   : checkout_order.input_money,
            depositables        : checkout_order.deposit_order,
            depositables_total  : checkout_order.deposit_money,
            paidFee             : checkout_order.output_order,
            paidFee_total       : checkout_order.output_money,
            refund_money        : checkout_order.refund_money,
            income_money        : checkout_order.income_money,
            loss_money          : checkout_order.loss_money,
            add_exorder_fee     : checkout_order.add_refund_order,
            ex_refund_total     : checkout_order.add_refund_money,
            real_refund_money   : checkout_order.real_refund_money,
            object              : checkoutInfo,
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
    },

    onShow(){
    let that = this,
        addReceivables = wx.getStorageSync('add_order_fee'),
        exorder = wx.getStorageSync('add_exorder_fee'),
        add_order_fee  = that.data.add_order_fee,
        add_exorder_fee  = that.data.add_exorder_fee;
    if(addReceivables||exorder){
        if(addReceivables){
            if(add_order_fee.length>=1){
                add_order_fee[add_order_fee.length] = addReceivables[0];
            }else{
                add_order_fee = addReceivables;
            }
        }
        if(exorder){
            if(add_exorder_fee.length>=1){
                add_exorder_fee[add_exorder_fee.length] = exorder[0];
            }else{
                add_exorder_fee = exorder;
            }
        }
        that.setData({
            add_order_fee   : add_order_fee,
            add_exorder_fee : add_exorder_fee
        })
        let paraData = that.data.object;
        if(add_order_fee){
            paraData.add_orders = add_order_fee;
        }
        if(add_exorder_fee){
            paraData.add_refunds = add_exorder_fee;
        }
        console.log(add_exorder_fee)
        requestV4.checkoutCalcfee(that.data.object,paraData).then(res=>{
            that.setData({
                receivables_total   : res.input_money,
                refund_money        : res.refund_money,
                income_money        : res.income_money,
                loss_money          : res.loss_money,
                paidFee_total       : res.output_money,
                ex_refund_total     : res.add_refund_money,
                real_refund_money   : res.real_refund_money,
            })
        }).catch(e =>{
            console.log(e)
        });
      }
    wx.removeStorageSync('add_order_fee');
    wx.removeStorageSync('add_exorder_fee');
    // 获取额外退款
    },
    showImg(e){
        // console.log(e);
        wx.previewImage({
            current : e.currentTarget.dataset.imgsrc, // 当前显示图片的http链接
            urls : [e.currentTarget.dataset.imgsrc], // 需要预览的图片http链接列表
        })
    },
    /*获取账户信息*/
    getAccount(checkout_id){
        let that = this,
            para = {checkout_id : checkout_id };
        request.checkoutInfo(para).then(res=>{
            var data      = res.checkout,
                bank_list = [],
                id_card   = [],
                bank_info = ['','','',''];

            bank_list.push(data.bank_card_back_img,data.bank_card_front_img);
            id_card.push(data.card_back_img,data.card_front_img);

            if (data.bank) {
                bank_info = data.bank.split('_');
                data.bank = data.bank.replace('_', '').replace('_', '').replace('_', '');
            }
            
            that.setData({
                account    : data,
                bankImg    : bank_list,
                idCardImg  : id_card,
                bank_name  : bank_info[0],
                provinces  : bank_info[1],
                citys      : bank_info[2],
                branchInfo : bank_info[3],
            })
            that.data.object.bank = data.bank;
            that.data.object.account = data.account;
            that.data.object.bank_card_number = data.bank_card_number;
            that.data.object.bank_card_front_img = data.bank_card_front_img;
            that.data.object.bank_card_back_img = data.bank_card_back_img;
            that.data.object.card_front_img = data.card_front_img;
            that.data.object.card_back_img = data.card_back_img;
        }).catch(e=>{
            console.log(e)
        });
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

    /*是否可以选择放弃收益*/
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
            url : '/pages/checkOut/addorder',
        });
    },

    addExtraRefund(){
         wx.navigateTo({
            url : '/pages/checkOut/exorder',
        });
    },

    /*关闭添加应收费用*/
    closeReceivables(){
        let that = this;
        that.setData({
            costMoney    : "",
        })
    },

    /*删除添加的应收费用*/
    deteleOrder(e){
        let that = this;
        let paraData = that.data.object;
        wx.removeStorageSync('add_order_fee');
        let new_order = that.data.add_order_fee;
        new_order.splice(e.currentTarget.dataset.index,1);
        that.setData({
        add_order_fee   : new_order
        })
        if(that.data.add_exorder_fee){
            paraData.add_refunds = that.data.add_exorder_fee;
        }
        if(that.data.add_order_fee){
            paraData.add_orders = that.data.add_order_fee;
        }
        requestV4.checkoutCalcfee(that.data.object,paraData).then(res=>{
        that.setData({
            receivables_total   : res.input_money,
            refund_money        : res.refund_money,
            income_money        : res.income_money,
            loss_money          : res.loss_money,
            paidFee_total       : res.output_money,
            ex_refund_total     : res.add_refund_money,
            real_refund_money   : res.real_refund_money,
        })
        }).catch(e =>{
        console.log(e)
        });
    },

    deteleExOrder(e){
        let that = this;
        let paraData = that.data.object;
        wx.removeStorageSync('add_exorder_fee');
        let new_order = that.data.add_exorder_fee;
        new_order.splice(e.currentTarget.dataset.index,1);
        that.setData({
        add_exorder_fee   : new_order
        })
        if(that.data.add_order_fee){
            paraData.add_orders = that.data.add_order_fee;
        }
        if(that.data.add_exorder_fee){
            paraData.add_refunds = that.data.add_exorder_fee;
        }
        requestV4.checkoutCalcfee(paraData).then(res=>{
            that.setData({
                receivables_total   : res.input_money,
                refund_money        : res.refund_money,
                income_money        : res.income_money,
                loss_money          : res.loss_money,
                paidFee_total       : res.output_money,
                ex_refund_total     : res.add_refund_money,
                real_refund_money   : res.real_refund_money,
            })
        }).catch(e =>{
        console.log(e)
      });
    },
    /*取消添加额外退款*/
    refundCancel(){
        let that = this;
        that.closeRefund();
        that.setData({
            additionalList : that.data.additionalList.concat()
        })
    },

    /*关闭额外添加退款金额*/
    closeRefund(){
        let that = this;
        that.setData({
            refundMoney   : "",
            refundRemarks : "",
            isShow        : true,
            extraRefund   : false,
            showAddImg    : that.data.refundImg.length >= 4 ? false : true,
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
        this.data.bank_name = this.data.bankList[e.detail.value];
    },

    /*选择退款银行省市信息*/
    bankListCity(e){
        let that =this;
        that.setData({
            cityIndex : e.detail.value
        });
        that.data.provinces = that.data.bankListCity[0][that.data.cityIndex[0]].province;
        that.data.citys     = that.data.bankListCity[1][that.data.cityIndex[1]].province;
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
        this.setData({
            branchInfo : e.detail.value
        })
    },
    /*预览验房图片*/
    roomImage(e){
        wx.previewImage({
            current : e.currentTarget.id, // 当前显示图片的http链接
            urls : this.data.imgFiles // 需要预览的图片http链接列表
        })
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
        let that          = this,
            that_d        = that.data,
            refund_amount = that_d.refundAmount, //应退金额
            add_cost_list = that_d.addReceivables, //添加的应收费用
            create_orders = [], //需要给后台传的 -> 添加的应收费用
            additiona     = that_d.additionalList, //添加的额外退款列表
            add_refunds   = []; //需要给后台传的 -> 添加的额外退款
        that_d.object.bank = that_d.bank_name + that_d.provinces + that_d.citys + that_d.branchInfo;
        if(that_d.refund_money > 0){
            that.data.object.account_info = 1;
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
        }
        // else{
        //     that_d.object.account_info = 0;
        //     that_d.object.account = "";
        //     that_d.object.bank = "";
        //     that_d.object.bank_card_number = "";
        //     that_d.object.bank_card_front_img = "";
        //     that_d.object.bank_card_back_img = "";
        //     that_d.object.card_front_img = "";
        //     that_d.object.card_back_img = "";
        // }
        // 退房费用
        // 额外退款
        that_d.object.add_refunds = that_d.add_exorder_fee;
        // 添加应收费用   
        that_d.object.add_orders  = that_d.add_order_fee;   
        wx.showModal({
            title: '提示',
            content: '确定提交验房，提交后房间状态将变为空闲且不可撤销',
            success: function (res) {
                if (res.confirm) {
                    requestV4.checkoutSubmit(that_d.object).then(res=>{
                        wx.navigateTo({
                            url : '/pages/checkOut/examine?status=CHECKED&checkId='+ res.ID,
                        });
                    }).catch(e => {
                        console.log(e)
                    });
                }else{
                    console.log("点击了取消")
                }
            }
        })
    },

    /*取消办理*/
    goBack(){
        wx.removeStorageSync('checkout');
        wx.switchTab({
            url : '/pages/index/index',
        });
    },
})
