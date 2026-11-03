import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userQuery = searchParams.get("user")?.toLowerCase().trim();
    const slackIdQuery = searchParams.get("slackId")?.toLowerCase().trim();
    const emailQuery = searchParams.get("email")?.toLowerCase().trim();

    // 1. Fetch real submissions from Supabase
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
      } else if (error) {
        console.warn("Supabase fetch notice:", error.message);
      }
    } catch (e) {
      console.warn("Supabase query notice:", e);
    }

    // 2. Fetch real submissions from local data/submissions.json (fallback)
    let localSubmissions: any[] = [];
    try {
      const dataFilePath = path.join(process.cwd(), "data", "submissions.json");
      if (fs.existsSync(dataFilePath)) {
        const raw = fs.readFileSync(dataFilePath, "utf8");
        localSubmissions = JSON.parse(raw || "[]");
      }
    } catch (e) {
      console.warn("Local storage query notice:", e);
    }

    // Merge and deduplicate
    const seenIds = new Set<string>();
    const allReal: any[] = [];

    for (const sub of [...supabaseSubmissions, ...localSubmissions]) {
      const title = (sub.title || "").trim();
      if (!title || title.toLowerCase() === "test project" || !sub.user_name) {
        continue;
      }
      const key = sub.id || `${sub.title}_${sub.user_name}`;
      if (!seenIds.has(key)) {
        seenIds.add(key);
        allReal.push({
          ...sub,
          screenshots: Array.isArray(sub.screenshots)
            ? sub.screenshots
            : typeof sub.screenshots === "string"
            ? JSON.parse(sub.screenshots || "[]")
            : [],
          status: sub.status || "pending_review",
          admin_notes: sub.admin_notes || "",
          reviewed_by: sub.reviewed_by || "",
        });
      }
    }

    // Filter by user if requested
    const filtered = allReal.filter((s) => {
      if (!userQuery && !slackIdQuery && !emailQuery) return true;

      const name = (s.user_name || "").toLowerCase();
      const slackId = (s.user_slack_id || "").toLowerCase();
      const email = (s.user_email || "").toLowerCase();

      if (slackIdQuery && slackId && slackId === slackIdQuery) return true;
      if (emailQuery && email && email === emailQuery) return true;
      if (userQuery) {
        if (name === userQuery || name.includes(userQuery) || userQuery.includes(name)) return true;
        if (slackId === userQuery) return true;
        if (email.split("@")[0] === userQuery) return true;
      }

      return false;
    });

    return NextResponse.json({ submissions: filtered });
  } catch (err: any) {
    console.error("Submissions GET error:", err);
    return NextResponse.json({ error: "Failed to fetch submissions." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      hackatimeProject,
      verifiedHours,
      useOfAi,
      aiExplanation,
      repoUrl,
      demoUrl,
      screenshots,
      user,
    } = body;

    // Validation
    if (!title?.trim() || !hackatimeProject?.trim() || !repoUrl?.trim() || !demoUrl?.trim()) {
      return NextResponse.json(
        { error: "Missing required fields (Project Title, Hackatime Project, GitHub Repo, or Demo URL)." },
        { status: 400 }
      );
    }

    // Ensure screenshots is an array of at most 5 URLs
    let screenshotList: string[] = [];
    if (Array.isArray(screenshots)) {
      screenshotList = screenshots.filter((s) => typeof s === "string" && s.trim().length > 0).slice(0, 5);
    } else if (typeof screenshots === "string" && screenshots.trim().length > 0) {
      screenshotList = screenshots
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 5);
    }

    // Generate valid UUID for fallback
    const fallbackUuid = crypto.randomUUID();

    const insertPayload = {
      title: title.trim(),
      description: description?.trim() || "",
      hackatime_project: hackatimeProject.trim(),
      verified_hours: Number(verifiedHours) || 0,
      use_of_ai: useOfAi || "minimal",
      ai_explanation: aiExplanation?.trim() || "None",
      repo_url: repoUrl.trim(),
      demo_url: demoUrl.trim(),
      screenshots: screenshotList,
      user_name: user?.name || "Anonymous Founder",
      user_email: user?.email || "",
      user_slack_id: user?.slack_id || "",
      status: "pending_review",
      admin_notes: "",
      reviewed_by: "",
    };

    console.log("📦 New Fortune Ship Payload Received:", insertPayload);

    // 1. Save to Supabase (primary database)
    let savedRow: any = null;
    let supabaseSaved = false;

    try {
      const dbPayload: any = {
        title: insertPayload.title,
        description: insertPayload.description,
        hackatime_project: insertPayload.hackatime_project,
        verified_hours: insertPayload.verified_hours,
        use_of_ai: insertPayload.use_of_ai,
        ai_explanation: insertPayload.ai_explanation,
        repo_url: insertPayload.repo_url,
        demo_url: insertPayload.demo_url,
        screenshots: JSON.stringify(screenshotList),
        user_name: insertPayload.user_name,
        user_email: insertPayload.user_email,
        user_slack_id: insertPayload.user_slack_id,
        status: insertPayload.status,
      };

      const { data, error } = await supabase
        .from("fortune_submissions")
        .insert([dbPayload])
        .select();

      if (!error && data && data.length > 0) {
        savedRow = data[0];
        supabaseSaved = true;
        console.log("Successfully saved submission to Supabase 'fortune_submissions' table, ID:", savedRow.id);
      } else if (error) {
        console.error("Supabase insert error:", error.message);
      }
    } catch (dbErr) {
      console.warn("Supabase connection exception:", dbErr);
    }

    const finalSubmission = savedRow
      ? {
          ...savedRow,
          screenshots: screenshotList,
        }
      : {
          id: fallbackUuid,
          ...insertPayload,
          created_at: new Date().toISOString(),
        };

    // 2. Persist locally to data/submissions.json (backup)
    try {
      const dataDir = path.join(process.cwd(), "data");
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const dataFilePath = path.join(dataDir, "submissions.json");
      let allSubmissions: any[] = [];
      if (fs.existsSync(dataFilePath)) {
        const fileContent = fs.readFileSync(dataFilePath, "utf8");
        allSubmissions = JSON.parse(fileContent || "[]");
      }
      allSubmissions.push(finalSubmission);
      fs.writeFileSync(dataFilePath, JSON.stringify(allSubmissions, null, 2));
    } catch (fileErr) {
      console.warn("Local JSON storage notice:", fileErr);
    }

    // 3. Post to Slack Webhook (optional notification for @Noben_Nobi & organizers)
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL || process.env.FORTUNE_SLACK_WEBHOOK;
    if (slackWebhookUrl) {
      try {
        const screenshotLinks = screenshotList.map((url, i) => `<${url}|Image ${i + 1}>`).join(" • ");
        await fetch(slackWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `🚀 *New Fortune Project Shipped!*\n*Title:* ${finalSubmission.title}\n*Founder:* @${finalSubmission.user_name} (${finalSubmission.user_slack_id || "Slack"})\n*Hackatime Project:* \`${finalSubmission.hackatime_project}\` (${finalSubmission.verified_hours} hrs)\n*GitHub:* <${finalSubmission.repo_url}|${finalSubmission.repo_url}>\n*Demo:* <${finalSubmission.demo_url}|${finalSubmission.demo_url}>\n*AI Usage:* ${finalSubmission.use_of_ai} (${finalSubmission.ai_explanation})\n*Screenshots (${screenshotList.length}):* ${screenshotLinks || "None"}\n_cc @Noben_Nobi @itsnotketan_`,
          }),
        });
      } catch (slackErr) {
        console.error("Slack notification warning:", slackErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Project shipped successfully to organizers!",
      submission: finalSubmission,
      savedInSupabase: supabaseSaved,
    });
  } catch (err: any) {
    console.error("Ship API error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process ship submission." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing submission ID" }, { status: 400 });
    }

    let screenshotsToDelete: string[] = [];
    let existingStatus: string | null = null;

    // 1. Fetch submission record to get status and screenshot list
    try {
      const { data } = await supabase
        .from("fortune_submissions")
        .select("screenshots, status")
        .eq("id", id)
        .single();

      if (data) {
        existingStatus = data.status;
        if (data.screenshots) {
          screenshotsToDelete = Array.isArray(data.screenshots)
            ? data.screenshots
            : typeof data.screenshots === "string"
            ? JSON.parse(data.screenshots || "[]")
            : [];
        }
      }
    } catch (e) {
      console.warn("Supabase fetch for delete notice:", e);
    }

    // Check local fallback as well
    try {
      const dataFilePath = path.join(process.cwd(), "data", "submissions.json");
      if (fs.existsSync(dataFilePath)) {
        const raw = fs.readFileSync(dataFilePath, "utf8");
        const list = JSON.parse(raw || "[]");
        const found = list.find((item: any) => item.id === id);
        if (found) {
          if (!existingStatus) existingStatus = found.status;
          if (found?.screenshots && screenshotsToDelete.length === 0) {
            screenshotsToDelete = Array.isArray(found.screenshots)
              ? found.screenshots
              : typeof found.screenshots === "string"
              ? JSON.parse(found.screenshots || "[]")
              : [];
          }
        }
      }
    } catch (e) {
      console.warn("Local storage fetch for delete notice:", e);
    }

    // RULE: Approved submissions cannot be deleted
    if (existingStatus === "approved") {
      return NextResponse.json(
        { error: "Approved projects cannot be deleted as their $100 seed grant has already been disbursed/authorized." },
        { status: 403 }
      );
    }

    // 2. Delete all attached images from Supabase Storage and local disk
    for (const url of screenshotsToDelete) {
      if (typeof url !== "string") continue;

      // Supabase Storage file
      if (url.includes("/fortune-screenshots/")) {
        const fileName = url.split("/fortune-screenshots/").pop();
        if (fileName) {
          try {
            await supabase.storage.from("fortune-screenshots").remove([fileName]);
            console.log("Deleted image from Supabase storage:", fileName);
          } catch (delErr) {
            console.warn("Supabase storage delete notice:", delErr);
          }
        }
      }

      // Local storage file (/uploads/...)
      if (url.startsWith("/uploads/")) {
        const fileName = url.replace("/uploads/", "");
        const localPath = path.join(process.cwd(), "public", "uploads", fileName);
        if (fs.existsSync(localPath)) {
          try {
            fs.unlinkSync(localPath);
            console.log("Deleted local upload file:", localPath);
          } catch (delErr) {
            console.warn("Local file delete notice:", delErr);
          }
        }
      }
    }

    // 3. Delete from Supabase database
    try {
      await supabase.from("fortune_submissions").delete().eq("id", id);
      console.log("Deleted submission row from Supabase:", id);
    } catch (dbErr) {
      console.warn("Supabase database delete notice:", dbErr);
    }

    // 4. Delete from local data/submissions.json
    try {
      const dataFilePath = path.join(process.cwd(), "data", "submissions.json");
      if (fs.existsSync(dataFilePath)) {
        const raw = fs.readFileSync(dataFilePath, "utf8");
        const list = JSON.parse(raw || "[]");
        const updated = list.filter((item: any) => item.id !== id);
        fs.writeFileSync(dataFilePath, JSON.stringify(updated, null, 2));
      }
    } catch (fileErr) {
      console.warn("Local storage delete notice:", fileErr);
    }

    return NextResponse.json({
      success: true,
      message: "Submission and all associated images deleted successfully.",
      deletedId: id,
    });
  } catch (err: any) {
    console.error("Submissions DELETE error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete submission." },
      { status: 500 }
    );
  }
}
