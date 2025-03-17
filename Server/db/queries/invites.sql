-- name: Create_Invite :one
INSERT INTO invites (
    campaign_id,
    user_id,
    status,
    invited_at
) VALUES (
    $1, $2, 'pending', CURRENT_TIMESTAMP
) RETURNING *;


-- name: Check_Invite :one
SELECT EXISTS (
    SELECT 1
    FROM invites
    WHERE campaign_id = $1 
    AND user_id = $2 
    AND status IN ('pending', 'accepted')
) AS exists;


-- name: Get_Pending_Invites_By_UserID :many
SELECT 
    i.id,
    i.campaign_id,
    i.user_id,
    i.status,
    i.invited_at,
    i.responded_at,
    c.name AS campaign_name,
    c.description AS campaign_description,
    c.commission_rate,
    c.landing_url,
    c.created_at AS campaign_created_at,
    b.id AS brand_id,
    b.company_name,
    b.website,
    b.created_at AS brand_created_at
FROM invites i
JOIN campaigns c ON i.campaign_id = c.id
JOIN brands b ON c.brand_id = b.id
WHERE i.user_id = $1 AND i.status = 'pending'
ORDER BY i.invited_at DESC;

-- name: Delete_Invite_By_ID :exec
DELETE FROM invites
WHERE id = $1;

-- name: Get_Invite_By_ID :one
SELECT id, campaign_id, user_id, status, invited_at, responded_at
FROM invites
WHERE id = $1;