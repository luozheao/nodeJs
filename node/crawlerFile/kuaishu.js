var express = require('express');
var app = express();
var iconv = require('iconv-lite');
var charset = require('superagent-charset');
var req = charset(require('superagent'));
var cheerio = require('cheerio')
var http = require('http')
var request = require('request');
var url = require('url');
var async = require('async')
var fs = require('fs');
var msg={
  username:'ϾZHI',
  password:'luojie123'
}
var cookie2;
var cookie3;
var cookie4;
var formhash;
var booksArr=[];
var realBooksArr=[];
 start();

//登录页
function  start() {

  req
      .get('https://www.shukuai.org/member.php')
    .charset('gbk')
    .end((err, res) => {
      if(err){
        console.log('start error');
        return;
      }
      login(res);
    })
}

//登录
function login(res) {
   req
    .post('https://www.shukuai.org/member.php')
    .charset('gbk')
    .set({
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'zh-CN,zh;q=0.9',
      'Connection': 'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Host': 'www.shukuai.org',
      'Origin':'https://www.shukuai.org',
      'Referer': 'https://www.shukuai.org/member.php',
      'Upgrade-Insecure-Requests':1,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36',
    })
    .type('form')
    .query("mod=logging&action=login&loginsubmit=yes&inajax=1")
    .send(msg)
    .end((err, res) => {
      if(err){
        console.log('login error');
        return;
      }
      getHtml(res);
    })
}

//获取登录后的页面
function getHtml(res){
      cookie2=  res.headers['set-cookie'].join(';');
      req
     .get('https://www.shukuai.org/plugin.php')
     .charset('gbk')
     .set({
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'zh-CN,zh;q=0.9',
      'Connection': 'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Host': 'www.shukuai.org',
      'Origin':'https://www.shukuai.org',
      'Referer': 'https://www.shukuai.org/member.php?mod=logging&action=login',
      'Upgrade-Insecure-Requests':1,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36',
    })
     .set('Cookie',cookie2)
     .type('form')
     .query({
      id:'dsu_paulsign:sign'
     })
     .end((err, res) => {

       let $ = cheerio.load(res.text);
       for(var i=0;i<$('#scbar_form input').length;i++) {
         var obj = $('#scbar_form input')[i].attribs;
         if (obj.name == 'formhash') {
           formhash = obj.value;
         }
       }
       if(!err){
         loveBook(res);//获取言情小说
         //sign(res);//签到
       }
    })
}

//签到处理
function sign(res){
  req
    .post('https://www.shukuai.org/plugin.php')
    .charset('gbk')
    .set({
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'zh-CN,zh;q=0.9',
      'Connection': 'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Host': 'www.shukuai.org',
      'Origin':'https://www.shukuai.org',
      'Referer': 'https://www.shukuai.org/plugin.php?id=dsu_paulsign:sign&operation=month',
      'Upgrade-Insecure-Requests':1,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36',
    })
    .set('Cookie',cookie2)
    .type('form')
    .send({
      formhash:formhash, //有变化,跟账户挂钩
      qdxq:'kx'
    })
    .query({
      id: 'dsu_paulsign:sign',
      operation: 'qiandao',
      infloat: 1,
      inajax: 1,
    })
    .end((err, res) => {
      if(err){
        console.log('sign error');
        return;
      }
      if(!err){
          console.log(res.text);


      }
    })
}

//获取言情小说
function loveBook() {
    req
      .get('https://www.shukuai.org/forum.php')
      .charset('gbk')
      .set({
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Host': 'www.shukuai.org',
        'Origin':'https://www.shukuai.org',
        'Referer': 'https://www.shukuai.org/',
        'Upgrade-Insecure-Requests':1,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36',
      })
      .set('Cookie',cookie2)
      .type('form')
      .query({
        mod: 'forumdisplay',
        fid:37,
      })
      .end((err, res) => {
        if(err){
          console.log('loveBook error');
          return;
        }
        if(!err){
          let $ = cheerio.load(res.text);
          let obj=$('.xl.xl2.cl li a');
          let len=obj.length;

          //第一步获取页面链接
          for(var i=0;i<len;i++){
            var name=obj[i].children[0].data;
            if(name.indexOf('-06')>=0){
              booksArr.push({
                name:name,
                href:obj[i].attribs.href,
              })
            }
          }

        //第二步获取下载链接
            async.mapLimit(booksArr, 3, function (item, callback) {
              downLink(item,callback);//获取言情小说下载链接,毛坯
            }, function (err, result) {
              console.log(err,result,123);
              //第三步 ,获取处理过的下载链接
              realLink(result);


            });
        }
      })
}
//获取言情小说下载链接
function  downLink(booksArrObj,callback) {
     req
    .get(booksArrObj.href)
    .charset('gbk')
    .set({
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'zh-CN,zh;q=0.9',
      'Connection': 'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Host': 'www.shukuai.org',
      'Origin':'https://www.shukuai.org',
      'Referer': 'https://www.shukuai.org/forum.php?mod=forumdisplay&fid=37',
      'Upgrade-Insecure-Requests':1,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36',
    })
    .set('Cookie',cookie2)
    .type('form')
    .end((err, res) => {
      if(err){
        console.log('downLink error');
        return;
      }
      if(!err){
          let $ = cheerio.load(res.text);
          booksArrObj.downLink= $('.attnm a').attr('href')
          // if(booksArrObj.name.indexOf('-'+new Date().getDate())>=0){
          callback(null,booksArrObj);
      }
    })
}

//获取处理过的下载链接
function realLink(booksArr) {
  async.mapLimit(booksArr, 3, function (item, callback) {
    req
      .get(item.downLink)
      .charset('gbk')
      .set({
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Host': 'www.shukuai.org',
        'Origin':'https://www.shukuai.org',
        'Referer': 'https://www.shukuai.org/plugin.php',
        'Upgrade-Insecure-Requests':1,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36',
      })
      .set('Cookie',cookie2)
      .type('form')
      .end((err, res) => {
        if(err){
          console.log('realLink error');
          return;
        }
        if(!err){
          let $ = cheerio.load(res.text);
          if($('.alert_error').text()){
             console.log($('.alert_error').text());
          }else{
            item.realDownLink = $('.alert_btnleft a').attr('href')
          }
          callback(null,item);
        }
      })
  }, function (err, result) {
         console.log(err,result);
         realBooksArr=result;
         result.forEach(function (p) {
            saveBook(p);
         })
  });


}

//保存小说
function saveBook(item){
  if(!fs.existsSync("../books")){
    fs.mkdirSync("../books");
  }
     request(item.realDownLink)
    .pipe(fs.createWriteStream('../books/'+item.name+'.rar'));
   //不知道怎么解压
}

// app.get('/',function (req,res) {
//   res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
//   res.end(JSON.stringify({a:'罗哲傲',b:2}));
// })
// var server = app.listen(8088, function () {
//   // var host = server.address().address;
//   //  var port = server.address().port;
//    console.log('hello world !');
// })
