ALTER TABLE conversions 
ALTER COLUMN weight TYPE FLOAT USING 
  CASE 
    WHEN amount::FLOAT > 1 THEN 1 
    WHEN amount::FLOAT <= 0 THEN 0.01 
    ELSE amount::FLOAT 
  END;