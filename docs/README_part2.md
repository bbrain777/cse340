# CSE340 Week 3 — Part 2 (Inventory by Classification) Overlay

This overlay adds:
- `routes/inventoryRoute.js`
- `controllers/invController.js`
- `models/inventory-model.js` (includes both functions)
- `utilities/index.js` (adds buildClassificationGrid alongside getNav)
- `views/inventory/classification.ejs`
- `public/css/inventory.css` (optional styling)
- This README

## How to apply
1. Extract this zip into your project root (same folder as `server.js`).
2. Allow creation/overwrite prompts for the listed files above.
3. Open `server.js` and add:
   ```js
   const inventoryRoute = require("./routes/inventoryRoute")
   ```
   …then register the router (near your other routes):
   ```js
   // Inventory routes
   app.use("/inv", inventoryRoute)
   ```
4. (Optional) Link the CSS in your head partial (e.g., `views/partials/head.ejs`):
   ```ejs
   <link rel="stylesheet" href="/css/inventory.css">
   ```

## What changed
- **New router** handles `/inv/type/:classificationId`.
- **Controller** queries DB, builds grid HTML, renders `views/inventory/classification.ejs`.
- **Model** now has:
  - `getClassifications()`
  - `getInventoryByClassificationId(classification_id)` — JOINs inventory and classification.
- **Utilities** has:
  - `getNav()` — builds dynamic nav
  - `buildClassificationGrid(data)` — formats vehicles into HTML list.
- **View** displays the `title`, *(future)* messages, and the unescaped `grid` HTML.

## Verify
- Start dev server: `pnpm run dev`
- Open: `http://localhost:5500/`
- Click any nav classification (e.g., SUVs). You should see inventory cards.
- Terminal logs should include an inventory SELECT similar to:
  `SELECT * FROM public.inventory AS i JOIN public.classification AS c ... WHERE i.classification_id = $1`

## Troubleshooting
- If page shows "no matching vehicles", confirm your DB has inventory rows with the chosen `classification_id`.
- If you get a 404, ensure `app.use("/inv", inventoryRoute)` is registered **after** your other middleware and before `app.listen`.
- If EJS errors about `grid` or `nav`, ensure the controller passes both values to `res.render`.
