"use client";

import React from "react";
import { useSession } from "next-auth/react";
import RetroComputerHero from "@/components/RetroComputerHero";
import SkyLandingPage from "@/components/SkyLandingPage";

export default function HomeContent() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && !!session?.user;

  // When logged in: fullscreen retro computer ONLY (all apps, games & tools inside the CRT workstation)
  // Preserved 100% exactly as original
  if (isLoggedIn) {
    return (
      <main className="fixed inset-0 z-50 w-screen h-screen bg-[#0c0d14] overflow-hidden flex flex-col p-1.5 sm:p-2.5 md:p-3.5">
        <RetroComputerHero fullscreen={true} />
      </main>
    );
  }

  // When logged out: Clean, animated sky landing page inspired by Hack Club Throttle
  return (
    <main className="min-h-screen overflow-x-hidden">
      <SkyLandingPage />
    </main>
  );
}


