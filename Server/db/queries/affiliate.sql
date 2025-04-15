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
    ac.created_at AS affiliate_campaign_created_at,
    COUNT(DISTINCT c.id) AS click_count,
    COUNT(DISTINCT conv.id) AS conversion_count,
    ARRAY_AGG(DISTINCT c.click_id) FILTER (WHERE c.click_id IS NOT NULL) AS click_ids,
    ARRAY_AGG(DISTINCT conv.id) FILTER (WHERE conv.id IS NOT NULL) AS conversion_ids
FROM affiliate_campaigns ac
JOIN affiliates a ON ac.affiliate_id = a.id
JOIN users u ON a.user_id = u.id
LEFT JOIN tracking_links tl ON tl.affiliate_id = a.id AND tl.campaign_id = ac.campaign_id
LEFT JOIN clicks c ON c.tracking_link_id = tl.id
LEFT JOIN conversions conv ON conv.click_id = c.click_id
WHERE ac.campaign_id = $1
GROUP BY 
    a.id,
    a.user_id,
    a.created_at,
    u.username,
    u.email,
    u.role,
    u.created_at,
    ac.created_at
ORDER BY ac.created_at DESC;



-- name: Check_Affiliate_By_UserID_CampaignID :one
SELECT EXISTS (
    SELECT 1
    FROM affiliates a
    JOIN affiliate_campaigns ac ON a.id = ac.affiliate_id
    WHERE a.user_id = $1 AND ac.campaign_id = $2
) AS exists;
