/**
 * Created by chenjianjun on 15/12/8.
 */
/* 缓存相关配置信息 */
const config = {
    api_port: "8088",
    api_host: '192.168.1.3',
    cache_time_check: 60000*3, // 缓存清理时间,30分钟
    rethink:{
        db:'cache',
        host:'192.168.1.4',
        port:'28015'
    },
    // 酒店数据
    hotel_api_path:"/api/hotel",
    // 广告数据
    adv_api_path:"/api/adv",
    // 样片数据
    sample_api_path:"/api/sample",
    // 客片数据
    pringles_api_path:"/api/pringles",
    // 客片分季数据
    pringlesSeason_api_path:"/api/pringlesSeason/list"
    // 婚纱摄影团队
    // 婚纱纪实MV
    // 套系
};

const Thinky = require('thinky')(config.rethink);

module.exports = {
    'Config':config,
    'Thinky':Thinky
};
