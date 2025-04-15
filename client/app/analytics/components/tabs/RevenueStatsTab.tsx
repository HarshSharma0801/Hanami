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
import { useBrand } from "@/providers/BrandProvider";
import { useQuery } from "@tanstack/react-query";
import { getRevenueStatsTabData } from "@/services/tab-analytics-service";
import { useState, useEffect } from "react";

interface RevenueStatsTabProps {
  data: any;
  container: any;
}

// Utility to add delay for retries
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Retry wrapper for API calls
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

export default function RevenueStatsTab({
  data,
  container,
}: RevenueStatsTabProps) {
  const { brand } = useBrand();
  const brandId = String(brand?.brand.ID) || "";

  // State for error handling
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Use a single query to fetch all data for this tab
  const { data: tabData, isLoading, error } = useQuery({
    queryKey: ["revenueStatsTab", brandId],
    queryFn: () => retryApi(() => getRevenueStatsTabData(brandId)),
    enabled: !!brandId,
  });

  useEffect(() => {
    if (error) {
      setErrorMessage("Failed to load revenue stats data. Please try again.");
      const timer = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If no data is available yet, use the mock data passed as props
  const displayData = tabData || data;

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl">
              {displayData.keyMetrics?.totalRevenue || data.keyMetrics.totalRevenue}
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
            <CardTitle className="text-2xl">
              {displayData.keyMetrics?.roi || data.keyMetrics.roi}
            </CardTitle>
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
          data={displayData.revenueData}
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
            data={displayData.campaignRevenue || [
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
              with the highest growth seen in June-July. The Summer Sale and
              Holiday Special campaigns have been the top revenue generators.
            </p>
            <h3 className="text-md font-semibold mt-4 mb-2">Opportunities</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Increase investment in successful campaign formats</li>
              <li>
                Optimize lower-performing campaigns like Brand Awareness
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
