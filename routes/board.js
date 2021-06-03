var express = require('express');
var router = express.Router();
var mysql_odbc = require('../db/db_conn')();
var conn = mysql_odbc.init();

router.get('/list', function(req, res, next) {
  res.redirect('/board/list/1');
});

router.get('/list/:page', function(req, res, next) {
  var page = req.params.page;
  var sql = "select po_num, po_name, po_mmname, date_format(po_date, '%Y년 %m월 %d일 %H시 %i분 %s초') po_date from demo.post";

  conn.query(sql, function(err, rows) {
    if( err ) {
      console.log('err =>> ' +err);
    }

    // list.ejs 렌더링
    res.render('list', {title: '게시판 리스트', rows: rows});
  });
});

module.exports = router;
