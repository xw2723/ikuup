/**
 * app
 */
var express = require('express');
var http = require("http");
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require("fs");
var url = require("url");
var path = require("path");

var mime = require("./mime").types;
var routes = require('./routes/index');
var users = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/user', users);

app.all("*", function(request, response, next) {
    var pathname = url.parse(request.url).pathname;

    //var ext = path.extname(pathname);
    //ext = ext ? ext.slice(1) : 'unknown';
    //var contentType = mime[ext] || "text/plain";

    //response.setHeader("Content-Type", "text/html");
    //response.writeHead(200);      //设置响应头属性值
    next();
});

// 捕获404和错误处理程序
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// 错误处理程序开发
// 将打印加亮
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// 生产错误处理程序
// 不加泄露给用户
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


//module.exports = app;
app.listen('3000');

// console will print the message
console.log('Server running at http://127.0.0.1:3000/');