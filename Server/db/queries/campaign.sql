-- name: Create_Campaign :one
INSERT INTO campaigns (
    brand_id,
    name,
    description,
    commission_rate,
    landing_url,
    created_at
) VALUES (
    $1, $2, $3, $4, $5, CURRENT_TIMESTAMP
) RETURNING *;


-- name: Get_Campaign :one
SELECT *
FROM campaigns
WHERE id = $1;

-- name: Get_Campaigns_By_Brand :many
SELECT *
FROM campaigns
WHERE brand_id = $1
ORDER BY created_at DESC;

-- name: Update_Campaign :one
UPDATE campaigns
SET 
    name = $2,
    description = $3,
    commission_rate = $4,
    landing_url = $5
WHERE id = $1
RETURNING *;


-- name: DeleteCampaign :exec
DELETE FROM campaigns
WHERE id = $1;


-- name: Campaign_Exists_By_Name :one
SELECT EXISTS(SELECT 1 FROM campaigns WHERE name = $1);


-- name: Campaign_Exists_By_Id :one
SELECT EXISTS(SELECT 1 FROM campaigns WHERE id = $1);


-- name: Get_Campaigns_By_UserID_As_Affiliate :many
SELECT 
    c.id AS campaign_id,
    c.brand_id,
    c.name AS campaign_name,
    c.description AS campaign_description,
    c.commission_rate,
    c.landing_url,
    c.created_at AS campaign_created_at,
    ac.created_at AS affiliate_campaign_created_at,
    b.id AS brand_id,
    b.company_name,
    b.website,
    b.created_at AS brand_created_at
FROM users u
JOIN affiliates a ON u.id = a.user_id
JOIN affiliate_campaigns ac ON a.id = ac.affiliate_id
JOIN campaigns c ON ac.campaign_id = c.id
JOIN brands b ON c.brand_id = b.id
WHERE u.id = $1
ORDER BY c.created_at DESC;