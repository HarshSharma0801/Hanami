"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import {
  getCampaignsByBrandId,
  getCampaignsByUserId,
} from "@/services/campaign-service";
import { AffiliateCampaignsResponse, CampaignsResponse } from "@/sdk/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useBrand } from "@/providers/BrandProvider";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { brand } = useBrand();

  const { data: campaignsData } = useQuery<CampaignsResponse>({
    queryKey: ["campaigns", session?.user.id],
    queryFn: () => getCampaignsByBrandId(String(brand?.brand.ID) || ""),
    enabled: !!brand?.brand.ID && session?.user.role === "brand",
  });

  const { data: campaignsAffiliateData } = useQuery<AffiliateCampaignsResponse>(
    {
      queryKey: ["campaignsAffiliate", session?.user.id],
      queryFn: () => getCampaignsByUserId(String(session?.user.id) || ""),
      enabled: session?.user.role !== "brand",
    }
  );

  return (
    <div className="p-6 py-10">
      {session?.user.role === "brand" && (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Landing URL</TableHead>
                <TableHead>Created Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaignsData?.campaigns.length ? (
                campaignsData.campaigns.map((campaign, index) => (
                  <TableRow className="cursor-pointer" key={index}>
                    <TableCell>{campaign.Name}</TableCell>
                    <TableCell>{campaign.LandingUrl}</TableCell>
                    <TableCell>
                      {new Date(campaign.CreatedAt.Time).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No campaigns found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {session?.user.role !== "brand" && (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Landing URL</TableHead>
                <TableHead>Created Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaignsAffiliateData?.campaigns.length ? (
                campaignsAffiliateData.campaigns.map((campaign, index) => (
                  <TableRow className="cursor-pointer" key={index}>
                    <TableCell>{campaign.CompanyName}</TableCell>
                    <TableCell>{campaign.CampaignName}</TableCell>
                    <TableCell>{campaign.LandingUrl}</TableCell>
                    <TableCell>
                      {new Date(
                        campaign.CampaignCreatedAt.Time
                      ).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No campaigns found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
