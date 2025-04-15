"use client";
import { useQuery } from "@tanstack/react-query";
import { AffiliateResponse } from "@/sdk/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { getAffiliatesByCampaignId } from "@/services/affiliate-service";
import { motion } from "framer-motion";
import InviteDialog from "./invite-dialog";

export default function Affiliates({ campaignId }: { campaignId: string }) {
  const {
    data: affiliateData,
    isLoading,
    error,
  } = useQuery<AffiliateResponse>({
    queryKey: ["affiliates", campaignId],
    queryFn: () => getAffiliatesByCampaignId(String(campaignId) || ""),
    enabled: !!campaignId,
  });

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
    hover: { backgroundColor: "#f1f5f9", transition: { duration: 0.2 } }, // slate-100
  };

  if (isLoading)
    return <div className="p-6 text-center">Loading affiliates...</div>;
  if (error)
    return (
      <div className="p-6 text-center text-red-600">
        Error: {(error as Error).message}
      </div>
    );

  return (
    <div className="p-6 py-10  h-full">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between">
          <div>
            <h2 className="text-3xl text-left font-bold text-gray-800 mb-6">
              Affiliates
            </h2>
          </div>

          <div>
            <InviteDialog campaignId={campaignId} />
          </div>
        </div>
        <div className="border rounded-lg shadow-lg bg-white overflow-hidden">
          {affiliateData?.affiliates && affiliateData.affiliates.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b">
                  <TableHead className="font-semibold text-gray-700 py-4">
                    Username
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4">
                    Email
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4">
                    Created Date
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4">
                    Clicks
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4">
                    Conversions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {affiliateData.affiliates.map((affiliate, index) => (
                  <motion.tr
                    key={index}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    custom={index}
                    className="border-b last:border-b-0 cursor-pointer"
                  >
                    <TableCell className="py-4 text-left text-gray-800">
                      {affiliate.Username}
                    </TableCell>
                    <TableCell className="py-4 text-left text-gray-800">
                      {affiliate.Email}
                    </TableCell>
                    <TableCell className="py-4 text-left text-gray-800">
                      {new Date(
                        affiliate.AffiliateCreatedAt.Time
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="py-4 text-left text-gray-800">
                      {affiliate.ClickCount}
                    </TableCell>
                    <TableCell className="py-4 text-left text-gray-800">
                      {affiliate.ConversionCount}
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-6 text-center text-gray-600">
              No affiliates found for this campaign.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
