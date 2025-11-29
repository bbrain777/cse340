// routes/accountRoute.js
const express = require("express")
const router = express.Router()

const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/account-validation") // week 5 validation
const auth = require("../utilities/auth")

/* ---------- PUBLIC ROUTES ---------- */

router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)

router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)

// Registration
router.post(
  "/register",
  utilities.handleErrors(accountController.registerAccount)
)

// Login
router.post(
  "/login",
  utilities.handleErrors(accountController.accountLogin)
)

/* ---------- PROTECTED ROUTES (LOGGED-IN) ---------- */

// Account management
router.get(
  "/",
  auth.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
)

// Update account (view)
router.get(
  "/update/:account_id",
  auth.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount)
)

// Process account update
router.post(
  "/update",
  auth.checkLogin,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Process password change
router.post(
  "/update-password",
  auth.checkLogin,
  regValidate.updatePasswordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

// Logout
router.get(
  "/logout",
  auth.checkLogin,
  utilities.handleErrors(accountController.accountLogout)
)

module.exports = router
