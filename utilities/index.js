const db = require("../database")

async function getNav() {
  const result = await db.query(
    "SELECT classification_id, classification_name FROM public.classification ORDER BY classification_id"
  )
  return `
  <ul class="container nav__list" role="list">
    <li><a href="/">Home</a></li>
    ${result.rows.map(r=>`<li><a href="/inv/type/${r.classification_id}">${r.classification_name}</a></li>`).join("")}
  </ul>`
}

function buildClassificationGrid(data) {
  if (!data || data.length === 0) {
    return "<p class='notice'>Sorry, no matching vehicles were found.</p>"
  }
  return `
    <ul id="inv-display">
      ${data.map(v => `
        <li class="inv-card">
          <a href="/inv/detail/${v.inv_id}" aria-label="${v.inv_make} ${v.inv_model}">
            <img src="${v.inv_thumbnail}" alt="Image of ${v.inv_make} ${v.inv_model} on CSE Motors">
          </a>
          <div class="namePrice">
            <h2><a href="/inv/detail/${v.inv_id}">${v.inv_make} ${v.inv_model}</a></h2>
            <span>$${Number(v.inv_price).toLocaleString()}</span>
          </div>
        </li>`).join("")}
    </ul>`
}

module.exports = { getNav, buildClassificationGrid }
