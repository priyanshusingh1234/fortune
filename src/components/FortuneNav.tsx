"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { isUserAdmin } from "@/lib/admin";
import {
  Coins,
  Home,
  Map,
  HelpCircle,
  LayoutDashboard,
  Shield,
  LogIn,
} from "lucide-react";

export default function FortuneNav() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isAdmin = isUserAdmin(session?.user);

  // When logged in on homepage, hide top navbar to let retro computer fill the entire screen
  if (session?.user && pathname === "/") {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#f7f1e1]/90 backdrop-blur-md border-b-2 border-[#181926]/10 px-4 sm:px-8 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between pl-24 sm:pl-28">
        
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-[#ffe066] border-2 border-[#181926] shadow-[2px_2px_0px_#181926] flex items-center justify-center text-[#181926] group-hover:scale-110 transition-transform">
            <Coins className="w-4 h-4" />
          </div>
          <span className="font-pixel text-base sm:text-lg font-bold text-[#181926]">
            Fortune <span className="text-[#ec3750] text-xs">YSWS</span>
          </span>
        </Link>

        {/* Center: Navigation links & centered Sign in / Dashboard */}
        <div className="flex items-center gap-4 sm:gap-6 font-pixel text-xs">
          <Link href="/" className="hover:text-[#ec3750] transition-colors hidden sm:flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <Link href="/#quest" className="hover:text-[#ec3750] transition-colors hidden sm:flex items-center gap-1.5">
            <Map className="w-3.5 h-3.5" />
            <span>Roadmap</span>
          </Link>
          <Link href="/#faq" className="hover:text-[#ec3750] transition-colors hidden sm:flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FAQ</span>
          </Link>

          {/* Centered Auth CTA */}
          {status === "loading" ? (
            <div className="bg-white px-3 py-1.5 rounded-md border-2 border-[#181926] text-gray-500 animate-pulse text-[11px]">
              Checking...
            </div>
          ) : session?.user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="bg-[#ffe066] hover:bg-[#ffd533] text-[#181926] px-3.5 py-1.5 rounded-md border-2 border-[#181926] shadow-[2px_2px_0px_#181926] font-bold transition-transform hover:-translate-y-0.5 flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="bg-[#181926] text-white hover:bg-[#333] px-2.5 py-1.5 rounded-md border-2 border-[#181926] font-bold text-[11px] shadow-[2px_2px_0px_#ec3750] flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-[#ffe066]" />
                  <span>Admin</span>
                </Link>
              )}
            </div>
          ) : (
            <button
              onClick={() => signIn("hackclub")}
              className="bg-[#ec3750] hover:bg-[#d6253e] text-white px-4 py-1.5 rounded-md border-2 border-[#181926] shadow-[2px_2px_0px_#181926] font-bold flex items-center gap-1.5 transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign in with Hack Club</span>
            </button>
          )}
        </div>

        {/* Right: User Avatar pill when signed in */}
        <div className="flex items-center gap-2 font-pixel text-xs">
          {session?.user && (
            <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-full border-2 border-[#181926] shadow-[2px_2px_0px_#181926]">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-6 h-6 rounded-full border border-[#181926] object-cover"
                />
              ) : (
                <span className="w-6 h-6 rounded-full bg-[#ec3750] text-white flex items-center justify-center font-pixel text-[10px]">
                  HC
                </span>
              )}
              <span className="font-bold text-[#181926] text-xs font-pixel hidden sm:inline-block">
                @{session.user.name || "clubber"}
              </span>
              <button
                onClick={() => signOut()}
                className="text-[11px] text-[#ec3750] hover:underline font-bold ml-1"
                title="Sign out"
              >
                [exit]
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}
