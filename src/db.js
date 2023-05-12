var mysql = require('mysql')
// var dbConf = {
//   host: 'sql.freedb.tech',
//   user: 'freedb_whatsapp_', //
//   password: '&RcNBeM#MxpG8eZ', //
//   database: 'freedb_jono_',
//   port: '3306',
//   connectionLimit: 150000,
//   // queueLimit: 30,
//   // acquireTimeout: 1000000
// }

var dbConf = {
  host: 'us-cdbr-east-02.cleardb.com',
  user: 'b10250d4524049', //
  password: 'd377e116', //
  database: 'heroku_13b21ebb9b93855',
  port: '3306',
}

const pool = mysql.createPool(dbConf)

const db = mysql.createConnection(dbConf)

pool.on('connection', function(_conn) {
  if (_conn) {
      console.log('Connected the database via threadId %d!! ', _conn.threadId);
      _conn.query('SET SESSION auto_increment_increment=1');
  }
})

// db.connect((err) => {
//   if (err) {
//     return console.log('error connection mysql :: ', err.message)
//   }

//   console.log('Connected to mysql server')
// })

module.exports = {
  pool,
  db
}