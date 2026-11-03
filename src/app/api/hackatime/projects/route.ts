import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Common non-project folder names logged by editor plugins to exclude
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

/**
 * Fetch stats from Hackatime for a given user identifier (Slack ID, numeric ID, or username)
 */
async function fetchHackatimeStats(identifier: string) {
  try {
    const statsUrl = `https://hackatime.hackclub.com/api/v1/users/${encodeURIComponent(identifier)}/stats?features=projects`;
    const res = await fetch(statsUrl, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data?.data || null;
  } catch (err) {
    return null;
  }
}

/**
 * Find user's numeric ID on Hackatime via leaderboard search using their username or Slack handle
 */
async function findUserIdOnHackatime(searchKey: string): Promise<string | number | null> {
  const clean = searchKey.trim().toLowerCase();
  if (!clean) return null;

  try {
    const lbRes = await fetch("https://hackatime.hackclub.com/api/v1/leaderboard", {
      headers: { Accept: "application/json" },
      next: { revalidate: 180 },
    });

    if (lbRes.ok) {
      const data = await lbRes.json();
      const entries = data?.entries || [];
      const match = entries.find((e: any) => {
        const u = (e?.user?.username || "").toLowerCase();
        const n = (e?.user?.name || "").toLowerCase();
        return u === clean || n === clean || (clean.length >= 4 && (u.includes(clean) || clean.includes(u)));
      });

      if (match?.user?.id) {
        return match.user.id;
      }
    }
  } catch (err) {
    console.warn("Hackatime directory search notice:", err);
  }

  return null;
}

export async function GET(request: Request) {
  try {
    // 1. Get the authenticated user from the active NextAuth session
    const session = await getServerSession(authOptions);

    // 2. Read any manual lookup ID passed by the user (e.g. typing a custom ID/username in the UI)
    const { searchParams } = new URL(request.url);
    const manualLookup = searchParams.get("userId") || searchParams.get("target") || "";

    // 3. Extract the authenticated user's Slack ID and username
    const authSlackId = (session?.user as any)?.slack_id || (session?.user as any)?.id || searchParams.get("slackId") || "";
    const authUsername = session?.user?.name || searchParams.get("username") || "";

    // Candidate identifiers to try for THIS authenticated user in priority order:
    const candidates: string[] = [];

    if (manualLookup.trim()) {
      candidates.push(manualLookup.trim());
    }

    if (authSlackId) {
      candidates.push(authSlackId.toString().trim());
    }

    if (authUsername) {
      candidates.push(authUsername.toString().trim());
      // Also try with spaces stripped or replaced with underscores
      if (authUsername.includes(" ")) {
        candidates.push(authUsername.replace(/\s+/g, "").toLowerCase());
        candidates.push(authUsername.replace(/\s+/g, "_").toLowerCase());
      }
    }

    if (candidates.length === 0) {
      return NextResponse.json({
        totalProjects: 0,
        projects: [],
        message: "No authenticated user session found.",
      });
    }

    // Try fetching stats directly using the user's candidates
    let statsData: any = null;
    let resolvedIdentifier: string = "";

    for (const cand of candidates) {
      statsData = await fetchHackatimeStats(cand);
      if (statsData?.projects) {
        resolvedIdentifier = cand;
        break;
      }
    }

    // If direct fetch didn't return projects, attempt leaderboard directory resolution for this user's username
    if (!statsData?.projects && authUsername) {
      const matchedId = await findUserIdOnHackatime(authUsername);
      if (matchedId) {
        statsData = await fetchHackatimeStats(String(matchedId));
        if (statsData?.projects) {
          resolvedIdentifier = String(matchedId);
        }
      }
    }

    // If no projects found on Hackatime for this user, return clean empty list
    if (!statsData || !Array.isArray(statsData.projects)) {
      return NextResponse.json({
        hackatimeId: null,
        username: authUsername || "user",
        totalProjects: 0,
        projects: [],
        message: "No Hackatime projects tracked yet for your account. You can enter your project folder name manually.",
      });
    }

    // Format, filter, and sort projects for this user
    const rawProjects = statsData.projects || [];
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
      hackatimeId: resolvedIdentifier || null,
      username: statsData?.username || authUsername,
      totalProjects: projects.length,
      projects,
    });
  } catch (err: any) {
    console.error("Hackatime projects API error:", err);
    return NextResponse.json({
      totalProjects: 0,
      projects: [],
      error: "Failed to connect to Hackatime API.",
    });
  }
}
