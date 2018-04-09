var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var connection=require('./sql.js');
var crawler=require('./crawler.js');
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('static'))
app.use(express.static('build'))
app.use(express.static('dist'))

app.get('/',function (req,res) {
   res.end('index.html');
})

app.get('/api/login', function (req, res) {

});

/**
 * 搜索
 * */
app.post('/api/selectMsg',urlencodedParser,function (req,res) {
  var  name=req.body.name;
  var selectSql = name?'select * from websites   where name=?':"select * from websites";
  var params=[name];
  connection.query(selectSql ,params,function (err, result) {
    if(err){
      console.log(err.message);
      return;
    }
    res.end(JSON.stringify(result));
  });
})
/**
 * 添加
 * */
app.post('/api/addMsg',urlencodedParser,function (req,res) {
  var  name=req.body.name;
  var selectSql = 'insert into websites(name) values(?)';
  var params=[name];
  connection.query(selectSql,params,function (err, result) {
    if(err){
      console.log(err.message);
      return;
    }
    res.end(JSON.stringify(result));
  });
})
/**
 * 删除
 * */
app.post('/api/delMsg',urlencodedParser,function (req,res) {
  var  name=req.body.name;
  var selectSql = 'delete from websites where name=?';
  var params=[name];
  connection.query(selectSql,params,function (err, result) {
    if(err){
      console.log(err.message);
      return;
    }
    res.end(JSON.stringify(result));
  });
})


var server = app.listen(8088, function () {
  // var host = server.address().address;
  // var port = server.address().port;
})



crawler(); //运行主函数
