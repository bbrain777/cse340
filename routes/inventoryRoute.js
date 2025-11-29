// routes/inventoryRoute.js
const express = require("express")
const router = express.Router()

const utilities = require("../utilities/")
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")
const auth = require("../utilities/auth")

/* ---------- PUBLIC ROUTES ---------- */

// Classification list
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

// Vehicle detail
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInvId)
)

/* ---------- ADMIN / EMPLOYEE ROUTES ---------- */

// Inventory management home (table)
router.get(
  "/",
  auth.checkEmployee,
  utilities.handleErrors(invController.buildManagementView)
)

// Add classification view
router.get(
  "/add-classification",
  auth.checkEmployee,
  utilities.handleErrors(invController.buildAddClassification)
)

// Process add classification
router.post(
  "/add-classification",
  auth.checkEmployee,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Add inventory view
router.get(
  "/add",
  auth.checkEmployee,
  utilities.handleErrors(invController.buildAddInventory)
)

// Process add inventory
router.post(
  "/add",
  auth.checkEmployee,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Edit inventory view
router.get(
  "/edit/:inv_id",
  auth.checkEmployee,
  utilities.handleErrors(invController.editInventoryView)
)

// Process edit inventory (UPDATE)
router.post(
  "/update/",
  auth.checkEmployee,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,   // ✅ use existing checker
  utilities.handleErrors(invController.updateInventory)
)

// Delete confirmation view
router.get(
  "/delete/:inv_id",
  auth.checkEmployee,
  utilities.handleErrors(invController.buildDeleteConfirmation || invController.buildDeleteConfirm)
)

// Process delete
router.post(
  "/delete/",
  auth.checkEmployee,
  utilities.handleErrors(invController.deleteInventoryItem)
)

module.exports = router
