/**
 * Created by chenjianjun on 15/12/10.
 */
var Module = require('./module');

var vobj = [{
    "hotelId": 123,
    "hotelName": "袁家岗芭菲盛宴",
    "type":1,
    "banquetHallList": [
        {
            "banquetHallId": "20224",
            "banquetHallName": "1号宴会厅",
            "capacity": "28",
            "height": "8.0",
            "hotelId": "20096",
            "pillarNumber": "0"
        }
    ]
},
    {
        "hotelId": 456,
        "hotelName": "解放碑芭菲盛宴",
        "type":1,
        "banquetHallList": [
            {
                "banquetHallId": "20225",
                "banquetHallName": "1号宴会厅",
                "capacity": "28",
                "height": "8.0",
                "hotelId": "20096",
                "pillarNumber": "0"
            }
        ]
    },
    {
        "hotelId": 789,
        "hotelName": "北城国际芭菲盛宴",
        "type":1,
        "banquetHallList": [
            {
                "banquetHallId": "20226",
                "banquetHallName": "1号宴会厅",
                "capacity": "28",
                "height": "8.0",
                "hotelId": "20096",
                "pillarNumber": "0"
            }
        ]
    }
];

Module.save(vobj).then(function(error, result) {
    if(error) {
        console.log(error);
    } else {
        console.log(result);
    }
});
