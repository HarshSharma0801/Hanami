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