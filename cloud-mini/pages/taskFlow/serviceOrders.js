const request = require('../../common/request.js');

Page({
    data    : {
        id          : '',
        detail      : null,
        serviceCost : '',
        remarkOther : '',
        imgFiles    : [],
        showAddImg  : true
    },


  /**
   * 生命周期函数--监听页面加载
   */
    onLoad (options) {
        let that = this,
            para = { id : options.id };
        that.setData({
            id : options.id
        })

        //请求该记录详情
        request.getApproveDetail(para).then(res=>{
            that.setData({
                detail  : res[0],
            });
        }).catch(e=>{
            console.log(e)
        });
    },

    /*服务费*/
    serviceCost(e){
        this.setData({
            serviceCost : e.detail.value
        })
    },

    /*拨打电话*/
    calling(e){
        let phone   = e.currentTarget.dataset.phone;

        wx.makePhoneCall({
            phoneNumber : phone
        });
    },

    /*上传图片*/
    chooseImage (e) {
        var that = this;
        wx.chooseImage({
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                that.setData({
                    imgFiles : that.data.imgFiles.concat(res.tempFilePaths)
                });
                // alert(res.tempFilePaths);
                if(that.data.imgFiles.length >= 3){
                    that.setData({
                        showAddImg : false
                    })
                }
            }
        })
    },

    /*查看上传图片*/
    previewImage(e){
        wx.previewImage({
            current : e.currentTarget.id, // 当前显示图片的http链接
            urls    : this.data.imgFiles // 需要预览的图片http链接列表
        })
    },

    /*其他备注*/
    remarkOther(e){
        this.setData({
            remarkOther : e.detail.value
        })
    },
});