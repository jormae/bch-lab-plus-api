const express = require("express");
const connection = require("../config/database_server");

const app = express();
app.use(express.json());

const isReturnChartExisted = function (req, res, next) {
  const an = req.params.an;
  try {
    connection.query(
      "SELECT * FROM tbl_chart WHERE returnSummaryDate IS NULL AND an = ? ",
      an,
      (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        console.log(results.length);
        if (results.length >= 1) {
          return res.status(400).json({
            status: "error",
            message: "AN ซ้ำ กรุณาสแกนชาร์ตถัดไป!",
          });
        }
        next();
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
};

const isSummaryReturnChartExisted = function (req, res, next) {
  const an = req.params.an;
  try {
    connection.query(
      "SELECT * FROM tbl_chart WHERE startSummaryDate IS NULL AND returnSummaryDate IS NULL AND an = ? ",
      an,
      (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        console.log(results.length);
        if (results.length >= 1) {
          return res.status(400).json({
            status: "error",
            message: "AN ซ้ำ กรุณาสแกนชาร์ตถัดไป!",
          });
        }
        next();
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
};

const isAuditChartExisted = function (req, res, next) {
  const an = req.params.an;
  try {
    connection.query(
      "SELECT * FROM tbl_chart WHERE returnAuditDate IS NULL AND an = ? ",
      an,
      (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }

        if (results.length >= 1) {
          return res.status(400).json({
            status: "error",
            message: "AN ซ้ำ กรุณาสแกนชาร์ตถัดไป!",
          });
        }
        next();
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
};

const isReauditChartExisted = function (req, res, next) {
  const an = req.params.an;
  try {
    connection.query(
      "SELECT * FROM tbl_chart WHERE reauditDate IS NULL AND an = ? ",
      an,
      (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }

        if (results.length >= 1) {
          return res.status(400).json({
            status: "error",
            message: "AN ซ้ำ กรุณาสแกนชาร์ตถัดไป!",
          });
        }
        next();
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
};

const isSubmitEclaimExisted = function (req, res, next) {
  const an = req.body.an;
  try {
    connection.query(
      "SELECT * FROM tbl_chart WHERE startEclaimDate IS NULL AND an = ? ",
      an,
      (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }

        if (results.length >= 1) {
          return res.status(400).json({
            status: "error",
            message: "AN ซ้ำ กรุณาสแกนชาร์ตถัดไป!",
          });
        }
        next();
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
};

const isReturnEclaimExisted = function (req, res, next) {
  const an = req.body.an;
  try {
    connection.query(
      "SELECT * FROM tbl_chart WHERE returnEclaimDate IS NULL AND an = ? ",
      an,
      (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }

        if (results.length >= 1) {
          return res.status(400).json({
            status: "error",
            message: "AN ซ้ำ กรุณาสแกนชาร์ตถัดไป!",
          });
        }
        next();
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
};

module.exports = [
  isReturnChartExisted,
  isSummaryReturnChartExisted,
  isAuditChartExisted,
  isReauditChartExisted,
  isSubmitEclaimExisted,
  isReturnEclaimExisted,
];
