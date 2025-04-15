"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Users,
  Globe,
  DollarSign,
  Target,
  TrendingUp,
} from "lucide-react";
import AnimatedAreaChart from "../AreaChart";
import PieChartComponent from "../PieChart";
import BarChartComponent from "../BarChart";
import MetricCard from "../MetricCard";
import { useQuery } from "@tanstack/react-query";
import { useBrand } from "@/providers/BrandProvider";
import { getOverviewTabData } from "@/services/tab-analytics-service";
import { useState, useEffect } from "react";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function retryApi<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.warn(`Retry ${i + 1}/${maxRetries} for API call`);
      await delay(1000 * (i + 1)); // Exponential backoff
    }
  }
  throw new Error("Max retries reached");
}

export default function OverviewTab({ container }: any) {
  const { brand } = useBrand();
  const brandId = String(brand?.brand.ID) || "";

  // State for error handling
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Use a single query to fetch all data for this tab
  const { data: tabData, isLoading, error } = useQuery({
    queryKey: ["overviewTab", brandId],
    queryFn: () => retryApi(() => getOverviewTabData(brandId)),
    enabled: !!brandId,
  });

  // Extract data from the consolidated response
  const keyMetrics = tabData?.keyMetrics;
  const campaignPerformance = tabData?.campaignPerformance;
  const revenueData = tabData?.revenueData;
  const utm = tabData?.utm;

  // Clear error message after 5 seconds
  useEffect(() => {
    if (error) {
      setErrorMessage("Failed to load overview data. Please try again.");
      const timer = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Error Message */}
      {errorMessage && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
          role="alert"
        >
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Key Metrics */}
      {keyMetrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <MetricCard
            title="Total Campaigns"
            value={keyMetrics.TotalCampaigns}
            icon={<Activity size={18} />}
            trend={{ value: 12, isUp: true }}
            color="bg-blue-500"
          />
          <MetricCard
            title="Active Influencers"
            value={keyMetrics.ActiveInfluencers}
            icon={<Users size={18} />}
            trend={{ value: 8, isUp: true }}
            color="bg-emerald-500"
          />
          <MetricCard
            title="Total Reach"
            value={keyMetrics.TotalReach}
            icon={<Globe size={18} />}
            trend={{ value: 15, isUp: true }}
            color="bg-violet-500"
          />
          <MetricCard
            title="Avg. Engagement"
            value={keyMetrics.ConversionRate}
            icon={<TrendingUp size={18} />}
            trend={{ value: 3, isUp: true }}
            color="bg-amber-500"
          />
          <MetricCard
            title="Total Revenue"
            value={keyMetrics.TotalRevenue}
            icon={<DollarSign size={18} />}
            trend={{ value: 20, isUp: true }}
            color="bg-rose-500"
          />
          <MetricCard
            title="ROI"
            value={keyMetrics.AverageOrderValue}
            icon={<Target size={18} />}
            trend={{ value: 6, isUp: true }}
            color="bg-cyan-500"
          />
        </div>
      )}

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-96">
          {campaignPerformance && (
            <AnimatedAreaChart
              title="Campaign Performance"
              subtitle="Impressions, clicks and conversions over time"
              data={campaignPerformance}
              dataKeys={{
                xAxis: "month",
                areas: [
                  { key: "Impressions", color: "#8884d8", name: "Impressions" },
                  { key: "Clicks", color: "#82ca9d", name: "Clicks" },
                  { key: "Conversions", color: "#ffc658", name: "Conversions" },
                ],
              }}
            />
          )}
        </div>
        <div className="h-96">
          {revenueData && (
            <BarChartComponent
              title="Revenue By Month"
              subtitle="Monthly revenue in USD"
              data={revenueData}
              dataKeys={{
                xAxis: "month",
                bars: [{ key: "revenue", color: "#6366f1", name: "Revenue" }],
              }}
            />
          )}
        </div>
      </div>

      {/* Secondary Charts */}
      {utm && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-80">
            {utm.source?.length > 0 && (
              <PieChartComponent
                title="Traffic Source"
                subtitle="Clicks by Source"
                data={utm.source.map((item: any) => ({
                  name: item.Name,
                  value: item.Value,
                }))}
                colors={[
                  "#3b82f6",
                  "#10b981",
                  "#f59e0b",
                  "#6366f1",
                  "#ec4899",
                  "#14b8a6",
                  "#f97316",
                ]}
              />
            )}
          </div>
          <div className="h-80">
            {utm.medium?.length > 0 && (
              <PieChartComponent
                title="Traffic Medium"
                subtitle="Clicks by Medium"
                data={utm.medium.map((item: any) => ({
                  name: item.Name,
                  value: item.Value,
                }))}
                colors={[
                  "#6366f1",
                  "#ec4899",
                  "#14b8a6",
                  "#f97316",
                  "#8b5cf6",
                  "#3b82f6",
                  "#10b981",
                ]}
              />
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
