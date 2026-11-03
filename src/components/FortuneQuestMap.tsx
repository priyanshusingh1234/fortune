"use client";

import React from "react";
import StartupCalculator from "@/components/StartupCalculator";

export default function FortuneQuestMap() {

  const steps = [
    {
      num: "01",
      title: "Code software & track time",
      tag: "THE FORGE",
      desc: "Build anything you want: web app, Discord bot, game with in-app purchases, micro-SaaS, or weird dev tool. Work solo or squad up with friends. Track your hours on Hackatime so we know you didn't just tell an AI to build it.",
      funnyNote: "if you use PHP we won't judge (much).",
      rot: "rotate-[-1deg]",
    },
    {
      num: "02",
      title: "Step 1 Review: Submit the pitch",
      tag: "THE FILTER",
      desc: "Send us your repo and a short explanation of how your business actually makes money. Our review team checks that you hit the required coding hours and that your business idea isn't complete garbage.",
      funnyNote: "if rejected, you get honest feedback so you can fix it and try again.",
      rot: "rotate-[1deg]",
    },
    {
      num: "03",
      title: "Get seed micro-funding",
      tag: "THE BAG",
      desc: "Pass review and receive lean seed money through Hack Club Bank (HCB). We intentionally keep it lean so you learn how to hustle: use it to buy your .com domain, pay for VPS/Vercel hosting, run targeted ads, or get API keys.",
      funnyNote: "please do not buy 50 energy drinks with this money.",
      rot: "rotate-[-0.5deg]",
    },
    {
      num: "04",
      title: "The 3-4 month growth hustle",
      tag: "THE GRIND",
      desc: "Launch it to real humans. Post on Product Hunt, email real users, get your first paying customer! Whenever you get stuck, yell in #fortune and #fortune-help and fellow teen founders will help you out.",
      funnyNote: "first sale feeling hits different, trust me.",
      rot: "rotate-[0.8deg]",
    },
    {
      num: "05",
      title: "Step 2 Review & prizes drop",
      tag: "THE LOOT",
      desc: "At the end of the sprint, we review all active businesses, user traction, and earnings. The Top 5 Best Businesses win massive prizes! Everyone else converts their earnings into Fortune Points for shop loot.",
      funnyNote: "zero losers: every teen who ships claims real prizes.",
      rot: "rotate-[-1deg]",
    },
  ];

  return (
    <section className="py-16 px-6 max-w-5xl mx-auto" id="quest">
      
      {/* section header */}
      <div className="text-center mb-12">
        <span className="font-doodle text-2xl text-[#ec3750] font-bold block rotate-[-1deg]">
          ★ the 5-step roadmap ★
        </span>
        <h2 className="font-sans font-black text-4xl sm:text-5xl text-[#181926] mt-1">
          How Fortune Works
        </h2>
        <p className="font-doodle text-lg text-[#3a3d52] font-semibold mt-1">
          from your first git commit to actual money in your bank account
        </p>
      </div>

      {/* cards list */}
      <div className="space-y-6 mb-16">
        {steps.map((st, i) => (
          <div
            key={i}
            className={`wobbly-card p-6 bg-white relative ${st.rot}`}
          >
            <div className="tape" />

            <div className="flex justify-between items-center mb-2">
              <span className="font-pixel text-xs text-[#ec3750] font-bold">
                PHASE {st.num}
              </span>
              <span className="font-pixel text-[10px] bg-gray-100 px-2 py-0.5 rounded border border-black font-bold">
                {st.tag}
              </span>
            </div>

            <h3 className="font-sans font-black text-2xl text-[#181926] mb-2">
              {st.title}
            </h3>

            <p className="text-sm text-[#3a3d52] font-medium leading-relaxed mb-3">
              {st.desc}
            </p>

            <div className="font-doodle text-sm font-bold text-[#ec3750]">
              * {st.funnyNote}
            </div>
          </div>
        ))}
      </div>

      {/* interactive calculator */}
      <div className="wobbly-card bg-[#fffdf0] max-w-2xl mx-auto mb-16 rotate-[0.5deg] relative">
        <div className="tape" />
        <StartupCalculator />
      </div>

      {/* note for sponsors */}
      <div className="wobbly-card p-6 bg-white max-w-2xl mx-auto rotate-[-0.3deg] text-left">
        <div className="font-pixel text-xs text-[#ec3750] font-bold mb-1">
          NOTE FOR SPONSORS &amp; DONORS
        </div>
        <h4 className="font-sans font-black text-xl text-[#181926] mb-2">
          Want to back teenage builders?
        </h4>
        <p className="text-xs sm:text-sm text-[#3a3d52] font-medium leading-relaxed mb-3">
          Fortune is run under <strong>Hack Club</strong>, a 501(c)(3) non-profit organization. Every dollar sponsored goes directly to teen builders via <strong>Hack Club Bank (HCB)</strong> with 100% public financial records. If you represent an organization or company and want to sponsor seed micro-grants or hardware prizes, message us in <strong>#fortune</strong> on Slack or email <strong>team@hackclub.com</strong>!
        </p>
        <div className="font-doodle text-sm font-bold text-[#ec3750]">
          ★ 100% tax-deductible • 100% goes directly to teen founders.
        </div>
      </div>

    </section>
  );
}
