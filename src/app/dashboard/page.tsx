"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import confetti from "canvas-confetti";
import {
  Coins,
  Home,
  Package,
  Plus,
  Clock,
  MessageSquare,
  X,
  Trophy,
  Check,
  GitBranch,
  Globe,
  Lock,
  Trash2,
  Camera,
  Image as ImageIcon,
  AlertTriangle,
  LogIn,
  ExternalLink,
  RefreshCw,
  Upload,
  Link as LinkIcon,
} from "lucide-react";

interface HackatimeProject {
  name: string;
  total_seconds: number;
  hours: number;
  text: string;
}

interface UserSubmission {
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

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form states matching Noben_Nobi's requirements + Hackatime project auto-suggestion
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    hackatimeProject: "",
    verifiedHours: 0,
    useOfAi: "minimal",
    aiExplanation: "",
    repoUrl: "",
    demoUrl: "",
  });

  // Screenshots state (Max 5 images with functional storage)
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // User's Real Shipped Projects
  const [userSubmissions, setUserSubmissions] = useState<UserSubmission[]>([]);
  const [loadingUserSubmissions, setLoadingUserSubmissions] = useState(false);
  const [showNewShipForm, setShowNewShipForm] = useState(true);
  // Custom Delete Confirmation Modal state (No browser confirm/alert dialogs)
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    submissionId: string;
    projectTitle: string;
    projectStatus: string;
    isDeleting: boolean;
    error?: string;
  }>({
    isOpen: false,
    submissionId: "",
    projectTitle: "",
    projectStatus: "",
    isDeleting: false,
  });

  const promptDeleteSubmission = (submissionId: string, projectTitle: string, projectStatus: string) => {
    if (projectStatus === "approved") {
      setDeleteModal({
        isOpen: true,
        submissionId,
        projectTitle,
        projectStatus,
        isDeleting: false,
        error: "Approved projects cannot be deleted as their $100 seed grant has already been disbursed/authorized.",
      });
      return;
    }

    setDeleteModal({
      isOpen: true,
      submissionId,
      projectTitle,
      projectStatus,
      isDeleting: false,
      error: undefined,
    });
  };

  const closeDeleteModal = () => {
    if (deleteModal.isDeleting) return;
    setDeleteModal((prev) => ({ ...prev, isOpen: false, error: undefined }));
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.submissionId) return;
    if (deleteModal.projectStatus === "approved") return;

    setDeleteModal((prev) => ({ ...prev, isDeleting: true, error: undefined }));
    const id = deleteModal.submissionId;

    try {
      const res = await fetch(`/api/submissions?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete submission");
      }

      setUserSubmissions((prev) => {
        const remaining = prev.filter((s) => s.id !== id);
        if (remaining.length === 0) {
          setShowNewShipForm(true);
        }
        return remaining;
      });

      setDeleteModal({
        isOpen: false,
        submissionId: "",
        projectTitle: "",
        projectStatus: "",
        isDeleting: false,
      });
    } catch (err: any) {
      setDeleteModal((prev) => ({
        ...prev,
        isDeleting: false,
        error: err.message || "Failed to delete submission. Please try again.",
      }));
    }
  };

  // Hackatime state
  const [projects, setProjects] = useState<HackatimeProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [selectedCustom, setSelectedCustom] = useState(false);
  const [customLookupId, setCustomLookupId] = useState("");
  const [showCustomLookup, setShowCustomLookup] = useState(false);

  // Fetch real submissions made by this user
  const fetchUserSubmissions = () => {
    if (!session?.user) return;
    const name = session.user.name || "";
    const slackId = (session.user as any)?.slack_id || "";
    const email = session.user.email || "";

    setLoadingUserSubmissions(true);
    fetch(`/api/submissions?user=${encodeURIComponent(name)}&slackId=${encodeURIComponent(slackId)}&email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.submissions && Array.isArray(data.submissions)) {
          setUserSubmissions(data.submissions);
          // If they already have shipped projects, collapse the form by default so status is visible immediately
          if (data.submissions.length > 0) {
            setShowNewShipForm(false);
          }
        }
      })
      .catch((err) => {
        console.error("Error fetching user submissions:", err);
      })
      .finally(() => {
        setLoadingUserSubmissions(false);
      });
  };

  const fetchHackatimeProjects = (targetId?: string) => {
    const identifier = targetId || (session?.user as any)?.slack_id || session?.user?.name || "default";

    setLoadingProjects(true);
    fetch(`/api/hackatime/projects?slackId=${encodeURIComponent(identifier)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.projects && Array.isArray(data.projects)) {
          setProjects(data.projects);
          if (data.projects.length > 0) {
            const first = data.projects[0];
            setSelectedCustom(false);
            setFormData((prev) => ({
              ...prev,
              hackatimeProject: first.name,
              verifiedHours: first.hours,
            }));
          }
        }
      })
      .catch((err) => {
        console.error("Hackatime fetch error:", err);
      })
      .finally(() => {
        setLoadingProjects(false);
      });
  };

  // Auto-fetch Hackatime projects & user submissions on load/session change
  useEffect(() => {
    if (session?.user) {
      fetchHackatimeProjects();
      fetchUserSubmissions();
    }
  }, [session]);

  const handleSelectProject = (projectName: string) => {
    if (projectName === "__CUSTOM__") {
      setSelectedCustom(true);
      setFormData((prev) => ({ ...prev, hackatimeProject: "", verifiedHours: 0 }));
      return;
    }

    setSelectedCustom(false);
    const found = projects.find((p) => p.name === projectName);
    setFormData((prev) => ({
      ...prev,
      hackatimeProject: projectName,
      verifiedHours: found ? found.hours : 0,
    }));
  };

  // Upload handler for screenshots (Max 5 images)
  const handleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError("");
    const remainingSlots = 5 - screenshots.length;

    if (remainingSlots <= 0) {
      setUploadError("You have already reached the maximum limit of 5 screenshots.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      setUploadError(`Only ${remainingSlots} more screenshot(s) could be added (max 5).`);
    }

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of filesToUpload) {
      try {
        const body = new FormData();
        body.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || `Upload failed for ${file.name}`);
        }

        if (data.url) {
          uploadedUrls.push(data.url);
        }
      } catch (err: any) {
        console.error("Upload error:", err);
        setUploadError(err.message || "Failed to upload an image.");
      }
    }

    if (uploadedUrls.length > 0) {
      setScreenshots((prev) => [...prev, ...uploadedUrls].slice(0, 5));
    }

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveScreenshot = (indexToRemove: number) => {
    setScreenshots((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setUploadError("");
  };

  const handleAddUrlScreenshot = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    if (screenshots.length >= 5) {
      setUploadError("Maximum of 5 screenshots reached.");
      return;
    }

    setScreenshots((prev) => [...prev, trimmed].slice(0, 5));
    setUrlInput("");
    setUploadError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    if (screenshots.length === 0) {
      setErrorMessage("Please upload at least 1 screenshot of your project working!");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          screenshots, // Array of max 5 URLs
          user: session?.user || { name: "Hack Clubber" },
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Submission failed");
      }

      setSubmitted(true);
      fetchUserSubmissions(); // reload user's shipments
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#ec3750", "#ffe066", "#10b981", "#181926"],
      });
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to ship project. Please check your fields and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#f7f1e1] flex items-center justify-center font-pixel text-lg text-[#181926] gap-2">
        <Clock className="w-5 h-5 animate-spin text-[#ec3750]" />
        <span>Loading dashboard...</span>
      </div>
    );
  }

  // Not signed in
  if (!session || !session.user) {
    return (
      <div className="min-h-screen bg-[#f7f1e1] flex flex-col items-center justify-center p-6 text-center">
        <div className="wobbly-card bg-white p-8 max-w-md space-y-4 border-2 border-[#181926] shadow-[4px_4px_0px_#181926]">
          <div className="w-16 h-16 mx-auto bg-[#ffe066] border-2 border-[#181926] rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_#181926]">
            <Coins className="w-8 h-8 text-[#181926]" />
          </div>
          <h1 className="text-3xl font-black font-sans text-[#181926]">
            Sign in to Ship Your Project
          </h1>
          <p className="font-doodle text-lg text-[#4a4e66]">
            Connect with your Hack Club Slack to auto-link your Hackatime hours and track your project reviews.
          </p>
          <div className="pt-2">
            <button
              onClick={() => signIn("hackclub")}
              className="fortune-btn fortune-btn-gold w-full text-base inline-flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign in with Hack Club</span>
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
                Founder Dashboard
              </h1>
              <div className="font-pixel text-xs text-gray-500">
                Signed in as <strong>@{session.user.name}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 font-pixel text-xs">
            <Link
              href="/"
              className="bg-[#f7f1e1] px-3 py-1.5 rounded border border-[#181926] hover:bg-white inline-flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <button
              onClick={() => signOut()}
              className="text-[#ec3750] hover:underline"
            >
              [Sign out]
            </button>
          </div>
        </div>

        {/* 1. REAL SHIPPED PROJECTS SECTION FOR THIS USER */}
        {userSubmissions.length > 0 && (
          <div className="wobbly-card bg-white p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-dashed border-[#181926]/15 pb-4">
              <div>
                <h2 className="text-2xl font-black font-sans text-[#181926] flex items-center gap-2">
                  <Package className="w-6 h-6 text-[#181926]" />
                  <span>Your Shipped Fortune Projects ({userSubmissions.length})</span>
                </h2>
                <p className="font-doodle text-sm text-[#4a4e66]">
                  Real-time review status and notes from @Noben_Nobi &amp; the organizers.
                </p>
              </div>

              <button
                onClick={() => setShowNewShipForm(!showNewShipForm)}
                className="bg-[#ffe066] border-2 border-[#181926] px-3.5 py-1.5 rounded font-pixel text-xs font-bold hover:bg-[#ffd633] transition shadow-[2px_2px_0px_#181926]"
              >
                {showNewShipForm ? "Hide Form" : "+ Ship Another Project"}
              </button>
            </div>

            <div className="space-y-5">
              {userSubmissions.map((sub) => {
                const isApproved = sub.status === "approved";
                const isPending = sub.status === "pending_review";
                const isChanges = sub.status === "changes_requested";
                const isRejected = sub.status === "rejected";

                return (
                  <div
                    key={sub.id}
                    className={`border-2 border-[#181926] rounded-md p-5 space-y-4 shadow-[4px_4px_0px_#181926] ${
                      isApproved
                        ? "bg-[#f0fdf4]"
                        : isRejected
                        ? "bg-[#fff1f2]"
                        : isChanges
                        ? "bg-[#fffbeb]"
                        : "bg-[#fffdf5]"
                    }`}
                  >
                    {/* Header: Title & Status Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#181926]/10 pb-3">
                      <div>
                        <h3 className="text-xl font-black text-[#181926]">{sub.title}</h3>
                        <div className="font-pixel text-[11px] text-gray-500 mt-0.5">
                          Hackatime: <strong className="text-[#ec3750]">{sub.hackatime_project}</strong> ({sub.verified_hours} hrs tracked) • Shipped: {new Date(sub.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div>
                        {isApproved && (
                          <span className="bg-[#10b981] text-white px-3 py-1 rounded-full font-pixel text-xs font-bold inline-flex items-center gap-1 shadow">
                            <Check className="w-3.5 h-3.5" /> APPROVED ($100 SEED)
                          </span>
                        )}
                        {isPending && (
                          <span className="bg-[#ffe066] text-[#181926] border border-[#181926] px-3 py-1 rounded-full font-pixel text-xs font-bold inline-flex items-center gap-1 shadow animate-pulse">
                            <Clock className="w-3.5 h-3.5" /> UNDER REVIEW
                          </span>
                        )}
                        {isChanges && (
                          <span className="bg-[#f97316] text-white px-3 py-1 rounded-full font-pixel text-xs font-bold inline-flex items-center gap-1 shadow">
                            <MessageSquare className="w-3.5 h-3.5" /> CHANGES REQUESTED
                          </span>
                        )}
                        {isRejected && (
                          <span className="bg-[#ec3750] text-white px-3 py-1 rounded-full font-pixel text-xs font-bold inline-flex items-center gap-1 shadow">
                            <X className="w-3.5 h-3.5" /> NOT APPROVED
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Pending State Banner */}
                    {isPending && (
                      <div className="bg-white/80 p-3.5 rounded border border-[#181926]/20 font-sans text-xs text-[#854d0e] flex items-start gap-2.5">
                        <Clock className="w-5 h-5 text-[#854d0e] shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-bold text-sm">Your submission is under active review!</strong>
                          Our team (@Noben_Nobi &amp; organizers) is verifying your Hackatime hours and testing your demo. Keep an eye on <code>#fortune</code> on Slack!
                        </div>
                      </div>
                    )}

                    {/* Approved State Banner */}
                    {isApproved && (
                      <div className="bg-white/90 p-4 rounded border-2 border-[#10b981] font-sans text-xs text-[#137333] space-y-2">
                        <div className="flex items-center gap-2 font-bold text-base text-[#10b981]">
                          <Trophy className="w-5 h-5 text-[#10b981]" /> Congratulations! Your Startup is Approved!
                        </div>
                        <p className="text-xs text-[#137333]">
                          Your $100 seed grant has been authorized. Check your Hack Club Bank account or your Slack DMs!
                        </p>
                        {sub.admin_notes && (
                          <div className="mt-2 p-2.5 bg-[#e6f4ea] rounded border border-[#137333]/30 font-mono text-xs">
                            <strong>Note from Organizers:</strong> &ldquo;{sub.admin_notes}&rdquo;
                          </div>
                        )}
                      </div>
                    )}

                    {/* Changes Requested Banner */}
                    {isChanges && (
                      <div className="bg-white p-4 rounded border-2 border-[#f97316] font-sans text-xs text-[#c2410c] space-y-2">
                        <div className="flex items-center gap-2 font-bold text-sm text-[#f97316]">
                          <MessageSquare className="w-4 h-4 text-[#f97316]" /> Organizers Requested Changes:
                        </div>
                        <div className="bg-[#fff7ed] p-3 rounded border border-[#f97316]/30 font-mono text-xs text-[#9a3412]">
                          <strong>Feedback from {sub.reviewed_by ? `@${sub.reviewed_by}` : "Organizers"}:</strong>
                          <p className="mt-1 font-sans text-sm text-[#181926] font-medium">
                            &ldquo;{sub.admin_notes || "Please review requirements and update your submission."}&rdquo;
                          </p>
                        </div>
                        <p className="text-[11px] text-gray-600">
                          Make the requested updates, then ping us on Slack in <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">#fortune-help</code>!
                        </p>
                      </div>
                    )}

                    {/* Rejection Message Banner */}
                    {isRejected && (
                      <div className="bg-white p-4 rounded border-2 border-[#ec3750] font-sans text-xs text-[#991b1b] space-y-2">
                        <div className="flex items-center gap-2 font-bold text-sm text-[#ec3750]">
                          <AlertTriangle className="w-4 h-4 text-[#ec3750]" /> Submission Decision
                        </div>
                        <div className="bg-[#fee2e2] p-3 rounded border border-[#ec3750]/30 font-mono text-xs text-[#7f1d1d]">
                          <strong>Rejection Reason from {sub.reviewed_by ? `@${sub.reviewed_by}` : "Reviewers"}:</strong>
                          <p className="mt-1 font-sans text-sm text-[#181926] font-medium">
                            &ldquo;{sub.admin_notes || "Does not meet Hack Club Fortune criteria."}&rdquo;
                          </p>
                        </div>
                        <p className="text-[11px] text-gray-600">
                          You are welcome to build and submit a brand-new project below!
                        </p>
                      </div>
                    )}

                    {/* Links, Thumbnails & Delete Action */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#181926]/10 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <a
                          href={sub.repo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-white border border-[#181926] px-2.5 py-1 rounded hover:bg-gray-50 flex items-center gap-1 font-bold"
                        >
                          <GitBranch className="w-3.5 h-3.5" /> Repo ↗
                        </a>
                        <a
                          href={sub.demo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-white border border-[#181926] px-2.5 py-1 rounded hover:bg-gray-50 flex items-center gap-1 font-bold"
                        >
                          <Globe className="w-3.5 h-3.5" /> Demo ↗
                        </a>
                        {isApproved ? (
                          <span
                            className="bg-gray-100 text-gray-500 border border-gray-300 px-2.5 py-1 rounded font-pixel text-[11px] flex items-center gap-1 cursor-not-allowed select-none"
                            title="Approved submissions cannot be deleted as their $100 seed grant has already been disbursed/authorized."
                          >
                            <Lock className="w-3 h-3 inline mr-1" /> Approved &amp; Locked
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => promptDeleteSubmission(sub.id, sub.title, sub.status)}
                            className="bg-[#fee2e2] text-[#ec3750] border border-[#ec3750] hover:bg-[#fecaca] px-2.5 py-1 rounded font-pixel text-[11px] flex items-center gap-1 transition cursor-pointer"
                            title="Delete this submission and permanently erase all attached images"
                          >
                            <Trash2 className="w-3 h-3 inline mr-1" /> Delete
                          </button>
                        )}
                      </div>

                      {sub.screenshots && sub.screenshots.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <span className="font-pixel text-[10px] text-gray-500">Proofs ({sub.screenshots.length}):</span>
                          {sub.screenshots.map((url, i) => (
                            <a
                              key={i}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="w-7 h-7 rounded border border-[#181926] overflow-hidden hover:opacity-80 block"
                            >
                              <img src={url} alt={`proof ${i + 1}`} className="w-full h-full object-cover" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. SHIPPING FORM (Always visible if 0 submissions, or toggled on demand) */}
        {showNewShipForm && (
          <div className="wobbly-card bg-white p-6 sm:p-8 space-y-6">
            <div className="border-b-2 border-dashed border-[#181926]/15 pb-4">
              <h2 className="text-2xl font-black font-sans text-[#181926] flex items-center gap-2">
                <Package className="w-6 h-6 text-[#181926]" />
                <span>Ship Your Fortune Project</span>
              </h2>
              <p className="font-doodle text-base text-[#4a4e66] mt-1">
                Fill out the details below. Our team (@Noben_Nobi &amp; organizers) will review your submission!
              </p>
            </div>

            {errorMessage && (
              <div className="bg-[#fde8e8] border-2 border-[#ec3750] p-4 rounded-md font-pixel text-xs text-[#ec3750] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {submitted ? (
              <div className="bg-[#e6f4ea] border-2 border-[#137333] p-6 rounded-lg text-center space-y-4">
                <div className="w-12 h-12 mx-auto bg-[#137333]/10 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-[#137333]" />
                </div>
                <h3 className="text-2xl font-bold font-sans text-[#137333]">
                  Project Shipped Successfully!
                </h3>
                <p className="font-doodle text-lg text-[#274e13]">
                  Your shipment for <strong>&ldquo;{formData.title}&rdquo;</strong> is now in review. Check your status above or in <code className="bg-white px-2 py-0.5 rounded border border-[#137333]">#fortune</code> on Slack!
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setShowNewShipForm(false);
                    }}
                    className="font-pixel text-xs bg-white text-[#137333] px-4 py-2 rounded border border-[#137333] hover:bg-[#e6f4ea]"
                  >
                    View Shipped Project Status ↗
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 font-sans">
                
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

                {/* 2. Hackatime Project Auto-Suggestion */}
                <div className="bg-[#fffdf5] p-4 rounded-md border-2 border-[#181926] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-pixel text-xs font-bold text-[#181926] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#181926]" />
                      <span>Link Hackatime Project (Coding Hours) *</span>
                    </label>
                    <a
                      href="https://hackatime.hackclub.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-pixel text-[10px] text-[#ec3750] underline"
                    >
                      hackatime.hackclub.com ↗
                    </a>
                  </div>

                  {loadingProjects && projects.length === 0 ? (
                    <div className="p-3 bg-white border border-[#181926]/20 rounded text-xs font-pixel text-gray-500 animate-pulse flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                      <span>Scanning your Hackatime projects ({projects.length} loaded)...</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <select
                        value={selectedCustom ? "__CUSTOM__" : formData.hackatimeProject}
                        onChange={(e) => handleSelectProject(e.target.value)}
                        className="w-full p-2.5 bg-white border-2 border-[#181926] rounded-md font-mono text-sm outline-none cursor-pointer"
                      >
                        {projects.length === 0 && (
                          <option value="" disabled>-- No Hackatime projects found yet --</option>
                        )}
                        {projects.map((p) => (
                          <option key={p.name} value={p.name}>
                            [Folder] {p.name} ({p.hours} hrs tracked) {p.hours >= 10 ? "★ Seed Eligible" : ""}
                          </option>
                        ))}
                        <option value="__CUSTOM__">+ Enter custom project folder name...</option>
                      </select>

                      {selectedCustom && (
                        <input
                          type="text"
                          placeholder="Type exact folder name from your editor..."
                          value={formData.hackatimeProject}
                          onChange={(e) => setFormData({ ...formData, hackatimeProject: e.target.value })}
                          className="w-full p-2.5 bg-white border border-[#181926] rounded text-sm font-mono outline-none"
                        />
                      )}

                      {formData.verifiedHours > 0 && (
                        <div className="flex items-center gap-2 pt-1 font-pixel text-xs">
                          <span className="bg-[#e6f4ea] text-[#137333] px-2.5 py-1 rounded-full border border-[#137333]/30 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> {formData.verifiedHours} Hours Verified on Hackatime
                          </span>
                          {formData.verifiedHours >= 10 ? (
                            <span className="text-[#10b981] font-bold flex items-center gap-1">
                              <Check className="w-3 h-3" /> 10h Milestone Hit!
                            </span>
                          ) : (
                            <span className="text-gray-500">(10+ hrs recommended for seed grant)</span>
                          )}
                        </div>
                      )}

                      {/* Manual username/ID lookup */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => setShowCustomLookup(!showCustomLookup)}
                          className="font-pixel text-[11px] text-gray-500 hover:text-[#ec3750] underline cursor-pointer"
                        >
                          {showCustomLookup ? "Hide lookup tool" : "Using a different Hackatime username or ID?"}
                        </button>

                        {showCustomLookup && (
                          <div className="mt-2 flex gap-2">
                            <input
                              type="text"
                              placeholder="Enter Hackatime username or ID (e.g. kpk22128 or 67074)"
                              value={customLookupId}
                              onChange={(e) => setCustomLookupId(e.target.value)}
                              className="flex-1 p-2 bg-white border border-[#181926] rounded text-xs font-mono outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => fetchHackatimeProjects(customLookupId)}
                              disabled={loadingProjects}
                              className="bg-[#ffe066] border border-[#181926] px-3 py-1.5 rounded font-pixel text-xs hover:bg-[#ffd633]"
                            >
                              {loadingProjects ? "Loading..." : "Sync Projects"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Description */}
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

                {/* 4. GitHub Repository */}
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

                {/* 5. Demo URL */}
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

                {/* 6. Screenshots Section (Max 5 Images with Supabase Storage) */}
                <div className="bg-[#faf9f5] p-5 rounded-md border-2 border-[#181926] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#181926]/15 pb-2">
                    <div>
                      <label className="block font-pixel text-xs font-bold text-[#181926] flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Screenshots of Project Working *</span>
                      </label>
                      <span className="font-doodle text-xs text-gray-500">
                        Upload proof of your working project (Max 5 images). Stored in Supabase.
                      </span>
                    </div>
                    <div className="font-pixel text-xs">
                      <span className={`px-2 py-0.5 rounded font-bold border ${
                        screenshots.length >= 5
                          ? "bg-[#e6f4ea] text-[#137333] border-[#137333]"
                          : screenshots.length > 0
                          ? "bg-[#fffdf5] text-[#181926] border-[#181926]"
                          : "bg-[#fee2e2] text-[#ec3750] border-[#ec3750]"
                      }`}>
                        {screenshots.length} / 5 Images
                      </span>
                    </div>
                  </div>

                  {uploadError && (
                    <div className="bg-[#fee2e2] border border-[#ec3750] text-[#ec3750] px-3 py-2 rounded font-pixel text-xs flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {/* File Upload Drop Area */}
                  {screenshots.length < 5 ? (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                        multiple
                        onChange={handleFilesUpload}
                        disabled={isUploading}
                        className="hidden"
                        id="screenshot-file-input"
                      />
                      <label
                        htmlFor="screenshot-file-input"
                        className={`w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#181926] rounded-md bg-white cursor-pointer hover:bg-[#fffdf5] transition ${
                          isUploading ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                      >
                        <ImageIcon className="w-8 h-8 mb-1 text-gray-500" />
                        <span className="font-pixel text-xs font-bold text-[#181926]">
                          {isUploading ? "Uploading Image to Storage..." : "Click to Browse or Drag & Drop Images"}
                        </span>
                        <span className="font-doodle text-xs text-gray-500 mt-1">
                          PNG, JPG, WEBP, or GIF up to 5MB (Slot for {5 - screenshots.length} more)
                        </span>
                      </label>
                    </div>
                  ) : (
                    <div className="bg-[#e6f4ea] border-2 border-[#137333] text-[#137333] p-3 rounded text-center font-pixel text-xs font-bold flex items-center justify-center gap-1.5">
                      <Check className="w-4 h-4" />
                      <span>Maximum 5 screenshots attached! You can remove any image below to replace it.</span>
                    </div>
                  )}

                  {/* Uploaded Images Preview Grid */}
                  {screenshots.length > 0 && (
                    <div className="space-y-2">
                      <div className="font-pixel text-[11px] text-gray-600 font-bold uppercase tracking-wider">
                        Attached Images ({screenshots.length}):
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {screenshots.map((url, idx) => (
                          <div
                            key={idx}
                            className="relative group bg-white border-2 border-[#181926] rounded-md overflow-hidden shadow-[2px_2px_0px_#181926]"
                          >
                            <img
                              src={url}
                              alt={`Upload ${idx + 1}`}
                              className="w-full h-24 object-cover"
                            />
                            <span className="absolute bottom-1 left-1 bg-[#181926] text-white px-1.5 py-0.5 rounded text-[9px] font-pixel">
                              #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveScreenshot(idx)}
                              className="absolute top-1 right-1 bg-[#ec3750] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold hover:scale-110 transition shadow"
                              title="Remove image"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Or Add Via URL */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="font-pixel text-[11px] text-gray-500 hover:text-[#ec3750] underline cursor-pointer inline-flex items-center gap-1"
                    >
                      <LinkIcon className="w-3 h-3" />
                      <span>{showUrlInput ? "Hide URL input" : "Or paste direct image URL (Imgur, Scrapbook, Slack)"}</span>
                    </button>

                    {showUrlInput && (
                      <div className="mt-2 flex gap-2">
                        <input
                          type="url"
                          placeholder="https://scrapbook.hackclub.com/... or https://i.imgur.com/..."
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          disabled={screenshots.length >= 5}
                          className="flex-1 p-2 bg-white border border-[#181926] rounded text-xs font-mono outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddUrlScreenshot}
                          disabled={screenshots.length >= 5 || !urlInput.trim()}
                          className="bg-[#ffe066] border border-[#181926] px-3 py-1.5 rounded font-pixel text-xs hover:bg-[#ffd633] disabled:opacity-50"
                        >
                          + Add Image
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 7. Use of AI */}
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
                    disabled={isSubmitting || isUploading}
                    className="fortune-btn fortune-btn-gold w-full text-base py-3.5 disabled:opacity-50"
                  >
                    {isSubmitting ? "Shipping Project to Review..." : "Ship Project to Review"}
                  </button>
                </div>

              </form>
            )}

          </div>
        )}

      </div>

      {/* Custom Delete Confirmation Modal (Replaces browser confirm/alert) */}
      {deleteModal.isOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget && !deleteModal.isDeleting) {
              closeDeleteModal();
            }
          }}
          className="fixed inset-0 z-50 bg-[#181926]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="wobbly-card bg-[#fffdf5] border-4 border-[#181926] shadow-[8px_8px_0px_#181926] max-w-md w-full p-6 space-y-4 relative">
            <button
              onClick={closeDeleteModal}
              disabled={deleteModal.isDeleting}
              className="absolute top-4 right-4 text-gray-500 hover:text-[#ec3750] font-pixel text-base font-bold disabled:opacity-50"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 border-b-2 border-dashed border-[#181926]/20 pb-3">
              <div className="w-10 h-10 bg-[#fee2e2] rounded-lg border border-[#ec3750] flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-[#ec3750]" />
              </div>
              <div>
                <h3 className="text-xl font-black font-sans text-[#181926]">
                  Delete Submission?
                </h3>
                <p className="font-pixel text-[11px] text-gray-500 mt-0.5">
                  Project: <strong className="text-[#ec3750]">{deleteModal.projectTitle}</strong>
                </p>
              </div>
            </div>

            {deleteModal.error ? (
              <div className="bg-[#fee2e2] text-[#ec3750] border-2 border-[#ec3750] p-3 rounded font-pixel text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{deleteModal.error}</span>
              </div>
            ) : (
              <div className="space-y-2 font-sans text-xs text-[#4a4e66]">
                <p>
                  Are you sure you want to permanently delete your submission for{" "}
                  <strong className="text-[#181926]">&ldquo;{deleteModal.projectTitle}&rdquo;</strong>?
                </p>
                <div className="bg-[#fff1f2] border border-[#ec3750]/30 p-2.5 rounded text-[11px] text-[#991b1b] flex items-start gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-[#ec3750] mt-0.5" />
                  <span><strong>Action cannot be undone:</strong> This will erase the database record and permanently delete all attached screenshot images from cloud storage.</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#181926]/10 font-pixel text-xs">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleteModal.isDeleting}
                className="bg-white border border-[#181926] px-3.5 py-1.5 rounded hover:bg-gray-100 disabled:opacity-50 transition"
              >
                {deleteModal.error ? "Close" : "Cancel"}
              </button>
              {!deleteModal.error && (
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleteModal.isDeleting}
                  className="bg-[#ec3750] text-white hover:bg-[#d62839] border border-[#181926] px-4 py-1.5 rounded font-bold shadow-[2px_2px_0px_#181926] transition disabled:opacity-50"
                >
                  {deleteModal.isDeleting ? "Erasing Data..." : "Yes, Permanently Delete"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
