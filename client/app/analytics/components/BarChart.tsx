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
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  [key: string]: string | number;
}

interface BarChartProps {
  title: string;
  subtitle?: string;
  data: DataPoint[];
  dataKeys: {
    xAxis: string;
    bars: {
      key: string;
      color: string;
      name: string;
    }[];
  };
  layout?: "vertical" | "horizontal";
  stacked?: boolean;
}

export default function BarChartComponent({
  title,
  subtitle,
  data,
  dataKeys,
  layout = "horizontal",
  stacked = false,
}: BarChartProps) {
  const [activeBar, setActiveBar] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full h-full"
    >
      <Card className="border border-gray-200 shadow-sm h-full">
        <CardHeader className="pb-0">
          <CardTitle>{title}</CardTitle>
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
        </CardHeader>

        <CardContent className="p-3 pt-4 h-[calc(100%-5rem)]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={data}
              layout={layout}
              margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
              barCategoryGap={stacked ? 0 : "20%"}
              onMouseMove={(e) => {
                if (e.activeLabel) {
                  setActiveBar(e.activeLabel);
                }
              }}
              onMouseLeave={() => setActiveBar(null)}
            >
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
              <XAxis
                dataKey={dataKeys.xAxis}
                type={layout === "horizontal" ? "category" : "number"}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ strokeOpacity: 0.2 }}
              />
              <YAxis
                type={layout === "horizontal" ? "number" : "category"}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ strokeOpacity: 0.2 }}
              />
              <Tooltip
                cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
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

              {dataKeys.bars.map((bar, index) => (
                <Bar
                  key={bar.key}
                  dataKey={bar.key}
                  name={bar.name}
                  fill={bar.color}
                  radius={[4, 4, 0, 0]}
                  stackId={stacked ? "stack" : undefined}
                  animationDuration={1200}
                  animationBegin={index * 200}
                  animationEasing="ease-out"
                  style={{
                    filter: `drop-shadow(0px 2px 3px rgba(0,0,0,0.08))`,
                    cursor: "pointer",
                  }}
                />
              ))}
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
