/**
 * Created by chenjianjun on 15/12/8.
 */
var http = require('http');
var env=require("./config");
var Hotel=require("./module/hotel");
var Adv=require("./module/adv");
var Pringles=require("./module/pringles");
var PringlesSeason=require("./module/pringlesSeason");
var Sample=require("./module/sample");
var qs=require('querystring');
var r = env.Thinky.r;

var adv=0;
var hotel=1;
var sample=2;
var pringles=3;
var pringlesSeason=4;

var dbTool=null;
var mSyncFlg = {
    "Adv":false,
    "Hotel":false,
    "Sample":false,
    "Pringles":false,
    "PringlesSeason":false
};

//查询工具类
function DBUtil() {
};

/**
 * 从后台获取数据
 * @param path URL的接口地址如：/api/adv/list?pageIndex=1&pageSize=2
 * @param cb
 * @constructor
 */
function GetData(path,cb) {
    var options = {
        host: env.Config.api_host,
        port: env.Config.api_port,
        path: path,
        method: "GET"
    };

    //http.get(options, function(res) {
    //    var chunks = "";
    //    res.setEncoding('utf8');
    //
    //    res.on('data', function(chunk) {
    //        chunks+=chunk;
    //    });
    //
    //    res.on('end', function() {
    //        var json = JSON.parse(chunks);
    //        if(json.code == 200) {
    //            cb(null, json);
    //        }
    //    });
    //
    //    res.on('error', function (err) {
    //        cb(err, null);
    //    });
    //});

    var options = {
        host: env.Config.api_host,
        port: env.Config.api_port,
        path: path,
        method: "GET"
    };

    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        var chunks = "";
        res.on('data', function (chunk) {
            chunks+=chunk;
        });
        res.on('end', function() {
            var json = JSON.parse(chunks);
            if(json.code == 200) {
                cb(null, json);
            } else {
                var err = new Error('服务器异常');
                cb(err);
            }
        });
        res.on('error', function (e) {
            cb(e);
        });
    });

    // 设置请求超时15秒
    req.setTimeout(15000);

    req.on('error',function(e) {
        req.res && req.res.abort();
        req.abort();
        var err = new Error('服务器异常');
        cb(err);
    }).on('timeout',function() {
        req.res && req.res.abort();
        req.abort();
        var err = new Error('服务器超时');
        cb(err);
    });

    req.end();
}

/**
 * 同步酒店数据
 * @param datas 拉取的酒店数据
 * @param index 分页数
 * @param count 拉取数量
 * @param cb 数据回调
 * @constructor
 */
function SyncHotel(datas, index, count, cb) {

    // 组装酒店的url path
    var path = env.Config.hotel_api_path+"?"+qs.stringify({ pageIndex: index, pageSize: count });

    // 拖取数据
    GetData(path, function(err, data) {
        if(err) {
            cb(err);
        } else {

            for(var i = 0; i < data.data.length; ++i) {
                datas.push(data.data[i]);
            }

            if(datas.length < data.count) {
                // 如果获取到的数据小于得到的总条数，那么继续拉数据
                SyncHotel(datas, index+1, count, cb);
            } else {
                cb(null);
            }
        }
    });
}

/**
 * 同步广告数据
 * @param datas 拉取的广告店数据
 * @param index 分页数
 * @param count 拉取数量
 * @param cb 数据回调
 * @constructor
 */
function SyncAdv(datas, index, count, cb) {

    // 组装广告的url path
    var path = env.Config.adv_api_path+"?"+qs.stringify({ pageIndex: index, pageSize: count });

    // 拖取数据
    GetData(path, function(err, data) {
        if(err) {
            cb(err);
        } else {

            for(var i = 0; i < data.data.length; ++i) {
                datas.push(data.data[i]);
            }

            if(datas.length < data.count) {
                // 如果获取到的数据小于得到的总条数，那么继续拉数据
                SyncAdv(datas, index+1, count, cb);
            } else {
                cb(null);
            }
        }
    });
}

/**
 * 同步样片数据
 * @param datas 拉取的数据
 * @param index 分页数
 * @param count 拉取数量
 * @param cb 数据回调
 * @constructor
 */
function SyncSample(datas, index, count, cb) {

    // 组装广告的url path
    var path = env.Config.sample_api_path+"?"+qs.stringify({ pageIndex: index, pageSize: count });

    // 拖取数据
    GetData(path, function(err, data) {
        if(err) {
            cb(err);
        } else {

            for(var i = 0; i < data.data.length; ++i) {
                datas.push(data.data[i]);
            }

            if(datas.length < data.count) {
                // 如果获取到的数据小于得到的总条数，那么继续拉数据
                SyncSample(datas, index+1, count, cb);
            } else {
                cb(null);
            }
        }
    });
}

/**
 * 同步客片数据
 * @param datas 拉取的数据
 * @param index 分页数
 * @param count 拉取数量
 * @param cb 数据回调
 * @constructor
 */
