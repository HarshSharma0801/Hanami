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

export default function OverviewTab({ data, container }: TabProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6">
        <MetricCard
          title="Total Campaigns"
          value={data.keyMetrics.totalCampaigns}
          icon={<Activity size={18} />}
          trend={{ value: 12, isUp: true }}
          color="bg-blue-500"
        />
        <MetricCard
          title="Active Influencers"
          value={data.keyMetrics.activeInfluencers}
          icon={<Users size={18} />}
          trend={{ value: 8, isUp: true }}
          color="bg-emerald-500"
        />
        <MetricCard
          title="Total Reach"
          value={data.keyMetrics.totalReach}
          icon={<Globe size={18} />}
          trend={{ value: 15, isUp: true }}
          color="bg-violet-500"
        />
        <MetricCard
          title="Avg. Engagement"
          value={data.keyMetrics.averageEngagement}
          icon={<TrendingUp size={18} />}
          trend={{ value: 3, isUp: true }}
          color="bg-amber-500"
        />
        <MetricCard
          title="Total Revenue"
          value={data.keyMetrics.totalRevenue}
          icon={<DollarSign size={18} />}
          trend={{ value: 20, isUp: true }}
          color="bg-rose-500"
        />
        <MetricCard
          title="ROI"
          value={data.keyMetrics.roi}
          icon={<Target size={18} />}
          trend={{ value: 6, isUp: true }}
          color="bg-cyan-500"
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-96">
          <AnimatedAreaChart
            title="Campaign Performance"
            subtitle="Impressions, clicks and conversions over time"
            data={data.campaignPerformance}
            dataKeys={{
              xAxis: "month",
              areas: [
                { key: "impressions", color: "#8884d8", name: "Impressions" },
                { key: "clicks", color: "#82ca9d", name: "Clicks" },
                { key: "conversions", color: "#ffc658", name: "Conversions" },
              ],
            }}
          />
        </div>
        <div className="h-96">
          <BarChartComponent
            title="Revenue By Month"
            subtitle="Monthly revenue in USD"
            data={data.revenueData}
            dataKeys={{
              xAxis: "month",
              bars: [{ key: "revenue", color: "#6366f1", name: "Revenue" }],
            }}
          />
        </div>
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-80">
          <PieChartComponent
            title="Audience Demographics"
            subtitle="Age group distribution"
            data={data.audienceBreakdown}
          />
        </div>
        <div className="h-80">
          <PieChartComponent
            title="Device Distribution"
            subtitle="Traffic by device type"
            data={data.deviceStats}
            colors={["#3b82f6", "#10b981", "#f59e0b"]}
          />
        </div>
        <div className="h-80">
          <PieChartComponent
            title="Geographic Distribution"
            subtitle="Traffic by country"
            data={data.geographicDistribution.slice(0, 5)}
            colors={["#6366f1", "#ec4899", "#14b8a6", "#f97316", "#8b5cf6"]}
          />
        </div>
      </div>
    </motion.div>
  );
}
