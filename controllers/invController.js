// controllers/invController.js
const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

/**
 * Build inventory by classification view
 */
async function buildByClassificationId(req, res, next) {
  try {
    const classificationId = parseInt(req.params.classificationId);
    const nav = await utilities.getNav();
    const data = await invModel.getInventoryByClassificationId(classificationId);
    const grid = utilities.buildClassificationGrid(data);
    const className =
      (data && data[0] && data[0].classification_name) || "Vehicles";

    res.render("inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Build vehicle detail view
 */
async function buildByInvId(req, res, next) {
  try {
    const invId = parseInt(req.params.invId);
    const nav = await utilities.getNav();
    const vehicle = await invModel.getVehicleById(invId);

    if (!vehicle) {
      const error = new Error("Vehicle not found");
      error.status = 404;
      throw error;
    }

    const detailHTML = utilities.buildVehicleDetail(vehicle);
    const title = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`;

    res.render("inventory/vehicle", {
      title,
      nav,
      detailHTML,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Inventory Management view
 */
async function buildManagementView(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Deliver Add Classification view
 */
async function buildAddClassification(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      classification_name: "",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Process Add Classification form
 * Handles duplicate name (Postgres error code 23505)
 */
async function addClassification(req, res, next) {
  try {
    const { classification_name } = req.body;

    const result = await invModel.addClassification(classification_name);

    if (result) {
      req.flash(
        "notice",
        `Classification "${classification_name}" added successfully!`
      );
      return res.redirect("/inv");
    }

    // If for some reason result is falsy, fall through to generic error
    throw new Error("Classification insert failed.");
  } catch (error) {
    // Duplicate name: show a friendly message instead of 500 error page
    if (error.code === "23505") {
      const nav = await utilities.getNav();
      return res.status(400).render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: [
          { msg: "This classification name already exists. Please choose another." },
        ],
        classification_name: req.body.classification_name,
      });
    }

    next(error);
  }
}

/**
 * Build the Add Inventory form view
 */
async function buildAddInventory(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classificationSelect =
      await utilities.buildClassificationList();

    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      errors: null,
      classificationSelect,
      classification_id: "",
      inv_make: "",
      inv_model: "",
      inv_description: "",
      inv_image: "/images/vehicles/no-image.png",
      inv_thumbnail: "/images/vehicles/no-image-tn.png",
      inv_price: "",
      inv_year: "",
      inv_miles: "",
      inv_color: "",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Process Add Inventory form submission
 */
async function addInventory(req, res, next) {
  try {
    const {
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    } = req.body;

    const addResult = await invModel.addInventory(
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color
    );

    if (addResult) {
      req.flash(
        "notice",
        `The ${inv_year} ${inv_make} ${inv_model} was successfully added.`
      );
      return res.redirect("/inv/");
    } else {
      const nav = await utilities.getNav();
      const classificationSelect =
        await utilities.buildClassificationList(classification_id);
      req.flash("notice", "Sorry, the vehicle could not be added.");
      return res.status(501).render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        errors: null,
        classificationSelect,
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
      });
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buildByClassificationId,
  buildByInvId,
  buildManagementView,
  buildAddClassification,
  addClassification,
  buildAddInventory,
  addInventory,
};
