// components/CreateCampaignDialog.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useBrand } from "@/providers/BrandProvider"; // Assuming this provides brand data
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCampaign } from "@/services/campaign-service";

const campaignSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  commission_rate: z
    .string()
    .regex(/^\d+$/, "Commission rate must be a number"),
  landing_url: z.string().url("Must be a valid URL"),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

export default function CreateCampaignDialog() {
  const [open, setOpen] = useState(false);
  const { brand } = useBrand();
  const queryClient = useQueryClient();

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: "",
      description: "",
      commission_rate: "",
      landing_url: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CampaignFormValues) =>
      createCampaign({
        ...data,
        brand_id: String(brand?.brand.ID) || "",
      }),
    onSuccess: () => {
      toast.success("Campaign created successfully!");
      form.reset();
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: CampaignFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-black">
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new campaign.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      className="focus-visible:ring-0"
                      placeholder="Spring Bonanza"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      className="focus-visible:ring-0"
                      placeholder="Spring Sale on summer collection"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="commission_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commission Rate (%)</FormLabel>
                  <FormControl>
                    <Input
                      className="focus-visible:ring-0"
                      placeholder="3"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="landing_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Landing URL</FormLabel>
                  <FormControl>
                    <Input
                      className="focus-visible:ring-0"
                      placeholder="www.gear.com/collections"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-black"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
