-- 20250315130000_add_utm_fields_to_clicks.down.sql
ALTER TABLE "clicks"
DROP COLUMN "utm_source",
DROP COLUMN "utm_medium";