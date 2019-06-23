const request = require('../../common/request.js');
Page({
  data: {
    name   : '',
    phone  : '',
    userId : ''
  },

  onLoad (options) {
    var that = this;
    that.setData({
      userId : options.id
    })
    var userId = that.data.userId;
    // base.srever({
    //     url    : "employees/"+userId,
    //     method : 'GET'
    // },(res) => {
    //     that.setData({
    //         name  : res.name,
    //         phone : res.phone
    //     })
    // })
  },

  modifyName(e){
    this.setData({
        name : e.detail.value
    })
  },

  modifyPhone(e){
    this.setData({
        phone : e.detail.value
    })
  },

  preservation(){
    var that = this;
    var userId = that.data.userId;
    // base.srever({
    //     url    : "employees/"+userId,
    //     method : 'PUT',
    //     data   :{
    //       name  : that.data.name,
    //       phone : that.data.phone
    //     }
    // },(res) => {
    //     base.promptBox('修改成功');
    //     setTimeout(function () {
    //         wx.navigateBack({
    //             url: '/pages/staffManagement/staffManagement'
    //         })
    //     }, 2000)
    // })
  }
})