"use client";

import React, { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useSession, signIn } from "next-auth/react";
import HackClubAuthButton from "./HackClubAuthButton";
import { Wrench, Crown, Users, Zap, Coins, Map, HelpCircle, Dices, ArrowRight, Check } from "lucide-react";

export default function FortuneHero() {
  const { data: session } = useSession();
  // random funny startup ideas i came up with during math class
  const funnyIdeas = [
    "A SaaS that texts your mom every time you commit broken code to main.",
    "A Discord bot that charges annoying members 10 cents to ping @everyone.",
    "A browser extension that replaces all LinkedIn posts with pictures of capybaras.",
    "An AI that insults your pull requests in the voice of Gordon Ramsay.",
    "A Minecraft server that bills players real rent for building dirt huts.",
    "An alarm clock web app that donates $1 of your money to your enemy if you snooze.",
  ];

  const [ideaIndex, setIdeaIndex] = useState(0);

  // please do not look at this function it just makes screen go boom with colors
  const crackCookie = () => {
    setIdeaIndex((prev) => (prev + 1) % funnyIdeas.length);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x: 0.7, y: 0.4 },
      colors: ["#ffe066", "#ec3750", "#10b981", "#181926"],
    });
  };

  const handleRsvp = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <section className="min-h-[90vh] flex flex-col justify-between pt-16 pb-12 px-6 sm:px-12 max-w-6xl mx-auto">

      {/* top sub-bar */}
      <div className="flex justify-between items-center pl-28 sm:pl-32">
        <div className="bg-white px-3 py-1 rounded-full border-2 border-[#181926] shadow-[2px_2px_0px_#181926] font-pixel text-xs">
          <span className="text-[#ec3750] font-bold">★ HACK CLUB YSWS</span>
        </div>

        <div className="flex items-center gap-2 font-pixel text-xs">
          <a
            href="https://hackclub.slack.com/messages/fortune"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-[#181926] px-3 py-1.5 rounded-md border-2 border-[#181926] shadow-[2px_2px_0px_#181926] hover:bg-[#ffe066]"
          >
            #fortune
          </a>
          <a
            href="https://hackclub.slack.com/messages/fortune-help"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-[#181926] px-3 py-1.5 rounded-md border-2 border-[#181926] shadow-[2px_2px_0px_#181926] hover:bg-[#ffe066]"
          >
            #fortune-help
          </a>
        </div>
      </div>

      {/* main hero body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-8">

        {/* left col: words */}
        <div className="lg:col-span-7">
          <div className="font-doodle text-2xl text-[#ec3750] font-bold -rotate-2">
            ~ a hack club ysws for teen founders ~
          </div>

          <h1 className="font-sans font-black text-6xl sm:text-7xl text-[#181926] tracking-tight leading-none my-2">
            Fortune<span className="text-[#f59e0b]">.</span>
          </h1>

          {/* Organizer and Team Credits */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-1.5 bg-[#fef2f2] border-2 border-[#181926] px-3 py-1 rounded-full shadow-[2px_2px_0px_#181926] text-xs font-pixel">
              <span className="text-[#ec3750] font-bold flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5" /> Lead Developer:
              </span>
              <span className="text-[#181926] font-bold">Priyanshu Singh</span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-[#fffbeb] border-2 border-[#181926] px-3 py-1 rounded-full shadow-[2px_2px_0px_#181926] text-xs font-pixel">
              <span className="text-[#b45309] font-bold flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" /> Organizer:
              </span>
              <span className="text-[#181926] font-bold">@Noben_Nobi</span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-[#f0fdf4] border-2 border-[#181926] px-3 py-1 rounded-full shadow-[2px_2px_0px_#181926] text-xs font-pixel">
              <span className="text-[#15803d] font-bold flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Co-Organizer:
              </span>
              <span className="text-[#181926] font-bold">@itsnotketan</span>
            </div>
          </div>

          <p className="font-doodle text-2xl text-[#b82438] font-bold mb-4">
            code whatever you want • get seed funded • make actual cash
          </p>

          <div className="wobbly-card p-5 max-w-lg mb-6 bg-white text-base text-[#242636] font-medium leading-relaxed">
            tired of building stuff that dies in a github graveyard? pick any tech stack, build software people actually want, pitch your idea, and get <strong>seed micro-funding</strong> via Hack Club Bank. then spend 3-4 months growing it into a real business!
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            {session?.user ? (
              <Link
                href="/dashboard"
                className="fortune-btn fortune-btn-gold text-base inline-flex items-center gap-2"
              >
                <Zap className="w-4 h-4" /> Open Dashboard
              </Link>
            ) : (
              <button
                onClick={() => signIn("hackclub")}
                className="fortune-btn fortune-btn-gold text-base inline-flex items-center gap-2"
              >
                <Zap className="w-4 h-4" /> Start Shipping
              </button>
            )}

            <a
              href="#quest"
              className="fortune-btn text-base inline-flex items-center gap-1.5"
            >
              <Map className="w-4 h-4" /> How It Works
            </a>

            <a
              href="#faq"
              className="fortune-btn text-base inline-flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4" /> FAQ
            </a>

            <a
              href="https://hackclub.slack.com/messages/fortune"
              target="_blank"
              rel="noopener noreferrer"
              className="font-doodle text-lg font-bold text-[#ec3750] hover:underline rotate-[-1deg] inline-flex items-center gap-1"
            >
              join #fortune on slack <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* silly stamps */}
          <div className="flex flex-wrap gap-2 text-xs font-pixel">
            <span className="bg-white px-2 py-1 border-2 border-dashed border-[#ec3750] text-[#ec3750] rounded rotate-[-1deg] inline-flex items-center gap-1">
              <Check className="w-3 h-3" /> 100% free for teens
            </span>
            <span className="bg-white px-2 py-1 border-2 border-dashed border-[#10b981] text-[#10b981] rounded rotate-[1deg] inline-flex items-center gap-1">
              <Check className="w-3 h-3" /> real seed funding
            </span>
            <span className="bg-white px-2 py-1 border-2 border-dashed border-[#f59e0b] text-[#b37700] rounded rotate-[-0.5deg] inline-flex items-center gap-1">
              <Check className="w-3 h-3" /> top 5 win prizes
            </span>
          </div>
        </div>

        {/* right col: interactive cookie */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="wobbly-card p-6 bg-[#fffdf5] max-w-sm text-center rotate-[1deg]">
            <div className="tape" />

            <div className="font-pixel text-xs text-[#ec3750] font-bold mb-1 flex items-center justify-center gap-1">
              CLICK COOKIE TO CRACK IDEA <Coins className="w-3.5 h-3.5 inline text-[#f59e0b]" />
            </div>

            {/* doodle cookie */}
            <div
              onClick={crackCookie}
              className="cursor-pointer my-3 hover:scale-105 transition-transform inline-block"
              title="poke the cookie"
            >
              <svg width="110" height="90" viewBox="0 0 100 80">
                <path
                  d="M 15 55 Q 20 20 50 25 Q 55 45 45 70 Q 30 60 15 55 Z"
                  fill="#ffcf4d"
                  stroke="#181926"
                  strokeWidth="3.5"
                />
                <path
                  d="M 85 55 Q 80 20 50 25 Q 45 45 55 70 Q 70 60 85 55 Z"
                  fill="#f5be38"
                  stroke="#181926"
                  strokeWidth="3.5"
                />
                {/* paper fortune */}
                <rect x="36" y="8" width="28" height="20" rx="3" fill="#ffffff" stroke="#181926" strokeWidth="2.5" transform="rotate(-6 50 18)" />
                <line x1="40" y1="16" x2="60" y2="14" stroke="#ec3750" strokeWidth="2" />
                {/* derpy sunglasses */}
                <rect x="32" y="36" width="10" height="7" rx="1.5" fill="#181926" />
                <rect x="44" y="36" width="10" height="7" rx="1.5" fill="#181926" />
                <line x1="42" y1="39" x2="44" y2="39" stroke="#181926" strokeWidth="2" />
              </svg>
            </div>

            {/* the fortune message */}
            <div className="p-3 bg-white border-2 border-dashed border-[#ec3750] rounded-lg my-2 min-h-[65px] flex items-center justify-center">
              <p className="font-doodle text-lg font-bold text-[#181926] leading-tight">
                "{funnyIdeas[ideaIndex]}"
              </p>
            </div>

            <button
              onClick={crackCookie}
              className="font-pixel text-xs bg-[#ffe066] text-[#181926] py-2 px-3 rounded-lg border-2 border-[#181926] shadow-[2px_2px_0px_#181926] hover:bg-[#ffd633] inline-flex items-center gap-1.5"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>Gimme Another Idea</span>
            </button>
          </div>
        </div>

      </div>

    </section>
  );
}
