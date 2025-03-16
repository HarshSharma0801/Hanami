// components/Tracking.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { TrackingResponse } from "@/sdk/types";
import { getTrackingCodeForAffiliate } from "@/services/tracking-service";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaWhatsapp,
  FaTelegram,
  FaEnvelope,
  FaYoutube,
} from "react-icons/fa"; // Import specific icons

export default function Tracking({
  campaignId,
  userId,
}: {
  campaignId: string;
  userId: string;
}) {
  const {
    data: trackingData,
    isLoading,
    error,
  } = useQuery<TrackingResponse>({
    queryKey: ["tracking", campaignId, userId],
    queryFn: () => getTrackingCodeForAffiliate(campaignId, userId),
    enabled: !!campaignId && !!userId,
  });

  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Define platforms with their source, medium, and icon
  const platforms = [
    {
      source: "facebook",
      medium: "social",
      icon: <FaFacebook className="text-[#1877F2]" />,
    },
    {
      source: "twitter",
      medium: "social",
      icon: <FaTwitter className="text-[#1DA1F2]" />,
    },
    {
      source: "instagram",
      medium: "social",
      icon: <FaInstagram className="text-[#E4405F]" />,
    },
    {
      source: "whatsapp",
      medium: "messaging",
      icon: <FaWhatsapp className="text-[#25D366]" />,
    },
    {
      source: "telegram",
      medium: "messaging",
      icon: <FaTelegram className="text-[#0088CC]" />,
    },
    {
      source: "youtube",
      medium: "video",
      icon: <FaYoutube className="text-[#FF0000]" />,
    },
    {
      source: "email",
      medium: "email",
      icon: <FaEnvelope className="text-[#D44638]" />,
    },
  ];

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const baseTrackingCode = trackingData?.tracking_code.LinkCode
    ? `${baseUrl}?tracking_code=${trackingData.tracking_code.LinkCode}`
    : "";

  const generateTrackingLinks = () => {
    return platforms.map((platform) => ({
      label: platform.source.charAt(0).toUpperCase() + platform.source.slice(1),
      icon: platform.icon,
      url: `${baseUrl}?utm_source=${platform.source}&utm_medium=${
        platform.medium
      }&tracking_code=${trackingData?.tracking_code.LinkCode || ""}`,
    }));
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(url);
    toast.success("Copied!");
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  if (isLoading)
    return <div className="p-6 text-center">Loading tracking data...</div>;
  if (error)
    return (
      <div className="p-6 text-center text-red-600">
        Error: {(error as Error).message}
      </div>
    );

  return (
    <div className="p-6 py-10 bg-white rounded-md min-h-screen">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl text-left font-bold text-gray-800 mb-6">
          Tracking Links
        </h2>
        <div className="space-y-4 flex flex-col">
          {/* Base Tracking Link */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            custom={0}
            className="flex items-center space-x-4 bg-gray-100 p-4 rounded-lg shadow-md"
          >
            <Input
              value={baseTrackingCode}
              readOnly
              className="flex-1 focus-visible:ring-0  bg-gray-50 text-gray-800"
            />
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                onClick={() => copyToClipboard(baseTrackingCode)}
                variant={
                  copiedLink === baseTrackingCode ? "secondary" : "outline"
                }
              >
                <Copy className="h-4 w-4 mr-2" />
                {copiedLink === baseTrackingCode ? "Copied" : "Copy"}
              </Button>
            </motion.div>
          </motion.div>

          {/* Platform-specific Links */}
          {generateTrackingLinks().map((link, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              custom={index + 1}
              className="flex items-center space-x-4 bg-gray-100 p-4 rounded-lg shadow-md"
            >
              <div className="flex items-center w-40 text-gray-700 font-semibold space-x-2">
                <span className="text-2xl">{link.icon}</span>
                <span>{link.label}</span>
              </div>
              <Input
                value={link.url}
                readOnly
                className="flex-1  focus-visible:ring-0  bg-gray-50 text-gray-800"
              />
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  onClick={() => copyToClipboard(link.url)}
                  variant={copiedLink === link.url ? "secondary" : "outline"}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {copiedLink === link.url ? "Copied" : "Copy"}
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
