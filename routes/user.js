var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var user = require('../models/user').user;
mongoose.connect('mongodb://localhost/ikuup');

//注册页
router.get('/register', function(req, res, next) {
  console.log("进入注册页！");
  res.render('user/register', {
    title: '注册'
  });
});

router.post("/doRegister", function(req, res, next){
  var query = {username: req.body.username, password: req.body.password};
  (function(){

    //新增用户
    var createUser = function(){
      user.create(query, function(err, doc){    //count返回集合中文档的数量，和 find 一样可以接收查询条件。query 表示查询的条件
        console.log(doc.username == query.username);
        if(doc.username == query.username){
          res.send(200, {
            success: true,
            msg: "注册成功！"
          });
        }else{
          res.send(200, {
            success: false,
            msg: "注册失败！"
          });
        }
      });
    };

    //检查新建用户是否存在
    user.count({
      username: query.username
    }, function(err, doc){
      if(doc == 1){
        res.send(200, {
          success: false,
          msg: "用户名已存在！"
        });
      }else{
        createUser();
      }
    });
  })(query);
});

router.get('/registered', function(req, res, next) {
  console.log("进入注册页！");
  res.render('user/registered', {
    title: '注册'
  });
});

//登录页
router.get('/login', function(req, res, next) {
  console.log("进入登录页！");
  res.render('user/login', {
    title: '登录'
  });
});

//进行登录
router.post('/doLogin', function(req, res, next) {
  var isAjax;
  // 是AJAX请求
  if (req.headers['x-requested-with'] && req.headers['x-requested-with'].toLowerCase() == 'xmlhttprequest') {
    isAjax = true;
  } else {
    isAjax = false;
  }

  var query = {username: req.body.username, password: req.body.password};
  console.log(JSON.stringify(query));
  console.log("======================");
  (function(){
    user.count(query, function(err, doc){    //count返回集合中文档的数量，和 find 一样可以接收查询条件。query 表示查询的条件
      console.log(JSON.stringify(doc));
      if(doc == 1){
        if(isAjax){
          res.send(200, {
            success: true,
            msg: "登录成功！"
          });
        }else{
          res.redirect('/', {user:user});
        }
      }else{
        if(isAjax){
          res.send(200, {
            success: false,
            msg: "登陆失败！"
          });
        }else{
          //res.redirect('/');
          res.send(500);
        }
      }
    });
  })(query);
});

module.exports = router;
