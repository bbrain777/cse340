/*******************************************************
 * CSE 340 – Week 1 (CSE Motors)
 * Minimal Express server using EJS + static assets
 *******************************************************/
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");

// Load .env
dotenv.config();

const app = express();

// Views (EJS)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Routes (home)
const homeRoutes = require("./routes/index");
app.use("/", homeRoutes);

// Server
const port = Number(process.env.PORT) || 5500;
const host = process.env.HOST || "localhost";
app.listen(port, host, () => {
  console.log(`app listening on http://${host}:${port}`);
});
