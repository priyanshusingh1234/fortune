"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { isUserAdmin, ADMIN_SLACK_IDS } from "@/lib/admin";
import {
  Shield,
  Lock,
  LogIn,
  AlertTriangle,
  RefreshCw,
  Package,
  Home,
  GitBranch,
  Globe,
  Check,
  MessageSquare,
  X,
  Clock,
  Trash2,
  Edit3,
  Save,
  Search,
  Inbox,
} from "lucide-react";

interface Submission {
  id: string;
  title: string;
  description: string;
  hackatime_project: string;
  verified_hours: number;
  use_of_ai: string;
  ai_explanation: string;
  repo_url: string;
  demo_url: string;
  screenshots: string[];
  user_name: string;
  user_email: string;
  user_slack_id: string;
  status: "pending_review" | "approved" | "changes_requested" | "rejected";
  admin_notes?: string;
  reviewed_by?: string;
  created_at: string;
}

const REJECTION_PRESETS = [
  {
    label: "Under 10 Hours",
    text: "Submission has less than the minimum required 10 tracked coding hours on Hackatime.",
  },
  {
    label: "Pure AI Generated",
    text: "Codebase appears heavily AI-generated without sufficient authentic hand-written engineering or learning.",
  },
  {
    label: "Broken Demo URL",
    text: "The submitted live demo is not functional, requires login credentials, or is completely offline.",
  },
  {
    label: "Ineligible / Not Original",
    text: "Project does not meet Hack Club Fortune criteria for an original technical product built by the founder.",
  },
];

