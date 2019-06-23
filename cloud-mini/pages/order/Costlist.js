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
    },
    //事件处理函数
    onLoad(option) {
        let that = this
      	that.setData({
            resident_id  : option.residentid
      	})
        let get_string = 'topay'+option.residentid
        let Topay = wx.getStorageSync(get_string)
        that.setData({
              Topay  : Topay
        })
    },
    onShow(){
      //获取所有费用列表
    },
    checkboxdetail(e){
      let that = this
      const checked = e.detail.value
      let topay = that.data.Topay;
      for (let i = 0; i < topay.length; i++) {
        if(String(topay[i].ID)==checked[0]){
          topay[i].ischecked = !topay[i].ischecked
        }
      }
      that.setData({
        Topay  : topay
      })
    },
    Topaysure(e){
        let that = this
        wx.removeStorageSync('tocoupon'+that.data.resident_id)
        wx.setStorageSync('topay'+that.data.resident_id,that.data.Topay);
        wx.navigateBack({
          delta: 1
       })
    }
})