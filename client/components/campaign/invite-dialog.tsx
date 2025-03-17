"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";
import { debounce } from "lodash";
import { checkAffiliatesByEmail } from "@/services/affiliate-service";
import { create_invite } from "@/services/invite-service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function InviteDialog({ campaignId }: { campaignId: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState("");

  const debounceEmail = debounce((value: string) => {
    setDebouncedEmail(value);
  }, 500);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    debounceEmail(newEmail);
  };

  const { data, isLoading } = useQuery<{ available: boolean | null }>({
    queryKey: ["checkEmail", debouncedEmail],
    queryFn: () => checkAffiliatesByEmail(debouncedEmail),
    enabled: !!debouncedEmail,
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: () =>
      create_invite({ campaign_id: Number(campaignId), email: email }),
    onSuccess: () => {
      toast.success("Invite sent successfully!");
      setOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const SendInvite = () => {
    mutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-black">
          Invite
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-full">
        <DialogHeader>
          <DialogTitle>Check Email Availability</DialogTitle>
          <DialogDescription>
            Enter an email to check if it's available.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="example@domain.com"
              className="focus-visible:ring-0"
            />
          </div>
          <div>
            {isLoading && debouncedEmail && (
              <p className="text-gray-500">Checking...</p>
            )}
            {data && !isLoading && debouncedEmail && (
              <p
                className={
                  data.available
                    ? "text-green-600 text-sm"
                    : "text-red-600 text-sm"
                }
              >
                {data.available
                  ? "User is available!"
                  : "User is not available."}
              </p>
            )}
            {!debouncedEmail && (
              <p className="text-gray-500 text-sm">
                Please enter an email to invite.
              </p>
            )}

            {data?.available && (
              <div className="w-full flex justify-center items-center pt-10">
                <Button onClick={SendInvite}>Send Invite</Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
