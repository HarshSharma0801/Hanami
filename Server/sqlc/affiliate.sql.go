// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: affiliate.sql

package sqlc

import (
	"context"
	"database/sql"
)

const check_Affiliate_By_UserID_CampaignID = `-- name: Check_Affiliate_By_UserID_CampaignID :one
SELECT EXISTS (
    SELECT 1
    FROM affiliates a
    JOIN affiliate_campaigns ac ON a.id = ac.affiliate_id
    WHERE a.user_id = $1 AND ac.campaign_id = $2
) AS exists
`

type Check_Affiliate_By_UserID_CampaignIDParams struct {
	UserID     sql.NullInt64
	CampaignID int64
}

func (q *Queries) Check_Affiliate_By_UserID_CampaignID(ctx context.Context, arg Check_Affiliate_By_UserID_CampaignIDParams) (bool, error) {
	row := q.db.QueryRowContext(ctx, check_Affiliate_By_UserID_CampaignID, arg.UserID, arg.CampaignID)
	var exists bool
	err := row.Scan(&exists)
	return exists, err
}

const get_Affiliate_By_UserID = `-- name: Get_Affiliate_By_UserID :one
SELECT 
    id AS affiliate_id,
    user_id,
    campaign_id,
    created_at
FROM affiliates
WHERE user_id = $1
`

type Get_Affiliate_By_UserIDRow struct {
	AffiliateID int64
	UserID      sql.NullInt64
	CampaignID  int64
	CreatedAt   sql.NullTime
}

func (q *Queries) Get_Affiliate_By_UserID(ctx context.Context, userID sql.NullInt64) (Get_Affiliate_By_UserIDRow, error) {
	row := q.db.QueryRowContext(ctx, get_Affiliate_By_UserID, userID)
	var i Get_Affiliate_By_UserIDRow
	err := row.Scan(
		&i.AffiliateID,
		&i.UserID,
		&i.CampaignID,
		&i.CreatedAt,
	)
	return i, err
}

const get_Affiliates_By_CampaignID = `-- name: Get_Affiliates_By_CampaignID :many
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
ORDER BY ac.created_at DESC
`

type Get_Affiliates_By_CampaignIDRow struct {
	AffiliateID                int64
	UserID                     sql.NullInt64
	AffiliateCreatedAt         sql.NullTime
	Username                   string
	Email                      string
	Role                       string
	UserCreatedAt              sql.NullTime
	AffiliateCampaignCreatedAt sql.NullTime
	ClickCount                 int64
	ConversionCount            int64
	ClickIds                   interface{}
	ConversionIds              interface{}
}

func (q *Queries) Get_Affiliates_By_CampaignID(ctx context.Context, campaignID int64) ([]Get_Affiliates_By_CampaignIDRow, error) {
	rows, err := q.db.QueryContext(ctx, get_Affiliates_By_CampaignID, campaignID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Get_Affiliates_By_CampaignIDRow
	for rows.Next() {
		var i Get_Affiliates_By_CampaignIDRow
		if err := rows.Scan(
			&i.AffiliateID,
			&i.UserID,
			&i.AffiliateCreatedAt,
			&i.Username,
			&i.Email,
			&i.Role,
			&i.UserCreatedAt,
			&i.AffiliateCampaignCreatedAt,
			&i.ClickCount,
			&i.ConversionCount,
			&i.ClickIds,
			&i.ConversionIds,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}
