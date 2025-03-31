ALTER TABLE conversions ADD COLUMN new_click_id UUID;

UPDATE conversions SET new_click_id = gen_random_uuid(); 

ALTER TABLE conversions DROP COLUMN click_id;

ALTER TABLE conversions RENAME COLUMN new_click_id TO click_id;
