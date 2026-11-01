"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import confetti from "canvas-confetti";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  // Form states matching Noben_Nobi's exact requirements
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    useOfAi: "minimal", // "none" | "minimal" | "heavy"
    aiExplanation: "",
    repoUrl: "",
    demoUrl: "",
    screenshots: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ec3750", "#ffe066", "#10b981", "#181926"],
    });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#f7f1e1] flex items-center justify-center font-pixel text-lg text-[#181926]">
        Loading dashboard... ⏳
      </div>
    );
  }

  // Not signed in
  if (!session || !session.user) {
    return (
      <div className="min-h-screen bg-[#f7f1e1] flex flex-col items-center justify-center p-6 text-center">
        <div className="wobbly-card bg-white p-8 max-w-md space-y-4 border-2 border-[#181926] shadow-[4px_4px_0px_#181926]">
          <span className="text-5xl inline-block">🥠</span>
          <h1 className="text-3xl font-black font-sans text-[#181926]">
            Sign in to Ship Your Project
          </h1>
          <p className="font-doodle text-lg text-[#4a4e66]">
            Connect with your Hack Club Slack to submit your project and get verified by the organizers.
          </p>
          <div className="pt-2">
            <button
              onClick={() => signIn("hackclub")}
              className="fortune-btn fortune-btn-gold w-full text-base"
            >
              🚀 Sign in with Hack Club
            </button>
          </div>
          <div>
            <Link href="/" className="font-pixel text-xs text-[#ec3750] hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f1e1] text-[#181926] pt-24 pb-16 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Simple top user header */}
        <div className="wobbly-card bg-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-12 h-12 rounded-full border-2 border-[#181926] object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#ec3750] text-white flex items-center justify-center font-pixel text-base border-2 border-[#181926]">
                HC
              </div>
            )}
            <div>
              <h1 className="text-2xl font-black font-sans text-[#181926]">
                Dashboard
              </h1>
              <div className="font-pixel text-xs text-gray-500">
                Signed in as <strong>@{session.user.name}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 font-pixel text-xs">
            <Link
              href="/"
              className="bg-[#f7f1e1] px-3 py-1.5 rounded border border-[#181926] hover:bg-white"
            >
              🏠 Home
            </Link>
            <button
              onClick={() => signOut()}
              className="text-[#ec3750] hover:underline"
            >
              [Sign out]
            </button>
          </div>
        </div>

        {/* Main Clean Submission Form */}
        <div className="wobbly-card bg-white p-6 sm:p-8 space-y-6">
          <div className="border-b-2 border-dashed border-[#181926]/15 pb-4">
            <h2 className="text-2xl font-black font-sans text-[#181926] flex items-center gap-2">
              <span>📦</span> Ship Your Fortune Project
            </h2>
            <p className="font-doodle text-base text-[#4a4e66] mt-1">
              Fill out the details below. Our team (@Noben_Nobi &amp; organizers) will review your submission!
            </p>
          </div>

          {submitted ? (
            <div className="bg-[#e6f4ea] border-2 border-[#137333] p-6 rounded-lg text-center space-y-3">
              <span className="text-4xl">🎉</span>
              <h3 className="text-2xl font-bold font-sans text-[#137333]">
                Project Submitted Successfully!
              </h3>
              <p className="font-doodle text-lg text-[#274e13]">
                Your ship submission for <strong>"{formData.title}"</strong> is now in review. We&apos;ll ping you on Slack in <code className="bg-white px-2 py-0.5 rounded border border-[#137333]">#fortune</code>!
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setSubmitted(false)}
                  className="font-pixel text-xs bg-white text-[#137333] px-4 py-2 rounded border border-[#137333] hover:bg-[#e6f4ea]"
                >
                  ✏️ Edit Submission
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 font-sans">
              
              {/* 1. Project Title */}
              <div>
                <label className="block font-pixel text-xs font-bold text-[#181926] mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CookieClicker SaaS"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 bg-[#faf9f5] border-2 border-[#181926] rounded-md text-sm outline-none focus:bg-white"
                />
              </div>

              {/* 2. Description */}
              <div>
                <label className="block font-pixel text-xs font-bold text-[#181926] mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain what your software does, who uses it, and how it makes money..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 bg-[#faf9f5] border-2 border-[#181926] rounded-md text-sm outline-none focus:bg-white"
                />
              </div>

              {/* 3. GitHub Repository */}
              <div>
                <label className="block font-pixel text-xs font-bold text-[#181926] mb-1">
                  GitHub Repository URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/your-username/your-repo"
                  value={formData.repoUrl}
                  onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                  className="w-full p-3 bg-[#faf9f5] border-2 border-[#181926] rounded-md text-sm font-mono outline-none focus:bg-white"
                />
              </div>

              {/* 4. Demo URL */}
              <div>
                <label className="block font-pixel text-xs font-bold text-[#181926] mb-1">
                  Live Demo URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://my-startup.vercel.app"
                  value={formData.demoUrl}
                  onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                  className="w-full p-3 bg-[#faf9f5] border-2 border-[#181926] rounded-md text-sm font-mono outline-none focus:bg-white"
                />
              </div>

              {/* 5. Screenshots while working */}
              <div>
                <label className="block font-pixel text-xs font-bold text-[#181926] mb-1">
                  Screenshots of it while working *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Paste image links (Imgur, Slack file link, or Scrapbook URL)"
                  value={formData.screenshots}
                  onChange={(e) => setFormData({ ...formData, screenshots: e.target.value })}
                  className="w-full p-3 bg-[#faf9f5] border-2 border-[#181926] rounded-md text-sm outline-none focus:bg-white"
                />
                <span className="font-doodle text-xs text-gray-500 mt-1 block">
                  Tip: Upload to Hack Club Scrapbook, Imgur, or drop it in #fortune and paste the link!
                </span>
              </div>

              {/* 6. Use of AI */}
              <div className="bg-[#faf9f5] p-4 rounded-md border-2 border-[#181926]/40 space-y-2">
                <label className="block font-pixel text-xs font-bold text-[#181926]">
                  Use of AI (Honest disclosure) *
                </label>
                
                <div className="flex flex-wrap gap-4 font-pixel text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="aiUsage"
                      value="none"
                      checked={formData.useOfAi === "none"}
                      onChange={() => setFormData({ ...formData, useOfAi: "none" })}
                      className="accent-[#ec3750]"
                    />
                    <span>No AI (100% hand-coded)</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="aiUsage"
                      value="minimal"
                      checked={formData.useOfAi === "minimal"}
                      onChange={() => setFormData({ ...formData, useOfAi: "minimal" })}
                      className="accent-[#ec3750]"
                    />
                    <span>Minor (debugging / copilot)</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="aiUsage"
                      value="heavy"
                      checked={formData.useOfAi === "heavy"}
                      onChange={() => setFormData({ ...formData, useOfAi: "heavy" })}
                      className="accent-[#ec3750]"
                    />
                    <span>Heavy (AI generated components)</span>
                  </label>
                </div>

                <input
                  type="text"
                  placeholder="Quick explanation: how did you use AI, if at all?"
                  value={formData.aiExplanation}
                  onChange={(e) => setFormData({ ...formData, aiExplanation: e.target.value })}
                  className="w-full p-2.5 bg-white border border-[#181926]/30 rounded text-xs outline-none mt-2"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="fortune-btn fortune-btn-gold w-full text-base py-3.5"
                >
                  🚀 Ship Project to Review
                </button>
              </div>

            </form>
          )}

        </div>

      </div>

    </div>
  );
}
