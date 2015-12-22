var express = require('express');
var path = require('path');
var fs=require("fs");
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multiparty=require("connect-multiparty");
var session=require("express-session");
var DBUtil=require("./cache/db/dbUtil").Instance();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('routes',__dirname + '/routes/');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//控制层_根据routes文件名+方法_约定请求路径
var routes=app.get("routes");
function ls(root, filePath)
{
  var files=fs.readdirSync(filePath);
  for(i in files)
  {
    var fname = filePath+path.sep+files[i];
    var stat = fs.lstatSync(fname);
    if(stat.isDirectory() == true)
    {
      ls(files[i]+path.sep, fname);
    }
    else
    {
      if(!files[i].match('.js$')) {
        continue;
      }

      var name=files[i].substr(0,files[i].lastIndexOf("."));
      if(name==="index"){
        app.use(path.sep+root,require(fname));
      }else{
        app.use(path.sep+root+name,require(fname));
      }
    }
  }
}
ls("",routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


//应用未Catch异常
process.on('uncaughtException',function(err){
  if(err){
    console.log(err);
  }
});


//临时文件存放地
process.env.TMPDIR="./tmp/";
module.exports = app;
