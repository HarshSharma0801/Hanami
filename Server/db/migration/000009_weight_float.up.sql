ALTER TABLE conversions DROP COLUMN weight;

ALTER TABLE conversions 
ADD COLUMN weight DOUBLE PRECISION CHECK (weight > 0 AND weight <= 1);
