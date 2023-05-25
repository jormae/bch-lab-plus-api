const express = require("express");
const moment = require("moment-timezone");
const connection = require("../config/database_server");

const app = express();
app.use(express.json());

const chartFolderInfo = function (req, res, next) {
  try {
    connection.query(
      "SELECT *, " +
        "(SELECT COUNT(*) FROM tbl_chart c WHERE c.folderId = f.folderId) AS totalCharts " +
        "FROM tbl_folder f " +
        "LEFT JOIN tbl_stock s ON s.stockId = f.stockId " +
        "ORDER BY folderLabel DESC " +
        "LIMIT 1",
      (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        req.totalCharts = results[0].totalCharts;
        req.folderLabel = results[0].folderLabel;
        // console.log(req.folderLabel);
        next();
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
};

module.exports = chartFolderInfo;
