const request = require('../../common/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
     codeUrl : '',
     id      : ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // base.srever({
    //     loading: true,
    //     url: "apartments/"+options.id+ "/qrcode",
    //     method: "GET"
    // },(res) => {
    //     this.setData({
    //        codeUrl: res.url
    //     })
    // })
  },
  onShow() {
  },
  colseCode() {
    wx.switchTab({
      url: '/pages/user/user'
    })
  }
})