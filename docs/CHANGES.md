# CSE340 Week 3 MVC Overlay (NEWREPO)

This package adds the required files for Week 3 "Content Delivery & MVC Pattern"
and updates the navigation partial to render dynamically from the database.

## Added files
- `controllers/baseController.js`
- `database/index.js`
- `models/inventory-model.js`
- `utilities/index.js`

## Updated files
- `views/partials/navigation.ejs` → replaced static list with `<%- nav %>`.

## Required edits in `server.js`
1. Add the require near the top (with other requires):
   ```js
   const baseController = require("./controllers/baseController");
   ```

2. Replace the existing index route with:
   ```js
   app.get("/", baseController.buildHome);
   ```

## .env (root)
Ensure your `.env` contains:
```
NODE_ENV=development
DATABASE_URL=YOUR_RENDER_EXTERNAL_DATABASE_URL
```

## Expected result
- Home page renders via MVC (Controller → Utility → Model → View).
- Navigation items come from `public.classification` table.
- Terminal logs queries: `executed query: SELECT * FROM public.classification ...`.

