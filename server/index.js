const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const noteRoutes = require("./routes/noteRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const keepAliveRoutes = require("./routes/keepAliveRoutes");
const startKeepAlive = require("./utils/keepAlive");

require("dotenv").config();

const PORT = process.env.PORT || 3001;

const app = express();

// app.use(
//   cors({
//     origin: "https://noteme-md.vercel.app",
//     credentials: true,
//   })
// );
app.use(cors());
app.use(bodyParser.json());

connectDB();

app.use(
  "/api",
  authRoutes,
  categoryRoutes,
  noteRoutes,
  uploadRoutes,
  keepAliveRoutes
);

startKeepAlive();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
