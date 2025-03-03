-- name: Create_User_Brand :one
INSERT INTO users (username, email, password_hash, role, created_at)
VALUES ($1, $2, $3, 'brand', CURRENT_TIMESTAMP)
RETURNING id;

-- name: Create_Brand :one
INSERT INTO brands (user_id, company_name, website, created_at)
VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
RETURNING id;

-- name: Create_User_Affiliate :one
INSERT INTO users (username, email, password_hash, role, created_at)
VALUES ($1, $2, $3, 'affiliate', CURRENT_TIMESTAMP)
RETURNING id;

-- name: Create_Affiliate :one
INSERT INTO affiliates (user_id, created_at)
VALUES ($1, CURRENT_TIMESTAMP)
RETURNING id;

-- name: Get_User_By_Email :one
SELECT *
FROM users
WHERE email = $1;

-- name: User_Exists_By_Email :one
SELECT EXISTS(SELECT 1 FROM users WHERE email = $1);


-- name: CreateSession :one
INSERT INTO sessions (
  id,
  email,
  refresh_token,
  user_agent,
  client_ip,
  is_blocked,
  expires_at
) VALUES (
  $1, $2 , $3 , $4 , $5, $6 , $7
) RETURNING *;

-- name: GetSession :one
SELECT * FROM sessions
WHERE id = $1 LIMIT 1;