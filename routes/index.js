// routes/index.js
const express = require("express")
const router = express.Router()
const baseController = require("../controllers/baseController")

router.get("/", baseController.buildHome)

// Intentional error route linked from footer
router.get("/cause-error", (req, res, next) => {
  const err = new Error("Intentional 500 error from footer link")
  err.status = 500
  next(err)
})

module.exports = router
