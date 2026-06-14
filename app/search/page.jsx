"use client";

import { SitterCard } from "@/components/sitter-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  X,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";

const LS_WEIGHTS_KEY = "lh_learned_weights";
const DEFAULT_WEIGHTS = { language: 35, price: 35, rating: 20, experience: 10 };

const CRITERIA_INFO = [
  { key: "language", label: "Language Match", icon: "🗣️" },
  { key: "price", label: "Price", icon: "💰" },
  { key: "rating", label: "Rating", icon: "⭐" },
  { key: "experience", label: "Experience", icon: "🎓" },
];

const ALL_LANGUAGES = ["English", "French", "Spanish", "Mandarin", "ASL"];
const ALL_SPECIAL_NEEDS = [
  "Autism",
  "ADHD",
  "Sensory",
  "Language Support",
  "Anxiety",
  "Speech Delay",
  "Down Syndrome",
];

function computeMatchData(sitter, preferredLanguage, weights, allSitters) {
  const total = Object.values(weights).reduce((s, v) => s + v, 0) || 1;
  const normW = Object.fromEntries(
    Object.entries(weights).map(([k, v]) => [k, v / total]),
  );

  const prices = allSitters.map((s) => s.hourly_rate ?? 20);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const langBarValue = preferredLanguage
    ? sitter.languages?.includes(preferredLanguage)
      ? 1
      : 0
    : null;

  const priceBar =
    maxPrice === minPrice
      ? 1
      : 1 - ((sitter.hourly_rate ?? 20) - minPrice) / (maxPrice - minPrice);
  const ratingBar = Math.min((sitter.rating ?? 0) / 5, 1);
  const expBar = Math.min((sitter.experience ?? 0) / 10, 1);

  const criteria = [
    { key: "language", barValue: langBarValue, weight: normW.language ?? 0 },
    { key: "price", barValue: priceBar, weight: normW.price ?? 0 },
    { key: "rating", barValue: ratingBar, weight: normW.rating ?? 0 },
    { key: "experience", barValue: expBar, weight: normW.experience ?? 0 },
  ];

  const active = criteria.filter((c) => c.barValue !== null);
  const activeTotal = active.reduce((s, c) => s + c.weight, 0) || 1;
  const score = active.reduce(
    (sum, c) => sum + (c.barValue * c.weight) / activeTotal,
    0,
  );

  return { score: parseFloat(score.toFixed(3)), criteria };
}

