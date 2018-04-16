var superagent = require('superagent');

/*
1.  `_`的值必须与之下的Cookie对应，否则服务端返回404
2. 以下的http请求头是必须的，其他无所谓，不然就是404
*/


// superagent
//   .get('https://segmentfault.com')
//   .end((err, res) => {
//
//   })



superagent.post('https://segmentfault.com/api/user/login?_=7ef046ad4f224034d7b51655238bd870')
  .set('Referer', 'https://segmentfault.com/user/login')
  .set('X-Requested-With', 'XMLHttpRequest')
  .set('Cookie', 'PHPSESSID=web1~395mahoqliohh5kclv894ibpr3;')
  .send({
    username: 17099913401,
    password: "luojie123",
    "remember": 1
  })
  .type('form')

  .end(function(err, res) {
    if (err || !res.ok) {
      console.log(err);
    } else {
      console.log(res.text);
    }
  });
