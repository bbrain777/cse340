// utilities/index.js
const jwt = require("jsonwebtoken")
const pool = require("../database/")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const invModel = require("../models/inventory-model")

/* ===========================================
   BUILD NAVIGATION
=========================================== */
async function getNav() {
  try {
    const data = await pool.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    )

    // note: class="nav-list" – style it in CSS
    let nav =
      '<ul class="nav-list"><li><a href="/" title="Home">Home</a></li>'

    data.rows.forEach((row) => {
      nav += `<li><a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name}">${row.classification_name}</a></li>`
    })

    nav += "</ul>"
    return nav
  } catch (error) {
    console.error("getNav error: " + error)
    return '<ul class="nav-list"><li><a href="/">Home</a></li></ul>'
  }
}

/* ===========================================
   INVENTORY GRID (classification view)
=========================================== */
function buildClassificationGrid(data) {
  // No vehicles
  if (!data || !data.length) {
    return '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }

  let grid = '<ul id="inv-display">'

  data.forEach((vehicle) => {
    grid += `
      <li class="inv-card">
        <a href="/inv/detail/${vehicle.inv_id}" 
           title="View details for ${vehicle.inv_make} ${vehicle.inv_model}">
          <img src="${vehicle.inv_thumbnail}" 
               alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
        </a>
        <div class="namePrice">
          <h2>
            <a href="/inv/detail/${vehicle.inv_id}">
              ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>
          <span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>
        </div>
      </li>
    `
  })

  grid += "</ul>"
  return grid
}

/* ===========================================
   VEHICLE DETAIL (single vehicle view)
=========================================== */
function buildVehicleDetail(vehicle) {
  if (!vehicle) {
    return '<p class="notice">Vehicle not found.</p>'
  }

  return `
    <section class="vehicle-detail">
      <figure class="vehicle-image">
        <img src="${vehicle.inv_image}" 
             alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
      </figure>

      <article class="vehicle-info">
        <h1 class="vehicle-title">
          ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}
        </h1>
        <p class="vehicle-price"><strong>Price:</strong> 
          $${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</p>
        <p class="vehicle-miles"><strong>Miles:</strong> 
          ${new Intl.NumberFormat("en-US").format(vehicle.inv_miles)}</p>
        <p class="vehicle-color"><strong>Color:</strong> 
          ${vehicle.inv_color}</p>

        <p class="vehicle-desc">
          ${vehicle.inv_description}
        </p>
      </article>
    </section>
  `
}

/* ===========================================
   BUILD CLASSIFICATION <select> LIST
   (used on Add Inventory form)
=========================================== */
async function buildClassificationList(selectedId) {
  try {
    const data = await invModel.getClassifications()

    let list =
      '<select id="classification_id" name="classification_id" required>'
    list += '<option value="">Choose a Classification</option>'

    data.rows.forEach((row) => {
      const selected =
        Number(selectedId) === Number(row.classification_id)
          ? " selected"
          : ""
      list += `<option value="${row.classification_id}"${selected}>${row.classification_name}</option>`
    })

    list += "</select>"
    return list
  } catch (error) {
    console.error("buildClassificationList error:", error)
    return '<select id="classification_id" name="classification_id" required><option value="">Error loading classifications</option></select>'
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
  buildClassificationGrid,
  buildVehicleDetail,
  buildClassificationList,
  handleErrors,
  checkJWTToken,
  checkAccountType,
}
