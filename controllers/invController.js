const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

/* ***************************
 *  Build inventory by classification view
 *  Route:  /inv/type/:classificationId
 * ************************** */
async function buildByClassificationId(req, res, next) {
  try {
    const classification_id = parseInt(req.params.classificationId)

    // Get all vehicles in this classification
    const data = await invModel.getInventoryByClassificationId(classification_id)

    // Build the HTML grid for the view
    const grid = await utilities.buildClassificationGrid(data)

    // Navigation
    const nav = await utilities.getNav()

    // Classification name for the page title
    const clsName = data[0]?.classification_name || "Vehicles"

    res.render("inventory/classification", {
      title: `${clsName} vehicles`,
      nav,
      grid,
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build single vehicle detail view
 *  Route:  /inv/detail/:invId
 * ************************** */
async function buildByInvId(req, res, next) {
  try {
    const inv_id = parseInt(req.params.invId)

    // Get one vehicle from the DB
    const vehicleData = await invModel.getVehicleById(inv_id)

    const nav = await utilities.getNav()

    // If no vehicle found, show 404-style page
    if (!vehicleData) {
      return res.status(404).render("inventory/vehicle", {
        title: "Vehicle not found",
        nav,
        vehicle: null,
        errors: null,
      })
    }

    // Render the detail page
    res.render("inventory/vehicle", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      vehicle: vehicleData,
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  buildByClassificationId,
  buildByInvId,
}
