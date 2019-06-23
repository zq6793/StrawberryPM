const utils   = require('../../utils/util.js');
const time    = utils.formatDate(new Date());
const request = require('../../common/request.js');
Page({
    data: {
        checkout_id     : '',
        isShow          : true,
        receivablesList : [], //应收费用
        totalReceivable : 0, //应收总费用
        isShowPenalty   : false, //是否显示违约金
        breakMoney      : "", //违约金
        breakMoneys     : "", //除违约金合计
        otherRemarks    : '', //添加应收费用 其他备注
        addReceivables  : [], //添加应收费用列表
        addCostData     : time,
        costMoney       : '', //添加费用金额
        otherRemarks    : '', //添加费用备注
        addInfo         : {},
        paidFee         : [], //已缴费用
        totalpaidFee    : '', //已缴总费用
        additionalList  : [], //添加额外账单列表
        additionalTotal : 0, //添加额外金额
        refundIndex     : 0,
        refundType      : request.orderTypeSelect, //添加额外退款类型 
        refundMoney     : "", //添加额外退款金额
        refundRemarks   : "", //添加额外退款备注
        refundImg       : [], //额外退款图片
        showAddImg      : true,
        refundAmount    : 0, //应退金额
        c_refundAmount  : 0, //放弃追缴金额
        addRefund       : {},
        isProfit        : false, //是否收益
        profit          : true, //是否显示收益
        amountOfIncome  : "", //实际收益金额
        receivables     : false, //添加应收费用
        extraRefund     : false, //添加额外退款
        costTypeIndex   : 0,
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
    },

    onLoad (options) {
        let that  = this,
            cache = wx.getStorageSync('checkout'),
            show_check,
            total_receivable, //应收金额
            show_penalty, //是否显示违约金
            break_money  = "0", //违约金额
            break_moneys = "0";
            console.log(cache);

        if(options.checkout_id){
            show_check = false;
            that.getAccount(options.checkout_id);
        }else{
            show_check = true;
        }

        if(cache.type === "NORMAL_REFUND"){
            show_penalty = false;
        }else{
            show_penalty = true;
        }

        that.setData({
            object        : cache,
            checkout_id   : options.checkout_id,
            showCheck     : show_check,
            isShowPenalty : show_penalty
        });


        request.checkOutMOney(cache).then(res=>{
            /*判断退租的类型*/

            /*应收费用*/
            let receivables_list = res.charge_split_order.other;
            receivables_list.forEach(item=>{
                item.type = request.orderType(item.type);
            });
            /*违约金*/
            let charge_break_bill = res.charge_split_order.break;
            charge_break_bill.forEach(item=>{
                item.type = request.orderType(item.type);
            });

            /*已缴费用*/
            let paid_fee_list = res.spend_order;
            for(var key in paid_fee_list){
                paid_fee_list[key].type = request.orderType(paid_fee_list[key].type);
            }

            that.setData({
                receivablesList : receivables_list,
                paidFee         : paid_fee_list,
                totalReceivable : res.charge_split_order.otherSum,
                breakMoney      : charge_break_bill,
                breakMoneys     : res.charge_split_order.breakSum,
                totalpaidFee    : res.spend_sum,
                refundAmount    : res.refund_sum,
                c_refundAmount  : Math.abs(res.refund_sum),
                checkoutType    : res.params.type,
            })
            that.profits(res.refund_sum);
        }).catch(e =>{
            console.log(e)
        });

        that.data.object.give_up = 0;
        
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
    profits(money){
        let that  = this,
            profit,
            total = "0", //实际收益金额
            type  = wx.getStorageSync('checkout').type,
            isProfit = false;

        if(money >= 0){
            profit = false;
            that.data.object.give_up = 0;
        } else{
            profit = true;
            /*计算逻辑 
                如果正常退房 实际收益金额 === 已退金额
                违约退房 特殊退房 实际收益金额 = 违约金 + 应退金额绝对值  */
            if(type === "UNDER_CONTRACT" || type === "NO_LIABILITY"){
                total = (parseFloat(that.data.breakMoneys) + parseFloat(money)).toFixed(2);
            }

            if(type === "NORMAL_REFUND"){
                total = money;
            }
        }
        if(that.data.refundAmount>0){
            isProfit = false;
        }else{
            isProfit = true;
        }
        that.setData({
            isProfit       : isProfit,
            profit         : profit,
            amountOfIncome : total
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
        let that = this;
        that.setData({
            isShow      : false,
            receivables : true
        });
        this.data.addInfo.types = this.data.costType[this.data.costTypeIndex].countryName;
        this.data.addInfo.type = this.data.costType[this.data.costTypeIndex].id;
    },

    /*选择费用类型*/
    costType(e){
        this.setData({
            costTypeIndex : e.detail.value
        });
        this.data.addInfo.types = this.data.costType[this.data.costTypeIndex].countryName;
        this.data.addInfo.type = this.data.costType[this.data.costTypeIndex].id;
    },

    /*添加应收费用 费用金额*/
    costMoney(e){
        this.setData({
            costMoney : e.detail.value
        });
        this.data.addInfo.money = e.detail.value;
    },

    /*添加应收费用 其他备注*/
    otherRemarks(e){
        this.setData({
            otherRemarks : e.detail.value
        });
        this.data.addInfo.remark = e.detail.value;
    },

    /*确认添加应收费用*/
    confirmReceivables(e){
        let that = this;
        if(!that.data.addInfo.money){
            request.showToast('请输入费用金额!');
            return;
        }
        that.data.addInfo.remark = that.data.otherRemarks ? that.data.otherRemarks : "";
        that.closeReceivables();
        that.setData({
            addReceivables : that.data.addReceivables.concat(that.data.addInfo)
        })
        that.totals(that.data.addInfo.money);
        let realIncome_temp = parseFloat(that.data.realIncome) - parseFloat( that.data.addInfo.money );

        that.setData({
            addInfo : {},
            realIncome    : realIncome_temp
        })
    },

    /*添加应收费用之后 应收费用合计 应退金额 计算*/
    totals(money){
        let that        = this,
            total_money = that.data.totalReceivable,
            final_total = 0, //最终应收金额
            retreat     = 0; //最终应退金额

        final_total = parseFloat(money) + parseFloat(that.data.totalReceivable);
        retreat = parseFloat(that.data.refundAmount) - parseFloat(money);

        that.setData({
            totalReceivable : final_total.toFixed(2),
            refundAmount    : retreat.toFixed(2),
            c_refundAmount  : Math.abs(retreat.toFixed(2)),
        });
        that.profits(retreat.toFixed(2));
    },

    /*取消添加应收费用*/
    cancel(e){
        let that = this;
        that.closeReceivables();
        that.setData({
            addReceivables : that.data.addReceivables.concat()
        })
    },

    /*关闭添加应收费用*/
    closeReceivables(){
        let that = this;
        that.setData({
            costMoney    : "",
            otherRemarks : "",
            isShow       : true,
            receivables  : false
        })
    },

    /*删除添加的应收费用*/
    deteleOrder(e){
        let that    = this,
            num     = e.currentTarget.dataset.index,
            list    = that.data.addReceivables,
            money   = e.currentTarget.dataset.money,
            total   = that.data.totalReceivable,
            final   = 0, //总的应收金额
            retreat = 0; //应退金额

        list.splice(num,1);

        final = parseFloat(total - money);

        retreat = parseFloat(that.data.refundAmount) + parseFloat(money);
        that.setData({
            addReceivables  : list,
            totalReceivable : final.toFixed(2),
            refundAmount    : retreat.toFixed(2),
            c_refundAmount  : Math.abs(retreat.toFixed(2))
        })
        that.profits(retreat.toFixed(2));
    },

    /*添加额外退款*/
    addExtraRefund(){
        let that = this;
        that.setData({
            isShow      : false,
            extraRefund : true
        });
        that.data.addRefund.types = that.data.refundType[that.data.refundIndex].countryName;
        that.data.addRefund.type = that.data.refundType[that.data.refundIndex].id;
    },

    /*选择额外退款类型*/
    refundType(e){
        this.setData({
            refundIndex : e.detail.value
        });
        this.data.addRefund.types = this.data.refundType[this.data.refundIndex].countryName;
        this.data.addRefund.type = this.data.refundType[this.data.refundIndex].id;
    },

    /*添加额外退款金额数*/
    refundMoney(e){
        this.setData({
            refundMoney : e.detail.value
        });
        this.data.addRefund.money = e.detail.value;
    },

    /*添加额外退款备注*/
    refundRemarks(e){
        this.setData({
            refundRemarks : e.detail.value
        });
        this.data.addRefund.remark = e.detail.value;
    },

    /*添加额外退款图片*/
    picture(e){
        let that       = this,
            index      = e.currentTarget.dataset.imgindex,
            tempArray  = that.data.refundImg,
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
                        let img = JSON.parse(respone).data.image_url;
                        that.data.refundImg[index] = img;

                        if(index >= 4){
                            addPicture = false;
                        }else{
                            addPicture = true;
                        }
                        
                        request.showToast('上传成功!');
                        that.setData({
                            refundImg  : tempArray,
                            showAddImg : addPicture
                        });
                        that.data.addRefund.images = JSON.stringify(tempArray);
                    }else{
                        request.showToast('上传失败！');
                    }
                }).catch(e =>{
                    console.log(e)
                });
            }
        })
    },

    /*预览添加额外退款图片*/
    previewImage(e){
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.refundImg // 需要预览的图片http链接列表
        })
    },

    /*删除添加额外退款图片*/
    deteleAdditional(e){
        let that       = this,
            images     = that.data.refundImg,
            index      = e.currentTarget.dataset.imgindex,
            addPicture = true;

        request.deteleImage(images,index,res=>{
            if(res.length > 5){
                addPicture = false;
            }else{
                addPicture = true;
            }

            that.setData({
                refundImg  : res,
                showAddImg : addPicture
            });
            that.data.add_refund_images = JSON.stringify(res);
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

    /*确定添加额外退款*/
    refundConfirm(){
        let that = this,
            cont = that.data.addRefund;
            // list = [];

        if(!cont.money){
            request.showToast('请输入费用金额!');
            return;
        }

        if(!cont.remark){
            request.showToast('请输入备注!');
            return;
        }
        // if(that.data.imgFiles.length == 0){
        //     request.showToast('请上传图片!');
        //     return;
        // }

        that.closeRefund();

        // list.push(cont);
        // list.forEach((item)=>{
        //     item.images = JSON.parse(item.images);
        // })

        that.setData({
            additionalList : that.data.additionalList.concat(cont)
        })

        that.total(cont.money);
        that.setData({
            addRefund : {}
        })
    },

    /*添加额外应退金额之后 应收费用合计 应退金额 计算*/
    total(money){
        let that         = this,
            refund_total = 0, //最终额外退款金额
            retreat      = 0, //最终应退金额
            type         = wx.getStorageSync('checkout').type,
            real_income  = "";

        refund_total = parseFloat(money) + parseFloat(that.data.additionalTotal);
        retreat      = parseFloat(that.data.refundAmount) + parseFloat(money);

        /*计算逻辑 
                如果正常退房 实际收益金额 === 应退金额
                违约退房 特殊退房 实际收益金额 = 违约金 + 应退金额绝对值  */

        if(type === "NORMAL_REFUND"){
            real_income = retreat;
        }

        if(type === "UNDER_CONTRACT" || type === "NO_LIABILITY"){
            real_income = parseFloat(that.data.breakMoney) + parseFloat(retreat);
        }

        that.setData({
            additionalTotal : refund_total.toFixed(2), //额外退款金额合计
            refundAmount    : retreat.toFixed(2), //应退金额
            amountOfIncome  : real_income.toFixed(2)
        });

        that.profits(retreat.toFixed(2));
    },

    /*删除额外应退金额*/
    deteleRefund(e){
        let that    = this,
            num     = e.currentTarget.dataset.index,
            list    = that.data.additionalList,
            money   = e.currentTarget.dataset.money,
            total   = that.data.additionalTotal,
            final   = 0, //总的额外退款金额
            retreat = 0; //应退金额

        list.splice(num,1);

        final = parseFloat(total - money);

        retreat = parseFloat(that.data.refundAmount) - parseFloat(money);
        that.setData({
            additionalList  : list,
            additionalTotal : final.toFixed(2),
            refundAmount    : retreat.toFixed(2),
            c_refundAmount  : Math.abs(retreat.toFixed(2))
        })
        that.profits(retreat.toFixed(2));
    },

    /*是否放弃收益*/
    bindProfitChange(e){
        this.setData({
            isProfit : !this.data.isProfit
        })
        if(this.data.isProfit){
            this.data.object.give_up = 1;
        }else{
            this.data.object.give_up = 0;
        }
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

        that_d.object.bank_name = that_d.bank_name + that_d.provinces + that_d.citys + that_d.branchInfo;

        if(add_cost_list.length>0){
            for(var key in add_cost_list){
                create_orders.push({type : add_cost_list[key].type, money : add_cost_list[key].money, remark : add_cost_list[key].remark, time : time});
            }
        }else{
            create_orders = [];
        }

        if(additiona.length>0){
            for(var key in additiona){
                // add_refunds.push({type : additiona[key].type, money : additiona[key].money, remark : additiona[key].remark, time : time, images : additiona[key].images });
                add_refunds.push({type : additiona[key].type, money : additiona[key].money, remark : additiona[key].remark});
            }
        }else{
            add_refunds = [];
        }

        // if(that_d.profit){
        //     if(!that_d.isProfit){
        //         request.showToast('请选放弃追缴');
        //         return;
        //     }
        // }

        that_d.object.create_orders     = JSON.stringify(create_orders);
        that_d.object.add_refunds       = JSON.stringify(add_refunds);
        that_d.object.add_refund_images = JSON.stringify(that_d.refundImg);

        if(refund_amount > 0){
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

        }else{
            that_d.object.account_info = 0;
            that_d.object.account = "";
            that_d.object.bank_name = "";
            that_d.object.bank_card_number = "";
            that_d.object.bank_card_front_img = "";
            that_d.object.bank_card_back_img = "";
            that_d.object.card_front_img = "";
            that_d.object.card_back_img = "";
        }

        // if(that_d.object.account && that_d.object.bank_name && that_d.object.bank_card_number && that_d.object.bank_card_front_img &&
        //     that_d.object.bank_card_back_img && that_d.object.card_front_img && that_d.object.card_back_img){

        //     that_d.object.account_info = 1;
        // }       

        wx.showModal({
            title: '提示',
            content: '确定提交验房，提交后房间状态将变为空闲且不可撤销',
            success: function (res) {
                if (res.confirm) {
                    request.checkOut(that_d.object).then(res=>{
                        wx.navigateTo({
                            url : '/pages/checkOut/examine?status=CHECKED&checkId='+ res.checkout_id,
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
