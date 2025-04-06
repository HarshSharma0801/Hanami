-- name: Create_Sale :one
INSERT INTO sales (brand_id, amount, currency, timestamp)
VALUES ($1, $2, $3, $4)
ON CONFLICT (id) DO NOTHING
RETURNING id, brand_id, amount, currency, timestamp, created_at;