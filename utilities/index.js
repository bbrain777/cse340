// utilities/index.js

const { getClassifications } = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/**
 * Build the site navigation bar
 */
async function getNav() {
  const classifications = await getClassifications()
  const list = classifications
    .map(
      (row) =>
        `<li><a href="/inv/type/${row.classification_id}">${row.classification_name}</a></li>`
    )
    .join("")

  return `
  <ul class="nav__list" role="list">
    <li><a href="/">Home</a></li>
    ${list}
  </ul>
  `
}

/**
 * Build the grid of vehicles for a classification
 */
function buildClassificationGrid(data) {
  if (!data || data.length === 0) {
    return "<p class='notice'>Sorry, no matching vehicles were found.</p>"
  }

  const items = data
    .map((v) => {
      const price = Number(v.inv_price || 0).toLocaleString("en-US")
      return `
      <li class="inv-card">
        <a href="/inv/detail/${v.inv_id}" aria-label="${v.inv_make} ${v.inv_model} details">
          <img src="${v.inv_thumbnail}" alt="Image of ${v.inv_make} ${v.inv_model} on CSE Motors">
        </a>
        <div class="namePrice">
          <h2>
            <a href="/inv/detail/${v.inv_id}">${v.inv_make} ${v.inv_model}</a>
          </h2>
          <span>$${price}</span>
        </div>
      </li>
    `
    })
    .join("")

  return `<ul id="inv-display">${items}</ul>`
}

/**
 * Build the single vehicle detail HTML
 */
function buildVehicleDetail(vehicle) {
  if (!vehicle) {
    return "<p class='notice'>Vehicle not found.</p>"
  }

  const fullName = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`
  const price = Number(vehicle.inv_price || 0).toLocaleString("en-US")
  const miles = Number(vehicle.inv_miles || 0).toLocaleString("en-US")

  return `
  <section class="vehicle-detail">
    <div class="vehicle-image">
      <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
    </div>
    <div class="vehicle-info">
      <h1 class="vehicle-title">${fullName}</h1>
      <p class="vehicle-price"><strong>Price:</strong> $${price}</p>
      <p class="vehicle-miles"><strong>Mileage:</strong> ${miles} miles</p>
      <p class="vehicle-color"><strong>Color:</strong> ${vehicle.inv_color}</p>
      <p class="vehicle-desc">${vehicle.inv_description}</p>
      <ul class="vehicle-meta" aria-label="Key vehicle details">
        <li><span>Year</span><strong>${vehicle.inv_year}</strong></li>
        <li><span>Make</span><strong>${vehicle.inv_make}</strong></li>
        <li><span>Model</span><strong>${vehicle.inv_model}</strong></li>
        <li><span>Classification</span><strong>${vehicle.classification_name}</strong></li>
      </ul>
    </div>
  </section>
  `
}

/**
 * Wrap async route handlers so errors go to the error middleware
 */
function handleErrors(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

/**
 * Build the classification <select> list for the forms
 */
async function buildClassificationList(classification_id = null) {
  const data = await getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"

  data.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"`
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected"
    }
    classificationList += `>${row.classification_name}</option>`
  })

  classificationList += "</select>"
  return classificationList
}

/* ****************************************
 * Middleware to check token validity
 **************************************** */
function checkJWTToken(req, res, next) {
  if (req.cookies && req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      (err, accountData) => {
        if (err) {
          req.flash("notice", "Please log in.")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      }
    )
  } else {
    next()
  }
}

/* ****************************************
 * Check Login Middleware
 **************************************** */
function checkLogin(req, res, next) {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

module.exports = {
  getNav,
  buildClassificationGrid,
  buildVehicleDetail,
  handleErrors,
  buildClassificationList,
  checkJWTToken,
  checkLogin,
}
