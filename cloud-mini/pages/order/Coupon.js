const utils        = require('../../utils/util.js');
const requestV4 = require('../../common/request_v4.js');
const request   = require('../../common/request.js');
const time      = utils.formatDate(new Date());
//获取应用实例
var app = getApp()
Page({
    data: {
      resident_id : '',
      Topay: '',
      couponList:'',
    },
    //事件处理函数
    onLoad(option) {
        let that = this
        let couponList = wx.getStorageSync('tocoupon'+option.residentid)
      	that.setData({
            resident_id  : option.residentid,
            couponList   : couponList
      	})
    },
    onShow(){
      //获取所有费用列表
    },
    checkboxCoupon(e){
      let that = this
      let checked = e.detail.value
      let couponList = that.data.couponList;
      for (let i = 0; i < couponList.length; i++) { 
        if(String(couponList[i].id)==checked[0]){
          couponList[i].ischecked = !couponList[i].ischecked
        }
      }
      that.setData({
        couponList  : couponList
      })
    },
    sure_coupon(e){
        let that = this
        wx.setStorageSync('tocoupon'+that.data.resident_id, that.data.couponList)
        wx.navigateBack({
          delta: 1
       })
    }
})