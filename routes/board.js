var express = require('express');
var router = express.Router();
var mysql_odbc = require('../db/db_conn')();
var conn = mysql_odbc.init();

// 게시글 목록
router.get('/list', function(req, res, next) {
  var sql = "select bo_num, bo_title, bo_name, date_format(bo_date, '%Y년 %m월 %d일 %H시 %i분 %s초') bo_date from node.board";

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
  var keyword = req.query.search_keyword;   // 검색용 파라미터 받아오기(get으로 받음)

  console.log("keyword =>> " +keyword);

  var sql = "select bo_num, bo_title, bo_name, date_format(bo_date, '%Y년 %m월 %d일 %H시 %i분 %s초') bo_date from node.board ";

  if(keyword === undefind) {

  } else {
    sql += "where bo_title like '%" + keyword + "%' ";
  }

  sql += "order by bo_date desc limit 1000";

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
  var bo_title    = req.body.title;
  var bo_content = req.body.content;
  var bo_name  = req.body.name;
  var datas      = [bo_title, bo_content, bo_name];

  var sql = "insert into node.board (bo_title, bo_content, bo_name, bo_date) " +
            "values (?, ?, ?, now())";

  conn.query(sql, datas, function(err) {
    if( err ) {
      console.log('err =>> ' +err);
    }

    // 게시글 목록으로 리다이렉트
    res.redirect('/board/page');
  });
});

// 게시글 상세보기
router.get('/read/:bo_num', function(req, res, next) {
  var bo_num = req.params.bo_num;

  var sql = "select bo_num, bo_title, bo_content, bo_name, date_format(bo_date, '%Y년 %m월 %d일 %H시 %i분 %s초') bo_date from node.board " +
            "where bo_num = ?";

  conn.query(sql, [bo_num], function(err, row) {
    if( err ) {
      console.log('err =>> ' +err);
    }

    // 뷰로 렌더링
    res.render('board/read', {title: '게시글 상세보기', row: row[0]});
  });
});

// 게시글 수정
router.get('/update/:bo_num', function(req, res, next) {
  var bo_num = req.params.bo_num;

  var sql = "select bo_num, bo_title, bo_content, bo_name from node.board where bo_num = ?";

  conn.query(sql, [po_num], function(err, row) {
    if( err ) {
      console.log('err =>> ' +err);
    }

    res.render('board/update', {title: '게시글 수정', row: row[0]});
  });

});

// update.ejs에서 form 넘어 온 정보를 통해 DB update
router.post('/update', function(req, res, next) {
  var bo_num     = req.body.num;
  var bo_title    = req.body.title;
  var bo_content = req.body.content;
  var bo_name  = req.body.name;
  var datas      = [bo_title, bo_name, bo_content, bo_num];

  var sql = "update node.board set bo_title = ?, bo_name = ?, bo_content = ? where bo_num = ?";

  conn.query(sql, datas, function(err){
    if( err ) {
      console.log('err =>> ' +err);
    }

    res.redirect('/board/read/' +po_num);   // 해당 게시글로 리다이렉트
  });
});

// 게시글 삭제
router.get('/delete/:bo_num', function(req, res, next) {
  var bo_num = req.params.bo_num;

  var sql = "delete from node.board where bo_num = ?";

  conn.query(sql, [bo_num], function(err) {
    if( err ) {
      console.log('err =>> ' +err);
    }

    res.redirect('/board/page');
  });
});

// 게시글 검색
router.get('/search', function(req, res, next) {
  var keyword = req.query.search_keyword;

  console.log("keyword =>> " + keyword);

  var sql = "select bo_num, bo_title, bo_name, date_format(bo_date, '%Y년 %m월 %d일 %H시 %i분 %s초') bo_date from node.board " +
            " where bo_title like '%" + keyword + "%' " +
            " order by bo_date desc limit 1000";
  console.log("sql =>> " + sql);

  conn.query(sql, function(err, rows) {
    if (err) {
      console.log('err =>> ' + err);
    }

    res.render('board/list', {title: '게시글 검색', rows: rows});
  });
});

module.exports = router;
