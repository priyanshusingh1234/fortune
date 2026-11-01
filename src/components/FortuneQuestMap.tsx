"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";

export default function FortuneQuestMap() {
  const [revenue, setRevenue] = useState(250);

  // math that converts money to shop points
  const points = 500 + revenue * 10;

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
              👉 {st.funnyNote}
            </div>
          </div>
        ))}
      </div>

      {/* interactive calculator */}
      <div className="wobbly-card p-6 sm:p-8 bg-[#fffdf0] max-w-2xl mx-auto mb-16 text-center rotate-[0.5deg]">
        <div className="tape" />
        
        <span className="font-doodle text-xl text-[#ec3750] font-bold block">
          calculator thingy 🧮
        </span>
        <h3 className="font-sans font-black text-3xl text-[#181926] mb-2">
          Test Your Startup Earnings
        </h3>
        <p className="font-doodle text-sm text-[#4a4e66] font-bold mb-6">
          every dollar of revenue converts into Fortune Points so you can buy cool loot!
        </p>

        {/* slider */}
        <div className="max-w-md mx-auto space-y-3 mb-6 text-left">
          <div className="flex justify-between items-center font-pixel text-sm">
            <span>Estimated Revenue:</span>
            <span className="text-xl font-bold bg-[#ffe066] px-3 py-1 rounded border-2 border-[#181926] shadow-[2px_2px_0px_#181926]">
              ${revenue}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="1000"
            step="50"
            value={revenue}
            onChange={(e) => {
              setRevenue(Number(e.target.value));
              if (Number(e.target.value) >= 500) {
                confetti({ particleCount: 15, spread: 35, origin: { y: 0.8 } });
              }
            }}
            className="w-full h-3 bg-[#e8e2d1] rounded-lg appearance-none cursor-pointer accent-[#181926]"
          />

          <div className="flex justify-between text-xs font-mono text-[#666a85]">
            <span>$0 (First commit)</span>
            <span>$500 (Customers!)</span>
            <span>$1,000+ (High growth)</span>
          </div>
        </div>

        {/* balance */}
        <div className="p-3 rounded-xl bg-white border-2 border-[#181926] shadow-[2px_2px_0px_#181926] max-w-xs mx-auto mb-6">
          <div className="font-pixel text-[11px] text-[#ec3750] font-bold">YOUR SHOP POINTS</div>
          <div className="font-pixel text-2xl text-[#181926] my-1">
            {points.toLocaleString()} PTS
          </div>
          <div className="font-doodle text-xs text-[#10b981] font-bold">
            {revenue > 0 ? `500 base + ${revenue * 10} pts from sales!` : "500 base completion pts"}
          </div>
        </div>

        {/* shop loot */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className={`p-2.5 rounded-lg border-2 border-[#181926] ${points >= 500 ? "bg-[#d4edda]" : "bg-gray-100 opacity-60"}`}>
            <span className="text-xl block">✨</span>
            <span className="font-pixel font-bold block">Stickers</span>
            <span className="font-mono text-[10px]">500 pts {points >= 500 ? "✓" : ""}</span>
          </div>
          <div className={`p-2.5 rounded-lg border-2 border-[#181926] ${points >= 1500 ? "bg-[#d4edda]" : "bg-gray-100 opacity-60"}`}>
            <span className="text-xl block">🔑</span>
            <span className="font-pixel font-bold block">YubiKey</span>
            <span className="font-mono text-[10px]">1,500 pts {points >= 1500 ? "✓" : ""}</span>
          </div>
          <div className={`p-2.5 rounded-lg border-2 border-[#181926] ${points >= 3000 ? "bg-[#d4edda]" : "bg-gray-100 opacity-60"}`}>
            <span className="text-xl block">🍓</span>
            <span className="font-pixel font-bold block">Raspberry Pi</span>
            <span className="font-mono text-[10px]">3,000 pts {points >= 3000 ? "✓" : ""}</span>
          </div>
          <div className={`p-2.5 rounded-lg border-2 border-[#181926] ${points >= 5000 ? "bg-[#d4edda]" : "bg-gray-100 opacity-60"}`}>
            <span className="text-xl block">⌨️</span>
            <span className="font-pixel font-bold block">Keyboard</span>
            <span className="font-mono text-[10px]">5,000 pts {points >= 5000 ? "✓" : ""}</span>
          </div>
        </div>

      </div>

      {/* note for sponsors */}
      <div className="wobbly-card p-6 bg-white max-w-2xl mx-auto rotate-[-0.3deg] text-left">
        <div className="font-pixel text-xs text-[#ec3750] font-bold mb-1">
          🏢 NOTE FOR SPONSORS & DONORS
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
