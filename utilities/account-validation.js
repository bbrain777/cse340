// utilities/account-validation.js

const { body, validationResult } = require("express-validator")
const utilities = require("./")
const accountModel = require("../models/account-model")

const regValidate = {}

/* **********************************
 *  Login validation rules
 * ********************************* */
regValidate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required."),
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ]
}

/* ******************************
 *  Check login data
 * ***************************** */
regValidate.checkLoginData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: errors.array(),
      account_email: req.body.account_email,
    })
  }
  next()
}

/* **********************************
 *  Update account validation rules
 * ********************************* */
regValidate.updateAccountRules = () => {
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
      .withMessage("A valid email is required."),
  ]
}

/* ******************************
 *  Check update account data
 * ***************************** */
regValidate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const account_id = req.body.account_id
    const accountData = await accountModel.getAccountById(account_id)

    return res.status(400).render("account/edit-account", {
      title: "Edit Account",
      nav,
      errors: errors.array(),
      accountData,
    })
  }
  next()
}

module.exports = regValidate
