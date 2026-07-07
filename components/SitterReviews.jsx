"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Star } from "lucide-react";

const AVATAR_COLORS = [
  "bg-teal-100 text-teal-700",
  "bg-purple-100 text-purple-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-blue-100 text-blue-700",
];

function avatarColor(initials) {
  const code = (initials.charCodeAt(0) || 0) + (initials.charCodeAt(1) || 0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

function Stars({ value, size = "sm" }) {
  const cls = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${cls} ${
            n <= value ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="flex-1 bg-gray-50 rounded-xl p-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-gray-900">{value}</span>
        <Stars value={Math.round(value)} />
      </div>
    </div>
  );
}

// sitterId: sitter's auth user ID
export default function SitterReviews({ sitterId }) {
  const t = useTranslations("sitterReviews");
  const locale = useLocale();
  const dateLocale = locale === "fr" ? "fr-CA" : "en-US";
  const [data,     setData]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!sitterId) return;
    async function fetch_() {
      try {
        const res = await fetch(`/api/reviews/sitter/${sitterId}`);
        if (res.ok) setData(await res.json());
      } catch {}
      setLoading(false);
    }
    fetch_();
  }, [sitterId]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-7 h-7 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
      </div>
    );
  }

  const {
    reviews = [],
    overall_rating,
    avg_session_rating,
    avg_adventure_rating,
    total_reviews = 0,
  } = data || {};

  // The API returns reviews newest-first; show only the first unless expanded.
  const visibleReviews = expanded ? reviews : reviews.slice(0, 1);
  const hasMore = total_reviews > 1;

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">{t("reviews")}</h2>
        {overall_rating != null && (
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <span className="text-2xl font-bold text-gray-900">{overall_rating}</span>
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span className="text-gray-400">
              {t("reviewsCount", { count: total_reviews })}
            </span>
          </div>
        )}
      </div>

      {/* Metric cards */}
      {(avg_session_rating != null || avg_adventure_rating != null) && (
        <div className="flex gap-3 mb-6">
          {avg_session_rating != null && (
            <MetricCard label={t("sessionQuality")} value={avg_session_rating} />
          )}
          {avg_adventure_rating != null && (
            <MetricCard label={t("adventureQuality")} value={avg_adventure_rating} />
          )}
        </div>
      )}

      {/* Review list */}
      {reviews.length === 0 ? (
        <p className="text-sm text-gray-400">{t("noReviewsYet")}</p>
      ) : (
        <>
          <div className="space-y-5">
            {visibleReviews.map((review, idx) => (
              <div
                key={review.id}
                className={`pb-5 ${
                  idx < visibleReviews.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Initials avatar */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${avatarColor(
                      review.reviewer_initials
                    )}`}
                  >
                    {review.reviewer_initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Name + date */}
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm text-gray-900">
                        {review.reviewer_name}
                      </p>
                      <span className="text-xs text-gray-400 shrink-0 ml-2">
                        {new Date(review.created_at).toLocaleDateString(dateLocale, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Stars */}
                    <Stars value={review.session_rating} />

                    {/* Review text — omitted entirely when absent */}
                    {review.review_text && (
                      <p className="text-sm text-gray-600 leading-relaxed mt-2">
                        {review.review_text}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Expand / collapse toggle */}
          {hasMore && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-4 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
            >
              {expanded ? t("showLess") : t("seeAllReviews", { count: total_reviews })}
            </button>
          )}
        </>
      )}
    </div>
  );
}
