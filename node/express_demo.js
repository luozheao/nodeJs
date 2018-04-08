var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('static'))

app.get('/login', function (req, res) {
  var response = {
    "first_name":'luo',
    "last_name":'jie'
  };
  console.log(response);
  res.end(JSON.stringify(response));
});
app.post('/out',urlencodedParser,function (req,res) {
  var response = {
     name:req.body.name
  };
   res.end(JSON.stringify(response));
})



var server = app.listen(8088, function () {
  var host = server.address().address;
  var port = server.address().port;
})
