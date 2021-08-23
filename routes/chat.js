var express = require('express');
var router  = express.Router();
var socket  = require('socket.io');  // 설치한 socket.io 모듈 불러오기

router.get('/', function(req, res, next) {
  res.render('chat/chat', { title: 'chat' });
});

module.exports = router;
