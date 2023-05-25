const express = require("express");
const moment = require("moment-timezone");
const connection_server = require("../config/database_server");
const router = express.Router();
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
moment.tz.setDefault("Asia/Bangkok");

router.get("/", (req, res) => {
  console.log("stat route");
});

router.get("/new-chart/:staffName", (req, res) => {
  const today = moment().format("YYYY-MM-DD") + "%";
  const staffName = req.params.staffName;

  try {
    const mysql =
      "SELECT DATE_FORMAT(registerDate,'%Y-%m-%d') AS date, " +
      "SUM(IF(wardCode = '04',1,0)) AS 'lr', " +
      "SUM(IF(wardCode = '14',1,0)) AS 'prelr', " +
      "SUM(IF(wardCode = '16',1,0)) AS 'ipd1', " +
      "SUM(IF(wardCode = '17',1,0)) AS 'ipd2' " +
      "FROM tbl_chart  " +
      "WHERE registerDate LIKE ? " +
      "AND registerBy = ? ";
    connection_server.query(
      mysql,
      [today, staffName],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        res.status(200).json(result);
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

router.get("/summary-chart/:staffName", (req, res) => {
  const today = moment().format("YYYY-MM-DD") + "%";
  const staffName = req.params.staffName;
  console.log(staffName);
  try {
    const mysql =
      "SELECT *, " +
      "(SELECT COUNT(*) FROM tbl_chart c WHERE startSummaryDate LIKE ? AND startSummaryBy = ? AND c.doctorCode = d.doctorCode)  AS totalCharts " +
      "FROM tbl_doctor d " +
      "WHERE doctorStatusId = 1 " +
      "ORDER BY doctorName";
    connection_server.query(
      mysql,
      [today, staffName],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        console.log(result);
        res.status(200).json(result);
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

router.get("/return-chart/:staffName", (req, res) => {
  const today = moment().format("YYYY-MM-DD") + "%";
  const staffName = req.params.staffName;
  console.log(staffName);
  try {
    const mysql =
      "SELECT *, " +
      "(SELECT COUNT(*) FROM tbl_chart c WHERE returnSummaryDate LIKE ? AND returnSummaryBy = ? AND c.doctorCode = d.doctorCode)  AS totalCharts " +
      "FROM tbl_doctor d " +
      "WHERE doctorStatusId = 1 " +
      "ORDER BY doctorName";
    connection_server.query(
      mysql,
      [today, staffName],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        console.log(result);
        res.status(200).json(result);
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

router.get("/summary-return-chart/:staffName", (req, res) => {
  const today = moment().format("YYYY-MM-DD") + "%";
  const staffName = req.params.staffName;
  console.log(staffName);
  try {
    const mysql =
      "SELECT *, " +
      "(SELECT COUNT(*) FROM tbl_chart c WHERE startSummaryDate LIKE ? AND returnSummaryDate LIKE ? AND returnSummaryBy = ? AND c.doctorCode = d.doctorCode)  AS totalCharts " +
      "FROM tbl_doctor d " +
      "WHERE doctorStatusId = 1 " +
      "ORDER BY doctorName";
    connection_server.query(
      mysql,
      [today, today, staffName],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        console.log(result);
        res.status(200).json(result);
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});
router.get("/audit-chart/:staffName", (req, res) => {
  const today = moment().format("YYYY-MM-DD") + "%";
  const staffName = req.params.staffName;
  try {
    const mysql =
      "SELECT *, " +
      "(SELECT COUNT(*) FROM tbl_chart c WHERE returnSummaryDate NOT LIKE ? AND returnAuditDate LIKE ? AND returnSummaryBy = ?  AND c.doctorCode = d.doctorCode)  AS totalCharts " +
      "FROM tbl_doctor d " +
      "WHERE doctorStatusId = 1 " +
      "ORDER BY doctorName";
    connection_server.query(
      mysql,
      [today, today, staffName],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        console.log(result);
        res.status(200).json(result);
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

router.get("/reaudit-chart/:staffName", (req, res) => {
  const today = moment().format("YYYY-MM-DD") + "%";
  const staffName = req.params.staffName;
  try {
    const mysql =
      "SELECT *, " +
      "(SELECT COUNT(*) FROM tbl_chart c WHERE reauditDate LIKE ? AND reauditBy = ?  AND c.doctorCode = d.doctorCode)  AS totalCharts " +
      "FROM tbl_doctor d " +
      "WHERE doctorStatusId = 1 " +
      "ORDER BY doctorName";
    connection_server.query(
      mysql,
      [today, staffName],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        console.log(result);
        res.status(200).json(result);
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

router.get("/submit-eclaim/:staffName", (req, res) => {
  const today = moment().format("YYYY-MM-DD") + "%";
  const staffName = req.params.staffName;
  try {
    const mysql =
      " SELECT DATE_FORMAT(startEclaimDate,'%Y-%m-%d') AS date, " +
      "SUM(IF(mainPttypeId = '1',1,0)) AS 'pttype1',  " +
      "SUM(IF(mainPttypeId = '2',1,0)) AS 'pttype2',  " +
      "SUM(IF(mainPttypeId = '3',1,0)) AS 'pttype3',  " +
      "SUM(IF(mainPttypeId = '4',1,0)) AS 'pttype4',  " +
      "SUM(IF(mainPttypeId = '5',1,0)) AS 'pttype5',  " +
      "SUM(IF(mainPttypeId = '6',1,0)) AS 'pttype6',  " +
      "SUM(IF(mainPttypeId = '7',1,0)) AS 'pttype7',  " +
      "SUM(IF(mainPttypeId = '8',1,0)) AS 'pttype8' " +
      "FROM tbl_chart c " +
      "LEFT JOIN tbl_pttype p ON p.pttypeCode = c.pttypeCode " +
      "WHERE startEclaimDate LIKE ? " +
      "AND startEclaimBy = ?";
    connection_server.query(
      mysql,
      [today, staffName],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        console.log(result);
        res.status(200).json(result);
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

router.get("/return-eclaim/:staffName", (req, res) => {
  const today = moment().format("YYYY-MM-DD") + "%";
  const staffName = req.params.staffName;
  try {
    const mysql =
      " SELECT DATE_FORMAT(returnEclaimDate,'%Y-%m-%d') AS date, " +
      "SUM(IF(mainPttypeId = '1',1,0)) AS 'pttype1',  " +
      "SUM(IF(mainPttypeId = '2',1,0)) AS 'pttype2',  " +
      "SUM(IF(mainPttypeId = '3',1,0)) AS 'pttype3',  " +
      "SUM(IF(mainPttypeId = '4',1,0)) AS 'pttype4',  " +
      "SUM(IF(mainPttypeId = '5',1,0)) AS 'pttype5',  " +
      "SUM(IF(mainPttypeId = '6',1,0)) AS 'pttype6',  " +
      "SUM(IF(mainPttypeId = '7',1,0)) AS 'pttype7',  " +
      "SUM(IF(mainPttypeId = '8',1,0)) AS 'pttype8' " +
      "FROM tbl_chart c " +
      "LEFT JOIN tbl_pttype p ON p.pttypeCode = c.pttypeCode " +
      "WHERE returnEclaimDate LIKE ? " +
      "AND returnEclaimBy = ?";
    connection_server.query(
      mysql,
      [today, staffName],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        console.log(result);
        res.status(200).json(result);
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

router.get("/stock-chart/:stockId/:staffName", (req, res) => {
  const today = moment().format("YYYY-MM-DD") + "%";
  const stockId = req.params.stockId;
  const staffName = req.params.staffName;
  try {
    const mysql =
      "SELECT COUNT(*) AS totalCharts " +
      "FROM tbl_chart c " +
      "WHERE folderId = ? " +
      "AND stockDate LIKE ? " +
      "AND stockedBy = ?";
    connection_server.query(
      mysql,
      [stockId, today, staffName],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        console.log(result);
        res.status(200).json(result);
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

module.exports = router;
