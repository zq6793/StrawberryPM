const request  = require('../../common/request.js');
const wxcharts = require('../../utils/wxcharts.js');
Page({

    data: {
        list             : [],
        total            : {},
        listStaus        : [], 
        totalStaus       : {},
        totalRoom        : '',
        totalVisitors    : '',
        occupancyRatePie : '',
        visitCanvas      : '',
        lineChart        : '',
        // visit            : [{id : "LAST_YEAR",name:"过去一年"},{id:"LAST_MONTH",name:"过去一月"},{id:"LAST_WEEK",name:"过去一周"}],
        // visitIndex       : 0,
        width            : 320,
        isShowData       : false
    },

    onLoad(){
        var windowWidth = this.data.width;
        try {
            var res = wx.getSystemInfoSync();
            this.setData({
                width : res.windowWidth
            })
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }
    },

    onShow () {
        var that = this;

        //调接口, 获取入住率并绘制饼图 /*入住率*/
        request.getDataCheckin().then(res=>{
            let series = [];
            series.push({
                name : res.hasRent.name,
                data : res.hasRent.count,
                format() {
                    return res.hasRent.bfb;
                }
            },{
                name : res.notRent.name,
                data : res.notRent.count,
                format(val) {
                    return res.notRent.bfb;
                }
            });

            that.drawOccupancyRatePie({
                series  : series,
                width   : that.data.width,
                checkIn : Math.round(res.hasRent.count/res.totalRent.count*100),
            });

            that.setData({
                totalRoom : res.totalRent.count,
            });
        }).catch(e=>{
            console.log(e);
        });

        /*来访登记*/
        request.getDataVisit().then(respone=>{
            let series        = [],
                totalVisitors = 0;

            for (var key in respone){
                if (respone[key].count > 0){
                    let name = respone[key].name,
                        data = respone[key].count,
                        bfb  = respone[key].bfb;

                    series.push({
                        name,
                        data,
                        format() {
                            return bfb;
                        }
                    })

                    totalVisitors += parseInt(respone[key].count);
                }
            }

            if(series.length == 0){
                that.setData({
                    isShowData : true
                })
            }else{
                that.getRatePre({
                    series  : series,
                    width   : that.data.width
                });
                that.setData({
                    isShowData    : false,
                    totalVisitors : totalVisitors
                })
            }
        }).catch(e=>{
            console.log(e);
        });

        /*数据清单*/
        request.getDataApartment().then(res=>{
            for(var key in res.fx_data){
                if(res.fx_data[key].name.length >= 6){
                    res.fx_data[key].styleClass = true;
                }else{
                    res.fx_data[key].styleClass = false;
                }
            }

            that.setData({
                list  : res.fx_data,
                total : res.fx_hj
            })
        }).catch(e=>{
            console.log(e);
        });

        /*空闲数据*/
        request.getDataFree().then(res=>{
            for(var key in res.fxkx_data){
                if(res.fxkx_data[key].name.length >= 6){
                    res.fxkx_data[key].styleClass = true;
                }else{
                    res.fxkx_data[key].styleClass = false;
                }
            }
            
            that.setData({
                listStaus  : res.fxkx_data,
                totalStaus : res.fxkx_hj
            })
        }).catch(e=>{
            console.log(e)
        })
    },

    drawOccupancyRatePie (parameters) { /*入住率*/
        let that        = this,
            options     = {
                type                : 'ring',
                width               : parameters.width,
                height              : 300,
                //legend              : true,
                padding             : 0,
                canvasId            : 'ringPie',
                dataLabel           : true,
                animation           : true,
                disablePieStroke    : true,

                extra               : {
                    ringWidth   : 25,
                    pie         : { offsetAngle : -45 }
                },
                title               : {
                    name        : parameters.checkIn+'%',
                    color       : '#666666',
                    fontSize    : 20
                },
                subtitle            : {
                    name        : '入住率',
                    color       : '#666666',
                    fontSize    : 15
                },
                series              : parameters.series
            };
        that.setData({
            occupancyRatePie    : new wxcharts(options)
        });
    },

    getRatePre(options){  //来访渠道
        let that   = this,
            option = {
            canvasId   : 'pieCanvas',
            type       : 'pie',
            width      : options.width,
            height     : 300,
            dataLabel  : true,
            series     : options.series
        }

        that.setData({
            visitCanvas : new wxcharts(option)
        });
    },
})