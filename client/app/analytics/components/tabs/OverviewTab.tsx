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
import { TabProps } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { useBrand } from "@/providers/BrandProvider";
import {
  getCampaignPerformance,
  getKeyMetrics,
  getRevenue,
  getUTM,
} from "@/services/analytics-service";

export default function OverviewTab({ container }: any) {
  const { brand } = useBrand();

  const {
    data: keyMetrics,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["keymetrics"],
    queryFn: () => getKeyMetrics(String(brand?.brand.ID) || ""),
    enabled: !!brand?.brand.ID,
  });

  const { data: campaignPerformance } = useQuery({
    queryKey: ["campaign-performance"],
    queryFn: () => getCampaignPerformance(String(brand?.brand.ID) || ""),
    enabled: !!brand?.brand.ID,
  });

  const { data: revenueData } = useQuery({
    queryKey: ["revenue"],
    queryFn: () => getRevenue(String(brand?.brand.ID) || ""),
    enabled: !!brand?.brand.ID,
  });

  const { data: utm } = useQuery({
    queryKey: ["utm"],
    queryFn: () => getUTM(String(brand?.brand.ID) || ""),
    enabled: !!brand?.brand.ID,
  });

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Key Metrics */}
      {keyMetrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6">
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
        </div>
        <div className="h-96">
          <BarChartComponent
            title="Revenue By Month"
            subtitle="Monthly revenue in USD"
            data={revenueData}
            dataKeys={{
              xAxis: "month",
              bars: [{ key: "revenue", color: "#6366f1", name: "Revenue" }],
            }}
          />
        </div>
      </div>

      {/* Secondary Charts */}
      {utm && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-80">
            {utm.utmSource?.length > 0 && (
              <PieChartComponent
                title="Traffic Source"
                subtitle="Clicks by Source"
                data={utm.utmSource.map((item: any) => ({
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
            {utm.utmMedium?.length > 0 && (
              <PieChartComponent
                title="Traffic Medium"
                subtitle="Clicks by Medium"
                data={utm.utmMedium.map((item: any) => ({
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
