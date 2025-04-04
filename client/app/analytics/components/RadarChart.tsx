"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface RadarChartProps {
  title: string;
  subtitle?: string;
  data: any[];
  dataKeys: {
    nameKey: string;
    radars: {
      key: string;
      color: string;
      name: string;
    }[];
  };
}

export default function RadarChartComponent({
  title,
  subtitle,
  data,
  dataKeys,
}: RadarChartProps) {
  const [activeItem, setActiveItem] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full h-full"
    >
      <Card className="border border-gray-200 shadow-sm h-full">
        <CardHeader className="pb-0">
          <CardTitle>{title}</CardTitle>
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
        </CardHeader>

        <CardContent className="p-3 pt-4 h-[calc(100%-5rem)]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsRadarChart
              cx="50%"
              cy="50%"
              outerRadius="70%"
              data={data}
              onMouseMove={(e) => {
                if (e.activeTooltipIndex !== undefined) {
                  setActiveItem(e.activeTooltipIndex);
                }
              }}
              onMouseLeave={() => setActiveItem(null)}
            >
              <PolarGrid stroke="#e0e0e0" strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey={dataKeys.nameKey}
                tick={{ fontSize: 12, fill: "#666" }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 10]}
                tick={{ fontSize: 10, fill: "#999" }}
                axisLine={false}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #eaeaea",
                  fontSize: "12px",
                }}
                labelStyle={{
                  fontWeight: "bold",
                  marginBottom: "4px",
                  fontSize: "13px",
                }}
              />

              {dataKeys.radars.map((radar, index) => (
                <Radar
                  key={radar.key}
                  name={radar.name}
                  dataKey={radar.key}
                  stroke={radar.color}
                  fill={radar.color}
                  fillOpacity={0.6}
                  animationDuration={1500}
                  animationBegin={index * 300}
                  animationEasing="ease-out"
                />
              ))}

              <Legend
                iconType="circle"
                layout="horizontal"
                verticalAlign="top"
                align="center"
                wrapperStyle={{ fontSize: "12px", paddingBottom: "10px" }}
              />
            </RechartsRadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
