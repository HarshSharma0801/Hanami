"use client";

import { motion } from "framer-motion";
import AnimatedAreaChart from "../AreaChart";
import BarChartComponent from "../BarChart";
import RadarChartComponent from "../RadarChart";
import { useBrand } from "@/providers/BrandProvider";
import { useQuery } from "@tanstack/react-query";
import {
  getCampaignEffectiveness,
  getCampaignSpecificEffectiveness,
  getMetricTime,
} from "@/services/analytics-service";

interface CampaignAnalysisTabProps {
  data: any;
  container: any;
}

export default function CampaignAnalysisTab({
  data,
  container,
}: CampaignAnalysisTabProps) {
  const { brand } = useBrand();

  const {
    data: campaignEffectiveness,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["campaignEffectiveness"],
    queryFn: () => getCampaignEffectiveness(String(brand?.brand.ID) || ""),
    enabled: !!brand?.brand.ID,
  });

  const { data: campaignSpecificEffectiveness } = useQuery({
    queryKey: ["campaign-specific-performance"],
    queryFn: () =>
      getCampaignSpecificEffectiveness(String(brand?.brand.ID) || ""),
    enabled: !!brand?.brand.ID,
  });

  const { data: metricsTime } = useQuery({
    queryKey: ["metricsTime"],
    queryFn: () => getMetricTime(String(brand?.brand.ID) || ""),
    enabled: !!brand?.brand.ID,
  });

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
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
