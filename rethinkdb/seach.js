/**
 * Created by chenjianjun on 15/12/10.
 */
var Module = require('./module').Instance();
var r = Module.r;

//// 查询type是1的，并且hotelName是“袁家”的所有记录
//Module.Hotel.filter(
//    {type: 1,
//        hotelName:"袁家"}).run().then(function(result) {
//    console.log(result);
//});
//
//// 查询type是1的，并且hotelName包含“北城”的所有记录
//Module.Hotel.filter(
//    r.row("hotelName").match(".*?北城.*?")
//).filter({type: 1}).run().then(function(result) {
//        console.log(result);
//    });
//
//// 查询所有记录，根据hotelName降序（此种排序需要hotelName做成索引才可以）
//Module.Hotel.orderBy({index: r.desc("hotelName")}).run().then(function(result) {
//    console.log(result);
//});
//
//// 查询所有记录，根据hotelName降序（此种排序需要hotelName做成索引才可以）,只返回第一条记录
//Module.Hotel.orderBy({index: r.desc("hotelName")}).limit(1).run().then(function(result) {
//    console.log(result);
//});

//// 查询type是1的，并且hotelName包含“盛宴”的并且根据hotelId降序
//Module.Hotel.filter(
//    r.row("hotelName").match(".*?盛宴.*?")
//).filter({type: 1}).orderBy(r.desc("hotelId")).run().then(function(result) {
//        console.log(result);
//    });
//
//// 查询type是1的，并且hotelName包含“盛宴”的并且根据hotelId升序
//Module.Hotel.filter(
//    r.row("hotelName").match(".*?盛宴.*?")
//).filter({type: 1}).orderBy("hotelId").run().then(function(result) {
//        console.log(result);
//    });
//
//// 查询type是1的，并且hotelName包含“盛宴”的并且根据hotelId升序的记录，只返回hotelId和hotelName字段
//Module.Hotel.filter(
//    r.row("hotelName").match(".*?盛宴.*?")
//).filter({type: 1}).orderBy("hotelId").pluck("hotelId","hotelName").run().then(function(result) {
//        console.log(result);
//    });
//
//// 查询type是1的，并且hotelName是"袁家岗芭菲盛宴"和"解放碑芭菲盛宴"的并且根据hotelId升序的记录，只返回hotelId和hotelName字段
//Module.Hotel.filter(function(post){
//        return r.expr(["袁家岗芭菲盛宴","解放碑芭菲盛宴"])
//        .contains(post("hotelName"))}
//).filter({type: 1}).orderBy("hotelId").pluck("hotelId","hotelName").run().then(function(result) {
//        console.log(result);
//    });
//
//// 查询type是1的，并且hotelName不是"袁家岗芭菲盛宴"和"解放碑芭菲盛宴"的并且根据hotelId升序的记录，只返回hotelId和hotelName字段
//Module.Hotel.filter(function(post){
//        return r.expr(["袁家岗芭菲盛宴","解放碑芭菲盛宴"])
//            .contains(post("hotelName")).not()}
//).filter({type: 1}).orderBy("hotelId").pluck("hotelId","hotelName").run().then(function(result) {
//        console.log(result);
//    })

//// 查询所有记录，根据hotelName降序（此种排序需要hotelName做成索引才可以）,只检索两条返回最后一条数据，类似于limit m,n
//Module.Hotel.orderBy({index: r.desc("hotelName")}).limit(2).skip(1).run().then(function(result) {
//    console.log(result);
//});

//Module.Hotel.run().then(function(result) {
//    console.log(result);
//});

Module.Hotel.filter(
    r.row("name").match(".*?test.*?")
).filter({type: 1}).run().then(function(result) {
        console.log(result);
    });
