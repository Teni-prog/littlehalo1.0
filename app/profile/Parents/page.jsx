"use client";

import {
  Search,
  BookOpen,
  MessageCircle,
  CreditCard,
  CalendarCheck,
  Star,
  Heart,
  TrendingUp,
  Calendar,
  Clock,
  Check,
} from "lucide-react";

import Link from "next/link";
import ParentReviewForm from "@/components/ParentReviewForm";
import Image from "next/image";
import WelcomeBanner from "@/components/ui/welcomebanner";
import sitter1 from "@/assets/sitter1.png";
import sitter2 from "@/assets/sitter2.png";
import MyChildren from "@/components/Mychildren";
import ChildProgress from "@/components/Childprogress";
import { useEffect, useState, useMemo } from "react";
import MatchedSitterCard from "@/app/search/matching-button/page";
import ParentPreferences from "../ParentPreferences/page";
import { runTOPSIS, CRITERIA_REGISTRY, DEFAULT_WEIGHTS } from "@/lib/matchingData";
import { createClient } from "@/lib/supabase/client";
import { haversineDistance } from "@/lib/distance";
import dynamic from "next/dynamic";
import ParentSidebar from "@/components/ParentSidebar";

const SitterMapPanel = dynamic(() => import("@/components/SitterMapPanel"), { ssr: false });

const LS_WEIGHTS_KEY = "lh_learned_weights";

