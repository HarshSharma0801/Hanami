// components/Sidebar.tsx
"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";

const sidebarItems = [
  { name: "Campaigns", href: "/campaigns" },
  { name: "Profile", href: "/campaigns/profile" },
  { name: "Settings", href: "/campaigns/settings" },
  { name: "Developer Doc", href: "/brand/docs" },
];

export default function Sidebar({
  onCollapseChange,
}: {
  onCollapseChange: (isCollapsed: boolean) => void;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    onCollapseChange(!isCollapsed);
  };

  return (
    <motion.div
      animate={{
        width: isCollapsed ? 80 : 256,
      }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gray-900 text-white p-5 overflow-hidden z-0"
    >
      <Button
        variant="ghost"
        size="icon"
        className="mb-4 text-white hover:bg-gray-800 hover:text-white"
        onClick={handleToggle}
      >
        {isCollapsed ? <Menu /> : <X />}
      </Button>
      <nav className="space-y-2">
        {session?.user.role !== "brand" &&
          sidebarItems
            .filter((data) => data.name !== "Developer Doc")
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center p-3 rounded-md transition-colors whitespace-nowrap",
                  pathname === item.href
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white",
                  isCollapsed && "justify-center"
                )}
              >
                {!isCollapsed && item.name}
                {isCollapsed && item.name[0]}
              </Link>
            ))}

        {session?.user.role === "brand" &&
          sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center p-3 rounded-md transition-colors whitespace-nowrap",
                pathname === item.href
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white",
                isCollapsed && "justify-center"
              )}
            >
              {!isCollapsed && item.name}
              {isCollapsed && item.name[0]}
            </Link>
          ))}
      </nav>
    </motion.div>
  );
}
