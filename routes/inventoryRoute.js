// routes/inventoryRoute.js
const express = require("express")
const router = new express.Router()

const invValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities")
const invController = require("../controllers/invController")

/* ============================================================
   Inventory Home View 
   ============================================================ */
router.get(
  "/",
  utilities.handleErrors(invController.buildManagementView)
)

/* ============================================================
   Classification Inventory View 
   ============================================================ */
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

/* ============================================================
   Vehicle Detail View
   ============================================================ */
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInvId)
)

/* ============================================================
   Add Classification View (GET)
   ============================================================ */
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

/* ============================================================
   Process Add Classification (POST)
   REQUIRED for Week 4 Server-side validation
   ============================================================ */
router.post(
  "/add-classification",
  invValidate.classificationRules(),       // <-- VALIDATION RULES
  invValidate.checkClassificationData,     // <-- VALIDATION CHECK
  utilities.handleErrors(invController.addClassification)
)

/* ============================================================
   Add Inventory View (GET)
   ============================================================ */
router.get(
  "/add",
  utilities.handleErrors(invController.buildAddInventory)
)

/* ============================================================
   Process Add Inventory (POST)
   ============================================================ */
router.post(
  "/add",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

module.exports = router
