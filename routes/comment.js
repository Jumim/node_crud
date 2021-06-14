var express = require('express');
var router = express.Router();
var mysql_odbc = require('../db/db_conn')();
var conn = mysql_odbc.init();

// 댓글 불러오기
router.post('/list', function(req, res, next) {
  var co_bonum = req.body.co_bonum;

  //console.log('co_bonum => ' +co_bonum);

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
router.post('/add', function(req, res, next) {
  var co_bonum    = req.body.co_bonum;
  var co_name     = req.body.co_name;
  var co_content  = req.body.co_content;
  var co_password = req.body.co_password;
  var datas       = [co_bonum, co_content, co_name, co_password];

  var sql = "insert into node.comment (co_bonum, co_content, co_name, co_password) " +
            "values (?, ?, ?, ?)";

  console.log('sql => ' +sql);
  console.log('datas => ' +datas);

  conn.query(sql, datas, function(err, rows) {
    if (err) {
      console.log('err =>> ' + err);
    }

    //res.redirect('/board/read/'+ co_bonum);

  });
});

module.exports = router;
