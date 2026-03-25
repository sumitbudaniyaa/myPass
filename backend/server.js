const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT;
const cors = require("cors");
app.use(cors());
app.use(express.json({ limit: "15mb" }));
const passport = require("passport");
require("./config/passport");
app.use(passport.initialize());

const connectDB = require("./config/db");

connectDB();

const adminAuth = require("./routes/adminAuth");
const event = require("./routes/eventRoute");
const userAuth = require("./routes/userAuth");
const userRoute = require("./routes/userRoute");
const scannerRoute = require("./routes/scannerRoute");
const companyRoute = require("./routes/companyRoutes");

app.use("/api/scannerRoute", scannerRoute);
app.use("/api/adminAuth", adminAuth);
app.use("/api/eventRoute", event);
app.use("/api/userAuth", userAuth);
app.use("/api/user", userRoute);
app.use("/api/company", companyRoute);

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
