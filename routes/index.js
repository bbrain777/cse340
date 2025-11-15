// routes/index.js
const express = require("express");
const router = express.Router();
const baseController = require("../controllers/baseController");

// Home page (use your existing controller)
router.get("/", baseController.buildHome);

// Week 3: intentional error route for footer link
router.get("/cause-error", (req, res, next) => {
  const err = new Error("Intentional Test Error for Week 3.");
  err.status = 500;
  next(err); // Pass to error middleware
});

module.exports = router;
