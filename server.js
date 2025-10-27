/*******************************************************
 * CSE 340 – Assignment 1 (CSE Motors)
 * Minimal Express server using EJS + static assets
 *******************************************************/
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

/* Views (EJS) */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* Static files */
app.use(express.static(path.join(__dirname, "public")));

/* Routes */
const homeRoutes = require("./routes/index");   // <<< IMPORTANT
app.use("/", homeRoutes);                       // <<< THIS HANDLES "/"

/* Start server */
const port = Number(process.env.PORT) || 5500;
const host = process.env.HOST || "localhost";
console.log("ENV check ->", { PORT: process.env.PORT, HOST: process.env.HOST });

app.listen(port, host, () => {
  console.log(`app listening on http://${host}:${port}`);
});
