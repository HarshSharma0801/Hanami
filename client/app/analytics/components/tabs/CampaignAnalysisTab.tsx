"use client";

import { motion } from "framer-motion";
import AnimatedAreaChart from "../AreaChart";
import BarChartComponent from "../BarChart";
import RadarChartComponent from "../RadarChart";
import { useBrand } from "@/providers/BrandProvider";
import { useQueries } from "@tanstack/react-query";
import {
  getCampaignEffectiveness,
  getCampaignSpecificEffectiveness,
  getMetricTime,
} from "@/services/analytics-service";
import { useState, useEffect } from "react";

interface CampaignAnalysisTabProps {
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

export default function CampaignAnalysisTab({
  data,
  container,
}: CampaignAnalysisTabProps) {
  const { brand } = useBrand();
  const brandId = String(brand?.brand.ID) || "";

  // State for error handling
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Use useQueries to manage all API calls
  const queries = useQueries({
    queries: [
      {
        queryKey: ["campaignEffectiveness", brandId],
        queryFn: () => retryApi(() => getCampaignEffectiveness(brandId)),
        enabled: !!brandId,
        retry: false, // Handled by retryApi
      },
      {
        queryKey: ["campaign-specific-performance", brandId],
        queryFn: () =>
          retryApi(() => getCampaignSpecificEffectiveness(brandId)),
        enabled: !!brandId,
        retry: false,
      },
      {
        queryKey: ["metricsTime", brandId],
        queryFn: () => retryApi(() => getMetricTime(brandId)),
        enabled: !!brandId,
        retry: false,
      },
    ],
  });

  const [
    campaignEffectivenessQuery,
    campaignSpecificEffectivenessQuery,
    metricsTimeQuery,
  ] = queries;
  const campaignEffectiveness = campaignEffectivenessQuery.data;
  const campaignSpecificEffectiveness = campaignSpecificEffectivenessQuery.data;
  const metricsTime = metricsTimeQuery.data;
  const isLoading = queries.some((query) => query.isLoading);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

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

      {/* Campaign Performance Metrics */}
      <div className="grid grid-cols-1 gap-6">
        <div className="h-96">
          {campaignEffectiveness && (
            <BarChartComponent
              title="Campaign Performance Metrics"
              subtitle="ROI, Conversion Rate and Engagement by campaign"
              data={campaignEffectiveness}
              dataKeys={{
                xAxis: "Campaign",
                bars: [
                  { key: "Roi", color: "#6366f1", name: "ROI" },
                  {
                    key: "ConversionRate",
                    color: "#f97316",
                    name: "Conversion Rate (%)",
                  },
                  {
                    key: "Engagement",
                    color: "#14b8a6",
                    name: "Engagement (%)",
                  },
                ],
              }}
            />
          )}
        </div>
      </div>

      {/* Metrics Over Time */}
      <div className="h-96">
        {metricsTime && (
          <AnimatedAreaChart
            title="Metrics Over Time"
            subtitle="CTR, CPC, and Conversion Rate trends"
            data={metricsTime}
            dataKeys={{
              xAxis: "Date",
              areas: [
                {
                  key: "Ctr",
                  color: "#6366f1",
                  name: "Click-Through Rate (%)",
                },
                {
                  key: "Cpc",
                  color: "#f97316",
                  name: "Cost Per Click ($)",
                },
                {
                  key: "ConversionRate",
                  color: "#14b8a6",
                  name: "Conversion Rate (%)",
                },
              ],
            }}
          />
        )}
      </div>
    </motion.div>
  );
}
