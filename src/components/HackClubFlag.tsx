"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function HackClubFlag() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Hide flag on homepage when user is logged in to give the retro CRT computer the whole screen
  if (session?.user && pathname === "/") {
    return null;
  }

  return (
    <a
      href="https://hackclub.com"
      target="_blank"
      rel="noopener noreferrer"
      className="hackclub-flag"
      title="Part of Hack Club"
    >
      <img
        src="https://assets.hackclub.com/flag-orpheus-top.svg"
        alt="Hack Club Flag"
        className="w-full h-auto drop-shadow-md hover:translate-y-1 transition-transform"
      />
    </a>
  );
}

