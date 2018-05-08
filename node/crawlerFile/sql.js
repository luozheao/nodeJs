var mysql   = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'luozheao',
  password : 'luojie123',
  database : 'forimage'
});
connection.connect();
module.exports=connection;


