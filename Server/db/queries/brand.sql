-- name: Get_Brand_By_UserID :one
SELECT 
    b.*,
    u.username,
    u.email,
    u.role
FROM brands b
JOIN users u ON b.user_id = u.id
WHERE b.user_id = $1;


-- name: Get_BrandID_By_TrackingCode :one
SELECT c.brand_id
FROM tracking_links tl
JOIN campaigns c ON tl.campaign_id = c.id
WHERE tl.link_code = $1
LIMIT 1;