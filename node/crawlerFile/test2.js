var request = require("superagent");
request.get("http://localhost:4000")
   .redirects(0)
  .end(function(err, res) {
    console.log(err,res.text,123);
});

