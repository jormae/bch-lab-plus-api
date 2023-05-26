const express = require("express");
const cors = require("cors");

const userRouter = require("./routes/users");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Welcome to BACHO LAB PLUS api."));
app.use("/users", userRouter);

// app.set("port", process.env.API_PORT);
app.set("port", 3305);
app.listen(app.get("port"), () => {
  console.log(`Start server at port ${app.get("port")}`);
});