export default function SearchPage() {
  const [sitters, setSitters] = useState([]);
  const [filteredSitters, setFilteredSitters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [nameQuery, setNameQuery] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [matchWeights, setMatchWeights] = useState(DEFAULT_WEIGHTS);
  const [usingLearnedWeights, setUsingLearnedWeights] = useState(false);
  const [showPriorities,   setShowPriorities]   = useState(false);
  const [showSpecialNeeds, setShowSpecialNeeds] = useState(false);
  const [showLanguages,    setShowLanguages]    = useState(false);

  const [filters, setFilters] = useState({
    minRate: "",
    maxRate: "",
    experience: 0,
    languages: [],
    specialNeeds: [],
    availability: [], // "weekdays" | "weekends"
  });

  // Load learned weights
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_WEIGHTS_KEY);
      if (saved) {
        setMatchWeights(JSON.parse(saved));
        setUsingLearnedWeights(true);
      }
    } catch {}
  }, []);

  // Fetch sitters
  useEffect(() => {
    async function fetchSitters() {
      try {
        const res = await fetch("/api/sitters");
        const result = await res.json();
        if (!res.ok) return;
        const formatted = result.data || [];
        setSitters(formatted);
        setFilteredSitters(formatted);
      } catch {}
      setLoading(false);
    }
    fetchSitters();
  }, []);

  // Re-apply filters whenever inputs change
  useEffect(() => {
    let filtered = [...sitters];

    if (nameQuery.trim()) {
      filtered = filtered.filter((s) =>
        s.name?.toLowerCase().includes(nameQuery.toLowerCase()),
      );
    }
    if (filters.minRate) {
      filtered = filtered.filter(
        (s) => s.hourly_rate >= parseInt(filters.minRate),
      );
    }
    if (filters.maxRate) {
      filtered = filtered.filter(
        (s) => s.hourly_rate <= parseInt(filters.maxRate),
      );
    }
    if (filters.experience > 0) {
      filtered = filtered.filter(
        (s) => (s.experience || 0) >= filters.experience,
      );
    }
    if (filters.languages.length > 0) {
      filtered = filtered.filter((s) =>
        s.languages?.some((l) => filters.languages.includes(l)),
      );
    }
    if (filters.specialNeeds.length > 0) {
      filtered = filtered.filter((s) =>
        s.special_needs?.some((n) => filters.specialNeeds.includes(n)),
      );
    }
    if (filters.availability.includes("weekdays")) {
      filtered = filtered.filter((s) =>
        ["Mon", "Tue", "Wed", "Thu", "Fri"].some((d) => s.availability?.[d]),
      );
    }
    if (filters.availability.includes("weekends")) {
      filtered = filtered.filter((s) =>
        ["Sat", "Sun"].some((d) => s.availability?.[d]),
      );
    }

    setFilteredSitters(filtered);
    setCurrentPage(1);
  }, [filters, sitters, nameQuery]);

  const toggleMulti = (key, value) =>
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));

  const clearFilters = () => {
    setNameQuery("");
    setFilters({
      minRate: "",
      maxRate: "",
      experience: 0,
      languages: [],
      specialNeeds: [],
      availability: [],
    });
    setPreferredLanguage("");
  };

  const hasActiveFilters =
    nameQuery.trim() ||
    filters.minRate ||
    filters.maxRate ||
    filters.experience > 0 ||
    filters.languages.length > 0 ||
    filters.specialNeeds.length > 0 ||
    filters.availability.length > 0;

  // Score + sort by match score
  const sortedSitters = useMemo(() => {
    const scores = {};
    filteredSitters.forEach((s) => {
      scores[s.id] = computeMatchData(s, preferredLanguage, matchWeights, filteredSitters).score;
    });
    return [...filteredSitters].sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0));
  }, [filteredSitters, preferredLanguage, matchWeights]);

  const totalPages = Math.ceil(sortedSitters.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentSitters = sortedSitters.slice(indexOfFirst, indexOfLast);

  const goToPage = (n) => {
    setCurrentPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#ff6b6b] rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside className="w-72 shrink-0 bg-white border-r border-gray-100 sticky top-0 h-screen overflow-y-auto hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="ml-auto text-xs text-[#ff6b6b] hover:underline font-medium"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-8 flex-1">
          {/* Hourly Rate */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-3">
              Hourly Rate
            </h3>
            <div className="flex gap-2">
              <Input
                placeholder="Min"
                type="number"
                value={filters.minRate}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, minRate: e.target.value }))
                }
                className="h-9 text-sm"
              />
              <Input
                placeholder="Max"
                type="number"
                value={filters.maxRate}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, maxRate: e.target.value }))
                }
                className="h-9 text-sm"
              />
            </div>
          </div>

          {/* Experience */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-3">
              Experience (years)
            </h3>
            <input
              type="range"
              min="0"
              max="10"
              value={filters.experience}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  experience: parseInt(e.target.value),
                }))
              }
              className="w-full cursor-pointer"
              style={{ accentColor: "#ff6b6b" }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0</span>
              {filters.experience > 0 && (
                <span className="text-[#ff6b6b] font-semibold">
                  {filters.experience}+ yrs
                </span>
              )}
              <span>10+</span>
            </div>
          </div>

          {/* Special Needs */}
          <div>
            <button
              onClick={() => setShowSpecialNeeds((v) => !v)}
              className="w-full flex items-center justify-between text-sm font-bold text-gray-800 mb-1"
            >
              <span className="flex items-center gap-1.5">
                Special Needs
                {filters.specialNeeds.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#ff6b6b] text-white text-xs flex items-center justify-center font-bold">
                    {filters.specialNeeds.length}
                  </span>
                )}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showSpecialNeeds ? "rotate-180" : ""}`} />
            </button>
            {showSpecialNeeds && (
              <div className="mt-3 space-y-2">
                {ALL_SPECIAL_NEEDS.map((need) => (
                  <label key={need} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.specialNeeds.includes(need)}
                      onChange={() => toggleMulti("specialNeeds", need)}
                      className="rounded border-gray-300 w-4 h-4 shrink-0"
                      style={{ accentColor: "#ff6b6b" }}
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{need}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Languages */}
          <div>
            <button
              onClick={() => setShowLanguages((v) => !v)}
              className="w-full flex items-center justify-between text-sm font-bold text-gray-800 mb-1"
            >
              <span className="flex items-center gap-1.5">
                Languages
                {filters.languages.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#ff6b6b] text-white text-xs flex items-center justify-center font-bold">
                    {filters.languages.length}
                  </span>
                )}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showLanguages ? "rotate-180" : ""}`} />
            </button>
            {showLanguages && (
              <div className="mt-3 space-y-2">
                {ALL_LANGUAGES.map((lang) => (
                  <label key={lang} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.languages.includes(lang)}
                      onChange={() => toggleMulti("languages", lang)}
                      className="rounded border-gray-300 w-4 h-4 shrink-0"
                      style={{ accentColor: "#ff6b6b" }}
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{lang}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Availability */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-3">
              Availability
            </h3>
            <div className="space-y-2">
              {[
                ["weekdays", "Weekdays"],
                ["weekends", "Weekends"],
              ].map(([value, label]) => (
                <label
                  key={value}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.availability.includes(value)}
                    onChange={() => toggleMulti("availability", value)}
                    className="rounded border-gray-300 w-4 h-4 shrink-0"
                    style={{ accentColor: "#ff6b6b" }}
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Match Priorities (collapsible) */}
          <div>
            <button
              onClick={() => setShowPriorities((v) => !v)}
              className={`w-full flex items-center justify-between text-sm font-bold mb-3 ${usingLearnedWeights ? "text-green-700" : "text-gray-800"}`}
            >
              <span className="flex items-center gap-1.5">
                {usingLearnedWeights ? (
                  "🧠"
                ) : (
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                )}
                Match Priorities
                {usingLearnedWeights && (
                  <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">
                    learned
                  </span>
                )}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showPriorities ? "rotate-180" : ""}`}
              />
            </button>

            {showPriorities && (
              <div className="space-y-3">
                {CRITERIA_INFO.map((c) => (
                  <div key={c.key}>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs text-gray-600">
                        {c.icon} {c.label}
                      </label>
                      <span className="text-xs font-bold text-gray-800">
                        {matchWeights[c.key]}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={60}
                      value={matchWeights[c.key]}
                      onChange={(e) => {
                        setMatchWeights((p) => ({
                          ...p,
                          [c.key]: Number(e.target.value),
                        }));
                        setUsingLearnedWeights(false);
                      }}
                      className="w-full cursor-pointer h-1.5 rounded-full"
                      style={{ accentColor: "#ff6b6b" }}
                    />
                  </div>
                ))}
                <button
                  onClick={() => {
                    setMatchWeights(DEFAULT_WEIGHTS);
                    setUsingLearnedWeights(false);
                  }}
                  className="text-xs text-gray-400 hover:text-[#ff6b6b] transition-colors"
                >
                  Reset to defaults
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Find Your Perfect Sitter
          </h1>
          <p className="text-gray-500 text-sm">
            {filteredSitters.length}{" "}
            {filteredSitters.length === 1 ? "sitter" : "sitters"} available in
            your area
          </p>
        </div>

        {/* Name search */}
        <div className="relative max-w-sm mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Search by name…"
            className="pl-9 h-10 text-sm bg-white"
            value={nameQuery}
            onChange={(e) => setNameQuery(e.target.value)}
          />
          {nameQuery && (
            <button
              onClick={() => setNameQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Cards */}
        {filteredSitters.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-lg font-medium">
              No sitters match your filters
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Try adjusting your search criteria
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-[#ff6b6b] hover:underline font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {currentSitters.map((sitter) => (
              <SitterCard key={sitter.id} sitter={sitter} />
            ))}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <Button
                  onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="h-10 px-3"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const p = index + 1;
                    if (
                      p === 1 ||
                      p === totalPages ||
                      (p >= currentPage - 1 && p <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={p}
                          onClick={() => goToPage(p)}
                          variant={currentPage === p ? "default" : "outline"}
                          className={`h-10 w-10 ${currentPage === p ? "bg-[#ff6b6b] hover:bg-[#ff5252] text-white" : ""}`}
                        >
                          {p}
                        </Button>
                      );
                    } else if (p === currentPage - 2 || p === currentPage + 2) {
                      return (
                        <span
                          key={p}
                          className="px-2 flex items-center text-gray-400"
                        >
                          …
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <Button
                  onClick={() =>
                    currentPage < totalPages && goToPage(currentPage + 1)
                  }
                  disabled={currentPage === totalPages}
                  variant="outline"
                  className="h-10 px-3"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
