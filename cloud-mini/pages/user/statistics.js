const request = require('../../common/request.js');
Page({
    /*页面的初始数据*/
    data: {
        employeesData : [],
        idArray       : []
    },

    onLoad: function (options) {
        var that          = this,
            employeesList = [];
        // base.srever({
        //     loading : true,       
        //     url     : "employees",
        //     method  : "GET"
        // },(res) => {
        //     that.setData({
        //         employeesData : res,
        //     })
        // })
    }
})