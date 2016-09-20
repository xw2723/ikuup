var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express',
    list: [1,2,3,4,5]
  });

});

router.get('/piwik/piwik', function(req, res, next) {

  console.log(JSON.stringify(req.body));
  res.send(200, {
    success: true,
    msg: "piwik请求成功！"
  });

});

router.get('/piwik/xwpk', function(req, res, next) {

  console.log("------------------------------------");
  console.log(JSON.stringify(req.body));
  console.log("------------------------------------");
  res.send(200, {
    success: true,
    msg: "xwpk请求成功！"
  });

});

module.exports = router;
