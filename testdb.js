

require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.localhost,
  user: process.env.root,
  password: process.env.root123,
  database: process.env.circuitaura,
});

console.log(process.env.DB_USER, process.env.DB_PASSWORD);

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database as id ' + connection.threadId);
  connection.end();
});
