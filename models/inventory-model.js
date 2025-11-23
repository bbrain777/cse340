// models/inventory-model.js
const db = require("../database");

/**
 * Get all classifications
 */
async function getClassifications() {
  const data = await db.query(
    "SELECT classification_id, classification_name FROM public.classification ORDER BY classification_name"
  );
  return data.rows;
}

/**
 * Get inventory by classification id
 */
async function getInventoryByClassificationId(classification_id) {
  const sql = `
    SELECT i.inv_id,
           i.inv_make,
           i.inv_model,
           i.inv_year,
           i.inv_price,
           i.inv_miles,
           i.inv_color,
           i.inv_image,
           i.inv_thumbnail,
           i.inv_description,
           c.classification_name
    FROM public.inventory AS i
    JOIN public.classification AS c
      ON i.classification_id = c.classification_id
    WHERE i.classification_id = $1
    ORDER BY i.inv_make, i.inv_model`;
  const data = await db.query(sql, [classification_id]);
  return data.rows;
}

/**
 * Get a single vehicle by id
 */
async function getVehicleById(inv_id) {
  const sql = `
    SELECT i.inv_id,
           i.inv_make,
           i.inv_model,
           i.inv_year,
           i.inv_price,
           i.inv_miles,
           i.inv_color,
           i.inv_image,
           i.inv_thumbnail,
           i.inv_description,
           c.classification_name
    FROM public.inventory AS i
    JOIN public.classification AS c
      ON i.classification_id = c.classification_id
    WHERE i.inv_id = $1
    LIMIT 1`;
  const data = await db.query(sql, [inv_id]);
  return data.rows[0];
}

/**
 * Insert a new classification
 */
async function addClassification(classification_name) {
  const sql = `
    INSERT INTO public.classification (classification_name)
    VALUES ($1)
    RETURNING *`;
  const data = await db.query(sql, [classification_name]);
  return data.rows[0];
}

/**
 * Insert a new inventory record
 */
async function addInventory(
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
) {
  const sql = `
    INSERT INTO public.inventory
      (classification_id, inv_make, inv_model, inv_description,
       inv_image, inv_thumbnail, inv_price, inv_year,
       inv_miles, inv_color)
    VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *`;
  const data = await db.query(sql, [
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
  ]);
  return data.rows[0];
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  addClassification,
  addInventory,
};
