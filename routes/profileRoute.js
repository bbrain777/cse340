// routes/profileRoute.js
const express = require("express")
const router = express.Router()

const utilities = require("../utilities/")
const auth = require("../utilities/auth")
const profileController = require("../controllers/profileController")
const profileValidate = require("../utilities/profile-validation")

// Show edit profile form
router.get(
  "/edit",
  auth.checkLogin,
  utilities.handleErrors(profileController.buildEditProfile)
)

// Process profile update
router.post(
  "/edit",
  auth.checkLogin,
  profileValidate.profileRules(),
  profileValidate.checkProfileData,
  utilities.handleErrors(profileController.updateProfile)
)

module.exports = router
