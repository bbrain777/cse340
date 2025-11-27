// models/account-model.js

const pool = require("../database/")

/* *****************************
 * Return account data using email address
 * ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
      [account_email]
    )
    return result.rows[0]
  } catch (error) {
    console.error("getAccountByEmail error:", error)
    return null
  }
}

/* *****************************
 * Return account data using account id
 * ***************************** */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1",
      [account_id]
    )
    return result.rows[0]
  } catch (error) {
    console.error("getAccountById error:", error)
    return null
  }
}

/* *******************************
 * Update account data
 ******************************** */
async function updateAccount(account_id, firstname, lastname, email) {
  try {
    const sql = `
      UPDATE account
      SET account_firstname = $1,
          account_lastname = $2,
          account_email = $3
      WHERE account_id = $4
      RETURNING *;
    `
    const data = await pool.query(sql, [
      firstname,
      lastname,
      email,
      account_id,
    ])
    return data.rows[0]
  } catch (error) {
    console.error("updateAccount error:", error)
    return null
  }
}

/* ****************************************
 * Placeholder for registration (Week 4)
 **************************************** */
async function registerAccount() {
  // Not required for Week 5 learning activities
  return null
}

module.exports = {
  getAccountByEmail,
  getAccountById,
  updateAccount,
  registerAccount,
}
