ALTER TABLE conversions 
ADD COLUMN weight DECIMAL CHECK (weight > 0 AND weight <= 1);
