"use client";

import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function HackClubAuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="bg-white px-3 py-1.5 rounded-md border-2 border-[#181926] shadow-[2px_2px_0px_#181926] font-pixel text-xs text-[#71717a] animate-pulse">
        Checking Slack...
      </div>
    );
  }

  if (session && session.user) {
    return (
      <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-md border-2 border-[#181926] shadow-[2px_2px_0px_#181926]">
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="w-6 h-6 rounded-full border border-[#181926]"
          />
        ) : (
          <span className="w-6 h-6 rounded-full bg-[#ec3750] text-white flex items-center justify-center font-pixel text-[10px]">
            HC
          </span>
        )}
        <div className="flex flex-col text-left">
          <span className="font-pixel text-xs text-[#181926] font-bold leading-tight">
            @{session.user.name || "clubber"}
          </span>
          {(session.user as any)?.verification_status && (
            <span className="text-[9px] font-pixel text-[#10b981] leading-none">
              ✓ Verified Teen
            </span>
          )}
        </div>
        <button
          onClick={() => signOut()}
          className="ml-1 text-[10px] font-pixel text-[#ec3750] hover:underline"
          title="Sign out"
        >
          [exit]
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("hackclub")}
      className="bg-[#ec3750] hover:bg-[#d6253e] text-white px-3 py-1.5 rounded-md border-2 border-[#181926] shadow-[2px_2px_0px_#181926] font-pixel text-xs font-bold flex items-center gap-1.5 transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
    >
      <span>🚀</span>
      <span>Sign in with Hack Club</span>
    </button>
  );
}

