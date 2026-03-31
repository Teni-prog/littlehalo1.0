"use client";

import { SitterCard } from "@/components/sitter-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

const LS_WEIGHTS_KEY = "lh_learned_weights";
const DEFAULT_WEIGHTS = { language: 35, price: 35, rating: 20, experience: 10 };

const CRITERIA_INFO = [
  { key: "language", label: "Language Match", icon: "🗣️" },
  { key: "price", label: "Price", icon: "💰" },
  { key: "rating", label: "Rating", icon: "⭐" },
  { key: "experience", label: "Experience", icon: "🎓" },
];

// Compute per-sitter match bars relative to the current visible set.
// preferredLanguage is optional — when absent, language criterion shows as "Not set"
// and is excluded from the overall score so it doesn't drag other scores down.
function computeMatchData(sitter, preferredLanguage, weights, allSitters) {
  const total = Object.values(weights).reduce((s, v) => s + v, 0) || 1;
  const normW = Object.fromEntries(
    Object.entries(weights).map(([k, v]) => [k, v / total]),
  );

  const prices = allSitters.map((s) => s.hourly_rate ?? s.price ?? 20);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // null barValue = criterion not applicable (excluded from score)
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

  // Exclude unset criteria from score so other bars aren't penalised
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

  // Load learned weights from localStorage once on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_WEIGHTS_KEY);
      if (saved) {
        setMatchWeights(JSON.parse(saved));
        setUsingLearnedWeights(true);
      }
    } catch {}
  }, []);

  // Fetch sitters on component mount
  useEffect(() => {
    async function fetchSitters() {
      try {
        const response = await fetch("/api/sitters");
        const result = await response.json();

        if (!response.ok) {
          console.error("Error fetching sitters:", result.error);
          return;
        }

        const formatted = result.data || [];
        setSitters(formatted);
        setFilteredSitters(formatted);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sitters:", error);
      }
    }

    fetchSitters();
  }, []);

  // Apply filters whenever filter state changes
  useEffect(() => {
    applyFilters();
    setCurrentPage(1); // Reset to page 1 when filters change
  }, [filters, sitters]);

  const applyFilters = () => {
    let filtered = [...sitters];

    // Filter by location (case-insensitive partial match)
    if (filters.location.trim()) {
      filtered = filtered.filter((sitter) =>
        sitter.location?.toLowerCase().includes(filters.location.toLowerCase()),
      );
    }

    // Filter by hourly rate range
    if (filters.minRate) {
      filtered = filtered.filter(
        (sitter) => sitter.hourly_rate >= parseInt(filters.minRate),
      );
    }
    if (filters.maxRate) {
      filtered = filtered.filter(
        (sitter) => sitter.hourly_rate <= parseInt(filters.maxRate),
      );
    }

    // Filter by experience (minimum years)
    if (filters.experience > 0) {
      filtered = filtered.filter(
        (sitter) => (sitter.experience || 0) >= filters.experience,
      );
    }

    // Filter by languages (sitter must have at least one selected language)
    if (filters.languages.length > 0) {
      filtered = filtered.filter((sitter) =>
        sitter.languages?.some((lang) => filters.languages.includes(lang)),
      );
    }

    // Filter by special needs (sitter must have at least one selected special need)
    if (filters.specialNeeds.length > 0) {
      filtered = filtered.filter((sitter) =>
        sitter.special_needs?.some((need) =>
          filters.specialNeeds.includes(need),
        ),
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
  // if (loading || !sitters) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
  //       <div className="text-gray-500">Loading...</div>
  //     </div>
  //   );
  // }
  const clearFilters = () => {
    setFilters({
      location: "",
      minRate: "",
      maxRate: "",
      experience: 0,
      languages: [],
      specialNeeds: [],
    });
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredSitters.length / itemsPerPage);
  const indexOfLastSitter = currentPage * itemsPerPage;
  const indexOfFirstSitter = indexOfLastSitter - itemsPerPage;
  const currentSitters = filteredSitters.slice(
    indexOfFirstSitter,
    indexOfLastSitter,
  );

  // Always compute match scores — language criterion gracefully shows "Not set"
  // when preferredLanguage is empty and is excluded from the overall score.
  const matchDataMap = useMemo(() => {
    const map = {};
    currentSitters.forEach((s) => {
      map[s.id] = computeMatchData(
        s,
        preferredLanguage,
        matchWeights,
        currentSitters,
      );
    });
    const ranked = [...currentSitters].sort(
      (a, b) => (map[b.id]?.score ?? 0) - (map[a.id]?.score ?? 0),
    );
    ranked.forEach((s, i) => {
      if (map[s.id]) map[s.id].rank = i + 1;
    });
    return map;
  }, [currentSitters, preferredLanguage, matchWeights]);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
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
        <div className=" container py-8 min-h-screen bg-gray-100 px-4 ">
          <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center items-end md:items-center">
            <div>
              <Link href="">
                <h1 className="text-3xl font-bold font-outfit mb-2 justify-center cursor-pointer">
                  Find a Sitter
                </h1>{" "}
              </Link>
              <p className="text-muted-foreground justify-center">
                Connect with trusted local babysitters.
              </p>
            </div>
          </div>
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 md:gap-6 px-0 md:px-4">
            <div className=" w-full md:w-72 shrink-0 bg-white rounded-xl p-4 md:p-6 shadow-sm h-fit">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                <SlidersHorizontal className="h-5 w-5 text-[#ff6b6b]" />
                <h2 className="text-lg font-semibold">Filters</h2>
              </div>
              <div className="space-y-4">
                {/* ── Match priorities ───────────────────────────────── */}
                <div className="bg-[#ff6b6b]/5 border border-[#ff6b6b]/20 rounded-lg p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">
                      Match Priorities
                    </span>
                    <div className="flex items-center gap-2">
                      {usingLearnedWeights && (
                        <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                          🧠 learned
                        </span>
                      )}
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
                  </div>

                  {/* Weight sliders */}
                  {CRITERIA_INFO.map((c) => (
                    <div key={c.key}>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs text-gray-600">
                          {c.icon} {c.label}
                        </label>
                        <span className="text-xs font-bold text-gray-700">
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

                  {/* Preferred language (optional — improves language bar) */}
                  {/* <div>
                    <label className="text-xs text-gray-600 mb-1 block">
                      🗣️ Your preferred language
                      <span className="text-gray-400 ml-1">(optional)</span>
                    </label>
                    <select
                      value={preferredLanguage}
                      onChange={(e) => setPreferredLanguage(e.target.value)}
                      className="w-full h-8 px-2 text-xs border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]"
                    >
                      <option value="">Any language</option>
                      <option>English</option>
                      <option>French</option>
                      <option>Spanish</option>
                      <option>Mandarin</option>
                      <option>Arabic</option>
                    </select>
                  </div> */}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Location
                  </label>
                  <Input
                    placeholder="Fredericton, NB"
                    className="h-10"
                    value={filters.location}
                    onChange={(e) =>
                      setFilters({ ...filters, location: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Hourly Rate
                  </label>
                  <Input
                    placeholder="Min"
                    className="h-10 mb-2"
                    type="number"
                    value={filters.minRate}
                    onChange={(e) =>
                      setFilters({ ...filters, minRate: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Max"
                    className="h-10"
                    type="number"
                    value={filters.maxRate}
                    onChange={(e) =>
                      setFilters({ ...filters, maxRate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Experience (years)
                  </label>
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
                    className="w-full h-2 rounded-lg cursor-pointer"
                    style={{ accentColor: "#ff6b6b" }}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0</span>
                    <span className="text-[#ff6b6b] font-semibold">
                      {filters.experience}+ years
                    </span>
                    <span>10+</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Languages
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-[#ff6b6b] focus:ring-[#ff6b6b]"
                        checked={filters.languages.includes("English")}
                        onChange={() => handleLanguageChange("English")}
                      />
                      <span className="text-gray-700">English</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-[#ff6b6b] focus:ring-[#ff6b6b]"
                        checked={filters.languages.includes("Spanish")}
                        onChange={() => handleLanguageChange("Spanish")}
                      />
                      <span className="text-gray-700">Spanish</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-[#ff6b6b] focus:ring-[#ff6b6b]"
                        checked={filters.languages.includes("French")}
                        onChange={() => handleLanguageChange("French")}
                      />
                      <span className="text-gray-700">French</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Special Needs Experience
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-[#ff6b6b] focus:ring-[#ff6b6b]"
                        checked={filters.specialNeeds.includes("Autism")}
                        onChange={() => handleSpecialNeedsChange("Autism")}
                      />
                      <span className="text-gray-700">
                        Autism Spectrum Disorder
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-[#ff6b6b] focus:ring-[#ff6b6b]"
                        checked={filters.specialNeeds.includes("Nonverbal")}
                        onChange={() => handleSpecialNeedsChange("Nonverbal")}
                      />
                      <span className="text-gray-700">
                        Nonverbal Communication
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-[#ff6b6b] focus:ring-[#ff6b6b]"
                        checked={filters.specialNeeds.includes("Anxiety")}
                        onChange={() => handleSpecialNeedsChange("Anxiety")}
                      />
                      <span className="text-gray-700">Anxiety</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-[#ff6b6b] focus:ring-[#ff6b6b]"
                        checked={filters.specialNeeds.includes("Asthma")}
                        onChange={() => handleSpecialNeedsChange("Asthma")}
                      />
                      <span className="text-gray-700">Asthma</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-[#ff6b6b] focus:ring-[#ff6b6b]"
                        checked={filters.specialNeeds.includes("Speech Delay")}
                        onChange={() =>
                          handleSpecialNeedsChange("Speech Delay")
                        }
                      />
                      <span className="text-gray-700">Speech Delay</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-[#ff6b6b] focus:ring-[#ff6b6b]"
                        checked={filters.specialNeeds.includes("Down Syndrome")}
                        onChange={() =>
                          handleSpecialNeedsChange("Down Syndrome")
                        }
                      />
                      <span className="text-gray-700">Down Syndrome</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-[#ff6b6b] focus:ring-[#ff6b6b]"
                        checked={filters.specialNeeds.includes("ADHD")}
                        onChange={() => handleSpecialNeedsChange("ADHD")}
                      />
                      <span className="text-gray-700">ADHD</span>
                    </label>
                  </div>
                </div>

                <Button
                  onClick={clearFilters}
                  className="w-full bg-[#ff6b6b] hover:bg-[#ff5a5f] text-white h-11 cursor-pointer"
                >
                  Clear Filters
                </Button>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-3 md:gap-4 w-full">
              <p className="text-sm font-semibold bg-red-50 text-red-700 px-4 py-2 rounded-lg">
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

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-4 mb-2">
                      <Button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        variant="outline"
                        className="h-10 px-3"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      <div className="flex gap-1">
                        {[...Array(totalPages)].map((_, index) => {
                          const pageNumber = index + 1;
                          // Show first page, last page, current page, and pages around current
                          if (
                            pageNumber === 1 ||
                            pageNumber === totalPages ||
                            (pageNumber >= currentPage - 1 &&
                              pageNumber <= currentPage + 1)
                          ) {
                            return (
                              <Button
                                key={pageNumber}
                                onClick={() => goToPage(pageNumber)}
                                variant={
                                  currentPage === pageNumber
                                    ? "default"
                                    : "outline"
                                }
                                className={`h-10 w-10 ${
                                  currentPage === pageNumber
                                    ? "bg-[#ff6b6b] hover:bg-[#ff5a5f] text-white"
                                    : ""
                                }`}
                              >
                                {pageNumber}
                              </Button>
                            );
                          } else if (
                            pageNumber === currentPage - 2 ||
                            pageNumber === currentPage + 2
                          ) {
                            return (
                              <span
                                key={pageNumber}
                                className="px-2 flex items-center"
                              >
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}
                      </div>

                      <Button
                        onClick={goToNextPage}
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
        </div>
      )}
    </>
  );
}
