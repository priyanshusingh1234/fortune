"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Calculator, Sparkles, Check, Lock } from "lucide-react";

export interface LootItem {
  name: string;
  fullName: string;
  pts: number;
  image: string | null;
  tag: string;
  badge?: string;
}

export const LOOT_ITEMS: LootItem[] = [
  {
    name: "Stickers & Pass",
    fullName: "Holographic Sticker Pack & Verification Pass",
    pts: 500,
    image: null,
    tag: "Free Ship",
    badge: "Base Loot",
  },
  {
    name: "Founder Tee",
    fullName: "Fortune Founder Embroidered Heavyweight Tee",
    pts: 1500,
    image: "/rewards/founder-tee.webp",
    tag: "$100 Rev",
    badge: "Custom Swag",
  },
  {
    name: "Mech Keyboard",
    fullName: "Custom 75% Mechanical Keyboard w/ Rotary Knob",
    pts: 4500,
    image: "/rewards/custom-mech-keyboard.png",
    tag: "$400 Rev",
    badge: "Hardware",
  },
  {
    name: "AirPods Max",
    fullName: "Apple AirPods Max (High-Fidelity Audio)",
    pts: 8000,
    image: "/rewards/airpods-max.jpg",
    tag: "$750 Rev",
    badge: "Pro Audio",
  },
  {
    name: "Bambu A1 3D",
    fullName: "Bambu Lab A1 3D Printer (Precision CoreXY)",
    pts: 10000,
    image: "/rewards/bambu-a1-printer.png",
    tag: "$950+ Rev",
    badge: "Grand Prize",
  },
];

interface StartupCalculatorProps {
  compact?: boolean;
}

export default function StartupCalculator({ compact = false }: StartupCalculatorProps) {
  const [revenue, setRevenue] = useState(250);

  // Points math: 500 base points for completing the project + 10 points per dollar of revenue
  const points = 500 + revenue * 10;

  const handleSliderChange = (newVal: number) => {
    setRevenue(newVal);
    if (newVal >= 950) {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
    } else if (newVal >= 500 && newVal % 250 === 0) {
      confetti({ particleCount: 15, spread: 35, origin: { y: 0.8 } });
    }
  };

  return (
    <div className={`text-center ${compact ? "p-3 sm:p-4" : "p-6 sm:p-8"}`}>
      
      {/* Title & Tag */}
      <div className="mb-4">
        <span className="font-pixel text-xs bg-[#ffe066] px-2.5 py-1 rounded border-2 border-[#181926] shadow-[2px_2px_0px_#181926] inline-flex items-center gap-1.5 mb-1 font-bold">
          <Calculator className="w-3.5 h-3.5" />
          <span>calculator thingy</span>
        </span>
        <h3 className="font-sans font-black text-2xl sm:text-3xl text-[#181926]">
          Test Your Startup Earnings
        </h3>
        <p className="font-doodle text-xs sm:text-sm text-[#4a4e66] font-bold mt-1">
          every dollar of revenue converts into Fortune Points so you can buy cool loot!
        </p>
      </div>

      {/* Slider Controls */}
      <div className="max-w-md mx-auto space-y-3 mb-5 text-left">
        <div className="flex justify-between items-center font-pixel text-xs sm:text-sm">
          <span>Estimated Revenue:</span>
          <span className="text-lg sm:text-xl font-bold bg-[#ffe066] px-3 py-0.5 rounded border-2 border-[#181926] shadow-[2px_2px_0px_#181926]">
            ${revenue.toLocaleString()}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="1000"
          step="50"
          value={revenue}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
          className="w-full h-3 bg-[#e8e2d1] rounded-lg appearance-none cursor-pointer accent-[#181926]"
        />

        <div className="flex justify-between text-[11px] font-mono text-[#666a85]">
          <span>$0 (First commit)</span>
          <span>$500 (Customers!)</span>
          <span>$1,000+ (High growth)</span>
        </div>
      </div>

      {/* Shop Points Balance Box */}
      <div className="p-3 rounded-xl bg-white border-2 border-[#181926] shadow-[2px_2px_0px_#181926] max-w-xs mx-auto mb-5">
        <div className="font-pixel text-[11px] text-[#ec3750] font-bold">YOUR SHOP POINTS</div>
        <div className="font-pixel text-2xl sm:text-3xl text-[#181926] my-0.5">
          {points.toLocaleString()} PTS
        </div>
        <div className="font-doodle text-xs text-[#10b981] font-bold">
          {revenue > 0 ? `500 base + ${(revenue * 10).toLocaleString()} pts from sales!` : "500 base completion pts"}
        </div>
      </div>

      {/* Shop Loot Grid with Photos */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center text-xs">
        {LOOT_ITEMS.map((item) => {
          const isUnlocked = points >= item.pts;
          const ptsNeeded = item.pts - points;

          return (
            <div
              key={item.name}
              className={`p-2 rounded-xl border-2 transition-all flex flex-col justify-between ${
                isUnlocked
                  ? "bg-[#d4edda] border-[#10b981] shadow-[2px_2px_0px_#10b981] scale-[1.02]"
                  : "bg-gray-50 border-[#181926]/30 opacity-70"
              }`}
            >
              {/* Photo Box */}
              <div>
                <div className="h-16 sm:h-20 w-full bg-white rounded-lg border border-[#181926]/15 p-1 flex items-center justify-center overflow-hidden mb-1.5 shadow-inner">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.fullName}
                      className="max-h-full max-w-full object-contain hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-[#ec3750]">
                      <Sparkles className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <div className="font-pixel font-bold text-[11px] text-[#181926] leading-tight truncate" title={item.fullName}>
                  {item.name}
                </div>
                <div className="font-mono text-[10px] text-[#4a4e66] mt-0.5">
                  {item.pts.toLocaleString()} pts
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-1.5 pt-1 border-t border-[#181926]/10">
                {isUnlocked ? (
                  <span className="text-[9px] font-pixel text-[#15803d] font-bold bg-white/90 px-1.5 py-0.5 rounded border border-[#10b981]/50 flex items-center justify-center gap-1">
                    <Check className="w-2.5 h-2.5" />
                    <span>UNLOCKED</span>
                  </span>
                ) : (
                  <span className="text-[9px] font-pixel text-gray-600 bg-white/70 px-1 py-0.5 rounded flex items-center justify-center gap-1" title={`Need $${Math.ceil(ptsNeeded / 10)} more rev`}>
                    <Lock className="w-2.5 h-2.5 text-gray-400" />
                    <span>{item.tag}</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
