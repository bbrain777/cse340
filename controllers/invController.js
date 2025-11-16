// controllers/invController.js
const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

async function buildByClassificationId(req, res, next) {
  try {
    const classificationId = parseInt(req.params.classificationId)
    const data = await invModel.getInventoryByClassificationId(classificationId)
    const grid = utilities.buildClassificationGrid(data)
    const className =
      (data && data[0] && data[0].classification_name) || "Vehicles"

    res.render("inventory/classification", {
      title: `${className} vehicles`,
      grid
    })
  } catch (err) {
    next(err)
  }
}

async function buildByInvId(req, res, next) {
  try {
    const invId = parseInt(req.params.invId)
    const vehicle = await invModel.getVehicleById(invId)

    if (!vehicle) {
      const error = new Error("Vehicle not found")
      error.status = 404
      throw error
    }

    const detailHTML = utilities.buildVehicleDetail(vehicle)
    const title = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`

    res.render("inventory/vehicle", {
      title,
      detailHTML
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  buildByClassificationId,
  buildByInvId
}