const CHANGES_PRESETS = [
  {
    label: "Log More Hours",
    text: "Please log at least 10+ total coding hours on Hackatime before this can be approved for the seed grant.",
  },
  {
    label: "Fix Demo Link",
    text: "Your demo URL is currently inaccessible or broken. Please test your deployment and update the link.",
  },
  {
    label: "Push Repo Commits",
    text: "Please ensure your full source code and commit history are pushed to your public GitHub repo.",
  },
  {
    label: "Add Proof Screenshots",
    text: "Please update your submission with clear screenshots showing the working project UI.",
  },
];

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [passkey, setPasskey] = useState("");
  const [passkeyError, setPasskeyError] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeImageModal, setActiveImageModal] = useState<string | null>(null);

  // Per-submission editing states for admin notes
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);

  // Custom Reason Screen Modal state (No browser alerts/prompts)
  const [reasonModal, setReasonModal] = useState<{
    isOpen: boolean;
    submission: Submission | null;
    targetStatus: "rejected" | "changes_requested";
    reasonText: string;
    isSubmitting: boolean;
    error?: string;
  }>({
    isOpen: false,
    submission: null,
    targetStatus: "rejected",
    reasonText: "",
    isSubmitting: false,
  });

  // Check if session user is automatically recognized as authorized admin (Slack ID: U0BTDMCJ6P7)
  const isAuthorizedAdmin = isUserAdmin(session?.user);
  const userSlackId = ((session?.user as any)?.slack_id || (session?.user as any)?.id || "U0BTDMCJ6P7").toString().trim();
  const reviewerTag = session?.user?.name
    ? `${session.user.name} (${userSlackId})`
    : `Admin (${userSlackId})`;

  useEffect(() => {
    const storedPass = typeof window !== "undefined" ? sessionStorage.getItem("fortune_admin_pass") : null;

    if (isAuthorizedAdmin) {
      setIsUnlocked(true);
    } else if (storedPass === "fortune_admin_2026") {
      setIsUnlocked(true);
      setPasskey(storedPass);
    }
  }, [session, isAuthorizedAdmin]);

  const loadSubmissions = () => {
    setLoading(true);
    const key = passkey || (typeof window !== "undefined" ? sessionStorage.getItem("fortune_admin_pass") || "" : "");
    fetch(`/api/admin/submissions?passkey=${encodeURIComponent(key)}`, {
      headers: { "x-admin-passkey": key },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.submissions && Array.isArray(data.submissions)) {
          setSubmissions(data.submissions);
          // Initialize editing notes map
          const notesMap: Record<string, string> = {};
          data.submissions.forEach((s: Submission) => {
            notesMap[s.id] = s.admin_notes || "";
          });
          setEditingNotes(notesMap);
        }
      })
      .catch((err) => {
        console.error("Failed to load submissions:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isUnlocked) {
      loadSubmissions();
    }
  }, [isUnlocked]);

  const handleUnlockWithPasskey = (e: React.FormEvent) => {
    e.preventDefault();
    setPasskeyError("");
    if (passkey.trim() === "fortune_admin_2026") {
      setIsUnlocked(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("fortune_admin_pass", passkey.trim());
      }
    } else {
      setPasskeyError("Invalid Admin Passkey. Hint: default passkey is 'fortune_admin_2026'");
    }
  };

  const openReasonModal = (submission: Submission, targetStatus: "rejected" | "changes_requested") => {
    const existing = editingNotes[submission.id] || "";
    const defaultText =
      existing ||
      (targetStatus === "rejected" ? REJECTION_PRESETS[0].text : CHANGES_PRESETS[0].text);

    setReasonModal({
      isOpen: true,
      submission,
      targetStatus,
      reasonText: defaultText,
      isSubmitting: false,
      error: undefined,
    });
  };

  const closeReasonModal = () => {
    if (reasonModal.isSubmitting) return;
    setReasonModal((prev) => ({ ...prev, isOpen: false, submission: null, error: undefined }));
  };

  const handleConfirmReasonDecision = async () => {
    if (!reasonModal.submission) return;
    const submissionId = reasonModal.submission.id;
    const targetStatus = reasonModal.targetStatus;
    const finalReason = reasonModal.reasonText.trim();

    if (!finalReason) {
      setReasonModal((prev) => ({
        ...prev,
        error: "Please enter a reason or pick a preset so the founder understands what to do next.",
      }));
      return;
    }

    setReasonModal((prev) => ({ ...prev, isSubmitting: true, error: undefined }));
    const reviewerName = reviewerTag;
    const activePass = passkey || (typeof window !== "undefined" ? sessionStorage.getItem("fortune_admin_pass") || "" : "");

    try {
      const res = await fetch("/api/admin/submissions", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(activePass ? { "x-admin-passkey": activePass } : {}),
        },
        body: JSON.stringify({
          id: submissionId,
          status: targetStatus,
          reviewer: reviewerName,
          adminNote: finalReason,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update submission status");
      }

      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === submissionId
            ? {
                ...sub,
                status: targetStatus,
                reviewed_by: reviewerName,
                admin_notes: finalReason,
              }
            : sub
        )
      );

      setEditingNotes((prev) => ({ ...prev, [submissionId]: finalReason }));
      setReasonModal({
        isOpen: false,
        submission: null,
        targetStatus: "rejected",
        reasonText: "",
        isSubmitting: false,
      });
    } catch (err: any) {
      console.error("Decision update error:", err);
      setReasonModal((prev) => ({
        ...prev,
        isSubmitting: false,
        error: err.message || "Failed to save decision. Please try again.",
      }));
    }
  };

  const handleUpdateStatus = async (submissionId: string, newStatus: string, customNote?: string) => {
    const reviewerName = reviewerTag;
    const finalNote = customNote !== undefined ? customNote : editingNotes[submissionId];
    const activePass = passkey || (typeof window !== "undefined" ? sessionStorage.getItem("fortune_admin_pass") || "" : "");

    try {
      const res = await fetch("/api/admin/submissions", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(activePass ? { "x-admin-passkey": activePass } : {}),
        },
        body: JSON.stringify({
          id: submissionId,
          status: newStatus,
          reviewer: reviewerName,
          ...(finalNote !== undefined ? { adminNote: finalNote } : {}),
        }),
      });

      if (res.ok) {
        setSubmissions((prev) =>
          prev.map((sub) =>
            sub.id === submissionId
              ? {
                  ...sub,
                  status: newStatus as any,
                  reviewed_by: reviewerName,
                  ...(finalNote !== undefined ? { admin_notes: finalNote } : {}),
                }
              : sub
          )
        );
      }
    } catch (e) {
      console.error("Failed to update status:", e);
    }
  };

  const handleSaveAdminNote = async (submissionId: string) => {
    setSavingNoteId(submissionId);
    const noteContent = editingNotes[submissionId] || "";
    const reviewerName = reviewerTag;
    const activePass = passkey || (typeof window !== "undefined" ? sessionStorage.getItem("fortune_admin_pass") || "" : "");

    try {
      const res = await fetch("/api/admin/submissions", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(activePass ? { "x-admin-passkey": activePass } : {}),
        },
        body: JSON.stringify({
          id: submissionId,
          adminNote: noteContent,
          reviewer: reviewerName,
        }),
      });

      if (res.ok) {
        setSubmissions((prev) =>
          prev.map((sub) => (sub.id === submissionId ? { ...sub, admin_notes: noteContent, reviewed_by: reviewerName } : sub))
        );
      }
    } catch (e) {
      console.error("Failed to save note:", e);
    } finally {
      setSavingNoteId(null);
    }
  };

  // Filtered list
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesStatus = filterStatus === "all" || sub.status === filterStatus;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      sub.title.toLowerCase().includes(query) ||
      sub.user_name.toLowerCase().includes(query) ||
      sub.hackatime_project.toLowerCase().includes(query) ||
      (sub.user_slack_id && sub.user_slack_id.toLowerCase().includes(query));

    return matchesStatus && matchesSearch;
  });

  // KPI counts
  const totalCount = submissions.length;
  const pendingCount = submissions.filter((s) => s.status === "pending_review").length;
  const approvedCount = submissions.filter((s) => s.status === "approved").length;
  const totalHours = Math.round(submissions.reduce((acc, s) => acc + (Number(s.verified_hours) || 0), 0) * 10) / 10;

  // Render Gate if not authorized
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#f7f1e1] flex items-center justify-center p-6 text-center text-[#181926] font-pixel text-sm gap-2">
        <Clock className="w-4 h-4 animate-spin text-[#ec3750]" />
        <span>Verifying admin authentication...</span>
      </div>
    );
  }

  // Gate 1: Not signed in
  if (!session?.user && !isUnlocked) {
    return (
      <div className="min-h-screen bg-[#f7f1e1] flex items-center justify-center p-6 text-center text-[#181926]">
        <div className="wobbly-card bg-white p-8 max-w-md w-full border-2 border-[#181926] shadow-[6px_6px_0px_#181926] space-y-5">
          <div className="w-16 h-16 mx-auto bg-[#ffe066] border-2 border-[#181926] rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_#181926]">
            <Lock className="w-8 h-8 text-[#181926]" />
          </div>
          <h1 className="text-2xl font-black font-sans">Fortune Organizer Terminal</h1>
          <p className="font-doodle text-sm text-[#4a4e66]">
            This terminal is restricted to authorized Hack Club Fortune administrators (Slack ID: <strong>U0BTDMCJ6P7</strong>). Please sign in with your Slack account.
          </p>

          <div className="pt-2">
            <button
              onClick={() => signIn("hackclub")}
              className="fortune-btn fortune-btn-gold w-full text-sm py-2.5 inline-flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign in with Hack Club</span>
            </button>
          </div>

          <div className="pt-3 border-t border-[#181926]/10 text-left space-y-2">
            <span className="font-pixel text-[10px] text-gray-500 uppercase block">Or passkey emergency unlock:</span>
            <form onSubmit={handleUnlockWithPasskey} className="space-y-2">
              {passkeyError && (
                <div className="bg-[#fee2e2] text-[#ec3750] border-2 border-[#ec3750] p-2.5 rounded font-pixel text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{passkeyError}</span>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="Passkey..."
                  value={passkey}
                  onChange={(e) => {
                    setPasskey(e.target.value);
                    setPasskeyError("");
                  }}
                  className="w-full p-2.5 bg-[#faf9f5] border-2 border-[#181926] rounded text-xs font-mono outline-none text-center"
                />
                <button
                  type="submit"
                  className="bg-[#181926] text-white px-3 py-2 rounded font-pixel text-xs hover:bg-[#333]"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>

          <div className="pt-1">
            <Link href="/" className="font-pixel text-xs text-[#ec3750] hover:underline">
              ← Back to Fortune Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Gate 2: Signed in but NOT the authorized admin Slack ID (not U0BTDMCJ6P7)
  if (session?.user && !isAuthorizedAdmin && !isUnlocked) {
    const candidateSlackId = (session.user as any)?.slack_id || (session.user as any)?.id || "None";
    return (
      <div className="min-h-screen bg-[#f7f1e1] flex items-center justify-center p-6 text-center text-[#181926]">
        <div className="wobbly-card bg-white p-8 max-w-md w-full border-2 border-[#181926] shadow-[6px_6px_0px_#181926] space-y-5">
          <div className="w-16 h-16 mx-auto bg-[#fee2e2] border-2 border-[#ec3750] rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_#181926]">
            <AlertTriangle className="w-8 h-8 text-[#ec3750]" />
          </div>
          <h1 className="text-2xl font-black font-sans text-[#ec3750]">Access Denied</h1>
          <p className="font-sans text-xs text-[#4a4e66]">
            Signed in as <strong>@{session.user.name || "user"}</strong> (Slack ID: <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-[#ec3750]">{candidateSlackId}</code>).
          </p>
          <div className="bg-[#fee2e2] text-[#991b1b] border-2 border-[#ec3750] p-3 rounded font-pixel text-xs text-left flex items-start gap-2">
            <Lock className="w-4 h-4 shrink-0 text-[#ec3750] mt-0.5" />
            <span>Only authorized organizer accounts (Slack ID: <strong>U0BTDMCJ6P7</strong>) have permissions to access the Fortune Review Terminal.</span>
          </div>

          <div className="pt-2 border-t border-[#181926]/10 text-left space-y-2">
            <span className="font-pixel text-[10px] text-gray-500 uppercase block">Or passkey emergency unlock:</span>
            <form onSubmit={handleUnlockWithPasskey} className="space-y-2">
              {passkeyError && (
                <div className="bg-[#fee2e2] text-[#ec3750] border-2 border-[#ec3750] p-2.5 rounded font-pixel text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{passkeyError}</span>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="Passkey..."
                  value={passkey}
                  onChange={(e) => {
                    setPasskey(e.target.value);
                    setPasskeyError("");
                  }}
                  className="w-full p-2.5 bg-[#faf9f5] border-2 border-[#181926] rounded text-xs font-mono outline-none text-center"
                />
                <button
                  type="submit"
                  className="bg-[#181926] text-white px-3 py-2 rounded font-pixel text-xs hover:bg-[#333]"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>

          <div className="flex flex-col gap-2 pt-2 font-pixel text-xs">
            <Link
              href="/dashboard"
              className="fortune-btn fortune-btn-gold w-full text-center py-2"
            >
              Return to Founder Dashboard
            </Link>
            <button
              onClick={() => signOut()}
              className="bg-white border border-[#181926] hover:bg-gray-100 py-2 rounded text-gray-700"
            >
              Switch Account [Sign Out]
            </button>
          </div>
          <div className="pt-1">
            <Link href="/" className="font-pixel text-xs text-[#ec3750] hover:underline">
              ← Back to Fortune Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f1e1] text-[#181926] pt-20 pb-20 px-4 sm:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top Header Card */}
        <div className="wobbly-card bg-white p-6 border-2 border-[#181926] shadow-[4px_4px_0px_#181926] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-[#181926]" />
              <h1 className="text-2xl sm:text-3xl font-black text-[#181926]">
                Fortune Admin &amp; Review Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="bg-[#e6f4ea] text-[#137333] border border-[#137333] px-2.5 py-0.5 rounded font-pixel text-[11px] font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> Verified Admin: @{session?.user?.name || "Organizer"} ({userSlackId})
              </span>
            </div>
            <p className="font-doodle text-sm text-[#4a4e66] mt-1">
              Review shipped startups, inspect Hackatime hours, leave collaborative notes, and approve seed grants.
            </p>
          </div>

          <div className="flex items-center gap-3 font-pixel text-xs">
            <button
              onClick={loadSubmissions}
              className="bg-[#ffe066] border border-[#181926] px-3 py-1.5 rounded hover:bg-[#ffd633] inline-flex items-center gap-1.5 font-bold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
            <Link
              href="/dashboard"
              className="bg-[#faf9f5] border border-[#181926] px-3 py-1.5 rounded hover:bg-white inline-flex items-center gap-1.5 font-bold"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Founder Form</span>
            </Link>
            <Link
              href="/"
              className="bg-[#faf9f5] border border-[#181926] px-3 py-1.5 rounded hover:bg-white inline-flex items-center gap-1.5 font-bold"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
          </div>
        </div>

        {/* Metric KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
          <div className="bg-white p-4 border-2 border-[#181926] rounded-md shadow-[3px_3px_0px_#181926]">
            <span className="text-xs text-gray-500 uppercase font-pixel block">Total Shipped</span>
            <span className="text-3xl font-bold text-[#181926]">{totalCount}</span>
          </div>
          <div className="bg-[#fffdf5] p-4 border-2 border-[#181926] rounded-md shadow-[3px_3px_0px_#181926]">
            <span className="text-xs text-[#b45309] uppercase font-pixel block">Pending Review</span>
            <span className="text-3xl font-bold text-[#b45309]">{pendingCount}</span>
          </div>
          <div className="bg-[#e6f4ea] p-4 border-2 border-[#181926] rounded-md shadow-[3px_3px_0px_#181926]">
            <span className="text-xs text-[#137333] uppercase font-pixel block">Approved ($100 Seed)</span>
            <span className="text-3xl font-bold text-[#137333]">{approvedCount}</span>
          </div>
          <div className="bg-white p-4 border-2 border-[#181926] rounded-md shadow-[3px_3px_0px_#181926]">
            <span className="text-xs text-gray-500 uppercase font-pixel block">Tracked Hours</span>
            <span className="text-3xl font-bold text-[#ec3750]">{totalHours}h</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 border-2 border-[#181926] rounded-md shadow-[3px_3px_0px_#181926] flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="w-full sm:w-1/2">
            <input
              type="text"
              placeholder="Search by project name, founder, Slack ID, or repo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2.5 bg-[#faf9f5] border border-[#181926] rounded text-xs font-mono outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 font-pixel text-xs overflow-x-auto w-full sm:w-auto">
            <span className="text-gray-500 mr-1 text-[10px]">Filter:</span>
            {[
              { id: "all", label: "All" },
              { id: "pending_review", label: "Pending" },
              { id: "approved", label: "Approved" },
              { id: "changes_requested", label: "Changes" },
              { id: "rejected", label: "Rejected" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                className={`px-2.5 py-1 rounded border border-[#181926] transition ${
                  filterStatus === f.id ? "bg-[#181926] text-white" : "bg-white hover:bg-[#faf9f5]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center py-12 font-pixel text-base text-gray-600 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 animate-spin text-[#ec3750]" />
            <span>Loading shipped projects from Supabase...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredSubmissions.length === 0 && (
          <div className="bg-white p-12 text-center border-2 border-[#181926] rounded-md shadow-[4px_4px_0px_#181926] space-y-3">
            <div className="w-16 h-16 mx-auto bg-[#faf9f5] border-2 border-[#181926] rounded-2xl flex items-center justify-center">
              <Inbox className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold font-sans">No Shipped Projects Found</h3>
            <p className="font-doodle text-sm text-gray-500">
              {searchQuery || filterStatus !== "all"
                ? "Try clearing your search query or filter."
                : "No teenagers have submitted projects yet. Form submissions on /dashboard will appear here in real-time."}
            </p>
          </div>
        )}

        {/* Submissions List */}
        <div className="space-y-6">
          {filteredSubmissions.map((sub) => {
            const hasMilestone = sub.verified_hours >= 10;
            const noteText = editingNotes[sub.id] ?? sub.admin_notes ?? "";

            return (
              <div
                key={sub.id}
                className="bg-white border-2 border-[#181926] rounded-md p-6 shadow-[5px_5px_0px_#181926] space-y-5"
              >
                {/* Header: Title + Status Pill */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-dashed border-[#181926]/15 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Package className="w-6 h-6 text-[#181926]" />
                      <h2 className="text-2xl font-black text-[#181926]">{sub.title}</h2>
                    </div>
                    <div className="font-pixel text-[11px] text-gray-500 mt-1">
                      Submitted on: {new Date(sub.created_at).toLocaleString()} • ID:{" "}
                      <span className="font-mono text-[10px]">{sub.id}</span>
                    </div>
                  </div>

                  {/* Status Pill */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-pixel text-xs px-3 py-1 rounded-full border-2 font-bold uppercase tracking-wider ${
                        sub.status === "approved"
                          ? "bg-[#e6f4ea] text-[#137333] border-[#137333]"
                          : sub.status === "changes_requested"
                          ? "bg-[#fff7ed] text-[#c2410c] border-[#c2410c]"
                          : sub.status === "rejected"
                          ? "bg-[#fee2e2] text-[#ec3750] border-[#ec3750]"
                          : "bg-[#fef9c3] text-[#854d0e] border-[#854d0e]"
                      }`}
                    >
                      {sub.status.replace("_", " ")}
                    </span>
                  </div>
                </div>

                {/* Grid: Founder & Hackatime Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#faf9f5] p-4 rounded border border-[#181926]/20 font-mono text-xs">
                  <div className="space-y-1">
                    <div className="font-pixel text-[10px] text-gray-500 uppercase">Founder Details:</div>
                    <div className="font-bold text-sm text-[#181926]">
                      @{sub.user_name}
                    </div>
                    <div className="text-gray-600">
                      Email: {sub.user_email || "N/A"}
                    </div>
                    <div className="text-gray-600">
                      Slack ID: <code className="bg-white px-1.5 py-0.5 rounded border border-[#181926]/20">{sub.user_slack_id || "N/A"}</code>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="font-pixel text-[10px] text-gray-500 uppercase">Hackatime Telemetry:</div>
                    <div>
                      Project: <strong className="text-[#ec3750]">{sub.hackatime_project}</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Verified Hours:</span>
                      <span className="font-bold text-sm text-[#181926] bg-[#e6f4ea] text-[#137333] px-2 py-0.5 rounded border border-[#137333]/30">
                        {sub.verified_hours} hrs
                      </span>
                      {hasMilestone && (
                        <span className="text-[#10b981] font-bold font-pixel text-[10px] flex items-center gap-1">
                          <Check className="w-3 h-3" /> $100 Seed Eligible
                        </span>
                      )}
                    </div>
                    <div className="text-gray-600">
                      AI Usage: <strong className="uppercase">{sub.use_of_ai}</strong> ({sub.ai_explanation || "No notes"})
                    </div>
                  </div>
                </div>

                {/* Description */}
                {sub.description && (
                  <div>
                    <div className="font-pixel text-[11px] text-gray-500 uppercase mb-1">Description:</div>
                    <p className="bg-[#faf9f5] p-3 rounded border border-[#181926]/20 text-sm font-sans leading-relaxed text-[#181926]">
                      {sub.description}
                    </p>
                  </div>
                )}

                {/* Links: GitHub & Demo */}
                <div className="flex flex-wrap gap-3 font-mono text-xs">
                  <a
                    href={sub.repo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#181926] text-white px-3 py-2 rounded flex items-center gap-1.5 hover:bg-[#333] transition"
                  >
                    <GitBranch className="w-3.5 h-3.5" /> GitHub Repository ↗
                  </a>
                  <a
                    href={sub.demo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#ec3750] text-white px-3 py-2 rounded flex items-center gap-1.5 hover:bg-[#d62839] transition"
                  >
                    <Globe className="w-3.5 h-3.5" /> Live Startup Demo ↗
                  </a>
                </div>

                {/* Screenshots Gallery (Max 5) */}
                {sub.screenshots && sub.screenshots.length > 0 && (
                  <div className="space-y-2">
                    <div className="font-pixel text-[11px] text-gray-600 uppercase font-bold flex items-center justify-between">
                      <span>Proof of Work Screenshots ({sub.screenshots.length}):</span>
                      <span className="text-[10px] text-gray-400 font-normal">Click image to enlarge</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {sub.screenshots.map((url, i) => (
                        <div
                          key={i}
                          onClick={() => setActiveImageModal(url)}
                          className="relative cursor-pointer border-2 border-[#181926] rounded overflow-hidden shadow-[2px_2px_0px_#181926] hover:scale-105 transition group"
                        >
                          <img
                            src={url}
                            alt={`Proof ${i + 1}`}
                            className="w-full h-24 object-cover"
                          />
                          <span className="absolute bottom-1 right-1 bg-[#181926] text-white text-[9px] px-1 rounded font-pixel">
                            #{i + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin Actions & Collaborative Notes */}
                <div className="bg-[#fffdf5] border-2 border-[#181926] rounded-md p-4 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#181926]/15 pb-3">
                    <div className="font-pixel text-xs font-bold text-[#181926] flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-[#181926]" />
                      <span>Organizer Actions:</span>
                    </div>

                    <div className="flex flex-wrap gap-2 font-pixel text-xs">
                      <button
                        onClick={() => handleUpdateStatus(sub.id, "approved")}
                        className="bg-[#e6f4ea] text-[#137333] border border-[#137333] px-3 py-1.5 rounded hover:bg-[#cbf0d3] font-bold inline-flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve ($100 Seed)
                      </button>
                      <button
                        onClick={() => openReasonModal(sub, "changes_requested")}
                        className="bg-[#fff7ed] text-[#c2410c] border border-[#c2410c] px-3 py-1.5 rounded hover:bg-[#ffedd5] font-bold inline-flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Request Changes
                      </button>
                      <button
                        onClick={() => openReasonModal(sub, "rejected")}
                        className="bg-[#fee2e2] text-[#ec3750] border border-[#ec3750] px-3 py-1.5 rounded hover:bg-[#fecaca] font-bold inline-flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(sub.id, "pending_review")}
                        className="bg-white text-gray-600 border border-gray-400 px-2 py-1.5 rounded hover:bg-gray-100 inline-flex items-center gap-1"
                      >
                        <Clock className="w-3.5 h-3.5" /> Reset to Pending
                      </button>
                    </div>
                  </div>

                  {/* Collaborative Organizer Notes */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-pixel text-xs font-bold text-[#181926] flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-[#181926]" />
                        <span>Organizer Notes (Shared between @Noben_Nobi, @itsnotketan &amp; team):</span>
                      </label>
                      {sub.reviewed_by && (
                        <span className="font-pixel text-[10px] text-gray-500">
                          Last touched by: <strong>@{sub.reviewed_by}</strong>
                        </span>
                      )}
                    </div>

                    <textarea
                      rows={2}
                      placeholder="e.g. Verified Hackatime telemetry. Tested signup flow on demo. Payout scheduled on HCB! - Noben"
                      value={noteText}
                      onChange={(e) =>
                        setEditingNotes({
                          ...editingNotes,
                          [sub.id]: e.target.value,
                        })
                      }
                      className="w-full p-2.5 bg-white border border-[#181926] rounded text-xs font-sans outline-none focus:border-[#ec3750]"
                    />

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleSaveAdminNote(sub.id)}
                        disabled={savingNoteId === sub.id}
                        className="bg-[#181926] text-white px-3 py-1 rounded font-pixel text-xs hover:bg-[#333] transition disabled:opacity-50 inline-flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{savingNoteId === sub.id ? "Saving Note..." : "Save Organizer Note"}</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Custom Reason Screen Modal (Replaces browser alerts/prompts) */}
      {reasonModal.isOpen && reasonModal.submission && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget && !reasonModal.isSubmitting) {
              closeReasonModal();
            }
          }}
          className="fixed inset-0 z-50 bg-[#181926]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="wobbly-card bg-[#fffdf5] border-4 border-[#181926] shadow-[8px_8px_0px_#181926] max-w-lg w-full p-6 space-y-4 relative">
            {/* Close button */}
            <button
              onClick={closeReasonModal}
              disabled={reasonModal.isSubmitting}
              className="absolute top-4 right-4 text-gray-500 hover:text-[#ec3750] font-pixel text-base font-bold disabled:opacity-50"
            >
              ✕
            </button>

            {/* Header */}
            <div className="border-b-2 border-dashed border-[#181926]/20 pb-3">
              <div className="flex items-center gap-2">
                {reasonModal.targetStatus === "rejected" ? (
                  <AlertTriangle className="w-6 h-6 text-[#ec3750]" />
                ) : (
                  <MessageSquare className="w-6 h-6 text-[#f97316]" />
                )}
                <div>
                  <h3 className="text-xl font-black font-sans text-[#181926]">
                    {reasonModal.targetStatus === "rejected"
                      ? "Reject Project Submission"
                      : "Request Project Changes"}
                  </h3>
                  <p className="font-pixel text-[11px] text-gray-600 mt-0.5">
                    Project: <strong className="text-[#181926]">{reasonModal.submission.title}</strong> • Founder:{" "}
                    <strong className="text-[#ec3750]">@{reasonModal.submission.user_name}</strong>
                  </p>
                </div>
              </div>
              <p className="font-doodle text-xs text-[#4a4e66] mt-2">
                {reasonModal.targetStatus === "rejected"
                  ? "This explanation will be saved in the database and shown on the founder's dashboard."
                  : "Tell the founder what updates are needed before this can be approved."}
              </p>
            </div>

            {/* Quick Reason Presets */}
            <div className="space-y-1.5">
              <label className="font-pixel text-[10px] text-gray-500 uppercase tracking-wide block">
                Quick Reason Presets (Click to insert):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(reasonModal.targetStatus === "rejected" ? REJECTION_PRESETS : CHANGES_PRESETS).map(
                  (preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setReasonModal((prev) => ({
                          ...prev,
                          reasonText: preset.text,
                          error: undefined,
                        }))
                      }
                      className="bg-white hover:bg-[#fff7ed] border border-[#181926] px-2.5 py-1 rounded text-[11px] font-sans font-medium text-[#181926] transition active:scale-95 shadow-[1px_1px_0px_#181926]"
                    >
                      {preset.label}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Reason Textarea */}
            <div className="space-y-1">
              <label className="font-pixel text-xs font-bold text-[#181926] flex items-center justify-between">
                <span>
                  {reasonModal.targetStatus === "rejected"
                    ? "Rejection Reason / Feedback:"
                    : "Instructions for Founder:"}
                </span>
                <span className="font-normal text-[10px] text-gray-500">
                  {reasonModal.reasonText.length} characters
                </span>
              </label>
              <textarea
                rows={4}
                value={reasonModal.reasonText}
                onChange={(e) =>
                  setReasonModal((prev) => ({
                    ...prev,
                    reasonText: e.target.value,
                    error: undefined,
                  }))
                }
                placeholder={
                  reasonModal.targetStatus === "rejected"
                    ? "Enter constructive feedback explaining why this submission cannot be approved..."
                    : "Detail the specific updates required (e.g. log 3 more hours, test demo link)..."
                }
                className="w-full p-3 bg-white border-2 border-[#181926] rounded text-xs font-sans outline-none focus:border-[#ec3750] resize-none shadow-inner"
                autoFocus
              />
            </div>

            {/* Error Message */}
            {reasonModal.error && (
              <div className="bg-[#fee2e2] text-[#ec3750] border-2 border-[#ec3750] p-2.5 rounded font-pixel text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{reasonModal.error}</span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#181926]/10 font-pixel text-xs">
              <button
                type="button"
                onClick={closeReasonModal}
                disabled={reasonModal.isSubmitting}
                className="bg-white border border-[#181926] px-3.5 py-1.5 rounded hover:bg-gray-100 disabled:opacity-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReasonDecision}
                disabled={reasonModal.isSubmitting || !reasonModal.reasonText.trim()}
                className={`px-4 py-1.5 rounded font-bold transition shadow-[2px_2px_0px_#181926] disabled:opacity-50 ${
                  reasonModal.targetStatus === "rejected"
                    ? "bg-[#ec3750] text-white hover:bg-[#d62839] border border-[#181926]"
                    : "bg-[#f97316] text-white hover:bg-[#ea580c] border border-[#181926]"
                }`}
              >
                {reasonModal.isSubmitting
                  ? "Saving Decision..."
                  : reasonModal.targetStatus === "rejected"
                  ? "Confirm Rejection"
                  : "Send Change Request"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox / Modal for Screenshots */}
      {activeImageModal && (
        <div
          onClick={() => setActiveImageModal(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white p-2 rounded-lg border-4 border-[#181926] shadow-2xl">
            <img
              src={activeImageModal}
              alt="Proof full view"
              className="max-h-[80vh] w-auto object-contain rounded"
            />
            <div className="p-2 flex items-center justify-between font-pixel text-xs text-gray-700">
              <a
                href={activeImageModal}
                target="_blank"
                rel="noreferrer"
                className="text-[#ec3750] underline hover:text-[#d62839]"
                onClick={(e) => e.stopPropagation()}
              >
                Open Original Image ↗
              </a>
              <span className="flex items-center gap-1">
                <X className="w-3 h-3" /> Click outside to close
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

