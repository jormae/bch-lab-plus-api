const express = require("express");
const moment = require("moment-timezone");
const connection_local = require("../config/database_local");
const connection_server = require("../config/database_server");
const router = express.Router();
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
moment.tz.setDefault("Asia/Bangkok");

const cb0 = function (req, res, next) {
  let data = "CB0";
  console.log(data);
  next();
};

const cb1 = function (req, res, next) {
  console.log("CB1");
  next();
};

const cb2 = function (req, res) {
  res.send("Hello from C!");
};

router.get("/", (req, res) => {
  res.send("Hello from Example");
});

router.get("/a", (req, res) => {
  res.send("Hello from A!");
});

router.get(
  "/b",
  (req, res, next) => {
    console.log("the response will be sent by the next function ...");
    next();
  },
  (req, res) => {
    res.send("Hello from B!");
  }
);

router.get("/c", [cb0, cb1, cb2]);

router.get(
  "/d",
  [cb0],
  (req, res, next) => {
    console.log("the response will be sent by the next function ...");
    next();
  },
  (req, res) => {
    res.send("Hello from D!");
  }
);

const getChartInfoByAn = function (req, res, next) {
  const an = req.params.an;
  try {
    const mysql =
      "SELECT * " +
      "FROM tbl_chart c " +
      "LEFT JOIN tbl_ward w ON w.wardCode = c.wardCode " +
      "LEFT JOIN tbl_discharge_status ds ON ds.dischargeStatusCode = c.dischargeStatusCode " +
      "LEFT JOIN tbl_discharge_type dt ON dt.dischargeTypeCode = c.dischargeTypeCode " +
      "LEFT JOIN tbl_pttype pt ON pt.pttypeCode = c.pttypeCode " +
      "LEFT JOIN tbl_refer_cause rc ON rc.referCauseCode = c.referCauseCode " +
      "LEFT JOIN tbl_refer_hospital rh ON rh.referHospitalCode = c.referHospitalCode " +
      "WHERE an = ?";
    connection_server.query(mysql, [an], (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(400).send();
      }
      //   res.status(200).json(results);
      //   return "true";
      res.json({ success: true });
      //   console.log(res.status(200).json(results));
      //   console.log(res.json({ success: true }));
      console.log("yes");
      //   let hn = res.json(results[0].hn);
      //   let ptName = res.json(results[0].ptName);
      //   next(res.json(results[0]));
      next();
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
};

router.get(
  "/chart/:an",
  getChartInfoByAn,
  (req, res) => {
    // console.log("the response will be sent by the next function ...");
    console.log("ok");
    console.log(getChartInfoByAn);
    next();
  },
  (req, res) => {
    console.log("ok next");

    // res.send("Hello from getChartInfoByAn!");
  }
);

module.exports = router;
