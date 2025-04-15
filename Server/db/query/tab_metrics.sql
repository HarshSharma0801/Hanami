-- name: GetCampaignAnalysisTabData :one
WITH campaign_effectiveness AS (
    SELECT json_agg(
        json_build_object(
            'Campaign', campaign,
            'Roi', roi,
            'ConversionRate', conversion_rate,
            'Engagement', engagement
        )
    ) AS effectiveness_data
    FROM (
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
            ROUND((cm.total_sales / 1000.0)::numeric / NULLIF(mm.max_roi, 0) * 10, 1) AS roi,
            ROUND((cm.total_conversions::float / NULLIF(cm.total_clicks, 0) * 100)::numeric / NULLIF(mm.max_conversion_rate, 0) * 10, 1) AS conversion_rate,
            ROUND((cm.total_clicks::float / NULLIF(cm.total_tracking_links, 0) * 10)::numeric / NULLIF(mm.max_engagement, 0) * 10, 1) AS engagement
        FROM campaign_metrics cm
        CROSS JOIN max_metrics mm
        WHERE (cm.total_clicks > 0 OR cm.total_conversions > 0 OR cm.total_sales > 0)
        ORDER BY cm.campaign
    ) AS campaign_effectiveness
),
campaign_specific AS (
    SELECT json_agg(
        json_build_object(
            'Campaign', campaign,
            'Roi', roi,
            'ConversionRate', conversion_rate,
            'Engagement', engagement
        )
    ) AS campaign_specific_data
    FROM (
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
            ROUND((cm.total_sales / 1000.0)::numeric / NULLIF(mm.max_roi, 0) * 10, 1) AS roi,
            ROUND((cm.total_conversions::float / NULLIF(cm.total_clicks, 0) * 100)::numeric / NULLIF(mm.max_conversion_rate, 0) * 10, 1) AS conversion_rate,
            ROUND((cm.total_clicks::float / NULLIF(cm.total_tracking_links, 0) * 10)::numeric / NULLIF(mm.max_engagement, 0) * 10, 1) AS engagement
        FROM campaign_metrics cm
        CROSS JOIN max_metrics mm
        WHERE (cm.total_clicks > 0 OR cm.total_conversions > 0 OR cm.total_sales > 0)
        ORDER BY cm.campaign
    ) AS campaign_specific
),
metrics_over_time AS (
    SELECT json_agg(
        json_build_object(
            'Date', date,
            'Ctr', ctr,
            'Cpc', cpc,
            'ConversionRate', conversion_rate
        )
    ) AS metrics_time_data
    FROM (
        WITH monthly_metrics AS (
            SELECT 
                TO_CHAR(cl.timestamp, 'YYYY-MM') AS date,
                COUNT(DISTINCT cl.id) AS clicks,
                COUNT(DISTINCT tl.id) AS impressions,
                COUNT(DISTINCT conv.id) AS conversions,
                COALESCE(SUM(conv.amount), 0) AS revenue
            FROM campaigns c
            LEFT JOIN tracking_links tl ON c.id = tl.campaign_id
            LEFT JOIN clicks cl ON tl.id = cl.tracking_link_id
            LEFT JOIN conversions conv ON cl.click_id = conv.click_id
            WHERE c.brand_id = $1
            GROUP BY TO_CHAR(cl.timestamp, 'YYYY-MM')
            ORDER BY date
        )
        SELECT 
            date,
            ROUND((clicks::float / NULLIF(impressions, 0) * 100)::numeric, 1) AS ctr,
            ROUND((revenue / NULLIF(clicks, 0))::numeric, 2) AS cpc,
            ROUND((conversions::float / NULLIF(clicks, 0) * 100)::numeric, 1) AS conversion_rate
        FROM monthly_metrics
        WHERE clicks > 0 OR conversions > 0 OR revenue > 0
    ) AS metrics_over_time
)
SELECT 
    campaign_effectiveness.effectiveness_data,
    campaign_specific.campaign_specific_data,
    metrics_over_time.metrics_time_data
FROM campaign_effectiveness, campaign_specific, metrics_over_time;

