const utils   = require('../../utils/util.js');
const time    = utils.formatDate(new Date());
const request = require('../../common/request.js');
Page({
    data : {
        checkout_id     : '',
        checkoutType    : '', //退租类型
        checkoutReason  : "", //特殊退房原因
        checkoutInfo    : {}, //获取退房有关信息
        imgFiles        : [], //验房照片
        isShowOrder     : true,
        receivablesList : [], //应收费用
        isByDay         : false, //住宿、物业服务费按天计算是否选中
        totalReceivable : 0, //应收总费用
        otherRemarks    : '', //添加应收费用 其他备注
        addInfo         : {},
        addReceivables  : [], //添加应收费用列表
        costTypeIndex   : 0,
        costType        : request.orderTypeSelect,
        addCostData     : time,
        costMoney       : '', //添加费用备注
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
        profit          : true, //是否显示收益
        realIncome      : "", //实际收益金额
        receivables     : false, //添加应收费用
        extraRefund     : false, //添加额外退款
        isShow          : true,
        isShowBtn       : true,
        bankImg         : [], //银行卡照片
        cardImg         : [], //身份证照片
        signature_url   : '', //退租单PDF
        status          : '',
        isShowInfo      : false,
        imgRentSlip     : [], //线下签字图片
        object          : {},
        break_bills     : '',
        break_bills_count: '',
        checkout_Type   : '',
        resident        : '', //住户信息
    },

    onLoad (options) {
        let that   = this,
            statu  = options.status,
            is_show_btn,
            is_show_order,
            para   = { checkout_id : options.checkId };
        if("UNPAID" === statu || "AUDIT" === statu){
            is_show_btn   = false;
            is_show_order = false;
        }else{
            is_show_btn   = true;
            is_show_order = true;
        }
        that.setData({
            checkout_id : options.checkId,
            status      : statu,
            isShowBtn   : is_show_btn,
            isShowOrder : is_show_order
        });
        that.data.object.checkout_id = options.checkId;

        request.checkoutInfo(para).then(res=>{
            let is_profit,
                charge_order  = res.charge_split_order.other,
                create_orders = res.create_orders,
                spend_order   = res.spend_order,
                break_bills   = res.charge_split_order.break,
                break_bills_count = res.charge_split_order.breakSum,
                checkoutTS    ="", //特殊退房原因
                bank_img      = [],
                card_img      = [],
                add_refunds   = res.add_refunds, //额外账单
                refund_images = res.checkout.add_refund_images, //额外图片
                add_money     = 0, // 添加的应收费用总额
                totalpaid_fee = 0, // 应收费用 合计
                refund_money  = 0, // 添加额外退款金额 合计
                refund_amount = 0; // 应退金额 

            if("0" === res.checkout.give_up || 0 === res.checkout.give_up){
                is_profit = false;
            }else if("1" === res.checkout.give_up || 1 === res.checkout.give_up){
                is_profit = true;
            }

            if(!charge_order || charge_order.length > 0){
                charge_order.forEach(item=>{
                    item.type = request.orderType(item.type);
                })
            }
            if(!break_bills || break_bills.length > 0){
                break_bills.forEach(item=>{
                    item.type = request.orderType(item.type);
                })
            }
            if(!create_orders || create_orders.length > 0){
                create_orders.forEach(item=>{
                    item.types = request.orderType(item.type);
                    add_money += parseFloat(item.money);
                })
            }else{
                create_orders = [];
            }

            if(!spend_order || spend_order.length > 0){
                spend_order.forEach(item=>{
                    item.type = request.orderType(item.type);
                })
            }

            if(!add_refunds || add_refunds.length > 0){
                add_refunds.forEach(item=>{
                    item.types = request.orderType(item.type);
                    refund_money += parseFloat(item.money);
                })
            }else{
                add_refunds = [];
            }
            if(res.checkout.type === "NO_LIABILITY"){
                checkoutTS = res.checkout.special_reason;
            }

            bank_img.push(res.checkout.bank_card_front_img , res.checkout.bank_card_back_img );
            card_img.push(res.checkout.card_front_img , res.checkout.card_back_img );

            totalpaid_fee = parseFloat(add_money) + parseFloat(res.charge_split_order.otherSum); // 计算应收费用合计
            refund_amount = parseFloat(res.refund_sum) - parseFloat(add_money) + parseFloat(refund_money); // 应退金额

            that.setData({
                checkoutInfo    : res,
                checkout_Type   : res.checkout.type,
                checkoutType    : request.checkoutType(res.checkout.type),
                checkoutReason  : checkoutTS, 
                imgFiles        : res.check_images,
                receivablesList : charge_order,
                totalReceivable : totalpaid_fee.toFixed(2),
                addReceivables  : that.data.addReceivables.concat(create_orders),
                additionalList  : that.data.additionalList.concat(add_refunds), //额外应退金额列表
                refundImg       : refund_images,
                showAddImg      : !refund_images || refund_images.length >= 5 ? false : true,
                paidFee         : spend_order,
                totalpaidFee    : res.spend_sum,
                refundAmount    : refund_amount.toFixed(2),
                c_refundAmount  : Math.abs(refund_amount.toFixed(2)),
                isProfit        : is_profit,
                bankImg         : bank_img,
                cardImg         : card_img,
                signature_url   : res.checkout.signature_url,
                additionalTotal : refund_money.toFixed(2),
                // isShowOrder     : res.checkout.creater_role === "CUSTOMER" ? false : true,
                realIncome      : res.checkout.real_income,
                isByDay         : res.checkout.under_calc_type === "DAY" ? true : false,
                break_bills     : break_bills,
                break_bills_count:break_bills_count,
                resident        : res.resident,
            })
            that.data.object.give_up = res.checkout.give_up;
            that.profits(refund_amount);
            
        }).catch(e=>{
            console.log(e);
        });
    },

    /*是否可以选择放弃收益*/
    profits(money){
        let that   = this,
            profit;
        if(money > 0){
            profit = false;
            that.data.object.give_up = 0;
        } else{
            profit = true;
        }
        that.setData({
            profit : profit
        })
    },
    /*预览验房图片*/
    roomImage(e){
        wx.previewImage({
            current : e.currentTarget.id, // 当前显示图片的http链接
            urls : this.data.imgFiles // 需要预览的图片http链接列表
        })
    },
    /*添加费用*/
    choosePay(){
        let that = this;
        that.setData({
            isShow      : false,
            receivables : true,
            isShowBtn   : false
        });
        that.data.addInfo.types = that.data.costType[that.data.costTypeIndex].countryName;
        that.data.addInfo.type = that.data.costType[that.data.costTypeIndex].id;
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
            receivables  : false,
            isShowBtn    : true,
        })
    },

    /*删除新添加的应收费用*/
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

        let realIncome_temp = parseFloat(that.data.realIncome) + parseFloat( money );

        that.setData({
            addReceivables  : list,
            totalReceivable : final.toFixed(2),
            refundAmount    : retreat.toFixed(2),
            c_refundAmount  : Math.abs(retreat.toFixed(2)),
            realIncome      : realIncome_temp,
        })
        that.profits(retreat.toFixed(2));
    },

    /*添加额外退款*/
    addExtraRefund(){
        let that = this;
        that.setData({
            isShow      : false,
            extraRefund : true,
            isShowBtn   : false,
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
                        var data = JSON.parse(respone).data.image_url;
                        that.data.refundImg[index] = data;
                        request.showToast('上传成功!');
                        if(index >= 4){
                            addPicture = false;
                        }else{
                            addPicture = true;
                        }

                        that.setData({
                            refundImg  : tempArray,
                            showAddImg : addPicture
                        });
                        that.data.add_refund_images = JSON.stringify(tempArray);
                    }else{
                        request.showToast('上传失败!');
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
            isShowBtn     : true,
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
        let realIncome_temp = parseFloat(that.data.realIncome) + parseFloat( cont.money );

        that.setData({
            addRefund : {},
            realIncome : realIncome_temp,
        })
    },

    /*添加额外应退金额之后 应收费用合计 应退金额 计算*/
    total(money){
        let that         = this,
            refund_total = 0, //最终额外退款金额
            retreat      = 0; //最终应退金额

        refund_total = parseFloat(money) + parseFloat(that.data.additionalTotal);
        retreat      = parseFloat(that.data.refundAmount) + parseFloat(money);

        that.setData({
            additionalTotal : refund_total.toFixed(2), //额外退款金额合计
            refundAmount    : retreat.toFixed(2), //应退金额
            c_refundAmount  : Math.abs(retreat.toFixed(2)),
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
        let realIncome_temp = parseFloat(that.data.realIncome) - parseFloat( money );

        that.setData({
            additionalList  : list,
            additionalTotal : final.toFixed(2),
            refundAmount    : retreat.toFixed(2),
            c_refundAmount  : Math.abs(retreat.toFixed(2)),
            realIncome      : realIncome_temp,
        })
        that.profits(retreat.toFixed(2));
    },

    /*是否放弃收益*/
    bindProfitChange(e){
        if(this.data.status=='AUDIT'){
            return;
        }
        this.setData({
            isProfit : !this.data.isProfit
        })
        if(this.data.isProfit){
            this.data.object.give_up = 1;
        }else{
            this.data.object.give_up = 0;
        }
    },

    /*线下签字*/
    underLine(e){
        this.setData({
            isShow     : false,
            isShowInfo : true,
            isShowBtn  : false
        });
    },

    /*上传线下签字图片*/
    underLinePic(e) {
        let that       = this,
            index      = e.currentTarget.dataset.imgindex,
            tempArray  = that.data.imgRentSlip;

        wx.chooseImage({
            count      : 1,
            sizeType   : ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType : ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                var tempFilePaths = res.tempFilePaths[0];
                tempArray[index] = tempFilePaths;

                request.uploadFile(tempArray[index]).then(respone=>{
                    if(JSON.parse(respone).rescode=== 0){
                        var data = JSON.parse(respone).data.image_url;
                        that.data.imgRentSlip[index] = data;

                        request.showToast('上传成功!');
                        that.setData({
                            imgRentSlip : tempArray,
                        });

                        that.data.object.signature_images = JSON.stringify(tempArray);
                    }else{
                        request.showToast('上传失败!');
                    }
                }).catch(e =>{
                    console.log(e)
                });
            }
        })
    },

    /*预览线下签字图片*/
    checkoutImage(e){
        wx.previewImage({
            current : e.currentTarget.id, // 当前显示图片的http链接
            urls    : this.data.imgRentSlip // 需要预览的图片http链接列表
        })
    },

    /*删除线下签字图片*/
    deteleImage(e){
        let that   = this,
            images = that.data.imgRentSlip,
            index  = e.currentTarget.dataset.imgindex;

        request.deteleImage(images,index,res=>{
            that.setData({
                imgRentSlip : res
            });
        });
    },

    /*住户无法签字*/
    sign(){
        let that = this;
       
        wx.showModal({
            content     : '确定住户无法完成签署并提交退租审批',
            showCancel  : true,
            success: function (resp) {
                if (resp.confirm) {
                    that.requestData("NO");
                }
            }
        });
    },

    /*取消上传退租单*/
    goBack(e){
        let that = this;
        that.setData({
            isShow     : true,
            isShowInfo : false,
            isShowBtn  : true
        })
    },

    /*预览银行卡图片*/
    bankImage(e){
        wx.previewImage({
            current : e.currentTarget.id, // 当前显示图片的http链接
            urls : this.data.bankImg // 需要预览的图片http链接列表
        })
    },

    /*预览身份证正反面图片*/
    cardImage(e){
        wx.previewImage({
            current : e.currentTarget.id, // 当前显示图片的http链接
            urls : this.data.cardImg // 需要预览的图片http链接列表
        })
    },

    /*提交数据*/
    requestData(type){
        let that          = this,
            that_d        = that.data,
            add_cost_list = that_d.addReceivables,
            create_orders = [],
            additiona     = that_d.additionalList, //添加的额外退款列表
            add_refunds   = []; //需要给后台传的 -> 添加的额外退款

        /*0 未选中 
        1 选中*/
        if(that_d.profit){
            if(!that_d.isProfit){
              request.showToast('请选放弃追缴');
              return;
            }
            // if(that_d.object.give_up === 0){
            //     request.showToast('请选放弃追缴');
            //     return;
            // }
        }
        
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
                add_refunds.push({type : additiona[key].type, money : additiona[key].money, remark : additiona[key].remark });
            }
        }else{
            add_refunds = [];
        }

        if(additiona.length > 0){
            if(that_d.refundImg.length === 0){
                request.showToast('请上传额外图片!');
                return;
            }
        }

        that_d.object.create_orders     = JSON.stringify(create_orders);
        that_d.object.add_refunds       = JSON.stringify(add_refunds);
        that_d.object.add_refund_images = JSON.stringify(that_d.refundImg);

        let requestDatas = {
            create_orders     : that_d.object.create_orders,
            checkout_id       : that_d.checkout_id,
            give_up           : that_d.object.give_up,
            signature_type    : type,
            signature_images  : that_d.object.signature_images ? that_d.object.signature_images : '',
            add_refunds       : that_d.object.add_refunds,
            add_refund_images : that_d.object.add_refund_images
        };

        request.checkSignature(requestDatas).then(res=>{
            request.showToast('提交成功');
            wx.switchTab({
                url : '/pages/index/index',
            });
        }).catch(e=>{
            console.log(e);
        });
    },

    /*确认上传退租单*/
    confirm(e){
        let that = this;
        that.setData({
            isShowInfo : true
        })

        wx.showModal({
            content     : '确定签字无误并提交审批',
            showCancel  : true,
            success: function (resp) {
                if (resp.confirm) {
                    that.requestData("UNDER");
                }
            }
        });
    },

    /*查看退租单PDF*/
    lookPDF(){
        let url = this.data.signature_url;
        wx.downloadFile({
            url : url,
            success: function(res) {
                const filePath = res.tempFilePath
                wx.openDocument({
                    filePath: filePath,
                    success: function(res) {
                        console.log('打开文档成功')
                    }
                })
            }
        })
    },

    /*提交审核*/
    submit(){
        wx.switchTab({
            url : '/pages/index/index',
        });
    },

    /*驳回 返回*/
    rejectGoback(){
        wx.navigateBack({
            data : 1
        });
    },

    /*驳回 提交审核*/
    rejectSubmit(){
        let that          = this,
            that_d        = that.data,
            add_cost_list = that_d.addReceivables,
            create_orders = [],
            additiona     = that_d.additionalList, //添加的额外退款列表
            add_refunds   = []; //需要给后台传的 -> 添加的额外退款
        
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
                add_refunds.push({type : additiona[key].type, money : additiona[key].money, remark : additiona[key].remark,  });
            }
        }else{
            add_refunds = [];
        }

        /*0 未选中 
        1 选中*/
       if(that_d.profit){
            if(!that_d.isProfit){
              request.showToast('请选放弃追缴');
              return;
            }
            // if(that_d.object.give_up === 0){
            //     request.showToast('请选放弃追缴');
            //     return;
            // }
        }

        if(additiona.length > 0){
            if(that_d.refundImg.length === 0){
                request.showToast('请上传额外图片!');
                return;
            }
        }

        that_d.object.create_orders     = JSON.stringify(create_orders);
        that_d.object.add_refunds       = JSON.stringify(add_refunds);
        that_d.object.add_refund_images = JSON.stringify(that_d.refundImg);

        wx.showModal({
            content     : '确认提交审核',
            showCancel  : true,
            success: function (resp) {
                if (resp.confirm) {
                    let requestData = {
                        create_orders     : that_d.object.create_orders,
                        checkout_id       : that_d.checkout_id,
                        give_up           : that_d.object.give_up,
                        add_refunds       : that_d.object.add_refunds,
                        add_refund_images : that_d.object.add_refund_images
                    };
                    request.dismissal(requestData).then(res=>{
                        request.showToast('提交成功');
                        wx.navigateTo({
                            url : '/pages/checkOut/checkOut',
                        });
                    }).catch(e=>{
                        console.log(e);
                    });
                }
            }
        });
    },

    /*推送缴费提醒*/
    paymentReminder(){
        let that = this;
        let requestDatas = {
            resident_id : that.data.resident.id,
        };
        request.sendBillnotice(requestDatas).then(res=>{
             // console.log(res);
        //     request.showToast('暂不支持此功能!');
        request.showToast('已推送成功');
        wx.navigateTo({
            url : '/pages/checkOut/checkOut',
        });

        }).catch(e=>{
            console.log(e);
        });
    }
});
