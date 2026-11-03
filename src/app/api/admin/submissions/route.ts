import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isUserAdmin } from "@/lib/admin";
import { supabase } from "@/lib/supabase";
import fs from "fs";
import path from "path";

const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY || "fortune_admin_2026";

async function verifyAdminAuth(request: Request) {
  // 1. Session Auth (Tracked by Auth)
  try {
    const session = await getServerSession(authOptions);
    if (session?.user && isUserAdmin(session.user)) {
      const slackId = ((session.user as any).slack_id || (session.user as any).id || "U0BTDMCJ6P7").toString().trim();
      return {
        authorized: true,
        user: session.user,
        slackId,
        reviewerTag: `${session.user.name || "Admin"} (${slackId})`,
      };
    }
  } catch (e) {
    console.warn("Session check notice:", e);
  }

  // 2. Passkey Header / Query Param (Fallback)
  const headerKey = request.headers.get("x-admin-passkey");
  const { searchParams } = new URL(request.url);
  const queryKey = searchParams.get("passkey");

  if (headerKey === ADMIN_PASSKEY || queryKey === ADMIN_PASSKEY) {
    return {
      authorized: true,
      user: null,
      slackId: "U0BTDMCJ6P7",
      reviewerTag: "Admin (Passkey U0BTDMCJ6P7)",
    };
  }

  return { authorized: false, user: null, slackId: null, reviewerTag: null };
}

export async function GET(request: Request) {
  try {
    const auth = await verifyAdminAuth(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: "Access Denied: Only authorized admin (Slack ID U0BTDMCJ6P7) can view submissions.", submissions: [] },
        { status: 403 }
      );
    }

    // Try reading from Supabase
    let supabaseSubmissions: any[] = [];
    try {
      const { data, error } = await supabase
        .from("fortune_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data)) {
        supabaseSubmissions = data.map((item: any) => ({
          ...item,
          screenshots: typeof item.screenshots === "string" ? JSON.parse(item.screenshots || "[]") : (item.screenshots || []),
        }));
      }
    } catch (e) {
      console.warn("Supabase fetch notice:", e);
    }

    // Also read from local JSON fallback
    let localSubmissions: any[] = [];
    try {
      const filePath = path.join(process.cwd(), "data", "submissions.json");
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, "utf8");
        localSubmissions = JSON.parse(raw || "[]");
      }
    } catch (e) {
      console.warn("Local storage fetch notice:", e);
    }

    // Merge submissions, avoiding duplicates
    const seenIds = new Set<string>();
    const merged: any[] = [];

    for (const sub of [...supabaseSubmissions, ...localSubmissions]) {
      const key = sub.id || `${sub.title}_${sub.user_name}`;
      if (!seenIds.has(key)) {
        seenIds.add(key);
        merged.push({
          ...sub,
          screenshots: Array.isArray(sub.screenshots) ? sub.screenshots : (typeof sub.screenshots === "string" ? JSON.parse(sub.screenshots || "[]") : []),
          admin_notes: sub.admin_notes || "",
          reviewed_by: sub.reviewed_by || "",
          status: sub.status || "pending_review",
        });
      }
    }

    // Filter to ensure only real founder submissions appear (excluding null / test artifacts)
    const realSubmissions = merged.filter((sub) => {
      const title = (sub.title || "").trim();
      if (!title || title.toLowerCase() === "test project") return false;
      if (!sub.user_name || sub.user_name === "null") return false;
      return true;
    });

    return NextResponse.json({
      submissions: realSubmissions,
      authorized: true,
      reviewerTag: auth.reviewerTag,
    });
  } catch (err: any) {
    console.error("Admin submissions fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch submissions." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await verifyAdminAuth(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: "Access Denied: Only authorized admin (Slack ID U0BTDMCJ6P7) can update submissions." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, status, adminNote } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing submission ID" }, { status: 400 });
    }

    const reviewer = auth.reviewerTag || body.reviewer || "Noben_Nobi (U0BTDMCJ6P7)";

    // 1. Update in Supabase
    try {
      const updatePayload: any = {};
      if (status) updatePayload.status = status;
      if (reviewer) updatePayload.reviewed_by = reviewer;
      if (typeof adminNote === "string") updatePayload.admin_notes = adminNote;

      await supabase
        .from("fortune_submissions")
        .update(updatePayload)
        .eq("id", id);
    } catch (supaErr) {
      console.warn("Supabase update notice:", supaErr);
    }

    // 2. Update in local data/submissions.json
    try {
      const filePath = path.join(process.cwd(), "data", "submissions.json");
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, "utf8");
        const list = JSON.parse(raw || "[]");
        const updated = list.map((item: any) => {
          if (item.id === id) {
            return {
              ...item,
              status: status || item.status,
              reviewed_by: reviewer || item.reviewed_by,
              admin_notes: typeof adminNote === "string" ? adminNote : item.admin_notes,
              updated_at: new Date().toISOString(),
            };
          }
          return item;
        });
        fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
      }
    } catch (fileErr) {
      console.warn("Local storage update notice:", fileErr);
    }

    return NextResponse.json({
      success: true,
      message: "Submission updated successfully",
      updated: { id, status, adminNote, reviewer },
    });
  } catch (err: any) {
    console.error("Admin submission update error:", err);
    return NextResponse.json(
      { error: "Failed to update submission" },
      { status: 500 }
    );
  }
}
