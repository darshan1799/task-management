const express = require("express");

require("dotenv").config();

const app = express();
const cors = require("cors");

const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cors({ origin: [process.env.FRONTEND_URL], credentials: true }));
app.use(cookieParser());

const authRoutes = require("./routes/auth.routes");
const taskRoutes = require("./routes/task.routes");
const connection = require("./db/connect");

connection();

app.get("/", (req, res) => {
  res.status(200).json("Jay Mataji");
});

app.use("/api/auth", authRoutes);

app.use("/api", taskRoutes);

app.listen(2000, () => {
  console.log("server started on 2000");
});
