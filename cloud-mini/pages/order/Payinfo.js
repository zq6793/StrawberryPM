const utils        = require('../../utils/util.js');
const requestV4 = require('../../common/request_v4.js');
const request   = require('../../common/request.js');
const time      = utils.formatDate(new Date());
//获取应用实例
var app = getApp()
Page({
    data: {
    resident_id : '',
    Topayinfo: '',
    payType : [{'id':'BANK_TRANS','depositName':'银行卡转账'},
              {'id':'ALIPAY','depositName':'支付宝'},
              {'id':'POS','depositName':'POS机'}], //支付类型
    money : '',
    pay_way: '',
    show_pay_way: "",
    pay_date: "",
    show_pay_date: "",
    out_trade_no:"",
    images:'',
    imgFiles:[],
    showAddImg:true,
    remarks:'',
    },
    //事件处理函数
    onLoad(option) {
        let that = this
      	that.setData({
            resident_id  : option.residentid
      	})
    },
    onShow(){
    },
    /*支付金额*/
    paymentAmout(e){
        // this.setData({
        //     money : e.detail.value
        // });
        this.data.money = parseFloat(e.detail.value);
    },

    /*支付方式*/
    bindPayTypeChange(e){
        this.setData({
            pay_way : this.data.payType[e.detail.value].id,
            show_pay_way: this.data.payType[e.detail.value].depositName
        });
    },

    /*支付日期*/
    bindPayChange(e){
        this.setData({
            show_pay_date: e.detail.value,
            pay_date : e.detail.value+"T00:00:00+08:00",
        });
    },

    /*交易单号*/
    oddNumber(e){
        this.setData({
            out_trade_no : e.detail.value
        });
    },

    /*上传照片*/
    roomPicture(e) {
        let that       = this,
            index      = e.currentTarget.dataset.imgindex;
            // addPicture = true;
        wx.chooseImage({
            count      : 1,
            sizeType   : ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType : ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                let tempFilePaths = res.tempFilePaths[0];
                request.uploadFile(tempFilePaths).then(respone=>{
                    if(JSON.parse(respone).rescode=== 0){
                        var img = JSON.parse(respone).data.image_url;
                        request.showToast('上传成功!');
                        let imgFiles = that.data.imgFiles
                        let num = imgFiles.length;
                        if(num<=4){
                          imgFiles[num] = img;
                          that.setData({
                            imgFiles   : imgFiles
                          });
                        }else{
                           that.setData({
                            showAddImg   : false
                          });
                        }
                    }else{
                        request.showToast('上传失败！');
                    }
                }).catch(e =>{
                    console.log(e)
                });
            }
        })
        // colors.splice(0, 1);
    },

    /*预览图片*/
    previewImage(e){
        console.log(e);
        let tempdata = [e.currentTarget.id,]
        wx.previewImage({
            current : e.currentTarget.id, // 当前显示图片的http链接
            urls    : tempdata // 需要预览的图片http链接列表
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
            // that.data.addPayment.images = res;
      });
    },

    /*备注*/
    remarks(e){
        this.setData({
            remarks : e.detail.value
        });
    },

    /*取消*/
    goBack(){
        this.setData({
            addPayment : {},
            isPay  : "hide",
            isShow : ""
        });
    },

    /*确定*/
    confirm(){
        let that = this,
            cont = that.data;
            
        if(!cont.money){
            request.showToast('请输交易金额');
            return;
        }

        if(!cont.out_trade_no){
            request.showToast('请输交易单号');
            return;
        }
        if(that.data.imgFiles.length === 0){
            request.showToast('请上传图片');
            return;
        }
        //获取支付记录表
        let temp = new Object();
            temp.money          = cont.money
            temp.pay_way        = cont.pay_way
            temp.show_pay_way   = cont.show_pay_way
            temp.pay_date       = cont.pay_date
            temp.show_pay_date  = cont.show_pay_date
            temp.out_trade_no   = cont.out_trade_no
            temp.images         = cont.imgFiles
            temp.remark        = cont.remarks

        let topayList= wx.getStorageSync('topayList'+that.data.resident_id);

        if(topayList){
          let num = topayList.length;
          topayList[num]        = temp
        }else{
          topayList     = new Array();
          topayList[0]  = temp
        }
        wx.setStorageSync('topayList'+that.data.resident_id,topayList)
        wx.navigateBack({
          delta: 1
       })

    }
})