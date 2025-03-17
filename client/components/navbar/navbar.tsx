"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { getBrandByUserId } from "@/services/brand-service";
import { Brand } from "@/sdk/types";
import { useBrand } from "@/providers/BrandProvider";
import { useEffect } from "react";
import { Bell } from "lucide-react";
import RespondDialog from "./respond-dialog";

export default function Navbar() {
  const { data: session } = useSession();

  const { setBrand } = useBrand();

  const { data: brandData, isLoading } = useQuery<Brand>({
    queryKey: ["brand", session?.user.id],
    queryFn: () => getBrandByUserId(session?.user.id || ""),
    enabled: !!session?.user.id && session?.user.role === "brand",
  });

  useEffect(() => {
    if (brandData) {
      setBrand(brandData);
    }
  }, [brandData, setBrand]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed px-8 top-0 left-0 right-0 bg-white shadow-md p-4 flex justify-between items-center z-10"
    >
      <div className="text-2xl font-semibold">Promotopia</div>
      {session?.user.role === "brand" && (
        <Button
          variant="outline"
          className="min-w-[150px] text-center text-[18px] hover:bg-white"
        >
          {isLoading ? "..." : brandData?.brand.CompanyName}
        </Button>
      )}
      <div className="space-x-4 flex justify-center items-center">
        {session?.user.role !== "brand" && <RespondDialog />}
        {session?.user.role !== "brand" && (
          <Button variant="outline">Hi, {session?.user.name}</Button>
        )}
        {session?.user.role !== "affiliate" && (
          <Button variant="outline">Hi, {session?.user.name}</Button>
        )}
        <Button>Logout</Button>
      </div>
    </motion.nav>
  );
}
