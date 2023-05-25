const express = require("express");
const connection = require("../config/database_server");

const app = express();
app.use(express.json());

const chartFolderQuantityInfo = function (req, res, next) {
  const folderId = req.params.folderId;
  try {
    connection.query(
      "SELECT COUNT(*) AS totalCharts FROM tbl_chart WHERE folderId = ? ",
      folderId,
      (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        req.totalCharts = results[0].totalCharts;
        // console.log(req.totalCharts);
        next();
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
};

module.exports = chartFolderQuantityInfo;
