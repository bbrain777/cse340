// controllers/accountController.js

const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
 *  Deliver login view
 * ************************************ */
async function buildLogin(req, res) {
  const nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email: "",
  })
}

/* ****************************************
 *  Deliver registration view (placeholder)
 * ************************************ */
async function buildRegister(req, res) {
  const nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Process registration (placeholder for now)
 * ************************************ */
async function registerAccount(req, res) {
  // Week 4 registration logic would go here.
  // For Week 5 activities we don't need it working.
  req.flash("notice", "Registration not implemented yet.")
  res.redirect("/account/login")
}

/* ****************************************
 *  Build Account Management view
 * ************************************ */
async function buildAccountManagement(req, res) {
  const nav = await utilities.getNav()
  const accountData = res.locals.accountData // set by checkJWTToken middleware

  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    accountData,
  })
}

/* ****************************************
 *  Deliver Edit Account view
 * ************************************ */
async function buildEditAccount(req, res) {
  const nav = await utilities.getNav()
  const account_id = req.params.account_id
  const accountData = await accountModel.getAccountById(account_id)

  res.render("account/edit-account", {
    title: "Edit Account",
    nav,
    errors: null,
    accountData,
  })
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      // Remove password hash before putting account data in token
      delete accountData.account_password

      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 } // 1 hour (in seconds in official instructions; using ms here)
      )

      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          maxAge: 3600 * 1000,
        })
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        })
      }

      return res.redirect("/account/")
    } else {
      req.flash("message notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error("Access Forbidden")
  }
}

/* ****************************************
 *  Process Account Update
 * ************************************ */
async function updateAccount(req, res) {
  const { account_id, account_firstname, account_lastname, account_email } =
    req.body

  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (updateResult) {
    req.flash("notice", "Account updated successfully.")
    return res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    return res.redirect(`/account/edit/${account_id}`)
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  buildAccountManagement,
  buildEditAccount,
  accountLogin,
  updateAccount,
}
