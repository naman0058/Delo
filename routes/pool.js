
var mysql = require('mysql')

const pool = mysql.createPool({
//host: 'localhost',
  host:'142.93.216.211',
    user: 'root',
//  password: '123',
 password:'deloservices',
 database: 'delo_services',
    database : 'compress_schema',
    port:'3306' ,
    connectionLimit:100,
    multipleStatements:true
  })

module.exports = pool;