const requestV4 = require('./request_v4.js');
/*存读数信息*/
function readingInfo(content,weights,reading_list,reading_image,time,coldwater_img,hotwater_img,electric_img,reading_img,callback) {
    let arr = [];
    reading_list.forEach(item => {
        if(item.field === "coldwater_reading" && !content.coldwater_reading){
            requestV4.showToast('请输入冷水表读数');
            return;
        }else if(item.field === "hotwater_reading" && !content.hotwater_reading){
            requestV4.showToast('请输入热水表读数');
            return; 
            
        }else if(item.field === "electric_reading" && !content.electric_reading){
            requestV4.showToast('请输入电表读数');
            return;
            
        }else if(item.field === "gas_reading" && !content.gas_reading){
            requestV4.showToast('请输入燃气表读数');
            return;
            
        }else{}

        if(item.field === "coldwater_reading" && !weights.coldwater_reading){
            weights.coldwater_reading = 100;
            return; 
        }else if(item.field === "hotwater_reading" && !weights.hotwater_reading){
            weights.hotwater_reading = 100;
            return; 
        }else if(item.field === "electric_reading" && !weights.electric_reading){
            weights.electric_reading = 100;
            return;
        }else if(item.field === "gas_reading" && !weights.gas_reading){
            weights.gas_reading = 100;
            return;
        }else{}
    });

    reading_image.forEach(item => {
        if("coldwater_reading" === item.type && !item.img){
            requestV4.showToast('请传冷水表照片');
            return;
        }else if("hotwater_reading" === item.type && !item.img){
            requestV4.showToast('请传热水表照片');
            return;
        }else if("electric_reading" === item.type && !item.img){
            requestV4.showToast('请传电表照片');
            return;
        }else if("gas_reading" === item.type && !item.img){
            requestV4.showToast('请传燃气表照片');
            return;
        }else{}

    })

    if(content.coldwater_reading){
        arr.push({ type : "COLD_WATER_METER", reading : content.coldwater_reading, time : time, weight : weights.coldwater_reading, image : coldwater_img});
    }else if(content.hotwater_reading){
        arr.push({ type : "HOT_WATER_METER", reading : content.hotwater_reading, time : time, weight : weights.hotwater_reading, image : hotwater_img});
    }else if(content.electric_reading){
        arr.push({ type : "ELECTRIC_METER", reading : content.electric_reading, time : time, weight : weights.electric_reading, image : electric_img});
    }else if(content.gas_reading){
        arr.push({ type : "GAS_METER", reading : content.gas_reading, time : time, weight : weights.gas_reading, image : reading_img});
    }else{}
    // console.log(arr)
    return arr;
}

/*时间 -》前后时间比如前几天和后几天*/
function fun_date(number){
    var date1 = new Date(),
        time1 = date1.getFullYear()+"-"+(date1.getMonth()+1)+"-"+date1.getDate();
    var date2 = new Date(date1);
    date2.setDate(date1.getDate() + number);

    return date2.getFullYear()+"-"+(date2.getMonth()+1)+"-"+date2.getDate();
}

exports = module.exports ={
    readingInfo,
    fun_date
}