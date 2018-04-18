var express = require("express");
var app = express();
app.get('/', function(req, res) {
  res.send("ooooook");
  res.redirect("/haha"); //重定向到haha

});
app.get('/haha', function(req, res) {
  res.send("hello world");
});
app.listen(4000, console.log("4000 port"));



