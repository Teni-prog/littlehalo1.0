"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  ChevronDown,
  Search,
  Clock,
  DollarSign,
  MapPin,
  CheckCircle,
  Circle,
  Check,
  X,
  Star,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import SitterSidebar from "@/components/SitterSidebar";
import { createClient } from "@/lib/supabase/client";
import SitterFeedbackForm from "@/components/SitterFeedbackForm";
import ReportIssueForm from "@/components/ReportIssueForm";

function SessionCard({
  session,
  feedbackDone: initialFeedbackDone,
  reviewWindowOpen = true,
  onFeedbackSubmit,
}) {
  const t = useTranslations("sessionsSitter");
  const [status, setStatus] = useState(session.status);
  const [loading, setLoading] = useState(null);
  const [sitterMarkedComplete, setSitterMarkedComplete] = useState(
    session.sitterMarkedComplete ?? false,
  );
  const [feedbackDone, setFeedbackDone] = useState(initialFeedbackDone ?? false);
  const [actionError, setActionError] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(null);
  const [loadingReview, setLoadingReview] = useState(false);

  // Fetch review rating if feedback already submitted
  useEffect(() => {
    if (!feedbackDone || status !== "completed") return;

    async function fetchReviewRating() {
      setLoadingReview(true);
      try {
        const supabase = createClient();
        const { data: review } = await supabase
          .from("reviews")
          .select("session_rating")
          .eq("booking_id", session.id)
          .eq("reviewer_role", "sitter")
          .single();

        if (review) {
          setReviewRating(review.session_rating);
        }
      } catch {}
      setLoadingReview(false);
    }

    fetchReviewRating();
  }, [feedbackDone, status, session.id]);

  async function handleAction(action) {
    setLoading(action);
    setActionError(null);
    try {
      const res = await fetch(`/api/booking/${session.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: action === "accept" ? "confirmed" : "declined",
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setActionError(json.error || t("card.errors.updateFailed"));
        return;
      }
      setStatus(action === "accept" ? "confirmed" : "declined");
    } catch {
      setActionError(t("card.errors.generic"));
    } finally {
      setLoading(null);
    }
  }

  async function handleMarkComplete() {
    setLoading("complete");
    try {
      const res = await fetch(`/api/booking/${session.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_complete" }),
      });
      const data = await res.json();
      if (res.ok) {
        setSitterMarkedComplete(true);
        if (data.booking.status === "completed") setStatus("completed");
      }
    } catch {}
    setLoading(null);
  }

  const isPending = status === "pending_sitter" || status === "pending";
  const isCompleted = status === "completed";

  const statusStyles = {
    confirmed: { cls: "bg-teal-50 text-teal-600", label: t("card.status.confirmed") },
    declined: { cls: "bg-red-50 text-red-500", label: t("card.status.declined") },
    pending_sitter: {
      cls: "bg-yellow-50 text-yellow-700",
      label: t("card.status.pendingSitter"),
    },
    pending: {
      cls: "bg-yellow-50 text-yellow-700",
      label: t("card.status.pending"),
    },
    completed: {
      cls: "bg-green-50 text-green-600",
      label: t("card.status.completed"),
    },
  };
  const badge = statusStyles[status] ?? {
    cls: "bg-gray-50 text-gray-600",
    label: status,
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1.5">
            <h3 className="text-base font-bold text-gray-900">
              {session.parent.name}
            </h3>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${badge.cls}`}>
              {badge.label}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {t("card.childAge", { name: session.child.name, age: session.child.age })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4 text-teal-500" />
          <span>{t("card.dateAt", { date: session.date, time: session.time })}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <DollarSign className="w-4 h-4 text-teal-500" />
          <span>{t("card.sessionRate", { hours: session.hours, rate: session.hourlyRate })}</span>
        </div>
      </div>

      {actionError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl mb-4 text-sm">
          {actionError}
        </div>
      )}

      {/* Pending: Accept / Decline */}
      {isPending && (
        <div className="flex gap-3">
          <button
            onClick={() => handleAction("accept")}
            disabled={loading}
            className="flex-1 bg-teal-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === "accept" ? t("card.accepting") : t("card.accept")}
          </button>
          <button
            onClick={() => handleAction("decline")}
            disabled={loading}
            className="flex-1 bg-red-100 text-red-600 px-4 py-2 rounded-xl font-semibold hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === "decline" ? t("card.declining") : t("card.decline")}
          </button>
        </div>
      )}

      {/* Confirmed: Mark Complete */}
      {status === "confirmed" && (
        sitterMarkedComplete ? (
          <p className="text-sm text-center text-gray-500 py-2 bg-gray-50 rounded-xl border border-gray-100">
            {t("card.markedCompleteWaiting")}
          </p>
        ) : (
          <button
            onClick={handleMarkComplete}
            disabled={loading === "complete"}
            className="w-full bg-teal-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === "complete" ? t("card.markingComplete") : t("card.markComplete")}
          </button>
        )
      )}

      {/* Completed: feedback + report issue */}
      {isCompleted && (
        <div className="space-y-3">
          {feedbackDone ? (
            <div className="flex items-center justify-between gap-3 py-2.5 px-3 bg-teal-50 rounded-xl border border-teal-100">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-500" />
                <span className="text-sm text-teal-600 font-medium">{t("card.feedbackSubmitted")}</span>
              </div>
              {reviewRating && !loadingReview && (
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={`w-4 h-4 ${n <= reviewRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : reviewWindowOpen ? (
            feedbackOpen ? (
              <SitterFeedbackForm
                booking={{ id: session.id, date: session.date, hours: session.hours }}
                familyName={session.parent.name}
                onSubmitted={() => {
                  setFeedbackDone(true);
                  setFeedbackOpen(false);
                  onFeedbackSubmit?.(session.id);
                }}
              />
            ) : (
              <button
                type="button"
                onClick={() => setFeedbackOpen(true)}
                className="w-full bg-teal-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-teal-600 transition-colors"
              >
                {t("card.leaveFeedback")}
              </button>
            )
          ) : null}

          {reportOpen ? (
            <ReportIssueForm
              bookingId={session.id}
              onClose={() => setReportOpen(false)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setReportOpen(true)}
              className="text-red-500 text-sm font-semibold hover:text-red-600 transition-colors"
            >
              {t("card.reportIssue")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function SitterSessionsPage() {
  const t = useTranslations("sessionsSitter");
  const locale = useLocale();
  const dateLocale = locale === "fr" ? "fr-CA" : "en-US";
  const [sitterProfile, setSitterProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [feedbackBookingIds, setFeedbackBookingIds] = useState(new Set());
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Status filter options
  const statusOptions = [
    { value: "all", label: t("filters.status.all") },
    { value: "pending", label: t("filters.status.pending") },
    { value: "confirmed", label: t("filters.status.confirmed") },
    { value: "completed", label: t("filters.status.completed") },
    { value: "declined", label: t("filters.status.declined") },
  ];

  // Load sitter profile
  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const name = user.user_metadata?.name || t("defaults.sitterName");

        const { data: profile } = await supabase
          .from("sitter_profiles")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (profile) {
          setSitterProfile({ id: profile.id, name, userId: user.id });
        }
      } catch {}
    }
    loadProfile();
  }, []);

  // Fetch bookings
  useEffect(() => {
    if (!sitterProfile?.id) return;
    async function fetchBookings() {
      setLoadingBookings(true);
      try {
        const res = await fetch(`/api/booking?sitterId=${sitterProfile.id}`);
        const data = await res.json();
        if (res.ok) setBookings(data.bookings || []);
      } catch {}
      setLoadingBookings(false);
    }
    fetchBookings();
  }, [sitterProfile?.id]);

  // Fetch feedback bookings
  useEffect(() => {
    if (!sitterProfile?.userId) return;
    async function fetchFeedback() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("reviews")
          .select("booking_id")
          .eq("reviewer_id", sitterProfile.userId)
          .eq("reviewer_role", "sitter");
        if (data) setFeedbackBookingIds(new Set(data.map((r) => r.booking_id)));
      } catch {}
    }
    fetchFeedback();
  }, [sitterProfile?.userId]);

  // Map and filter sessions
  const sessions = bookings
    .map((b) => {
      const [startH, startM] = b.start_time.split(":").map(Number);
      const [endH, endM] = b.end_time.split(":").map(Number);
      const hours = (endH * 60 + endM - (startH * 60 + startM)) / 60;
      const fmt = (h, m) => {
        const suffix = h >= 12 ? "PM" : "AM";
        const h12 = h % 12 || 12;
        return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
      };
      const firstChild = Array.isArray(b.children) ? b.children[0] : null;
      return {
        id: b.id,
        status: b.status,
        date: new Date(b.date).toLocaleDateString(dateLocale, {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        time: `${fmt(startH, startM)} – ${fmt(endH, endM)}`,
        hourlyRate: hours > 0 ? Math.round(b.total_amount / hours) : 0,
        hours,
        adventure: b.adventure_name || t("defaults.adventureNotSpecified"),
        parent: {
          name: b.parent?.name || t("defaults.parentName"),
          email: b.parent?.email || "",
        },
        child: firstChild
          ? {
              name: firstChild.name || t("defaults.childName"),
              age: firstChild.age || 0,
            }
          : { name: t("defaults.childName"), age: 0 },
        sitterMarkedComplete: b.sitter_marked_complete || false,
        reviewWindowOpen: true,
      };
    })
    .filter((s) => {
      // Filter by status
      if (statusFilter !== "all") {
        const normalizedStatus = s.status.replace("pending_sitter", "pending");
        if (!normalizedStatus.startsWith(statusFilter)) return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        if (!s.parent.name.toLowerCase().includes(query)) return false;
      }

      return true;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Most recent first

  return (
    <div className="flex justify-center min-h-screen bg-gray-50">
      <SitterSidebar />

      <div className="flex-1 md:ml-64 p-4 pt-20 pb-20 md:p-8 md:pt-8 md:pb-8 items-center">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t("header.title")}
            </h1>
            <p className="text-gray-600">
              {t("header.subtitle")}
            </p>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              {/* Status Filter */}
              <div className="flex-1 ">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t("filters.statusLabel")}
                </label>
                <div className="flex flex-row flex-nowrap gap-2 overflow-x-auto">
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setStatusFilter(opt.value)}
                      className={`px-3 py-1 text-xs font-medium rounded-full border whitespace-nowrap flex-shrink-0 transition-colors ${
                        statusFilter === opt.value
                          ? "bg-teal-500 text-white border-teal-500"
                          : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Bar */}
              <div className="w-full md:w-64 shrink-0">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t("filters.searchLabel")}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t("filters.searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sessions List */}
          <div className="max-w-3xl space-y-3 mt-6">
            {loadingBookings ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <p className="text-gray-500 mb-2">
                  {bookings.length === 0
                    ? t("empty.noSessions")
                    : t("empty.noMatches")}
                </p>
              </div>
            ) : (
              sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  feedbackDone={feedbackBookingIds.has(session.id)}
                  reviewWindowOpen={session.reviewWindowOpen}
                  onFeedbackSubmit={(id) =>
                    setFeedbackBookingIds((prev) => new Set([...prev, id]))
                  }
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
