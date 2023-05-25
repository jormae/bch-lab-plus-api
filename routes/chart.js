const express = require("express");
const moment = require("moment-timezone");
const connection_local = require("../config/database_local");
const connection_server = require("../config/database_server");
const router = express.Router();
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");
const chartInfo = require("../middlewares/chart");
const chartFolderInfo = require("../middlewares/chart-folder");
const chartFolderQuantityInfo = require("../middlewares/chart-folder-quantity");

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
moment.tz.setDefault("Asia/Bangkok");

router.get("/", (req, res) => {
  const today = moment().format("YYYY-MM-DD") + "%";
  // const { staffName } = req.body;
  try {
    const mysql =
      "SELECT * " +
      "FROM tbl_chart c " +
      "LEFT JOIN tbl_ward w ON w.wardCode = c.wardCode " +
      "WHERE registerDate LIKE ? " +
      "ORDER BY registerDate DESC " +
      "LIMIT 10";
    connection_server.query(mysql, [today], (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(400).send();
      }
      // console.log(results);
      res.status(200).json(results);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

// router.get("/:an", async (req, res) => {
//   const an = req.params.an;
//   // try {
//   //   const mysql =
//   //     'SELECT an, i.hn, CONCAT(p.pname,p.fname," ", p.lname) AS ptName, regdate AS admitDate, regtime AS admitTime, ' +
//   //     'dchdate AS dischargeDate , dchtime AS dischargeTime, CONCAT(d.pname,d.fname," ", d.lname) AS dischargeDoctor, ' +
//   //     "ward AS wardCode " +
//   //     "FROM ipt i LEFT JOIN patient p ON p.hn = i.hn " +
//   //     "LEFT JOIN doctor d ON d.code = i.dch_doctor " +
//   //     "WHERE an = ?";
//   //   connection_local.query(mysql, [an], (err, results, fields) => {
//   //     if (err) {
//   //       console.log(err);
//   //       return res.status(400).send();
//   //     }
//   //     res.status(200).json(results);
//   //   });
//   // } catch (err) {
//   //   console.log(err);
//   //   return res.status(500).send();
//   // }
// });

router.get("/new-chart/:staffName", (req, res) => {
  const today = moment().format("YYYY-MM-DD") + "%";
  // console.log(today)
  const staffName = req.params.staffName;
  try {
    const mysql =
      "SELECT * " +
      "FROM tbl_chart c " +
      "LEFT JOIN tbl_ward w ON w.wardCode = c.wardCode " +
      "WHERE registerDate LIKE ? " +
      "AND registerBy = ? " +
      "ORDER BY registerDate DESC " +
      "LIMIT 10";
    connection_server.query(
      mysql,
      [today, staffName],
      (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        // console.log(results);
        res.status(200).json(results);
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});
router.get("/all-chart", (req, res) => {
  try {
    const mysql =
      "SELECT *, " +
      "CASE " +
      "WHEN stockDate IS NOT NULL THEN 'คลังชาร์ต' " +
      "WHEN returnEclaimDate IS NOT NULL THEN 'รับคืนจาก e-claim' " +
      "WHEN startEclaimDate IS NOT NULL THEN 'ส่ง e-claim' " +
      "WHEN returnAuditDate IS NOT NULL THEN 'รับคืนจาก Audit' " +
      "WHEN returnSummaryDate IS NOT NULL THEN 'ส่ง Audit' " +
      "WHEN startSummaryDate IS NOT NULL THEN 'ส่ง Summary' " +
      "ELSE 'ลงทะเบียนชาร์ต' " +
      "END " +
      "AS location " +
      "FROM tbl_chart c " +
      "LEFT JOIN tbl_ward w ON w.wardCode = c.wardCode " +
      "LEFT JOIN tbl_discharge_status ds ON ds.dischargeStatusCode = c.dischargeStatusCode " +
      "LEFT JOIN tbl_doctor d ON d.doctorCode = c.doctorCode " +
      "LEFT JOIN tbl_discharge_type dt ON dt.dischargeTypeCode = c.dischargeTypeCode " +
      "LEFT JOIN tbl_pttype pt ON pt.pttypeCode = c.pttypeCode " +
      "LEFT JOIN tbl_refer_cause rc ON rc.referCauseCode = c.referCauseCode " +
      "LEFT JOIN tbl_refer_hospital rh ON rh.referHospitalCode = c.referHospitalCode " +
      "ORDER BY c.an DESC ";
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

router.get("/all-chart/:an", async (req, res) => {
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
    connection_server.query(mysql, [an], async (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(400).send();
      }
      // await setTimeout(() => {
      res.status(200).json(results);
      // }, 2000);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

router.put("/all-chart/:an", async (req, res) => {
  const an = req.params.an;
  console.log(an);
  const dischargeDate = req.body.dischargeDate;
  const doctorCode = req.body.doctorCode;
  const dischargeStatusCode = req.body.dischargeStatusCode;
  const dischargeTypeCode = req.body.dischargeTypeCode;
  const referCauseCode = req.body.referCauseCode;
  const referHospitalCode = req.body.referHospitalCode;
  const pttypeCode = req.body.pttypeCode;
  const updatedBy = req.body.updatedBy;
  const admitDuration = req.body.admitDuration;
  // const startSummaryDate = moment(req.body.date).format("YYYY-MM-DD");
  // const returnedSummaryBy = req.body.staffName;
  // const returnSummaryDate = moment().format("YYYY-MM-DD H:mm:ss");
  // const summaryDuration = moment(returnSummaryDate).diff(
  //   moment(startSummaryDate),
  //   "days"
  // );

  try {
    connection_server.query(
      "UPDATE tbl_chart SET dischargeDate = ?, doctorCode = ?, admitDuration = ?, dischargeStatusCode = ?, dischargeTypeCode = ?, referCauseCode = ?, referHospitalCode = ?, pttypeCode = ?, updatedBy = ? " +
      "WHERE an = ? ",
      [
        dischargeDate,
        doctorCode,
        admitDuration,
        dischargeStatusCode,
        dischargeTypeCode,
        referCauseCode,
        referHospitalCode,
        pttypeCode,
        updatedBy,
        an,
      ],
      (err, results, fields) => {
        if (err) {
          console.log("Error while updating return summary in database!", err);
          return res.status(400).send();
        }
        console.log(results);

        return res.status(200).json({
          status: "success",
          message: "บันทึกการแก้ไขข้อมูลชาร์ตเรียบร้อยแล้ว!",
        });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

router.get("/history/:an", (req, res) => {
  const an = req.params.an;
  console.log(an);
  try {
    const mysql =
      "SELECT CONCAT(id,registerDate) AS id, 'รับชาร์ต' AS action, registerDate AS datetime, registerBy AS staffName " +
      "FROM tbl_chart c " +
      "WHERE an = ? " +
      "UNION " +
      "SELECT CONCAT(id,startSummaryDate) AS id,'ส่งสรุปชาร์ต' AS action, startSummaryDate AS datetime, startSummaryBy AS staffName  " +
      "FROM tbl_chart c " +
      "WHERE an = ? " +
      "AND startSummaryDate IS NOT NULL " +
      "UNION " +
      "SELECT CONCAT(id,returnSummaryDate) AS id,'รับคืนสรุปชาร์ต' AS action, returnSummaryDate AS datetime, returnSummaryBy AS staffName " +
      "FROM tbl_chart c " +
      "WHERE an = ? " +
      "AND returnSummaryDate IS NOT NULL " +
      "UNION " +
      "SELECT CONCAT(id,reauditDate) AS id,'ส่งรีออดิทชาร์ต' AS action, reauditDate AS datetime, reauditBy AS staffName " +
      "FROM tbl_chart c " +
      "WHERE an = ? " +
      "AND reauditDate IS NOT NULL " +
      "UNION " +
      "SELECT CONCAT(id,datetime) AS id,action, datetime, staffName " +
      "FROM tbl_chart_log " +
      "WHERE an = ? " +
      "ORDER BY datetime DESC";
    connection_server.query(
      mysql,
      [an, an, an, an, an],
      (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        res.status(200).json(results);
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

router.get("/summary-chart", (req, res) => {
  try {
    const mysql =
      "SELECT COUNT(*) AS TOTAL_CHART, c.doctorCode, doctorName, registerDate " +
      "FROM tbl_chart c " +
      "LEFT JOIN tbl_doctor d ON d.doctorCode = c.doctorCode " +
      "WHERE startSummaryDate IS NULL " +
      "GROUP BY doctorName " +
      "ORDER BY doctorName ";
    connection_server.query(mysql, (err, results, fields) => {
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

router.get("/summary-chart/:staffName", (req, res) => {
  const today = moment().format("YYYY-MM-DD") + "%";
  const staffName = req.params.staffName;
  try {
    const mysql =
      "SELECT * " +
      "FROM tbl_chart c " +
      "LEFT JOIN tbl_ward w ON w.wardCode = c.wardCode " +
      "WHERE startSummaryDate LIKE ? " +
      "AND startSummaryBy = ? " +
      "ORDER BY startSummaryDate DESC";
    connection_server.query(mysql, [today, staffName], (err, results, fields) => {
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

router.get("/return-chart/:staffName", (req, res) => {
  const today = moment().format("YYYY-MM-DD") + "%";
  const staffName = req.params.staffName;

  try {
    const mysql =
      "SELECT * " +
      "FROM tbl_chart c " +
      "LEFT JOIN tbl_ward w ON w.wardCode = c.wardCode " +
      "WHERE returnSummaryDate LIKE ? " +
      "AND returnSummaryBy = ? " +
      "ORDER BY returnSummaryDate DESC";
    connection_server.query(
      mysql,
      [today, staffName],
      (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        // console.log(results);
        res.status(200).json(results);
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

router.get("/summary-return-chart/:staffName", (req, res) => {
  const datetime = moment().format("YYYY-MM-DD") + "%";
  const staffName = req.params.staffName;

  try {
    const mysql =
      "SELECT * " +
      "FROM tbl_chart c " +
      "LEFT JOIN tbl_ward w ON w.wardCode = c.wardCode " +
      "WHERE returnSummaryDate LIKE ? " +
      "AND returnSummaryBy = ? " +
      "ORDER BY returnSummaryDate ";
    connection_server.query(
      mysql,
      [datetime, staffName],
      (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        // console.log(results);
        res.status(200).json(results);
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

router.get("/audit-chart", (req, res) => {
  const today = moment().format("YYYY-MM-DD") + "%";
  try {
    const mysql =
      "SELECT * " +
      "FROM tbl_chart c " +
      "LEFT JOIN tbl_ward w ON w.wardCode = c.wardCode " +
      "WHERE returnAuditDate LIKE ? " +
      "AND returnSummaryDate NOT LIKE ? " +
      "ORDER BY returnAuditDate DESC ";
    connection_server.query(mysql, [today, today], (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(400).send();
      }
      // console.log(results);
      res.status(200).json(results);
    });
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
      "SELECT * " +
      "FROM tbl_chart c " +
      "LEFT JOIN tbl_ward w ON w.wardCode = c.wardCode " +
      "WHERE reauditBy = ? " +
      "AND reauditDate LIKE ? " +
      "ORDER BY reauditDate ";
    connection_server.query(
      mysql,
      [staffName, today],
      (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        // console.log(results);
        res.status(200).json(results);
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

router.get("/pttype-eclaim", (req, res) => {
  try {
    const mysql = "SELECT * FROM tbl_main_pttype ";
    connection_server.query(mysql, (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(400).send();
      }
      // console.log(results);
      res.status(200).json(results);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

router.get("/stat-new-chart", (req, res) => {
  try {
    const mysql =
      "SELECT * " +
      "FROM tbl_chart c " +
      "LEFT JOIN tbl_ward w ON w.wardCode = c.wardCode " +
      "WHERE startSummaryDate IS NULL " +
      "ORDER BY registerDate DESC " +
      "LIMIT 10";
    connection_server.query(mysql, (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(400).send();
      }
      // console.log(results);
      res.status(200).json(results);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

router.get("/stock-folder", (req, res) => {
  try {
    const mysql =
      "SELECT *, " +
      "(SELECT COUNT(*) FROM tbl_chart c WHERE c.folderId = f.folderId) AS totalCharts " +
      "FROM tbl_folder f " +
      "LEFT JOIN tbl_stock s ON s.stockId = f.stockId " +
      "ORDER BY folderLabel DESC " +
      "LIMIT 10";
    connection_server.query(mysql, (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(400).send();
      }
      // console.log(results);
      res.status(200).json(results);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

router.get("/stock-folder/:folderId", (req, res) => {
  const folderId = req.params.folderId;
  try {
    const mysql =
      "SELECT * " +
      "FROM tbl_folder f " +
      "LEFT JOIN tbl_stock s ON s.stockId = f.stockId " +
      "LEFT JOIN tbl_chart c ON c.folderId = f.folderId " +
      "WHERE f.folderId = ? " +
      "ORDER BY stockDate DESC ";
    connection_server.query(mysql, folderId, (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(400).send();
      }
      // console.log(results);
      res.status(200).json(results);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

router.post("/stock-folder/", chartFolderInfo, (req, res, next) => {
  const { stockId, staffName } = req.body;
  const datetime = moment().format("YYYY-MM-DD H:mm:ss");
  const maxChart = 100;
  if (req.totalCharts < 99) {
    return res.status(200).json({
      status: "fail",
      message:
        "เพิ่มข้อมูลโฟลเดอร์ใหม่ล้มเหลว คุณยังมีพื้นที่เก็บชาร์ตในโฟลเดอร์เก่าอีก!",
    });
  } else {
    try {
      const folderLabel = req.folderLabel.substring(6);
      moment.locale("th");
      const thYear = moment().add(543, "year").format("L");
      const newFolderNo = parseInt(folderLabel) + 1;
      function addLeadingZeros(num, totalLength) {
        return String(num).padStart(totalLength, "0");
      }
      const yearLabel = thYear.substring(8);
      const monthLabel = thYear.substring(3, 5);
      const newFolderLabel =
        yearLabel + "-" + monthLabel + "-" + addLeadingZeros(newFolderNo, 3);
      console.log("newFolderLabel : " + newFolderLabel);
      connection_server.query(
        "INSERT INTO tbl_folder(folderLabel, stockId, maxChart, createdAt, createdBy) VALUES (?,?,?,?,?)",
        [newFolderLabel, stockId, maxChart, datetime, staffName],
        (err, results, fields) => {
          if (err) {
            console.log(
              "Error while inserting a stock folder into database!",
              err
            );
            return res.status(400).send();
          }
          //   console.log(results);
          return res.status(200).json({
            status: "success",
            message: "เพิ่มข้อมูลโฟลเดอร์ใหม่เรียบร้อยแล้ว!",
          });
        }
      );
    } catch (err) {
      console.log(err);
      return res.status(500).send();
    }
  }
});

router.put(
  "/stock-chart/:folderId",
  chartFolderQuantityInfo,
  body("an").custom((value, { req }) => {
    return new Promise((resolve, reject) => {
      const an = req.body.an;
      connection_server.query(
        "SELECT * FROM tbl_chart WHERE stockDate IS NOT NULL AND an = ? ",
        [an],
        (err, res) => {
          if (err) {
            reject(new Error("Server Error"));
          }
          if (res.length > 0) {
            reject(new Error("AN ซ้ำ กรุณาสแกนชาร์ตถัดไป!"));
          }
          resolve(true);
        }
      );
    });
  }),
  (req, res, next) => {
    const folderId = req.params.folderId;
    const { an, staffName } = req.body;
    const datetime = moment().format("YYYY-MM-DD H:mm:ss");
    if (req.totalCharts > 100) {
      return res.status(200).json({
        status: "error",
        message: "เพิ่มชาร์ตในโฟลเดอร์ใหม่ล้มเหลว คุณชาร์ตครบจำนวนสูงสุดแล้ว!",
      });
    } else {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // return res.status(400).json({
        //   errors: errors.array(),
        // });
        return res.status(400).json({
          status: "error",
          message: "AN ซ้ำ กรุณาสแกนชาร์ตถัดไป!",
        });
      }
      try {
        connection_server.query(
          "UPDATE tbl_chart SET folderId = ?, stockDate = ?, stockedBy = ? " +
          "WHERE an = ? ",
          [folderId, datetime, staffName, an],
          (err, results, fields) => {
            if (err) {
              console.log(
                "Error while updating return summary in database!",
                err
              );
              return res.status(400).send();
            }
            // console.log(results);

            return res.status(200).json({
              status: "success",
              message: "บันทึกข้อมูลการรับคืนชาร์ตจากงาน e-claimเรียบร้อยแล้ว!",
            });
          }
        );
      } catch (err) {
        console.log(err);
        return res.status(500).send();
      }
    }
  }
);

router.post(
  "/upload",
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
            reject(new Error("AN ซ้ำ กรุณาสแกนชาร์ตถัดไป!"));
          }
          resolve(true);
        }
      );
    });
  }),
  async (req, res) => {
    const { an, staffName } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      const mysql =
        'SELECT i.an, i.hn, CONCAT(p.pname,p.fname," ", p.lname) AS ptName, DATE_FORMAT(i.regdate, "%Y-%m-%d") AS admitDate, i.regtime AS admitTime, ' +
        'IF(i.dchdate,DATE_FORMAT(i.dchdate, "%Y-%m-%d"),NULL) AS dischargeDate , i.dchtime AS dischargeTime, CONCAT(d.pname,d.fname," ", d.lname) AS dischargeDoctor, ' +
        "i.dchstts As dischargeStatusCode, i.dchtype AS dischargeTypeCode, i.rfrocs AS referCauseCode, i.rfrolct AS referHospitalCode, i.pttype AS pttypeCode, DATEDIFF(i.dchdate,i.regdate) AS admitDuration, " +
        "income AS totalMedicalFee, birthday AS birthDate, " +
        "i.ward AS wardCode, dch_doctor AS doctorCode " +
        "FROM ipt i " +
        "LEFT JOIN dchstts ds ON ds.dchstts = i.dchstts " +
        "LEFT JOIN dchtype dt ON dt.dchtype = i.dchtype " +
        "LEFT JOIN rfrcs rs ON rs.rfrcs = i.rfrocs " +
        "LEFT JOIN patient p ON p.hn = i.hn " +
        "LEFT JOIN doctor d ON d.code = i.dch_doctor " +
        "LEFT OUTER JOIN an_stat a ON a.an = i.an " +
        "WHERE i.an = ?";
      // const mysql = "SELECT * FROM ipt i WHERE i.an = ?";
      connection_local.query("SET NAMES UTF8");
      connection_local.query(mysql, [an], (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        const datetime = moment().format("YYYY-MM-DD H:mm:ss");
        const today = moment().format("YYYY-MM-DD");
        // console.log(datetime);
        const registerBy = staffName;
        console.log(results);

        if (results.length === 0) {
          return res.status(404).json({
            status: "fail",
            message: "ไม่พบข้อมูล AN ในระบบ!",
          });
        } else {
          for (var i = 0; i < results.length; i++) {
            // console.log(results);
            // registerDueDate //dischargedate + 2 days
            // registerDuration  // today - dischargedate
            // finishDueDate //get last date of next month
            // registerDueStatus //if registerDuration <= 2 return 1 else 2

            const registerDueDate = moment(results[i]["dischargeDate"])
              .add(2, "days")
              .format("YYYY-MM-DD");
            console.log(registerDueDate);

            const completingDueDate = moment(today)
              .add(3, "days")
              .format("YYYY-MM-DD");
            console.log(completingDueDate);

            const finishDueDate = moment()
              .add(1, "months")
              .endOf("month")
              .format("YYYY-MM-DD");
            console.log(finishDueDate);

            const registerDuration = moment(moment(today)).diff(
              results[i]["dischargeDate"],
              "days"
            );
            console.log(registerDuration);

            const registerDueStatus = registerDuration <= 2 ? 1 : 2;
            console.log(registerDueStatus);
            console.log(results[i]["ptName"]);
            try {
              connection_server.query(
                "INSERT INTO tbl_chart(an, hn, ptName, admitDate, admitTime, dischargeDate, dischargeTime, " +
                "doctorCode, dischargeDoctor, wardCode, dischargeStatusCode, dischargeTypeCode, referCauseCode, " +
                "referHospitalCode,pttypeCode, admitDuration, birthDate, totalMedicalFee, registerDate, registerBy, registerDueDate, registerDuration, " +
                "registerDueStatus, completingDueDate, finishDueDate) " +
                "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                [
                  results[i]["an"],
                  results[i]["hn"],
                  results[i]["ptName"],
                  moment(results[i]["admitDate"]).format("YYYY-MM-DD"),
                  results[i]["admitTime"],
                  // moment(results[i]["dischargeDate"]).format("YYYY-MM-DD"),
                  results[i]["dischargeDate"],
                  results[i]["dischargeTime"],
                  results[i]["doctorCode"],
                  results[i]["dischargeDoctor"],
                  results[i]["wardCode"],
                  results[i]["dischargeStatusCode"],
                  results[i]["dischargeTypeCode"],
                  results[i]["referCauseCode"],
                  results[i]["referHospitalCode"],
                  results[i]["pttypeCode"],
                  results[i]["admitDuration"],
                  results[i]["birthDate"],
                  results[i]["totalMedicalFee"],
                  datetime,
                  registerBy,
                  registerDueDate,
                  registerDuration,
                  registerDueStatus,
                  completingDueDate,
                  finishDueDate,
                ],
                (err, results, fields) => {
                  if (err) {
                    console.log(
                      "Error while inserting a AN into database!",
                      err
                    );
                    return res.status(400).send();
                  }
                  //   console.log(results);
                  return res.status(201).json({
                    status: "success",
                    message: "เพิ่มข้อมูลชาร์ตผู้ป่วยเรียบร้อยแล้ว!",
                  });
                }
              );
            } catch (err) {
              console.log(err);
              return res.status(500).send();
            }
          }
        }
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send();
    }
  }
);

// router.put("/summary-chart/:doctorCode", async (req, res) => {
//   const doctorCode = req.params.doctorCode;
//   try {
//     const mysql =
//       "SELECT * " +
//       "FROM tbl_chart c " +
//       "LEFT JOIN tbl_ward w ON w.wardCode = c.wardCode " +
//       "LEFT JOIN tbl_discharge_status ds ON ds.dischargeStatusCode = c.dischargeStatusCode " +
//       "LEFT JOIN tbl_discharge_type dt ON dt.dischargeTypeCode = c.dischargeTypeCode " +
//       "LEFT JOIN tbl_pttype pt ON pt.pttypeCode = c.pttypeCode " +
//       "LEFT JOIN tbl_refer_cause rc ON rc.referCauseCode = c.referCauseCode " +
//       "LEFT JOIN tbl_refer_hospital rh ON rh.referHospitalCode = c.referHospitalCode " +
//       "WHERE startSummaryDate IS NULL " +
//       "AND doctorCode = ? " +
//       "GROUP BY doctorCode ";
//     connection_server.query(mysql, [doctorCode], (err, results, fields) => {
//       if (err) {
//         console.log(err);
//         return res.status(400).send();
//       }

//       const registerDate = moment(results[0].registerDate).format(
//         "YYYY-MM-DD HH:mm:ss"
//       );

//       const startSummaryDate = moment().format("YYYY-MM-DD HH:mm:ss");
//       const startSummaryBy = req.body.staffName;
//       const completingChartDuration = moment(startSummaryDate).diff(
//         moment(registerDate),
//         "days"
//       );
//       const returnSummaryDueDate = moment(startSummaryDate)
//         .add(5, "days")
//         .format("YYYY-MM-DD");
//       const today = moment().format("YYYY-MM-DD");
//       const completingDueDate = moment(today)
//         .add(3, "days")
//         .format("YYYY-MM-DD");
//       // console.log(completingDueDate);

//       const completingChartStatus = completingChartDuration <= 2 ? 1 : 2;

//       try {
//         connection_server.query(
//           "UPDATE tbl_chart SET startSummaryDate = ?, returnSummaryDueDate = ?, startSummaryBy = ?, completingDueDate = ?, completingChartDuration = ?, completingChartStatus = ? " +
//             "WHERE startSummaryDate IS NULL AND doctorCode = ?",
//           [
//             startSummaryDate,
//             returnSummaryDueDate,
//             startSummaryBy,
//             completingDueDate,
//             completingChartDuration,
//             completingChartStatus,
//             doctorCode,
//           ],
//           (err, results, fields) => {
//             if (err) {
//               console.log(
//                 "Error while updating submit summary in database!",
//                 err
//               );
//               return res.status(400).send();
//             }
//             // console.log(results);

//             return res.status(200).json({
//               status: "success",
//               message: "บันทึกข้อมูลการส่งสรุปชาร์ตเรียบร้อยแล้ว!",
//             });
//           }
//         );
//       } catch (err) {
//         console.log(err);
//         return res.status(500).send();
//       }
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).send();
//   }
// });
router.put("/summary-chart/:an", async (req, res) => {
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
      "WHERE startSummaryDate IS NULL " +
      "AND c.an = ? ";
    connection_server.query(mysql, [an], (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(400).send();
      }

      const registerDate = moment(results[0].registerDate).format(
        "YYYY-MM-DD HH:mm:ss"
      );

      const startSummaryDate = moment().format("YYYY-MM-DD HH:mm:ss");
      const startSummaryBy = req.body.staffName;
      const completingChartDuration = moment(startSummaryDate).diff(
        moment(registerDate),
        "days"
      );
      const returnSummaryDueDate = moment(startSummaryDate)
        .add(5, "days")
        .format("YYYY-MM-DD");
      const today = moment().format("YYYY-MM-DD");
      const completingDueDate = moment(today)
        .add(3, "days")
        .format("YYYY-MM-DD");
      // console.log(completingDueDate);

      const completingChartStatus = completingChartDuration <= 2 ? 1 : 2;

      try {
        connection_server.query(
          "UPDATE tbl_chart SET startSummaryDate = ?, returnSummaryDueDate = ?, startSummaryBy = ?, completingDueDate = ?, completingChartDuration = ?, completingChartStatus = ? " +
          "WHERE startSummaryDate IS NULL AND an = ?",
          [
            startSummaryDate,
            returnSummaryDueDate,
            startSummaryBy,
            completingDueDate,
            completingChartDuration,
            completingChartStatus,
            an,
          ],
          (err, results, fields) => {
            if (err) {
              console.log(
                "Error while updating submit summary in database!",
                err
              );
              return res.status(400).send();
            }
            // console.log(results);

            return res.status(200).json({
              status: "success",
              message: "บันทึกข้อมูลการส่งสรุปชาร์ตเรียบร้อยแล้ว!",
            });
          }
        );
      } catch (err) {
        console.log(err);
        return res.status(500).send();
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

router.put(
  "/summary-return-chart/:an",
  chartInfo,
  body("an").custom((value, { req }) => {
    return new Promise((resolve, reject) => {
      const an = req.body.an;
      connection_server.query(
        "SELECT * FROM tbl_chart WHERE startSummaryDate IS NOT NULL AND returnSummaryDate IS NOT NULL AND an = ? ",
        [an],
        (err, res) => {
          if (err) {
            reject(new Error("Server Error"));
          }
          if (res.length > 0) {
            reject(new Error("AN ซ้ำ กรุณาสแกนชาร์ตถัดไป!"));
          }
          resolve(true);
        }
      );
    });
  }),
  async (req, res) => {
    const an = req.params.an;
    const registerDate = moment(req.registerDate).format("YYYY-MM-DD HH:mm:ss");

    const startSummaryDate = moment().format("YYYY-MM-DD HH:mm:ss");
    const staffName = req.body.staffName;
    const completingChartDuration = moment(startSummaryDate).diff(
      moment(registerDate),
      "days"
    );
    const returnSummaryDueDate = moment(startSummaryDate)
      .add(5, "days")
      .format("YYYY-MM-DD");

    const completingChartStatus = completingChartDuration <= 2 ? 1 : 2;

    const returnSummaryDate = moment().format("YYYY-MM-DD HH:mm:ss");
    const summaryDuration = moment(returnSummaryDate).diff(
      moment(returnSummaryDueDate),
      "days"
    );
    console.log(returnSummaryDueDate);
    console.log(returnSummaryDate);
    console.log(summaryDuration);
    const returnSummaryDueStatus = summaryDuration > 5 ? 2 : 1;
    const returnAuditDueDate = moment(returnSummaryDate)
      .add(5, "days")
      .format("YYYY-MM-DD");

    const returnAuditBy = req.body.staffName;
    const returnAuditDate = moment().format("YYYY-MM-DD HH:mm:ss");
    const auditDuration = moment(returnAuditDate).diff(
      moment(returnSummaryDate),
      "days"
    );
    const returnAuditDueStatus = auditDuration > 5 ? 2 : 1;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
      // return res.status(400).json({
      //   status: "error",
      //   message: "AN ซ้ำ กรุณาสแกนชาร์ตถัดไป!",
      // });
    }
    try {
      const mysql =
        "UPDATE tbl_chart SET startSummaryDate = ?, returnSummaryDueDate = ?, startSummaryBy = ?, completingChartDuration = ?, completingChartStatus = ?, " +
        "returnSummaryDate = ?, returnSummaryBy = ?, summaryDuration = ?, returnSummaryDueStatus = ?, returnAuditDueDate = ?, " +
        "returnAuditDate = ?, returnAuditBy = ?, auditDuration = ?, returnAuditDueStatus = ? " +
        "WHERE an = ?";
      connection_server.query(
        mysql,
        [
          startSummaryDate,
          returnSummaryDueDate,
          staffName,
          completingChartDuration,
          completingChartStatus,
          returnSummaryDate,
          staffName,
          summaryDuration,
          returnSummaryDueStatus,
          returnAuditDueDate,
          returnAuditDate,
          returnAuditBy,
          auditDuration,
          returnAuditDueStatus,
          an,
        ],
        (err, results, fields) => {
          if (err) {
            console.log(
              "Error while updating return summary in database!",
              err
            );
            return res.status(400).send();
          }
          // console.log(results);

          return res.status(200).json({
            status: "success",
            message: "บันทึกข้อมูลการรับสรุปชาร์ตคืนเรียบร้อยแล้ว!",
          });
        }
      );
    } catch (err) {
      console.log(err);
      return res.status(500).send();
    }
  }
);

router.put(
  "/return-chart/:an",
  chartInfo,
  body("an").custom((value, { req }) => {
    return new Promise((resolve, reject) => {
      const an = req.body.an;
      connection_server.query(
        "SELECT * FROM tbl_chart WHERE startSummaryDate IS NOT NULL AND returnSummaryDate IS NOT NULL AND an = ? ",
        [an],
        (err, res) => {
          if (err) {
            reject(new Error("Server Error"));
          }
          if (res.length > 0) {
            reject(new Error("AN ซ้ำ กรุณาสแกนชาร์ตถัดไป!"));
          }
          resolve(true);
        }
      );
    });
  }),
  async (req, res) => {
    const an = req.params.an;
    const { staffName } = req.body;
    const returnSummaryDueDate = moment(req.returnSummaryDueDate).format(
      "YYYY-MM-DD"
    );
    // const startSummaryDate = moment(req.body.date).format("YYYY-MM-DD");
    // const returnedSummaryBy = req.body.staffName;
    const returnSummaryDate = moment().format("YYYY-MM-DD H:mm:ss");
    const summaryDuration = moment(returnSummaryDate).diff(
      moment(returnSummaryDueDate),
      "days"
    );
    console.log(returnSummaryDueDate);
    console.log(returnSummaryDate);
    console.log(summaryDuration);
    const returnSummaryDueStatus = summaryDuration > 5 ? 2 : 1;
    const returnAuditDueDate = moment(returnSummaryDate)
      .add(5, "days")
      .format("YYYY-MM-DD");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
      // return res.status(400).json({
      //   status: "error",
      //   message: "AN ซ้ำ กรุณาสแกนชาร์ตถัดไป!",
      // });
    }
    try {
      connection_server.query(
        "UPDATE tbl_chart SET returnSummaryDate = ?, returnSummaryBy = ?, summaryDuration = ?, returnSummaryDueStatus = ?, returnAuditDueDate = ? " +
        "WHERE an = ? ",
        [
          returnSummaryDate,
          staffName,
          summaryDuration,
          returnSummaryDueStatus,
          returnAuditDueDate,
          an,
        ],
        (err, results, fields) => {
          if (err) {
            console.log(
              "Error while updating return summary in database!",
              err
            );
            return res.status(400).send();
          }
          // console.log(results);

          return res.status(200).json({
            status: "success",
            message: "บันทึกข้อมูลการรับสรุปชาร์ตคืนเรียบร้อยแล้ว!",
          });
        }
      );
    } catch (err) {
      console.log(err);
      return res.status(500).send();
    }
  }
);

// router.put("/audit-chart/:an/:staffName/:date", async (req, res) => {
router.put(
  "/audit-chart/:an",
  chartInfo,
  body("an").custom((value, { req }) => {
    return new Promise((resolve, reject) => {
      const an = req.body.an;
      connection_server.query(
        "SELECT * FROM tbl_chart WHERE returnAuditDate IS NOT NULL AND an = ? ",
        [an],
        (err, res) => {
          if (err) {
            reject(new Error("Server Error"));
          }
          if (res.length > 0) {
            reject(new Error("AN ซ้ำ กรุณาสแกนชาร์ตถัดไป!"));
          }
          resolve(true);
        }
      );
    });
  }),
  async (req, res) => {
    const an = req.params.an;
    console.log("audit-chart : " + an);

    const returnSummaryDate = moment(req.returnSummaryDate).format(
      "YYYY-MM-DD"
    );
    const returnAuditBy = req.body.staffName;
    const returnAuditDate = moment().format("YYYY-MM-DD H:mm:ss");
    const auditDuration = moment(returnAuditDate).diff(
      moment(returnSummaryDate),
      "days"
    );
    const returnAuditDueStatus = auditDuration > 5 ? 2 : 1;
    const codeDueDate = moment(returnAuditDate)
      .add(4, "days")
      .format("YYYY-MM-DD");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      connection_server.query(
        "UPDATE tbl_chart SET returnAuditDate = ?, returnAuditBy = ?, auditDuration = ?, returnAuditDueStatus = ?, codeDueDate = ? " +
        "WHERE an = ? ",
        [
          returnAuditDate,
          returnAuditBy,
          auditDuration,
          returnAuditDueStatus,
          codeDueDate,
          an,
        ],
        (err, results, fields) => {
          if (err) {
            console.log(
              "Error while updating return summary in database!",
              err
            );
            return res.status(400).send();
          }
          // console.log(results);

          return res.status(200).json({
            status: "success",
            message: "บันทึกข้อมูลการรับออร์ดิตชาร์ตคืนเรียบร้อยแล้ว!",
          });
        }
      );
    } catch (err) {
      console.log(err);
      return res.status(500).send();
    }
  }
);

router.put(
  "/reaudit-chart/:an",
  body("an").custom((value, { req }) => {
    return new Promise((resolve, reject) => {
      const an = req.body.an;
      connection_server.query(
        "SELECT * FROM tbl_chart WHERE reauditDate IS NOT NULL AND an = ? ",
        [an],
        (err, res) => {
          if (err) {
            reject(new Error("Server Error"));
          }
          if (res.length > 0) {
            reject(new Error("AN ซ้ำ กรุณาสแกนชาร์ตถัดไป!"));
          }
          resolve(true);
        }
      );
    });
  }),
  async (req, res) => {
    const an = req.params.an;
    const reauditBy = req.body.staffName;
    const reauditDate = moment().format("YYYY-MM-DD HH:mm:ss");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      connection_server.query(
        "UPDATE tbl_chart SET  reauditDate = ?, reauditBy = ?  " +
        "WHERE an = ?",
        [reauditDate, reauditBy, an],
        (err, results, fields) => {
          if (err) {
            console.log(
              "Error while updating return summary in database!",
              err
            );
            return res.status(400).send();
          }
          // console.log(results);

          return res.status(200).json({
            status: "success",
            message: "บันทึกข้อมูลการ reaudit ชาร์ตคืนเรียบร้อยแล้ว!",
          });
        }
      );
    } catch (err) {
      console.log(err);
      return res.status(500).send();
    }
  }
);

router.get("/submit-eclaim", (req, res) => {
  const today = moment().format("YYYY-MM-DD") + "%";
  try {
    const mysql =
      "SELECT * " +
      "FROM tbl_chart c " +
      "LEFT JOIN tbl_pttype p ON p.pttypeCode = c.pttypeCode " +
      "LEFT JOIN tbl_main_pttype m ON m.mainPttypeId = p.mainPttypeId " +
      "LEFT JOIN tbl_ward w ON w.wardCode = c.wardCode " +
      "WHERE startEclaimDate LIKE ? " +
      "ORDER BY startEclaimDate DESC " +
      "LIMIT 10";
    connection_server.query(mysql, today, (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(400).send();
      }
      // console.log(results);
      res.status(200).json(results);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

router.put(
  "/submit-eclaim/:an",
  chartInfo,
  body("an").custom((value, { req }) => {
    return new Promise((resolve, reject) => {
      const an = req.body.an;
      connection_server.query(
        "SELECT * FROM tbl_chart WHERE startEclaimDate IS NOT NULL AND an = ? ",
        [an],
        (err, res) => {
          if (err) {
            reject(new Error("Server Error"));
          }
          if (res.length > 0) {
            reject(new Error("AN ซ้ำ กรุณาสแกนชาร์ตถัดไป!"));
          }
          resolve(true);
        }
      );
    });
  }),
  async (req, res) => {
    const an = req.params.an;
    const startEclaimDate = moment().format("YYYY-MM-DD HH:mm:ss");
    const startEclaimBy = req.body.staffName;
    const codeDuration = moment(req.returnAuditDate).diff(
      moment(startEclaimDate),
      "days"
    );
    const codeDueStatus = codeDuration > 4 ? 2 : 1;
    const returnEclaimDueDate = moment(startEclaimDate)
      .add(2, "days")
      .format("YYYY-MM-DD");
    const finishDueDate = moment(req.finishDueDate).format("YYYY-MM-DD");

    let finishDuration = moment(returnEclaimDueDate).diff(
      moment(finishDueDate),
      "days"
    );
    console.log(isNaN(finishDuration));
    let finishDueStatus;
    if (isNaN(finishDuration)) {
      finishDuration = 0;
    }
    finishDueStatus = finishDuration > 30 ? 2 : 1;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({
      //   errors: errors.array(),
      // });
      return res.status(400).json({
        status: "error",
        message: "AN ซ้ำ กรุณาสแกนชาร์ตถัดไป!",
      });
    }
    try {
      connection_server.query(
        "UPDATE tbl_chart SET startEclaimDate = ?, startEclaimBy = ?, codeDuration = ?, codeDueStatus = ?, returnEclaimDueDate = ?, finishDuration = ?, finishDueStatus = ? " +
        "WHERE an = ?",
        [
          startEclaimDate,
          startEclaimBy,
          codeDuration,
          codeDueStatus,
          returnEclaimDueDate,
          finishDuration,
          finishDueStatus,
          an,
        ],
        (err, results, fields) => {
          // console.log(err.sqlMessage);
          if (err) {
            console.log(err);
            return res.status(400).json({
              status: "error",
              message:
                "Update query error!, please contact administrator. Error Code : " +
                err.sqlMessage,
            });
          }

          // console.log(results);
          // console.log(fields);
          else if (results.affectedRows > 0) {
            return res.status(201).json({
              status: "success",
              message: "บันทึกข้อมูลการส่งชาร์ตงาน e-claim เรียบร้อยแล้ว!",
            });
          }
        }
      );
    } catch (err) {
      // console.log(err);
      return res.status(500).send();
    }
  }
);

router.get("/return-eclaim", (req, res) => {
  const today = moment().format("YYYY-MM-DD") + "%";
  try {
    const mysql =
      "SELECT *" +
      "FROM tbl_chart c " +
      "LEFT JOIN tbl_pttype p ON p.pttypeCode = c.pttypeCode " +
      "LEFT JOIN tbl_main_pttype m ON m.mainPttypeId = p.mainPttypeId " +
      "LEFT JOIN tbl_ward w ON w.wardCode = c.wardCode " +
      "WHERE startEclaimDate IS NOT NULL " +
      "AND  returnEclaimDate LIKE ?" +
      "ORDER BY returnEclaimDate DESC " +
      "LIMIT 10";
    connection_server.query(mysql, today, (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(400).send();
      }
      // console.log(results);
      res.status(200).json(results);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

router.put(
  "/return-eclaim/:an",
  chartInfo,
  body("an").custom((value, { req }) => {
    return new Promise((resolve, reject) => {
      const an = req.body.an;
      connection_server.query(
        "SELECT * FROM tbl_chart WHERE returnEclaimDate IS NOT NULL AND an = ? ",
        [an],
        (err, res) => {
          if (err) {
            reject(new Error("Server Error"));
          }
          if (res.length > 0) {
            reject(new Error("AN ซ้ำ กรุณาสแกนชาร์ตถัดไป!"));
          }
          resolve(true);
        }
      );
    });
  }),
  async (req, res) => {
    const an = req.params.an;
    const returnEclaimBy = req.body.staffName;
    const startEclaimDate = moment(req.startEclaimDate).format("YYYY-MM-DD");
    const returnEclaimDate = moment().format("YYYY-MM-DD HH:mm:ss");
    const eclaimDuration = moment(returnEclaimDate).diff(
      moment(startEclaimDate),
      "days"
    );
    const returnEclaimDueStatus = eclaimDuration > 2 ? 2 : 1;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
      // return res.status(400).json({
      //   status: "error",
      //   message: "AN ซ้ำ กรุณาสแกนชาร์ตถัดไป!",
      // });
    }
    try {
      connection_server.query(
        "UPDATE tbl_chart SET returnEclaimDate = ?, startEclaimDate = ?, returnEclaimBy = ?, eclaimDuration = ?, returnEclaimDueStatus = ? " +
        "WHERE an = ? ",
        [
          returnEclaimDate,
          startEclaimDate,
          returnEclaimBy,

          eclaimDuration,
          returnEclaimDueStatus,
          an,
        ],
        (err, results, fields) => {
          if (err) {
            console.log(
              "Error while updating return summary in database!",
              err
            );
            return res.status(400).send();
          }
          // console.log(results);

          return res.status(200).json({
            status: "success",
            message: "บันทึกข้อมูลการรับคืนชาร์ตจากงาน e-claimเรียบร้อยแล้ว!",
          });
        }
      );
    } catch (err) {
      console.log(err);
      return res.status(500).send();
    }
  }
);

module.exports = router;
