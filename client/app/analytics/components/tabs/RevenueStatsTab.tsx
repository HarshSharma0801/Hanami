"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AnimatedAreaChart from "../AreaChart";
import BarChartComponent from "../BarChart";

interface RevenueStatsTabProps {
  data: any;
  container: any;
}

export default function RevenueStatsTab({
  data,
  container,
}: RevenueStatsTabProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl">
              {data.keyMetrics.totalRevenue}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-500">↑ 20% from previous period</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Avg. Revenue per Campaign</CardDescription>
            <CardTitle className="text-2xl">$2,987</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-500">↑ 15% from previous period</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>ROI</CardDescription>
            <CardTitle className="text-2xl">{data.keyMetrics.roi}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-500">↑ 6% from previous period</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Customer Acquisition Cost</CardDescription>
            <CardTitle className="text-2xl">$128</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-red-500">↓ 8% from previous period</p>
          </CardContent>
        </Card>
      </div>

      <div className="h-96">
        <AnimatedAreaChart
          title="Revenue Growth"
          subtitle="Monthly revenue trends"
          data={data.revenueData}
          dataKeys={{
            xAxis: "month",
            areas: [{ key: "revenue", color: "#6366f1", name: "Revenue ($)" }],
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-96">
          <BarChartComponent
            title="Campaign Revenue Comparison"
            subtitle="Revenue contribution by campaign"
            data={[
              { campaign: "Summer Sale", revenue: 42500 },
              { campaign: "Holiday Special", revenue: 37800 },
              { campaign: "Product Launch", revenue: 25600 },
              { campaign: "Brand Awareness", revenue: 12700 },
              { campaign: "Seasonal Promo", revenue: 18400 },
            ]}
            dataKeys={{
              xAxis: "campaign",
              bars: [{ key: "revenue", color: "#6366f1", name: "Revenue ($)" }],
            }}
          />
        </div>
        <Card className="border border-gray-200 rounded-lg shadow-sm">
          <CardHeader>
            <CardTitle>Revenue Insights</CardTitle>
            <CardDescription>Performance and opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Your revenue has shown a steady increase over the last 7 months,
              with the highest growth seen in June-July. The "Summer Sale" and
              "Holiday Special" campaigns have been the top revenue generators.
            </p>
            <h3 className="text-md font-semibold mt-4 mb-2">Opportunities</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Increase investment in successful campaign formats</li>
              <li>
                Optimize lower-performing campaigns like "Brand Awareness"
              </li>
              <li>Leverage seasonal trends for better revenue performance</li>
              <li>Focus on reducing customer acquisition costs</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
