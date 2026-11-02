"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import confetti from "canvas-confetti";

export default function RetroComputerHero() {
  const { data: session } = useSession();

  // OS State: "off" | "booting" | "desktop"
  const [osState, setOsState] = useState<"off" | "booting" | "desktop">("off");
  const [bootStep, setBootStep] = useState(0);
  const [activeWindow, setActiveWindow] = useState<"ship" | "shop" | "chat" | "faq" | "roadmap" | null>(null);

  // Scroll down prompt indicator
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

  // Turn On / Boot Sequence
  const handlePowerOn = () => {
    if (osState !== "off") return;
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
  };

  return (
    <section className="relative pt-24 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
      
      {/* Top Credits Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 font-pixel text-xs">
        <div className="flex items-center gap-2">
          <span className="bg-[#ec3750] text-white px-3 py-1 rounded-full border-2 border-[#181926] shadow-[2px_2px_0px_#181926] font-bold">
            ★ HACK CLUB YSWS
          </span>
          <span className="bg-white px-3 py-1 rounded-full border-2 border-[#181926] shadow-[2px_2px_0px_#181926] text-[#b45309] font-bold">
            👑 Org: @Noben_Nobi
          </span>
          <span className="bg-white px-3 py-1 rounded-full border-2 border-[#181926] shadow-[2px_2px_0px_#181926] text-[#15803d] font-bold">
            🤝 Co-Org: @itsnotketan
          </span>
        </div>

        <div className="bg-white px-3 py-1 rounded-full border-2 border-[#181926] shadow-[2px_2px_0px_#181926] text-[#ec3750] font-bold">
          🛠️ Lead Dev: Priyanshu Singh
        </div>
      </div>

      {/* Main Retro Monitor Chassis Container */}
      <div className={`transition-all duration-700 mx-auto ${
        osState === "desktop" ? "scale-[1.02] max-w-5xl" : "max-w-4xl"
      }`}>
        
        {/* Retro Macintosh / CRT Bezel (Warm Beige #e6dec3) */}
        <div className="bg-[#e8dec0] p-4 sm:p-7 rounded-[28px] border-4 border-[#181926] shadow-[10px_10px_0px_#181926] relative">
          
          {/* Top Monitor Details */}
          <div className="flex items-center justify-between pb-3 px-2 border-b-2 border-[#181926]/10 mb-3 font-pixel text-[11px] text-[#5c503b]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#181926]/40 inline-block"></span>
              <span className="font-bold tracking-widest">FORTUNE 1994 CRT WORKSTATION</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline">640x480 COLOR MATRIX</span>
              {/* Power LED */}
              <div className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full transition-all ${
                  osState !== "off"
                    ? "bg-[#10b981] shadow-[0_0_8px_#10b981]"
                    : "bg-[#ec3750]/40"
                }`}></span>
                <span className="text-[10px] font-bold">
                  {osState !== "off" ? "PWR ON" : "STANDBY"}
                </span>
              </div>
            </div>
          </div>

          {/* CRT SCREEN INNER FRAME (Dark border around screen glass) */}
          <div className="bg-[#181926] p-2.5 sm:p-3.5 rounded-[18px] border-3 border-[#181926] shadow-inner relative overflow-hidden">
            
            {/* 1. STATE: OFF (The Monitor Screen Before Booting) */}
            {osState === "off" && (
              <div className="min-h-[460px] sm:min-h-[500px] bg-[#1a1c26] rounded-[12px] flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden text-center text-white select-none">
                
                {/* CRT Scanline overlay effect */}
                <div className="absolute inset-0 bg-[radial-gradient(#252a3d_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none"></div>

                {/* Top prompt */}
                <div className="flex items-center justify-between font-pixel text-xs text-[#10b981]">
                  <span>BIOS v3.11 READY</span>
                  <span className="animate-pulse">● CLICK POWER BUTTON BELOW</span>
                </div>

                {/* Center Content: Title, RSVP & Turn On */}
                <div className="my-auto py-6 space-y-6 max-w-lg mx-auto">
                  <div className="inline-block bg-[#ec3750] text-white px-3 py-1 font-pixel text-xs rounded border border-white/20 shadow-md">
                    ~ YOU SHIP, WE SHIP FOR TEEN FOUNDERS ~
                  </div>

                  <h1 className="text-5xl sm:text-7xl font-black font-sans tracking-tight text-white drop-shadow-md">
                    Fortune<span className="text-[#ffe066]">.</span>
                  </h1>

                  <p className="font-doodle text-xl sm:text-2xl text-[#ffe066] font-bold">
                    code software • get seed micro-funded • build a startup
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                    {/* Big Turn On Button */}
                    <button
                      onClick={handlePowerOn}
                      className="bg-[#10b981] hover:bg-[#0da472] text-[#181926] font-pixel text-sm sm:text-base font-bold py-3.5 px-7 rounded-xl border-2 border-white shadow-[4px_4px_0px_#000] transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
                    >
                      <span>⚡</span>
                      <span>TURN ON COMPUTER</span>
                    </button>

                    {/* RSVP Button */}
                    <a
                      href="https://rsvp.hackclub.community/fortune-ysws"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#ffe066] hover:bg-[#ffd533] text-[#181926] font-pixel text-sm sm:text-base font-bold py-3.5 px-6 rounded-xl border-2 border-white shadow-[4px_4px_0px_#000] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                      <span>🥠</span>
                      <span>RSVP for Fortune</span>
                    </a>
                  </div>
                </div>

                {/* Bottom specs bar */}
                <div className="font-pixel text-[11px] text-gray-400 flex flex-wrap justify-center gap-4">
                  <span>Track coding on Hackatime</span>
                  <span>•</span>
                  <span>$50-$150 HCB Grants</span>
                  <span>•</span>
                  <span>0% Equity</span>
                </div>
              </div>
            )}

            {/* 2. STATE: BOOTING UP ANIMATION */}
            {osState === "booting" && (
              <div className="min-h-[460px] sm:min-h-[500px] bg-[#11121a] rounded-[12px] flex flex-col items-center justify-center p-8 text-center text-white relative">
                
                {/* Glowing Mac/Windows Style Boot Screen */}
                <div className="space-y-6 max-w-sm">
                  <div className="text-6xl animate-bounce">🥠</div>
                  
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
              <div className="min-h-[520px] sm:min-h-[580px] bg-[#22577a] rounded-[12px] flex flex-col justify-between relative overflow-hidden select-none border-2 border-[#181926]">
                
                {/* Desktop Wallpaper Texture */}
                <div className="absolute inset-0 bg-[radial-gradient(#38a3a5_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none"></div>

                {/* TOP DESKTOP WORKSPACE */}
                <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
                  
                  {/* TOP-LEFT: THE CASH MONEY PROFILE NOTE */}
                  <div className="md:col-span-5">
                    <div className="bg-[#e8f5e9] border-3 border-[#2e7d32] p-4 sm:p-5 rounded-xl shadow-[5px_5px_0px_#181926] relative rotate-[-1deg] hover:rotate-0 transition-transform">
                      {/* Cash note stamp watermark */}
                      <div className="absolute top-2 right-3 font-pixel text-[10px] text-[#2e7d32]/60 border border-[#2e7d32]/40 px-1 rounded">
                        FORTUNE $100
                      </div>

                      <div className="flex items-center gap-3 pb-3 border-b-2 border-dashed border-[#2e7d32]/30 mb-3">
                        {session?.user?.image ? (
                          <img
                            src={session.user.image}
                            alt="Avatar"
                            className="w-12 h-12 rounded-full border-2 border-[#2e7d32] object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-[#2e7d32] text-white flex items-center justify-center font-pixel text-lg font-bold border-2 border-[#1b5e20]">
                            💵
                          </div>
                        )}
                        <div>
                          <div className="font-pixel text-[10px] text-[#2e7d32] uppercase font-bold tracking-wider">
                            FOUNDER CASH VOUCHER
                          </div>
                          <div className="font-sans font-black text-lg text-[#1b5e20] leading-tight">
                            @{session?.user?.name || "Anonymous Founder"}
                          </div>
                          <div className="font-pixel text-[10px] text-gray-600">
                            Status: <strong className="text-[#2e7d32]">Verified Teen Shipper</strong>
                          </div>
                        </div>
                      </div>

                      {/* Cash note stats */}
                      <div className="grid grid-cols-2 gap-2 font-pixel text-xs text-[#1b5e20]">
                        <div className="bg-white/80 p-2 rounded border border-[#2e7d32]/30 text-center">
                          <span className="text-[10px] text-gray-500 block">MICRO-GRANT</span>
                          <strong className="text-sm font-sans">$50 – $150</strong>
                        </div>
                        <div className="bg-white/80 p-2 rounded border border-[#2e7d32]/30 text-center">
                          <span className="text-[10px] text-gray-500 block">EQUITY TAKEN</span>
                          <strong className="text-sm font-sans text-[#ec3750]">0% (None)</strong>
                        </div>
                      </div>

                      {/* Cash Note Footer Auth Prompt */}
                      <div className="mt-3 pt-2 border-t border-dashed border-[#2e7d32]/30 flex items-center justify-between text-[11px] font-pixel">
                        <span className="text-[#2e7d32]">Hack Club Bank (HCB)</span>
                        {session?.user ? (
                          <button
                            onClick={() => signOut()}
                            className="text-[#c62828] hover:underline"
                          >
                            [Log out]
                          </button>
                        ) : (
                          <button
                            onClick={() => signIn("hackclub")}
                            className="text-[#1565c0] font-bold underline"
                          >
                            Connect Slack ↗
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* TOP-RIGHT: DESKTOP APPS & FOLDER ICONS */}
                  <div className="md:col-span-7 flex flex-wrap gap-4 items-start justify-start sm:justify-end">
                    
                    {/* Folder 1: Ship App */}
                    <div
                      onClick={() => setActiveWindow("ship")}
                      className="w-20 flex flex-col items-center gap-1 cursor-pointer p-2 rounded hover:bg-white/10 active:scale-95 transition-all text-white font-pixel text-[11px] text-center"
                    >
                      <div className="w-12 h-12 bg-[#ffe066] rounded-lg border-2 border-white flex items-center justify-center text-2xl shadow-md">
                        📦
                      </div>
                      <span className="drop-shadow">Ship Project</span>
                    </div>

                    {/* Folder 2: Roadmap */}
                    <div
                      onClick={() => scrollToSection("quest", "Roadmap")}
                      className="w-20 flex flex-col items-center gap-1 cursor-pointer p-2 rounded hover:bg-white/10 active:scale-95 transition-all text-white font-pixel text-[11px] text-center"
                    >
                      <div className="w-12 h-12 bg-[#38a3a5] rounded-lg border-2 border-white flex items-center justify-center text-2xl shadow-md">
                        📜
                      </div>
                      <span className="drop-shadow">Roadmap ↓</span>
                    </div>

                    {/* Folder 3: Shop / Loot */}
                    <div
                      onClick={() => setActiveWindow("shop")}
                      className="w-20 flex flex-col items-center gap-1 cursor-pointer p-2 rounded hover:bg-white/10 active:scale-95 transition-all text-white font-pixel text-[11px] text-center"
                    >
                      <div className="w-12 h-12 bg-[#ec3750] rounded-lg border-2 border-white flex items-center justify-center text-2xl shadow-md">
                        🛍️
                      </div>
                      <span className="drop-shadow">Shop</span>
                    </div>

                    {/* Folder 4: Discussion Room */}
                    <div
                      onClick={() => setActiveWindow("chat")}
                      className="w-20 flex flex-col items-center gap-1 cursor-pointer p-2 rounded hover:bg-white/10 active:scale-95 transition-all text-white font-pixel text-[11px] text-center"
                    >
                      <div className="w-12 h-12 bg-[#57cc99] rounded-lg border-2 border-white flex items-center justify-center text-2xl shadow-md">
                        💬
                      </div>
                      <span className="drop-shadow">Discuss</span>
                    </div>

                    {/* Folder 5: FAQ */}
                    <div
                      onClick={() => scrollToSection("faq", "FAQ")}
                      className="w-20 flex flex-col items-center gap-1 cursor-pointer p-2 rounded hover:bg-white/10 active:scale-95 transition-all text-white font-pixel text-[11px] text-center"
                    >
                      <div className="w-12 h-12 bg-[#ffffff] text-[#181926] rounded-lg border-2 border-[#181926] flex items-center justify-center text-2xl shadow-md">
                        ❓
                      </div>
                      <span className="drop-shadow">FAQ ↓</span>
                    </div>

                  </div>

                </div>

                {/* POPUP RETRO WINDOW WHEN AN ICON IS OPENED */}
                {activeWindow && (
                  <div className="absolute inset-x-4 top-4 bottom-14 bg-white rounded-lg border-3 border-[#181926] shadow-[8px_8px_0px_#181926] z-30 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    
                    {/* Window Titlebar */}
                    <div className="bg-[#181926] text-white px-3 py-2 flex items-center justify-between font-pixel text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#ec3750] inline-block"></span>
                        <span className="font-bold uppercase">
                          {activeWindow === "ship" && "📦 SHIP_SUBMISSION_APP.EXE"}
                          {activeWindow === "shop" && "🛍️ FORTUNE_REWARDS_SHOP.EXE"}
                          {activeWindow === "chat" && "💬 FOUNDER_SLACK_CHAT.EXE"}
                          {activeWindow === "roadmap" && "📜 SPRINT_QUEST_MAP.EXE"}
                          {activeWindow === "faq" && "❓ FREQUENTLY_ASKED_QUESTIONS.TXT"}
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveWindow(null)}
                        className="bg-[#ec3750] hover:bg-[#d6253e] text-white px-2 py-0.5 rounded font-bold"
                      >
                        ✕ CLOSE
                      </button>
                    </div>

                    {/* Window Scrollable Body */}
                    <div className="p-5 flex-1 overflow-y-auto text-[#181926]">
                      {activeWindow === "ship" && (
                        <div className="space-y-4 max-w-lg mx-auto">
                          <h3 className="font-sans font-black text-2xl">Ready to ship to Step 1 Review?</h3>
                          <p className="font-doodle text-base text-gray-600">
                            Our review team (@Noben_Nobi &amp; organizers) checks your working demo and opens your HCB seed grant.
                          </p>
                          <Link
                            href="/dashboard"
                            className="fortune-btn fortune-btn-gold text-sm block text-center py-3"
                          >
                            🚀 Open Full Shipping Dashboard
                          </Link>
                        </div>
                      )}

                      {activeWindow === "shop" && (
                        <div className="space-y-4 text-center">
                          <h3 className="font-sans font-black text-2xl">Fortune Loot &amp; Grand Prizes 🛍️</h3>
                          <p className="font-doodle text-lg text-gray-600">
                            Convert verified startup revenue into Fortune Points or win the Top 5 Grand Prizes!
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-pixel text-xs">
                            <div className="p-3 bg-[#f7f1e1] border-2 border-[#181926] rounded">
                              🏆 Top 5 Grand Prize
                            </div>
                            <div className="p-3 bg-[#f7f1e1] border-2 border-[#181926] rounded">
                              💻 Hardware Grants
                            </div>
                            <div className="p-3 bg-[#f7f1e1] border-2 border-[#181926] rounded">
                              🥠 Golden Fortune Trophy
                            </div>
                          </div>
                        </div>
                      )}

                      {activeWindow === "chat" && (
                        <div className="space-y-4 text-center max-w-md mx-auto">
                          <span className="text-4xl block">💬</span>
                          <h3 className="font-sans font-black text-2xl">Founder Discussion Channels</h3>
                          <p className="font-doodle text-base text-gray-600">
                            Hang out, brainstorm startup mechanics, share daily commits, and get help from organizers!
                          </p>
                          <div className="flex flex-col gap-2 pt-2">
                            <a
                              href="https://hackclub.slack.com/messages/fortune"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="fortune-btn text-xs py-2"
                            >
                              Join #fortune (Chat &amp; Brainstorm) ↗
                            </a>
                            <a
                              href="https://hackclub.slack.com/messages/fortune-help"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="fortune-btn fortune-btn-gold text-xs py-2"
                            >
                              Join #fortune-help (Organizer Support) ↗
                            </a>
                          </div>
                        </div>
                      )}

                      {activeWindow === "roadmap" && (
                        <div className="space-y-4">
                          <h3 className="font-sans font-black text-2xl">Founder Sprint Roadmap 📜</h3>
                          <ol className="space-y-2 font-pixel text-xs text-gray-700 list-decimal pl-5">
                            <li>Code initial MVP &amp; track 10+ hours on Hackatime</li>
                            <li>Pass Step 1 Review &amp; get $50–$150 seed funding via HCB</li>
                            <li>3–4 Month Growth Sprint (get real paying users!)</li>
                            <li>Pass Step 2 Review: Win Top 5 Grand Prizes or claim shop swag!</li>
                          </ol>
                        </div>
                      )}

                      {activeWindow === "faq" && (
                        <div className="space-y-3 font-mono text-xs text-gray-700">
                          <div>
                            <strong className="text-sm font-bold block text-black">Q: Who can join?</strong>
                            Any teenager 18 or under worldwide. 100% free!
                          </div>
                          <div>
                            <strong className="text-sm font-bold block text-black">Q: Is seed money real?</strong>
                            Yes! Granted through Hack Club Bank. Hack Club takes 0% equity.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* BOTTOM TASKBAR / NAVIGATION BAR */}
                <div className="bg-[#181926] text-white px-3 py-2 border-t-2 border-[#181926] flex items-center justify-between font-pixel text-xs relative z-20">
                  
                  {/* Start / Home button */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveWindow(null)}
                      className="bg-[#ffe066] hover:bg-[#ffd533] text-[#181926] px-3 py-1 rounded font-bold flex items-center gap-1.5 shadow-[1px_1px_0px_#000]"
                    >
                      <span>🥠</span>
                      <span>Start</span>
                    </button>

                    <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-gray-700">
                      <button
                        onClick={() => setActiveWindow("ship")}
                        className={`px-2 py-1 rounded hover:bg-gray-800 ${
                          activeWindow === "ship" ? "bg-gray-800 border border-gray-600" : ""
                        }`}
                      >
                        📦 Ship
                      </button>
                      <button
                        onClick={() => setActiveWindow("shop")}
                        className={`px-2 py-1 rounded hover:bg-gray-800 ${
                          activeWindow === "shop" ? "bg-gray-800 border border-gray-600" : ""
                        }`}
                      >
                        🛍️ Shop
                      </button>
                      <button
                        onClick={() => setActiveWindow("chat")}
                        className={`px-2 py-1 rounded hover:bg-gray-800 ${
                          activeWindow === "chat" ? "bg-gray-800 border border-gray-600" : ""
                        }`}
                      >
                        💬 Discuss
                      </button>
                    </div>
                  </div>

                  {/* Right side: Power Off button & Clock */}
                  <div className="flex items-center gap-3 text-[11px] text-gray-300">
                    <button
                      onClick={handlePowerOff}
                      className="text-[#ec3750] hover:text-white hover:underline"
                      title="Shut down computer"
                    >
                      [Shut Down]
                    </button>
                    <span className="bg-black/60 px-2 py-0.5 rounded border border-gray-700 text-[#10b981]">
                      1994 OS
                    </span>
                  </div>

                </div>

              </div>
            )}

          </div>

          {/* Computer Stand / Base */}
          <div className="w-48 h-5 bg-[#d9cfb0] mx-auto border-x-4 border-b-4 border-[#181926] rounded-b-xl shadow-md mt-0"></div>
          <div className="w-72 h-3 bg-[#c9bfa0] mx-auto border-4 border-[#181926] rounded-full shadow-lg"></div>

        </div>

        {/* Animated Downward Arrow Indicator when Roadmap or FAQ is clicked */}
        {scrollPrompt && (
          <div className="flex flex-col items-center justify-center mt-6 animate-bounce transition-all">
            <div className="bg-[#ffe066] text-[#181926] px-4 py-2 rounded-full border-3 border-[#181926] shadow-[4px_4px_0px_#181926] font-pixel text-xs sm:text-sm font-bold flex items-center gap-2">
              <span>📜 Scrolling down to {scrollPrompt}</span>
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

