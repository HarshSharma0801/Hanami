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

interface AudienceInsightsTabProps {
  data: any;
  container: any;
}

export default function AudienceInsightsTab({
  data,
  container,
}: AudienceInsightsTabProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-96">
          <PieChartComponent
            title="Audience Demographics"
            subtitle="Detailed breakdown by age group"
            data={data.audienceBreakdown}
            colors={["#6366f1", "#ec4899", "#14b8a6", "#f97316", "#8b5cf6"]}
          />
        </div>
        <div className="h-96">
          <PieChartComponent
            title="Geographic Distribution"
            subtitle="Audience by country"
            data={data.geographicDistribution}
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
            data={data.deviceStats}
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
