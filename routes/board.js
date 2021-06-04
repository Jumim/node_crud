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
    res.render('board/list', {title: '게시판 리스트', rows: rows});
  });
});

// 페이징 구현
router.get('/page', function(req, res, next) {
  res.redirect('/board/page/1');
});

router.get('/page/:page', function(req, res, next) {
  var page = req.params.page;

  var sql = "select po_num, po_name, po_mmname, date_format(po_date, '%Y년 %m월 %d일 %H시 %i분 %s초') po_date from demo.post order by po_date desc limit 1000";

  conn.query(sql, function(err, rows) {
    if( err ) {
      console.log('err =>> ' +err);
    }

    res.render('board/page', {title: '게시판 리스트', rows: rows, page: page, length: rows.length - 1, page_num: 10, pass: true});

    console.log(rows.length - 1);
  });
});

// 게시글 작성
router.get('/write', function(req, res, next) {
  res.render('board/write', {title: '게시글 작성'});
});

// write.ejs에서 form으로 넘어 온 정보를 통해 DB에 insert
router.post('/write', function(req, res, next) {

  // form에서 받아온 정보
  var po_name    = req.body.title;
  var po_mmname  = req.body.name;
  var po_content = req.body.content;
  var datas      = [po_name, po_content, po_mmname];

  var sql = "insert into demo.post (po_bocode, po_name, po_cacode, po_price, po_content, po_mmcode, po_mmname, po_date) " +
            "values ('B001', ?, 1, 10, ?, '-', ?, now())";

  conn.query(sql, datas, function(err) {
    if( err ) {
      console.log('err =>> ' +err);
    }

    // 게시글 목록으로 리다이렉트
    res.redirect('/board/page');
  });
});

// 게시글 상세보기
router.get('/read/:po_num', function(req, res, next) {
  var po_num = req.params.po_num;

  var sql = "select po_num, po_name, po_content, po_mmname, date_format(po_date, '%Y년 %m월 %d일 %H시 %i분 %s초') po_date from demo.post " +
            "where po_num = ?";

  conn.query(sql, [po_num], function(err, row) {
    if( err ) {
      console.log('err =>> ' +err);
    }

    // 뷰로 렌더링
    res.render('board/read', {title: '게시글 상세보기', row: row[0]});
  });
});

// 게시글 수정
router.get('/update/:po_num', function(req, res, next) {
  var po_num = req.params.po_num;

  var sql = "select po_num, po_name, po_content, po_mmname from demo.post where po_num = ?";

  conn.query(sql, [po_num], function(err, row) {
    if( err ) {
      console.log('err =>> ' +err);
    }

    res.render('board/update', {title: '게시글 수정', row: row[0]});
  });

});

// update.ejs에서 form 넘어 온 정보를 통해 DB update
router.post('/update', function(req, res, next) {
  var po_num     = req.body.num;
  var po_name    = req.body.title;
  var po_mmname  = req.body.name;
  var po_content = req.body.content;
  var datas      = [po_name, po_mmname, po_content, po_num];

  var sql = "update demo.post set po_name = ?, po_mmname = ?, po_content = ? where po_num = ?";

  conn.query(sql, datas, function(err){
    if( err ) {
      console.log('err =>> ' +err);
    }

    res.redirect('/board/read/' +po_num);   // 해당 게시글로 리다이렉트
  });
});

// 게시글 삭제
router.get('/delete/:po_num', function(req, res, next) {
  var po_num = req.params.po_num;

  var sql = "delete from post where po_num = ?";

  conn.query(sql, [po_num], function(err) {
    if( err ) {
      console.log('err =>> ' +err);
    }

    res.redirect('/board/page');
  });
});

module.exports = router;
