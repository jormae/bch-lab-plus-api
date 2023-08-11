const express = require("express");
const connection_local = require("../config/database_connection");
const router = express.Router();
// const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");

const app = express();

router.get("/", (req, res) => {
    // res.send("account page!");
    try {
        const mysql =
            'SELECT * FROM account';
        connection_local.query(mysql, (err, results, fields) => {
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

router.get("/:date", async (req, res) => {
    const date = req.params.date;
    try {
        const mysql =
            'SELECT *, TIMESTAMPDIFF(YEAR, birth, ?) AS AGE, (SELECT diagcode FROM visitdiag d WHERE d.visitno = v.visitno AND dxtype = "01" LIMIT 1) AS diagcode ' +
            'FROM visit v ' +
            'LEFT JOIN person p ON v.pid = p.pid ' +
            'LEFT JOIN _tmpprename_code c ON p.prename = c.prenamecode ' +
            'LEFT JOIN cright r ON v.rightcode = r.rightcode ' +
            'WHERE visitdate = ? ' +
            'ORDER BY v.timestart';
        connection_local.query(mysql, [date, date], (err, results, fields) => {
            // console.log(results.length)
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            if (!results.length) {
                console.log(err);
                return res.status(400).json('Data is not existed!, please try again.');
            }
            res.status(200).json({ 'data': results });
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
});

router.post("/",
    body("idcard").custom((value, { req }) => {
        return new Promise((resolve, reject) => {
            const idcard = req.body.idcard;
            connection_local.query(
                "SELECT idcard FROM account WHERE idcard = ?",
                [idcard],
                (err, res) => {
                    if (err) {
                        reject(new Error("Server Error"));
                    }
                    if (res.length > 0) {
                        reject(new Error("idcard is existed, please try again!"));
                    }
                    resolve(true);
                }
            );
        });
    }),
    async (req, res) => {
        const { idcard, fullname } = req.body;
        console.log(req.body)
        // res.send(req.body)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                // success: false, message: "idcard is existed, please try again!"
            });
        }
        try {
            connection_local.query(
                "INSERT INTO account(idcard, fullname) VALUES (?,?)",
                [idcard, fullname],
                (err, results, fields) => {
                    if (err) {
                        console.log("Error while inserting a account into database!", err);
                        return res.status(400).send();
                    }
                    console.log(results);
                    return res
                        .status(201)
                        .json({ success: true, message: "New account is successfully inserted!" });
                }
            );
        } catch (err) {
            console.log(err);
            return res.status(500).send();
        }
    }
);

router.put("/:idcard", async (req, res) => {
    const idcard = req.params.idcard;
    const fullname = req.body.fullname;

    try {
        connection_local.query(
            "UPDATE account SET fullname = ? WHERE idcard = ?",
            [
                fullname,
                idcard,
            ],
            (err, results, fields) => {
                if (err) {
                    console.log("Error while updating account in database!", err);
                    return res.status(400).send();
                }
                // console.log(results);

                return res
                    .status(200)
                    .json({ message: "The account is successfully updated!" });
            }
        );
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
});

module.exports = router;
