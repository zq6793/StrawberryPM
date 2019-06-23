//获取应用实例
var app = getApp();
Page({
	data: {
    	contract_url : '',
    },
    onLoad (option) {
      	let that = this,
            contract_url = '';
        let url = wx.getStorageSync('view_contract_link');
        
        if(option.type === "checkin"){
            contract_url = url.checkin_url;
        }else if(option.type === "book"){
            contract_url = url.book_url;
        }else if(option.type === "predeposit"){
            contract_url = url.deposit_url;
        }

        that.setData({
            contract_url : contract_url,
        });
    },
});
