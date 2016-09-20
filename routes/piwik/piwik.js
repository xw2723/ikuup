var express = require('express');
var router = express.Router();

router.get('/piwik', function(req, res, next) {

  res.send(200, {
    success: true,
    msg: "piwik请求成功！"
  });
});

module.exports = router;
