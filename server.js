// server.js  
const path = require("path");
const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5501;

// Controllers & Routes
const inventoryRoute = require("./routes/inventoryRoute");
const baseRoute = require("./routes/index");         
const utilities = require("./utilities");
const db = require("./database");

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static assets
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", baseRoute);          // home + any base pages
app.use("/inv", inventoryRoute);  // inventory: /inv/type/:id, /inv/detail/:id

// Optional DB health route
app.get("/health/db", async (req, res) => {
  try {
    const r = await db.query("SELECT NOW() AS now");
    res.send(`DB OK: ${r.rows[0].now}`);
  } catch (e) {
    res.status(500).send("DB FAIL: " + e.message);
  }
});

// ===============================
// Intentional 500 error test route
// ===============================
app.get("/error-test", (req, res, next) => {
  const err = new Error("Intentional 500 error for testing.");
  err.status = 500;
  next(err); // Pass to global error handler
});

// ===============================
// 404 Handler (Page Not Found)
// ===============================
app.use(async (req, res, next) => {
  try {
    const nav = await utilities.getNav();

    res.status(404).render("errors/error", {
      title: "404 Not Found",
      message: "The page you requested could not be found.",
      nav,
    });

  } catch (error) {
    next(error);
  }
});

// ===============================
// Global Error Handler (500, etc.)
// ===============================
app.use(async (err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  try {
    const nav = await utilities.getNav();

    res.status(err.status || 500).render("errors/error", {
      title: err.status === 404 ? "404 Not Found" : "Server Error",
      message: err.message || "An unexpected error occurred.",
      nav,
    });

  } catch (fail) {
    // If getNav() or render() fails
    res.status(err.status || 500).send("Server Error: " + err.message);
  }
});

// Start server
app.listen(PORT, () => {
  const env = process.env.NODE_ENV || "development";
  console.log(
    `ENV: ${env} DB URL ${process.env.DATABASE_URL ? "found" : "MISSING"}`
  );
  console.log(`Server running at http://localhost:${PORT}`);
});
