// utilities/index.js
const { getClassifications } = require("../models/inventory-model")

async function getNav() {
  const classifications = await getClassifications()
  const list = classifications
    .map(
      (row) =>
        `<li><a href="/inv/type/${row.classification_id}">${row.classification_name}</a></li>`
    )
    .join("")

  return `
  <ul class="nav__list" role="list">
    <li><a href="/">Home</a></li>
    ${list}
  </ul>
  `
}

function buildClassificationGrid(data) {
  if (!data || data.length === 0) {
    return "<p class='notice'>Sorry, no matching vehicles were found.</p>"
  }

  const items = data
    .map((v) => {
      const price = Number(v.inv_price || 0).toLocaleString("en-US")
      return `
      <li class="inv-card">
        <a href="/inv/detail/${v.inv_id}" aria-label="${v.inv_make} ${v.inv_model} details">
          <img src="${v.inv_thumbnail}" alt="Image of ${v.inv_make} ${v.inv_model} on CSE Motors">
        </a>
        <div class="namePrice">
          <h2>
            <a href="/inv/detail/${v.inv_id}">${v.inv_make} ${v.inv_model}</a>
          </h2>
          <span>$${price}</span>
        </div>
      </li>
    `
    })
    .join("")

  return `<ul id="inv-display">${items}</ul>`
}

function buildVehicleDetail(vehicle) {
  if (!vehicle) {
    return "<p class='notice'>Vehicle not found.</p>"
  }

  const fullName = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`
  const price = Number(vehicle.inv_price || 0).toLocaleString("en-US")
  const miles = Number(vehicle.inv_miles || 0).toLocaleString("en-US")

  return `
  <section class="vehicle-detail">
    <div class="vehicle-image">
      <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
    </div>
    <div class="vehicle-info">
      <h1 class="vehicle-title">${fullName}</h1>
      <p class="vehicle-price"><strong>Price:</strong> $${price}</p>
      <p class="vehicle-miles"><strong>Mileage:</strong> ${miles} miles</p>
      <p class="vehicle-color"><strong>Color:</strong> ${vehicle.inv_color}</p>
      <p class="vehicle-desc">${vehicle.inv_description}</p>
      <ul class="vehicle-meta" aria-label="Key vehicle details">
        <li><span>Year</span><strong>${vehicle.inv_year}</strong></li>
        <li><span>Make</span><strong>${vehicle.inv_make}</strong></li>
        <li><span>Model</span><strong>${vehicle.inv_model}</strong></li>
        <li><span>Classification</span><strong>${vehicle.classification_name}</strong></li>
      </ul>
    </div>
  </section>
  `
}

module.exports = {
  getNav,
  buildClassificationGrid,
  buildVehicleDetail
}
