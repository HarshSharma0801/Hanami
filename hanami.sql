
CREATE TABLE "users" (
  "id" bigserial PRIMARY KEY,
  "username" varchar UNIQUE NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "password_hash" varchar NOT NULL,
  "role" varchar NOT NULL,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "brands" (
  "id" bigserial PRIMARY KEY,
  "user_id" bigint UNIQUE,
  "company_name" varchar NOT NULL,
  "website" varchar,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "affiliates" (
  "id" bigserial PRIMARY KEY,
  "user_id" bigint,
  "campaign_id" bigint NOT NULL,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "campaigns" (
  "id" bigserial PRIMARY KEY,
  "brand_id" bigint,
  "name" varchar NOT NULL,
  "description" text,
  "commission_rate" decimal NOT NULL,
  "landing_url" varchar NOT NULL,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "affiliate_campaigns" (
  "affiliate_id" bigint,
  "campaign_id" bigint,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP),
  PRIMARY KEY ("affiliate_id", "campaign_id")
);

CREATE TABLE "tracking_links" (
  "id" bigserial PRIMARY KEY,
  "affiliate_id" bigint,
  "campaign_id" bigint,
  "link_code" varchar UNIQUE NOT NULL,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "clicks" (
  "id" bigserial PRIMARY KEY,
  "tracking_link_id" bigint,
  "click_id" uuid UNIQUE NOT NULL,
  "user_ip" varchar NOT NULL,
  "user_agent" text,
  "referrer" varchar,
  "timestamp" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "conversions" (
  "id" bigserial PRIMARY KEY,
  "click_id" bigint,
  "amount" decimal NOT NULL,
  "timestamp" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "sessions" (
  "id" uuid PRIMARY KEY,
  "email" varchar NOT NULL,
  "refresh_token" varchar NOT NULL,
  "user_agent" varchar NOT NULL,
  "client_ip" varchar NOT NULL,
  "is_blocked" boolean NOT NULL DEFAULT false,
  "expires_at" timestamptz NOT NULL DEFAULT now(),
  "created_at" timestamptz NOT NULL DEFAULT now()
);

COMMENT ON COLUMN "users"."role" IS 'enum: brand, affiliate';

ALTER TABLE "brands" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "affiliates" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "affiliates" ADD FOREIGN KEY ("campaign_id") REFERENCES "campaigns" ("id");
ALTER TABLE "campaigns" ADD FOREIGN KEY ("brand_id") REFERENCES "brands" ("id");
ALTER TABLE "affiliate_campaigns" ADD FOREIGN KEY ("affiliate_id") REFERENCES "affiliates" ("id");
ALTER TABLE "affiliate_campaigns" ADD FOREIGN KEY ("campaign_id") REFERENCES "campaigns" ("id");
ALTER TABLE "tracking_links" ADD FOREIGN KEY ("affiliate_id") REFERENCES "affiliates" ("id");
ALTER TABLE "tracking_links" ADD FOREIGN KEY ("campaign_id") REFERENCES "campaigns" ("id");
ALTER TABLE "clicks" ADD FOREIGN KEY ("tracking_link_id") REFERENCES "tracking_links" ("id");
ALTER TABLE "conversions" ADD FOREIGN KEY ("click_id") REFERENCES "clicks" ("id");
ALTER TABLE "sessions" ADD FOREIGN KEY ("email") REFERENCES "users" ("email");

-- Migration: 000002_invites.up.sql
CREATE TABLE "invites" (
  "id" bigserial PRIMARY KEY,
  "campaign_id" bigint NOT NULL,
  "user_id" bigint NOT NULL,
  "status" varchar NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  "invited_at" timestamp DEFAULT (CURRENT_TIMESTAMP),
  "responded_at" timestamp,
  CONSTRAINT "fk_invites_campaign" FOREIGN KEY ("campaign_id") REFERENCES "campaigns" ("id") ON DELETE CASCADE,
  CONSTRAINT "fk_invites_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
);

-- Migration: 000003_click_table-alter.up.sql
ALTER TABLE "clicks"
ADD COLUMN "utm_source" varchar,
ADD COLUMN "utm_medium" varchar;

-- Migration: 000005_currency_init.up.sql
ALTER TABLE "conversions"
ADD COLUMN "currency" varchar(3)
CHECK (currency IN ('USD', 'INR'));

-- Migration: 000006_currency_init.up.sql
ALTER TABLE "conversions"
ADD CONSTRAINT "fk_conversions_click" FOREIGN KEY ("click_id") REFERENCES "clicks" ("id") ON DELETE SET NULL;

ALTER TABLE "conversions" 
ALTER COLUMN amount TYPE FLOAT USING amount::DOUBLE PRECISION;

-- Migration: 000007_click_init.up.sql
ALTER TABLE conversions ADD COLUMN new_click_id UUID;
UPDATE conversions SET new_click_id = gen_random_uuid(); 
ALTER TABLE conversions DROP COLUMN click_id;
ALTER TABLE conversions RENAME COLUMN new_click_id TO click_id;

-- Migration: 000008_weight_init.up.sql
ALTER TABLE conversions 
ADD COLUMN weight DECIMAL CHECK (weight > 0 AND weight <= 1);

-- Migration: 000009_weight_float.up.sql
ALTER TABLE conversions DROP COLUMN weight;
ALTER TABLE conversions 
ADD COLUMN weight DOUBLE PRECISION CHECK (weight > 0 AND weight <= 1);

-- Migration: 000010_weight_refactor.up.sql
ALTER TABLE conversions 
ALTER COLUMN weight TYPE FLOAT USING 
  CASE 
    WHEN amount::FLOAT > 1 THEN 1 
    WHEN amount::FLOAT <= 0 THEN 0.01 
    ELSE amount::FLOAT 
  END;

-- Migration: 000011_sales.up.sql
CREATE TABLE sales (
    id bigserial PRIMARY KEY,
    brand_id bigint NOT NULL REFERENCES brands(id),
    amount decimal NOT NULL,
    currency varchar(3) NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'INR', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD')),
    timestamp timestamp DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sales_brand_id ON sales(brand_id);
CREATE INDEX idx_sales_timestamp ON sales(timestamp);
