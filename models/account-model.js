// models/account-model.js
const pool = require("../database/")

/* ---------- BASIC LOOKUPS ---------- */

async function getAccountByEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const data = await pool.query(sql, [account_email])
    return data.rows[0]
  } catch (error) {
    throw error
  }
}

async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT account_email FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    throw error
  }
}

/* ---------- REGISTRATION ---------- */

async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password) VALUES ($1, $2, $3, $4) RETURNING *"
    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ])
    return data.rows[0]
  } catch (error) {
    throw error
  }
}

/* ---------- WEEK 5: ACCOUNT MANAGEMENT ---------- */

async function getAccountById(account_id) {
  try {
    const sql =
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1"
    const data = await pool.query(sql, [account_id])
    return data.rows[0]
  } catch (error) {
    throw error
  }
}

async function updateAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_id
) {
  try {
    const sql = `
      UPDATE account
      SET
        account_firstname = $1,
        account_lastname  = $2,
        account_email     = $3
      WHERE account_id   = $4
      RETURNING account_id, account_firstname, account_lastname, account_email, account_type
    `
    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    ])
    return data.rows[0]
  } catch (error) {
    throw error
  }
}

async function updatePassword(account_password, account_id) {
  try {
    const sql = `
      UPDATE account
      SET account_password = $1
      WHERE account_id = $2
      RETURNING account_id
    `
    const data = await pool.query(sql, [account_password, account_id])
    return data.rowCount // 1 if success, 0 if fail
  } catch (error) {
    throw error
  }
}

module.exports = {
  getAccountByEmail,
  checkExistingEmail,
  registerAccount,
  getAccountById,
  updateAccount,
  updatePassword,
}
