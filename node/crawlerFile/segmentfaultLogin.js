var req = require('superagent')
var cheerio = require('cheerio')
var http = require('http')
var url = require('url');
var async = require('async')



let origin = 'https://segmentfault.com/user/login'; //'https://segmentfault.com/user/login'//'http://segmentfault.com/'

const base_headers = {
  Accept: '*/*',
  'Accept-Encoding':'gzip, deflate',
  'Accept-Language':'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4,ja;q=0.2',
  'Cache-Control':'no-cache',
  Connection:'keep-alive',
  DNT:1,
  Host:'segmentfault.com',
  Origin: 'http://segmentfault.com',
  Pragma:'no-cache',
  Referer:origin,
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
  'X-Requested-With': 'XMLHttpRequest'}

let urls = {
  origin,
  login: `${origin}/api/user/login`,
  mainpage: origin,
};


let conf = {
  "username": 17099913401,
  "password": "luojie123",
  "remember": 1
};

function getToken(s) {
  let $ = cheerio.load(s);
  let text = "";

  for (var i = 0; i < $('body script').length; i++) {
    var jsss = $('body script')[i];
    if (!jsss.attribs.src && !jsss.attribs.id) {
      if (jsss.children[0].data.indexOf('token') >= 0) {
        text = jsss.children[0].data;
      }
    }
  }
  let fn = new Function('window', text + ';return window.SF.token');
  let token = fn({});

  $ = null
  return token
}


   req
  .get(urls.mainpage)
  .end((err, res) => {
      login(res);
  })


function login(res) {
  let token =getToken(res.text);
  let cookie =res.headers['set-cookie'].join(';');
   req
     .post('https://segmentfault.com/api/user/login')
     .set(base_headers)
     .set('Cookie', cookie)
    .query({
      '_': token
    })
    .type('form')
    .send(conf)
    // .redirects(0)
    .end((err, res) => {

      req
        .post('https://segmentfault.com/u/luoshengmen')
        .set(base_headers)
        .set('Cookie', cookie)
        .type('form')
        .end((err, res) => {
             console.log(err,res.text);
        })

    })
}


