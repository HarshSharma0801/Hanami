-- name: Create_Conversion :one
INSERT INTO conversions (
    click_id,
    amount,
    currency,
    weight,
    timestamp
) VALUES (
    $1, $2, $3, $4 ,CURRENT_TIMESTAMP
) RETURNING *;
