var req = require('superagent')
var cheerio = require('cheerio')
var http = require('http')
var url = require('url');
var async = require('async')

let article = ''
  , tags = []
  , title = ''

const base_headers = {
  'accept': '*/*',
  'Accept-Encoding': 'gzip, deflate',
  'Accept-Language': 'zh-CN,zh;q=0.9',
  'authorization': 'oauth c3cef7c66a1843f8b3a9e6a1e3160e20',
  'Connection': 'keep-alive',
   'Content-Length': 2232,
  'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryhpGguj9HpEAJDA6c',
  'Host': 'www.zhihu.com',
  'Origin': 'https://www.zhihu.com',
  'Referer': 'https://www.zhihu.com/signup',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36',
  'X-UDID': 'AOCvwW15dA2PThXnk8bZNd17aOZCimlmBTo=',
  'X-Xsrftoken': '0c776894-cfa7-4dba-9408-28879ae755c5',
}

  var conf = {
    "username": "17099913401",
    "password": "luojie123"
  }


   req
  .get('https://www.zhihu.com/#signin')
  .end((err, res) => {

    let cookie=  res.headers['set-cookie'].join(',')
    req
        .post('https://www.zhihu.com/api/v3/oauth/sign_in')
        .set(base_headers)
        .set('Cookie',cookie)
        .type('form')
        .send(conf)
        .redirects(0)
      .end((err, res) => {
          console.log(err,456);
          console.log(res,789);
      })
  })


