-- ==========================================
-- CSE340 - Assignment 2 (Task One / CRUD)
-- File: database/assignment2.sql
-- Run these in order in pgAdmin (Query Tool)
-- ==========================================

-- 1) INSERT Tony Stark (account_id and account_type handled by defaults)
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2) UPDATE Tony Stark: change account_type to 'Admin'
-- (Using email as a unique key for simplicity.)
UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- 3) DELETE Tony Stark
DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';

-- 4) DESCRIPTION UPDATE: Replace "small interiors" -> "a huge interior" for GM Hummer
-- (Single UPDATE using REPLACE — do not rewrite the whole description.)
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- 5) SELECT with JOIN: make, model, classification for the Sport category
-- Some cohorts use 'Sport', others 'Sports' — include both to return the expected 2 rows.
SELECT i.inv_make, i.inv_model, c.classification_name
FROM public.inventory i
JOIN public.classification c ON c.classification_id = i.classification_id
WHERE c.classification_name IN ('Sport','Sports');

-- 6) PATH UPDATE: add '/vehicles' into both image paths with a single query
UPDATE public.inventory
SET
  inv_image     = REPLACE(inv_image, '/images/', '/images/vehicles/'),
  inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
