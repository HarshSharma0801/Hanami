-- name: Get_Affiliate_By_UserID :one
SELECT 
    id AS affiliate_id,
    user_id,
    campaign_id,
    created_at
FROM affiliates
WHERE user_id = $1;