-- name: Get_Brand_By_UserID :one
SELECT 
    b.*,
    u.username,
    u.email,
    u.role
FROM brands b
JOIN users u ON b.user_id = u.id
WHERE b.user_id = $1;