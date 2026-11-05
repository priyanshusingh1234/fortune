"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { signIn } from "next-auth/react";
import { ArrowRight, Check, LogIn, Crown, Users, Wrench } from "lucide-react";

export default function SkyLandingPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  // Fun, rotating startup fortunes that stream out of the cookie
  const fortunes = [
    "★ HACK CLUB YSWS • WE FUND YOUR CODE ★",
    "★ 32 USERS ARE WAITING • SHIP IT! ★",
    "★ STOP LETTING CODE DIE IN GITHUB GRAVEYARDS ★",
    "★ 100% FREE FOR TEENS • GET SEED FUNDED ★",
    "★ BUILD SOFTWARE PEOPLE WANT • WE FUND IT ★",
    "★ FROM ZERO TO FIRST PAYING CUSTOMER ★",
    "★ $100+ SEED MICRO-GRANT VIA HCB ★",
    "★ CODE WHATEVER YOU WANT • SHIP WITH HACK CLUB ★",
  ];

  const [fortuneIndex, setFortuneIndex] = useState(0);
  const [isCookieWiggling, setIsCookieWiggling] = useState(false);

  // Crack the cookie to get a new fortune
  const crackFortune = () => {
    setIsCookieWiggling(true);
    setFortuneIndex((prev) => (prev + 1) % fortunes.length);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x: 0.25, y: 0.2 },
      colors: ["#f59e0b", "#fbbf24", "#ec3750", "#ffffff"],
    });

    setTimeout(() => {
      setIsCookieWiggling(false);
    }, 350);
  };

  const handleRsvp = (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 },
      colors: ["#f59e0b", "#ec3750", "#10b981", "#ffffff"],
    });

    const rsvpUrl = email.trim() && email.includes("@")
      ? `https://rsvp.hackclub.community/fortune-ysws?email=${encodeURIComponent(email.trim())}`
      : "https://rsvp.hackclub.community/fortune-ysws";

    // Open official Hack Club RSVP portal
    window.open(rsvpUrl, "_blank", "noopener,noreferrer");

    setStatus("success");
    setMessage("🎉 Opening official Hack Club RSVP portal... Claim your spot!");
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between items-center text-center px-4 py-8 sm:py-12 select-none fortune-sunset-gradient">
      
      {/* Ambient Stardust & Twinkling Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        
        {/* Floating Twinkle Stars */}
        <div className="absolute top-[8%] left-[18%] twinkle-star text-[#fef08a] opacity-80 text-xl font-bold">✦</div>
        <div className="absolute top-[14%] right-[24%] twinkle-star text-[#fef08a] opacity-70 text-sm font-bold" style={{ animationDelay: "1s" }}>✧</div>
        <div className="absolute top-[28%] left-[8%] twinkle-star text-[#fde047] opacity-60 text-base font-bold" style={{ animationDelay: "1.5s" }}>✦</div>
        <div className="absolute top-[38%] right-[12%] twinkle-star text-[#fef08a] opacity-75 text-lg font-bold" style={{ animationDelay: "2s" }}>✧</div>
        <div className="absolute top-[6%] right-[8%] twinkle-star text-[#ffffff] opacity-90 text-2xl font-bold" style={{ animationDelay: "0.5s" }}>✦</div>

        {/* Clean Geometric Coin 1: '$' Coin (Top Right) */}
        <div className="absolute top-[12%] right-[14%] coin-float-1 hidden sm:block opacity-95">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Hard, solid SVG drop shadow with no blur */}
            <circle cx="25" cy="25" r="20" fill="#181926" />
            {/* Outer gold rim with dark brutalist border */}
            <circle cx="22" cy="22" r="20" fill="#f59e0b" stroke="#181926" strokeWidth="2.5" />
            {/* Inner gold coin face */}
            <circle cx="22" cy="22" r="15" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
            {/* Perfectly centered text using dominant-baseline="central" */}
            <text
              x="22"
              y="22"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#181926"
              fontSize="18"
              fontWeight="900"
              fontFamily="Space Grotesk, sans-serif"
            >
              $
            </text>
          </svg>
        </div>

        {/* Clean Geometric Coin 2: '★' Coin (Middle Left) */}
        <div className="absolute top-[44%] left-[6%] coin-float-2 hidden sm:block opacity-90">
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Hard, solid SVG drop shadow with no blur */}
            <circle cx="22" cy="22" r="17" fill="#181926" />
            {/* Outer gold rim with dark border */}
            <circle cx="19" cy="19" r="17" fill="#f59e0b" stroke="#181926" strokeWidth="2.5" />
            {/* Inner gold face */}
            <circle cx="19" cy="19" r="13" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
            {/* Perfectly centered star */}
            <text
              x="19"
              y="19"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#181926"
              fontSize="14"
              fontWeight="900"
            >
              ★
            </text>
          </svg>
        </div>

        {/* Clean Geometric Coin 3: 'HC' Coin (Lower Right) */}
        <div className="absolute bottom-[18%] right-[8%] coin-float-1 hidden md:block opacity-90">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Hard, solid SVG drop shadow with no blur */}
            <circle cx="23" cy="23" r="18" fill="#181926" />
            {/* Outer gold rim with dark border */}
            <circle cx="20" cy="20" r="18" fill="#f59e0b" stroke="#181926" strokeWidth="2.5" />
            {/* Inner gold face */}
            <circle cx="20" cy="20" r="14" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
            {/* Perfectly centered text using dominant-baseline="central" */}
            <text
              x="20"
              y="20"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#181926"
              fontSize="12"
              fontWeight="900"
              fontFamily="Space Grotesk, sans-serif"
            >
              HC
            </text>
          </svg>
        </div>

      </div>

      {/* TOP BAR: Symmetrical Winged Fortune Cookie Mascot with Centered Streamer & Slack Sign-In */}
      <div className="relative w-full max-w-6xl mx-auto flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 z-20 pt-2 px-2 sm:px-4">
        
        {/* SYMMETRICAL MASCOT + CENTERED BANNER */}
        <div
          onClick={crackFortune}
          className={`cookie-float group cursor-pointer inline-flex items-center transition-transform max-w-full ${
            isCookieWiggling ? "scale-105 rotate-2" : ""
          }`}
          title="Click the Fortune Cookie to crack a new fortune!"
        >
          <div className="relative flex items-center max-w-full">
            
            {/* Symmetrical Winged Fortune Cookie SVG (160x110) */}
            <svg
              width="110"
              height="80"
              viewBox="0 0 160 110"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0 transition-transform group-hover:scale-105"
            >
              <defs>
                {/* Reusable Wing Definition for Exact Geometric Mirroring */}
                <g id="cookie-wing-shape">
                  <path
                    d="M 48 52 C 34 44, 16 38, 8 22 C 6 12, 18 14, 26 24 C 22 14, 30 10, 38 18 C 34 26, 42 42, 48 52 Z"
                    fill="#ffffff"
                    stroke="#181926"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 26 24 C 32 32, 40 42, 44 48"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </g>
              </defs>

              {/* Left Wing (flapping around attachment point 48px, 52px) */}
              <g className="fortune-wing-left origin-[48px_52px]">
                <use href="#cookie-wing-shape" />
              </g>

              {/* Right Wing (Exact Mathematical Mirror via transform across center x=80) */}
              <g className="fortune-wing-right origin-[112px_52px]">
                <g transform="translate(160, 0) scale(-1, 1)">
                  <use href="#cookie-wing-shape" />
                </g>
              </g>

              {/* Hard 0px Blur Shadow for Cookie Body */}
              <path
                d="M 40 76 C 28 50, 48 30, 80 40 C 112 30, 132 50, 120 76 C 108 94, 92 84, 80 64 C 68 84, 52 94, 40 76 Z"
                fill="#181926"
                transform="translate(3, 4)"
              />

              {/* Back Shell / Depth (Symmetrical) */}
              <path
                d="M 40 76 C 28 50, 48 30, 80 40 C 112 30, 132 50, 120 76 C 108 94, 92 84, 80 64 C 68 84, 52 94, 40 76 Z"
                fill="#d97706"
                stroke="#181926"
                strokeWidth="2.5"
              />

              {/* Inner Crease Shadow (Symmetrical) */}
              <path
                d="M 52 75 C 65 84, 74 76, 80 64 C 86 76, 95 84, 108 75 C 98 86, 62 86, 52 75 Z"
                fill="#92400e"
              />

              {/* Left Front Lobe */}
              <path
                d="M 38 72 C 28 50, 46 32, 74 40 C 80 50, 72 70, 52 76 C 45 78, 40 76, 38 72 Z"
                fill="#fbbf24"
                stroke="#181926"
                strokeWidth="2.5"
              />

              {/* Right Front Lobe (Exact Symmetrical Mirror: x' = 160 - x) */}
              <path
                d="M 122 72 C 132 50, 114 32, 86 40 C 80 50, 88 70, 108 76 C 115 78, 120 76, 122 72 Z"
                fill="#fbbf24"
                stroke="#181926"
                strokeWidth="2.5"
              />

              {/* Baked Highlights (Symmetrical) */}
              <path
                d="M 42 48 C 48 38, 62 36, 70 40"
                stroke="#fef3c7"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M 118 48 C 112 38, 98 36, 90 40"
                stroke="#fef3c7"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Symmetrical Happy Eyes */}
              <path d="M 54 55 Q 58 51 62 55" stroke="#181926" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 98 55 Q 102 51 106 55" stroke="#181926" strokeWidth="2.5" strokeLinecap="round" fill="none" />

              {/* Symmetrical Blushing Cheeks */}
              <circle cx="52" cy="60" r="3.5" fill="#f43f5e" />
              <circle cx="108" cy="60" r="3.5" fill="#f43f5e" />
            </svg>

            {/* Trailing Fortune Paper Ribbon (Centering + No Edge Clipping) */}
            <div className="fortune-streamer-flutter origin-left -ml-2 flex items-center min-w-0 max-w-[calc(100vw-150px)] sm:max-w-md">
              <div className="relative bg-white text-[#ec3750] font-bold px-3 sm:px-4 py-1.5 rounded-sm border-2 border-[#181926] shadow-[3px_3px_0px_#181926] flex items-center justify-center w-full">
                {/* Traditional Fortune Cookie Dashed Border Frame */}
                <div className="border-t border-b border-dashed border-[#ec3750]/60 py-0.5 px-1.5 flex items-center justify-center gap-2 text-center w-full">
                  <span className="font-mono font-bold tracking-wider text-[10px] sm:text-xs uppercase text-center leading-tight truncate sm:whitespace-nowrap">
                    {fortunes[fortuneIndex]}
                  </span>
                  <span className="text-[9px] bg-[#fef2f2] text-[#ec3750] px-1 py-0.5 rounded font-mono font-bold border border-[#ec3750]/30 hidden lg:inline shrink-0">
                    click to crack
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Top Right Quick Slack Sign-In */}
        <button
          onClick={() => signIn("hackclub")}
          className="bg-white hover:bg-[#fffdf5] text-[#181926] px-4 py-2 rounded-xl font-bold font-pixel text-xs sm:text-sm border-2 border-[#181926] shadow-[3px_3px_0px_#181926] hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 shrink-0"
        >
          <LogIn className="w-3.5 h-3.5 text-[#ec3750]" />
          <span>Sign In</span>
        </button>

      </div>

      {/* CENTER STAGE: Crisp 3D Golden Typography + Subtitle with Vector Zigzag + Clean Rounded Card */}
      <div className="relative z-10 max-w-2xl w-full mx-auto my-auto py-8 sm:py-12 flex flex-col items-center">
        
        {/* Crisp 3D Main Title "Fortune" with Hard-Edged Layered 3D Shadow (0px blur) */}
        <h1 className="fortune-3d-gold-title text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tight leading-none mb-3 sm:mb-4 select-none">
          Fortune
        </h1>

        {/* Primary Subtitle with Clean Vector Zigzag Underline on 'We fund it.' */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-3 select-none">
          Build whatever you want.{" "}
          <span className="relative inline-block text-[#fef08a] font-black">
            <span>We fund it.</span>
            {/* Custom Inline SVG Zigzag Underline */}
            <svg
              className="absolute left-0 -bottom-2 w-full h-2.5 overflow-visible pointer-events-none"
              viewBox="0 0 120 10"
              fill="none"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 1 6 L 10 2 L 19 6 L 28 2 L 37 6 L 46 2 L 55 6 L 64 2 L 73 6 L 82 2 L 91 6 L 100 2 L 109 6 L 119 2"
                stroke="#fef08a"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </h2>

        {/* Tagline: Hack Club You Ship, We Ship for teens */}
        <p className="text-white/95 text-xs sm:text-sm md:text-base font-semibold mb-8 sm:mb-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
          A Hack Club You Ship, We Ship program for teens 13–18.
        </p>

        {/* Clean, Rounded Card with Hard Brutalist UI Shadow */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md sm:max-w-lg w-full border-3 border-[#181926] shadow-[6px_6px_0px_#181926] mx-auto text-left relative transition-all">
          
          <label 
            htmlFor="email-input"
            className="block text-center text-[11px] sm:text-xs font-bold tracking-widest text-slate-500 uppercase mb-3.5 font-pixel"
          >
            RSVP TO HEAR WHEN IT OPENS
          </label>

          <form onSubmit={handleRsvp} className="flex flex-col sm:flex-row gap-2.5">
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder="you@example.com"
              className="flex-1 px-4 py-3 rounded-xl border-2 border-[#181926] text-slate-800 placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#f59e0b] transition-all font-sans"
            />
            <button
              type="submit"
              className="bg-[#ec3750] hover:bg-[#d9223c] active:translate-y-0.5 text-white font-bold px-7 py-3 rounded-xl border-2 border-[#181926] shadow-[3px_3px_0px_#181926] transition-all font-pixel text-xs sm:text-sm cursor-pointer shrink-0"
            >
              RSVP →
            </button>
          </form>

          {/* Direct RSVP Portal Link */}
          <div className="mt-2.5 text-center">
            <a
              href="https://rsvp.hackclub.community/fortune-ysws"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-pixel text-gray-500 hover:text-[#ec3750] underline inline-flex items-center gap-1 transition-colors"
            >
              <span>Or RSVP directly at rsvp.hackclub.community/fortune-ysws</span>
              <ArrowRight className="w-3 h-3 inline" />
            </a>
          </div>

          {/* Status / Feedback Area */}
          {status === "error" && (
            <p className="text-[#ec3750] font-bold text-xs sm:text-sm mt-3 text-center font-pixel animate-in fade-in">
              {message}
            </p>
          )}

          {status === "success" && (
            <div className="bg-[#f0fdf4] border-2 border-[#181926] shadow-[2px_2px_0px_#181926] text-[#166534] text-xs sm:text-sm font-bold rounded-xl p-3 mt-3.5 text-center font-pixel animate-in fade-in flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4 text-[#16a34a] shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* Quick Divider & Direct Hack Club Slack Sign-In */}
          <div className="mt-4 pt-3.5 border-t-2 border-slate-100 flex items-center justify-center text-center">
            <button
              onClick={() => signIn("hackclub")}
              className="text-xs text-slate-500 hover:text-[#ec3750] font-medium transition-colors flex items-center gap-1 group font-pixel"
            >
              <span>Already in Hack Club?</span>
              <span className="font-bold text-[#ec3750] group-hover:underline">
                Sign in with Slack
              </span>
              <ArrowRight className="w-3 h-3 text-[#ec3750] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

        </div>

      </div>

      {/* FOOTER: Organizers & Slack Link */}
      <div className="relative z-10 pb-4 pt-2 text-center space-y-3">
        {/* Organizer & Team Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 font-pixel text-[11px] sm:text-xs">
          <span className="bg-[#fffbeb] text-[#92400e] px-3 py-1 rounded-full border-2 border-[#181926] shadow-[2px_2px_0px_#181926] font-bold flex items-center gap-1.5 hover:-translate-y-0.5 transition-transform">
            <Crown className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>Organizer: <strong>@Noben_Nobi</strong></span>
          </span>
          <span className="bg-[#f0fdf4] text-[#166534] px-3 py-1 rounded-full border-2 border-[#181926] shadow-[2px_2px_0px_#181926] font-bold flex items-center gap-1.5 hover:-translate-y-0.5 transition-transform">
            <Users className="w-3.5 h-3.5 text-[#10b981]" />
            <span>Co-Organizer: <strong>@itsnotketan</strong></span>
          </span>
          <span className="bg-[#fef2f2] text-[#991b1b] px-3 py-1 rounded-full border-2 border-[#181926] shadow-[2px_2px_0px_#181926] font-bold flex items-center gap-1.5 hover:-translate-y-0.5 transition-transform">
            <Wrench className="w-3.5 h-3.5 text-[#ec3750]" />
            <span>Lead Dev: <strong>Priyanshu Singh</strong></span>
          </span>
        </div>

        {/* Questions Link */}
        <p className="text-white/85 hover:text-white text-xs sm:text-sm font-medium transition-colors drop-shadow-sm font-pixel">
          Questions? Ask in{" "}
          <a
            href="https://app.slack.com/client/E09V59WQY1E/C0CBJ54GYMQ"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline decoration-white/50 hover:decoration-white transition-colors"
          >
            #fortune
          </a>{" "}
          on the Hack Club Slack.
        </p>
      </div>

    </section>
  );
}
