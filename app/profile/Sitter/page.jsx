"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  Calendar,
  Star,
  Users,
  MessageCircle,
  Settings,
  TrendingUp,
  Clock,
  MapPin,
  CheckCircle,
  Circle,
  Lightbulb,
  Check,
  X,
} from "lucide-react";
import Link from "next/link";
import WelcomeBanner from "@/components/ui/welcomebanner";
import { createClient } from "@/lib/supabase/client";
import SitterFeedbackForm from "@/components/SitterFeedbackForm";

function SessionCard({
  session,
  feedbackDone: initialFeedbackDone,
  reviewWindowOpen = true,
  onFeedbackSubmit,
}) {
  const [status, setStatus] = useState(session.status);
  const [loading, setLoading] = useState(null); // 'accept' | 'decline' | 'complete' | null
  const [sitterMarkedComplete, setSitterMarkedComplete] = useState(
    session.sitterMarkedComplete ?? false,
  );
  const [feedbackDone, setFeedbackDone] = useState(
    initialFeedbackDone ?? false,
  );
  const [actionError, setActionError] = useState(null);

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
        setActionError(json.error || "Failed to update booking");
        return;
      }
      setStatus(action === "accept" ? "confirmed" : "declined");
    } catch {
      setActionError("Something went wrong. Please try again.");
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
  const isDeclined = status === "declined";

  const statusStyles = {
    confirmed: { cls: "bg-teal-50 text-teal-600", label: "Confirmed" },
    declined: { cls: "bg-red-50 text-red-500", label: "Declined" },
    pending_sitter: {
      cls: "bg-yellow-50 text-yellow-700",
      label: "Awaiting your response",
    },
    pending: {
      cls: "bg-yellow-50 text-yellow-700",
      label: "Awaiting your response",
    },
  };
  const badge = statusStyles[status] ?? {
    cls: "bg-gray-100 text-gray-500",
    label: status,
  };

  return (
    <div
      className={`border border-gray-100 rounded-2xl overflow-hidden ${isDeclined ? "opacity-60" : ""}`}
    >
      {/* Header: parent info + status */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#ff6b6b]/10 flex items-center justify-center text-[#ff6b6b] font-bold text-base shrink-0">
            {session.parent.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-gray-900">{session.parent.name}</p>
            <p className="text-xs text-gray-500">
              {session.parent.email} · {session.parent.phone}
            </p>
          </div>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${badge.cls}`}
        >
          {badge.label}
        </span>
      </div>

      {/* Body */}
      <div className="px-6 py-4 bg-gray-50/50 space-y-4">
        {/* Child info */}
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Users className="w-4 h-4 text-gray-400 shrink-0" />
          <span>
            <span className="font-semibold">{session.child.name}</span>
            {" · "}Age {session.child.age}
            {" · "}
            <span className="text-gray-500">{session.child.needs}</span>
          </span>
        </div>

        {/* Session details */}
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{session.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{session.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span>
              ${session.hourlyRate}/hr · {session.hours} hrs
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{session.address}</span>
          </div>
        </div>

        {/* Micro-adventure */}
        <div className="bg-yellow-50 text-yellow-800 px-4 py-3 rounded-xl text-sm font-medium border border-yellow-100">
          <span className="font-bold">Micro-Adventure:</span>{" "}
          {session.adventure}
        </div>

        {/* Parent notes */}
        {session.notes && (
          <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-600">
            <span className="font-semibold text-gray-700">
              Note from parent:{" "}
            </span>
            {session.notes}
          </div>
        )}

        {/* Actions */}
        {actionError && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2 text-center">
            {actionError}
          </p>
        )}
        {isPending ? (
          <div className="flex gap-3 pt-1">
            <button
              onClick={() => handleAction("accept")}
              disabled={!!loading}
              className="flex-1 py-3 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              {loading === "accept" ? "Accepting…" : "Accept Booking"}
            </button>
            <button
              onClick={() => handleAction("decline")}
              disabled={!!loading}
              className="flex-1 py-3 border border-red-300 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              {loading === "decline" ? "Declining…" : "Decline"}
            </button>
          </div>
        ) : status === "confirmed" ? (
          <div className="pt-1">
            {sitterMarkedComplete ? (
              <p className="text-sm text-center text-gray-500 py-2 bg-gray-50 rounded-xl border border-gray-100">
                ✓ You marked this complete — waiting for the parent to confirm.
              </p>
            ) : (
              <button
                onClick={handleMarkComplete}
                disabled={loading === "complete"}
                className="w-full py-3 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600 transition-colors disabled:opacity-50"
              >
                {loading === "complete"
                  ? "Marking…"
                  : "Mark Session as Complete"}
              </button>
            )}
          </div>
        ) : status === "completed" ? (
          <div className="pt-1">
            {feedbackDone ? (
              <div className="flex items-center justify-center gap-2 py-2.5 bg-teal-50 rounded-xl border border-teal-100">
                <Check className="w-4 h-4 text-teal-500" />
                <span className="text-sm text-teal-600 font-medium">
                  Feedback submitted ✓
                </span>
              </div>
            ) : !reviewWindowOpen ? (
              <p className="text-xs text-center text-gray-400 py-2 bg-gray-50 rounded-xl border border-gray-100">
                Feedback window closed — must be submitted within 7 days of
                session completion.
              </p>
            ) : (
              <SitterFeedbackForm
                booking={{
                  id: session.id,
                  date: session.date,
                  hours: session.hours,
                  deadline: session.deadline,
                }}
                familyName={session.parent.name}
                onSubmitted={() => {
                  setFeedbackDone(true);
                  onFeedbackSubmit?.(session.id);
                }}
              />
            )}
          </div>
        ) : (
          <div className="flex gap-3 pt-1">
            <button className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors cursor-pointer">
              View Details
            </button>
            {!isDeclined && (
              <button className="flex-1 py-3 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 transition-colors cursor-pointer">
                Get Directions
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SitterDashboard() {
  const [sitterProfile, setSitterProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [feedbackBookingIds, setFeedbackBookingIds] = useState(new Set());
  const [recentReviews, setRecentReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [overallRating, setOverallRating] = useState(null);
  const [totalReviews, setTotalReviews] = useState(0);

  // Fetch the real logged-in sitter's identity
  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const name = user.user_metadata?.name || "Sitter";

        const { data: profile } = await supabase
          .from("sitter_profiles")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (profile)
          setSitterProfile({ id: profile.id, name, userId: user.id });
      } finally {
        setLoadingProfile(false);
      }
    }
    loadProfile();
  }, []);

  // Fetch real bookings once we have the sitter's profile ID
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

  // Fetch which bookings this sitter has already given feedback for
  useEffect(() => {
    if (!sitterProfile?.userId) return;
    async function fetchFeedback() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("reviews")
          .select("booking_id")
          .eq("sitter_id", sitterProfile.userId)
          .eq("reviewer_type", "sitter");
        if (data) setFeedbackBookingIds(new Set(data.map((r) => r.booking_id)));
      } catch {}
    }
    fetchFeedback();
  }, [sitterProfile?.userId]);

  // Fetch real parent reviews for this sitter
  useEffect(() => {
    if (!sitterProfile?.userId) return;
    async function fetchReviews() {
      setLoadingReviews(true);
      try {
        const res = await fetch(`/api/reviews/sitter/${sitterProfile.userId}`);
        const data = await res.json();
        if (res.ok) {
          setRecentReviews(data.reviews || []);
          setOverallRating(data.overall_rating);
          setTotalReviews(data.total_reviews || 0);
        }
      } catch {}
      setLoadingReviews(false);
    }
    fetchReviews();
  }, [sitterProfile?.userId]);

  const stats = [
    {
      icon: DollarSign,
      value: "$1,240",
      label: "This Month's Earnings",
      color: "bg-red-50 text-[#ff6b6b]",
      trend: TrendingUp,
      trendColor: "text-teal-500",
    },
    {
      icon: Calendar,
      value: "127",
      label: "Total Sessions",
      color: "bg-teal-50 text-teal-500",
    },
    {
      icon: Star,
      value: overallRating != null ? overallRating.toFixed(1) : "—",
      label: `Average Rating${totalReviews > 0 ? ` (${totalReviews})` : ""}`,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      icon: Users,
      value: "45",
      label: "Active Families",
      color: "bg-red-50 text-[#ff6b6b]",
    },
  ];

  const quickActions = [
    {
      icon: Calendar,
      label: "My Schedule",
      desc: "View availability",
      color: "bg-teal-50 text-teal-500",
      href: "/sitter/schedule",
    },
    {
      icon: MessageCircle,
      label: "Messages",
      desc: "Chat with families",
      color: "bg-yellow-50 text-yellow-600",
      href: "/messages",
    },
    {
      icon: DollarSign,
      label: "Earnings",
      desc: "Payment history",
      color: "bg-red-50 text-[#ff6b6b]",
      href: "/sitter/earnings",
    },
    {
      icon: Settings,
      label: "Profile",
      desc: "Edit your profile",
      color: "bg-purple-50 text-purple-500",
      href: "/sitter/profile",
    },
  ];

  const profileCompletion = {
    percentage: 85,
    items: [
      { label: "Background check verified", completed: true },
      { label: "Profile photo uploaded", completed: true },
      { label: "Add more certifications", completed: false },
    ],
  };

  const earnings = {
    thisWeek: 320,
    completedSessions: 1140,
    tipsReceived: 100,
    totalThisMonth: 1240,
  };

  const monthlyStats = {
    sessions: {
      completed: 18,
      icon: Calendar,
      color: "bg-teal-50 text-teal-500",
    },
    adventures: {
      facilitated: 14,
      icon: Lightbulb,
      color: "bg-yellow-50 text-yellow-600",
    },
    reviews: { count: 5, icon: Star, color: "bg-red-50 text-[#ff6b6b]" },
  };

  const topSkills = [
    { name: "Empathy Building", sessions: 45, color: "bg-[#ff6b6b]" },
    { name: "Problem Solving", sessions: 38, color: "bg-teal-500" },
    { name: "Creative Expression", sessions: 32, color: "bg-yellow-500" },
  ];

  // Map raw DB bookings → shape SessionCard expects
  const upcomingSessions = bookings.map((b) => {
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
      date: new Date(b.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: `${fmt(startH, startM)} – ${fmt(endH, endM)}`,
      hourlyRate: hours > 0 ? Math.round(b.total_amount / hours) : 0,
      hours,
      adventure: b.adventure_id || "Not specified",
      parent: {
        name: b.parent?.name || "Parent",
        email: b.parent?.email || "",
        phone: "",
        avatar: b.parent?.avatar || null,
      },
      child: firstChild
        ? {
            name: firstChild.name,
            age: firstChild.age,
            needs: firstChild.special_needs?.join(", ") || "None specified",
          }
        : { name: "Child", age: "—", needs: "" },
      address: "",
      notes: b.notes || "",
      parentMarkedComplete: b.parent_marked_complete ?? false,
      sitterMarkedComplete: b.sitter_marked_complete ?? false,
      deadline: b.created_at
        ? new Date(
            new Date(b.created_at).getTime() + 7 * 24 * 60 * 60 * 1000,
          ).toISOString()
        : null,
      reviewWindowOpen: b.created_at
        ? (Date.now() - new Date(b.created_at).getTime()) /
            (1000 * 60 * 60 * 24) <=
          7
        : true,
    };
  });

  if (loadingProfile) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <WelcomeBanner
        userName={sitterProfile?.name}
        sessionCount={upcomingSessions.length}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              {stat.trend && (
                <stat.trend className={`w-5 h-5 ${stat.trendColor}`} />
              )}
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center group"
          >
            <div
              className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
            >
              <action.icon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">{action.label}</h3>
            <p className="text-xs text-gray-500">{action.desc}</p>
          </Link>
        ))}
      </div>

      {/* Main Content - Upcoming Sessions + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Upcoming Sessions + Reviews */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">My Sessions</h2>
              <Link
                href="/sitter/sessions"
                className="text-teal-500 hover:text-teal-600 text-sm font-semibold hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="space-y-6">
              {loadingBookings ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
                </div>
              ) : upcomingSessions.length === 0 ? (
                <p className="text-center text-gray-400 py-8 text-sm">
                  No bookings yet.
                </p>
              ) : (
                upcomingSessions.map((session) => (
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

          {/* Recent Reviews */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Recent Reviews
            </h2>
            {loadingReviews ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
              </div>
            ) : recentReviews.length === 0 ? (
              <p className="text-center text-gray-400 py-6 text-sm">
                No reviews yet.
              </p>
            ) : (
              <div className="space-y-6">
                {recentReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-gray-900">
                        {review.reviewer_name || "Parent"}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </span>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`w-5 h-5 ${n <= review.session_rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                        />
                      ))}
                    </div>
                    {review.review_text && (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {review.review_text}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Sidebar Widgets */}
        <div className="lg:col-span-1 space-y-8">
          {/* Profile Completion */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Profile Completion
            </h2>
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-gray-700">
                  {profileCompletion.percentage}% Complete
                </span>
                <span className="text-teal-500 font-semibold">
                  Almost there!
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletion.percentage}%` }}
                />
              </div>
            </div>
            <div className="space-y-3">
              {profileCompletion.items.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  {item.completed ? (
                    <CheckCircle className="w-5 h-5 text-teal-500 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 shrink-0" />
                  )}
                  <span
                    className={`text-sm ${item.completed ? "text-gray-700" : "text-gray-500"}`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Earnings Breakdown */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Earnings Breakdown
            </h2>
            <div className="bg-red-50 p-4 rounded-2xl mb-6">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-red-600 font-medium">This Week</p>
                <TrendingUp className="w-4 h-4 text-red-500" />
              </div>
              <p className="text-3xl font-bold text-red-600">
                ${earnings.thisWeek}
              </p>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Completed Sessions</span>
                <span className="font-semibold text-gray-900">
                  ${earnings.completedSessions}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tips Received</span>
                <span className="font-semibold text-gray-900">
                  ${earnings.tipsReceived}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">
                    Total This Month
                  </span>
                  <span className="font-bold text-red-600 text-lg">
                    ${earnings.totalThisMonth}
                  </span>
                </div>
              </div>
            </div>
            <Link
              href="/sitter/earnings/request"
              className="w-full py-3 border border-red-500 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-colors flex items-center justify-center"
            >
              Request Payout
            </Link>
          </div>

          {/* This Month Stats */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">This Month</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-xl ${monthlyStats.sessions.color} flex items-center justify-center shrink-0`}
                >
                  <monthlyStats.sessions.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Sessions</p>
                  <p className="font-bold text-gray-900">
                    {monthlyStats.sessions.completed} completed
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-xl ${monthlyStats.adventures.color} flex items-center justify-center shrink-0`}
                >
                  <monthlyStats.adventures.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Adventures</p>
                  <p className="font-bold text-gray-900">
                    {monthlyStats.adventures.facilitated} facilitated
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-xl ${monthlyStats.reviews.color} flex items-center justify-center shrink-0`}
                >
                  <monthlyStats.reviews.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">New Reviews</p>
                  <p className="font-bold text-gray-900">
                    {monthlyStats.reviews.count} this month
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Skills */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Top Skills</h2>
            <div className="space-y-4">
              {topSkills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-gray-900">
                      {skill.name}
                    </span>
                    <span className="text-gray-500">
                      {skill.sessions} sessions
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${skill.color} rounded-full`}
                      style={{ width: `${(skill.sessions / 45) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
