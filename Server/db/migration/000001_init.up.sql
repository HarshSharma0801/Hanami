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
  "user_id" bigint UNIQUE,
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
