"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PieChartComponent from "../PieChart";
import BarChartComponent from "../BarChart";
import { useBrand } from "@/providers/BrandProvider";
import { useQuery } from "@tanstack/react-query";
import { getAudienceInsightsTabData } from "@/services/tab-analytics-service";
import { useState, useEffect } from "react";

interface AudienceInsightsTabProps {
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

export default function AudienceInsightsTab({
  data,
  container,
}: AudienceInsightsTabProps) {
  const { brand } = useBrand();
  const brandId = String(brand?.brand.ID) || "";
  
  // State for error handling
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Use a single query to fetch all data for this tab
  const { data: tabData, isLoading, error } = useQuery({
    queryKey: ["audienceInsightsTab", brandId],
    queryFn: () => retryApi(() => getAudienceInsightsTabData(brandId)),
    enabled: !!brandId,
  });

  useEffect(() => {
    if (error) {
      setErrorMessage("Failed to load audience insights data. Please try again.");
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-96">
          <PieChartComponent
            title="Audience Demographics"
            subtitle="Detailed breakdown by age group"
            data={displayData.audienceBreakdown}
            colors={["#6366f1", "#ec4899", "#14b8a6", "#f97316", "#8b5cf6"]}
          />
        </div>
        <div className="h-96">
          <PieChartComponent
            title="Geographic Distribution"
            subtitle="Audience by country"
            data={displayData.geographicDistribution}
            colors={[
              "#6366f1",
              "#ec4899",
              "#14b8a6",
              "#f97316",
              "#8b5cf6",
              "#ef4444",
              "#84cc16",
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80">
          <BarChartComponent
            title="Device Distribution"
            subtitle="Traffic and engagement by device type"
            data={displayData.deviceStats}
            dataKeys={{
              xAxis: "name",
              bars: [
                {
                  key: "value",
                  color: "#6366f1",
                  name: "Percentage (%)",
                },
              ],
            }}
          />
        </div>
        <Card className="border border-gray-200 rounded-lg shadow-sm">
          <CardHeader>
            <CardTitle>Audience Engagement Summary</CardTitle>
            <CardDescription>Key insights and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Your audience is primarily composed of users in the 25-34 age
              range (35%), followed by 35-44 (25%), with most users accessing
              from mobile devices (55%). The majority are based in the United
              States (45%) and United Kingdom (15%).
            </p>
            <h3 className="text-md font-semibold mt-4 mb-2">Recommendations</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Optimize content for mobile viewers</li>
              <li>Target campaigns to the 25-44 age demographic</li>
              <li>Focus on US and UK markets for maximum engagement</li>
              <li>Create content that appeals to professional audiences</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
