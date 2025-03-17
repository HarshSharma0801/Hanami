-- name: Get_Affiliate_By_UserID :one
SELECT 
    id AS affiliate_id,
    user_id,
    campaign_id,
    created_at
FROM affiliates
WHERE user_id = $1;


-- name: Get_Affiliates_By_CampaignID :many
SELECT 
    a.id AS affiliate_id,
    a.user_id,
    a.created_at AS affiliate_created_at,
    u.username,
    u.email,
    u.role,
    u.created_at AS user_created_at,
    ac.created_at AS affiliate_campaign_created_at
FROM affiliate_campaigns ac
JOIN affiliates a ON ac.affiliate_id = a.id
JOIN users u ON a.user_id = u.id
WHERE ac.campaign_id = $1
ORDER BY ac.created_at DESC;


-- name: Check_Affiliate_By_UserID_CampaignID :one
SELECT EXISTS (
    SELECT 1
    FROM affiliates a
    JOIN affiliate_campaigns ac ON a.id = ac.affiliate_id
    WHERE a.user_id = $1 AND ac.campaign_id = $2
) AS exists;
