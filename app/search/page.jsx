"use client";

import { SitterCard } from "@/components/sitter-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MapPin,
  X,
} from "lucide-react";
import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";

const LS_WEIGHTS_KEY = "lh_learned_weights";
const DEFAULT_WEIGHTS = { language: 35, price: 35, rating: 20, experience: 10 };

const CRITERIA_INFO = [
  { key: "language", label: "Language Match", icon: "🗣️" },
  { key: "price", label: "Price", icon: "💰" },
  { key: "rating", label: "Rating", icon: "⭐" },
  { key: "experience", label: "Experience", icon: "🎓" },
];

const ALL_LANGUAGES = ["English", "French", "Spanish", "Mandarin", "Arabic"];
const ALL_SPECIAL_NEEDS = [
  "Autism",
  "Nonverbal",
  "Anxiety",
  "Asthma",
  "Speech Delay",
  "Down Syndrome",
  "ADHD",
  "Sensory Sensitivity",
];

function computeMatchData(sitter, preferredLanguage, weights, allSitters) {
  const total = Object.values(weights).reduce((s, v) => s + v, 0) || 1;
  const normW = Object.fromEntries(
    Object.entries(weights).map(([k, v]) => [k, v / total]),
  );

  const prices = allSitters.map((s) => s.hourly_rate ?? s.price ?? 20);
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
    {
      key: "language",
      label: "Language",
      icon: "🗣️",
      barValue: langBarValue,
      weight: normW.language ?? 0,
      display: preferredLanguage
        ? langBarValue
          ? "Match"
          : "No match"
        : "Not set",
    },
    {
      key: "price",
      label: "Price",
      icon: "💰",
      barValue: priceBar,
      weight: normW.price ?? 0,
      display: `$${sitter.hourly_rate ?? sitter.price ?? "–"}/hr`,
    },
    {
      key: "rating",
      label: "Rating",
      icon: "⭐",
      barValue: ratingBar,
      weight: normW.rating ?? 0,
      display: sitter.rating ?? "–",
    },
    {
      key: "experience",
      label: "Experience",
      icon: "🎓",
      barValue: expBar,
      weight: normW.experience ?? 0,
      display: `${sitter.experience ?? 0} yrs`,
    },
  ];

  const active = criteria.filter((c) => c.barValue !== null);
  const activeTotal = active.reduce((s, c) => s + c.weight, 0) || 1;
  const score = active.reduce(
    (sum, c) => sum + (c.barValue * c.weight) / activeTotal,
    0,
  );

  return { score: parseFloat(score.toFixed(3)), criteria };
}

