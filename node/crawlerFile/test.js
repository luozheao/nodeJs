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

// var booksArr=['a','b','c'];
// async.mapLimit(booksArr,5, function (item, callback) {
//      setTimeout(()=>{
//        console.log(1);
//        async.mapLimit(['d','e','f'],5, function (p, callback2) {
//            setTimeout(()=>{
//              console.log(2);
//              callback2(null,p);
//            },1000)
//          },
//          function (err, result) {
//            callback(null,result);
//          });
//      },1000)
// },
//   function (err, result) {
//       console.log(result);
// });




async function getData() {
  // 假装请求数据1
  var data1 = await new Promise((resolve) => {
    setTimeout(() => {
      resolve('data1');
      console.log('data1');
    }, 1000);
  });

  // 假装请求数据2且此请求依赖数据1
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('data2');
      console.log('data2');
    }, 1000);
  });
}

async function test(){
   var aa= await getData();
   console.log('test');
}

test();
