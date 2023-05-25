const express = require("express");
const connection_local = require("../config/database_local");
// const connection_local = require("../config/database_server");
const router = express.Router();
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");

const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser);
// app.use(bodyParser.json()); //Make sure u have added this line
// app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


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

router.get("/:idcard", async (req, res) => {
    const idcard = req.params.idcard;
    try {
        const mysql =
            'SELECT * FROM account WHERE idcard = ?';
        connection_local.query(mysql, [idcard], (err, results, fields) => {
            // console.log(results.length)
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            if (!results.length) {
                console.log(err);
                return res.status(400).json('Data is not existed!, please try again.');
            }
            res.status(200).json(results);
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
});

router.post("/", async (req, res) => {
    const idcard = req.body.idcard;
    const fullname = req.body.fullname;
    // const { idcard, fullname } = req.body;
    // console.log(req.body)
    res.send({
        // 'idcard': idcard,
        'fullname': fullname,
        'idcard': idcard
    });
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({
    //         errors: errors.array(),
    //     });
    // }
    // try {
    //     connection_local.query(
    //         "INSERT INTO account(idcard, fullname) VALUES (?,?)",
    //         [idcard, fullname],
    //         (err, results, fields) => {
    //             if (err) {
    //                 console.log("Error while inserting a account into database!", err);
    //                 return res.status(400).send();
    //             }
    //             console.log(results);
    //             return res
    //                 .status(201)
    //                 .json({ message: "New account is successfully inserted!" });
    //         }
    //     );
    // } catch (err) {
    //     console.log(err);
    //     return res.status(500).send();
    // }
}
);
router.put("/:idcard", async (req, res) => {
    const idcard = req.params.idcard;
    const fullname = req.body.fullname;
    // console.log(idcard)
    // console.log('fullname = ' + fullname)
    // console.log(test)
    // console.log(req.body)
    // res.status(200).send();
    res.send({
        'idcard': idcard,
        'fullname': fullname,
        'body': req.body
    });
    // try {
    //     connection_local.query(
    //         "UPDATE account SET fullname = ? WHERE idcard = ?",
    //         [
    //             fullname,
    //             idcard,
    //         ],
    //         (err, results, fields) => {
    //             if (err) {
    //                 console.log("Error while updating account in database!", err);
    //                 return res.status(400).send();
    //             }
    //             // console.log(results);

    //             return res
    //                 .status(200)
    //                 .json({ message: "The account is successfully updated!" });
    //         }
    //     );
    // } catch (err) {
    //     console.log(err);
    //     return res.status(500).send();
    // }
});

module.exports = router;
