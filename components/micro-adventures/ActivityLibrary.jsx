"use client";

import { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { Search, CheckCircle2, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { ActivityCard } from "./ActivityCard";
import { FeaturedCarousel } from "./FeaturedCarousel";
import { ActivityModal } from "./ActivityModal";
import { getCategory, getCategoryLabel, getDifficultyLabel, getAccessibilityTags, CATEGORY_OPTIONS } from "./activity-utils";
import { createClient } from "@/lib/supabase/client";

// ─── Filter options ───────────────────────────────────────────────────────────
// Canonical values/bounds used for matching stay fixed here; the *labels*
// shown to the user are resolved via translations inside the component below.

const AGE_RANGE_DEFS = [
  { key: "under3", value: "0-3", min: 0, max: 3 },
  { key: "threeToSix", value: "3-6", min: 3, max: 6 },
  { key: "sixToNine", value: "6-9", min: 6, max: 9 },
  { key: "ninePlus", value: "9+", min: 9, max: Infinity },
];

const DURATION_DEFS = [
  { key: "under15", value: "under15", test: (d) => d < 15 },
  { key: "fifteenToThirty", value: "15-30", test: (d) => d >= 15 && d <= 30 },
  { key: "thirtyPlus", value: "30plus", test: (d) => d > 30 },
];

const DIFFICULTY_DEFS = [
  { value: "Easy" },
  { value: "Medium" },
  { value: "Hard" },
];

// These canonical strings are also compared directly against each activity's
// accessibility tags coming from the database, so they must stay untranslated.
const SPECIAL_NEEDS_DEFS = [
  { key: "autismFriendly", value: "Autism-Friendly" },
  { key: "sensorySafe", value: "Sensory-Safe" },
  { key: "adhdSuitable", value: "ADHD-Suitable" },
  { key: "nonVerbalOk", value: "Non-Verbal OK" },
  { key: "lowStimulation", value: "Low-Stimulation" },
];

function toggleInArray(arr, value) {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

function FilterGroup({ title, options, selected, onToggle }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">{title}</p>
      <div className="space-y-2.5">
        {options.map((opt) => {
          const value = typeof opt === "string" ? opt : opt.value;
          const label = typeof opt === "string" ? opt : opt.label;
          return (
            <label key={value} className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.includes(value)}
                onChange={() => onToggle(value)}
                className="w-4 h-4 rounded border-gray-300 accent-[#F96167]"
              />
              {label}
            </label>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ActivityLibrary({ bookingSitterId = "" }) {
  const t = useTranslations("activityLibrary");
  const tUtils = useTranslations("activityUtils");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [authToast, setAuthToast] = useState(false);

  // Data
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAgeRanges, setSelectedAgeRanges] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);
  const [selectedNeeds, setSelectedNeeds] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Activities");

  // Modal
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Pagination
  const [visibleCount, setVisibleCount] = useState(12);

  // Translated option labels (matching values/bounds are defined above and untouched)
  const ageRangeOptions = useMemo(
    () =>
      AGE_RANGE_DEFS.map((o) => ({
        value: o.value,
        min: o.min,
        max: o.max,
        label: t(`filters.ageRange.options.${o.key}`),
      })),
    [t]
  );

  const durationOptions = useMemo(
    () =>
      DURATION_DEFS.map((o) => ({
        value: o.value,
        test: o.test,
        label: t(`filters.duration.options.${o.key}`),
      })),
    [t]
  );

  const difficultyOptions = useMemo(
    () =>
      DIFFICULTY_DEFS.map((o) => ({
        value: o.value,
        label: getDifficultyLabel(o.value, tUtils),
      })),
    [tUtils]
  );

  const specialNeedsOptions = useMemo(
    () =>
      SPECIAL_NEEDS_DEFS.map((o) => ({
        value: o.value,
        label: t(`filters.specialNeeds.options.${o.key}`),
      })),
    [t]
  );

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
  const baseFiltered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return activities.filter((a) => {
      // Age range checkbox matching (any selected bucket overlapping the activity's range)
      if (selectedAgeRanges.length > 0) {
        const min = a.age_min ?? 0;
        const max = a.age_max ?? min;
        const matchesAnyRange = selectedAgeRanges.some((v) => {
          const range = AGE_RANGE_DEFS.find((o) => o.value === v);
          return range && !(max < range.min || min > range.max);
        });
        if (!matchesAnyRange) return false;
      }

      // Duration checkbox matching
      if (selectedDurations.length > 0) {
        const d = a.duration_minutes ?? 0;
        const matchesAnyDuration = selectedDurations.some((v) =>
          DURATION_DEFS.find((o) => o.value === v)?.test(d)
        );
        if (!matchesAnyDuration) return false;
      }

      // Difficulty checkbox matching
      if (selectedDifficulties.length > 0 && !selectedDifficulties.includes(a.difficulty)) return false;

      // Special needs array matching tags configuration logic
      if (selectedNeeds.length > 0) {
        const tags = getAccessibilityTags(a);
        if (!selectedNeeds.every((t) => tags.includes(t))) return false;
      }

      // Text matching parsing
      if (q) {
        const category = getCategory(a).toLowerCase();
        if (
          !a.name.toLowerCase().includes(q) &&
          !(a.description ?? "").toLowerCase().includes(q) &&
          !category.includes(q)
        ) return false;
      }
      return true;
    });
  }, [activities, selectedAgeRanges, selectedDurations, selectedDifficulties, selectedNeeds, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    CATEGORY_OPTIONS.forEach((cat) => {
      counts[cat] =
        cat === "All Activities"
          ? baseFiltered.length
          : baseFiltered.filter((a) => getCategory(a).toLowerCase() === cat.toLowerCase()).length;
    });
    return counts;
  }, [baseFiltered]);

  const sorted = useMemo(() => {
    const filtered =
      selectedCategory === "All Activities"
        ? baseFiltered
        : baseFiltered.filter((a) => getCategory(a).toLowerCase() === selectedCategory.toLowerCase());

    // Sort order logic: Featured elements first, then alphabetical sorting bounds
    return [...filtered].sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [baseFiltered, selectedCategory]);

  const featuredActivities = useMemo(() => activities.filter((a) => a.is_featured), [activities]);

  // Reset to the first page whenever the filtered/searched set changes
  useEffect(() => {
    setVisibleCount(12);
  }, [searchQuery, selectedAgeRanges, selectedDurations, selectedDifficulties, selectedNeeds, selectedCategory]);

  const visibleActivities = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedAgeRanges([]);
    setSelectedDurations([]);
    setSelectedDifficulties([]);
    setSelectedNeeds([]);
    setSelectedCategory("All Activities");
  };

  const toggleAgeRange = (v) => setSelectedAgeRanges((prev) => toggleInArray(prev, v));
  const toggleDuration = (v) => setSelectedDurations((prev) => toggleInArray(prev, v));
  const toggleDifficulty = (v) => setSelectedDifficulties((prev) => toggleInArray(prev, v));
  const toggleNeed = (v) => setSelectedNeeds((prev) => toggleInArray(prev, v));

  const toggleBookingSelection = async (id) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setAuthToast(true);
      setTimeout(() => setAuthToast(false), 4000);
      setTimeout(() => router.push("/login"), 1500);
      return;
    }
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedAgeRanges.length > 0 ||
    selectedDurations.length > 0 ||
    selectedDifficulties.length > 0 ||
    selectedNeeds.length > 0 ||
    selectedCategory !== "All Activities";

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <section id="activities" className="bg-gradient-to-b from-[#F5F4F0] to-white py-14 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-[#F96167] mb-4 uppercase">
            <span>✦</span> {t("header.eyebrow")}
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            {t("header.title")}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed">
            {t("header.description")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 shadow-sm">
              {t("header.badges.activityCount", { count: loading ? "…" : activities.length })}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 shadow-sm">
              {t("header.badges.specialNeedsReviewed")}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 shadow-sm">
              {t("header.badges.sitterTested")}
            </span>
          </div>
        </div>

        {/* Featured carousel */}
        <FeaturedCarousel activities={featuredActivities} onSelect={setSelectedActivity} />

        {/* Search + filters toggle */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder={t("search.placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F96167]/20"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className={`inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border text-sm font-semibold transition-colors ${
              showFilters
                ? "bg-[#F96167] text-white border-[#F96167]"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {t("search.filtersButton")}
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Collapsible filter panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FilterGroup
              title={t("filters.ageRange.label")}
              options={ageRangeOptions}
              selected={selectedAgeRanges}
              onToggle={toggleAgeRange}
            />
            <FilterGroup
              title={t("filters.duration.label")}
              options={durationOptions}
              selected={selectedDurations}
              onToggle={toggleDuration}
            />
            <FilterGroup
              title={t("filters.difficulty.label")}
              options={difficultyOptions}
              selected={selectedDifficulties}
              onToggle={toggleDifficulty}
            />
            <FilterGroup
              title={t("filters.specialNeeds.label")}
              options={specialNeedsOptions}
              selected={selectedNeeds}
              onToggle={toggleNeed}
            />
          </div>
        )}

        {hasActiveFilters && (
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-[#028090] hover:underline"
            >
              {t("filters.resetAll")}
            </button>
          </div>
        )}

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORY_OPTIONS.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-sm font-semibold px-4 py-2 rounded-full border transition-colors ${
                  active
                    ? "bg-[#F96167] text-white border-[#F96167]"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                }`}
              >
                {getCategoryLabel(cat, tUtils)}{" "}
                <span className={active ? "text-white/80" : "text-gray-400"}>
                  {t("categoryCount", { count: categoryCounts[cat] ?? 0 })}
                </span>
              </button>
            );
          })}
        </div>

        {/* Booking mode action bar */}
        {bookingEnabled && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 mb-8 rounded-2xl bg-[#028090]/5 border border-[#028090]/20">
            <p className="text-sm text-[#028090] font-medium">
              ✨{" "}
              {t.rich("booking.activeMessage", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
            <Link
              href={bookingReturnHref}
              className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                selectedIds.length > 0
                  ? "bg-[#028090] text-white hover:bg-[#026e78] shadow-sm"
                  : "bg-gray-100 text-gray-400 pointer-events-none"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {t("booking.confirmButton", { count: selectedIds.length })}
            </Link>
          </div>
        )}

        {/* Main content grid */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-9 h-9 border-4 border-gray-200 border-t-[#F96167] rounded-full animate-spin" />
          </div>
        ) : fetchError ? (
          <div className="text-center py-16 rounded-2xl bg-white border border-gray-200 max-w-md mx-auto shadow-sm">
            <p className="text-rose-600 font-medium mb-1">{t("states.networkError")}</p>
            <p className="text-gray-500 text-sm">{fetchError}</p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-white border border-gray-200 max-w-md mx-auto shadow-sm">
            <p className="text-gray-700 font-medium mb-2">{t("states.noMatches")}</p>
            <p className="text-gray-400 text-xs mb-4">{t("states.noMatchesHint")}</p>
            <button
              type="button"
              onClick={clearFilters}
              className="text-[#028090] text-sm font-semibold hover:underline"
            >
              {t("states.clearFilters")}
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  isSelected={selectedSet.has(activity.id)}
                  onToggleSelect={() => toggleBookingSelection(activity.id)}
                  onViewDetails={() => setSelectedActivity(activity)}
                />
              ))}
            </div>

            <div className="flex flex-col items-center gap-4 mt-10">
              <p className="text-sm text-gray-500">
                {t("pagination.showing", { count: visibleActivities.length, total: sorted.length })}
              </p>
              {hasMore && (
                <button
                  type="button"
                  onClick={() => setVisibleCount((v) => Math.min(v + 12, sorted.length))}
                  className="px-6 py-2.5 rounded-xl border-2 border-[#F96167] text-[#F96167] text-sm font-semibold transition-colors hover:bg-[#F96167] hover:text-white"
                >
                  {t("pagination.loadMore")}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <ActivityModal
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
        isSelected={selectedActivity ? selectedSet.has(selectedActivity.id) : false}
        onToggleSelect={() => selectedActivity && toggleBookingSelection(selectedActivity.id)}
      />

      {authToast && (
        <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold text-white bg-[#F96167]">
          {t("auth.loginRequired")}
        </div>
      )}
    </section>
  );
}
