const request = require('../../common/request.js');
//获取应用实例
var app = getApp()
Page({
	data: {
		inputShowed  : false,
		inputVal     : "",
		ownerList    : [],
		loadingState : 'hide',
		footerState  : 'hide',
		searchInfo   : [],
		doloading    : false,
		perPage      : 15,
		total        : 0,
		totalPages   : 0,
		page         : 0
	},
	//事件处理函数
	onLoad() {

	},

	onShow(){
		this.requestData();
	},

	/**
	 * 向服务器请求数据
	 */
	requestData () {
		let that = this;

		if (that.data.doloading) {
			return false;
		}

		if (0 < that.data.page && that.data.page > that.data.totalPages) {
			return false;
		}

		that.setData({
			doloading       : true,
			loadingState    : 'show',
			footerState     : 'hide',
		});

		wx.showNavigationBarLoading();

		let para = { pre_page : that.data.perPage, page : that.data.page + 1};
		request.getOwnweList(para).then(res=>{
			that.setData({
				page         : parseInt(res.current_page),
				totalPages   : res.total_pages,
				total        : res.total,
				ownerList    : that.data.ownerList.concat(res.data),
				doloading    : false,
				footerState  : res.current_page >= res.total_pages ? 'show' : 'hide',
				loadingState : 'hide'
			});

			wx.stopPullDownRefresh();
			wx.hideNavigationBarLoading();
		}).catch(e=>{
			console.log(e);
		});
	},

	/**
	 * 下拉刷新
	 */
	onPullDownRefresh () {
		this.setData({
			loadingState    : 'show',
			page            : 0,
			totalPages      : 0,
			total           : 0
		});

		this.requestData();
	},

	/**
	 * 触底加载
	 */
	onReachBottom () {
		this.requestData();
	},

	showInput() {
		this.setData({
			inputShowed  : true
		});
	},

	hideInput() {
		this.setData({
			inputVal    : "",
			inputShowed : false
		});
	},

	clearInput() {
		this.setData({
			inputVal : ""
		});
	},

	inputTyping(e) {
		var that = this;
		that.setData({
			inputVal: e.detail.value
		});
		
		if (e.detail.value.length > 2){

			let para = { number : e.detail.value};
			request.searchOwner(para).then(res=>{
				that.setData({
					searchInfo   : res.data,
					loadingState : 'hide',
					footerState  : 'hide'
				})
			}).catch(e=>{
				console.log(e);
			});
		}
	}
})