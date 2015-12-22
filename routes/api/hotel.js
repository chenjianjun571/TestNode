/**
 * Created by chenjianjun on 15/12/11.
 * 酒店API路由
 * 请求：host/api/hotel/:position   host/api/hotel/:position/:id
 * 应答：{"success":true,"message":null,"data":[],"code":200,"count":0}
 */
var express = require('express');
var router = express.Router();
var env=require("../../cache/db/config");
var memCacheMgr = require('../../cache/mem/manager');
var Hotel=require("../../cache/db/module/hotel");
var DBUtil=require("../../cache/db/dbUtil").Instance();
var r=env.Thinky.r;

var apiPath = "/api/hotel/";

// 获取酒店列表
router.get('/:position', function(request, response, next) {

    if(!DBUtil.getSyncFlg("Hotel")) {
        // 程序在同步酒店数据期间，采用内存缓存机制
        var urlPath = apiPath+request.url;
        memCacheMgr.getData(urlPath, urlPath, function(code, data) {
            response.writeHead(code, {'Content-type': 'application/json;charset=UTF-8'});
            response.end(data+"\n");
        });
    } else {
        // 获取请求参数
        console.log(request.query);
        // pageIndex 当前页数 缺省值:1
        // pageSize 每页条数  缺省值:10
        // minTable 最小容客桌数
        // maxTable 最大容客桌数
        // minPrice 最小价格
        // maxPrice 最大价格
        // isGift 是否有礼包 1 有 0 没有
        // isDisaccount 是否有优惠 1 有 0 没有
        // sort 按什么排序 price ：按价格排序 table：按桌数排序
        // order 排序方式 asc 正序 ； desc 倒序
        // hotelName 酒店名称模糊匹配
        // cityId 所在市区
        var search = Hotel;
        // 增加位置条件
        search = search.filter({position:request.params.position});
        // 是否有礼包查询
        if(request.query["isGift"]) {
            search = search.filter({isGift:Number(request.query["isGift"])});
        }
        // 是否有优惠查询
        if(request.query["isDisaccount"]) {
            search = search.filter({isGift:Number(request.query["isDisaccount"])})
        }
        // 是否有市区ID
        if(request.query["cityId"]) {
            search = search.filter({cityId:Number(request.query["cityId"])})
        }
        // 是否有酒店名称模糊
        if(request.query["hotelName"]) {
            search = search.filter(r.row("name").match(".*?"+request.query["hotelName"]+".*?"));
        }
        // 最小容客桌数
        if(request.query["minTable"]) {
            search = search.filter(r.row("maxTableNum").gt(Number(request.query["minTable"])));
        }
        // 最大容客桌数
        if(request.query["maxTable"]) {
            search = search.filter(r.row("maxTableNum").lt(Number(request.query["maxTable"])));
        }

        if(request.query["minPrice"]&&request.query["maxPrice"]) {
            // 同时存在最小，最大价格
            var minPrice = Number(request.query["minPrice"]);
            var maxPrice = Number(request.query["maxPrice"]);
            // 最小价格落在区间内 或者最大价格落在区间内
            search = search.filter(r.row("lowestConsumption").ge(minPrice)
                .and(r.row("lowestConsumption").le(maxPrice))
                    .or(r.row("highestConsumption").ge(minPrice)
                        .and(r.row("highestConsumption").le(maxPrice))));
        }
        else if(request.query["minPrice"]) {
            // 只有最小价格
            var minPrice = Number(request.query["minPrice"]);
            search = search.filter(r.row("lowestConsumption").gt(minPrice));
        }
        else if(request.query["maxPrice"]) {
            // 只有最大价格
            var maxPrice = Number(request.query["minPrice"]);
            search = search.filter(r.row("highestConsumption").lt(maxPrice));
        }

        // sort 按什么排序 price ：按价格排序 table：按桌数排序
        if(request.query["sort"]) {
            var sortFiled;
            if(request.query["sort"] === "price") {
                sortFiled = "highestConsumption";
            } else if(request.query["sort"] === "table") {
                sortFiled = "maxTableNum";
            }

            if(sortFiled) {
                // order 排序方式 asc 正序 ； desc 倒序
                if(request.query["order"] && (request.query["order"] === "desc")) {
                    search = search.orderBy(r.desc(sortFiled));
                } else {
                    // 默认安装价格排序
                    search = search.orderBy(sortFiled);
                }
            } else {
                search = search.orderBy("highestConsumption");
            }

            console.log(sortFiled);
        } else {
            search = search.orderBy("highestConsumption");
        }

        var limit = 0;
        if(request.query["pageIndex"]) {
            limit = Number(request.query["pageIndex"]) - 1;
            if(limit < 0) {
                limit = 0;
            }
        }

        if(request.query["pageSize"]) {
            search = search.skip(limit*Number(request.query["pageSize"]));
            search = search.limit(Number(request.query["pageSize"]));
        } else {
            search = search.limit(10);
        }

        search.run().then(function(result) {
            var data = {
                success:true,
                message:"",
                data:result,
                code:200,
                count:result.length
            };

            var str = JSON.stringify(data);
            response.writeHead(200, {'Content-type': 'application/json;charset=UTF-8'});
            response.end(str+"\n");
        }).error(function(error) {
            // 数据库操作失败的情况下，代理到后台获取数据
            var urlPath = apiPath+request.url;
            memCacheMgr.getData(urlPath, urlPath, function(code, data) {
                response.writeHead(code, {'Content-type': 'application/json;charset=UTF-8'});
                response.end(data+"\n");
            });
            //var data = {
            //    success:false,
            //    message:"数据库异常",
            //    data:[],
            //    code:404,
            //    count:0
            //};
            //var str = JSON.stringify(data);
            //response.writeHead(200, {'Content-type': 'application/json;charset=UTF-8'});
            //response.end(str+"\n");
        });
    }
});

// 获取酒店详情
router.get('/:position/:hotelID', function(request, response, next) {

    if(!DBUtil.getSyncFlg("Hotel")) {
        // 程序在同步酒店数据期间，采用内存缓存机制
        var urlPath = "/api/hotel/"+request.url;
        memCacheMgr.getData(urlPath, urlPath, function(code, data) {
            response.writeHead(code, {'Content-type': 'application/json;charset=UTF-8'});
            response.end(data+"\n");
        });
    } else {
        // 增加位置条件
        // 根据酒店ID查询详情
        Hotel.filter(
            {hotelId:parseInt(request.params.hotelID),
            position:request.params.position}
        ).run().then(function(result) {
            var data = {
                success:true,
                message:"",
                data:result,
                code:200,
                count:result.length
            };

            var str = JSON.stringify(data);
            response.writeHead(200, {'Content-type': 'application/json;charset=UTF-8'});
            response.end(str+"\n");
        }).error(function(error) {
            var data = {
                success:false,
                message:"数据库异常",
                data:[],
                code:404,
                count:0
            };
            var str = JSON.stringify(data);
            response.writeHead(200, {'Content-type': 'application/json;charset=UTF-8'});
            response.end(str+"\n");
        });
    }
});

module.exports = router;
