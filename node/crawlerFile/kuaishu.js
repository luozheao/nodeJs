var charset = require('superagent-charset');
var req = charset(require('superagent'));
var cheerio = require('cheerio')
var http = require('http')
var url = require('url');
var async = require('async')



 start();

function  start() {
  req
    .get('https://www.shukuai.org/member.php')
    .charset('gbk')
    .end((err, res) => {
      login(res);
    })
}

function login(res) {
   let cookieTest=  res.headers['set-cookie'].join(';');

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
     // .set('Cookie',cookieTest)
    .query("mod=logging&action=login&loginsubmit=yes&inajax=1")
    .send({
      "username": "ϾZHI",
      "password": "luojie123",
    })
    .end((err, res) => {
      console.log(res.text)
      getHtml(res);
    })
}

function getHtml(res){
      let cookie2=  res.headers['set-cookie'].join(';');
     // let cookie='0O82_2132_saltkey=ZwX9uvsx;0O82_2132_auth=6fa72jwfoeCIzhKbOgL83BfSSECXOWKprtzs4FzkIDOAukHb%2FSGKu%2BOiq4pA34j3QTyc2629fB0mWHuFODShemHGEFE;';//luozheao
     // let cookie='0O82_2132_saltkey=Wpbtr3pT;0O82_2132_auth=9b06QITy8Qprib0pL3bcSfaASaA7oE9igFuQSeUX9PVuoJgK4jNTSrpTb2sOIGm8M6JOo5pyQFcg7F8x3lELlEJiudI;';//暇ZHI
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
      if(!err){
           console.log('登陆成功');
           let $ = cheerio.load(res.text);
           console.log($('#myprompt_menu li').text());
      }
    })
}


