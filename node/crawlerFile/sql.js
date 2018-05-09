var mysql   = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'luozheao',
  password : 'luojie123',
  // user     : 'root',
  // password : '123456',
  database : 'forimage'
});
connection.connect();
module.exports=connection;


