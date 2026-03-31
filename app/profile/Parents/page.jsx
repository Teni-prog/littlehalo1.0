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
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import WelcomeBanner from "@/components/ui/welcomebanner";
import sitter1 from "@/assets/sitter1.png";
import sitter2 from "@/assets/sitter2.png";
import MyChildren from "@/components/Mychildren";
import ChildProgress from "@/components/Childprogress";
import { useEffect, useState, useMemo } from "react";
import MatchedSitterCard from "@/app/search/matching-button/page";
import ParentPreferences from "../ParentPreferences/page";
import { parents } from "@/lib/mock-data/parents";
import {
  runTOPSIS,
  CRITERIA_REGISTRY,
  DEFAULT_WEIGHTS,
} from "@/lib/matchingData";

// Wei Chen's profile is the demo parent for this dashboard
const WEI_CHEN = parents.find((p) => p.id === "wei-chen-demo");

// Parent object in the shape runTOPSIS expects: { language }
const TOPSIS_PARENT = {
  language:
    WEI_CHEN.preferredLanguages.find((l) => l !== "English") ||
    WEI_CHEN.preferredLanguages[0],
};

const LS_WEIGHTS_KEY = "lh_learned_weights";

export default function ParentDashboard() {
  const [currentParent, setCurrentParent] = useState(null);
  const [allSitters, setAllSitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchWeights, setMatchWeights] = useState(DEFAULT_WEIGHTS);
  const [showWeightConfig, setShowWeightConfig] = useState(false);
  const [usingLearnedWeights, setUsingLearnedWeights] = useState(false);

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

  // Fetch all sitters once — TOPSIS runs client-side so weights are live
  useEffect(() => {
    async function fetchData() {
      try {
        setCurrentParent({
          ...WEI_CHEN,
          max_budget: WEI_CHEN.preferences.maxHourlyRate,
          preferred_languages: WEI_CHEN.preferredLanguages,
          preferred_location: WEI_CHEN.location,
          special_needs: WEI_CHEN.child?.tags?.join(", ") || null,
        });

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

  // Re-rank sitters instantly whenever weights change
  const topMatches = useMemo(() => {
    if (!allSitters.length) return [];
    const mapped = allSitters.map((s) => ({
      ...s,
      price: s.hourly_rate ?? 20,
      languages: s.languages || [],
    }));
    return runTOPSIS(mapped, TOPSIS_PARENT, matchWeights).slice(0, 3);
  }, [allSitters, matchWeights]);
  // const user = {
  //     name: "John Doe",
  //     email: "john.doe@example.com",
  //     role: "Parent",
  // };

  const sessions = [
    {
      id: 1,
      date: "Feb 15, 2026",
      time: "3:00 PM - 6:00 PM",
      status: "Confirmed",
      child: "Emma (5)",
      adventure: "Nature Walk & Bird Watching",
      sitter: {
        name: "Sarah Chen",
        avatar: sitter1,
      },
    },
    {
      id: 2,
      date: "Feb 18, 2026",
      time: "10:00 AM - 2:00 PM",
      status: "Pending",
      child: "Lucas (3)",
      adventure: "Arts & Crafts Session",
      sitter: {
        name: "Maria Rodriguez",
        avatar: sitter2,
      },
    },
  ];

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
      // color: "bg-yellow-50 text-yellow-600",
      color: "bg-gray-50 text-gray-300 ",
      href: "/messages",
    },
    {
      icon: CreditCard,
      label: "Payments",
      desc: "View billing history",
      // color: "bg-purple-50 text-purple-500",
      color: "bg-gray-50 text-gray-300",
      href: "/payments",
    },
  ];

  const getStatusClass = (status) => {
    const statusMap = {
      confirmed: "status-confirmed",
      pending: "status-pending",
      denied: "status-denied",
      cancelled: "status-cancelled",
      completed: "status-completed",
    };
    return statusMap[status.toLowerCase()] || "status-pending";
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

  const children = [WEI_CHEN.child];
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
    <>
      {loading ? (
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#ff6b6b] rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Loading...</p>
          </div>
        </div>
      ) : (
        <main className="flex flex-col min-h-screen max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <WelcomeBanner
            userName={currentParent?.name || "Parent"}
            sessionCount={sessions.length}
          />

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {actions.map((action, index) => (
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
          <ParentPreferences parent={currentParent} />

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
              <span className="text-gray-400 text-sm ml-4 shrink-0">
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
                        <span className="text-sm font-bold text-gray-900 min-w-9 text-right">
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

          {/* TOP MATCHED SITTERS SECTION */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Top Matched Sitters for You
              </h2>
              <Link
                href="/search"
                className="text-[#ff6b6b] hover:text-[#ff5252] text-sm font-semibold hover:underline"
              >
                Search Sitters
              </Link>
            </div>
            <hr />
            {topMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {topMatches.map((sitter) => (
                  <MatchedSitterCard key={sitter.id} sitter={sitter} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No matching sitters found. Try adjusting your preferences.
              </p>
            )}
          </div>

          {/* Row 1: Upcoming Sessions + Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Upcoming Sessions</h2>
                            <Link
                                href="/sessions"
                                className="text-[#ff6b6b] hover:text-[#ff5252] text-sm font-semibold hover:underline "
                            >
                                View All
                            </Link>
                        </div>
                        <hr />
                        <div className="space-y-6 mt-4">
                            {sessions.map((session) => (
                                <div
                                    key={session.id}
                                    className="border border-gray-100 rounded-2xl p-6 bg-gray-50/50"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-4">
                                            <Image
                                                src={session.sitter.avatar}
                                                alt={session.sitter.name}
                                                className="rounded-full object-cover w-12 h-12"
                                            />
                                            <div>
                                                <h3 className="font-bold text-gray-900">
                                                    {session.sitter.name}
                                                </h3>
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
                                        <span className={getStatusClass(session.status)}>
                                            {session.status}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <span className="text-sm text-gray-500">
                                            For{" "}
                                            <span className="font-semibold text-gray-900">
                                                {session.child}
                                            </span>
                                        </span>
                                    </div>

                                    <div className="bg-yellow-50 text-yellow-800 px-4 py-3 rounded-xl text-sm font-medium border border-yellow-100">
                                        <span className="font-bold">Micro-Adventure:</span>{" "}
                                        {session.adventure}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div> */}

            {/* Right: Recent Activity */}
            {/* <div className="lg:col-span-1">
                    <MyChildren children={children} />
                </div> */}
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
        </main>
      )}
    </>
  );
}