function SyncPringles(datas, index, count, cb) {

    // 组装广告的url path
    var path = env.Config.pringles_api_path+"?"+qs.stringify({ pageIndex: index, pageSize: count });

    // 拖取数据
    GetData(path, function(err, data) {
        if(err) {
            cb(err);
        } else {

            for(var i = 0; i < data.data.length; ++i) {
                datas.push(data.data[i]);
            }

            if(datas.length < data.count) {
                // 如果获取到的数据小于得到的总条数，那么继续拉数据
                SyncPringles(datas, index+1, count, cb);
            } else {
                cb(null);
            }
        }
    });
}

/**
 * 同步客片分季数据
 * @param datas 拉取的数据
 * @param index 分页数
 * @param count 拉取数量
 * @param cb 数据回调
 * @constructor
 */
function SyncPringlesSeason(datas, index, count, cb) {

    // 组装广告的url path
    var path = env.Config.pringlesSeason_api_path+"?"+qs.stringify({ pageIndex: index, pageSize: count });

    // 拖取数据
    GetData(path, function(err, data) {
        if(err) {
            cb(err);
        } else {

            for(var i = 0; i < data.data.length; ++i) {
                datas.push(data.data[i]);
            }

            if(datas.length < data.count) {
                // 如果获取到的数据小于得到的总条数，那么继续拉数据
                SyncPringlesSeason(datas, index+1, count, cb);
            } else {
                cb(null);
            }
        }
    });
}

/**
 * 同步数据
 * @param type 0:酒店
 * @constructor
 */
function Sync(type) {
    switch (type) {
        case adv:// 广告数据同步
        {
            var datas = [];
            SyncAdv(datas, 1, 10, function(err) {
                if(err) {
                    console.log("拉取数据失败."+err);
                } else {
                    mSyncFlg["Adv"]=false;
                    Adv.delete().run().then(function (rel) {
                        // 缓存到本地数据库里面
                        Adv.save(datas).then(function(result, error) {
                            if(!error) {
                                // 设置本地数据库数据可用
                                mSyncFlg["Adv"]=true;
                            }
                        });
                    });
                }
            });

            break;
        }
        case hotel:// 酒店数据同步
        {
            var datas = [];
            SyncHotel(datas, 1, 10, function(err) {
                if(err) {
                    console.log("拉取数据失败."+err);
                } else {
                    mSyncFlg["Hotel"]=false;
                    Hotel.delete().run().then(function (rel) {
                        // 缓存到本地数据库里面
                        Hotel.save(datas).then(function(result, error) {
                            if(!error) {
                                // 设置本地数据库数据可用
                                mSyncFlg["Hotel"]=true;
                            }
                        });
                    });
                }
            });

            break;
        }
        case pringles:// 客片数据同步
        {
            var datas = [];
            SyncPringles(datas, 1, 10, function(err) {
                if(err) {
                    console.log("拉取数据失败."+err);
                } else {
                    mSyncFlg["Pringles"]=false;
                    Pringles.delete().run().then(function (rel) {
                        // 缓存到本地数据库里面
                        Pringles.save(datas).then(function(result, error) {
                            if(!error) {
                                // 设置本地数据库数据可用
                                mSyncFlg["Pringles"]=true;
                            }
                        });
                    });
                }
            });

            break;
        }
        case pringlesSeason:// 客片分季数据同步
        {
            var datas = [];
            SyncPringlesSeason(datas, 1, 10, function(err) {
                if(err) {
                    console.log("拉取数据失败."+err);
                } else {
                    mSyncFlg["PringlesSeason"]=false;
                    PringlesSeason.delete().run().then(function (rel) {
                        // 缓存到本地数据库里面
                        PringlesSeason.save(datas).then(function(result, error) {
                            if(!error) {
                                // 设置本地数据库数据可用
                                mSyncFlg["PringlesSeason"]=true;
                            }
                        });
                    });
                }
            });

            break;
        }
        case sample:// 样片数据同步
        {
            var datas = [];
            SyncSample(datas, 1, 10, function(err) {
                if(err) {
                    console.log("拉取数据失败."+err);
                } else {
                    mSyncFlg["Sample"]=false;
                    Sample.delete().run().then(function (rel) {
                        // 缓存到本地数据库里面
                        Sample.save(datas).then(function(result, error) {
                            if(!error) {
                                // 设置本地数据库数据可用
                                mSyncFlg["Sample"]=true;
                            }
                        });
                    });
                }
            });

            break;
        }
    }
}

DBUtil.prototype.getSyncFlg=function(moduleName){
    return mSyncFlg[moduleName];
};

exports.Instance = function() {
    if (dbTool == null) {
        dbTool = new DBUtil();
        // 程序启动取一次数据
        Sync(adv);
        Sync(hotel);
        Sync(sample);
        // 定时器，根据配置时间拉取
        setInterval(function () {
            // 拖取广告数据
            Sync(adv);
            // 拖取酒店数据
            Sync(hotel);
            // 拖取样片数据
            Sync(sample);
            // 拖取客片数据
        }, env.Config.cache_time_check);
    }
    return dbTool;
};
