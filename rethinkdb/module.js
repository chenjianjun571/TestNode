/**
 * Created by chenjianjun on 15/12/9.
 */
const Config = {
    rethink:{
        db:'cache',
        host:'192.168.1.4',
        port:'28015'
    },
    tokenSecret :'DION_LEE'
}

var Thinky = require('thinky')(Config.rethink);
var type = Thinky.type;
var r = Thinky.r;
var module=null;

function Module(){
}

// 酒店模型
const Hotel = Thinky.createModel('hotel', {
    hotelId: type.number(), // 酒店ID
    hotelName: type.string().min(3), // 酒店名称
    type: type.number(), // 酒店类型
    banquetHallList: type.array() // 宴会厅列表
})
Hotel.ensureIndex('hotelName');

Module.prototype.r = r;
Module.prototype.type = type;
Module.prototype.Hotel = Hotel;

exports.Instance = function() {
    if (module == null) {
        module = new Module();
    }
    return module;
};


