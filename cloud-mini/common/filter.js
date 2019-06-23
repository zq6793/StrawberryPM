
/*账单类型*/
function orderType(text) {
    var type = '';
    switch(text) {
        case 'ROOM':
            type = '住宿服务费';
            break;
        case 'CLEAN':
            type = '清洁服务费';
            break;
        case 'DEIVCE':
            type = '设备租赁费';
            break;
        case 'UTILITY':
            type = '水电服务费';
            break;
        case 'REFUND':
            type = '退租';
            break;
        case 'RESERVE':
            type = '定金';
            break;
        case 'MANAGEMENT':
            type = '物业服务费';
            break;
        case 'DEPOSIT_R':
            type = '住宿押金';
            break;
        case 'DEPOSIT_O':
            type = '其他押金';
            break;
        case 'ELECTRICITY':
            type = '用电服务费';
            break;
        case 'WATER':
            type = '冷水服务费';
            break;
        case 'HOT_WATER':
            type = '热水服务费';
            break;
        case 'REPAIR':
            type = '物品维修费';
            break;
        case 'COMPENSATION':
            type = '物品赔偿费';
            break;
        case 'OVERDUE':
            type = '滞纳金';
            break;
        case 'GAS':
            type = '燃气服务费';
            break;
        case 'BREAK':
            type = '违约金';
            break;
        case 'PETCLEAN':
            type = '宠物消杀费';
            break;
        case 'OTHER':
            type = '其他收费';
            break;
    }
    return type;
}

/*房间状态*/
function roomStatus(text) {
    var type = '';
    switch(text) {
        case 'NOT_PAY':
            type = '办理入住未支付';
            break;
        case 'PRE_RESERVE':
            type = '办理预订未支付';
            break;
        case 'PRE_CHECKIN':
            type = '预订转入住未支付';
            break;
        case 'PRE_CHANGE':
            type = '换房未支付';
            break;
        case 'PRE_RENEW':
            type = '续约未支付';
            break;
        case 'RESERVE':
            type = '预订';
            break;
        case 'NORMAL':
            type = '正常';
            break;
        case 'UNDER_CONTRACT':
            type = '违约退房';
            break;
        case 'INVALID':
            type = '无效';
            break;
    }
    return type;
}

/*退租类型*/
function checkoutType(text) {
    let type = '';
    switch(text) {
        case 'CHECKOUT':
        case 'NORMAL_REFUND':
            type = '正常退房审批';
            break;
        case 'NO_LIABILITY':
            type = '特殊退房审批';
            break;
        case 'UNDER_CONTRACT':
        case 'UNDER_CONTRACT_LESS':
            type = '违约退房审批';
            break;
        case 'ADD_REFUND':
            type = '退房-额外退款审批';
            break;
        case 'GIVE_UP':
            type = '放弃追缴退房';
            break;
        case 'REAL_INCOME_LESS':
            type = '退房-实际收益金额小于零';
            break;
    }
    return type;
}

/*审批结果*/
function examination(text) {
    let type = '';
    switch(text) {
        case 'APPROVED':
            type = '通过';
            break;
        case 'UNAPPROVED':
            type = '驳回';
            break;
    }
    return type;
}

/*审批流类型*/
function taskflowType(text){
    let type = '';
    switch(text) {
        case 'CHECKOUT':
            type = '退租';
            break;
        case 'PRICE':
            type = '调价';
            break;
    }
    return type;
}


exports = module.exports = {
    orderType,
    roomStatus,
    checkoutType,
    examination,
    taskflowType,
}
