// routes/inventoryRoute.js

const invValidate = require("../utilities/inventory-validation");
const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const invController = require("../controllers/invController");

// Inventory Management view
router.get(
  "/",
  utilities.handleErrors(invController.buildManagementView)
);

// Deliver classification inventory
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Deliver vehicle details
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInvId)
);

// Add Classification view
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
);

// Process Add Classification
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Add Inventory form view
router.get(
  "/add",
  utilities.handleErrors(invController.buildAddInventory)
);

// Process Add Inventory form
router.post(
  "/add",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

module.exports = router;
