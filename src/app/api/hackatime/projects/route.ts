import { NextResponse } from "next/server";

// Common non-project folder names logged by editor plugins to exclude (similar to Stardance's EXCLUDED_NAMES)
const EXCLUDED_FOLDERS = new Set([
  ".history",
  "Other",
  "c:",
  "node",
  "__tests__",
  "src",
  "lib",
  "app",
  "ui",
  "components",
  "styles",
  "templates",
  "post",
  "posts",
  "routes",
  "user",
  "users",
  "chat",
  "feed",
  "comments",
  "messages",
  "backend",
  "frontend",
  "prisma",
  "config",
  "landing",
  "home",
  "notifications",
  "categories",
  "moderation",
  "follows",
  "schools",
  "scratch",
  "screenshots",
  "signup",
  "top-schools",
  "story",
  "apply",
  "challenge",
  "dashboard",
  "delete-account",
  "end",
  "explore",
  "export",
  "flows",
  "fs",
  "hashtag",
  "hooks",
  "illustrations",
  "images",
  "login",
  "marketplace",
  "middleware",
  "nav",
  "new",
  "new-story",
  "prototype",
  "Ps keyboard",
]);

// Known Hackatime user IDs for instant resolution
const KNOWN_HACKATIME_IDS: Record<string, number> = {
  kpk22128: 67074,
  priyanshu: 67074,
  "priyanshu singh": 67074,
  priyanshusingh1234: 67074,
};

async function resolveHackatimeUserId(identifier: string): Promise<number | null> {
  const clean = identifier.trim().toLowerCase();

  // 1. Direct numeric ID
  if (/^\d+$/.test(clean)) {
    return parseInt(clean, 10);
  }

  // 2. Known mapping or default
  if (clean === "default" || clean === "" || KNOWN_HACKATIME_IDS[clean]) {
    return KNOWN_HACKATIME_IDS[clean] || 67074;
  }

  // 3. Query Hackatime leaderboard to find user's numeric ID
  try {
    const lbRes = await fetch("https://hackatime.hackclub.com/api/v1/leaderboard", {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 }, // cache for 5 minutes
    });

    if (lbRes.ok) {
      const data = await lbRes.json();
      const entries = data?.entries || [];
      const match = entries.find((e: any) => {
        const u = e?.user?.username?.toLowerCase() || "";
        return u === clean || (clean.length >= 3 && u.includes(clean));
      });

      if (match?.user?.id) {
        return match.user.id;
      }
    }
  } catch (err) {
    console.error("Leaderboard lookup failed:", err);
  }

  // Fallback to 67074
  return 67074;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const identifier = searchParams.get("slackId") || searchParams.get("userId") || searchParams.get("username") || "default";

    const userId = await resolveHackatimeUserId(identifier) || 67074;

    // Fetch projects directly from Hackatime API
    const statsUrl = `https://hackatime.hackclub.com/api/v1/users/${userId}/stats?features=projects`;
    const res = await fetch(statsUrl, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Hackatime API responded with status ${res.status}`);
    }

    const data = await res.json();
    const rawProjects = data?.data?.projects || [];

    // Filter, format, and sort by tracked hours (highest first)
    const projects = rawProjects
      .filter((p: any) => {
        const name = p?.name?.trim();
        if (!name) return false;
        if (name.startsWith("[") && name.endsWith("]")) return false;
        if (EXCLUDED_FOLDERS.has(name)) return false;
        return true;
      })
      .map((p: any) => {
        const total_seconds = p.total_seconds || 0;
        const hours = Math.round((total_seconds / 3600) * 10) / 10;
        return {
          name: p.name,
          total_seconds,
          hours,
          text: p.text || `${hours} hrs`,
        };
      })
      .sort((a: any, b: any) => b.total_seconds - a.total_seconds);

    return NextResponse.json({
      hackatimeId: userId,
      username: data?.data?.username || "hackclubber",
      totalProjects: projects.length,
      projects,
    });
  } catch (err: any) {
    console.error("Hackatime projects error:", err);

    // Reliable fallback projects with real statistics
    return NextResponse.json({
      hackatimeId: 67074,
      username: "kpk22128",
      projects: [
        { name: "dheeyudhha", total_seconds: 447754, hours: 124.4, text: "124.4 hrs" },
        { name: "personal site", total_seconds: 13401, hours: 3.7, text: "3.7 hrs" },
        { name: "pages", total_seconds: 8160, hours: 2.3, text: "2.3 hrs" },
        { name: "newday-next", total_seconds: 7186, hours: 2.0, text: "2.0 hrs" },
        { name: "nasa-apod-site", total_seconds: 4976, hours: 1.4, text: "1.4 hrs" },
        { name: "faulty site", total_seconds: 3913, hours: 1.1, text: "1.1 hrs" },
        { name: "donypolo", total_seconds: 3760, hours: 1.0, text: "1.0 hrs" },
        { name: "SkillSwap", total_seconds: 3580, hours: 1.0, text: "1.0 hrs" },
        { name: "StudentOS", total_seconds: 3254, hours: 0.9, text: "0.9 hrs" },
        { name: "web os", total_seconds: 3253, hours: 0.9, text: "0.9 hrs" },
        { name: "collab", total_seconds: 2674, hours: 0.7, text: "0.7 hrs" },
        { name: "blare", total_seconds: 2575, hours: 0.7, text: "0.7 hrs" },
        { name: "noflop", total_seconds: 2370, hours: 0.7, text: "0.7 hrs" },
        { name: "rk-english-experts", total_seconds: 1703, hours: 0.5, text: "0.5 hrs" },
      ],
      isFallback: true,
    });
  }
}
