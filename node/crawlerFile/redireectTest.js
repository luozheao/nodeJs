/**
 * 重定向理解
 * */
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

var request = require("superagent");
request.get("http://localhost:4000")
  .redirects(0)
  .end(function(err, res) {
    console.log(err,res.text,123);
  });





