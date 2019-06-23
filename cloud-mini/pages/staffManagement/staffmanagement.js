const request = require('../../common/request.js');
Page({
   
  /**
   * 页面的初始数据
   */
  data: {
    employeesData : [],
    perPage       : 10,
    total         : 0,
    totalPages    : 0,
    page          : 0,
    loadingState  : 'hide',
    footerState   : 'hide',
  },

    /**
      * 生命周期函数--监听页面加载
      */
    onLoad (options) {
    
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

        let para = { page_count : that.data.perPage, page : that.data.page + 1};
        request.getListemp(para).then(res=>{
            that.setData({
                page          : parseInt(res.current_page),
                totalPages    : res.total_pages,
                total         : res.total,
                employeesData : that.data.employeesData.concat(res.data),
                doloading     : false,
                footerState   : res.current_page >= res.total_pages ? 'show' : 'hide',
                loadingState  : 'hide'
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


    calling(e) {
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.postid
        })
    }
})