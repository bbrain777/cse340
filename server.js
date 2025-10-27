/*******************************************************
 * CSE 340 - Assignment 1
 * Minimal Express server for CSE Motors home page
 *******************************************************/
const path = require("path");
require("dotenv").config();
const express = require("express");
const app = express();

/* Show we're editing the right file/folder */
console.log("ENV check ->", { PORT: process.env.PORT, HOST: process.env.HOST });
console.log("__dirname ->", __dirname);

/* View engine + views folder */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* Static assets */
app.use(express.static(path.join(__dirname, "public")));

/* HOME ROUTE (this fixes 'Cannot GET /') */
app.get("/", (req, res) => {
  res.render("index", { pageTitle: "CSE Motors | Home" });
});

/* Start server */
const port = Number(process.env.PORT) || 5500;
const host = process.env.HOST || "localhost";
app.listen(port, host, () => {
  console.log(`app listening on http://${host}:${port}`);
});
