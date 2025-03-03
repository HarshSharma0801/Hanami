-- name: Create_TrackingLink :one
INSERT INTO tracking_links (
    affiliate_id,
    campaign_id,
    link_code,
    created_at
) VALUES (
    $1, $2, $3, CURRENT_TIMESTAMP
) RETURNING *;


-- name: Get_TrackingLink :one
SELECT *
FROM tracking_links
WHERE id = $1;

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