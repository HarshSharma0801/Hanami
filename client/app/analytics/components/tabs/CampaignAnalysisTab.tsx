"use client";

import { motion } from "framer-motion";
import AnimatedAreaChart from "../AreaChart";
import BarChartComponent from "../BarChart";
import RadarChartComponent from "../RadarChart";

interface CampaignAnalysisTabProps {
  data: any;
  container: any;
}

export default function CampaignAnalysisTab({
  data,
  container,
}: CampaignAnalysisTabProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-96">
          <BarChartComponent
            title="Campaign Performance Metrics"
            subtitle="ROI, Conversion Rate and Engagement by campaign"
            data={data.campaignEffectiveness}
            dataKeys={{
              xAxis: "campaign",
              bars: [
                { key: "roi", color: "#6366f1", name: "ROI" },
                {
                  key: "conversionRate",
                  color: "#f97316",
                  name: "Conversion Rate (%)",
                },
                {
                  key: "engagement",
                  color: "#14b8a6",
                  name: "Engagement (%)",
                },
              ],
            }}
          />
        </div>
        <div className="h-96">
          <RadarChartComponent
            title="Campaign Effectiveness"
            subtitle="Performance across key metrics"
            data={data.campaignEffectiveness}
            dataKeys={{
              nameKey: "campaign",
              radars: [
                { key: "roi", color: "#6366f1", name: "ROI" },
                {
                  key: "conversionRate",
                  color: "#f97316",
                  name: "Conversion Rate",
                },
                {
                  key: "engagement",
                  color: "#14b8a6",
                  name: "Engagement",
                },
              ],
            }}
          />
        </div>
      </div>

      <div className="h-96">
        <AnimatedAreaChart
          title="Metrics Over Time"
          subtitle="CTR, CPC, and Conversion Rate trends"
          data={[
            ...data.metricsOverTime.ctr.map((item) => ({
              date: item.date,
              ctr: item.value,
              cpc: data.metricsOverTime.cpc.find((i) => i.date === item.date)
                ?.value,
              convRate: data.metricsOverTime.conversionRate.find(
                (i) => i.date === item.date
              )?.value,
            })),
          ]}
          dataKeys={{
            xAxis: "date",
            areas: [
              {
                key: "ctr",
                color: "#6366f1",
                name: "Click-Through Rate (%)",
              },
              {
                key: "cpc",
                color: "#f97316",
                name: "Cost Per Click ($)",
              },
              {
                key: "convRate",
                color: "#14b8a6",
                name: "Conversion Rate (%)",
              },
            ],
          }}
        />
      </div>
    </motion.div>
  );
}
