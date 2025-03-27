-- 20250315130000_add_utm_fields_to_clicks.up.sql
ALTER TABLE "clicks"
ADD COLUMN "utm_source" varchar,
ADD COLUMN "utm_medium" varchar;