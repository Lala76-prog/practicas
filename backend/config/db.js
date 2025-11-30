const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  port: 3316,
  user: 'root',
  password: 'S1pp4$QL',
  database: 'sichf'
});

module.exports = db;