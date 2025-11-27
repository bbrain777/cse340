// routes/accountRoute.js

const express = require("express")
const router = new express.Router()

const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

// Default account management route
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
)

// Login view
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)

// Register view (placeholder)
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)

// Deliver edit account view
router.get(
  "/edit/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildEditAccount)
)

// Process login
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Process account update
router.post(
  "/update",
  utilities.checkLogin,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

module.exports = router
