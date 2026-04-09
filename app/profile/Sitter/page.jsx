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

function SessionCard({ session }) {
  const [status, setStatus] = useState(session.status);
  const [loading, setLoading] = useState(null); // 'accept' | 'decline' | null

  async function handleAction(action) {
    setLoading(action);
    try {
      const res = await fetch(`/api/booking/${session.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action === "accept" ? "confirmed" : "declined" }),
      });
      if (!res.ok) throw new Error("Failed to update booking");
      setStatus(action === "accept" ? "Confirmed" : "Declined");
    } catch {
      // silently revert — in production you'd show a toast here
    } finally {
      setLoading(null);
    }
  }

  const isPending = status === "pending_sitter" || status === "pending";
  const isDeclined = status === "declined";

  const statusStyles = {
    confirmed:      { cls: "bg-teal-50 text-teal-600",    label: "Confirmed" },
    declined:       { cls: "bg-red-50 text-red-500",      label: "Declined" },
    pending_sitter: { cls: "bg-yellow-50 text-yellow-700", label: "Awaiting your response" },
    pending:        { cls: "bg-yellow-50 text-yellow-700", label: "Awaiting your response" },
  };
  const badge = statusStyles[status] ?? { cls: "bg-gray-100 text-gray-500", label: status };

  return (
    <div className={`border border-gray-100 rounded-2xl overflow-hidden ${isDeclined ? "opacity-60" : ""}`}>
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
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badge.cls}`}>
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
            <span>${session.hourlyRate}/hr · {session.hours} hrs</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{session.address}</span>
          </div>
        </div>

        {/* Micro-adventure */}
        <div className="bg-yellow-50 text-yellow-800 px-4 py-3 rounded-xl text-sm font-medium border border-yellow-100">
          <span className="font-bold">Micro-Adventure:</span> {session.adventure}
        </div>

        {/* Parent notes */}
        {session.notes && (
          <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-600">
            <span className="font-semibold text-gray-700">Note from parent: </span>
            {session.notes}
          </div>
        )}

        {/* Actions */}
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
        ) : (
          <div className="flex gap-3 pt-1">
            <button className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors">
              View Details
            </button>
            {!isDeclined && (
              <button className="flex-1 py-3 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 transition-colors">
                Get Directions
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Demo: Alex Thompson's sitter_profiles.id from seed data
const DEMO_SITTER_PROFILE_ID = "99b942b1-c7db-44c8-9f6d-3a3f1c33905c";
const DEMO_SITTER_NAME = "Mei-Ling";

export default function SitterDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch(`/api/booking?sitterId=${DEMO_SITTER_PROFILE_ID}`);
        const data = await res.json();
        if (res.ok) setBookings(data.bookings || []);
      } catch {}
      setLoadingBookings(false);
    }
    fetchBookings();
  }, []);

  const sitter = { name: DEMO_SITTER_NAME };
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
      value: "4.9",
      label: "Average Rating",
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      icon: Users,
      value: "45",
      label: "Active Families",
      color: "bg-red-50 text-[#ff6b6b]",
    },
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
      date: new Date(b.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
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
    };
  });

  // const quickActions = [
  //     {
  //         icon: Calendar,
  //         label: "My Schedule",
  //         desc: "View availability",
  //         color: "bg-teal-50 text-teal-500",
  //         href: "/sitter/schedule"
  //     },
  //     {
  //         icon: MessageCircle,
  //         label: "Messages",
  //         desc: "Chat with families",
  //         color: "bg-yellow-50 text-yellow-600",
  //         href: "/messages"
  //     },
  //     {
  //         icon: DollarSign,
  //         label: "Earnings",
  //         desc: "Payment history",
  //         color: "bg-red-50 text-[#ff6b6b]",
  //         href: "/sitter/earnings"
  //     },
  //     {
  //         icon: Settings,
  //         label: "Profile",
  //         desc: "Edit your profile",
  //         color: "bg-purple-50 text-purple-500",
  //         href: "/sitter/profile"
  //     },
  // ];

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

  const reviews = [
    {
      id: 1,
      parent: "Jennifer Wilson",
      rating: 5,
      time: "2 days ago",
      text: "Sarah was absolutely wonderful with Emma! She came prepared with visual schedules and sensory-friendly activities. Emma felt comfortable immediately and we can't wait to book again.",
    },
    {
      id: 2,
      parent: "Michael Thompson",
      rating: 5,
      time: "1 week ago",
      text: "Fantastic experience! Sarah engaged Jake with creative storytelling and kept him entertained the entire time. Highly recommend!",
    },
  ];

  const topSkills = [
    { name: "Empathy Building", sessions: 45, color: "bg-[#ff6b6b]" },
    { name: "Problem Solving", sessions: 38, color: "bg-teal-500" },
    { name: "Creative Expression", sessions: 32, color: "bg-yellow-500" },
  ];

  const getStatusClass = (status) => {
    const statusMap = {
      confirmed: "status-confirmed",
      pending: "status-pending",
      cancelled: "status-cancelled",
      completed: "status-completed",
    };
    return statusMap[status.toLowerCase()] || "status-pending";
  };

  return (
    <main className="flex flex-col min-h-screen max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <WelcomeBanner userName={sitter.name} sessionCount={3} />

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
      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
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
            </div> */}

      {/* Main Content - Upcoming Sessions + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Upcoming Sessions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Sessions</h2>
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
                <p className="text-center text-gray-400 py-8 text-sm">No bookings yet.</p>
              ) : (
                upcomingSessions.map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))
              )}
            </div>
          </div>

          {/* Recent Reviews */}
          {/* <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Reviews</h2>

                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-bold text-gray-900">{review.parent}</h3>
                                        <span className="text-sm text-gray-500">{review.time}</span>
                                    </div>
                                    <div className="flex gap-1 mb-3">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">{review.text}</p>
                                </div>
                            ))}
                        </div>
                    </div> */}
        </div>

        {/* Right: Sidebar Widgets */}
        <div className="lg:col-span-1 space-y-8">
          {/* Profile Completion */}
          {/* 1 <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6"> */}
          {/* <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Completion</h2> */}

          {/* <div className="mb-6">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-semibold text-gray-700">{profileCompletion.percentage}% Complete</span>
                                <span className="text-teal-500 font-semibold">Almost there!</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-teal-500 rounded-full transition-all duration-500"
                                    style={{ width: `${profileCompletion.percentage}%` }}
                                ></div>
                            </div>
                        </div> */}

          {/* <div className="space-y-3">
                            {profileCompletion.items.map((item, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    {item.completed ? (
                                        <CheckCircle className="w-5 h-5 text-teal-500 shrink-0" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-gray-300 shrink-0" />
                                    )}
                                    <span className={`text-sm ${item.completed ? 'text-gray-700' : 'text-gray-500'}`}>
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div> */}
          {/* 2 </div> */}

          {/* Earnings Breakdown */}
          {/* <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Earnings Breakdown</h2>

                        <div className="bg-red-50 p-4 rounded-2xl mb-6">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-sm text-red-600 font-medium">This Week</p>
                                <TrendingUp className="w-4 h-4 text-red-500" />
                            </div>
                            <p className="text-3xl font-bold text-red-600">${earnings.thisWeek}</p>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Completed Sessions</span>
                                <span className="font-semibold text-gray-900">${earnings.completedSessions}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tips Received</span>
                                <span className="font-semibold text-gray-900">${earnings.tipsReceived}</span>
                            </div>
                            <div className="border-t border-gray-100 pt-3">
                                <div className="flex justify-between">
                                    <span className="font-bold text-gray-900">Total This Month</span>
                                    <span className="font-bold text-red-600 text-lg">${earnings.totalThisMonth}</span>
                                </div>
                            </div>
                        </div>

                        <Link
                            href="/sitter/earnings/request"
                            className="w-full py-3 border border-red-500 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-colors flex items-center justify-center"
                        >
                            Request Payout
                        </Link>
                    </div> */}

          {/* This Month Stats */}
          {/* <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">This Month</h2>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl ${monthlyStats.sessions.color} flex items-center justify-center shrink-0`}>
                                    <monthlyStats.sessions.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600 mb-1">Sessions</p>
                                    <p className="font-bold text-gray-900">{monthlyStats.sessions.completed} completed</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl ${monthlyStats.adventures.color} flex items-center justify-center shrink-0`}>
                                    <monthlyStats.adventures.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600 mb-1">Adventures</p>
                                    <p className="font-bold text-gray-900">{monthlyStats.adventures.facilitated} facilitated</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl ${monthlyStats.reviews.color} flex items-center justify-center shrink-0`}>
                                    <monthlyStats.reviews.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600 mb-1">New Reviews</p>
                                    <p className="font-bold text-gray-900">{monthlyStats.reviews.count} this month</p>
                                </div>
                            </div>
                        </div>
                    </div> */}

          {/* Top Skills */}
          {/* <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Top Skills</h2>

                        <div className="space-y-4">
                            {topSkills.map((skill, index) => (
                                <div key={index}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-semibold text-gray-900">{skill.name}</span>
                                        <span className="text-gray-500">{skill.sessions} sessions</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${skill.color} rounded-full`}
                                            style={{ width: `${(skill.sessions / 45) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div> */}
        </div>
      </div>
    </main>
  );
}
