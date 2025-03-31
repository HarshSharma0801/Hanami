ALTER TABLE "conversions"
ADD CONSTRAINT "fk_conversions_click" FOREIGN KEY ("click_id") REFERENCES "clicks" ("id") ON DELETE SET NULL;

ALTER TABLE "conversions" 
ALTER COLUMN amount TYPE FLOAT USING amount::DOUBLE PRECISION;

