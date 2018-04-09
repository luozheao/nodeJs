var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var connection=require('./sql.js');

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
app.post('/api/out',urlencodedParser,function (req,res) {
  var  name=req.body.name;
  var selectSql = 'select * from websites   where name=?';
  var params=[name];
  connection.query(selectSql ,params,function (err, result) {
    if(err){
      console.log(err.message);
      return;
    }
    res.end(JSON.stringify(result));
  });
})



var server = app.listen(8088, function () {
  var host = server.address().address;
  var port = server.address().port;
})
