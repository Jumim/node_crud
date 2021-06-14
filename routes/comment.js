var express = require('express');
var router = express.Router();
var mysql_odbc = require('../db/db_conn')();
var conn = mysql_odbc.init();

// 댓글 불러오기
router.post('/list', function(req, res, next) {
  var co_bonum = req.body.co_bonum;

  console.log('co_bonum => ' +co_bonum);

  var sql = "select co_id, co_bonum, co_content, co_name, co_password from node.comment " +
            "where co_bonum = ?";

  conn.query(sql, [co_bonum], function(err, rows) {
    if( err ) {
      console.log('err =>> ' +err);
    }

    res.json(rows);

  });
});

// 댓글 작성
router.get('/add', function(req, res, next) {

});

module.exports = router;
