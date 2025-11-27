// server.js
require("dotenv").config()
const path = require("path")
const express = require("express")
const session = require("express-session")
const flash = require("connect-flash")
const cookieParser = require("cookie-parser")

const app = express()

/* ---------- Controllers & Utilities ---------- */
const baseController = require("./controllers/baseController")
const utilities = require("./utilities")

/* ---------- Routes ---------- */
const baseRoute = require("./routes/index")              // Home route
const inventoryRoute = require("./routes/inventoryRoute") // /inv route
const accountRoute = require("./routes/accountRoute")     // /account route

/* ---------- View Engine ---------- */
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

/* ---------- Static Files ---------- */
app.use(express.static(path.join(__dirname, "public")))

/* ---------- Body Parsing ---------- */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* ---------- Cookies & JWT Middleware ---------- */
app.use(cookieParser())
app.use(utilities.checkJWTToken) // MUST RUN BEFORE ROUTES

/* ---------- Sessions & Flash ---------- */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret-session-key",
    resave: false,
    saveUninitialized: true,
  })
)

app.use(flash())

// Make flash message & nav available to EVERY view
app.use(async (req, res, next) => {
  res.locals.notice = req.flash("notice")
  res.locals.nav = await utilities.getNav()
  next()
})

/* ---------- Routes ---------- */
app.use("/", baseRoute)
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)

/* ---------- 404 Not Found ---------- */
app.use(async (req, res, next) => {
  const nav = await utilities.getNav()
  res.status(404).render("errors/error", {
    title: "404 - Page Not Found",
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
