const rootPath = '../';
const currentPath = './';

const config  = require(currentPath + 'config.js');
const Promise = require(rootPath + 'utils/promise.js');

/*******************缓存token*******************************/
function setAccessTokenSync(token){
    try {
        wx.setStorageSync(config.key.access_token_key, JSON.stringify(token));
        return true;
    } catch(e){
        console.log(e);
        return false;
    }
}

/*******************获取token*******************************/
function getAccessTokenSync() {
    try {
        let token = wx.getStorageSync(config.key.access_token_key);
        return JSON.parse(token);
    } catch (e) {
        return {
            'time' : 0,
        };
    }
}

/*******************验证是否授权*******************************/
function isAuthorize(){
    try {
        let token = getAccessTokenSync(),
            now  = Math.floor(new Date().getTime()/1000);

        return (now <= token.time)
    }catch(e){
        console.log(e);
        return false;
    }
}

exports = module.exports ={
    getAccessTokenSync : getAccessTokenSync,
    setAccessTokenSync : setAccessTokenSync,
    isAuthorize        : isAuthorize,
}
