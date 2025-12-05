// controllers/accountController.js
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const utilities = require("../utilities/")
const accountModel = require("../models/account-model")

/* ---------- VIEW BUILDERS ---------- */

// Login page
async function buildLogin(req, res, next) {
  const nav = await utilities.getNav()

  // Get any flash message (e.g., from successful registration redirect)
  const notice = req.flash("notice")
  const message = notice && notice.length ? notice[0] : null

  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    message,
  })
}

// Register page
async function buildRegister(req, res, next) {
  const nav = await utilities.getNav()

  const notice = req.flash("notice")
  const message = notice && notice.length ? notice[0] : null

  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    message,
  })
}

// Account Management page
async function buildAccountManagement(req, res, next) {
  const nav = await utilities.getNav()
  const accountData = res.locals.accountData

  // The notice was already pulled from flash in server.js
  const message = res.locals.notice

  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null,
    accountData,
    message,
  })
}

// Update Account page
async function buildUpdateAccount(req, res, next) {
  const nav = await utilities.getNav()
  const loggedInAccount = res.locals.accountData

  // Must be logged in
  if (!loggedInAccount) {
    req.flash("notice", "You must be logged in to update an account.")
    return res.redirect("/account/login")
  }

  const urlId = parseInt(req.params.account_id, 10)

  // Security check: URL id must match the logged-in account id
  if (isNaN(urlId) || urlId !== loggedInAccount.account_id) {
    req.flash(
      "notice",
      "You can only view and update your own account information."
    )
    return res.redirect("/account/")
  }

  // Always read fresh data from the database using the id from the token
  const accountData = await accountModel.getAccountById(
    loggedInAccount.account_id
  )

  return res.render("account/update-account", {
    title: "Update Account",
    nav,
    errors: null,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    message: null,
  })
}

/* ---------- AUTH HELPERS ---------- */

function buildJWT(account) {
  return jwt.sign(
    {
      account_id: account.account_id,
      account_firstname: account.account_firstname,
      account_lastname: account.account_lastname,
      account_email: account.account_email,
      account_type: account.account_type,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  )
}

function setAuthCookie(res, token) {
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    secure: false, // set to true if using https
    sameSite: "lax",
  })
}

/* ---------- REGISTRATION & LOGIN ---------- */

// Handle registration
async function registerAccount(req, res, next) {
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body

  const nav = await utilities.getNav()

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    if (regResult) {
      // Use flash + redirect so success message appears on login page
      req.flash("notice", "Registration successful. Please log in.")
      return res.redirect("/account/login")
    } else {
      return res.status(500).render("account/register", {
        title: "Register",
        nav,
        errors: null,
        message: "Sorry, the registration failed.",
      })
    }
  } catch (error) {
    console.error("Error in registerAccount:", error)
    return res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
      message: "Sorry, the registration failed.",
    })
  }
}

// Handle login
async function accountLogin(req, res, next) {
  const { account_email, account_password } = req.body
  const nav = await utilities.getNav()

  try {
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        message: "Please check your email and password and try again.",
      })
    }

    const passwordMatch = await bcrypt.compare(
      account_password,
      accountData.account_password
    )

    if (!passwordMatch) {
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        message: "Please check your email and password and try again.",
      })
    }

    const token = buildJWT(accountData)
    setAuthCookie(res, token)

    return res.redirect("/account/")
  } catch (error) {
    console.error("Error in accountLogin:", error)
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      message: "Login failed due to a server error. Please try again.",
    })
  }
}

// Logout
async function accountLogout(req, res, next) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  res.redirect("/")
}

/* ---------- WEEK 5: UPDATE ACCOUNT & PASSWORD ---------- */

async function updateAccount(req, res, next) {
  const nav = await utilities.getNav()
  const loggedInAccount = res.locals.accountData

  // Must be logged in to update
  if (!loggedInAccount) {
    req.flash("notice", "You must be logged in to update an account.")
    return res.redirect("/account/login")
  }

  const { account_firstname, account_lastname, account_email } = req.body
  const account_id = loggedInAccount.account_id // Do NOT trust body id

  try {
    const updatedAccount = await accountModel.updateAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_id
    )

    if (!updatedAccount) {
      return res.status(500).render("account/update-account", {
        title: "Update Account",
        nav,
        errors: null,
        account_id,
        account_firstname,
        account_lastname,
        account_email,
        message: "Sorry, the account update failed.",
      })
    }

    // Rebuild JWT with updated info so greetings & header are correct
    const token = buildJWT(updatedAccount)
    setAuthCookie(res, token)

    req.flash("notice", "Account information updated successfully.")
    return res.redirect("/account/")
  } catch (error) {
    console.error("Error in updateAccount:", error)
    return res.status(500).render("account/update-account", {
      title: "Update Account",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      message: "Sorry, the account update failed.",
    })
  }
}

async function updatePassword(req, res, next) {
  const nav = await utilities.getNav()
  const loggedInAccount = res.locals.accountData

  if (!loggedInAccount) {
    req.flash("notice", "You must be logged in to change your password.")
    return res.redirect("/account/login")
  }

  const account_id = loggedInAccount.account_id
  const { account_password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)
    const updateResult = await accountModel.updatePassword(
      hashedPassword,
      account_id
    )

    if (!updateResult) {
      req.flash("notice", "Sorry, the password update failed.")
      return res.redirect(`/account/update/${account_id}`)
    }

    req.flash("notice", "Password updated successfully.")
    return res.redirect("/account/")
  } catch (error) {
    console.error("Error in updatePassword:", error)
    req.flash("notice", "Sorry, the password update failed.")
    return res.redirect(`/account/update/${account_id}`)
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  buildAccountManagement,
  buildUpdateAccount,
  registerAccount,
  accountLogin,
  accountLogout,
  updateAccount,
  updatePassword,
}