function Chip({ label, onRemove }) {
  return (
    <span className="flex items-center gap-1 bg-[#ff6b6b]/10 text-[#ff6b6b] text-xs px-2.5 py-1 rounded-full font-medium">
      {label}
      <button
        onClick={onRemove}
        className="hover:text-[#ff5252] ml-0.5 leading-none"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

export default function SearchPage() {
  const [sitters, setSitters] = useState([]);
  const [filteredSitters, setFilteredSitters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: "",
    minRate: "",
    maxRate: "",
    experience: 0,
    languages: [],
    specialNeeds: [],
  });
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [matchWeights, setMatchWeights] = useState(DEFAULT_WEIGHTS);
  const [usingLearnedWeights, setUsingLearnedWeights] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const filterBarRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (filterBarRef.current && !filterBarRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load learned weights from localStorage
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
        const response = await fetch("/api/sitters");
        const result = await response.json();
        if (!response.ok) return;
        const formatted = result.data || [];
        setSitters(formatted);
        setFilteredSitters(formatted);
        setLoading(false);
      } catch {}
    }
    fetchSitters();
  }, []);

  // Apply filters
  useEffect(() => {
    applyFilters();
    setCurrentPage(1);
  }, [filters, sitters]);

  const applyFilters = () => {
    let filtered = [...sitters];
    if (filters.location.trim()) {
      filtered = filtered.filter((s) =>
        s.location?.toLowerCase().includes(filters.location.toLowerCase()),
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
    setFilteredSitters(filtered);
  };

  const handleLanguageChange = (language) => {
    setFilters((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }));
  };

  const handleSpecialNeedsChange = (need) => {
    setFilters((prev) => ({
      ...prev,
      specialNeeds: prev.specialNeeds.includes(need)
        ? prev.specialNeeds.filter((n) => n !== need)
        : [...prev.specialNeeds, need],
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      minRate: "",
      maxRate: "",
      experience: 0,
      languages: [],
      specialNeeds: [],
    });
    setPreferredLanguage("");
  };

  const hasActiveFilters =
    filters.location ||
    filters.minRate ||
    filters.maxRate ||
    filters.experience > 0 ||
    filters.languages.length > 0 ||
    filters.specialNeeds.length > 0;

  // Score all filtered sitters, then sort by score so weight changes re-rank the list
  const { sortedSitters, matchDataMap } = useMemo(() => {
    const map = {};
    filteredSitters.forEach((s) => {
      map[s.id] = computeMatchData(
        s,
        preferredLanguage,
        matchWeights,
        filteredSitters,
      );
    });
    const sorted = [...filteredSitters].sort(
      (a, b) => (map[b.id]?.score ?? 0) - (map[a.id]?.score ?? 0),
    );
    sorted.forEach((s, i) => {
      if (map[s.id]) map[s.id].rank = i + 1;
    });
    return { sortedSitters: sorted, matchDataMap: map };
  }, [filteredSitters, preferredLanguage, matchWeights]);

  // Pagination over the sorted list
  const totalPages = Math.ceil(sortedSitters.length / itemsPerPage);
  const indexOfLastSitter = currentPage * itemsPerPage;
  const indexOfFirstSitter = indexOfLastSitter - itemsPerPage;
  const currentSitters = sortedSitters.slice(
    indexOfFirstSitter,
    indexOfLastSitter,
  );

  const goToPage = (n) => {
    setCurrentPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleDropdown = (key) =>
    setOpenDropdown((prev) => (prev === key ? null : key));

  const dropdownBtn = (key, label, icon, isActive, badge) => (
    <button
      onClick={() => toggleDropdown(key)}
      className={`flex items-center gap-1.5 h-9 px-3 rounded-lg border text-sm font-medium transition-colors whitespace-nowrap
        ${isActive ? "bg-[#ff6b6b] text-white border-[#ff6b6b]" : "bg-white text-gray-700 border-gray-200 hover:border-[#ff6b6b]"}`}
    >
      <span>{icon}</span>
      {label}
      {badge != null && badge > 0 && (
        <span
          className={`rounded-full w-4 h-4 text-xs flex items-center justify-center font-bold ${isActive ? "bg-white/30 text-white" : "bg-[#ff6b6b] text-white"}`}
        >
          {badge}
        </span>
      )}
      <ChevronDown
        className={`w-3.5 h-3.5 transition-transform ${openDropdown === key ? "rotate-180" : ""}`}
      />
    </button>
  );

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
        <div className="min-h-screen bg-gray-100">
          {/* Page header */}
          <div className="bg-white border-b px-4 py-6">
            <div className="max-w-6xl mx-auto">
              <Link href="">
                <h1 className="text-3xl font-bold font-outfit mb-1 cursor-pointer">
                  Find a Sitter
                </h1>
              </Link>
              <p className="text-muted-foreground">
                Connect with trusted local babysitters.
              </p>
            </div>
          </div>

          {/* ── Sticky filter bar ─────────────────────────────────────── */}
          <div
            ref={filterBarRef}
            className="sticky top-0 z-20 bg-white border-b shadow-sm"
          >
            <div className="max-w-6xl mx-auto px-4 py-3">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Location — always visible */}
                <div className="relative flex-1 min-w-37.5 max-w-52.5">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <Input
                    placeholder="Location…"
                    className="h-9 pl-9 text-sm"
                    value={filters.location}
                    onChange={(e) =>
                      setFilters({ ...filters, location: e.target.value })
                    }
                  />
                </div>

                {/* Price */}
                <div className="relative">
                  {dropdownBtn(
                    "price",
                    "Price",
                    "💰",
                    !!(filters.minRate || filters.maxRate),
                  )}
                  {openDropdown === "price" && (
                    <div className="absolute top-full left-0 mt-1.5 bg-white border rounded-xl shadow-lg p-4 w-52 z-30">
                      <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                        Hourly Rate
                      </p>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Min $"
                          type="number"
                          className="h-8 text-sm"
                          value={filters.minRate}
                          onChange={(e) =>
                            setFilters({ ...filters, minRate: e.target.value })
                          }
                        />
                        <Input
                          placeholder="Max $"
                          type="number"
                          className="h-8 text-sm"
                          value={filters.maxRate}
                          onChange={(e) =>
                            setFilters({ ...filters, maxRate: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Experience */}
                <div className="relative">
                  {dropdownBtn(
                    "exp",
                    filters.experience > 0
                      ? `${filters.experience}+ yrs`
                      : "Experience",
                    "🎓",
                    filters.experience > 0,
                  )}
                  {openDropdown === "exp" && (
                    <div className="absolute top-full left-0 mt-1.5 bg-white border rounded-xl shadow-lg p-4 w-52 z-30">
                      <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                        Min. Experience
                      </p>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={filters.experience}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            experience: parseInt(e.target.value),
                          })
                        }
                        className="w-full cursor-pointer"
                        style={{ accentColor: "#ff6b6b" }}
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>0</span>
                        <span className="text-[#ff6b6b] font-semibold">
                          {filters.experience}+ years
                        </span>
                        <span>10</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Languages */}
                <div className="relative">
                  {dropdownBtn(
                    "lang",
                    "Languages",
                    "🗣️",
                    filters.languages.length > 0,
                    filters.languages.length,
                  )}
                  {openDropdown === "lang" && (
                    <div className="absolute top-full left-0 mt-1.5 bg-white border rounded-xl shadow-lg p-4 w-48 z-30">
                      <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                        Languages
                      </p>
                      {ALL_LANGUAGES.map((lang) => (
                        <label
                          key={lang}
                          className="flex items-center gap-2 py-1.5 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            style={{ accentColor: "#ff6b6b" }}
                            checked={filters.languages.includes(lang)}
                            onChange={() => handleLanguageChange(lang)}
                          />
                          <span className="text-sm text-gray-700">{lang}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Special Needs */}
                <div className="relative">
                  {dropdownBtn(
                    "needs",
                    "Special Needs",
                    "🌟",
                    filters.specialNeeds.length > 0,
                    filters.specialNeeds.length,
                  )}
                  {openDropdown === "needs" && (
                    <div className="absolute top-full left-0 mt-1.5 bg-white border rounded-xl shadow-lg p-4 w-56 z-30">
                      <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                        Special Needs Experience
                      </p>
                      {ALL_SPECIAL_NEEDS.map((need) => (
                        <label
                          key={need}
                          className="flex items-center gap-2 py-1.5 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            style={{ accentColor: "#ff6b6b" }}
                            checked={filters.specialNeeds.includes(need)}
                            onChange={() => handleSpecialNeedsChange(need)}
                          />
                          <span className="text-sm text-gray-700">{need}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Match Priorities */}
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown("priorities")}
                    className={`flex items-center gap-1.5 h-9 px-3 rounded-lg border text-sm font-medium transition-colors
                      ${usingLearnedWeights ? "bg-green-50 text-green-700 border-green-300" : "bg-white text-gray-700 border-gray-200 hover:border-[#ff6b6b]"}`}
                  >
                    {usingLearnedWeights ? (
                      <span>🧠</span>
                    ) : (
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                    )}
                    Priorities
                    {usingLearnedWeights && (
                      <span className="text-xs bg-green-100 text-green-700 px-1 rounded">
                        learned
                      </span>
                    )}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${openDropdown === "priorities" ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openDropdown === "priorities" && (
                    <div className="absolute top-full right-0 mt-1.5 bg-white border rounded-xl shadow-lg p-4 w-72 z-30">
                      <div className="flex justify-between items-center mb-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Match Priorities
                        </p>
                        <button
                          onClick={() => {
                            setMatchWeights(DEFAULT_WEIGHTS);
                            setUsingLearnedWeights(false);
                          }}
                          className="text-xs text-gray-400 hover:text-[#ff6b6b] transition-colors"
                        >
                          Reset
                        </button>
                      </div>

                      {CRITERIA_INFO.map((c) => (
                        <div key={c.key} className="mb-3">
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
                              setMatchWeights((prev) => ({
                                ...prev,
                                [c.key]: Number(e.target.value),
                              }));
                              setUsingLearnedWeights(false);
                            }}
                            className="w-full cursor-pointer h-1.5 rounded-full"
                            style={{ accentColor: "#ff6b6b" }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Clear all */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="h-9 px-3 text-sm text-gray-400 hover:text-[#ff6b6b] transition-colors underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Active filter chips */}
              {hasActiveFilters && (
                <div className="flex gap-2 flex-wrap mt-2.5">
                  {filters.location && (
                    <Chip
                      label={`📍 ${filters.location}`}
                      onRemove={() =>
                        setFilters((f) => ({ ...f, location: "" }))
                      }
                    />
                  )}
                  {(filters.minRate || filters.maxRate) && (
                    <Chip
                      label={`💰 $${filters.minRate || "0"}–$${filters.maxRate || "∞"}/hr`}
                      onRemove={() =>
                        setFilters((f) => ({
                          ...f,
                          minRate: "",
                          maxRate: "",
                        }))
                      }
                    />
                  )}
                  {filters.experience > 0 && (
                    <Chip
                      label={`🎓 ${filters.experience}+ yrs`}
                      onRemove={() =>
                        setFilters((f) => ({ ...f, experience: 0 }))
                      }
                    />
                  )}
                  {filters.languages.map((l) => (
                    <Chip
                      key={l}
                      label={`🗣️ ${l}`}
                      onRemove={() => handleLanguageChange(l)}
                    />
                  ))}
                  {filters.specialNeeds.map((n) => (
                    <Chip
                      key={n}
                      label={`🌟 ${n}`}
                      onRemove={() => handleSpecialNeedsChange(n)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Sitter list ───────────────────────────────────────────── */}
          <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-4">
            <p className="text-sm font-semibold bg-red-50 text-red-700 px-4 py-2 rounded-lg w-fit">
              {filteredSitters.length}{" "}
              {filteredSitters.length === 1 ? "sitter" : "sitters"} found
            </p>

            {filteredSitters.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                <p className="text-gray-500 text-lg">
                  No sitters match your filters
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Try adjusting your search criteria
                </p>
              </div>
            ) : (
              <>
                {currentSitters.map((sitter) => (
                  <SitterCard
                    key={sitter.id}
                    sitter={sitter}
                    matchData={matchDataMap?.[sitter.id] ?? null}
                  />
                ))}

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4 mb-2">
                    <Button
                      onClick={() =>
                        currentPage > 1 && goToPage(currentPage - 1)
                      }
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
                              variant={
                                currentPage === p ? "default" : "outline"
                              }
                              className={`h-10 w-10 ${currentPage === p ? "bg-[#ff6b6b] hover:bg-[#ff5a5f] text-white" : ""}`}
                            >
                              {p}
                            </Button>
                          );
                        } else if (
                          p === currentPage - 2 ||
                          p === currentPage + 2
                        ) {
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
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
