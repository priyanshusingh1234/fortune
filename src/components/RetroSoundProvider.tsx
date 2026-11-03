"use client";

import React, { useEffect } from "react";
import { playRetroClick } from "@/lib/sound";

export default function RetroSoundProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const handleGlobalClick = () => {
      playRetroClick("click");
    };

    window.addEventListener("pointerdown", handleGlobalClick, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", handleGlobalClick);
    };
  }, []);

  return <>{children}</>;
}

