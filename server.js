// server.js
require("dotenv").config()
const path = require("path")
const express = require("express")
const session = require("express-session")
const flash = require("connect-flash")

const app = express()

// Controllers & utilities
const baseController = require("./controllers/baseController")
const invRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities")

/* ---------- View engine ---------- */
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

/* ---------- Static files ---------- */
app.use(express.static(path.join(__dirname, "public")))

/* ---------- Body parsing ---------- */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* ---------- Sessions & Flash Messages ---------- */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret-session-key",
    resave: false,
    saveUninitialized: true,
  })
)

app.use(flash())

// Make flash message and nav available to EVERY view
app.use(async (req, res, next) => {
  res.locals.notice = req.flash("notice") // flash messages (array or string)
  res.locals.nav = await utilities.getNav() // navigation bar
  next()
})

/* ---------- Routes ---------- */

// Home route
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes
app.use("/inv", invRoute)

/* ---------- 404 Not Found ---------- */
app.use(async (req, res, next) => {
  const nav = await utilities.getNav()
  res.status(404).render("errors/error", {
    title: "Page Not Found",
    message: "Sorry, we couldn't find the page you requested.",
    nav,
  })
})

/* ---------- Global Error Handler ---------- */
app.use(async (err, req, res, next) => {
  console.error(err.stack)
  const nav = await utilities.getNav()
  res.status(err.status || 500).render("errors/error", {
    title: err.status === 404 ? "Not Found" : "Server Error",
    message: err.message || "An unexpected error occurred.",
    nav,
  })
})

/* ---------- Start Server ---------- */
const PORT = process.env.PORT || 5501
app.listen(PORT, () => {
  console.log(`CSE Motors running at http://localhost:${PORT}`)
})
