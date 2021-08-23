var createError    = require('http-errors');
var express        = require('express');
var path           = require('path');
var cookieParser   = require('cookie-parser');
var logger         = require('morgan');
var expressLayouts = require('express-ejs-layouts');

//채팅
var http = require('http');
var server = http.Server(app);

/*
var app = require('express')();
var http = require('http');
var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = socket(server);
io.sockets.on('connection', function () {
  console.log('hello world im a hot socket');
});
*/

// require 추가
var indexRouter   = require('./routes/index');
var usersRouter   = require('./routes/users');
var formRouter    = require('./routes/form');    // route 예제 추가
var mysqlRouter   = require('./routes/mysql');
var boardRouter   = require('./routes/board');
var commentRouter = require('./routes/comment');
var chatRouter    = require('./routes/chat');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// layout setting
app.set('layout', 'layout');
app.set('layout extraScripts', true);
app.use(expressLayouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 해당하는 라우터가 맵핑 될 URL 추가
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/form', formRouter);     // route 예제 추가
app.use('/mysql', mysqlRouter);
app.use('/board', boardRouter);
app.use('/comment', commentRouter);
app.use('/chat', chatRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');

  cookieParser(process.env.COOKIE_SECRET, { sameSite: "none", secure: true });
});

/* socket.io 추가 */
app.io = require('socket.io')();

app.io.on('connection', function(socket){

  console.log("a user connected");
  socket.broadcast.emit('hi');

  socket.on('disconnect', function(){
      console.log('user disconnected');
  });

  socket.on('chatMessage', function(msg){
      console.log('message: ' + msg);
      app.io.emit('chatMessage', msg);
  });

});

module.exports = app;
