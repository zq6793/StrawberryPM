const request = require('../../common/request.js');
const requestV4 = require('../../common/request_v4.js');
//获取应用实例
var app = getApp()
Page({
    data: {
        titleText    : ['待我审批','发起审批','完成审批','全部'], 
        curTabsIndex : 0,
        allTaskList  : [],
        waitTastList : [],
        launchTask   : [],
        completeTask : [],
        loadingState : 'hide',
        doloading    : false,
        footerState  : 'hide',
        perPage      : 15,
        page1        : 0,
        total1       : 0,
        totalPages1  : 0,
        page2        : 0,
        total2       : 0,
        totalPages2  : 0,
        page3        : 0,
        total3       : 0,
        totalPages3  : 0,
        page4        : 0,
        total4       : 0,
        totalPages4  : 0,
        inputShowed  : false,
        inputVal     : "", //输入查询的房间号
        appType      : [{'id':'','name':'请选择审批类型'},{'id':'CHECKOUT','name':'正常退房任务流'},{'id':'NO_LIABILITY','name':'特殊退房任务流'},
                        {'id':'UNDER_CONTRACT','name':'违约退房(退款大于0)'},{'id':'UNDER_CONTRACT_LESS','name':'违约退房(退款小于0)'},
                        {'id':'GIVE_UP','name':'放弃追缴'},{'id':'CHANGE_ROOM','name':'换房'},{'id':'ADD_REFUND','name':'额外退款'},
                        {'id':'PRICE','name':'调价'},{'id':'RESERVE','name':'预约'},{'id':'SERVICE','name':'服务'},{'id':'WARNING','name':'警告'}],
        appTypeIndex : 0,
        type         : "",
    },

    //事件处理函数
    onLoad() {
        wx.setStorage({
            key   : 'taskflowCurTabsIndex',
            data  : 0,
        });
    },

    onShow(){
        let that = this,
            this_index = 0;

        wx.getStorage({
            key:"taskflowCurTabsIndex",
            success:function(res){
                this_index = res.data;
                that.searchCont(this_index,that.data.type,that.data.inputVal);
            }
        });
    },

    showInput() {
        this.setData({
            inputShowed : true
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
        this.searchCont(this.data.curTabsIndex,this.data.type,"");
    },

    inputTyping (e) {
        let that = this;
        that.setData({
            inputVal : e.detail.value,
            page1        : 0,
            page2        : 0,
            page3        : 0,
            page4        : 0,
            allTaskList  : [],
            waitTastList : [],
            launchTask   : [],
            completeTask : [],
        });

        if(that.data.inputVal.length > 2 || that.data.inputVal.length > 3){
            that.searchCont(that.data.curTabsIndex,that.data.type,that.data.inputVal);
        }
    },

    /*选择审批类型*/
    bindAppType(e){
        let that = this;

        that.setData({
            appTypeIndex : e.detail.value,
            page1        : 0,
            page2        : 0,
            page3        : 0,
            page4        : 0,
            allTaskList  : [],
            waitTastList : [],
            launchTask   : [],
            completeTask : [],
        });

        that.data.type = that.data.appType[that.data.appTypeIndex].id;
        that.searchCont(that.data.curTabsIndex,that.data.type,that.data.inputVal);
    },

    /*点击搜索*/
    statusShow(e){
        let that  = this,
            index = e.currentTarget.dataset.index;

        that.setData({
            curTabsIndex : index,
        });

        that.searchCont(index,that.data.type,that.data.inputVal);

        wx.setStorage({
            key   : 'taskflowCurTabsIndex',
            data  : index,
        });
    },

    /*搜索内容*/
    searchCont(index,type,number){
        let that = this;
        switch(index){
            case 0:
                that.getWaitData(type,number);
                break;
            case 1:
                that.getLaunchData(type,number);
                break;
            case 2:
                that.getCompleteData(type,number);
                break;
            case 3:
                that.getAllData(type,number);
                break;
            // default:
        }
    },

    /*获取全部*/
    getAllData(type,number){
        let that  = this,
            para = { page : that.data.page1 + 1, per_page : that.data.perPage };

        that.setData({
            page2        : 0,
            page3        : 0,
            page4        : 0,
            waitTastList : [],
            launchTask   : [],
            completeTask : [],
        })

        if (that.data.doloading) {
            return false;
        }

        if (0 < that.data.page1 && that.data.page1 >= that.data.totalPages1) {
            return false;
        }

        wx.showNavigationBarLoading();

        that.setData({
            doloading    : true,
            loadingState : 'show',
            footerState  : 'hide',
        });

        if(type != "" || number != ""){
            para.type   = type;
            para.search = number ;
        }
        requestV4.getAllTaskflowList(para).then(res=>{
            let allTaskList = res.items
            allTaskList.forEach((item) => {
                item.taskflow.CreatedAt = request.goTime(item.taskflow.CreatedAt)
                let val = ''
                if(item.current_step){
                    item.current_step.positions.forEach((item2, index) => {
                        if (index == 0) {
                          val += item2.name
                        } else {
                          val += '/' + item2.name
                        }
                        item.current_step_show = val
                    })
                }
            })
            that.setData({
                page1        : parseInt(parseInt(res.offset/10)+1),
                totalPages1  : parseInt(parseInt(res.count/10)+1),
                total1       : res.count,
                allTaskList  : that.data.allTaskList.concat(allTaskList),
                doloading    : false,
                footerState  : that.data.page1 >= that.data.totalPages1 ? 'show' : 'hide',
                loadingState : 'hide'
            });
            wx.stopPullDownRefresh();
            wx.hideNavigationBarLoading();
        }).catch(e=>{
            console.log(e)
        });
    },

    /*获取待我审批*/
    getWaitData(type,number){
        let that = this,
            para = { page : that.data.page2 + 1, per_page : that.data.perPage };
            // para = { limit : 10, offset : 0 };

        that.setData({
            page1        : 0,
            page3        : 0,
            page4        : 0,
            allTaskList  : [],
            launchTask   : [],
            completeTask : [],
        });

        if (that.data.doloading) {
            return false;
        }

        if (0 < that.data.page2 && that.data.page2 >= that.data.totalPages2) {
            return false;
        }

        wx.showNavigationBarLoading();

        that.setData({
            doloading    : true,
            loadingState : 'show',
            footerState  : 'hide',
        });

        if(type != "" || number != ""){
            para.type   = type;
            para.search = number ;
        }
        requestV4.getListtaskflow(para).then(res=>{
            let waitTaskList = res.items
            waitTaskList.forEach((item) => {
                item.taskflow.CreatedAt = request.goTime(item.taskflow.CreatedAt)
                let val = ''
                if(item.current_step){
                    item.current_step.positions.forEach((item2, index) => {
                        if (index == 0) {
                          val += item2.name
                        } else {
                          val += '/' + item2.name
                        }
                        item.current_step_show = val
                    })
                }
            })
            console.log(res)
            that.setData({
                page2        : parseInt(parseInt(res.offset/10)+1),
                totalPages2  : parseInt(parseInt(res.count/10)+1),
                total2       : res.count,
                waitTastList : that.data.waitTastList.concat(waitTaskList),
                doloading    : false,
                footerState  : that.data.page2 >= that.data.totalPages2 ? 'show' : 'hide',
                loadingState : 'hide'
            });
            wx.stopPullDownRefresh();
            wx.hideNavigationBarLoading();
        }).catch(e=>{
            console.log(e);
        });
    },

    /*获取发起审批*/
    getLaunchData(type,number){
        let that = this,
            para = { page : that.data.page3 + 1, per_page : that.data.perPage };

        that.setData({
            page1        : 0,
            page2        : 0,
            page4        : 0,
            allTaskList  : [],
            waitTastList : [],
            completeTask : [],
        });
        if (that.data.doloading) {
            return false;
        }

        if (0 < that.data.page3 && that.data.page3 >= that.data.totalPages3) {
            return false;
        }

        wx.showNavigationBarLoading();

        that.setData({
            doloading    : true,
            loadingState : 'show',
            footerState  : 'hide',
        });

        if(type != "" || number != ""){
            para.type   = type;
            para.search = number ;
        }
        requestV4.getLaunchTaskList(para).then(res=>{
            let launchTaskList = res.items
            launchTaskList.forEach((item) => {
                item.taskflow.CreatedAt = request.goTime(item.taskflow.CreatedAt)
                let val = ''
                if(item.current_step){
                    item.current_step.positions.forEach((item2, index) => {
                        if (index == 0) {
                          val += item2.name
                        } else {
                          val += '/' + item2.name
                        }
                        item.current_step_show = val
                    })
                }
            })
            that.setData({
                page3        : parseInt(parseInt(res.offset/10)+1),
                totalPages3  : parseInt(parseInt(res.count/10)+1),
                total3       : res.count,
                launchTask   : that.data.launchTask.concat(launchTaskList),
                doloading    : false,
                footerState  : that.data.page3 >= that.data.totalPages3 ? 'show' : 'hide',
                loadingState : 'hide'
            });

            wx.stopPullDownRefresh();
            wx.hideNavigationBarLoading();
        }).catch(e=>{
            console.log(e);
        });
    },

    /*获取完成审批*/
    getCompleteData(type,number){
        let that = this,
            para = { page : that.data.page4 + 1, per_page : that.data.perPage };

        that.setData({
            page1        : 0,
            page2        : 0,
            page3        : 0,
            allTaskList  : [],
            waitTastList : [],
            launchTask   : [],
        });

        if (that.data.doloading) {
            return false;
        }

        if (0 < that.data.page4 && that.data.page4 >= that.data.totalPages4) {
            return false;
        }

        wx.showNavigationBarLoading();

        that.setData({
            doloading    : true,
            loadingState : 'show',
            footerState  : 'hide',
        });

        if(type != "" || number != ""){
            para.type   = type;
            para.search = number ;
        }
        requestV4.getCompleteTask(para).then(res=>{
            let completeTaskList = res.items
            completeTaskList.forEach((item) => {
                item.taskflow.CreatedAt = request.goTime(item.taskflow.CreatedAt)
                let val = ''
                if(item.current_step){
                    item.current_step.positions.forEach((item2, index) => {
                        if (index == 0) {
                          val += item2.name
                        } else {
                          val += '/' + item2.name
                        }
                        item.current_step_show = val
                    })
                }
            })
            that.setData({
                page4        : parseInt(parseInt(res.offset/10)+1),
                totalPages4  : parseInt(parseInt(res.count/10)+1),
                total4       : res.count,
                completeTask : that.data.completeTask.concat(completeTaskList),
                doloading    : false,
                footerState  : that.data.page4 >= that.data.totalPages4 ? 'show' : 'hide',
                loadingState : 'hide'
            });

            wx.stopPullDownRefresh();
            wx.hideNavigationBarLoading();
        }).catch(e=>{
            console.log(e)
        });
    },

    /*下拉刷新*/
    onPullDownRefresh () {
        let that = this;
        that.setData({
            loadingState : 'show',
        });

        let index = that.data.curTabsIndex;

        switch(index){
            case 0:
               that.setData({
                    page1       : 0,
                    totalPages1 : 0,
                    total1      : 0
                });
                that.getWaitData(that.data.type,that.data.inputVal);
                break;
            case 1:
                that.setData({
                    page2       : 0,
                    totalPages2 : 0,
                    total2      : 0
                });
                that.getLaunchData(that.data.type,that.data.inputVal);
                break;
            case 2:
                that.setData({
                    page3       : 0,
                    totalPages3 : 0,
                    total3      : 0
                });
                that.getCompleteData(that.data.type,that.data.inputVal);
                break;
            case 3:
                that.setData({
                    page4       : 0,
                    totalPages4 : 0,
                    total4      : 0
                });
                that.getAllData(that.data.type,that.data.inputVal);
                break;
        }
    },

    /*触底加载*/
    onReachBottom () {
        let that = this;

        let index = that.data.curTabsIndex;

        switch(index){
            case 0:
                that.getWaitData(that.data.type,that.data.inputVal);
                break;
            case 1:
                that.getLaunchData(that.data.type,that.data.inputVal);
                break;
            case 2:
                that.getCompleteData(that.data.type,that.data.inputVal);
                break;
            case 3:
                that.getAllData(that.data.type,that.data.inputVal);
                break;
        }
    },

    /*其他服务订单*/
    showServiceDetail (e) {
        let deal = e.currentTarget.dataset.deal,
            id   = e.currentTarget.dataset.id,
            url  = '/pages/serviceOrder/serviceOrderinfo?id=' + id;

        if (deal === 'SUBMITTED') {
            url = '/pages/serviceOrder/edit?id=' + id;
        }

        wx.navigateTo({
            url : url
        });
    },

    /*完成 服务订单*/
    showServiceDetailComplete(e){
        let deal = e.currentTarget.dataset.deal,
            id   = e.currentTarget.dataset.id,
            url  = '/pages/serviceOrder/serviceOrderinfo?id=' + id +'&status=2';

        if (deal === 'SUBMITTED') {
            url = '/pages/serviceOrder/edit?id=' + id;
        }

        wx.navigateTo({
            url : url
        });
    },
})