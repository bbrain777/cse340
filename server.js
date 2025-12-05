// server.js
require("dotenv").config()
const path = require("path")
const express = require("express")
const session = require("express-session")
const flash = require("connect-flash")
const cookieParser = require("cookie-parser")

const app = express()

/* ---------- Utilities & Routes ---------- */
const utilities = require("./utilities")
const baseRoute = require("./routes/index")
const accountRoute = require("./routes/accountRoute")
const invRoute = require("./routes/inventoryRoute")
const profileRoute = require("./routes/profileRoute")

/* ---------- View Engine ---------- */
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

/* ---------- Core Middleware ---------- */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Static files
app.use(express.static(path.join(__dirname, "public")))

// Session + Flash
app.use(
  session({
    secret: process.env.SESSION_SECRET || "cse340-secret",
    resave: false,
    saveUninitialized: true,
  })
)
app.use(flash())

// Make flash notice available
app.use((req, res, next) => {
  res.locals.notice = req.flash("notice")
  next()
})

/**
 * VERY IMPORTANT:
 * Check JWT on every request and set:
 *  - res.locals.loggedin
 *  - res.locals.accountData
 *
 * This is what header.ejs expects.
 */
app.use(utilities.checkJWTToken)

// Ensure locals always exist so EJS never gets "loggedin is not defined"
app.use((req, res, next) => {
  if (typeof res.locals.loggedin === "undefined") {
    res.locals.loggedin = 0
  }
  if (typeof res.locals.accountData === "undefined") {
    res.locals.accountData = null
  }
  next()
})

/* ---------- Routes ---------- */
app.use("/", baseRoute)
app.use("/account", accountRoute)
app.use("/inv", invRoute)
app.use("/profile", profileRoute)

/* ---------- 404 handler ---------- */
app.use(async (req, res, next) => {
  const nav = await utilities.getNav()
  res.status(404).render("errors/404", {
    title: "Page Not Found",
    message: "The page you are looking for could not be found.",
    nav,
  })
})

/* ---------- Global Error Handler ---------- */
app.use(async (err, req, res, next) => {
  console.error(err.stack)
  const nav = await utilities.getNav()
  const status = err.status || 500

  if (status === 404) {
    return res.status(404).render("errors/404", {
      title: "Page Not Found",
      message: err.message || "The page you are looking for could not be found.",
      nav,
    })
  }

  res.status(status).render("errors/error", {
    title: status === 500 ? "Server Error" : "Error",
    message: err.message || "An unexpected error occurred.",
    nav,
  })
})

/* ---------- Start Server ---------- */
const PORT = process.env.PORT || 5501
app.listen(PORT, () => {
  console.log(`CSE Motors running at http://localhost:${PORT}`)
})
