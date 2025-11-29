// utilities/account-validation.js
const { body, validationResult } = require("express-validator")
const utilities = require(".")
const accountModel = require("../models/account-model")

/* ------------------- RULES ------------------- */

// For updating basic account info
const updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("First name is required."),
    body("account_lastname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Last name is required."),
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email address is required.")
      .custom(async (email, { req }) => {
        // Only check uniqueness if email changed
        const existingAccount = await accountModel.getAccountByEmail(email)
        if (existingAccount && existingAccount.account_id != req.body.account_id) {
          throw new Error("That email address is already in use.")
        }
        return true
      }),
  ]
}

// For updating password only
const updatePasswordRules = () => {
  return [
    body("account_password")
      .trim()
      .isLength({ min: 12 })
      .withMessage("Password must be at least 12 characters long.")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter.")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter.")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number.")
      .matches(/[^A-Za-z0-9]/)
      .withMessage("Password must contain at least one special character."),
  ]
}

/* ------------------- CHECKERS ------------------- */

// Handle validation errors for account update
const checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)

  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  } = req.body

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.status(400).render("account/update-account", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    })
  }

  next()
}

// Handle validation errors for password update
const checkPasswordData = async (req, res, next) => {
  const errors = validationResult(req)

  const { account_id } = req.body

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    // We only have account_id + errors here, so we need account details again
    const accountData = await accountModel.getAccountById(account_id)

    return res.status(400).render("account/update-account", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    })
  }

  next()
}

module.exports = {
  updateAccountRules,
  updatePasswordRules,
  checkUpdateData,
  checkPasswordData,
}
