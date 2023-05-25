
var express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

router.get('/', async (req, res) => {
    // console.log('HI')
    // res.send({ 'msg': 'hello' });
    res.sendFile(__dirname + '/form.html');
});
router.post('/', function (req, res) {
    console.log(req.body);
    res.send(req.body);
    // res.send("Received your data!!");
});


module.exports = router;