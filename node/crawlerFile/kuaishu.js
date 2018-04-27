var express = require('express');
var app = express();
var charset = require('superagent-charset');//解析编码 ，解码后再用$().text()可以看到效果
var req=superagent = charset(require('superagent'));//是个 http 方面的库，可以发起 get 或 post 请求。
var cheerio = require('cheerio'); //Node.js 版的 jquery
var request = require('request');
var async = require('async')
var fs = require('fs');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var urlencode = require('urlencode');
var url = require('url');
var http = require('http')
var iconv = require('iconv-lite');//解析编码,配合http使用:iconv+http

var msg={
  username:'ϾZHI',
  password:'luojie123'
}
var cookie2;
var formhash;
var booksArr=[];
var bookPath="";
let msgArr=[
  {
    username:'ϾZHI',
    password:'luojie123'
  },
  {
    username:'luozheao',
    password:'luojie123'
  },
  {
    username:'luozheao1',
    password:'luojie123'
  },
  {
    username:'luozheao2',
    password:'luojie123'
  } ,
  {
    username:'luoshengmen',
    password:'luojie123'
  } ,
]
let signMsg=[];

app.use(express.static('static'))
app.use(express.static('build'))
app.use(express.static('dist'))


app.get('/api/download', function (req, res) {
  var name=req.query.name;
  res.set({
    "Content-type":"application/octet-stream",
    'Content-Disposition': "attachment;filename=book.rar"
  });
  var path=bookPath=req.hostname.includes(127)? "../books/":"./node/books/";
  var fReadStream = fs.createReadStream(path+name);
  //写法一
  // fReadStream.pipe(res);
  //写法二
  // fReadStream.on("data",function(chunk){res.write(chunk,"binary")});
  // fReadStream.on("end",function () {
  //   res.end();
  // });
  // 写法三
  res.download(path+name, name,function(){
    console.log(new Date().getHours()+'点下载'+name);
  });

})
app.get('/api/sign', function (req, res) {
  toSign(res);
});
function toSign(res){
  signMsg=[];
  async.mapLimit(msgArr,1, function (p, callback) {
      start(p)
        .then(login)
        .then(getHtml)
        .then((res)=>{
          //签到
          sign(res).then((text)=>{
            callback(null,'ok')
          });
        });
    },
    function (err, result) {
      console.log(err,result);
      if(res){
        res.end(JSON.stringify(signMsg));
      }
    });
};
app.get('/api/getTodayLoveBook', function (req, res) {
  getSaveBooksName(res,req);
});
function getSaveBooksName(res,req) {
  //第一步，获取文件名
  var saveBooks=[];
  console.log(req.hostname)
  var path=bookPath=req.hostname.includes(127)? "../books":"./node/books";
  fs.readdir(path, function(err,files){
    if(err){
      console.log("文件不存在",err);
      return;
    }

    for(var i=files.length-1;i>=0;i--){
      saveBooks.push({
        name:files[i],
        realDownLink:files[i]
      })
    }

    //第二步，返回
    res.end(JSON.stringify(saveBooks));
  });
}
function toGetTodayLoveBook(res) {
  var index=new Date().getDate()%5;
  async.mapLimit([msgArr[index]],1, function (p, callback) {
      start(p)
        .then(login)
        .then(getHtml)
        .then((res)=>{
          //获取言情小说
            loveBook(res)
            .then(getJumpLink)
            .then(realLink).then((item)=>{
              callback(null,item)
          });
        });
    },
    function (err, items) {
       console.log(items);
       saveBook(items[0]);
      if(res){
        res.end(JSON.stringify(items[0]));
      }
    });
}
app.post('/api/searchValue',urlencodedParser,function (req,response) {
  var  name=req.body.name;
  openPage(name,response)
    .then(search)

})
let cookieTest;
//打开页面
function openPage(name,response) {
  return new Promise((resolve,reject)=>{
    superagent
      .get('https://www.shukuai.org/search.php')
      .charset('gbk')
      .end((err, res) => {
        if(err){
          console.log('openPage error',err);
          return;
        }
        let $ = cheerio.load(res.text);
        cookieTest= res.headers['set-cookie'].join(';');
        let hash=$('input[name="formhash"]').val();
        resolve({hash,name,response});
      })
  });
}
//搜索
function search({hash,name,response}){
  return new Promise((resolve,reject)=>{
    var aaa=urlencode(name,'gbk');
    superagent
      .post('https://www.shukuai.org/search.php')
      .charset('gbk')
      .query('mod=forum&srchtxt='+aaa)
      .send({
         formhash:hash,
         searchsubmit:'yes'
       })
      .type('form')
      .set({
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded;',
        'Host': 'www.shukuai.org',
        'Origin':'https://www.shukuai.org',
        'Referer': 'https://www.shukuai.org/search.php?mod=forum',
        'Upgrade-Insecure-Requests':1,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
      })
      .set('Cookie',cookieTest)
      .end((err, res) => {
        if(err){
          console.log('search error',err);
          return;
        }
        var arr=[]
        let $ = cheerio.load(res.text);
        console.log(res.redirects);
        $('.xs3 a').each(function () {
          arr.push({
            name: $(this).text(),
            href:$(this).attr('href')
          })
        });
        console.log(arr);
        if(response){
          response.end(JSON.stringify(arr));
        }
        resolve();
      })
  });
}


