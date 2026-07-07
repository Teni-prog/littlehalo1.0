"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import {
  getCategory,
  getCategoryLabel,
  getPlaceholderStyle,
  getAgeRangeLabel,
  getDurationLabel,
  getImageUrl,
} from "./activity-utils";

function CarouselCard({ activity, onSelect, tUtils }) {
  const [imgError, setImgError] = useState(false);
  const category = getCategory(activity);
  const categoryLabel = getCategoryLabel(category, tUtils);
  const imageUrl = getImageUrl(activity);
  const showImage = imageUrl && !imgError;

  return (
    <button
      type="button"
      onClick={() => onSelect(activity)}
      className="snap-start shrink-0 w-56 text-left bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative h-32 w-full bg-gray-100">
        {showImage ? (
          <img
            src={imageUrl}
            alt={activity.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${getPlaceholderStyle(category)}`}>
            <span className="text-xs font-semibold text-white text-center px-3 drop-shadow-sm">{categoryLabel}</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <span className="text-[11px] font-semibold text-[#F96167] uppercase tracking-wide">{categoryLabel}</span>
        <p className="font-bold text-gray-900 text-sm mt-1 line-clamp-1">{activity.name}</p>
        <p className="text-xs text-gray-500 mt-1">
          {getAgeRangeLabel(activity, tUtils)} · {getDurationLabel(activity, tUtils)}
        </p>
      </div>
    </button>
  );
}

export function FeaturedCarousel({ activities, onSelect }) {
  const t = useTranslations("featuredCarousel");
  const tUtils = useTranslations("activityUtils");

  if (!activities || activities.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-[#F96167]" />
        <h2 className="text-lg font-bold text-gray-900">{t("heading")}</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory">
        {activities.map((activity) => (
          <CarouselCard key={activity.id} activity={activity} onSelect={onSelect} tUtils={tUtils} />
        ))}
      </div>
    </div>
  );
}
