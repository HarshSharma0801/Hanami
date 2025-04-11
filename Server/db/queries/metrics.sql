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



-- name: Get_CampaignEffectiveness :many
WITH campaign_metrics AS (
    SELECT 
        c.name AS campaign,
        COUNT(DISTINCT cl.id) AS total_clicks,
        COUNT(DISTINCT conv.id) AS total_conversions,
        COALESCE(SUM(s.amount), 0) AS total_sales,
        COUNT(DISTINCT tl.id) AS total_tracking_links
    FROM campaigns c
    LEFT JOIN tracking_links tl ON c.id = tl.campaign_id
    LEFT JOIN clicks cl ON tl.id = cl.tracking_link_id
    LEFT JOIN conversions conv ON cl.click_id = conv.click_id
    LEFT JOIN sales s ON c.brand_id = s.brand_id -- Removed date filtering
    WHERE c.brand_id = $1
    GROUP BY c.id, c.name
)
SELECT 
    cm.campaign,
    ROUND((cm.total_sales / 1000.0)::numeric, 1) AS roi, -- Placeholder: $1000 cost per campaign
    ROUND((cm.total_conversions::float / NULLIF(cm.total_clicks, 0) * 100)::numeric, 1) AS conversion_rate,
    ROUND((cm.total_clicks::float / NULLIF(cm.total_tracking_links, 0) * 10)::numeric, 1) AS engagement
FROM campaign_metrics cm
WHERE cm.total_clicks > 0 OR cm.total_conversions > 0 OR cm.total_sales > 0
ORDER BY cm.campaign;


-- name: Get_MetricsOverTime :many
WITH monthly_metrics AS (
    SELECT 
        TO_CHAR(cl.timestamp, 'YYYY-MM') AS date,
        COUNT(DISTINCT cl.id) AS total_clicks,
        COUNT(DISTINCT tl.id) AS total_tracking_links,
        COUNT(DISTINCT conv.id) AS total_conversions,
        COALESCE(SUM(conv.amount), 0) AS total_cost 
    FROM campaigns c
    JOIN tracking_links tl ON c.id = tl.campaign_id
    JOIN clicks cl ON tl.id = cl.tracking_link_id
    LEFT JOIN conversions conv ON cl.click_id = conv.click_id
    WHERE c.brand_id = $1
    GROUP BY TO_CHAR(cl.timestamp, 'YYYY-MM')
)
SELECT 
    mm.date,
    ROUND((mm.total_clicks::float / NULLIF(mm.total_tracking_links, 0) * 100)::numeric, 1) AS ctr,
    ROUND((mm.total_cost::float / NULLIF(mm.total_clicks, 0))::numeric, 2) AS cpc,
    ROUND((mm.total_conversions::float / NULLIF(mm.total_clicks, 0) * 100)::numeric, 1) AS conversion_rate
FROM monthly_metrics mm
WHERE mm.total_clicks > 0
ORDER BY mm.date;




-- name: GetCampaign_Specific_Effectiveness :many
WITH campaign_metrics AS (
    SELECT 
        c.id AS campaign_id,
        c.name AS campaign,
        COUNT(DISTINCT cl.id) AS total_clicks,
        COUNT(DISTINCT conv.id) AS total_conversions,
        COALESCE(SUM(s.amount), 0) AS total_sales,
        COUNT(DISTINCT tl.id) AS total_tracking_links
    FROM campaigns c
    LEFT JOIN tracking_links tl ON c.id = tl.campaign_id
    LEFT JOIN clicks cl ON tl.id = cl.tracking_link_id
    LEFT JOIN conversions conv ON cl.click_id = conv.click_id
    LEFT JOIN sales s ON c.brand_id = s.brand_id
    WHERE c.brand_id = $1
    GROUP BY c.id, c.name
),
max_metrics AS (
    SELECT 
        MAX(ROUND((total_sales / 1000.0)::numeric, 1)) AS max_roi,
        MAX(ROUND((total_conversions::float / NULLIF(total_clicks, 0) * 100)::numeric, 1)) AS max_conversion_rate,
        MAX(ROUND((total_clicks::float / NULLIF(total_tracking_links, 0) * 10)::numeric, 1)) AS max_engagement
    FROM campaign_metrics
)
SELECT 
    cm.campaign,
    ROUND((cm.total_sales / 1000.0)::numeric / mm.max_roi * 10, 1) AS roi,
    ROUND((cm.total_conversions::float / NULLIF(cm.total_clicks, 0) * 100)::numeric / mm.max_conversion_rate * 10, 1) AS conversion_rate,
    ROUND((cm.total_clicks::float / NULLIF(cm.total_tracking_links, 0) * 10)::numeric / mm.max_engagement * 10, 1) AS engagement
FROM campaign_metrics cm
CROSS JOIN max_metrics mm
WHERE (cm.total_clicks > 0 OR cm.total_conversions > 0 OR cm.total_sales > 0)
ORDER BY cm.campaign;



-- name: Get_BrandSalesRaw :many
SELECT 
    s.amount,
    s.currency,
    (SELECT COUNT(*) FROM campaigns c WHERE c.brand_id = b.id) AS total_campaigns
FROM brands b
LEFT JOIN sales s ON b.id = s.brand_id
WHERE b.id = $1
AND s.amount IS NOT NULL;