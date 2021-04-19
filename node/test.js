var express = require('express');
var app = express();
var charset = require('superagent-charset');//解析编码 ，解码后再用$().text()可以看到效果
var req = superagent = charset(require('superagent'));//是个 http 方面的库，可以发起 get 或 post 请求。
var cheerio = require('cheerio'); //Node.js 版的 jquery
var request = require('request');
var async = require('async')
var fs = require('fs');


var url = require('url');
var http = require('http')
var iconv = require('iconv-lite');//解析编码,配合http使用:iconv+http
var path = require('path')

// req
//     .get('www.baidu.com')
//     .charset('utf-8')
//     .end((err, res) => {
//         if (err) {
//             console.log('getImagePageUrl error', err);
//             return;
//         }
//         let $ = cheerio.load(res.text);

//         let url = $('#lg').children('img').attr('src')

//         request('https:' + url)
//             .pipe(fs.createWriteStream(path.join(__dirname, 'haha.png')))
//             .on('close', function () {
//                 console.log('保存一张图片')
//             });

//     })



request('http://localhost:8080/douyin.mp4')
    .pipe(fs.createWriteStream(path.join(__dirname, 'douyin3.mp4')))
    .on('close', function () {
        console.log('保存视频')
    });