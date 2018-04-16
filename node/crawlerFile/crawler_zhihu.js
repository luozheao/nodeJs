//知乎发现专栏
var superagent = require('superagent')
var cheerio = require('cheerio')
var http = require('http')
var url = require('url');
var async = require('async')
const fs = require('fs');
const server = http.createServer((req, res) => {

  var fetchUrl = function (offset, callback) {

    var baseUrl = 'https://www.zhihu.com/node/ExploreAnswerListV2';// 'http://www.zhihu.com/node/ExploreAnswerListV2'
    console.log(offset);
    var params = {
      'offset': offset,
      'type': 'day'
    }
    superagent.get(baseUrl)
      .set({
        'Accept':'*/*',
        'Accept-Encoding':'gzip, deflate',  //要删除br
        'Accept-Language':'zh-CN,zh;q=0.9',
        'Connection':'keep-alive',
        'Host':'www.zhihu.com',
        'X-Requested-With':'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
        'Referer': 'https://www.zhihu.com/explore',
      })
      .query({
        params: JSON.stringify(params)
      })
      .end(function (err, obj) {
        if (err) return null
        var $ = cheerio.load(obj.text)
        var items = []
        var baseUrl = 'https://www.zhihu.com'


        $('.explore-feed').each(function (index, item) {
          // item = this, $(this)转换为jq对象
          var tittle = $(this).find('h2 a').text().replace(/[\r\n]/g, '') //去掉空格
          var href = url.resolve(baseUrl, $(this).find('h2 a').attr('href'))
          var author = $(this).find('.author-link').text()
          items.push({
            title: tittle,
            href: href,
            author: author
          })
        })

        callback(null, items)
      })
  };



  async.mapLimit([0,5,10], 3, function (offset, callback) {
    fetchUrl(offset, callback);
  }, function (err, result) {
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    res.end(JSON.stringify(result))
  });


}).listen(9090)
