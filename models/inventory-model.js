// models/inventory-model.js
const db = require("../database")

async function getClassifications() {
  const data = await db.query(
    "SELECT classification_id, classification_name FROM public.classification ORDER BY classification_name"
  )
  return data.rows
}

async function getInventoryByClassificationId(classification_id) {
  const sql = `
    SELECT i.inv_id, i.inv_make, i.inv_model, i.inv_year,
           i.inv_price, i.inv_miles, i.inv_color, i.inv_image,
           i.inv_thumbnail, i.inv_description,
           c.classification_name
    FROM public.inventory AS i
      JOIN public.classification AS c
        ON i.classification_id = c.classification_id
    WHERE i.classification_id = $1
    ORDER BY i.inv_make, i.inv_model
  `
  const data = await db.query(sql, [classification_id])
  return data.rows
}

async function getVehicleById(inv_id) {
  const sql = `
    SELECT i.inv_id, i.inv_make, i.inv_model, i.inv_year,
           i.inv_price, i.inv_miles, i.inv_color, i.inv_image,
           i.inv_thumbnail, i.inv_description,
           c.classification_name
    FROM public.inventory AS i
      JOIN public.classification AS c
        ON i.classification_id = c.classification_id
    WHERE i.inv_id = $1
    LIMIT 1
  `
  const data = await db.query(sql, [inv_id])
  return data.rows[0]
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById
}
