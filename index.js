const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require('mongoose');
const cors = require("cors");

// connect to db
mongoose.connect(
  process.env.DB_CONNECT,
  { useUnifiedTopology: true, useNewUrlParser: true }
);

// Import routes
const authRoutes = require("./routes/authentication");

// Middlewares
app.use(express.json());
app.use(cors());

// route Middlewares
app.use("/api/user", authRoutes);

app.listen(4000, () => console.log("server up and runing on port 4000!"));