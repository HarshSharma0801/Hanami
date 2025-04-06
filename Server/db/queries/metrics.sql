-- name: Get_Brand_Key_Metrics :one
WITH campaign_data AS (
    SELECT 
        COUNT(*) AS total_campaigns
    FROM campaigns
    WHERE campaigns.brand_id = $1
),
active_influencers_data AS (
    SELECT 
        COUNT(DISTINCT a.id) AS active_influencers
    FROM affiliates a
    JOIN tracking_links tl ON a.id = tl.affiliate_id
    JOIN campaigns c ON tl.campaign_id = c.id
    JOIN clicks cl ON tl.id = cl.tracking_link_id
    WHERE c.brand_id = $1
    AND cl.timestamp >= NOW() - INTERVAL '30 days'
),
click_data AS (
    SELECT 
        COUNT(*) AS total_reach
    FROM clicks cl
    JOIN tracking_links tl ON cl.tracking_link_id = tl.id
    JOIN campaigns c ON tl.campaign_id = c.id
    WHERE c.brand_id = $1
),
conversion_data AS (
    SELECT 
        COALESCE(SUM(conv.amount * conv.weight), 0)::numeric(10, 2) AS total_revenue,
        COALESCE((COUNT(DISTINCT conv.id) * 100.0 / NULLIF(COUNT(cl.id), 0)), 0)::numeric(10, 1) AS conversion_rate,
        COALESCE((SUM(conv.amount * conv.weight) / NULLIF(COUNT(DISTINCT conv.id), 0)), 0)::numeric(10, 2) AS average_order_value
    FROM clicks cl
    JOIN tracking_links tl ON cl.tracking_link_id = tl.id
    JOIN campaigns c ON tl.campaign_id = c.id
    LEFT JOIN conversions conv ON cl.click_id = conv.click_id
    WHERE c.brand_id = $1
)
SELECT 
    campaign_data.total_campaigns,
    active_influencers_data.active_influencers,
    click_data.total_reach,
    conversion_data.total_revenue,
    conversion_data.conversion_rate,
    conversion_data.average_order_value
FROM campaign_data, active_influencers_data, click_data, conversion_data;




-- name: Get_Campaign_Performance :many
SELECT 
    TO_CHAR(cl.timestamp, 'Mon') AS month,
    COUNT(cl.id) AS impressions, -- Total clicks as a proxy for impressions
    COUNT(cl.id) AS clicks,     -- Total clicks
    COUNT(DISTINCT conv.id) AS conversions
FROM clicks cl
JOIN tracking_links tl ON cl.tracking_link_id = tl.id
JOIN campaigns c ON tl.campaign_id = c.id
LEFT JOIN conversions conv ON cl.click_id = conv.click_id
WHERE c.brand_id = $1
GROUP BY TO_CHAR(cl.timestamp, 'Mon')
ORDER BY MIN(cl.timestamp);


-- name: Get_Revenue_Data :many
SELECT 
    TO_CHAR(s.timestamp, 'Mon') AS month,
    COALESCE(SUM(s.amount), 0)::numeric(10, 2) AS raw_revenue,
    STRING_AGG(DISTINCT s.currency, ', ') AS currencies -- Track currencies for logging
FROM sales s
WHERE s.brand_id = $1
GROUP BY TO_CHAR(s.timestamp, 'Mon')
ORDER BY MIN(s.timestamp);



-- name: Get_UTMSource_Counts :many
SELECT 
    COALESCE(utm_source, 'Unknown') AS name,
    COUNT(*) AS value
FROM clicks cl
JOIN tracking_links tl ON cl.tracking_link_id = tl.id
JOIN campaigns c ON tl.campaign_id = c.id
WHERE c.brand_id = $1
GROUP BY utm_source
ORDER BY value DESC;

-- name: Get_UTMMedium_Counts :many
SELECT 
    COALESCE(utm_medium, 'Unknown') AS name,
    COUNT(*) AS value
FROM clicks cl
JOIN tracking_links tl ON cl.tracking_link_id = tl.id
JOIN campaigns c ON tl.campaign_id = c.id
WHERE c.brand_id = $1
GROUP BY utm_medium
ORDER BY value DESC;