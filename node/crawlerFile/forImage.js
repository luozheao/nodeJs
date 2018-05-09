var express = require('express');
var app = express();
var charset = require('superagent-charset');//解析编码 ，解码后再用$().text()可以看到效果
var req = superagent = charset(require('superagent'));//是个 http 方面的库，可以发起 get 或 post 请求。
var cheerio = require('cheerio'); //Node.js 版的 jquery
var request = require('request');
var async = require('async')
var fs = require('fs');
var bodyParser = require('body-parser');
var connection=require('./sql.js');
var urlencodedParser = bodyParser.urlencoded({extended: false})
var urlencode = require('urlencode');
var url = require('url');
var http = require('http')
var iconv = require('iconv-lite');//解析编码,配合http使用:iconv+http

/**
 * 1.获取
 *
 * */
var mainUrl = 'http://bbs.weibenkeji.com/';
var pageUrl = mainUrl + "forum.php?mod=forumdisplay&fid=2&page=";
var imagePath = './qmImages/'
var  syncPage=2;//同时执行n页
var  syncArticle=5;//同时执行n主题
var  syncImg=5;//同时拿n图片


setSumPage(1, 50);

//控制爬取页数
function setSumPage(start, end) {
  var arr = [...Array(end)].map((p, index) => index + 1).slice(start - 1);
  async.mapLimit(arr, syncPage, function (num, sumCallback) {
    getImagePageUrl(num)
      .then(getImage)
      .then(saveImage)
      .then(function (result) {
          sumCallback(null, result);
      })
  }, function (err, result) {
    console.log('全部爬取完成');
    sqlInsert(result,null);
  });
}

//获取图片所在页面的链接
function getImagePageUrl(pageNum) {
  return new Promise(function (resolve, reject) {
    req
      .get(pageUrl + pageNum)
      .charset('utf-8')
      .end((err, res) => {
        if (err) {
          console.log('getImagePageUrl error', err);
          return;
        }
        let $ = cheerio.load(res.text);
        let imagesArr = [];
        $('#threadlisttableid tr th  .s.xst').each(function () {
          imagesArr.push({
            imageName: $(this).text(),
            imageUrl: $(this).attr('href')
          })
        })
        resolve(imagesArr);
      })
  })


}

//获取页面里面的图片
function getImage(result) {
  return new Promise(function (resolve, reject) {
    async.mapLimit(result, syncArticle, function (item, callback) {
      req
        .get(mainUrl + item.imageUrl)
        .charset('utf-8')
        .end((err, res) => {
          if (err) {
            console.log('getImage error', err);
            return;
          }
          let $ = cheerio.load(res.text);
          let urlArr = [];
          $('.t_fsz').eq(0).find('table ignore_js_op .xs0').each(function () {
            urlArr.push({
              imageName: item.imageName,
              imgName: $(this).find('strong').text(),
              imgUrl: $(this).find('a').attr('href')
            });
          })
          callback(null, urlArr);
        })

    }, function (err, result) {
      resolve(result);
    });
  })
}

//保存图片
function saveImage(result) {
  return new Promise(function(resolve,reject){
    resolve(result);
  });

  // return new Promise(function (resolve, reject) {
  //   if (!fs.existsSync(imagePath)) {
  //     fs.mkdirSync(imagePath);
  //   }
  //   console.log('开始抓取图片')
  //
  //   async.mapLimit(result, syncArticle, function (arr, callback1) {
  //     async.mapLimit(arr, syncImg, function (item, callback2) {
  //       if(item.imgUrl){
  //         var url = mainUrl + item.imgUrl.replace('nothumb', 'noupdate')
  //         request(url)
  //           .pipe(fs.createWriteStream(imagePath + item.imageName.replace('/','_') + '_' + item.imgName))
  //           .on('close',function(){
  //             console.log('保存一张图片')
  //             callback2(null,"");
  //           });
  //       }else{
  //         console.log(item)
  //       }
  //     }, function (err, result) {
  //       console.log('保存一组图片')
  //       callback1(null,"");
  //     });
  //   }, function (err, result) {
  //     resolve();
  //   });
  // })
}

//保存图片信息到数据库
function sqlInsert(result,testArr) {
  function changeData(resultSum){
    var arr=[];
    resultSum.forEach(function (result) {
      result.forEach(function (item) {
        item.forEach(function (p) {
          arr.push([p.imageName,p.imgName,p.imgUrl])
        })
      })
    })
    return arr;
  }
  var selectSql = 'insert into imageMsg(imageName,imgName,imgUrl) values ?';
  var params=result?changeData(result):testArr;
  connection.query(selectSql,[params],function (err, result) {
    if(err){
      console.log(err.message);
      return;
    }
    console.log(result);
  });
}


var server = app.listen(8089, function () {
  console.log('hello world !');
})


/**
 * 读取文件夹中所有图片,并获取较小图片的名称
 * **/
function getLitterImagesName(size) {
  return new Promise(function(resolve,reject){
    fs.readdir(imagePath, function (err, files) {
      async.mapLimit(files, 30, function (imageName, callbackTest) {
        fs.stat(imagePath + imageName, function (err, stats) {
          let sizeVal=stats.size/1024;
          if(sizeVal<=size){
            callbackTest(null,imageName);
          }else{
            callbackTest(null,null);
          }
        })
      }, function (err, result) {
        let arr=  result.filter(function (item) {
          return item!=null;
        });
         resolve(arr);
      });
    });
  });

}
getLitterImagesName(27).then(function(arr){
  console.log(arr);
});
