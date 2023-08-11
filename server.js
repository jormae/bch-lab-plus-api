const express = require("express");
const cors = require("cors");

const authRouter = require("./routes/auth");
const userRouter = require("./routes/users");
const visitRouter = require("./routes/visits");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Welcome to BACHO LAB PLUS api."));
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/visits", visitRouter);

app.set("port", process.env.API_PORT);
app.listen(app.get("port"), () => {
  console.log(`Start server at port ${app.get("port")}`);
});
