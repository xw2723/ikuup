var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("-----------------index-------------------");
  res.render('index', {
    title: 'Express',
    list: [1,2,3,4,5]
  });

});

router.get('/piwik/piwik', function(req, res, next) {
  console.log("-----------------piwik-------------------");
  res.send(200, {
    success: true,
    msg: "piwik请求成功！"
  });

});

router.get('/piwik/xwpk', function(req, res, next) {
  console.log("-----------------xwpk-------------------");
  console.log(req.query.data);
  var dataJson = JSON.parse(req.query.data);
  console.log(dataJson.userAgent);
  console.log(dataJson.exploreName);
  console.log(dataJson.osName);
  res.send(200, {
    success: true,
    msg: "xwpk请求成功！"
  });

});

router.get('/search/*', function(req, res, next) {
  res.render('index', {
    title: 'Express',
    list: [1,2,3,4,5]
  });
});

router.get('/showCategory/search/*', function(req, res, next) {
  res.render('index', {
    title: 'Express',
    list: [1,2,3,4,5]
  });
});

module.exports = router;
