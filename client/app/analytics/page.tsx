"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  OverviewTab,
  CampaignAnalysisTab,
  AudienceInsightsTab,
  RevenueStatsTab,
} from "./components/tabs";
import { AnalyticsData, ContainerAnimation } from "./types";
import data from "./data.json";

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const container: ContainerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-gray-500">
          Track your performance metrics and campaign insights
        </p>
      </motion.div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-8 w-full justify-start bg-white border-b border-gray-200 px-2">
          <TabsTrigger value="overview" className="text-base py-3 px-5">
            Overview
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="text-base py-3 px-5">
            Campaign Analysis
          </TabsTrigger>
          <TabsTrigger value="audience" className="text-base py-3 px-5">
            Audience Insights
          </TabsTrigger>
          <TabsTrigger value="revenue" className="text-base py-3 px-5">
            Revenue Stats
          </TabsTrigger>
        </TabsList>

        {/* Tab contents */}
        <TabsContent value="overview">
          <OverviewTab data={data as AnalyticsData} container={container} />
        </TabsContent>

        <TabsContent value="campaigns">
          <CampaignAnalysisTab
            data={data as AnalyticsData}
            container={container}
          />
        </TabsContent>

        <TabsContent value="audience">
          <AudienceInsightsTab
            data={data as AnalyticsData}
            container={container}
          />
        </TabsContent>

        <TabsContent value="revenue">
          <RevenueStatsTab data={data as AnalyticsData} container={container} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
