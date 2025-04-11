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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");

  // Convert string numbers to actual numbers in the data
  const processedData = data.map(item => {
    const newItem = {...item};
    dataKeys.radars.forEach(radar => {
      if (typeof newItem[radar.key] === 'string') {
        newItem[radar.key] = parseFloat(newItem[radar.key]);
      }
    });
    return newItem;
  });

  // Prepare data for the select dropdown
  const campaignOptions = [
    { value: "all", label: "All Campaigns" },
    ...processedData.map((item) => ({
      value: item[dataKeys.nameKey],
      label: item[dataKeys.nameKey],
    })),
  ];

  // Filter data based on selected campaign
  const filteredData = selectedCampaign === "all" 
    ? processedData 
    : processedData.filter(item => item[dataKeys.nameKey] === selectedCampaign);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full h-full"
    >
      <Card className="border border-gray-200 shadow-sm h-full">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{title}</CardTitle>
              {subtitle && <CardDescription>{subtitle}</CardDescription>}
            </div>
            <Select
              value={selectedCampaign}
              onValueChange={setSelectedCampaign}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select campaign" />
              </SelectTrigger>
              <SelectContent>
                {campaignOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-3 pt-4 h-[calc(100%-5rem)]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsRadarChart
              cx="50%"
              cy="50%"
              outerRadius="70%"
              data={filteredData}
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