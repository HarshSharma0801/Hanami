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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DataPoint {
  [key: string]: string | number;
}

interface AreaChartProps {
  title: string;
  subtitle?: string;
  data: DataPoint[];
  dataKeys: {
    xAxis: string;
    areas: {
      key: string;
      color: string;
      name: string;
    }[];
  };
}

export default function AnimatedAreaChart({
  title,
  subtitle,
  data,
  dataKeys,
}: AreaChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full"
    >
      <Card className="border border-gray-200 shadow-sm h-full">
        <CardHeader className="pb-0">
          <CardTitle>{title}</CardTitle>
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
        </CardHeader>

        <CardContent className="p-3 pt-4 h-[calc(100%-5rem)]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              onMouseMove={(e) => {
                if (e.activeTooltipIndex !== undefined) {
                  setHoveredIndex(e.activeTooltipIndex);
                }
              }}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <defs>
                {dataKeys.areas.map((area) => (
                  <linearGradient
                    key={area.key}
                    id={`color-${area.key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={area.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={area.color}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
              <XAxis
                dataKey={dataKeys.xAxis}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ strokeOpacity: 0.2 }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ strokeOpacity: 0.2 }}
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
              <Legend
                verticalAlign="top"
                height={36}
                iconSize={10}
                wrapperStyle={{ fontSize: "12px" }}
              />
              {dataKeys.areas.map((area, index) => (
                <Area
                  key={area.key}
                  type="monotone"
                  dataKey={area.key}
                  name={area.name}
                  stroke={area.color}
                  fillOpacity={1}
                  fill={`url(#color-${area.key})`}
                  strokeWidth={2}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  animationDuration={1000 + index * 200}
                  animationEasing="ease-out"
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
