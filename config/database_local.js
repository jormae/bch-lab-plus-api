const mysql = require("mysql");
require("dotenv").config();

//Mysql Connection
const connection = mysql.createConnection({
  connectionLimit: 100,
  host: process.env.LOCAL_HOST,
  user: process.env.LOCAL_USER,
  password: process.env.LOCAL_PASSWORD,
  database: process.env.LOCAL_DATABASE_NAME,
  port: process.env.LOCAL_PORT,
  charset: process.env.LOCAL_CHARSET,
});

// connection.connect(function (err) {
//   if (!err) {
//     // connection.query("SET NAMES UTF8");
//     console.log("Database local is successfully connected");
//     // console.log("connected as id " + connection.threadId);
//   } else {
//     console.error("error connecting: " + err.stack);
//   }
// });

exports.getConnection = function (callback) {
  connection.getConnection(function (err, conn) {
    if (err) {
      return callback(err);
    }
    // connection.query("SET NAMES utf8mb4");
    console.log("Database Server is successfully connected");
    callback(err, conn);
  });
};

module.exports = connection;
