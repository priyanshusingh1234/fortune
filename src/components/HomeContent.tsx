"use client";

import React from "react";
import { useSession } from "next-auth/react";
import RetroComputerHero from "@/components/RetroComputerHero";
import FortuneQuestMap from "@/components/FortuneQuestMap";
import FortuneFaq from "@/components/FortuneFaq";
import FortuneFooter from "@/components/FortuneFooter";

export default function HomeContent() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && !!session?.user;

  // When logged in: fullscreen retro computer ONLY (no top names, no bottom sections, all apps inside PC)
  if (isLoggedIn) {
    return (
      <main className="fixed inset-0 z-50 w-screen h-screen bg-[#12131b] overflow-hidden flex flex-col p-1.5 sm:p-2 md:p-3">
        <RetroComputerHero fullscreen={true} />
      </main>
    );
  }

  // When logged out: full public landing page with navbar, hero standby, roadmap calculator with photos, FAQ & footer
  return (
    <main className="min-h-screen bg-[#f7f1e1] text-[#181926]">
      <RetroComputerHero fullscreen={false} />
      <FortuneQuestMap />
      <FortuneFaq />
      <FortuneFooter />
    </main>
  );
}

