const express = require("express");
const moment = require("moment-timezone");
const connection = require("../config/database_server");

const app = express();
app.use(express.json());

const chartInfo = function (req, res, next) {
  console.log(req.body.an);
  const an = req.body.an;
  try {
    connection.query(
      "SELECT * " + "FROM tbl_chart " + "WHERE an = ? ",
      [an],
      (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        req.registerDate = results[0].registerDate;
        req.startSummaryDate = results[0].startSummaryDate;
        req.returnSummaryDueDate = results[0].returnSummaryDueDate;
        req.returnSummaryDate = results[0].returnSummaryDate;
        req.returnAuditDate = results[0].returnAuditDate;
        req.startEclaimDate = results[0].startEclaimDate;
        req.finishDueDate = results[0].finishDueDate;
        //   console.log(req.eventLateDateTime)
        next();
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
};

module.exports = chartInfo;
