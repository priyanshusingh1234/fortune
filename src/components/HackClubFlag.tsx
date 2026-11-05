"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function HackClubFlag() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Hide flag on homepage (the animated airplane with Hack Club banner takes its place on landing page, and CRT PC takes whole screen when logged in)
  if (pathname === "/") {
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

