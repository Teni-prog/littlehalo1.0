"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { X, Target, Check, BookOpen, ArrowRight } from "lucide-react";
import {
  DifficultyDots,
  getCategory,
  getCategoryLabel,
  getPlaceholderStyle,
  getAgeRangeLabel,
  getDurationLabel,
  getAccessibilityTags,
  getLearningGoals,
  getMaterials,
  getSteps,
  getSavedCount,
  getImageUrl,
} from "./activity-utils";

export function ActivityModal({ activity, onClose, isSelected, onToggleSelect }) {
  const t = useTranslations("activityModal");
  const tUtils = useTranslations("activityUtils");
  const [imgError, setImgError] = useState(false);
  const [lastActivityId, setLastActivityId] = useState(activity?.id);

  if (activity?.id !== lastActivityId) {
    setLastActivityId(activity?.id);
    setImgError(false);
  }

  useEffect(() => {
    if (!activity) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [activity, onClose]);

  if (!activity) return null;

  const category = getCategory(activity);
  const categoryLabel = getCategoryLabel(category, tUtils);
  const imageUrl = getImageUrl(activity);
  const showImage = imageUrl && !imgError;
  const learningGoals = getLearningGoals(activity);
  const materials = getMaterials(activity);
  const steps = getSteps(activity);
  const accessibilityTags = getAccessibilityTags(activity);
  const savedCount = getSavedCount(activity);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Image header */}
        <div className="relative h-56 sm:h-64 w-full bg-gray-100">
          {showImage ? (
            <img
              src={imageUrl}
              alt={activity.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${getPlaceholderStyle(category)}`}>
              <span className="text-lg font-semibold text-white drop-shadow-sm">{categoryLabel}</span>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="absolute top-3 right-3 w-11 h-11 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
          >
            <X className="w-4 h-4 text-gray-700" />
          </button>

          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 bg-gradient-to-t from-black/70 to-transparent">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#F96167] text-white">
                {categoryLabel}
              </span>
              <DifficultyDots difficulty={activity.difficulty} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">{activity.name}</h2>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {/* Stat boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">{t("stats.ageRange")}</p>
              <p className="font-bold text-gray-900 text-sm">{getAgeRangeLabel(activity, tUtils)}</p>
            </div>
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">{t("stats.duration")}</p>
              <p className="font-bold text-gray-900 text-sm">{getDurationLabel(activity, tUtils)}</p>
            </div>
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">{t("stats.savedBySitters")}</p>
              <p className="font-bold text-gray-900 text-sm">{savedCount}</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-6">{activity.description}</p>

          {learningGoals.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-[#F96167]" />
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">{t("sections.learningGoals")}</h3>
              </div>
              <ul className="space-y-2">
                {learningGoals.map((goal, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-[#028090] mt-0.5 shrink-0" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {materials.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-[#028090]" />
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">{t("sections.materialsNeeded")}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {materials.map((m, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {steps.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <ArrowRight className="w-4 h-4 text-yellow-500" />
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">{t("sections.stepByStepGuide")}</h3>
              </div>
              <ol className="space-y-3">
                {steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#F96167] text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-700 leading-relaxed pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {accessibilityTags.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-3">{t("sections.accessibility")}</h3>
              <div className="flex flex-wrap gap-2">
                {accessibilityTags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 rounded-full border border-[#028090] text-[#028090] font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-2">
            <button
              type="button"
              className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              {t("actions.saveActivity")}
            </button>
            <button
              type="button"
              onClick={onToggleSelect}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-sm text-white transition-colors ${
                isSelected ? "bg-emerald-600 hover:bg-emerald-700" : "bg-[#F96167] hover:bg-[#e14f53]"
              }`}
            >
              {isSelected ? t("actions.addedToSession") : t("actions.addToSession")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
