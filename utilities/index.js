// utilities/index.js
const jwt = require("jsonwebtoken")
const pool = require("../database/")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")

/* ===========================================
   BUILD NAVIGATION
=========================================== */
async function getNav() {
  try {
    let data = await pool.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    )
    let nav =
      '<ul class="nav-list"><li><a href="/" title="Home">Home</a></li>'

    data.rows.forEach((row) => {
      nav += `<li><a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name}">${row.classification_name}</a></li>`
    })

    nav += "</ul>"
    return nav
  } catch (error) {
    console.error("getNav error: " + error)
  }
}

/* ===========================================
   ERROR HANDLER WRAPPER
=========================================== */
function handleErrors(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

/* ===========================================
   JWT CHECKER (for login status)
=========================================== */
function checkJWTToken(req, res, next) {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      (err, accountData) => {
        if (err) {
          console.log("JWT Verification Error:", err.message)
          res.locals.loggedin = 0
          return next()
        }

        res.locals.loggedin = 1
        res.locals.accountData = accountData
        return next()
      }
    )
  } else {
    res.locals.loggedin = 0
    return next()
  }
}

/* ===========================================
   AUTHORIZATION: EMPLOYEE OR ADMIN ONLY
=========================================== */
function checkAccountType(req, res, next) {
  if (
    res.locals.loggedin &&
    res.locals.accountData &&
    (res.locals.accountData.account_type === "Employee" ||
      res.locals.accountData.account_type === "Admin")
  ) {
    return next()
  }

  req.flash("notice", "Access forbidden. You are not authorized.")
  return res.redirect("/account/login")
}

/* ===========================================
   EXPORTS
=========================================== */
module.exports = {
  getNav,
  handleErrors,
  checkJWTToken,
  checkAccountType,
}
