-- name: Create_Click :one
INSERT INTO clicks (
    tracking_link_id,
    click_id,
    user_ip,
    user_agent,
    referrer,
    timestamp
) VALUES (
    $1, $2, $3, $4, $5, CURRENT_TIMESTAMP
) RETURNING *;

-- name: Get_Click_By_ID :one
SELECT *
FROM clicks
WHERE id = $1;


-- name: Get_Click_By_ClickID :one
SELECT *
FROM clicks
WHERE click_id = $1;