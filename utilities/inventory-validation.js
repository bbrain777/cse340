// utilities/inventory-validation.js

const { body, validationResult } = require("express-validator");
const utilities = require("."); // uses utilities/index.js

/* ---------- CLASSIFICATION VALIDATION ---------- */

const classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Classification name is required.")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage(
        "Classification name may contain only letters and numbers. No spaces or special characters."
      ),
  ];
};

const checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req);
  const { classification_name } = req.body;

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();

    return res.status(400).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: errors.array(),
      classification_name,
    });
  }

  next();
};

/* ---------- INVENTORY VALIDATION ---------- */

/**
 * Validation rules for the Add Inventory form
 */
const inventoryRules = () => {
  return [
    body("classification_id")
      .notEmpty()
      .withMessage("You must select a classification."),
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Make must be at least 3 characters long."),
    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Model must be at least 3 characters long."),
    body("inv_year")
      .trim()
      .isInt({ min: 1900, max: 2100 })
      .withMessage("Year must be a valid number between 1900 and 2100."),
    body("inv_price")
      .trim()
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),
    body("inv_miles")
      .trim()
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive whole number."),
    body("inv_color")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Color must be at least 3 characters long."),
  ];
};

/**
 * Middleware: check validation result and either continue
 * or re-render the Add Inventory form with error messages.
 */
const checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);

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

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationSelect =
      await utilities.buildClassificationList(classification_id);

    return res.status(400).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      errors: errors.array(),
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

  next();
};

module.exports = {
  classificationRules,
  checkClassificationData,
  inventoryRules,
  checkInventoryData,
};
