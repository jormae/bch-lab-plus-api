const express = require("express");
const connection_local = require("../config/database_local");
const connection_server = require("../config/database_server");
const router = express.Router();
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.get("/", (req, res) => {
  // res.send("org page!");
  try {
    const mysql =
      'SELECT an, i.hn, CONCAT(p.pname,p.fname," ", p.lname) AS ptName, regdate AS admitDate, regtime AS admitTime, ' +
      'dchdate AS dischargeDate , dchtime AS dischargeTime, CONCAT(d.pname,d.fname," ", d.lname) AS dischargeDoctor ' +
      "FROM ipt i LEFT JOIN patient p ON p.hn = i.hn " +
      "LEFT JOIN doctor d ON d.code = i.dch_doctor " +
      'WHERE regdate >= "2022-04-01" ' +
      "AND dchdate IS NOT NULL";
    connection_local.query(mysql, (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(400).send();
      }
      console.log(results);
      res.status(200).json(results);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

router.get("/:an", async (req, res) => {
  const an = req.params.an;
  const ans = an.split(",");
  console.log(ans);
  try {
    const mysql =
      'SELECT an, i.hn, CONCAT(p.pname,p.fname," ", p.lname) AS ptName, regdate AS admitDate, regtime AS admitTime, ' +
      'dchdate AS dischargeDate , dchtime AS dischargeTime, CONCAT(d.pname,d.fname," ", d.lname) AS dischargeDoctor ' +
      "FROM ipt i LEFT JOIN patient p ON p.hn = i.hn " +
      "LEFT JOIN doctor d ON d.code = i.dch_doctor " +
      "WHERE an IN (?)";
    connection_local.query(mysql, [ans], (err, results, fields) => {
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

router.post(
  "/",
  body("an").custom((value, { req }) => {
    return new Promise((resolve, reject) => {
      const an = req.body.an;
      connection_server.query(
        "SELECT an FROM tbl_chart WHERE an = ?",
        [an],
        (err, res) => {
          if (err) {
            reject(new Error("Server Error"));
          }
          if (res.length > 0) {
            reject(new Error("AN is already existed!"));
          }
          resolve(true);
        }
      );
    });
  }),
  async (req, res) => {
    const { an, hn, ptName } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      connection_server.query(
        "INSERT INTO tbl_chart(an, hn, ptName) VALUES (?,?,?)",
        [an, hn, ptName],
        (err, results, fields) => {
          if (err) {
            console.log("Error while inserting a AN into database!", err);
            return res.status(400).send();
          }
          console.log(results);
          return res
            .status(201)
            .json({ message: "New AN is successfully created!" });
        }
      );
    } catch (err) {
      console.log(err);
      return res.status(500).send();
    }
  }
);
router.put("/:an", async (req, res) => {
  const an = req.params.an;
  const hn = req.body.hn;
  const ptName = req.body.ptName;
  const admitDate = req.body.admitDate;
  const admitTime = req.body.admitTime;
  const dischargeDate = req.body.dischargeDate;
  const dischargeTime = req.body.dischargeTime;
  const dischargeDoctor = req.body.dischargeDoctor;
  try {
    connection_server.query(
      "UPDATE tbl_chart SET hn = ?, ptName = ?, admitDate = ?, admitTime = ?, dischargeDate = ?, dischargeTime = ?, dischargeDoctor = ? " +
        "WHERE an = ?",
      [
        hn,
        ptName,
        admitDate,
        admitTime,
        dischargeDate,
        dischargeTime,
        dischargeDoctor,
        an,
      ],
      (err, results, fields) => {
        if (err) {
          console.log("Error while updating AN in database!", err);
          return res.status(400).send();
        }
        console.log(results);

        return res
          .status(200)
          .json({ message: "The AN is successfully updated!" });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

module.exports = router;
