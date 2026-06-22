"use client";

import { useEffect, useState, useMemo } from "react";
import { Calendar, Clock, Check, Search, X, Star } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import ParentReviewForm from "@/components/ParentReviewForm";
import ReportIssueForm from "@/components/ReportIssueForm";
import ParentSidebar from "@/components/ParentSidebar";
import sitter1 from "@/assets/sitter1.png";

const STATUS_FILTERS = [
  { key: "all",           label: "All" },
  { key: "pending_sitter", label: "Pending" },
  { key: "confirmed",     label: "Confirmed" },
  { key: "completed",     label: "Completed" },
  { key: "declined",      label: "Declined" },
];

const STATUS_BADGE = {
  confirmed:      { label: "Confirmed",       cls: "bg-teal-50 text-teal-600" },
  pending_sitter: { label: "Awaiting sitter",  cls: "bg-yellow-50 text-yellow-700" },
  declined:       { label: "Declined",         cls: "bg-red-50 text-red-500" },
  cancelled:      { label: "Cancelled",        cls: "bg-gray-100 text-gray-500" },
  completed:      { label: "Completed",        cls: "bg-purple-50 text-purple-600" },
};

export default function AllBookingsPage() {
  const [sessions, setSessions]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [reviewedSet, setReviewedSet]     = useState(new Set());
  const [reviewRatings, setReviewRatings] = useState({}); // Map of booking_id to session_rating
  const [markingComplete, setMarkingComplete] = useState(null);
  const [statusFilter, setStatusFilter]   = useState("all");
  const [search, setSearch]               = useState("");
  const [reportOpen, setReportOpen]       = useState(null); // booking ID with report form open

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const [bookingRes, reviewRows] = await Promise.all([
          fetch(`/api/booking?parentId=${user.id}`),
          supabase
            .from("reviews")
            .select("booking_id, session_rating")
            .eq("reviewer_id", user.id)
            .eq("reviewer_role", "parent"),
        ]);

        const bookingData = await bookingRes.json();

        if (bookingRes.ok) {
          const bookings = bookingData.bookings || [];
          const mapped = bookings
            .map((b) => {
              const [startH, startM] = b.start_time.split(":").map(Number);
              const [endH,   endM]   = b.end_time.split(":").map(Number);
              const hours = ((endH * 60 + endM) - (startH * 60 + startM)) / 60;
              const fmt = (h, m) => {
                const suffix = h >= 12 ? "PM" : "AM";
                return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${suffix}`;
              };
              const firstChild = Array.isArray(b.children) ? b.children[0] : null;
              const sitterName   = b.sitter_profile?.user?.name || "Your Sitter";
              const sitterAvatar = b.sitter_profile?.user?.avatar || sitter1;
              const deadline = b.created_at
                ? new Date(new Date(b.created_at).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
                : null;
              return {
                id:     b.id,
                status: b.status,
                rawDate: b.date,
                date:   new Date(b.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                time:   `${fmt(startH, startM)} – ${fmt(endH, endM)}`,
                hours:  Math.round(hours * 10) / 10,
                child:  firstChild ? `${firstChild.name} (${firstChild.age})` : "Child",
                adventure: b.adventure_id || "Not specified",
                sitter: { name: sitterName, avatar: sitterAvatar },
                parentMarkedComplete: b.parent_marked_complete ?? false,
                sitterMarkedComplete: b.sitter_marked_complete ?? false,
                reviewWindowOpen: deadline ? new Date() < new Date(deadline) : true,
                deadline,
              };
            })
            .sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
          setSessions(mapped);
        }

        if (!reviewRows.error) {
          const reviewed = new Set();
          const ratings = {};
          (reviewRows.data || []).forEach((r) => {
            reviewed.add(r.booking_id);
            ratings[r.booking_id] = r.session_rating;
          });
          setReviewedSet(reviewed);
          setReviewRatings(ratings);
        }
      } catch {}
      setLoading(false);
    }
    fetchData();
  }, []);

  async function handleMarkComplete(bookingId) {
    setMarkingComplete(bookingId);
    try {
      const res = await fetch(`/api/booking/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_complete" }),
      });
      const data = await res.json();
      if (res.ok) {
        setSessions((prev) =>
          prev.map((s) =>
            s.id === bookingId
              ? {
                  ...s,
                  status: data.booking.status,
                  parentMarkedComplete: data.booking.parent_marked_complete ?? true,
                  sitterMarkedComplete: data.booking.sitter_marked_complete ?? s.sitterMarkedComplete,
                }
              : s,
          ),
        );
      }
    } catch {}
    setMarkingComplete(null);
  }

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      const matchSearch =
        !search || s.sitter.name.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [sessions, statusFilter, search]);

  return (
    <ParentSidebar>
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          {sessions.length > 0 && (
            <span className="text-sm text-gray-400 font-normal">
              ({sessions.length})
            </span>
          )}
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Status pills */}
            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setStatusFilter(f.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    statusFilter === f.key
                      ? "bg-[#ff6b6b] text-white border-[#ff6b6b]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#ff6b6b] hover:text-[#ff6b6b]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative sm:ml-auto sm:w-52">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search sitter…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#ff6b6b] focus:bg-white transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bookings list */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-[#ff6b6b] rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-12 text-center">
            <p className="text-gray-400 text-sm">
              {sessions.length === 0 ? (
                <>No bookings yet.{" "}<a href="/search" className="text-[#ff6b6b] hover:underline">Find a sitter →</a></>
              ) : (
                "No bookings match your filter."
              )}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((session) => {
              const badge = STATUS_BADGE[session.status] ?? {
                label: session.status,
                cls: "bg-gray-100 text-gray-500",
              };
              return (
                <div
                  key={session.id}
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
                >
                  {/* Sitter header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                        <Image
                          src={session.sitter.avatar}
                          alt={session.sitter.name}
                          fill
                          className="object-cover"
                          unoptimized={
                            typeof session.sitter.avatar === "string" &&
                            session.sitter.avatar.startsWith("http")
                          }
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm leading-tight">
                          {session.sitter.name}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {session.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {session.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Child */}
                  <p className="text-sm text-gray-500 mb-3">
                    For <span className="font-semibold text-gray-800">{session.child}</span>
                  </p>

                  {/* Micro-adventure */}
                  <div className="bg-yellow-50 text-yellow-800 px-4 py-2.5 rounded-xl text-sm font-medium border border-yellow-100">
                    <span className="font-bold">Micro-Adventure:</span> {session.adventure}
                  </div>

                  {/* Confirmed: mark complete */}
                  {session.status === "confirmed" && (
                    <div className="mt-4">
                      {session.parentMarkedComplete ? (
                        <p className="text-sm text-center text-gray-500 py-2.5 bg-gray-50 rounded-xl border border-gray-100">
                          ✓ You marked this complete — waiting for the sitter to confirm.
                        </p>
                      ) : (
                        <button
                          onClick={() => handleMarkComplete(session.id)}
                          disabled={markingComplete === session.id}
                          className="w-full py-2.5 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed text-sm"
                        >
                          {markingComplete === session.id
                            ? "Marking…"
                            : "Mark Session as Complete"}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Completed: review & report */}
                  {session.status === "completed" && (
                    <div className="mt-4 space-y-3">
                      {/* Review section */}
                      <div>
                        {reviewedSet.has(session.id) ? (
                          <div className="flex items-center justify-between gap-3 py-2.5 px-3 bg-teal-50 rounded-xl border border-teal-100">
                            <div className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-teal-500" />
                              <span className="text-sm text-teal-600 font-medium">
                                Review submitted ✓
                              </span>
                            </div>
                            {reviewRatings[session.id] && (
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((n) => (
                                  <Star
                                    key={n}
                                    className={`w-4 h-4 ${n <= reviewRatings[session.id] ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <ParentReviewForm
                            booking={{
                              id: session.id,
                              date: session.date,
                              hours: session.hours,
                            }}
                            sitterName={session.sitter.name}
                            onSubmitted={() => {
                              setReviewedSet((prev) => new Set([...prev, session.id]));
                              // Fetch the rating from the database
                              fetch(`/api/reviews?bookingId=${session.id}`)
                                .then((res) => res.json())
                                .then((data) => {
                                  if (data.reviews && data.reviews.length > 0) {
                                    setReviewRatings((prev) => ({
                                      ...prev,
                                      [session.id]: data.reviews[0].rating,
                                    }));
                                  }
                                })
                                .catch(() => {});
                            }}
                          />
                        )}
                      </div>

                      {/* Report section */}
                      {reportOpen === session.id ? (
                        <ReportIssueForm
                          bookingId={session.id}
                          onSubmitted={() => setReportOpen(null)}
                          onCancel={() => setReportOpen(null)}
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => setReportOpen(session.id)}
                          className="w-full py-2.5 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors cursor-pointer"
                        >
                          Report an issue
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
    </ParentSidebar>
  );
}
