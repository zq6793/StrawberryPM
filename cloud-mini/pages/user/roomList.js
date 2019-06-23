const request = require('../../common/request.js');
//获取应用实例
var app = getApp ()
Page({
    data: {
        open         : false,
        roomList     : '',
        showStatus   : false,
        showChoice   : false,
        status       : '',
        store_id     : '',
        building_id  : ''
    },

    onLoad(option){
        /*判断是集中式还是分布式*/
        let that         = this,
            is_store_type = "";

        that.data.store_type  = option.store_type;
        if(that.data.store_type === "DOT"){
            is_store_type = true;
            that.dot();
        }else if(that.data.store_type === "UNION"){
            is_store_type = false;
            that.union();
        }
        that.setData({
            showStoreType : is_store_type
        })
    },

    onShow() {
        let that    = this;

        wx.getStorage({
            key     : 'currentApartmentId',
            success : function (res) {
                that.setData({
                    store_id : res.data,
                });

                let para = {store_id : that.data.store_id};
                request.getBuilding(para).then(res=>{
                    if(res.length>1){
                        that.setData({
                            showChoice : true,
                            buildings  : res 
                        })
                    }
                }).catch(e=>{
                    console.log(e);
                });
            },
            fail    : function (res) {
                that.setData({
                    store_id  : 0,
                });
            }
        });

        request.getRoomInfo().then(res=>{
            let room_list = res.list;
            for (var key in room_list){
                room_list[key].toggle = false;
            }
            that.setData({
                roomList : room_list
            }) 
        }).catch(e=>{
            console.log(e);
        });        
    },

    /*分布式*/
    dot(){
        let that    = this;
        /*获取当前门店下的小区*/
        request.getStroeVillage().then(res=>{
            if(res.community.length>0){
                that.setData({
                    showChoice  : true,
                    dotRoomList : res.community,
                    roomList    : []
                })
            }
        }).catch(e=>{
            console.log(e)
        })
    },

    /*集中式*/
    union() {
        let that    = this;
        /*获取楼栋*/
        let para = { store_id : that.data.store_id };
        request.getBuilding(para).then(res=>{
            if(res.length>0){
                that.setData({
                    showChoice : true,
                    buildings  : res 
                })
            }
        }).catch(e=>{
            console.log(e)
        })

        that.getRoomInfo('');
    },

    list(e) {
        this.setData({
          open : !this.data.open
        })
    },

    logToggle(e){
        let index     = e.currentTarget.dataset.index,
            nowToggle = this.data.roomList[index].toggle;
        this.data.roomList[index].toggle = !nowToggle;
        this.setData({
          roomList: this.data.roomList
        })
    },

    // status(e){
    //     var index = e.currentTarget.dataset.id;
    //     this.setData({
    //         showStatus :　index
    //     })
    // },

    /*点击搜索*/
    statusShow(e){
        let that  = this,
            statu = e.currentTarget.dataset.text,
            obj   = {};
        
        that.setData({
            status : statu
        })

        if(that.data.building_id){
            obj = {
                status      : statu,
                building_id : that.data.building_id
            }
        }else{
            obj = {
                status      : statu
            }
        }
        
        request.getRoomInfo(obj).then(res=>{
            let room_list = res.list;
            if(room_list.length === 0){
                request.showToast("没有数据！");
                that.setData({
                    roomList : []
                })
            }else{
                that.setData({
                    roomList : room_list
                })
            }
        }).catch(e=>{
            console.log(e);
        });
    },


    /*选择楼栋*/
    refresh(e){
        let that = this,
            id   = e.currentTarget.dataset.buildid,
            para = { building_id : id};

        that.setData({
            building_id : id
        })    

        request.getRoomInfo(para).then(res=>{
            let room_list = res.list;
            for (var key in room_list) {
              room_list[key].toggle = false;
            }
            that.setData({
                roomList : room_list,
                open     : false
            })    
        }).catch(e=>{
            console.log(e);
        });
    }
})