-- name: GetAudienceInsightsTabData :one
WITH utm_source_data AS (
    SELECT json_agg(
        json_build_object(
            'name', name,
            'value', value
        )
    ) AS utm_source
    FROM (
        SELECT 
            COALESCE(utm_source, 'Unknown') AS name,
            COUNT(*) AS value
        FROM clicks cl
        JOIN tracking_links tl ON cl.tracking_link_id = tl.id
        JOIN campaigns c ON tl.campaign_id = c.id
        WHERE c.brand_id = $1
        GROUP BY utm_source
        ORDER BY value DESC
        LIMIT 10
    ) AS utm_sources
),
utm_medium_data AS (
    SELECT json_agg(
        json_build_object(
            'name', name,
            'value', value
        )
    ) AS utm_medium
    FROM (
        SELECT 
            COALESCE(utm_medium, 'Unknown') AS name,
            COUNT(*) AS value
        FROM clicks cl
        JOIN tracking_links tl ON cl.tracking_link_id = tl.id
        JOIN campaigns c ON tl.campaign_id = c.id
        WHERE c.brand_id = $1
        GROUP BY utm_medium
        ORDER BY value DESC
        LIMIT 10
    ) AS utm_mediums
),
-- Mock data for audience demographics (would be replaced with real data in production)
audience_breakdown AS (
    SELECT json_agg(
        json_build_object(
            'name', name,
            'value', value
        )
    ) AS audience_data
    FROM (
        SELECT 'Age 18-24' AS name, 15 AS value
        UNION SELECT 'Age 25-34' AS name, 35 AS value
        UNION SELECT 'Age 35-44' AS name, 25 AS value
        UNION SELECT 'Age 45-54' AS name, 15 AS value
        UNION SELECT 'Age 55+' AS name, 10 AS value
    ) AS audience_breakdown
),
-- Mock data for geographic distribution (would be replaced with real data in production)
geographic_distribution AS (
    SELECT json_agg(
        json_build_object(
            'name', name,
            'value', value
        )
    ) AS geo_data
    FROM (
        SELECT 'United States' AS name, 45 AS value
        UNION SELECT 'United Kingdom' AS name, 15 AS value
        UNION SELECT 'Canada' AS name, 10 AS value
        UNION SELECT 'Australia' AS name, 8 AS value
        UNION SELECT 'Germany' AS name, 7 AS value
        UNION SELECT 'France' AS name, 5 AS value
        UNION SELECT 'Other' AS name, 10 AS value
    ) AS geo_distribution
),
-- Mock data for device stats (would be replaced with real data in production)
device_stats AS (
    SELECT json_agg(
        json_build_object(
            'name', name,
            'value', value
        )
    ) AS device_data
    FROM (
        SELECT 'Mobile' AS name, 55 AS value
        UNION SELECT 'Desktop' AS name, 35 AS value
        UNION SELECT 'Tablet' AS name, 10 AS value
    ) AS device_stats
)
SELECT 
    utm_source_data.utm_source,
    utm_medium_data.utm_medium,
    audience_breakdown.audience_data AS audience_breakdown,
    geographic_distribution.geo_data AS geographic_distribution,
    device_stats.device_data AS device_stats
FROM utm_source_data, utm_medium_data, audience_breakdown, geographic_distribution, device_stats;

-- name: GetRevenueStatsTabData :one
WITH key_metrics AS (
    SELECT json_build_object(
        'totalCampaigns', total_campaigns,
        'activeInfluencers', active_influencers,
        'totalReach', total_reach,
        'totalRevenue', total_revenue,
        'conversionRate', conversion_rate,
        'averageOrderValue', average_order_value,
        'roi', ROUND(CAST(total_revenue AS numeric) / 1000, 1)
    ) AS key_metrics_data
    FROM (
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
        FROM campaign_data, active_influencers_data, click_data, conversion_data
    ) AS metrics
),
revenue_data AS (
    SELECT json_agg(
        json_build_object(
            'month', month,
            'revenue', revenue
        )
    ) AS revenue_data
    FROM (
        WITH raw_revenue AS (
            SELECT 
                TO_CHAR(s.timestamp, 'Mon') AS month,
                COALESCE(SUM(s.amount), 0)::numeric(10, 2) AS raw_revenue,
                string_agg(DISTINCT s.currency, ', ') AS currencies
            FROM sales s
            JOIN brands b ON s.brand_id = b.id
            WHERE b.id = $1
            GROUP BY month
            ORDER BY to_date(month, 'Mon')
        )
        SELECT 
            month,
            CASE 
                WHEN LENGTH(currencies) > 0 THEN
                    raw_revenue * CASE 
                        WHEN currencies LIKE '%USD%' THEN 1.0
                        WHEN currencies LIKE '%INR%' THEN 0.012
                        WHEN currencies LIKE '%EUR%' THEN 1.08
                        ELSE 1.0
                    END
                ELSE raw_revenue
            END AS revenue
        FROM raw_revenue
    ) AS revenue_by_month
),
campaign_revenue AS (
    SELECT json_agg(
        json_build_object(
            'campaign', c.name,
            'revenue', COALESCE(SUM(conv.amount * conv.weight), 0)::numeric(10, 2)
        )
    ) AS campaign_revenue_data
    FROM campaigns c
    LEFT JOIN tracking_links tl ON c.id = tl.campaign_id
    LEFT JOIN clicks cl ON tl.id = cl.tracking_link_id
    LEFT JOIN conversions conv ON cl.click_id = conv.click_id
    WHERE c.brand_id = $1
    GROUP BY c.id, c.name
    ORDER BY COALESCE(SUM(conv.amount * conv.weight), 0) DESC
    LIMIT 5
)
SELECT 
    key_metrics.key_metrics_data,
    revenue_data.revenue_data,
    campaign_revenue.campaign_revenue_data
FROM key_metrics, revenue_data, campaign_revenue;
