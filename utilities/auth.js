// utilities/auth.js
const jwt = require("jsonwebtoken")
require("dotenv").config()

/**
 * Helper: get JWT token from cookie
 */
function getTokenFromCookies(req) {
  if (!req.cookies) return null
  return req.cookies.jwt || null
}

/**
 * checkLogin
 * - verifies JWT
 * - stores payload in res.locals.accountData
 * - redirects to login if not valid
 */
function checkLogin(req, res, next) {
  const token = getTokenFromCookies(req)

  if (!token) {
    req.flash("notice", "Please log in to continue.")
    return res.redirect("/account/login")
  }

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    res.locals.accountData = payload
    next()
  } catch (err) {
    console.error("JWT verification failed in checkLogin:", err.message)
    res.clearCookie("jwt")
    req.flash("notice", "Your session has expired. Please log in again.")
    return res.redirect("/account/login")
  }
}

/**
 * checkEmployee
 * - verifies JWT
 * - only allows Employee/Admin to continue
 * - redirects Clients/anonymous users away from inventory admin pages
 */
function checkEmployee(req, res, next) {
  const token = getTokenFromCookies(req)

  if (!token) {
    req.flash("notice", "You must be logged in to manage inventory.")
    return res.redirect("/account/login")
  }

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    res.locals.accountData = payload

    if (payload.account_type === "Employee" || payload.account_type === "Admin") {
      return next()
    }

    req.flash(
      "notice",
      "Access forbidden: only Employee or Admin accounts can manage inventory."
    )
    return res.redirect("/account/")
  } catch (err) {
    console.error("JWT verification failed in checkEmployee:", err.message)
    res.clearCookie("jwt")
    req.flash("notice", "Your session has expired. Please log in again.")
    return res.redirect("/account/login")
  }
}

module.exports = { checkLogin, checkEmployee }
