ALTER TABLE "conversions"
ADD COLUMN "currency" varchar(3)
CHECK (currency IN ('USD', 'INR'));