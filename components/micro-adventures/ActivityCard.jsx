"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Bookmark, Baby, Clock, Target } from "lucide-react";
import {
  DifficultyDots,
  getCategory,
  getCategoryLabel,
  getPlaceholderStyle,
  getAgeRangeLabel,
  getDurationLabel,
  getAccessibilityTags,
  getLearningGoals,
  getImageUrl,
} from "./activity-utils";

export function ActivityCard({ activity, isSelected, onToggleSelect, onViewDetails }) {
  const t = useTranslations("activityCard");
  const tUtils = useTranslations("activityUtils");
  const [imgError, setImgError] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const category = getCategory(activity);
  const categoryLabel = getCategoryLabel(category, tUtils);
  const imageUrl = getImageUrl(activity);
  const showImage = imageUrl && !imgError;
  const accessibilityTags = getAccessibilityTags(activity);
  const learningGoals = getLearningGoals(activity);
  const firstGoal = learningGoals[0];

  return (
    <article className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col transition-all hover:-translate-y-0.5 hover:shadow-md">
      {/* Image */}
      <div className="relative h-44 w-full bg-gray-100">
        {showImage ? (
          <img
            src={imageUrl}
            alt={activity.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${getPlaceholderStyle(category)}`}>
            <span className="text-sm font-semibold text-white text-center px-4 drop-shadow-sm">
              {categoryLabel}
            </span>
          </div>
        )}

        <span className="absolute bottom-2 left-2 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#F96167] text-white shadow-sm">
          {categoryLabel}
        </span>

        <button
          type="button"
          onClick={() => setBookmarked((v) => !v)}
          aria-label={bookmarked ? t("removeBookmark") : t("bookmarkActivity")}
          className="absolute top-2 right-2 w-11 h-11 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-[#F96167] text-[#F96167]" : "text-gray-500"}`} />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start gap-2 mb-1.5">
          <h3 className="font-bold text-gray-900 text-base leading-snug flex-1">{activity.name}</h3>
          <DifficultyDots difficulty={activity.difficulty} className="mt-1.5" />
        </div>

        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">{activity.description}</p>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <span className="inline-flex items-center gap-1.5">
            <Baby className="w-3.5 h-3.5 text-gray-400" />
            {getAgeRangeLabel(activity, tUtils)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            {getDurationLabel(activity, tUtils)}
          </span>
        </div>

        {firstGoal && (
          <div className="mb-3 rounded-xl bg-yellow-50 border border-yellow-200 px-3 py-2 flex items-start gap-2">
            <Target className="w-3.5 h-3.5 text-yellow-600 mt-0.5 shrink-0" />
            <p className="text-xs text-yellow-800 leading-snug line-clamp-2">{firstGoal}</p>
          </div>
        )}

        {accessibilityTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {accessibilityTags.map((tag, i) => (
              <span
                key={i}
                className="text-[11px] px-2.5 py-0.5 rounded-full border border-[#028090] text-[#028090] font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={onViewDetails}
            className="flex-1 text-sm font-semibold py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {t("viewDetails")}
          </button>
          <button
            type="button"
            onClick={onToggleSelect}
            className={`flex-1 text-sm font-semibold py-2 rounded-xl text-white transition-colors ${
              isSelected ? "bg-emerald-600 hover:bg-emerald-700" : "bg-[#F96167] hover:bg-[#e14f53]"
            }`}
          >
            {isSelected ? t("added") : t("addToSession")}
          </button>
        </div>
      </div>
    </article>
  );
}
