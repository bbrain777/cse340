// routes/index.js
const express = require("express");
const router = express.Router();

// GET /
router.get("/", (req, res) => {
  res.render("index", { pageTitle: "CSE Motors | Home" });
});

module.exports = router;
