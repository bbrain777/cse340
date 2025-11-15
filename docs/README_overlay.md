# CSE340 W03 MVC Overlay (Drop-in)

**How to use**
1. Extract this zip **into the root** of your CSE340 project (the folder with `server.js`).
2. Accept file creation prompts. Allow overwrite for `views/partials/navigation.ejs`.
3. Edit `server.js` per `docs/CHANGES.md` (require + route line).
4. Ensure `.env` has `NODE_ENV=development` and your `DATABASE_URL`.
5. Run:
   ```bash
   pnpm install
   pnpm run dev
   ```
6. Open http://localhost:5500 and check the nav and terminal logs.

If the nav is empty, verify your `classification` table has rows.
