const utils        = require('../../utils/util.js');
const requestV4 = require('../../common/request_v4.js');
const request   = require('../../common/request.js');
const time      = utils.formatDate(new Date());
//获取应用实例
var app = getApp()
Page({
    data: {
    resident_id        : '',
    Topayinfo          : '',
    money              : '',
    begin_time         : "",
    begin_time_e       : "",
    end_time           : "",
    end_time_e         : "",
    show_pay_date      : "",
    out_trade_no       : "",
    images             : '',
    imgFiles           : [],
    showAddImg         : true,
    remarks            : '',
    costTypeIndex      : 0,
    addInfo            : new Object(),
    costType           : request.exorderTypeSelect, //添加账单类型 
    checkId            : '',
    images:'',
    imgFiles:[],
    showAddImg:true,
    },
    //事件处理函数
    onLoad(option) {
        wx.removeStorageSync('add_exorder_fee');
    },
    onShow(){
    },
    /*支付金额*/
    paymentAmout(e){
        // this.setData({
        //     money : e.detail.value
        // });
        this.data.money = parseFloat(e.detail.value);
        this.data.addInfo.money = parseFloat((this.data.money).toFixed(2));
    },
    /*支付日期*/
    bindtbegintimeChange(e){
        this.setData({
            begin_time_e   : e.detail.value,
            begin_time     : e.detail.value+"T00:00:00+08:00",
        });
        this.data.addInfo.begin_time_e = e.detail.value;
        this.data.addInfo.begin_time   = e.detail.value+"T00:00:00+08:00";
    },

    /*支付日期*/
    bindendtimeChange(e){
        this.setData({
            end_time_e   : e.detail.value,
            end_time     : e.detail.value+"T00:00:00+08:00",
        });
        this.data.addInfo.end_time_e = e.detail.value;
        this.data.addInfo.end_time   = e.detail.value+"T00:00:00+08:00";
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
        wx.navigateBack({
            data : 1
        });
    },
    /*添加费用*/
    // choosePay(){
    //     let that = this;
    //     that.setData({
    //         isShow      : false,
    //         receivables : true
    //     });
    //     that.data.addInfo.types = that.data.costType[that.data.costTypeIndex].countryName;
    //     that.data.addInfo.type = that.data.costType[that.data.costTypeIndex].id;
    // },

    /*选择费用类型*/
    costType(e){
        this.setData({
            costTypeIndex : e.detail.value
        });
        this.data.addInfo.types = this.data.costType[this.data.costTypeIndex].countryName;
        this.data.addInfo.type = this.data.costType[this.data.costTypeIndex].id;
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

    /*确定*/
    confirm(){
        let that = this;
        if(!that.data.addInfo.money){
            request.showToast('请输交易金额');
            return;
        }
        if(!that.data.addInfo.type){
            request.showToast('请选择费用类型');
            return;
        }
        if(!that.data.addInfo.begin_time){
            request.showToast('请选择开始时间');
            return;
        }
        if(!that.data.addInfo.end_time){
            request.showToast('请选择结束时间');
            return;
        }
        if(!that.data.remarks){
            request.showToast('请填写备注!');
            return;
        }
        that.data.addInfo.remark = that.data.remarks;
        that.data.addInfo.images = that.data.imgFiles;
        let temp_data = [];
            temp_data[0] = that.data.addInfo;
        wx.setStorageSync('add_exorder_fee', temp_data);
        wx.navigateBack({
            delta : 1
        })
        // wx.navigateTo({
        //    url : '/pages/checkOut/examine?checkId='+this.data.checkId,
        // })

    }
})