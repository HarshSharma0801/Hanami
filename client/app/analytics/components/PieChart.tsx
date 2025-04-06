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
  PieChart as ReChartsPie,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  name: string; // Changed from Name to name
  value: number; // Changed from Value to value
}

interface PieChartProps {
  title: string;
  subtitle?: string;
  data: DataPoint[];
  colors?: string[];
}

const DEFAULT_COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A259FF",
  "#FF6B6B",
  "#4ECDC4",
];

const RADIAN = Math.PI / 180;

// Custom label renderer with animation
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ""}
    </text>
  );
};

export default function PieChartComponent({
  title,
  subtitle,
  data,
  colors = DEFAULT_COLORS,
}: PieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    console.warn("No data provided to PieChartComponent");
    return <div>No data available</div>; // Fallback for empty data
  }
  console.log("Chart Data:", data);

  const assignedColors = data.map((_, index) => colors[index % colors.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full h-full"
    >
      <Card className="border border-gray-200 shadow-sm h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {subtitle && (
            <CardDescription className="text-sm">{subtitle}</CardDescription>
          )}
        </CardHeader>

        <CardContent className="p-4 pt-2 h-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <ReChartsPie>
              <Pie
                data={data}
                cx="50%"
                cy="30%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                innerRadius={30}
                dataKey="value"
                animationDuration={1500}
                animationBegin={300}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={assignedColors[index]}
                    strokeWidth={index === activeIndex ? 2 : 0}
                    stroke="#fff"
                    style={{
                      filter:
                        index === activeIndex
                          ? "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))"
                          : "none",
                      transform:
                        index === activeIndex ? "scale(1.05)" : "scale(1)",
                      transformOrigin: "center",
                      transition: "transform 0.3s, filter 0.3s",
                    }}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value} clicks`, ""]}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e0e0e0",
                  fontSize: "12px",
                  padding: "8px",
                }}
                labelStyle={{
                  fontWeight: "bold",
                  marginBottom: "4px",
                  fontSize: "13px",
                  color: "#333",
                }}
                itemStyle={{ padding: "2px 0" }}
              />
              <Legend
                iconType="circle"
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{
                  fontSize: "12px",
                  paddingLeft: "20px",
                  lineHeight: "1.5",
                }}
              />
            </ReChartsPie>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
