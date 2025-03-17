// components/RespondDialog.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getInvitesByUserId, createResponse } from "@/services/invite-service";
import { Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import { Invite } from "@/sdk/types";

export default function RespondDialog() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: invitesData, isLoading: invitesLoading } = useQuery<Invite[]>({
    queryKey: ["invites", session?.user.id],
    queryFn: () => getInvitesByUserId(session?.user.id!),
    enabled: open && !!session?.user.id,
  });

  const acceptMutation = useMutation({
    mutationFn: (inviteId: number) =>
      createResponse({
        invite_id: inviteId,
        status: "accepted",
        user_affiliate_id: Number(session?.user.id),
      }),
    onSuccess: () => {
      toast.success("Invite accepted!");
      queryClient.invalidateQueries({
        queryKey: ["campaignsAffiliate", "invites", session?.user.id],
      });
      setOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (inviteId: number) =>
      createResponse({
        invite_id: inviteId,
        status: "rejected",
        user_affiliate_id: Number(session?.user.id),
      }),
    onSuccess: () => {
      toast.success("Invite rejected!");
      queryClient.invalidateQueries({
        queryKey: ["campaignsAffiliate", "invites", session?.user.id],
      });
      setOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleAccept = (inviteId: number) => {
    acceptMutation.mutate(inviteId);
  };

  const handleReject = (inviteId: number) => {
    rejectMutation.mutate(inviteId);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-black">
          <Bell />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full md:w-[50vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Invites</DialogTitle>
          <DialogDescription>
            View and respond to campaign invites.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-semibold">Pending Invites</h3>
          {invitesLoading && (
            <p className="text-gray-500">Loading invites...</p>
          )}
          {invitesData && invitesData.length > 0 ? (
            <div className="flex flex-col space-y-4">
              {invitesData.map((invite) => (
                <div
                  key={invite.ID}
                  className="flex flex-col p-4 bg-gray-200 rounded-md shadow-sm"
                >
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm  font-semibold text-gray-800">
                      Brand: {invite.CompanyName}
                    </span>
                    <span className="text-sm  text-gray-600 ">
                      Campaign: {invite.CampaignName}
                    </span>
                    <span className="text-sm text-gray-600">
                      Commission Rate: {invite.CommissionRate}%
                    </span>
                  </div>
                  <div className="flex justify-end space-x-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white hover:text-white"
                      onClick={() => handleAccept(invite.ID)}
                      disabled={acceptMutation.isPending}
                    >
                      {acceptMutation.isPending ? "Accepting..." : "Accept"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 text-white hover:text-white"
                      onClick={() => handleReject(invite.ID)}
                      disabled={rejectMutation.isPending}
                    >
                      {rejectMutation.isPending ? "Rejecting..." : "Reject"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !invitesLoading && (
              <p className="text-gray-500 text-sm">No pending invites found.</p>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
