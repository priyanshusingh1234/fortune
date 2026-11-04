"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import confetti from "canvas-confetti";
import { isUserAdmin } from "@/lib/admin";
import { FORTUNE_FAQS } from "@/components/FortuneFaq";
import StartupCalculator from "@/components/StartupCalculator";
import {
  Shield,
  LayoutDashboard,
  Power,
  LogIn,
  MessageSquare,
  Package,
  Map,
  ShoppingBag,
  HelpCircle,
  ExternalLink,
  Terminal,
  Trophy,
  Check,
  Clock,
  ChevronUp,
  ChevronDown,
  X,
  Cpu,
  Sparkles,
  Wrench,
  Crown,
  Users,
  ArrowRight,
  Dices,
} from "lucide-react";

interface RetroComputerHeroProps {
  fullscreen?: boolean;
}

export default function RetroComputerHero({ fullscreen = false }: RetroComputerHeroProps) {
  const { data: session } = useSession();
  const isAdmin = isUserAdmin(session?.user);

  // Noben_Nobi 3D Boot & Auth Modal State (When user clicks start on landing page)
  const [authBooting, setAuthBooting] = useState(false);
  const [authStep, setAuthStep] = useState<"bios" | "prompt" | "authorizing">("bios");

  const handleTriggerAuthBoot = () => {
    setAuthBooting(true);
    setAuthStep("bios");

    // 1.2s authentic BIOS memory check, then transition to Hack Club Auth prompt
    setTimeout(() => {
      setAuthStep("prompt");
    }, 1200);
  };

  // OS State: "off" | "booting" | "desktop"
  const [osState, setOsState] = useState<"off" | "booting" | "desktop">("off");
  const [bootStep, setBootStep] = useState(0);
  const [activeWindow, setActiveWindow] = useState<"ship" | "shop" | "chat" | "faq" | "roadmap" | null>(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);

  // FAQ search & expanded state
  const [faqSearch, setFaqSearch] = useState("");
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  // Scroll down prompt indicator (for non-fullscreen mode)
  const [scrollPrompt, setScrollPrompt] = useState<string | null>(null);

  const scrollToSection = (id: string, label: string) => {
    setScrollPrompt(label);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setTimeout(() => {
      setScrollPrompt(null);
    }, 3500);
  };

  // Auto-boot to desktop if already signed in
  useEffect(() => {
    if (session?.user && osState === "off") {
      setOsState("desktop");
    }
  }, [session, osState]);

  // Real Submissions State (No Fake Data)
  interface HeroSubmission {
    id: string;
    title: string;
    hackatime_project: string;
    verified_hours: number;
    status: "pending_review" | "approved" | "changes_requested" | "rejected";
    created_at: string;
  }

  const [userSubmissions, setUserSubmissions] = useState<HeroSubmission[]>([]);

  useEffect(() => {
    if (!session?.user) {
      setUserSubmissions([]);
      return;
    }

    const name = session.user.name || "";
    const slackId = (session.user as any)?.slack_id || (session.user as any)?.id || "";
    const email = session.user.email || "";

    fetch(`/api/submissions?user=${encodeURIComponent(name)}&slackId=${encodeURIComponent(slackId)}&email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.submissions && Array.isArray(data.submissions)) {
          setUserSubmissions(data.submissions);
        }
      })
      .catch((err) => console.warn("Notice fetching hero submissions:", err));
  }, [session]);

  const approvedSub = userSubmissions.find((s) => s.status === "approved");
  const latestSub = userSubmissions.length > 0 ? userSubmissions[0] : null;
  const isApproved = !!approvedSub;
  const hasShipped = !!latestSub;

  const formatShippedTime = (dateStr?: string) => {
    if (!dateStr) return "Not Shipped Yet";
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 60) {
        return diffMins <= 1 ? "Just now" : `${diffMins}m ago`;
      } else if (diffHours < 24) {
        return `${diffHours}h ago`;
      } else if (diffDays === 1) {
        return "Yesterday";
      } else if (diffDays < 7) {
        return `${diffDays}d ago`;
      } else {
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }
    } catch {
      return "Recently Shipped";
    }
  };

  // Turn On / Boot Sequence
  const handlePowerOn = () => {
    if (osState !== "off") return;

    if (!session || !session.user) {
      signIn("hackclub");
      return;
    }

    setOsState("booting");
    setBootStep(1);

    setTimeout(() => setBootStep(2), 700);
    setTimeout(() => setBootStep(3), 1500);
    setTimeout(() => {
      setOsState("desktop");
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#ffe066", "#ec3750", "#10b981", "#181926"],
      });
    }, 2400);
  };

  const handlePowerOff = () => {
    setOsState("off");
    setActiveWindow(null);
    setStartMenuOpen(false);
  };

  const filteredFaqs = FORTUNE_FAQS.filter((f) => {
    if (!faqSearch.trim()) return true;
    const query = faqSearch.toLowerCase();
    return f.q.toLowerCase().includes(query) || f.a.toLowerCase().includes(query);
  });

  // Noben_Nobi 3D Landing Page Mode (When logged out / public visitor)
  if (!fullscreen) {
    return (
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Fullscreen Cinematic Boot & Hack Club Auth Overlay (When user clicks Start / Turn On PC) */}
        {authBooting && (
          <div className="fixed inset-0 z-[100] bg-[#0c0d14] flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
            {/* CRT scanline and curve simulation */}
            <div className="scanlines pointer-events-none z-10"></div>
            <div className="crt-flicker pointer-events-none z-10"></div>

            {/* BIOS BOOTING STAGE */}
            {authStep === "bios" && (
              <div className="max-w-lg w-full bg-[#0a0a0f] p-8 rounded-2xl border-4 border-[#10b981] shadow-[0_0_30px_rgba(16,185,129,0.3)] font-mono text-xs sm:text-sm text-[#10b981] space-y-3 relative z-20">
                <div className="flex items-center justify-between border-b border-[#10b981]/40 pb-2 font-pixel text-xs text-[#ffe066]">
                  <span>FORTUNE 1994 BIOS v4.05</span>
                  <span>(C) HACK CLUB</span>
                </div>
                <div className="space-y-1.5 pt-2">
                  <p>&gt; CHECKING BASE MEMORY: 640KB OK</p>
                  <p>&gt; EXTENDED MEMORY: 384KB OK</p>
                  <p>&gt; MOUNTING FLOPPY DRIVE A:\ [1.44MB]...</p>
                  <p className="text-[#ffe066] animate-pulse">&gt; INITIALIZING HACK CLUB AUTHENTICATION PROTOCOL...</p>
                </div>
              </div>
            )}

            {/* HACK CLUB AUTH PROMPT STAGE (Matching Pixl Modal from Noben's Screenshot) */}
            {authStep === "prompt" && (
              <div className="w-full max-w-md bg-[#161722] text-white p-7 rounded-2xl border-4 border-[#181926] shadow-[8px_8px_0px_#ffe066] space-y-5 animate-in zoom-in-95 duration-200 relative z-20">
                <div className="flex items-center justify-center gap-2 bg-[#ec3750] text-white px-3 py-1 rounded-full text-xs font-pixel font-bold mx-auto w-fit">
                  <span className="w-4 h-4 rounded-full bg-white text-[#ec3750] flex items-center justify-center text-[10px] font-bold">h</span>
                  <span>Hack Club Auth</span>
                </div>

                <div className="space-y-1 text-center">
                  <h2 className="text-2xl font-black font-sans text-white">Continue to Fortune?</h2>
                  <p className="text-xs text-gray-300">Authorize Fortune to use your account?</p>
                  <p className="text-[11px] text-gray-400 mt-2">This is an official Hack Club program run by Hack Club HQ.</p>
                </div>

                <div className="p-3 bg-[#202234] rounded-lg border border-gray-700/60 text-[11px] text-gray-300 font-pixel text-center">
                  What account info will be shared? • Slack ID &amp; Hours
                </div>

                <div className="flex gap-3 pt-2 font-pixel text-xs">
                  <button
                    onClick={() => setAuthBooting(false)}
                    className="flex-1 bg-[#ec3750] hover:bg-[#d6253e] text-white py-3 rounded-xl font-bold border-2 border-white shadow-[2px_2px_0px_#000] transition active:scale-95"
                  >
                    Deny
                  </button>
                  <button
                    onClick={() => {
                      setAuthStep("authorizing");
                      signIn("hackclub");
                    }}
                    className="flex-1 bg-[#10b981] hover:bg-[#059669] text-white py-3 rounded-xl font-bold border-2 border-white shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1 transition active:scale-95"
                  >
                    <span>Okay! →</span>
                  </button>
                </div>
              </div>
            )}

            {/* AUTHORIZING REDIRECT STAGE */}
            {authStep === "authorizing" && (
              <div className="font-pixel text-base text-[#ffe066] animate-pulse relative z-20 flex items-center gap-2">
                <Clock className="w-5 h-5 animate-spin text-[#ec3750]" />
                <span>Redirecting to Hack Club Slack OAuth...</span>
              </div>
            )}
          </div>
        )}

        {/* Top Credits Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 font-pixel text-xs">
          <div className="flex items-center gap-2">
            <span className="bg-[#ec3750] text-white px-3 py-1 rounded-full border-2 border-[#181926] shadow-[2px_2px_0px_#181926] font-bold">
              ★ HACK CLUB YSWS
            </span>
            <span className="bg-[#fffbeb] px-3 py-1 rounded-full border-2 border-[#181926] shadow-[2px_2px_0px_#181926] text-[#b45309] font-bold flex items-center gap-1">
              <Crown className="w-3.5 h-3.5" /> Org: @Noben_Nobi
            </span>
            <span className="bg-[#f0fdf4] px-3 py-1 rounded-full border-2 border-[#181926] shadow-[2px_2px_0px_#181926] text-[#15803d] font-bold flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> Co-Org: @itsnotketan
            </span>
          </div>

          <div className="bg-[#fef2f2] px-3 py-1 rounded-full border-2 border-[#181926] shadow-[2px_2px_0px_#181926] text-[#ec3750] font-bold flex items-center gap-1">
            <Wrench className="w-3.5 h-3.5" /> Lead Dev: Priyanshu Singh
          </div>
        </div>

        {/* Two-Column Hero Grid: Left Content + Right 3D CRT Monitor (Noben_Nobi Spec) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Headings, Elevator Pitch, CTA Buttons, Badges */}
          <div className="lg:col-span-7 space-y-4">
            <div className="font-doodle text-2xl text-[#ec3750] font-bold -rotate-2">
              ~ a hack club ysws for teen founders ~
            </div>

            <h1 className="font-sans font-black text-6xl sm:text-7xl text-[#181926] tracking-tight leading-none">
              Fortune<span className="text-[#f59e0b]">.</span>
            </h1>

            <p className="font-doodle text-2xl text-[#b82438] font-bold">
              code whatever you want • get seed funded • make actual cash
            </p>

            <div className="wobbly-card p-5 max-w-xl bg-white text-base text-[#242636] font-medium leading-relaxed shadow-[5px_5px_0px_#181926]">
              tired of building stuff that dies in a github graveyard? pick any tech stack, build software people actually want, pitch your idea, and get <strong>seed micro-funding</strong> via Hack Club Bank. then spend 3-4 months growing it into a real business!
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleTriggerAuthBoot}
                className="fortune-btn fortune-btn-gold text-base inline-flex items-center gap-2 group hover:scale-105 transition-all"
              >
                <Power className="w-4 h-4 text-[#ec3750] group-hover:scale-110 transition-transform" />
                <span>Start PC</span>
              </button>

              <a
                href="#quest"
                className="fortune-btn text-base inline-flex items-center gap-1.5"
              >
                <Map className="w-4 h-4" />
                <span>How It Works</span>
              </a>

              <a
                href="#faq"
                className="fortune-btn text-base inline-flex items-center gap-1.5"
              >
                <HelpCircle className="w-4 h-4" />
                <span>FAQ</span>
              </a>

              <a
                href="https://hackclub.slack.com/messages/fortune"
                target="_blank"
                rel="noopener noreferrer"
                className="font-doodle text-lg font-bold text-[#ec3750] hover:underline rotate-[-1deg] inline-flex items-center gap-1 ml-1"
              >
                <span>join #fortune on slack</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Silly Stamps */}
            <div className="flex flex-wrap gap-2 text-xs font-pixel pt-2">
              <span className="bg-white px-2.5 py-1 border-2 border-dashed border-[#ec3750] text-[#ec3750] rounded rotate-[-1deg] inline-flex items-center gap-1 shadow-sm">
                <Check className="w-3 h-3" /> 100% free for teens
              </span>
              <span className="bg-white px-2.5 py-1 border-2 border-dashed border-[#10b981] text-[#10b981] rounded rotate-[1deg] inline-flex items-center gap-1 shadow-sm">
                <Check className="w-3 h-3" /> seed micro-funding
              </span>
              <span className="bg-white px-2.5 py-1 border-2 border-dashed border-[#f59e0b] text-[#b37700] rounded rotate-[-0.5deg] inline-flex items-center gap-1 shadow-sm">
                <Check className="w-3 h-3" /> top 5 win cool prizes
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: 3D Angled CRT Monitor (Noben_Nobi 3D Spec) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="crt-3d-perspective w-full max-w-md">
              <div className="crt-3d-chassis bg-[#e8dec0] p-4 sm:p-5 rounded-[26px] border-4 border-[#181926] relative">
                
                {/* Monitor Top Bezel Bar */}
                <div className="flex items-center justify-between pb-2 px-1 border-b-2 border-[#181926]/15 mb-3 font-pixel text-[10px] text-[#5c503b]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#181926]/40"></span>
                    <span className="font-bold tracking-widest">FORTUNE 1994 CRT MATRIX</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_6px_#10b981] animate-ping"></span>
                    <span className="font-bold text-[#10b981]">STANDBY</span>
                  </div>
                </div>

                {/* 3D CRT Screen Glass Surface */}
                <div 
                  onClick={handleTriggerAuthBoot}
                  className="crt-screen-glass rounded-xl border-4 border-[#2b2416] p-6 text-center cursor-pointer transition-all hover:border-[#ec3750] group relative"
                  title="Click to power on workstation"
                >
                  <div className="scanlines pointer-events-none z-10"></div>
                  <div className="crt-flicker pointer-events-none z-10"></div>

                  {/* Phosphor glow contents */}
                  <div className="crt-phosphor-glow relative z-20 space-y-4">
                    {/* Fortune Cookie / Terminal Logo */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#ffe066] border-3 border-white shadow-[4px_4px_0px_#000] flex items-center justify-center text-[#181926] mx-auto group-hover:scale-105 transition-transform">
                      <Terminal className="w-9 h-9 sm:w-11 sm:h-11 text-[#181926]" />
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-pixel text-xl sm:text-2xl text-[#ffe066] drop-shadow-[0_0_10px_rgba(255,224,102,0.5)]">
                        FORTUNE OS
                      </h3>
                      <p className="font-mono text-[11px] text-[#67e8f9] tracking-wider">
                        1994 WORKSTATION MATRIX
                      </p>
                      <span className="inline-block bg-[#10b981]/20 border border-[#10b981] text-[#10b981] px-2 py-0.5 rounded font-pixel text-[10px] mt-1">
                        READY TO BOOT
                      </span>
                    </div>

                    {/* Big Glowing Start Switch */}
                    <div className="pt-2">
                      <div className="bg-[#ec3750] group-hover:bg-[#d6253e] text-white font-pixel text-xs sm:text-sm font-bold py-3 px-4 rounded-xl border-2 border-white shadow-[3px_3px_0px_#000] inline-flex items-center gap-2 group-hover:scale-105 transition-all">
                        <Power className="w-4 h-4 animate-pulse" />
                        <span>[ START PC ]</span>
                      </div>
                    </div>

                    <p className="font-pixel text-[9px] text-gray-400">
                      Click to boot workstation &amp; connect Slack
                    </p>
                  </div>
                </div>

                {/* Monitor Lower Chassis: Floppy drive, Vents, Controls */}
                <div className="flex items-center justify-between pt-3 mt-1 px-1 font-pixel text-[10px] text-[#786b51]">
                  <div className="flex items-center gap-2">
                    {/* 3.5" Floppy Slot */}
                    <div className="bg-[#181926] w-24 sm:w-28 h-3 rounded-sm border border-black/40 flex items-center px-1">
                      <span className="text-[7px] text-gray-400 font-mono">A:\ 1.44MB</span>
                    </div>
                    <span className="text-[9px]">[EJECT]</span>
                  </div>

                  {/* Rotary Controls & Power Switch */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#181926]/30 border border-[#181926]" title="Brightness"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#181926]/30 border border-[#181926]" title="Contrast"></div>
                    <div 
                      onClick={handleTriggerAuthBoot}
                      className="w-5 h-5 rounded-md bg-[#ec3750] border-2 border-[#181926] flex items-center justify-center text-white text-[8px] font-bold cursor-pointer hover:bg-[#d6253e]"
                      title="Power switch"
                    >
                      PWR
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>
    );
  }

  // Fullscreen Workstation Mode (For Logged-In Authenticated Founders)
  return (
    <section className="w-full h-full flex flex-col p-1 sm:p-2 bg-transparent overflow-hidden crt-bulge-stage">
      
      {/* Main Retro Monitor Chassis Container */}
      <div className="flex-1 min-h-0 flex flex-col w-full max-w-[1550px] mx-auto">
        
        {/* Retro Macintosh / CRT Bezel (Warm Beige #e8dec0) */}
        <div className={
          fullscreen
            ? "crt-bulge-chassis p-2.5 sm:p-3.5 relative flex-1 min-h-0 flex flex-col overflow-hidden"
            : "bg-[#e8dec0] p-4 sm:p-7 rounded-[28px] border-4 border-[#181926] shadow-[10px_10px_0px_#181926] relative"
        }>
          
          {/* Top Monitor Bezel Bar */}
          <div className="flex items-center justify-between pb-1.5 px-2 border-b-2 border-[#181926]/10 mb-1.5 font-pixel text-[11px] text-[#5c503b] shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#181926]/40 inline-block"></span>
              <span className="font-bold tracking-widest hidden sm:inline">FORTUNE 1994 CRT WORKSTATION</span>
              <span className="font-bold tracking-widest sm:hidden">FORTUNE CRT</span>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="bg-[#181926] text-white px-2 py-0.5 rounded border border-[#ec3750] text-[10px] font-bold hover:bg-[#333] flex items-center gap-1"
                  title="Open Admin Panel (Restricted to U0BTDMCJ6P7)"
                >
                  <Shield className="w-3 h-3 text-[#ffe066]" />
                  <span>Admin</span>
                </Link>
              )}
              {session?.user && (
                <Link
                  href="/dashboard"
                  className="bg-[#ffe066] text-[#181926] px-2 py-0.5 rounded border border-[#181926] text-[10px] font-bold hover:bg-[#ffd533] flex items-center gap-1"
                  title="Open Founder Dashboard"
                >
                  <LayoutDashboard className="w-3 h-3" />
                  <span>Dashboard</span>
                </Link>
              )}

              <span className="hidden md:inline">640x480 MATRIX</span>
              
              {/* Power LED & Logout */}
              <div className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full transition-all ${
                  osState !== "off"
                    ? "bg-[#10b981] shadow-[0_0_8px_#10b981]"
                    : "bg-[#ec3750]/40"
                }`}></span>
                <span className="text-[10px] font-bold hidden sm:inline">
                  {osState !== "off" ? "PWR ON" : "STANDBY"}
                </span>

                {session?.user && (
                  <button
                    onClick={() => signOut()}
                    className="text-[#ec3750] hover:underline font-bold text-[10px] ml-1"
                    title="Sign out of Fortune"
                  >
                    [LOG OUT]
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* CRT Monitor Recessed Gasket & Bulged Screen Surface */}
          <div className={
            fullscreen
              ? "crt-bulge-bezel flex-1 min-h-0 flex flex-col relative p-1.5 sm:p-2 bg-[#101118]"
              : "relative rounded-[16px] overflow-hidden border-4 border-[#2b2416] bg-[#0c0d14] shadow-inner"
          }>
            <div className={
              fullscreen
                ? "crt-bulge-glass flex-1 min-h-0 flex flex-col relative overflow-hidden"
                : "flex-1 min-h-0 flex flex-col relative overflow-hidden"
            }>
              {/* Scanline CRT Retro Visual Effects */}
              <div className="scanlines pointer-events-none z-10"></div>
              <div className="crt-flicker pointer-events-none z-10"></div>
              {fullscreen && <div className="crt-bulge-vignette"></div>}

            {/* 1. STATE: POWERED OFF / STANDBY SCREEN */}
            {osState === "off" && (
              <div className="min-h-[460px] sm:min-h-[500px] bg-[#14151f] rounded-[12px] flex flex-col items-center justify-center p-6 text-center text-white relative">
                
                {/* Background CRT phosphor grid texture */}
                <div className="absolute inset-0 bg-[radial-gradient(#1f2238_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

                <div className="relative z-10 max-w-lg space-y-6">
                  
                  {/* Fortune Logo Badge */}
                  <div className="inline-block relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#ffe066] border-3 border-white shadow-[4px_4px_0px_#000] flex items-center justify-center text-[#181926] mx-auto animate-pulse">
                      <Terminal className="w-9 h-9 sm:w-11 sm:h-11" />
                    </div>
                    <span className="absolute -top-2 -right-2 bg-[#ec3750] text-white text-[10px] font-pixel px-2 py-0.5 rounded-full border border-white">
                      YSWS
                    </span>
                  </div>

                  {/* Headline */}
                  <div className="space-y-2">
                    <h1 className="font-pixel text-2xl sm:text-3xl text-[#ffe066] drop-shadow-md tracking-wider">
                      Fortune 1.0
                    </h1>
                    <p className="font-doodle text-sm sm:text-base text-gray-300">
                      Code software • Claim seed grant • Build a real business
                    </p>
                  </div>

                  {/* Boot / Login Button */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    {session?.user ? (
                      <button
                        onClick={handlePowerOn}
                        className="bg-[#10b981] hover:bg-[#059669] text-white font-pixel text-sm sm:text-base font-bold py-3.5 px-6 rounded-xl border-2 border-white shadow-[4px_4px_0px_#000] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                      >
                        <Power className="w-4 h-4" />
                        <span>Launch PC</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => signIn("hackclub")}
                        className="bg-[#ec3750] hover:bg-[#d6253e] text-white font-pixel text-sm sm:text-base font-bold py-3.5 px-6 rounded-xl border-2 border-white shadow-[4px_4px_0px_#000] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Connect Slack</span>
                      </button>
                    )}

                    {/* Slack Channel Button */}
                    <a
                      href="https://hackclub.slack.com/messages/fortune"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#ffe066] hover:bg-[#ffd533] text-[#181926] font-pixel text-sm sm:text-base font-bold py-3.5 px-6 rounded-xl border-2 border-white shadow-[4px_4px_0px_#000] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Join #fortune</span>
                    </a>
                  </div>
                </div>

                {/* Bottom specs bar */}
                <div className="font-pixel text-[11px] text-gray-400 flex flex-wrap justify-center gap-4 mt-8">
                  <span>Track coding on Hackatime</span>
                  <span>•</span>
                  <span>HCB Seed Grants</span>
                  <span>•</span>
                  <span>0% Equity</span>
                </div>
              </div>
            )}

            {/* 2. STATE: BOOTING UP ANIMATION */}
            {osState === "booting" && (
              <div className="min-h-[460px] sm:min-h-[500px] bg-[#11121a] rounded-[12px] flex flex-col items-center justify-center p-8 text-center text-white relative">
                
                {/* Glowing Boot Screen */}
                <div className="space-y-6 max-w-sm">
                  <div className="w-16 h-16 rounded-xl bg-[#ffe066] border-2 border-white flex items-center justify-center text-[#181926] mx-auto animate-bounce shadow-lg">
                    <Cpu className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="font-pixel text-2xl text-[#ffe066]">
                      Fortune OS 1.0
                    </h2>
                    <p className="font-mono text-xs text-gray-400">
                      Starting founder subsystem...
                    </p>
                  </div>

                  {/* Retro Progress Bar */}
                  <div className="w-64 h-5 bg-gray-900 border-2 border-white rounded-full overflow-hidden p-0.5 mx-auto">
                    <div
                      className="h-full bg-gradient-to-r from-[#ec3750] via-[#ffe066] to-[#10b981] rounded-full transition-all duration-700"
                      style={{
                        width: bootStep === 1 ? "30%" : bootStep === 2 ? "75%" : "100%",
                      }}
                    ></div>
                  </div>

                  <div className="font-pixel text-xs text-[#10b981] animate-pulse">
                    {bootStep === 1 && "Verifying Hackatime drivers..."}
                    {bootStep === 2 && "Connecting Hack Club Bank API..."}
                    {bootStep === 3 && "Loading founder desktop..."}
                  </div>
                </div>

              </div>
            )}

            {/* 3. STATE: THE RETRO COMPUTER DESKTOP WORKSPACE */}
            {osState === "desktop" && (
              <div className={
                fullscreen
                  ? "flex-1 min-h-0 bg-[#22577a] rounded-[10px] sm:rounded-[12px] flex flex-col justify-between relative overflow-hidden select-none border-2 border-[#181926]"
                  : "min-h-[520px] sm:min-h-[580px] bg-[#22577a] rounded-[12px] flex flex-col justify-between relative overflow-hidden select-none border-2 border-[#181926]"
              }>
                
                {/* Desktop Wallpaper Texture */}
                <div className="absolute inset-0 bg-[radial-gradient(#38a3a5_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none"></div>

                {/* DESKTOP WORKSPACE GRID */}
                <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 relative z-20">
                  
                  {/* TOP-LEFT: CRT FOUNDER CASH VOUCHER (REAL USER DATA) */}
                  <div className="md:col-span-5">
                    <div className="bg-[#f0fdf4] border-2 border-[#181926] rounded-xl p-3 sm:p-4 shadow-[4px_4px_0px_#181926] text-[#181926] font-pixel text-xs space-y-3">
                      
                      {/* Header */}
                      <div className="flex items-center justify-between border-b-2 border-dashed border-[#181926]/30 pb-2">
                        <div className="flex items-center gap-2">
                          {session?.user?.image ? (
                            <img
                              src={session.user.image}
                              alt="Avatar"
                              className="w-8 h-8 rounded-full border border-[#181926] object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-[#ec3750] text-white flex items-center justify-center font-bold text-xs border border-[#181926]">
                              h
                            </div>
                          )}
                          <div>
                            <div className="text-[10px] text-gray-500 uppercase">FOUNDER CASH VOUCHER</div>
                            <div className="font-bold text-sm text-[#181926] truncate max-w-[160px]">
                              @{session?.user?.name || "clubber"}
                            </div>
                          </div>
                        </div>
                        <span className="bg-[#dcfce7] text-[#15803d] border border-[#15803d]/40 px-2 py-0.5 rounded text-[10px] font-bold">
                          FORTUNE SEED
                        </span>
                      </div>

                      {/* Dynamic Real Status Badge */}
                      <div className="text-[10px] flex items-center justify-between text-gray-600 bg-white/70 p-1.5 rounded border border-[#181926]/15">
                        <span>STATUS:</span>
                        {isApproved ? (
                          <span className="text-[#10b981] font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> APPROVED &amp; FUNDED
                          </span>
                        ) : hasShipped ? (
                          <span className="text-[#b45309] font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3" /> AWAITING REVIEW
                          </span>
                        ) : (
                          <span className="text-gray-500 font-bold">
                            READY TO SHIP PROJECT
                          </span>
                        )}
                      </div>

                      {/* Main Data Boxes: Granted Money vs Shipped Time */}
                      <div className="grid grid-cols-2 gap-2 text-center">
                        
                        {/* Box 1: Granted Money (if approved) OR Shipped Time (if awaiting review/unapproved) */}
                        <div className="bg-white p-2 rounded-lg border border-[#181926]/30 shadow-sm flex flex-col justify-center min-h-[58px]">
                          {isApproved ? (
                            <>
                              <div className="text-[9px] text-[#10b981] font-bold uppercase">GRANTED MONEY</div>
                              <div className="text-sm sm:text-base font-bold text-[#10b981] font-mono leading-tight">
                                SEED GRANT
                              </div>
                              <div className="text-[8px] text-gray-400 font-mono">HCB DISBURSED</div>
                            </>
                          ) : hasShipped ? (
                            <>
                              <div className="text-[9px] text-gray-500 uppercase">SHIPPED TIME</div>
                              <div className="text-xs sm:text-sm font-bold text-[#181926] font-mono leading-tight truncate">
                                {formatShippedTime(latestSub?.created_at)}
                              </div>
                              <div className="text-[8px] text-[#b45309] font-mono truncate" title={latestSub?.title}>
                                {latestSub?.verified_hours ? `${latestSub.verified_hours}h coded` : "In Review"}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="text-[9px] text-gray-500 uppercase">SHIPPED TIME</div>
                              <div className="text-xs font-bold text-gray-400 font-mono leading-tight">
                                NOT SHIPPED
                              </div>
                              <div className="text-[8px] text-[#ec3750] font-mono">READY TO SHIP</div>
                            </>
                          )}
                        </div>

                        {/* Box 2: Equity Taken */}
                        <div className="bg-white p-2 rounded-lg border border-[#181926]/30 shadow-sm flex flex-col justify-center min-h-[58px]">
                          <div className="text-[9px] text-gray-500 uppercase">EQUITY TAKEN</div>
                          <div className="text-base sm:text-lg font-bold text-[#ec3750] font-mono leading-tight">
                            0% (NONE)
                          </div>
                          <div className="text-[8px] text-gray-400 font-mono">100% YOURS</div>
                        </div>

                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between pt-1 border-t border-dashed border-[#181926]/20 text-[10px]">
                        <span className="text-gray-500">HACK CLUB BANK (HCB)</span>
                        <div className="flex items-center gap-2">
                          <Link
                            href="/dashboard"
                            className="text-[#10b981] font-bold hover:underline"
                          >
                            [VIEW SHIP]
                          </Link>
                          <button
                            onClick={() => signOut()}
                            className="text-[#ec3750] font-bold hover:underline"
                          >
                            [LOG OUT]
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* TOP-RIGHT: DESKTOP APPS & FOLDER ICONS */}
                  <div className="md:col-span-7 flex flex-wrap gap-3 sm:gap-4 items-start justify-start sm:justify-end">
                    
                    {/* Folder 1: Ship App */}
                    <div
                      onClick={() => setActiveWindow("ship")}
                      className="w-18 sm:w-20 flex flex-col items-center gap-1 cursor-pointer p-1.5 sm:p-2 rounded hover:bg-white/10 active:scale-95 transition-all text-white font-pixel text-[10px] sm:text-[11px] text-center"
                    >
                      <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#ffe066] rounded-lg border-2 border-white flex items-center justify-center text-[#181926] shadow-md">
                        <Package className="w-6 h-6" />
                      </div>
                      <span className="drop-shadow">Ship Project</span>
                    </div>

                    {/* Folder 2: Roadmap */}
                    <div
                      onClick={() => setActiveWindow("roadmap")}
                      className="w-18 sm:w-20 flex flex-col items-center gap-1 cursor-pointer p-1.5 sm:p-2 rounded hover:bg-white/10 active:scale-95 transition-all text-white font-pixel text-[10px] sm:text-[11px] text-center"
                    >
                      <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#38a3a5] rounded-lg border-2 border-white flex items-center justify-center text-white shadow-md">
                        <Map className="w-6 h-6" />
                      </div>
                      <span className="drop-shadow">Roadmap</span>
                    </div>

                    {/* Folder 3: Shop / Loot */}
                    <div
                      onClick={() => setActiveWindow("shop")}
                      className="w-18 sm:w-20 flex flex-col items-center gap-1 cursor-pointer p-1.5 sm:p-2 rounded hover:bg-white/10 active:scale-95 transition-all text-white font-pixel text-[10px] sm:text-[11px] text-center"
                    >
                      <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#ec3750] rounded-lg border-2 border-white flex items-center justify-center text-white shadow-md">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <span className="drop-shadow">Shop</span>
                    </div>

                    {/* Folder 4: Discussion Room */}
                    <div
                      onClick={() => setActiveWindow("chat")}
                      className="w-18 sm:w-20 flex flex-col items-center gap-1 cursor-pointer p-1.5 sm:p-2 rounded hover:bg-white/10 active:scale-95 transition-all text-white font-pixel text-[10px] sm:text-[11px] text-center"
                    >
                      <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#57cc99] rounded-lg border-2 border-white flex items-center justify-center text-[#181926] shadow-md">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <span className="drop-shadow">Discuss</span>
                    </div>

                    {/* Folder 5: FAQ (Opens directly inside PC) */}
                    <div
                      onClick={() => setActiveWindow("faq")}
                      className="w-18 sm:w-20 flex flex-col items-center gap-1 cursor-pointer p-1.5 sm:p-2 rounded hover:bg-white/10 active:scale-95 transition-all text-white font-pixel text-[10px] sm:text-[11px] text-center"
                    >
                      <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#ffffff] text-[#181926] rounded-lg border-2 border-[#181926] flex items-center justify-center shadow-md">
                        <HelpCircle className="w-6 h-6" />
                      </div>
                      <span className="drop-shadow">FAQ</span>
                    </div>

                    {/* App 6: Dashboard */}
                    <Link
                      href="/dashboard"
                      className="w-18 sm:w-20 flex flex-col items-center gap-1 cursor-pointer p-1.5 sm:p-2 rounded hover:bg-white/10 active:scale-95 transition-all text-white font-pixel text-[10px] sm:text-[11px] text-center"
                    >
                      <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#ffe066] text-[#181926] rounded-lg border-2 border-white flex items-center justify-center shadow-md">
                        <LayoutDashboard className="w-6 h-6" />
                      </div>
                      <span className="drop-shadow">Dashboard</span>
                    </Link>

                    {/* App 7: Admin (Restricted strictly to U0BTDMCJ6P7) */}
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="w-18 sm:w-20 flex flex-col items-center gap-1 cursor-pointer p-1.5 sm:p-2 rounded hover:bg-white/10 active:scale-95 transition-all text-white font-pixel text-[10px] sm:text-[11px] text-center"
                      >
                        <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#181926] text-white rounded-lg border-2 border-[#ec3750] flex items-center justify-center shadow-md">
                          <Shield className="w-6 h-6 text-[#ffe066]" />
                        </div>
                        <span className="drop-shadow text-[#ffe066]">Admin</span>
                      </Link>
                    )}

                  </div>

                </div>

                {/* POPUP RETRO WINDOW WHEN AN ICON IS OPENED */}
                {activeWindow && (
                  <div className="absolute inset-2 sm:inset-3 bottom-12 bg-white rounded-lg border-3 border-[#181926] shadow-[8px_8px_0px_#181926] z-30 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    
                    {/* Window Titlebar */}
                    <div className="bg-[#181926] text-white px-3 py-2 flex items-center justify-between font-pixel text-xs shrink-0 select-none">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#ec3750] inline-block"></span>
                        <span className="font-bold uppercase tracking-wide flex items-center gap-1.5">
                          {activeWindow === "ship" && <><Package className="w-3.5 h-3.5 text-[#ffe066]" /> SHIP_SUBMISSION_APP.EXE</>}
                          {activeWindow === "shop" && <><ShoppingBag className="w-3.5 h-3.5 text-[#ffe066]" /> FORTUNE_REWARDS_SHOP.EXE</>}
                          {activeWindow === "chat" && <><MessageSquare className="w-3.5 h-3.5 text-[#ffe066]" /> FOUNDER_SLACK_CHAT.EXE</>}
                          {activeWindow === "roadmap" && <><Map className="w-3.5 h-3.5 text-[#ffe066]" /> SPRINT_QUEST_MAP.EXE</>}
                          {activeWindow === "faq" && <><HelpCircle className="w-3.5 h-3.5 text-[#ffe066]" /> FREQUENTLY_ASKED_QUESTIONS.TXT</>}
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveWindow(null)}
                        className="bg-[#ec3750] hover:bg-[#d6253e] text-white px-2.5 py-0.5 rounded font-bold transition-colors"
                      >
                        CLOSE [X]
                      </button>
                    </div>

                    {/* Window Scrollable Body */}
                    <div className="p-4 sm:p-6 flex-1 overflow-y-auto text-[#181926]">
                      
                      {/* WINDOW: SHIP PROJECT */}
                      {activeWindow === "ship" && (
                        <div className="space-y-4 max-w-lg mx-auto text-center py-4">
                          <div className="w-16 h-16 rounded-2xl bg-[#ffe066] border-2 border-[#181926] flex items-center justify-center text-[#181926] mx-auto shadow-md">
                            <Package className="w-8 h-8" />
                          </div>
                          <h3 className="font-sans font-black text-2xl sm:text-3xl">Ready to ship to Step 1 Review?</h3>
                          <p className="font-doodle text-sm sm:text-base text-gray-600">
                            Our review team (@Noben_Nobi &amp; organizers) checks your working demo and opens your HCB seed grant.
                          </p>
                          <div className="pt-2">
                            <Link
                              href="/dashboard"
                              className="fortune-btn fortune-btn-gold text-sm flex items-center justify-center gap-2 py-3.5 shadow-[4px_4px_0px_#181926]"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span>Open Dashboard</span>
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* WINDOW: REWARDS SHOP */}
                      {activeWindow === "shop" && (
                        <div className="space-y-4">
                          <div className="text-center border-b-2 border-dashed border-[#181926]/20 pb-3">
                            <h3 className="font-sans font-black text-2xl sm:text-3xl text-[#181926] flex items-center justify-center gap-2">
                              <ShoppingBag className="w-7 h-7 text-[#ec3750]" />
                              <span>Fortune Hardware &amp; Rewards Store</span>
                            </h3>
                            <p className="font-doodle text-sm sm:text-base text-gray-600 mt-1">
                              Convert verified startup revenue into Fortune Points or win Top 5 Demo Day prizes!
                            </p>
                            <div className="inline-flex items-center gap-2 mt-2 bg-[#ffe066] border border-[#181926] px-3 py-1 rounded-full font-pixel text-[11px] font-bold text-[#181926]">
                              <span>$1 Revenue = 10 Fortune Points</span>
                              <span>•</span>
                              <span>Free Worldwide Shipping via Hack Club</span>
                            </div>
                          </div>

                          {/* Exciting Prizes Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 pt-1 text-left font-sans">
                            
                            {/* Prize 1: Bambu Lab A1 3D Printer */}
                            <div className="bg-[#fffdf5] border-2 border-[#181926] rounded-xl p-3 flex flex-col justify-between shadow-[3px_3px_0px_#181926] hover:translate-y-[-2px] transition-transform">
                              <div>
                                <div className="flex items-center justify-between text-[10px] font-pixel mb-1">
                                  <span className="bg-[#fee2e2] text-[#ec3750] border border-[#ec3750]/30 px-1.5 py-0.5 rounded font-bold">
                                    Grand Hardware
                                  </span>
                                  <span className="font-mono text-gray-500">$950+ Rev</span>
                                </div>
                                <div className="h-32 w-full bg-white border border-[#181926]/15 rounded-lg p-2 flex items-center justify-center overflow-hidden my-1 shadow-inner">
                                  <img
                                    src="/rewards/bambu-a1-printer.png"
                                    alt="Bambu Lab A1 3D Printer"
                                    className="h-full w-full object-contain hover:scale-105 transition-transform"
                                  />
                                </div>
                                <h4 className="font-black text-sm text-[#181926] leading-tight">
                                  Bambu Lab A1 3D Printer
                                </h4>
                                <p className="font-doodle text-xs text-[#4a4e66] mt-1 leading-snug">
                                  High-speed multicolor precision CoreXY 3D printer for hardware founders.
                                </p>
                              </div>
                              <div className="pt-2 mt-2 border-t border-[#181926]/10 flex items-center justify-between font-mono text-xs">
                                <strong className="text-[#ec3750] font-bold">10,000 PTS</strong>
                                <span className="text-[10px] bg-[#fee2e2] text-[#ec3750] border border-[#ec3750]/30 px-1.5 py-0.5 rounded font-pixel">
                                  Top Tier
                                </span>
                              </div>
                            </div>

                            {/* Prize 2: Apple AirPods Max */}
                            <div className="bg-[#fffdf5] border-2 border-[#181926] rounded-xl p-3 flex flex-col justify-between shadow-[3px_3px_0px_#181926] hover:translate-y-[-2px] transition-transform">
                              <div>
                                <div className="flex items-center justify-between text-[10px] font-pixel mb-1">
                                  <span className="bg-[#e0e7ff] text-[#4338ca] border border-[#4338ca]/30 px-1.5 py-0.5 rounded font-bold">
                                    Pro Audio
                                  </span>
                                  <span className="font-mono text-gray-500">$750 Rev</span>
                                </div>
                                <div className="h-32 w-full bg-white border border-[#181926]/15 rounded-lg p-2 flex items-center justify-center overflow-hidden my-1 shadow-inner">
                                  <img
                                    src="/rewards/airpods-max.jpg"
                                    alt="Apple AirPods Max"
                                    className="h-full w-full object-contain hover:scale-105 transition-transform"
                                  />
                                </div>
                                <h4 className="font-black text-sm text-[#181926] leading-tight">
                                  Apple AirPods Max
                                </h4>
                                <p className="font-doodle text-xs text-[#4a4e66] mt-1 leading-snug">
                                  High-fidelity audio with Active Noise Cancellation for deep focus coding sessions.
                                </p>
                              </div>
                              <div className="pt-2 mt-2 border-t border-[#181926]/10 flex items-center justify-between font-mono text-xs">
                                <strong className="text-[#4338ca] font-bold">8,000 PTS</strong>
                                <span className="text-[10px] bg-[#e0e7ff] text-[#4338ca] border border-[#4338ca]/30 px-1.5 py-0.5 rounded font-pixel">
                                  Deep Focus
                                </span>
                              </div>
                            </div>

                            {/* Prize 3: Custom 75% Mechanical Keyboard */}
                            <div className="bg-[#fffdf5] border-2 border-[#181926] rounded-xl p-3 flex flex-col justify-between shadow-[3px_3px_0px_#181926] hover:translate-y-[-2px] transition-transform">
                              <div>
                                <div className="flex items-center justify-between text-[10px] font-pixel mb-1">
                                  <span className="bg-[#fef3c7] text-[#b45309] border border-[#b45309]/30 px-1.5 py-0.5 rounded font-bold">
                                    Hardware Swag
                                  </span>
                                  <span className="font-mono text-gray-500">$400 Rev</span>
                                </div>
                                <div className="h-32 w-full bg-white border border-[#181926]/15 rounded-lg p-2 flex items-center justify-center overflow-hidden my-1 shadow-inner">
                                  <img
                                    src="/rewards/custom-mech-keyboard.png"
                                    alt="Custom 75% Mechanical Keyboard"
                                    className="h-full w-full object-contain hover:scale-105 transition-transform"
                                  />
                                </div>
                                <h4 className="font-black text-sm text-[#181926] leading-tight">
                                  Custom 75% Mechanical Keyboard
                                </h4>
                                <p className="font-doodle text-xs text-[#4a4e66] mt-1 leading-snug">
                                  Hot-swappable tactile switches, metallic rotary knob &amp; factory-lubed keycaps.
                                </p>
                              </div>
                              <div className="pt-2 mt-2 border-t border-[#181926]/10 flex items-center justify-between font-mono text-xs">
                                <strong className="text-[#b45309] font-bold">4,500 PTS</strong>
                                <span className="text-[10px] bg-[#fef3c7] text-[#b45309] border border-[#b45309]/30 px-1.5 py-0.5 rounded font-pixel">
                                  Top Pick
                                </span>
                              </div>
                            </div>

                            {/* Prize 4: Fortune Founder Embroidered Tee */}
                            <div className="bg-[#fffdf5] border-2 border-[#181926] rounded-xl p-3 flex flex-col justify-between shadow-[3px_3px_0px_#181926] hover:translate-y-[-2px] transition-transform">
                              <div>
                                <div className="flex items-center justify-between text-[10px] font-pixel mb-1">
                                  <span className="bg-[#fef3c7] text-[#b45309] border border-[#b45309]/30 px-1.5 py-0.5 rounded font-bold">
                                    Custom Apparel
                                  </span>
                                  <span className="font-mono text-gray-500">$100 Rev</span>
                                </div>
                                <div className="h-32 w-full bg-white border border-[#181926]/15 rounded-lg p-2 flex items-center justify-center overflow-hidden my-1 shadow-inner">
                                  <img
                                    src="/rewards/founder-tee.webp"
                                    alt="Fortune Founder Embroidered Tee"
                                    className="h-full w-full object-contain hover:scale-105 transition-transform"
                                  />
                                </div>
                                <h4 className="font-black text-sm text-[#181926] leading-tight">
                                  Fortune Founder Embroidered Tee
                                </h4>
                                <p className="font-doodle text-xs text-[#4a4e66] mt-1 leading-snug">
                                  Heavyweight 100% combed cotton tee with custom Fortune pixel embroidery.
                                </p>
                              </div>
                              <div className="pt-2 mt-2 border-t border-[#181926]/10 flex items-center justify-between font-mono text-xs">
                                <strong className="text-[#ec3750] font-bold">1,500 PTS</strong>
                                <span className="text-[10px] bg-[#fef3c7] text-[#b45309] border border-[#b45309]/30 px-1.5 py-0.5 rounded font-pixel">
                                  Popular
                                </span>
                              </div>
                            </div>

                            {/* Prize 5: Raspberry Pi 5 8GB Starter Kit */}
                            <div className="bg-[#fffdf5] border-2 border-[#181926] rounded-xl p-3 flex flex-col justify-between shadow-[3px_3px_0px_#181926] hover:translate-y-[-2px] transition-transform">
                              <div>
                                <div className="flex items-center justify-between text-[10px] font-pixel mb-1">
                                  <span className="bg-[#fee2e2] text-[#991b1b] border border-[#991b1b]/30 px-1.5 py-0.5 rounded font-bold">
                                    Dev Kit
                                  </span>
                                  <span className="font-mono text-gray-500">$250 Rev</span>
                                </div>
                                <div className="h-32 w-full bg-white border border-[#181926]/15 rounded-lg p-2 flex items-center justify-center my-1 shadow-inner text-[#991b1b]">
                                  <Cpu className="w-12 h-12" />
                                </div>
                                <h4 className="font-black text-sm text-[#181926] leading-tight">
                                  Raspberry Pi 5 (8GB) Kit
                                </h4>
                                <p className="font-doodle text-xs text-[#4a4e66] mt-1 leading-snug">
                                  High-performance ARM mini-computer with official power supply, active cooler &amp; case.
                                </p>
                              </div>
                              <div className="pt-2 mt-2 border-t border-[#181926]/10 flex items-center justify-between font-mono text-xs">
                                <strong className="text-[#ec3750] font-bold">3,000 PTS</strong>
                                <span className="text-[10px] bg-[#fee2e2] text-[#991b1b] border border-[#991b1b]/30 px-1.5 py-0.5 rounded font-pixel">
                                  Self-Host MVP
                                </span>
                              </div>
                            </div>

                            {/* Prize 6: Holographic Die-Cut Sticker Pack */}
                            <div className="bg-[#fffdf5] border-2 border-[#181926] rounded-xl p-3 flex flex-col justify-between shadow-[3px_3px_0px_#181926] hover:translate-y-[-2px] transition-transform">
                              <div>
                                <div className="flex items-center justify-between text-[10px] font-pixel mb-1">
                                  <span className="bg-[#dcfce7] text-[#15803d] border border-[#15803d]/30 px-1.5 py-0.5 rounded font-bold">
                                    Base Loot
                                  </span>
                                  <span className="font-mono text-gray-500">Free Ship</span>
                                </div>
                                <div className="h-32 w-full bg-white border border-[#181926]/15 rounded-lg p-2 flex items-center justify-center my-1 shadow-inner text-[#15803d]">
                                  <Sparkles className="w-12 h-12" />
                                </div>
                                <h4 className="font-black text-sm text-[#181926] leading-tight">
                                  Die-Cut Sticker Pack &amp; Pass
                                </h4>
                                <p className="font-doodle text-xs text-[#4a4e66] mt-1 leading-snug">
                                  Official vinyl sticker pack and official Fortune Founder verification card.
                                </p>
                              </div>
                              <div className="pt-2 mt-2 border-t border-[#181926]/10 flex items-center justify-between font-mono text-xs">
                                <strong className="text-[#15803d] font-bold">500 PTS</strong>
                                <span className="text-[10px] bg-[#dcfce7] text-[#15803d] border border-[#15803d]/30 px-1.5 py-0.5 rounded font-pixel">
                                  All Shippers
                                </span>
                              </div>
                            </div>

                          </div>

                          {/* Top 5 Prizes Banner */}
                          <div className="bg-white border-2 border-[#181926] rounded-xl p-4 shadow-[3px_3px_0px_#181926] text-left flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-[#ffe066] border-2 border-[#181926] flex items-center justify-center text-[#181926]">
                                <Trophy className="w-6 h-6" />
                              </div>
                              <div>
                                <h4 className="font-sans font-black text-base text-[#181926]">
                                  Top 5 Demo Day Prizes
                                </h4>
                                <p className="font-doodle text-xs text-gray-600">
                                  The highest-traction teenage founders win <strong>cool prizes</strong> and recognition on Demo Day!
                                </p>
                              </div>
                            </div>
                            <Link
                              href="/dashboard"
                              className="fortune-btn fortune-btn-gold text-xs py-2 px-4 whitespace-nowrap text-center flex items-center gap-1.5"
                            >
                              <Package className="w-3.5 h-3.5" />
                              <span>Ship Project</span>
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* WINDOW: ROADMAP & INTERACTIVE CALCULATOR (WITH LOOT PHOTOS) */}
                      {activeWindow === "roadmap" && (
                        <div className="space-y-6 max-w-4xl mx-auto py-2">
                          <div className="text-center border-b-2 border-dashed border-[#181926]/20 pb-3">
                            <span className="font-pixel text-xs bg-[#38a3a5] text-white px-3 py-1 rounded border border-[#181926] inline-flex items-center gap-1.5 mb-1 font-bold">
                              <Map className="w-3.5 h-3.5" />
                              <span>THE SPRINT ROADMAP</span>
                            </span>
                            <h3 className="font-sans font-black text-2xl sm:text-3xl text-[#181926]">
                              How Fortune Works from 0 to 1
                            </h3>
                            <p className="font-doodle text-xs sm:text-sm text-gray-600 mt-1">
                              Code real software, pass Step 1 Review for seed micro-funding, and build real revenue!
                            </p>
                          </div>

                          {/* 3 Step Cards */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
                            <div className="p-3.5 bg-[#fffdf0] border-2 border-[#181926] rounded-xl shadow-[3px_3px_0px_#181926]">
                              <div className="flex items-center justify-between font-pixel text-xs mb-1 text-[#ec3750] font-bold">
                                <span>STEP 01</span>
                                <span>THE FORGE</span>
                              </div>
                              <h4 className="font-sans font-black text-base text-[#181926] mb-1">Code &amp; Track Time</h4>
                              <p className="text-xs text-[#4a4e66] leading-relaxed">
                                Build your project (web app, game, dev tool) and log hours on Hackatime so we know you didn't just ask AI to generate it in 5 minutes.
                              </p>
                            </div>

                            <div className="p-3.5 bg-[#e8f7ee] border-2 border-[#181926] rounded-xl shadow-[3px_3px_0px_#181926]">
                              <div className="flex items-center justify-between font-pixel text-xs mb-1 text-[#10b981] font-bold">
                                <span>STEP 02</span>
                                <span>MICRO-GRANT</span>
                              </div>
                              <h4 className="font-sans font-black text-base text-[#181926] mb-1">Submit &amp; Get Funded</h4>
                              <p className="text-xs text-[#4a4e66] leading-relaxed">
                                Submit your pitch and GitHub demo to Step 1 Review. Once approved, we issue an HCB seed grant with 0% equity to fund domains and APIs.
                              </p>
                            </div>

                            <div className="p-3.5 bg-[#fef3c7] border-2 border-[#181926] rounded-xl shadow-[3px_3px_0px_#181926]">
                              <div className="flex items-center justify-between font-pixel text-xs mb-1 text-[#b45309] font-bold">
                                <span>STEP 03</span>
                                <span>REVENUE &amp; LOOT</span>
                              </div>
                              <h4 className="font-sans font-black text-base text-[#181926] mb-1">Make Sales &amp; Win Loot</h4>
                              <p className="text-xs text-[#4a4e66] leading-relaxed">
                                Every dollar in revenue converts to 10 Fortune Points to spend on mechanical keyboards, 3D printers, AirPods Max, and custom tees!
                              </p>
                            </div>
                          </div>

                          {/* Interactive Calculator with Photos */}
                          <div className="border-2 border-[#181926] rounded-2xl bg-[#fffdf5] shadow-[4px_4px_0px_#181926] overflow-hidden">
                            <StartupCalculator compact={true} />
                          </div>
                        </div>
                      )}

                      {/* WINDOW: FAQ & RULES (RENDERED DIRECTLY INSIDE PC) */}
                      {activeWindow === "faq" && (
                        <div className="space-y-4 max-w-3xl mx-auto py-2">
                          {/* FAQ Header with Search */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-dashed border-[#181926]/20 pb-3">
                            <div>
                              <h3 className="font-sans font-black text-2xl text-[#181926] flex items-center gap-2">
                                <HelpCircle className="w-6 h-6 text-[#ec3750]" />
                                <span>Fortune FAQ &amp; Rules</span>
                              </h3>
                              <p className="font-doodle text-xs text-gray-600 mt-0.5">
                                Everything you need to know about seed grants, Hackatime, shipping &amp; loot.
                              </p>
                            </div>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Search questions (e.g. AI, grants)..."
                                value={faqSearch}
                                onChange={(e) => setFaqSearch(e.target.value)}
                                className="w-full sm:w-64 px-3 py-1.5 text-xs font-mono rounded-lg border-2 border-[#181926] bg-[#fffdf5] focus:outline-none focus:ring-2 focus:ring-[#ec3750]"
                              />
                              {faqSearch && (
                                <button
                                  onClick={() => setFaqSearch("")}
                                  className="absolute right-2 top-1.5 text-xs text-gray-500 font-bold hover:text-black"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Filtered FAQs */}
                          <div className="space-y-2.5">
                            {filteredFaqs.map((faq, i) => {
                              const isOpen = expandedFaqIndex === i;
                              return (
                                <div
                                  key={i}
                                  className="border-2 border-[#181926] rounded-xl bg-[#fffdf0] overflow-hidden shadow-[2px_2px_0px_#181926] transition-all"
                                >
                                  <button
                                    onClick={() => setExpandedFaqIndex(isOpen ? null : i)}
                                    className="w-full p-3 text-left font-sans font-bold text-xs sm:text-sm text-[#181926] flex items-center justify-between gap-2 hover:bg-[#ffe066]/30 transition-colors"
                                  >
                                    <span className="flex items-center gap-2">
                                      <span className="text-[10px] font-pixel bg-[#181926] text-white px-1.5 py-0.5 rounded">Q{i + 1}</span>
                                      <span>{faq.q}</span>
                                    </span>
                                    {isOpen ? (
                                      <ChevronUp className="w-4 h-4 text-[#ec3750]" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4 text-[#ec3750]" />
                                    )}
                                  </button>
                                  {isOpen && (
                                    <div className="p-3 pt-0 border-t border-[#181926]/10 text-xs text-[#3a3d52] font-medium leading-relaxed bg-white">
                                      {faq.a}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          <div className="bg-[#e0f2fe] border-2 border-[#0284c7] rounded-xl p-3 text-xs text-[#0369a1] flex items-center justify-between gap-3">
                            <span>Still have a question? Ask organizers directly in Slack:</span>
                            <a
                              href="https://hackclub.slack.com/messages/fortune-help"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-[#0284c7] text-white px-3 py-1 rounded font-pixel font-bold hover:bg-[#0369a1] whitespace-nowrap"
                            >
                              #fortune-help ↗
                            </a>
                          </div>
                        </div>
                      )}

                      {/* WINDOW: SLACK DISCUSSION */}
                      {activeWindow === "chat" && (
                        <div className="space-y-4 text-center max-w-md mx-auto py-4">
                          <div className="w-16 h-16 rounded-2xl bg-[#57cc99] border-2 border-[#181926] flex items-center justify-center text-white mx-auto shadow-md">
                            <MessageSquare className="w-8 h-8" />
                          </div>
                          <h3 className="font-sans font-black text-2xl">Founder Discussion Channels</h3>
                          <p className="font-doodle text-sm text-gray-600">
                            Hang out, brainstorm startup mechanics, share daily commits, and get help from organizers!
                          </p>
                          <div className="flex flex-col gap-2 pt-2">
                            <a
                              href="https://hackclub.slack.com/messages/fortune"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="fortune-btn text-xs py-2.5 shadow-[2px_2px_0px_#181926]"
                            >
                              Join #fortune ↗
                            </a>
                            <a
                              href="https://hackclub.slack.com/messages/fortune-help"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="fortune-btn fortune-btn-gold text-xs py-2.5 shadow-[2px_2px_0px_#181926]"
                            >
                              Join #fortune-help ↗
                            </a>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                )}

                {/* BOTTOM TASKBAR / NAVIGATION BAR */}
                <div className="bg-[#181926] text-white px-3 py-1.5 border-t-2 border-[#181926] flex items-center justify-between font-pixel text-xs relative z-40 shrink-0 select-none">
                  
                  {/* Start Button & Active Window Tabs */}
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <button
                        onClick={() => setStartMenuOpen(!startMenuOpen)}
                        className="bg-[#ffe066] hover:bg-[#ffd533] text-[#181926] px-3 py-1 rounded font-bold flex items-center gap-1.5 shadow-[1px_1px_0px_#000] active:scale-95 transition-transform"
                      >
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Start</span>
                      </button>

                      {/* Retro Start Menu */}
                      {startMenuOpen && (
                        <div className="absolute left-0 bottom-full mb-1 w-56 bg-[#e8dec0] border-3 border-[#181926] rounded-lg shadow-[6px_6px_0px_#181926] p-2 text-[#181926] z-50 animate-in fade-in zoom-in-95 font-pixel text-xs">
                          <div className="bg-[#181926] text-white p-2 rounded mb-2 text-center">
                            <div className="text-sm font-bold">Fortune OS 1.0</div>
                            <div className="text-[10px] text-[#ffe066] truncate">@{session?.user?.name || "clubber"}</div>
                          </div>
                          
                          <div className="space-y-1">
                            <button
                              onClick={() => { setActiveWindow("ship"); setStartMenuOpen(false); }}
                              className="w-full text-left p-1.5 rounded hover:bg-[#ffe066] flex items-center gap-2"
                            >
                              <Package className="w-3.5 h-3.5" /> <span>Ship Project</span>
                            </button>
                            <button
                              onClick={() => { setActiveWindow("roadmap"); setStartMenuOpen(false); }}
                              className="w-full text-left p-1.5 rounded hover:bg-[#ffe066] flex items-center gap-2"
                            >
                              <Map className="w-3.5 h-3.5" /> <span>Roadmap</span>
                            </button>
                            <button
                              onClick={() => { setActiveWindow("shop"); setStartMenuOpen(false); }}
                              className="w-full text-left p-1.5 rounded hover:bg-[#ffe066] flex items-center gap-2"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" /> <span>Shop</span>
                            </button>
                            <button
                              onClick={() => { setActiveWindow("chat"); setStartMenuOpen(false); }}
                              className="w-full text-left p-1.5 rounded hover:bg-[#ffe066] flex items-center gap-2"
                            >
                              <MessageSquare className="w-3.5 h-3.5" /> <span>Slack</span>
                            </button>
                            <button
                              onClick={() => { setActiveWindow("faq"); setStartMenuOpen(false); }}
                              className="w-full text-left p-1.5 rounded hover:bg-[#ffe066] flex items-center gap-2"
                            >
                              <HelpCircle className="w-3.5 h-3.5" /> <span>FAQ</span>
                            </button>
                            
                            <div className="border-t border-[#181926]/20 my-1 pt-1">
                              <Link
                                href="/dashboard"
                                onClick={() => setStartMenuOpen(false)}
                                className="w-full text-left p-1.5 rounded hover:bg-[#ffe066] flex items-center gap-2 block"
                              >
                                <LayoutDashboard className="w-3.5 h-3.5" /> <span>Founder Dashboard</span>
                              </Link>
                              {isAdmin && (
                                <Link
                                  href="/admin"
                                  onClick={() => setStartMenuOpen(false)}
                                  className="w-full text-left p-1.5 rounded hover:bg-[#ffe066] flex items-center gap-2 block text-[#ec3750] font-bold"
                                >
                                  <Shield className="w-3.5 h-3.5" /> <span>Admin Panel</span>
                                </Link>
                              )}
                            </div>

                            <div className="border-t border-[#181926]/20 my-1 pt-1">
                              <button
                                onClick={() => signOut()}
                                className="w-full text-left p-1.5 rounded hover:bg-[#fee2e2] text-[#ec3750] flex items-center gap-2 font-bold"
                              >
                                <Power className="w-3.5 h-3.5" /> <span>Sign Out</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Taskbar Window Tabs */}
                    <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-gray-700">
                      <button
                        onClick={() => setActiveWindow(activeWindow === "ship" ? null : "ship")}
                        className={`px-2 py-0.5 rounded text-[11px] transition-colors flex items-center gap-1 ${
                          activeWindow === "ship" ? "bg-[#ffe066] text-[#181926] font-bold" : "hover:bg-gray-800 text-gray-300"
                        }`}
                      >
                        <Package className="w-3 h-3" />
                        <span>Ship</span>
                      </button>
                      <button
                        onClick={() => setActiveWindow(activeWindow === "roadmap" ? null : "roadmap")}
                        className={`px-2 py-0.5 rounded text-[11px] transition-colors flex items-center gap-1 ${
                          activeWindow === "roadmap" ? "bg-[#ffe066] text-[#181926] font-bold" : "hover:bg-gray-800 text-gray-300"
                        }`}
                      >
                        <Map className="w-3 h-3" />
                        <span>Roadmap</span>
                      </button>
                      <button
                        onClick={() => setActiveWindow(activeWindow === "shop" ? null : "shop")}
                        className={`px-2 py-0.5 rounded text-[11px] transition-colors flex items-center gap-1 ${
                          activeWindow === "shop" ? "bg-[#ffe066] text-[#181926] font-bold" : "hover:bg-gray-800 text-gray-300"
                        }`}
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Shop</span>
                      </button>
                      <button
                        onClick={() => setActiveWindow(activeWindow === "chat" ? null : "chat")}
                        className={`px-2 py-0.5 rounded text-[11px] transition-colors flex items-center gap-1 ${
                          activeWindow === "chat" ? "bg-[#ffe066] text-[#181926] font-bold" : "hover:bg-gray-800 text-gray-300"
                        }`}
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Discuss</span>
                      </button>
                      <button
                        onClick={() => setActiveWindow(activeWindow === "faq" ? null : "faq")}
                        className={`px-2 py-0.5 rounded text-[11px] transition-colors flex items-center gap-1 ${
                          activeWindow === "faq" ? "bg-[#ffe066] text-[#181926] font-bold" : "hover:bg-gray-800 text-gray-300"
                        }`}
                      >
                        <HelpCircle className="w-3 h-3" />
                        <span>FAQ</span>
                      </button>
                    </div>
                  </div>

                  {/* Right side: Shut down & Clock */}
                  <div className="flex items-center gap-2 text-[11px] text-gray-300">
                    <button
                      onClick={() => signOut()}
                      className="text-[#ec3750] hover:text-white hover:underline font-bold"
                      title="Shut down & Sign out"
                    >
                      [Shut Down]
                    </button>
                    <span className="bg-black/60 px-2 py-0.5 rounded border border-gray-700 text-[#10b981] font-mono">
                      1994 OS
                    </span>
                  </div>

                </div>

              </div>
            )}

          {/* End of CRT Screen Surfaces */}
            </div>
          </div>

          {/* Monitor Lower Chassis / Hardware Faceplate (Floppy, Knobs, Badge) */}
          <div className="flex items-center justify-between pt-2 px-1 font-pixel text-[10px] text-[#786b51] shrink-0 border-t border-[#181926]/10 mt-1.5">
            <div className="flex items-center gap-2">
              {/* 3.5" Floppy Drive */}
              <div className="bg-[#181926] w-22 sm:w-28 h-3.5 rounded-sm border border-black/40 flex items-center px-1.5 justify-between">
                <span className="text-[7px] text-gray-400 font-mono">A:\ 1.44MB</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]/60"></span>
              </div>
              <span className="text-[9px] text-gray-600 font-bold hidden sm:inline">[EJECT]</span>
            </div>

            {/* Center Metal Badge */}
            <div className="hidden md:flex items-center gap-1.5 bg-[#dfd4b7] border border-[#181926]/30 px-2 py-0.5 rounded shadow-inner text-[9px] font-bold text-[#5c503b]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ec3750]"></span>
              <span>FORTUNE 1994 WORKSTATION • 14&quot; BULGED COLOR CRT</span>
            </div>

            {/* Rotary Controls & Power Switch */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-[8px] text-gray-500 font-bold">
                <div className="w-3.5 h-3.5 rounded-full bg-[#181926]/30 border border-[#181926]" title="Brightness"></div>
                <span className="hidden sm:inline">BRT</span>
              </div>
              <div className="flex items-center gap-1 text-[8px] text-gray-500 font-bold">
                <div className="w-3.5 h-3.5 rounded-full bg-[#181926]/30 border border-[#181926]" title="Contrast"></div>
                <span className="hidden sm:inline">CON</span>
              </div>
              <div 
                onClick={() => signOut()}
                className="w-5 h-5 rounded-md bg-[#ec3750] border-2 border-[#181926] flex items-center justify-center text-white text-[8px] font-bold cursor-pointer hover:bg-[#d6253e]"
                title="Shut down & Sign out"
              >
                PWR
              </div>
            </div>
          </div>

        </div>

        {/* Computer Stand / Base (Physical Foot) */}
        <div className="w-48 sm:w-56 h-3 bg-[#d4c9a8] mx-auto border-x-4 border-b-4 border-[#181926] rounded-b-xl shadow-md shrink-0"></div>
        <div className="w-72 sm:w-84 h-2 bg-[#c4b998] mx-auto border-2 border-[#181926] rounded-full shadow-lg shrink-0"></div>

        {/* Animated Downward Arrow Indicator (Only when non-fullscreen) */}
        {!fullscreen && scrollPrompt && (
          <div className="flex flex-col items-center justify-center mt-6 animate-bounce transition-all">
            <div className="bg-[#ffe066] text-[#181926] px-4 py-2 rounded-full border-3 border-[#181926] shadow-[4px_4px_0px_#181926] font-pixel text-xs sm:text-sm font-bold flex items-center gap-2">
              <Map className="w-4 h-4" />
              <span>Scrolling down to {scrollPrompt}</span>
              <span className="text-lg">↓</span>
            </div>
            <div className="text-4xl text-[#ec3750] font-black -mt-1 select-none">
              ▼
            </div>
          </div>
        )}

      </div>

    </section>
  );
}