// openPage(null,null)
//   .then(search)

//登录页
function  start(pMsg) {
  return new Promise((resolve,reject)=>{
     req
      .get('https://www.shukuai.org/member.php')
      .charset('gbk')
      .end((err, res) => {
        if(err){
          console.log('start error');
          return;
        }
        if(pMsg){
          resolve([res,pMsg])
        }else{
          resolve(res)
        }
      })
  })
}
//登录
function login(res) {
  let batchMsg=msg;
  if(Array.isArray(res)){
    batchMsg=res[1];
  }
  return new Promise((resolve,reject)=>{
   console.log(batchMsg);
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
      .send(batchMsg)
      .end((err, res) => {
        if(err){
          console.log('login error');
          return;
        }
        resolve(res)
      })
  })
}
//获取登录后的页面
function getHtml(res){
      cookie2=  res.headers['set-cookie'].join(';');
      return new Promise((resolve,reject)=>{
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
               resolve(res)
            }
          })
      })
}
//签到处理
function sign(res){
  return new Promise((resolve,reject)=>{
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
        let $ = cheerio.load(res.text);
        if(!err){
          let str=$('root').text().replace(/\n/gi,"");
          console.log(str);
          var pattern1 = /[\u4e00-\u9fa5]+/g;
          signMsg.push(str.match(pattern1).join(','));
        }
        resolve($('root').text());
      })
  });
}


//获取言情小说
function loveBook() {
  return new Promise((resolve,reject)=>{
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
            if(name.indexOf('-'+new Date().getDate()+'版推')>=0){
              booksArr.push({
                name:name,
                href:obj[i].attribs.href,
              })
            }
          }
             resolve(booksArr);
        }
      })
  });
}
//获取跳转链接
function getJumpLink(booksArr){
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
          callback(null,booksArrObj);
        }
      })
  }
  return new Promise((resolve,reject)=>{
    //第二步获取下载链接
    async.mapLimit(booksArr, 3, function (item, callback) {
      downLink(item,callback);//获取言情小说下载链接,毛坯
    }, function (err, result) {
      //第三步 ,获取处理过的下载链接
      resolve(result);
    });
  });
}
//获取处理过的下载链接
function realLink(booksArr) {
  return new Promise((resolve,reject)=>{
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
       resolve(result);
    });
  });
}
//保存小说
function saveBook(result){
  if(!fs.existsSync(bookPath)){
    fs.mkdirSync(bookPath);
  }
  result.forEach(function (item) {
    //不知道怎么解压
    request(item.realDownLink)
      .pipe(fs.createWriteStream(bookPath+item.name+'.rar'));
  })
}


var server = app.listen(8088, function () {
   setInterval(()=>{
     toSign();//每隔24小时签到一次
     console.log(new Date().getHours()+'点签到成功')
   },1000*60*60*12);
  setInterval(()=>{
    if(new Date().getHours()==17){
      toGetTodayLoveBook();//每隔1小时获取书籍
      console.log(new Date().getHours()+'点获取书籍成功')
    }
  },1000*60*60*1);
   console.log('hello world !');
})


