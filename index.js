const express = require("express");
const cors = require("cors");
const res = require("express/lib/response");
const authRouter = require("./routes/auth");
const accountRouter = require("./routes/accounts");
const userRouter = require("./routes/users");
// const dashboardRouter = require("./routes/dashboard");
// const iptRouter = require("./routes/ipt");
// const chartRouter = require("./routes/chart");
// const statRouter = require("./routes/stat");
// const utilsRouter = require("./routes/utils");
// const reportRouter = require("./routes/report");
// const exampleRouter = require("./routes/example");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Welcome to BACHO LAB PLUS api."));
app.use("/auth", authRouter);
app.use("/accounts", accountRouter);
app.use("/users", userRouter);
// app.use("/dashboard", dashboardRouter);
// app.use("/chart", chartRouter);
// app.use("/stat", statRouter);
// app.use("/utils", utilsRouter);
// app.use("/report", reportRouter);
// app.use("/example", exampleRouter);

// app.set("port", process.env.API_PORT);
app.set("port", 3305);
app.listen(app.get("port"), () => {
  console.log(`Start server at port ${app.get("port")}`);
});
