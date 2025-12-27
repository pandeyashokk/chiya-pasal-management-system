const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const connectDatabase = require("./init/mongoDb");
const { errorHandler } = require("./middlewares/errorHandler");
const authRoute = require("./routes/authRoute");
const tableRoute = require("./routes/tableRoute");
const menuRoute = require("./routes/menuRoute");
const orderRoute = require("./routes/orderRoute");
const staffRoute = require("./routes/staffRoute");
const profileRoute = require("./routes/profileRoute");
const paymentRoute = require("./routes/paymentRoute");

//initialize app
const app = express();

//third party middlewares
app.use(express.json());
app.use(morgan("dev"));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//database connection
connectDatabase();

//api routes
app.use("/api/auth", authRoute);
app.use("/api/tables", tableRoute);
app.use("/api/menu", menuRoute);
app.use("/api/orders", orderRoute);
app.use("/api/staff", staffRoute);
app.use("/api/profile", profileRoute);
app.use("/api/payment", paymentRoute);

//error hanldling middleware
app.use(errorHandler);

module.exports = app;
