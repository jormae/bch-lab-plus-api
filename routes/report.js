const express = require("express");
const connection_server = require("../config/database_server");
const router = express.Router();
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.get("/", (req, res) => res.send("it's reports route"));
router.get("/chart-status", (req, res) => {
  try {
    const mysql =
      "SELECT DATE_FORMAT(dischargeDate, '%Y-%m') AS 'dischargeDate', " +
      "SUM(IF(registerDate IS NOT NULL,1,0)) AS registerDate, " +
      "SUM(IF(startSummaryDate IS NOT NULL,1,0)) AS startSummaryDate, " +
      "SUM(IF(returnSummaryDate IS NOT NULL,1,0)) AS returnSummaryDate, " +
      "SUM(IF(returnAuditDate IS NOT NULL,1,0)) AS returnAuditDate, " +
      "SUM(IF(reauditDate IS NOT NULL,1,0)) AS reauditDate, " +
      "SUM(IF(startEclaimDate IS NOT NULL,1,0)) AS startEclaimDate, " +
      "SUM(IF(returnEclaimDate IS NOT NULL,1,0)) AS returnEclaimDate, " +
      "SUM(IF(stockDate IS NOT NULL,1,0)) AS stockDate " +
      "FROM tbl_chart " +
      "GROUP BY DATE_FORMAT(dischargeDate, '%Y-%m')";
    connection_server.query(mysql, (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(400).send();
      }
      res.status(200).json(results);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

router.get("/chart-status/:year_month", (req, res) => {
  const year_month = req.params.year_month+'%'
  try {
    const mysql =
    "SELECT * " +
    "FROM tbl_chart c " +
    "LEFT JOIN tbl_ward w ON w.wardCode = c.wardCode " +
    "LEFT JOIN tbl_discharge_status ds ON ds.dischargeStatusCode = c.dischargeStatusCode " +
    "LEFT JOIN tbl_doctor d ON d.doctorCode = c.doctorCode " +
    "LEFT JOIN tbl_discharge_type dt ON dt.dischargeTypeCode = c.dischargeTypeCode " +
    "LEFT JOIN tbl_pttype pt ON pt.pttypeCode = c.pttypeCode " +
    "LEFT JOIN tbl_refer_cause rc ON rc.referCauseCode = c.referCauseCode " +
    "LEFT JOIN tbl_refer_hospital rh ON rh.referHospitalCode = c.referHospitalCode " +
    "WHERE dischargeDate LIKE ? "+
    "ORDER BY c.an DESC ";
    connection_server.query(mysql, year_month,(err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(400).send();
      }
      res.status(200).json(results);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

module.exports = router;
