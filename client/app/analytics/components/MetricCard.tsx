"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color?: string;
}

export default function MetricCard({
  title,
  value,
  icon,
  trend,
  color = "bg-blue-500",
}: MetricCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="border border-gray-200 shadow-sm relative h-full overflow-hidden">
        <CardHeader className="pb-2 relative z-10">
          <CardDescription className="text-sm text-gray-500 font-medium">
            {title}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-2xl font-bold">{value}</p>
              {trend && (
                <div className="flex items-center mt-2">
                  <span
                    className={`text-sm ${
                      trend.isUp ? "text-green-500" : "text-red-500"
                    } font-medium`}
                  >
                    {trend.isUp ? "↑" : "↓"} {trend.value}%
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    vs last period
                  </span>
                </div>
              )}
            </div>

            <div className={`p-3 rounded-full ${color} text-white`}>{icon}</div>
          </div>
        </CardContent>

        {/* Decorative elements */}
        <div
          className={`absolute top-0 right-0 w-2 h-2 rounded-full ${color} mr-4 mt-4 opacity-75`}
        ></div>
        <div className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-gray-100 opacity-10 z-0"></div>
      </Card>
    </motion.div>
  );
}
