"use client";

import React from "react";

// the footer where we link all the hack club stuff so lawyers are happy
export default function FortuneFooter() {
  return (
    <footer className="py-14 px-6 max-w-5xl mx-auto border-t-2 border-[#181926]/15 text-[#3a3d52] text-sm">
      
      {/* 4 simple cols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10 text-left">
        
        {/* col 1: brand */}
        <div>
          <div className="flex items-center gap-2 font-pixel text-base text-[#181926] font-bold">
            <span>🥠</span>
            <span>Fortune YSWS</span>
          </div>
          <p className="font-doodle text-base font-semibold text-[#4a4e66] leading-relaxed mt-1">
            built by teenagers in Hack Club. code software, get seed money, build a startup.
          </p>
          <div className="mt-2 text-xs font-pixel space-y-1">
            <div>
              <span className="text-[#ec3750] font-bold">Lead Dev:</span> Priyanshu Singh
            </div>
            <div>
              <span className="text-[#b45309] font-bold">Organizer:</span> @Noben_Nobi
            </div>
            <div>
              <span className="text-[#15803d] font-bold">Co-Organizer:</span> @itsnotketan
            </div>
          </div>
          <div className="font-pixel text-[11px] text-[#ec3750] font-bold pt-2">
            Part of Hack Club 501(c)(3)
          </div>
        </div>

        {/* col 2: official hack club links */}
        <div>
          <div className="font-pixel text-xs text-[#181926] font-bold uppercase tracking-wider mb-2">
            Hack Club Links
          </div>
          <ul className="space-y-1 text-xs font-pixel">
            <li>
              <a href="https://hackclub.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#ec3750] hover:underline">
                hackclub.com
              </a>
            </li>
            <li>
              <a href="https://hcb.hackclub.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#ec3750] hover:underline">
                Hack Club Bank (HCB)
              </a>
            </li>
            <li>
              <a href="https://hackatime.hackclub.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#ec3750] hover:underline">
                Hackatime Tracker
              </a>
            </li>
            <li>
              <a href="https://scrapbook.hackclub.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#ec3750] hover:underline">
                Scrapbook Feed
              </a>
            </li>
            <li>
              <a href="https://hackclub.com/conduct" target="_blank" rel="noopener noreferrer" className="hover:text-[#ec3750] hover:underline">
                Code of Conduct
              </a>
            </li>
          </ul>
        </div>

        {/* col 3: fortune channels */}
        <div>
          <div className="font-pixel text-xs text-[#181926] font-bold uppercase tracking-wider mb-2">
            Fortune Channels
          </div>
          <ul className="space-y-1 text-xs font-pixel">
            <li>
              <a href="https://hackclub.slack.com/messages/fortune" target="_blank" rel="noopener noreferrer" className="hover:text-[#ec3750] hover:underline text-[#1e5aa0]">
                #fortune (Slack)
              </a>
            </li>
            <li>
              <a href="https://hackclub.slack.com/messages/fortune-help" target="_blank" rel="noopener noreferrer" className="hover:text-[#ec3750] hover:underline text-[#1e5aa0]">
                #fortune-help (Slack)
              </a>
            </li>
            <li>
              <a href="https://rsvp.hackclub.community/fortune-ysws" target="_blank" rel="noopener noreferrer" className="hover:text-[#ec3750] hover:underline text-[#ec3750]">
                RSVP Registration
              </a>
            </li>
            <li>
              <a href="https://hackclub.com/slack" target="_blank" rel="noopener noreferrer" className="hover:text-[#ec3750] hover:underline">
                Join Hack Club Slack
              </a>
            </li>
          </ul>
        </div>

        {/* col 4: shoutouts */}
        <div>
          <div className="font-pixel text-xs text-[#181926] font-bold uppercase tracking-wider mb-2">
            Cool YSWSs
          </div>
          <p className="font-doodle text-xs text-[#4a4e66] leading-relaxed">
            Snek, Stardance, Macondo, Horizon, Pixl, Forge, Crescent, Atlantis, Sprig, Boba Drops.
          </p>
          <div className="font-pixel text-[10px] text-gray-600 pt-1">
            "You Ship, We Ship"
          </div>
        </div>

      </div>

      {/* bottom bar */}
      <div className="pt-6 border-t border-[#181926]/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs font-pixel text-[#666a85]">
        <div>
          Fortune YSWS • 100% Free for high schoolers • Hack Club 501(c)(3)
        </div>
        <div>
          <a href="https://github.com/hackclub" target="_blank" rel="noopener noreferrer" className="hover:text-[#181926] underline">
            github.com/hackclub
          </a>
        </div>
      </div>

    </footer>
  );
}
