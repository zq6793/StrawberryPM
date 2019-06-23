const rootPath = './';
const request = require(rootPath + 'common/request.js');
const common = require(rootPath + 'common/common.js');
const config = require(rootPath + 'common/config.js');

let options ={
    onLaunch :function(){
        if (!common.isAuthorize()){
            request.wechatLogin().catch(e =>{
               console.log(e)
            });
        }
    },

    onShow: function () {
        // request.getUserInfo().then(request.saveWechatUserInfo).catch(error => {
        //     console.log(error);
        // });
    },

    /*app.globalData.scence 为1的时候是公寓云
        为0的时候是草莓火花社区*/
    
    /*app.globalData.isShow 为 true 显示  、  为 false 不显示*/
    globalData: {
        userInfo   : null,
        scence     : 0,
        isShow     : true, //换房
        tongzhuren : false, //同住人
        vNumber    : "v3.9.8", //版本号
    }
};

App(options);
