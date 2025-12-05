// models/profile-model.js
const pool = require("../database")

/**
 * Get profile for a given account id.
 */
async function getProfileByAccountId(account_id) {
  const sql = `
    SELECT profile_id, account_id, phone, address, city, state, postcode,
           created_at, updated_at
    FROM public.account_profile
    WHERE account_id = $1
    LIMIT 1;
  `
  const result = await pool.query(sql, [account_id])
  return result.rows[0]
}

/**
 * Insert or update profile for an account.
 * Uses ON CONFLICT to keep one profile row per account.
 */
async function upsertProfile(account_id, phone, address, city, state, postcode) {
  const sql = `
    INSERT INTO public.account_profile
      (account_id, phone, address, city, state, postcode, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT (account_id) DO UPDATE
      SET phone = EXCLUDED.phone,
          address = EXCLUDED.address,
          city = EXCLUDED.city,
          state = EXCLUDED.state,
          postcode = EXCLUDED.postcode,
          updated_at = CURRENT_TIMESTAMP
    RETURNING profile_id, account_id, phone, address, city, state, postcode,
              created_at, updated_at;
  `
  const result = await pool.query(sql, [
    account_id,
    phone,
    address,
    city,
    state,
    postcode,
  ])
  return result.rows[0]
}

module.exports = { getProfileByAccountId, upsertProfile }
