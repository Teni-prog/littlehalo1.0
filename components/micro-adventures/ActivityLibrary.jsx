"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Clock,
  Sparkles,
  CheckCircle2,
  Star,
} from "lucide-react";

// ─── Filter options ───────────────────────────────────────────────────────────

const AGE_GROUPS = [
  { label: "All ages", value: "all" },
  { label: "1–2 yrs", value: "1-2", min: 1, max: 2 },
  { label: "3–4 yrs", value: "3-4", min: 3, max: 4 },
  { label: "5–6 yrs", value: "5-6", min: 5, max: 6 },
  { label: "7–9 yrs", value: "7-9", min: 7, max: 9 },
  { label: "10–12 yrs", value: "10-12", min: 10, max: 12 },
];

const SUBJECTS = [
  "Science",
  "Arts & Crafts",
  "Music",
  "Language",
  "STEM",
  "Cooking",
  "Outdoor",
  "Social Skills",
  "Technology",
  "Sensory",
];

const SPECIAL_NEEDS_OPTIONS = [
  "Autism-friendly",
  "ADHD-friendly",
  "Sensory-friendly",
];

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

// ─── Style maps ───────────────────────────────────────────────────────────────

const DIFFICULTY_STYLES = {
  Easy: { dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  Medium: { dot: "bg-amber-400", badge: "bg-amber-50  text-amber-700  border-amber-200" },
  Hard: { dot: "bg-rose-500", badge: "bg-rose-50   text-rose-700   border-rose-200" },
};

const SUBJECT_COLORS = {
  Science: "bg-blue-50   text-blue-700",
  "Arts & Crafts": "bg-purple-50 text-purple-700",
  Music: "bg-pink-50   text-pink-700",
  Language: "bg-indigo-50 text-indigo-700",
  STEM: "bg-teal-50   text-teal-700",
  Cooking: "bg-orange-50 text-orange-700",
  Outdoor: "bg-green-50  text-green-700",
  "Social Skills": "bg-rose-50   text-rose-700",
  Technology: "bg-cyan-50   text-cyan-700",
  Sensory: "bg-amber-50  text-amber-700",
};

// ─── Card ─────────────────────────────────────────────────────────────────────

function ActivityCard({ activity, isSelected, bookingEnabled, onToggleSelect }) {
  const diff = DIFFICULTY_STYLES[activity.difficulty] ?? DIFFICULTY_STYLES.Easy;
  const subjColor = SUBJECT_COLORS[activity.subject] ?? "bg-gray-100 text-gray-700";

  // Safe validation fallback structures for Postgres text arrays
  const tags = Array.isArray(activity.special_needs_tags)
    ? activity.special_needs_tags
    : [];
  const materials = Array.isArray(activity.materials) ? activity.materials : [];

  return (
    <article className={`bg-white rounded-2xl border shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col overflow-hidden ${activity.is_featured ? "border-amber-200 ring-1 ring-amber-400/20" : "border-gray-200"
      }`}>
      <div className="p-5 sm:p-6 flex-1 flex flex-col">

        {/* Featured badge */}
        {activity.is_featured && (
          <span className="self-start inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5 mb-3">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            Featured
          </span>
        )}

        {/* Name */}
        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-3">
          {activity.name}
        </h3>

        {/* Pills row */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#FAECE7] text-[#993C1D] font-medium">
            Ages {activity.age_min}–{activity.age_max}
          </span>

          {activity.subject && (
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${subjColor}`}>
              {activity.subject}
            </span>
          )}

          {activity.difficulty && (
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium border flex items-center gap-1.5 ${diff.badge}`}>
              <span className={`w-2 h-2 rounded-full shrink-0 ${diff.dot}`} />
              {activity.difficulty}
            </span>
          )}
        </div>

        {/* Duration */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>{activity.duration_minutes} min</span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1 line-clamp-3">
          {activity.description}
        </p>

        {/* Materials */}
        {materials.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-700 mb-1.5">Materials</p>
            <div className="flex flex-wrap gap-1.5">
              {materials.slice(0, 4).map((m, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md border border-gray-200/40"
                >
                  {m}
                </span>
              ))}
              {materials.length > 4 && (
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md">
                  +{materials.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Special needs tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-gray-50">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="text-[11px] px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Booking select button */}
      {bookingEnabled && (
        <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-gray-100 bg-gray-50/50">
          <button
            type="button"
            onClick={onToggleSelect}
            className={`w-full text-sm font-semibold py-2 rounded-lg transition-colors ${isSelected
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-teal-50 text-teal-700 hover:bg-teal-100"
              }`}
          >
            {isSelected ? "✓ Selected" : "Select for Booking"}
          </button>
        </div>
      )}
    </article>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ActivityLibrary({ bookingSitterId = "" }) {
  const searchParams = useSearchParams();

  // Data
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedNeeds, setSelectedNeeds] = useState([]);

  // Booking selection
  const sitterIdFromUrl = searchParams.get("sitterId") || "";
  const preselectedIds = useMemo(() => {
    const raw = searchParams.get("selectedAdventures") || "";
    if (!raw) return [];
    return [...new Set(raw.split(",").map((id) => id.trim()).filter(Boolean))];
  }, [searchParams]);

  const effectiveSitterId = bookingSitterId || sitterIdFromUrl;
  const bookingEnabled = Boolean(effectiveSitterId);
  const [selectedIds, setSelectedIds] = useState(preselectedIds);
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const bookingReturnHref = `/booking?sitterId=${encodeURIComponent(effectiveSitterId)}&selectedAdventures=${encodeURIComponent(selectedIds.join(","))}`;

  // ─── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/micro-adventures");
        if (!res.ok) throw new Error("Failed to load activities from API endpoint");
        const json = await res.json();

        // Defensive fix: handle both nested { activities: [...] } and raw array returns gracefully
        if (Array.isArray(json)) {
          setActivities(json);
        } else if (json && Array.isArray(json.activities)) {
          setActivities(json.activities);
        } else {
          setActivities([]);
        }
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ─── Filter + sort ──────────────────────────────────────────────────────────
  const sorted = useMemo(() => {
    const ageGroup = AGE_GROUPS.find((g) => g.value === selectedAgeGroup);
    const q = searchQuery.trim().toLowerCase();

    const filtered = activities.filter((a) => {
      // Age group intersection matching logic
      if (ageGroup && ageGroup.value !== "all") {
        if (a.age_max < ageGroup.min || a.age_min > ageGroup.max) return false;
      }
      // Subject
      if (selectedSubject !== "all" && a.subject !== selectedSubject) return false;
      // Difficulty
      if (selectedDifficulty !== "all" && a.difficulty !== selectedDifficulty) return false;
      // Special needs array matching tags configuration logic
      if (selectedNeeds.length > 0) {
        const tags = Array.isArray(a.special_needs_tags) ? a.special_needs_tags : [];
        if (!selectedNeeds.every((t) => tags.includes(t))) return false;
      }
      // Text matching parsing
      if (q) {
        if (
          !a.name.toLowerCase().includes(q) &&
          !(a.description ?? "").toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });

    // Sort order logic: Featured elements first, then alphabetical sorting bounds
    return [...filtered].sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [activities, selectedAgeGroup, selectedSubject, selectedDifficulty, selectedNeeds, searchQuery]);

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedAgeGroup("all");
    setSelectedSubject("all");
    setSelectedDifficulty("all");
    setSelectedNeeds([]);
  };

  const toggleNeed = (tag) =>
    setSelectedNeeds((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const toggleBookingSelection = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const selectStyle =
    "w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.65em_auto] bg-[right_1rem_center] bg-no-repeat";

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <section id="activities" className="py-12 sm:py-16 bg-gray-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 text-teal-600 font-semibold text-xs px-3 py-1.5 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Micro-Adventures Platform
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Find the Perfect Activity
          </h2>
          <p className="text-base text-gray-600">
            Filter by age, subject, and learning style to match the right adventure to your child.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xl mx-auto mb-8">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or description…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-sm"
          />
        </div>

        {/* Filters panel */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 sm:p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
            {/* Age group */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Age Group</label>
              <select
                value={selectedAgeGroup}
                onChange={(e) => setSelectedAgeGroup(e.target.value)}
                className={selectStyle}
              >
                {AGE_GROUPS.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className={selectStyle}
              >
                <option value="all">All subjects</option>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className={selectStyle}
              >
                <option value="all">All difficulties</option>
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Special needs pill toggles */}
          <div className="pt-2">
            <p className="text-xs font-semibold text-gray-600 mb-2.5 uppercase tracking-wider">Special Needs Support</p>
            <div className="flex flex-wrap gap-2">
              {SPECIAL_NEEDS_OPTIONS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleNeed(tag)}
                  className={`text-xs px-3.5 py-1.5 rounded-full border font-medium transition-all ${selectedNeeds.includes(tag)
                    ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-teal-400 hover:bg-teal-50/20"
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Booking mode action bar slider */}
          {bookingEnabled && (
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-5 border-t border-gray-150">
              <p className="text-sm text-teal-700 font-medium bg-teal-50/60 px-3 py-2 rounded-lg border border-teal-100/40">
                ✨ <strong>Booking Mode Active:</strong> Select activities below to add them to your reservation.
              </p>
              <Link
                href={bookingReturnHref}
                className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${selectedIds.length > 0
                  ? "bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-600/10"
                  : "bg-gray-100 text-gray-400 pointer-events-none"
                  }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirm {selectedIds.length} Adventures
              </Link>
            </div>
          )}
        </div>

        {/* Filter results information metrics banner */}
        <div className="flex items-center justify-between mb-6 px-1">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <strong className="text-gray-900 font-bold">{loading ? "…" : sorted.length}</strong>{" "}
            {sorted.length === 1 ? "activity" : "activities"} total
          </p>
          {(searchQuery || selectedAgeGroup !== "all" || selectedSubject !== "all" || selectedDifficulty !== "all" || selectedNeeds.length > 0) && (
            <button
              onClick={clearFilters}
              className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Main Content Arena Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-9 h-9 border-4 border-gray-200 border-t-teal-600 rounded-full animate-spin" />
          </div>
        ) : fetchError ? (
          <div className="text-center py-16 rounded-2xl bg-white border border-gray-200 max-w-md mx-auto shadow-sm">
            <p className="text-rose-600 font-medium mb-1">Network Error</p>
            <p className="text-gray-500 text-sm">{fetchError}</p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-white border border-gray-250 max-w-md mx-auto shadow-sm">
            <p className="text-gray-700 font-medium mb-2">No adventures match your criteria.</p>
            <p className="text-gray-400 text-xs mb-4">Try widening your filters or search constraints.</p>
            <button
              onClick={clearFilters}
              className="text-teal-600 text-sm font-semibold hover:text-teal-700 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                isSelected={selectedSet.has(activity.id)}
                bookingEnabled={bookingEnabled}
                onToggleSelect={() => toggleBookingSelection(activity.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}