"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getCampaignsById } from "@/services/campaign-service";
import { ICampaign } from "@/sdk/types";
import { motion } from "framer-motion";
import { Spinner } from "../ui/spinner";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Affiliates from "./affiliates";
import Tracking from "./tracking";

export default function CampaignPage() {
  const { id } = useParams();
  const { data: session } = useSession();

  const {
    data: campaign,
    isLoading,
    error,
  } = useQuery<ICampaign>({
    queryKey: ["campaign", id],
    queryFn: () => getCampaignsById(String(id) || ""),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="p-6 text-center">
        <Spinner size="medium" />
      </div>
    );
  if (error)
    return (
      <div className="p-6 text-center text-red-600">
        Error: {(error as Error).message}
      </div>
    );
  if (!campaign)
    return <div className="p-6 text-center">Campaign not found</div>;

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

 
  console.log(session?.user)

  return (
    <div className=" bg-gradient-to-b from-gray-100 to-gray-200 py-12 px-6">
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="text-center mb-12"
      >
        <motion.h1
          variants={textVariants}
          className="text-5xl font-extrabold text-gray-800 mb-4"
        >
          {campaign.Name}
        </motion.h1>
        <motion.p
          variants={textVariants}
          className="text-xl text-gray-600 max-w-2xl mx-auto"
        >
          {campaign.Description.Valid
            ? campaign.Description.String
            : "No description available"}
        </motion.p>
      </motion.section>

      <div className="max-w-4xl mx-auto space-y-12">
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex  gap-10 items-center">
            <motion.h2
              variants={textVariants}
              className="flex justify-center gap-6 items-center text-2xl  mt-2 font-semibold text-gray-700 mb-2"
            >
              Landing Page <ArrowRight />
            </motion.h2>

            <motion.a
              variants={textVariants}
              href={campaign.LandingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-lg break-all"
            >
              {campaign.LandingUrl}
            </motion.a>
          </div>
        </motion.section>

        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="bg-white w-full rounded-lg shadow-lg p-6  gap-6"
        >
          <div className="flex  gap-10 items-center w-full">
            <motion.h2
              variants={textVariants}
              className="flex justify-center gap-6 items-center text-2xl  mt-2 font-semibold text-gray-700 mb-2"
            >
              Commision <ArrowRight />
            </motion.h2>

            <motion.h3 variants={textVariants} className=" text-lg break-all">
              {campaign.CommissionRate} % on each conversion
            </motion.h3>
          </div>
        </motion.section>

        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-lg shadow-lg p-6 text-center"
        >
          <div className="flex  gap-10 items-center w-full">
            <motion.h2
              variants={textVariants}
              className="flex justify-center gap-6 items-center text-2xl  mt-2 font-semibold text-gray-700 mb-2"
            >
              Created On <ArrowRight />
            </motion.h2>

            <motion.h3 variants={textVariants} className=" text-lg break-all">
              {campaign.CreatedAt.Valid
                ? new Date(campaign.CreatedAt.Time).toLocaleString()
                : "N/A"}
            </motion.h3>
          </div>
        </motion.section>

        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        ></motion.section>

        {session?.user.role === "brand" && id && (
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <Affiliates campaignId={id as string} />
          </motion.section>
        )}

        {session?.user.role !== "brand" && id && (
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <Tracking
              campaignId={id as string}
              userId={String(session?.user.id)}
            />
          </motion.section>
        )}
      </div>
    </div>
  );
}
