// routes/inventoryRoute.js

const invValidate = require("../utilities/inventory-validation");
const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");

// Deliver classification inventory
router.get("/type/:classificationId", invController.buildByClassificationId);

// Deliver vehicle details
router.get("/detail/:invId", invController.buildByInvId);

// Add Inventory form view
router.get("/add", invController.buildAddInventory);

// Process Add Inventory form
router.post(
  "/add",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  invController.addInventory
);

module.exports = router;
