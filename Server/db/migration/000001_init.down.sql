ALTER TABLE "conversions" DROP CONSTRAINT IF EXISTS "conversions_click_id_fkey";
ALTER TABLE "clicks" DROP CONSTRAINT IF EXISTS "clicks_tracking_link_id_fkey";
ALTER TABLE "tracking_links" DROP CONSTRAINT IF EXISTS "tracking_links_campaign_id_fkey";
ALTER TABLE "tracking_links" DROP CONSTRAINT IF EXISTS "tracking_links_affiliate_id_fkey";
ALTER TABLE "affiliate_campaigns" DROP CONSTRAINT IF EXISTS "affiliate_campaigns_campaign_id_fkey";
ALTER TABLE "affiliate_campaigns" DROP CONSTRAINT IF EXISTS "affiliate_campaigns_affiliate_id_fkey";
ALTER TABLE "affiliates" DROP CONSTRAINT IF EXISTS "affiliates_campaign_id_fkey";
ALTER TABLE "campaigns" DROP CONSTRAINT IF EXISTS "campaigns_brand_id_fkey";
ALTER TABLE "affiliates" DROP CONSTRAINT IF EXISTS "affiliates_user_id_fkey";
ALTER TABLE "brands" DROP CONSTRAINT IF EXISTS "brands_user_id_fkey";

DROP TABLE IF EXISTS "conversions";
DROP TABLE IF EXISTS "clicks";
DROP TABLE IF EXISTS "tracking_links";
DROP TABLE IF EXISTS "affiliate_campaigns";
DROP TABLE IF EXISTS "affiliates";
DROP TABLE IF EXISTS "campaigns";
DROP TABLE IF EXISTS "brands";
DROP TABLE IF EXISTS "users";
