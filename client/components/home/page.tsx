"use client";
import React from "react";
import { Boxes } from "../ui/background-boxes";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function Landing() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const user = session?.user;

  return (
    <div className="h-screen relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

      <Boxes />
      <div className="flex flex-col items-center justify-center gap-3">
        <h1 className={cn("md:text-4xl text-xl text-white relative z-20")}>
          Promotopia
        </h1>
        <p className="text-center mt-2 text-neutral-300 relative z-20">
          Welcome to Hub of Affiliate Marketing
        </p>
        <Button
          onClick={() => {
            if (user) {
              router.push("/campaigns");
            } else {
              router.push("/register");
            }
          }}
          className="bg-black hover:bg-black mt-5 px-10 z-10"
        >
          Lets Go
        </Button>
      </div>
    </div>
  );
}
