/**
 * Created by chenjianjun on 15/12/15.
 * 客片分季路由
 */
var express = require('express');
var router = express.Router();
var memCacheMgr = require('../../cache/mem/manager');
var PringlesSeason=require("../../cache/db/module/pringlesSeason");
var DBUtil=require("../../cache/db/dbUtil").Instance();
var r=env.Thinky.r;

var apiPath = "/api/pringlesSeason/";

// 客片分季列表
router.get('/list', function(request, response, next) {
    // 获取请求参数
    console.log(request.url);

    if(!DBUtil.getSyncFlg("PringlesSeason")) {
        // 程序在同步广告数据期间，采用内存缓存机制
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
        var search = PringlesSeason;
        var limit = 0;
        // 解析pageIndex
        if(request.query["pageIndex"]) {
            limit = Number(request.query["pageIndex"]) - 1;
            if(limit < 0) {
                limit = 0;
            }
        }
        // 解析pageSize
        if(request.query["pageSize"]) {
            search = search.skip(limit*Number(request.query["pageSize"]));
            search = search.limit(Number(request.query["pageSize"]));
        } else {
            search = search.limit(10);
        }

        // 默认按照权重排序
        search = search.orderBy(r.desc("weight"));

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
        });
    }
});
