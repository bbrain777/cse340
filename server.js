// server.js
const path = require("path")
const express = require("express")
require("dotenv").config()

const baseRoute = require("./routes/index")
const inventoryRoute = require("./routes/inventoryRoute")

const app = express()
const PORT = process.env.PORT || 5501

// View engine
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// Static assets
app.use(express.static(path.join(__dirname, "public")))

// Parse form data
app.use(express.urlencoded({ extended: true }))

// Inject nav and basic locals for every view
const utilities = require("./utilities")
app.use(async (req, res, next) => {
  try {
    res.locals.nav = await utilities.getNav()
    res.locals.errors = null
    next()
  } catch (err) {
    next(err)
  }
})

// Routes
app.use("/", baseRoute)
app.use("/inv", inventoryRoute)

// 404 handler
app.use((req, res, next) => {
  res.status(404)
  res.render("errors/404", {
    title: "404 | Page Not Found"
  })
})

// Error handler middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err)
  const status = err.status || 500
  res.status(status)
  res.render("errors/500", {
    title: status === 500 ? "Server Error" : `${status} Error`,
    message: err.message || "Something went wrong. Please try again."
  })
})

app.listen(PORT, () => {
  const env = process.env.NODE_ENV || "development"
  console.log(`Server running in ${env} mode on http://localhost:${PORT}`)
})
