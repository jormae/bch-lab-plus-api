const mysql = require("mysql");
require("dotenv").config();

const connection = mysql.createPool({
  connectionLimit: 100,
  host: process.env.SERVER_HOST,
  user: process.env.SERVER_USER,
  password: process.env.SERVER_PASSWORD,
  database: process.env.SERVER_DATABASE_NAME,
  port: process.env.SERVER_PORT,
  // charset: process.env.SERVER_CHARSET,
});

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