export default function ParentDashboard() {
  const [currentParent, setCurrentParent] = useState(null);
  const [children, setChildren] = useState([]);
  const [allSitters, setAllSitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchWeights, setMatchWeights] = useState(DEFAULT_WEIGHTS);
  const [showWeightConfig, setShowWeightConfig] = useState(false);
  const [usingLearnedWeights, setUsingLearnedWeights] = useState(false);
  const [radiusKm, setRadiusKm] = useState(null);

  // Load learned weights from localStorage (set by LearningDemo)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_WEIGHTS_KEY);
      if (saved) {
        setMatchWeights(JSON.parse(saved));
        setUsingLearnedWeights(true);
      }
    } catch {}

    // React when LearningDemo applies new weights in another tab
    function onStorageChange(e) {
      if (e.key === LS_WEIGHTS_KEY) {
        if (e.newValue) {
          setMatchWeights(JSON.parse(e.newValue));
          setUsingLearnedWeights(true);
        } else {
          setMatchWeights(DEFAULT_WEIGHTS);
          setUsingLearnedWeights(false);
        }
      }
    }
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  // Fetch real user data from Supabase
  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient();

        // Get logged-in user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch parent profile from users table
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        // Fetch children from children table
        const { data: childRows } = await supabase
          .from("children")
          .select("*")
          .eq("parent_id", user.id);

        if (childRows) setChildren(childRows);

        // Set parent profile + derived special_needs in one update.
        // Fall back to auth metadata if the users row is missing (e.g. signup
        // completed auth but the DB insert failed before the migration ran).
        const allNeeds = [...new Set((childRows || []).flatMap(c => c.special_needs || []))];
        setCurrentParent({
          ...(profile || {}),
          name: profile?.name || user.user_metadata?.name || "Parent",
          email: profile?.email || user.email,
          special_needs: allNeeds.length ? allNeeds.join(", ") : null,
        });

        // Fetch sitters for TOPSIS
        const res = await fetch("/api/sitters");
        const result = await res.json();
        if (res.ok) setAllSitters(result.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Re-rank sitters instantly whenever weights or parent data changes
  const topMatches = useMemo(() => {
    if (!allSitters.length) return [];
    const langs = currentParent?.preferred_languages || ["English"];
    const topsisParent = {
      language: langs.find((l) => l !== "English") || langs[0],
      latitude: currentParent?.latitude,
      longitude: currentParent?.longitude,
    };
    const mapped = allSitters.map((s) => ({
      ...s,
      price: s.hourly_rate ?? 20,
      languages: s.languages || [],
      rating: s.rating ?? 0,
    }));
    return runTOPSIS(mapped, topsisParent, matchWeights).slice(0, 3);
  }, [allSitters, matchWeights, currentParent]);

  // Filter topMatches by radius when a distance pill is active (for the sitter cards)
  const sittersForDisplay = useMemo(() => {
    if (!radiusKm || !currentParent?.latitude || !currentParent?.longitude) return topMatches;
    return topMatches.filter((s) => {
      if (!s.latitude || !s.longitude) return false;
      return haversineDistance(currentParent.latitude, currentParent.longitude, s.latitude, s.longitude) <= radiusKm;
    });
  }, [topMatches, radiusKm, currentParent]);

  // All sitters with coordinates — used by the map (not capped to top 3)
  const mapSitters = useMemo(
    () => allSitters.filter((s) => s.latitude && s.longitude),
    [allSitters],
  );
  // const user = {
  //     name: "John Doe",
  //     email: "john.doe@example.com",
  //     role: "Parent",
  // };

  const [sessions, setSessions] = useState([]);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(null);
  const [reviewedSet, setReviewedSet] = useState(new Set());
  const [reviewRatings, setReviewRatings] = useState({}); // Map of booking_id to session_rating

  useEffect(() => {
    async function fetchBookings() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const res = await fetch(`/api/booking?parentId=${user.id}`);
        const data = await res.json();
        if (!res.ok) return;

        const bookings = data.bookings || [];

        // Count real upcoming sessions for the welcome banner —
        // confirmed/pending bookings scheduled strictly after today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        setUpcomingCount(
          bookings.filter((b) => {
            if (b.status !== "confirmed" && b.status !== "pending_sitter") return false;
            const [y, m, d] = b.date.split("-").map(Number);
            return new Date(y, m - 1, d) > today;
          }).length,
        );

        setSessions(
          bookings.map((b) => {
            const [startH, startM] = b.start_time.split(":").map(Number);
            const [endH,   endM]   = b.end_time.split(":").map(Number);
            const hours = ((endH * 60 + endM) - (startH * 60 + startM)) / 60;
            const fmt = (h, m) => {
              const suffix = h >= 12 ? "PM" : "AM";
              return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${suffix}`;
            };
            const firstChild = Array.isArray(b.children) ? b.children[0] : null;
            const sitterName = b.sitter_profile?.user?.name || "Your Sitter";
            const sitterAvatar = b.sitter_profile?.user?.avatar || sitter1;
            const deadline = b.created_at
              ? new Date(new Date(b.created_at).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
              : null;
            return {
              id:     b.id,
              status: b.status,
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
        );

        // Fetch which completed bookings this parent has already reviewed
        const { data: existingReviews } = await supabase
          .from("reviews")
          .select("booking_id, session_rating")
          .eq("reviewer_id", user.id)
          .eq("reviewer_role", "parent");
        if (existingReviews) {
          const reviewed = new Set();
          const ratings = {};
          existingReviews.forEach((r) => {
            reviewed.add(r.booking_id);
            ratings[r.booking_id] = r.session_rating;
          });
          setReviewedSet(reviewed);
          setReviewRatings(ratings);
        }
      } catch {}
      setLoadingSessions(false);
    }
    fetchBookings();
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
        setSessions(prev => prev.map(s =>
          s.id === bookingId
            ? {
                ...s,
                status: data.booking.status,
                parentMarkedComplete: data.booking.parent_marked_complete ?? true,
                sitterMarkedComplete: data.booking.sitter_marked_complete ?? s.sitterMarkedComplete,
              }
            : s
        ));
      }
    } catch {}
    setMarkingComplete(null);
  }


  const actions = [
    {
      icon: Search,
      label: "Find Sitters",
      desc: "Search for new sitters",
      color: "bg-red-50 text-[#ff6b6b]",
      href: "/search",
    },
    {
      icon: BookOpen,
      label: "Adventures",
      desc: "Browse activities",
      color: "bg-teal-50 text-teal-500",
      href: "/microadventure",
    },
    {
      icon: MessageCircle,
      label: "Messages",
      desc: "Chat with sitters",
      color: "bg-gray-100 text-gray-400",
      comingSoon: true,
    },
    {
      icon: CreditCard,
      label: "Payments",
      desc: "View billing history",
      color: "bg-gray-100 text-gray-400",
      comingSoon: true,
    },
  ];

  const getStatusBadge = (status) => {
    const map = {
      confirmed:      { label: "Confirmed",           cls: "bg-teal-50 text-teal-600" },
      pending_sitter: { label: "Awaiting sitter",     cls: "bg-yellow-50 text-yellow-700" },
      declined:       { label: "Declined",             cls: "bg-red-50 text-red-500" },
      cancelled:      { label: "Cancelled",            cls: "bg-gray-100 text-gray-500" },
      completed:      { label: "Completed",            cls: "bg-purple-50 text-purple-600" },
    };
    return map[status] ?? { label: status, cls: "bg-gray-100 text-gray-500" };
  };

  const getStatusMessage = (status, sitterName) => {
    if (status === "pending_sitter")
      return `Waiting for ${sitterName} to confirm your booking.`;
    if (status === "confirmed")
      return `${sitterName} has confirmed your booking. You're all set!`;
    if (status === "declined")
      return `${sitterName} couldn't take this booking. Try finding another sitter.`;
    return null;
  };

  const activities = [
    {
      icon: CalendarCheck,
      text: "Session completed with Mei-Ling Zhou",
      time: "2 days ago",
      color: "bg-teal-50 text-teal-500",
    },
    {
      icon: Star,
      text: "New review submitted for Mei-Ling Zhou",
      time: "4 days ago",
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      icon: Heart,
      text: "Saved Yasmine Benali to favourites",
      time: "1 week ago",
      color: "bg-red-50 text-[#ff6b6b]",
    },
    {
      icon: TrendingUp,
      text: 'Kai completed "Calm Corner Breathing" activity',
      time: "2 weeks ago",
      color: "bg-purple-50 text-purple-500",
    },
  ];

  const progressStats = {
    totalSessions: 12,
    adventuresCompleted: 8,
    skills: [
      { name: "Empathy", percentage: 75, color: "bg-[#ff6b6b]" },
      { name: "Creativity", percentage: 60, color: "bg-[#ff6b6b]" },
      { name: "Problem Solving", percentage: 45, color: "bg-[#ff6b6b]" },
    ],
  };
  return (
    <ParentSidebar userName={currentParent?.name}>
      {loading ? (
        <div className="flex-1 flex justify-center items-center min-h-screen">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#ff6b6b] rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Loading...</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <WelcomeBanner
            userName={currentParent?.name || "Parent"}
            sessionCount={upcomingCount}
          />

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {actions.map((action, index) =>
              action.comingSoon ? (
                <div
                  key={index}
                  className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center text-center cursor-not-allowed"
                  title="Coming soon"
                >
                  <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-4`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-400 mb-1">{action.label}</h3>
                  <p className="text-xs text-gray-400">Coming soon</p>
                </div>
              ) : (
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
              ),
            )}
          </div>
          <ParentPreferences
            parent={currentParent}
            onUpdate={(updates) => setCurrentParent(prev => ({ ...prev, ...updates }))}
          />

          {/* ── Match Priorities ─────────────────────────────────────────── */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm mb-8 overflow-hidden">
            <button
              onClick={() => setShowWeightConfig((v) => !v)}
              className="w-full flex justify-between items-center p-6 sm:p-8 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl font-bold text-gray-900 text-left">
                  Match Priorities
                </h2>
                {usingLearnedWeights && (
                  <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                    🧠 learned weights active
                  </span>
                )}
                <span className="text-xs text-gray-400">
                  Adjust what matters most — sitters re-rank instantly
                </span>
              </div>
              <span className="text-gray-400 text-sm ml-4 flex-shrink-0">
                {showWeightConfig ? "▲ Hide" : "▼ Show"}
              </span>
            </button>

            {showWeightConfig && (
              <div className="px-6 pb-8 sm:px-8 border-t border-gray-100 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
                  {CRITERIA_REGISTRY.map((c) => (
                    <div key={c.key}>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-sm font-medium text-gray-700">
                          {c.icon} {c.label}
                          <span className="text-xs text-gray-400 ml-1.5">
                            ({c.type})
                          </span>
                        </label>
                        <span className="text-sm font-bold text-gray-900 min-w-[36px] text-right">
                          {matchWeights[c.key]}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={60}
                        value={matchWeights[c.key]}
                        onChange={(e) =>
                          setMatchWeights((prev) => ({
                            ...prev,
                            [c.key]: Number(e.target.value),
                          }))
                        }
                        className="w-full cursor-pointer"
                        style={{ accentColor: "#ff6b6b" }}
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setMatchWeights(DEFAULT_WEIGHTS);
                    setUsingLearnedWeights(false);
                  }}
                  className="mt-5 text-sm text-gray-500 border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  Reset to defaults
                </button>
              </div>
            )}
          </div>

          {/* TOP MATCHED SITTERS + MAP */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Top Matched Sitters for You</h2>
              <Link href="/search" className="text-[#ff6b6b] hover:text-[#ff5252] text-sm font-semibold hover:underline">
                Search Sitters
              </Link>
            </div>
            <hr />

            {/* Distance radius filter pills */}
            <div className="flex items-center gap-2 mt-4 mb-1 flex-wrap">
              <span className="text-xs font-semibold text-gray-400 mr-1">Filter by distance:</span>
              {[1, 3, 5, 10].map((km) => (
                <button
                  key={km}
                  onClick={() => setRadiusKm((prev) => (prev === km ? null : km))}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                    radiusKm === km
                      ? "bg-teal-500 text-white border-teal-500"
                      : "border-gray-200 text-gray-600 hover:border-teal-400 hover:text-teal-600"
                  }`}
                >
                  {km} km
                </button>
              ))}
              {radiusKm && (
                <button
                  onClick={() => setRadiusKm(null)}
                  className="text-xs text-gray-400 hover:text-[#ff6b6b] underline cursor-pointer ml-1"
                >
                  Clear
                </button>
              )}
            </div>

            {/* 60 / 40 grid — mobile stacks (list on top, map below) */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-4">
              {/* Sitter cards — 60% */}
              <div className="lg:col-span-3 flex flex-col gap-4">
                {sittersForDisplay.length > 0 ? (
                  sittersForDisplay.map((sitter) => (
                    <MatchedSitterCard key={sitter.id} sitter={sitter} />
                  ))
                ) : radiusKm ? (
                  <p className="text-gray-500 text-center py-8 text-sm">
                    No sitters found within {radiusKm} km. Try a larger radius.
                  </p>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No matching sitters found. Try adjusting your preferences.
                  </p>
                )}
              </div>

              {/* Map panel — 40%, max 500px tall, matching border radius */}
              <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-gray-100 h-100 lg:h-125">
                <SitterMapPanel
                  sitters={mapSitters}
                  parent={currentParent}
                  radiusKm={radiusKm}
                />
              </div>
            </div>
          </div>

          {/* Row 1: Upcoming Sessions + My Children */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">My Bookings</h2>
                  <Link
                    href="/bookings/parent"
                    className="text-[#ff6b6b] hover:text-[#ff5252] text-sm font-semibold hover:underline"
                  >
                    View All
                  </Link>
                </div>
                <hr />
                <div className="space-y-6 mt-4">
                  {loadingSessions ? (
                    <div className="flex justify-center py-8">
                      <div className="w-8 h-8 border-4 border-gray-200 border-t-[#ff6b6b] rounded-full animate-spin" />
                    </div>
                  ) : sessions.length === 0 ? (
                    <p className="text-center text-gray-400 py-8 text-sm">No bookings yet. <a href="/search" className="text-[#ff6b6b] hover:underline">Find a sitter →</a></p>
                  ) : null}
                  {sessions.slice(-1).map((session) => {
                    const badge = getStatusBadge(session.status);
                    const message = getStatusMessage(session.status, session.sitter.name);
                    return (
                      <div key={session.id} className="border border-gray-100 rounded-2xl p-6 bg-gray-50/50">
                        {/* Sitter + status */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-4">
                            <Image
                              src={session.sitter.avatar}
                              alt={session.sitter.name}
                              className="rounded-full object-cover w-12 h-12"
                            />
                            <div>
                              <h3 className="font-bold text-gray-900">{session.sitter.name}</h3>
                              <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{session.date}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{session.time}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badge.cls}`}>
                            {badge.label}
                          </span>
                        </div>

                        {/* Status message */}
                        {message && (
                          <p className={`text-sm mb-4 px-4 py-3 rounded-xl border ${
                            session.status === "confirmed"
                              ? "bg-teal-50 text-teal-700 border-teal-100"
                              : session.status === "declined"
                              ? "bg-red-50 text-red-600 border-red-100"
                              : "bg-yellow-50 text-yellow-700 border-yellow-100"
                          }`}>
                            {message}
                          </p>
                        )}

                        <div className="mb-4">
                          <span className="text-sm text-gray-500">
                            For <span className="font-semibold text-gray-900">{session.child}</span>
                          </span>
                        </div>

                        <div className="bg-yellow-50 text-yellow-800 px-4 py-3 rounded-xl text-sm font-medium border border-yellow-100">
                          <span className="font-bold">Micro-Adventure:</span> {session.adventure}
                        </div>

                        {session.status === "confirmed" && (
                          <div className="mt-4">
                            {session.parentMarkedComplete ? (
                              <p className="text-sm text-center text-gray-500 py-2 bg-gray-50 rounded-xl border border-gray-100">
                                ✓ You marked this complete — waiting for the sitter to confirm.
                              </p>
                            ) : (
                              <button
                                onClick={() => handleMarkComplete(session.id)}
                                disabled={markingComplete === session.id}
                                className="w-full py-3 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                              >
                                {markingComplete === session.id ? "Marking…" : "Mark Session as Complete"}
                              </button>
                            )}
                          </div>
                        )}

                        {session.status === "completed" && (
                          <div className="mt-4">
                            {reviewedSet.has(session.id) ? (
                              <div className="flex items-center justify-between gap-3 py-2.5 px-3 bg-teal-50 rounded-xl border border-teal-100">
                                <div className="flex items-center gap-2">
                                  <Check className="w-4 h-4 text-teal-500" />
                                  <span className="text-sm text-teal-600 font-medium">Review submitted ✓</span>
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
                                booking={{ id: session.id, date: session.date, hours: session.hours }}
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
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <MyChildren
                children={children}
                onChildUpdated={(updated) => {
                  setChildren(prev => prev.map(c => c.id === updated.id ? updated : c));
                  // Refresh special_needs summary in preferences
                  setCurrentParent(prev => {
                    const allNeeds = [...new Set(
                      children.map(c => c.id === updated.id ? updated : c)
                        .flatMap(c => c.special_needs || [])
                    )];
                    return { ...prev, special_needs: allNeeds.length ? allNeeds.join(", ") : null };
                  });
                }}
              />
            </div>
          </div>


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-8">
            {/* <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                        <hr />
                        <div className="space-y-6 mt-4">
                            {activities.map((item, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div
                                        className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center flex-shrink-0`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-gray-900 font-medium">{item.text}</p>
                                        <p className="text-sm text-gray-500 mt-1">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div> */}

            {/* <div className="lg:col-span-1">
                    <ChildProgress
                        stats={progressStats}
                        selectedChild="Emma Wilson"
                        children={children}
                    />
                </div> */}
          </div>
        </div>
      )}
    </ParentSidebar>
  );
}
