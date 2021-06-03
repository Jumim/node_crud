var express = require('express'); // express 인스턴스 사용
var router = express.Router();    // express 라우터 프레임워크 사용

// 루트로 들어올 때, 응답방식
router.get('/', function(req, res, next) {
    res.render('form', {
      name: '이쥬미',
      blog: 'Jumim.github.io',
      homepage: 'Jumim.github.io'
    });
});

router.post('/', function (req, res, next){
  res.json(req.body);
});

module.exports = router;
