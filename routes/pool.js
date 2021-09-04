
var mysql = require('mysql')

const pool = mysql.createPool({
//host: 'localhost',
  host:'167.71.231.201',
    user: 'root',
//  password: '123',
 password:'123a@8Anmanraspaa123a@*Anmanraspaa',
 //database: 'delo',
    database : 'compress_schema',
    port:'3306' ,
    connectionLimit:100,
    multipleStatements:true
  })

module.exports = pool;