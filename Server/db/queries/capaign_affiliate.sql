-- name: Create_Affiliate_Campaign :one
INSERT INTO affiliate_campaigns (
    affiliate_id,
    campaign_id,
    created_at
) VALUES (
    $1, $2, CURRENT_TIMESTAMP
) RETURNING *;


-- name: Get_Affiliate_Campaign :one
SELECT *
FROM affiliate_campaigns
WHERE affiliate_id = $1 AND campaign_id = $2;


-- name: Get_Campaigns_By_Affiliate :many
SELECT *
FROM affiliate_campaigns
WHERE affiliate_id = $1
ORDER BY created_at DESC;


-- name: Get_Affiliates_By_Campaign :many
SELECT *
FROM affiliate_campaigns
WHERE campaign_id = $1
ORDER BY created_at DESC;


-- name: Delete_Affiliate_Campaign :exec
DELETE FROM affiliate_campaigns
WHERE affiliate_id = $1 AND campaign_id = $2;