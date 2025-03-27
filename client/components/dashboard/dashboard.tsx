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
import { useRouter } from "next/navigation";
import CreateCampaignDialog from "./campaign-dialog";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { brand } = useBrand();
  const router = useRouter();

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
        <div className="flex justify-normal flex-col gap-6">
          <div className="flex justify-between">
            <div className="flex justify-center items-center text-center text-2xl">
              Campaigns
            </div>
            <CreateCampaignDialog />
          </div>
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
                {campaignsData?.campaigns &&
                campaignsData?.campaigns.length > 0 ? (
                  campaignsData.campaigns.map((campaign, index) => (
                    <TableRow
                      onClick={() => {
                        router.push(`/campaigns/${campaign.ID}`);
                      }}
                      className="cursor-pointer"
                      key={index}
                    >
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
        </div>
      )}

      {session?.user.role !== "brand" && (
        <>
          <div className="flex  py-6 text-center text-2xl">Campaigns</div>
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
                {campaignsAffiliateData?.campaigns &&
                  campaignsAffiliateData?.campaigns.length > 0 &&
                  campaignsAffiliateData.campaigns.map((campaign, index) => (
                    <>
                      <TableRow
                        onClick={() => {
                          router.push(`/campaigns/${campaign.CampaignID}`);
                        }}
                        className="cursor-pointer"
                        key={index}
                      >
                        <TableCell>{campaign.CompanyName}</TableCell>
                        <TableCell>{campaign.CampaignName}</TableCell>
                        <TableCell>{campaign.LandingUrl}</TableCell>
                        <TableCell>
                          {new Date(
                            campaign.CampaignCreatedAt.Time
                          ).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
