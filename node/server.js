var http=require('http');
var fs=require('fs');
var events=require('events');

var obj= http.createServer(function (request,response) {
  /***start,将信息直接返回到浏览器**/
  response.writeHead(200,{'Content-Type':'text/plain'});
  response.end('hello world !');
  /***end****/
  //将数据返回给前台
});
obj.listen(8089);


