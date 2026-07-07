// Shared helpers for the redesigned Micro-Adventures UI.
// These read defensively from whatever shape a micro_adventures row has —
// new columns (image_url, category, learning_goals, steps, accessibility_tags,
// saved_count) fall back to the legacy columns (subject, special_needs_tags,
// instructions) so nothing breaks if the schema hasn't been extended yet.

import { useTranslations } from "next-intl";

export const CATEGORY_OPTIONS = [
  "All Activities",
  "Empathy",
  "Creativity",
  "Problem Solving",
  "Language",
  "Physical",
  "Nature",
  "Social Skills",
];

const CATEGORY_PLACEHOLDER_STYLES = {
  Empathy: "bg-rose-300",
  Creativity: "bg-purple-300",
  "Problem Solving": "bg-blue-300",
  Language: "bg-indigo-300",
  Physical: "bg-orange-300",
  Nature: "bg-green-300",
  "Social Skills": "bg-amber-300",
};

const DEFAULT_PLACEHOLDER_STYLE = "bg-slate-300";

// Canonical (DB-matching) category name -> translation key. Used only to
// resolve a *display* label; the canonical English string above is still
// what's used for filtering/matching against activity.category.
const CATEGORY_TRANSLATION_KEYS = {
  "All Activities": "allActivities",
  Empathy: "empathy",
  Creativity: "creativity",
  "Problem Solving": "problemSolving",
  Language: "language",
  Physical: "physical",
  Nature: "nature",
  "Social Skills": "socialSkills",
  General: "general",
};

export function getCategory(activity) {
  return activity?.category || activity?.subject || "General";
}

// Translated label for a canonical category name. Falls back to the raw
// value (e.g. an arbitrary DB `subject`) when it isn't part of our fixed
// taxonomy, since that's content rather than UI chrome.
export function getCategoryLabel(category, t) {
  const key = CATEGORY_TRANSLATION_KEYS[category];
  return key ? t(`categories.${key}`) : category;
}

export function getPlaceholderStyle(category) {
  return CATEGORY_PLACEHOLDER_STYLES[category] ?? DEFAULT_PLACEHOLDER_STYLE;
}

export const DIFFICULTY_META = {
  Easy: { dots: 1, dotColor: "bg-emerald-500" },
  Medium: { dots: 2, dotColor: "bg-yellow-400" },
  Hard: { dots: 3, dotColor: "bg-red-500" },
};

const DIFFICULTY_TRANSLATION_KEYS = {
  Easy: "easy",
  Medium: "moderate",
  Hard: "advanced",
};

// Translated label for a canonical difficulty value ("Easy" | "Medium" | "Hard").
export function getDifficultyLabel(difficulty, t) {
  const key = DIFFICULTY_TRANSLATION_KEYS[difficulty];
  return key ? t(`difficulty.${key}`) : difficulty;
}

export function DifficultyDots({ difficulty, className = "" }) {
  const t = useTranslations("activityUtils");
  const meta = DIFFICULTY_META[difficulty];
  if (!meta) return null;
  const label = getDifficultyLabel(difficulty, t);
  return (
    <span
      className={`inline-flex items-center gap-1 shrink-0 ${className}`}
      title={label}
      aria-label={label}
    >
      {Array.from({ length: meta.dots }).map((_, i) => (
        <span key={i} className={`w-1.5 h-1.5 rounded-full ${meta.dotColor}`} />
      ))}
    </span>
  );
}

// NOTE: getAgeRangeLabel/getDurationLabel take a `t` (from
// useTranslations("activityUtils")) so the calling component controls the
// translation context while this file stays free of module-scope hook calls.
export function getAgeRangeLabel(activity, t) {
  const min = activity?.age_min;
  const max = activity?.age_max;
  if (min == null && max == null) return t("allAges");
  if (min == null) return t("upToYears", { max });
  if (max == null || max === min) return t("yearsSingle", { age: min });
  return t("yearsRange", { min, max });
}

export function getDurationLabel(activity, t) {
  return activity?.duration_minutes != null
    ? t("durationMinutes", { minutes: activity.duration_minutes })
    : t("durationUnknown");
}

export function getAccessibilityTags(activity) {
  if (Array.isArray(activity?.accessibility_tags) && activity.accessibility_tags.length > 0) {
    return activity.accessibility_tags;
  }
  return Array.isArray(activity?.special_needs_tags) ? activity.special_needs_tags : [];
}

export function getLearningGoals(activity) {
  return Array.isArray(activity?.learning_goals) ? activity.learning_goals : [];
}

export function getMaterials(activity) {
  return Array.isArray(activity?.materials) ? activity.materials : [];
}

export function getSteps(activity) {
  if (Array.isArray(activity?.steps) && activity.steps.length > 0) return activity.steps;
  return activity?.instructions ? [activity.instructions] : [];
}

export function getSavedCount(activity) {
  return typeof activity?.saved_count === "number" ? activity.saved_count : 0;
}

export function getImageUrl(activity) {
  return activity?.image_url || null;
}
