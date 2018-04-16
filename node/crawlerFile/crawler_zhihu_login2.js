var req = require('superagent')
var cheerio = require('cheerio')
var http = require('http')
var url = require('url');
var async = require('async')

let article = ''
  , tags = []
  , title = ''

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
  Referer: 'http://segmentfault.com/',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
  'X-Requested-With': 'XMLHttpRequest'}
  , origin = 'http://segmentfault.com'
  , urls = {
  origin,
  login: `${origin}/api/user/login`,
  write: `${origin}/write?freshman=1`,
  draft: `${origin}/api/article/draft/save`,
  tag: `${origin}/api/tags/search`,
  blog: `${origin}/api/articles/add` }
  , conf = {
  "mail": "17099913401",
  "password": "luojie123",
  "remember": 1
}

let cookie

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

function login(res) {
  let token = getToken(res.text)

  cookie = res.headers['set-cookie'].join(',').match(/(PHPSESSID=.+?);/)[1]

  req
    .post(urls.login)
    .query({'_': token})
    .set(base_headers)
    .set('Cookie', cookie)
    .type('form')
    .send(conf)
    .redirects(0)
    .end((err, res) => {
         console.log(err);
    })
}


req
  .get(urls.origin)
  .end((err, res) => {
    login(res);
  })


