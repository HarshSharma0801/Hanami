"use client";

import { Metadata } from "next";
import Sidebar from "@/components/sidebar/sidebar";
import Navbar from "@/components/navbar/navbar";
import { useState } from "react";
import { motion } from "framer-motion";


export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 pt-16">
        <Sidebar onCollapseChange={setIsSidebarCollapsed} />
        <motion.main
          animate={{
            marginLeft: isSidebarCollapsed ? "80px" : "256px",
            width: isSidebarCollapsed
              ? "calc(100% - 80px)"
              : "calc(100% - 256px)",
          }}
          transition={{ duration: 0.3 }}
          className="flex-1"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
