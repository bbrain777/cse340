// database/index.js
const { Pool } = require("pg");
require("dotenv").config();
console.log("ENV TEST:", process.env.NODE_ENV, process.env.DATABASE_URL ? "DB URL found" : "Missing DB URL");


/* Connection Pool
 * In development we allow SSL (Render external URL usually requires it).
 * In production, export plain pool without SSL config.
 */
let pool;

if (process.env.NODE_ENV === "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  // Helpful query wrapper with logging for development
  module.exports = {
    async query(text, params) {
      try {
        const res = await pool.query(text, params);
        console.log("executed query:", text);
        return res;
      } catch (err) {
        console.error("query error:", text, err.message);
        throw err;
      }
    },
  };
} else {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  module.exports = pool;
}
