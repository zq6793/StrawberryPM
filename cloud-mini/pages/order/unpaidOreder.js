const utils        = require('../../utils/util.js');
const requestV4 = require('../../common/request_v4.js');
const request   = require('../../common/request.js');
const time      = utils.formatDate(new Date());
//获取应用实例
var app = getApp()
Page({
    data: {
        resident_id  : '',
        resident  : '',
        unpaid         : [],
        Topay          : [],
        total          : 0,
        couponList     : [],
        orderIds       : [],
        premoney       : 0, //预存金总额
        reduceMoney    : 0, //预存金抵扣
        totalMoney     : 0,
        topayList      : '', //交易支付列表
    },

    //事件处理函数
    onLoad(option) {
    let that = this;
    //  判断是否需要清除缓存
    if(option.id){
        wx.removeStorageSync('topay'+option.resident_id);
        wx.removeStorageSync('tocoupon'+option.resident_id);
        wx.removeStorageSync('topayList'+option.resident_id);
      }
      //  获取费用列表
      requestV4.getResidentInfo(option.resident_id).then(res=>{
          that.setData({
            resident  : res,
            resident_id: option.resident_id
          })
      }).catch(e=>{
          console.log(e);
      });
      // 支付列表
      requestV4.getUnpaidlist(option.resident_id).then(res=>{
          if(res.code){
            request.showToast(res.message);
          }else{
            let Topay    = res.items,
                orderIds = [],
                total    = 0;
            for (let i = 0; i < Topay.length; i++) {
              Topay[i].ischecked = true;
              orderIds[i]=Topay[i].ID;
              total += parseFloat(Topay[i].money);
            }
            wx.setStorageSync('topay'+option.resident_id,Topay)
            that.setData({
              Topay  : Topay,
              total   : total.toFixed(2),
              orderIds : orderIds,
            })
           }
          }).catch(e=>{
            console.log(e);
        });        
        // //获取优惠券列表
    },

    onShow(){
        if(this.data.resident_id){
        let that        = this,
            Topay       = wx.getStorageSync('topay'+that.data.resident_id),
            couponList  = wx.getStorageSync('tocoupon'+that.data.resident_id),
            topayList   = wx.getStorageSync('topayList'+that.data.resident_id),
            total       = 0,
            orderIds    = [];
        if(Topay){
            let j =0;
            for (let i = 0; i < Topay.length; i++) {
              if(Topay[i].ischecked){
                orderIds[j]=Topay[i].ID
                j++;
                total += parseFloat(Topay[i].money);
              }
            }
            that.setData({
              Topay  : Topay,
              total   : total.toFixed(2),
              orderIds : orderIds,
            })
        }
        if(couponList){
            that.setData({
              couponList  : couponList,
            })
        }
        //获取支付记录列表
        if(topayList){
            that.setData({
              topayList  : topayList,
            })
        }
      }
    },

    choosePay(){
        let that = this;
        wx.navigateTo({
          url: '/pages/order/Costlist?residentid='+that.data.resident_id
        })
    },

    close(){
        let that = this;
        that.setData({
            details  : 'hide',
            isShow   : 'show'
        });
        that.close_coupon();
    },

    /*拨打电话*/
    calling(e){
      let phone   = e.currentTarget.dataset.phone;
      wx.makePhoneCall({
        phoneNumber : phone
      });
    },
    coupon(){
        let that     = this;
        let data = {
            resident_id : that.data.resident_id,
            order_ids   : that.data.orderIds,
        }
        request.getCouponList(data).then(res=>{
            for(var key in res.coupons){
              res.coupons[key].ischecked = false;
            }
            wx.setStorageSync('tocoupon'+that.data.resident_id, res.coupons)
            wx.navigateTo({
              url: '/pages/order/Coupon?residentid='+that.data.resident_id
            })
        }).catch(e=>{
            console.log(e);
        });
    },
    /*选择打开缴费信息录入*/
    feeInfo(){
        let that = this
        wx.navigateTo({
          url: '/pages/order/Payinfo?residentid='+that.data.resident_id
        })
    },

    /*预览图片*/
    previewImage(e){
        wx.previewImage({
            current : e.currentTarget.imgurl, // 当前显示图片的http链接
            urls    : tempdata // 需要预览的图片http链接列表
        })
    },
    /*删除添加缴费记录*/
    deteleOrder(e){
        let that    = this,
            num     = e.currentTarget.dataset.index,
            list    = that.data.topayList;
        list.splice(num,1);
        wx.setStorageSync('topayList'+that.data.resident_id,list)
        that.setData({
            topayList  : list,
        });
    },
    pay(e){
        let that = this;
        let coupon_ids = new Array();
        let couponList = that.data.couponList
        for(let i =0; i<couponList.length;i++){
            coupon_ids[i] = couponList[i].id
        }
        let para = { resident_id : parseInt(that.data.resident_id), 
                fee_ids : that.data.orderIds, 
                coupon_ids: coupon_ids,
                pays : that.data.topayList };

        if(that.data.topayList.length === 0){
            request.showToast('请添加缴费信息');
            return;
        }
        requestV4.pay(para).then(res=>{
            if(res.code){
              request.showToast(res.message);
            }else{
              request.showToast('您已付款成功！');
              setTimeout(function(){
                wx.switchTab({
                  url : "/pages/index/index"
                })
               },3000)
            }
        }).catch(e=>{
            console.log(e);
        });
    },
    /*返回上一页*/
    goBackNext(){
        wx.navigateBack({
            delta : 1
        })
    }
})