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
  name: string;
  value: number;
}

interface PieChartProps {
  title: string;
  subtitle?: string;
  data: DataPoint[];
  colors?: string[];
}

const COLORS = [
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
}: any) => {
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
      className="text-xs"
    >
      {percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ""}
    </text>
  );
};

export default function PieChartComponent({
  title,
  subtitle,
  data,
  colors = COLORS,
}: PieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const assignedColors = data.map((_, index) => colors[index % colors.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full h-full"
    >
      <Card className="border border-gray-200 shadow-sm h-full">
        <CardHeader className="pb-0">
          <CardTitle>{title}</CardTitle>
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
        </CardHeader>

        <CardContent className="p-3 pt-4 h-[calc(100%-5rem)]">
          <ResponsiveContainer width="100%" height="100%">
            <ReChartsPie>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
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
                          ? "drop-shadow(0px 0px 4px rgba(0,0,0,0.3))"
                          : "none",
                      transform:
                        index === activeIndex ? "scale(1.03)" : "scale(1)",
                      transformOrigin: "center",
                      transition: "transform 0.3s, filter 0.3s",
                    }}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value}%`, ""]}
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
              <Legend
                iconType="circle"
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{ fontSize: "12px", paddingLeft: "10px" }}
              />
            </ReChartsPie>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
