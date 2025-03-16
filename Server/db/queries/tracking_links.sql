-- name: Create_TrackingLink :one
INSERT INTO tracking_links (
    affiliate_id,
    campaign_id,
    link_code,
    created_at
) VALUES (
    $1, $2, $3, CURRENT_TIMESTAMP
) RETURNING *;


-- name: Get_Tracking_By_Link :one
SELECT *
FROM tracking_links
WHERE id = $1;

-- name: Get_TrackingLink_By_Link_Code :one
SELECT *
FROM tracking_links
WHERE link_code = $1;

-- name: Get_TrackingLinks_By_Affiliate :many
SELECT *
FROM tracking_links
WHERE affiliate_id = $1
ORDER BY created_at DESC;


-- name: Get_TrackingLinks_By_Campaign :many
SELECT *
FROM tracking_links
WHERE campaign_id = $1
ORDER BY created_at DESC;


-- name: Delete_TrackingLink :exec
DELETE FROM tracking_links
WHERE id = $1;


-- name: Get_TrackingLink_For_Affiliate :one
SELECT 
    tl.link_code,
    tl.campaign_id,
    a.id AS affiliate_id,
    u.username
FROM users u
JOIN affiliates a ON u.id = a.user_id
JOIN tracking_links tl ON a.id = tl.affiliate_id
WHERE tl.campaign_id = $1 AND u.id = $2;