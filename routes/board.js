var express = require('express');
var router = express.Router();
var mysql_odbc = require('../db/db_conn')();
var conn = mysql_odbc.init();

// 게시글 목록
router.get('/list', function(req, res, next) {
  res.redirect('/board/list/1');
});

router.get('/list/:page', function(req, res, next) {
  var page = req.params.page; // 페이징을 위한 page 변수
  var sql = "select po_num, po_name, po_mmname, date_format(po_date, '%Y년 %m월 %d일 %H시 %i분 %s초') po_date from demo.post";

  // DB Connect
  conn.query(sql, function(err, rows) {
    if( err ) {
      console.log('err =>> ' +err);
    }

    // 뷰로 렌더링
    res.render('list', {title: '게시판 리스트', rows: rows});
  });
});

// 게시글 작성
router.get('/write', function(req, res, next) {
  res.render('write', {title: '게시글 작성'});
});

router.post('/write', function(req, res, next) {

  // form에서 받아온 정보
  var po_name    = req.body.title;
  var po_mmname  = req.body.name;
  var po_content = req.body.content;
  var datas = [po_name, po_content, po_mmname];

  var sql = "insert into demo.post (po_bocode, po_name, po_cacode, po_price, po_content, po_mmcode, po_mmname, po_date) " +
            "values ('B001', ?, 1, 10, ?, '-', ?, now())";

  conn.query(sql, datas, function(err, rows) {
    if( err ) {
      console.log('err =>> ' +err);
    }

    // 뷰로 렌더링
    res.redirect('/board/list');
  });
});

// 게시글 수정

// 게시글 삭제

module.exports = router;
