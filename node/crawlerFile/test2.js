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


 var str="0O82_2132_saltkey=N6Ee9eZ4; expires=Thu, 17-May-2018 09:34:39 GMT; path=/; secure; httponly,0O82_2132_lastvisit=1523954079; expires=Thu, 17-May-2018 09:34:39 GMT; path=/; secure,0O82_2132_sid=YZDjql; expires=Wed, 18-Apr-2018 09:34:39 GMT; path=/; secure,0O82_2132_lastact=1523957679%09member.php%09logging; expires=Wed, 18-Apr-2018 09:34:39 GMT; path=/; secure,0O82_2132_ulastactivity=7b89E5dwWv3ITv%2BcMFxLDpI4ipaofR56DW7iAdW2JJt8ZNWtm8b1; expires=Wed, 17-Apr-2019 09:34:39 GMT; path=/; secure,0O82_2132_sid=YZDjql; expires=Wed, 18-Apr-2018 09:34:39 GMT; path=/; secure,0O82_2132_auth=8c87hJ34ubiFDonL%2B2WB6JlGBRYbHbuuz2%2Bi2U0fndsqpcxIZkFRMeDPyfWNabefLxGwOrxVWQxLuCI2a1G1joNOFsQ; path=/; secure; httponly,0O82_2132_loginuser=deleted; expires=Mon, 17-Apr-2017 09:34:38 GMT; path=/; secure,0O82_2132_activationauth=deleted; expires=Mon, 17-Apr-2017 09:34:38 GMT; path=/; secure,0O82_2132_pmnum=deleted; expires=Mon, 17-Apr-2017 09:34:38 GMT; path=/; secure,0O82_2132_lastcheckfeed=192070%7C1523957679; expires=Wed, 17-Apr-2019 09:34:39 GMT; path=/; secure,0O82_2132_checkfollow=1; expires=Tue, 17-Apr-2018 09:35:09 GMT; path=/; secure,0O82_2132_lip=219.135.195.16%2C1523957668; path=/; secure,0O82_2132_myrepeat_rr=R0; expires=Wed, 18-Apr-2018 09:34:39 GMT; path=/;";


 str.match(/\d\S\d\d_\d{4}_\S+=\S+;/gi);
