"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Star, Clock, Check } from "lucide-react";

const REBOOK_OPTIONS = [
  { value: "yes",   labelKey: "yes" },
  { value: "maybe", labelKey: "maybe" },
  { value: "no",    labelKey: "no" },
];

function StarInput({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="cursor-pointer"
        >
          <Star
            className={`w-6 h-6 transition-colors ${
              n <= (hovered || value)
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// booking: { id, date, hours }
// sitterName: string
// onSubmitted?: () => void
export default function ParentReviewForm({ booking, sitterName, onSubmitted }) {
  const t = useTranslations("parentReviewForm");
  const [sessionRating,   setSessionRating]   = useState(0);
  const [adventureRating, setAdventureRating] = useState(0);
  const [reviewText,      setReviewText]      = useState("");
  const [rebookChoice,    setRebookChoice]    = useState(null); // "yes" | "maybe" | "no" | null
  const [submitting,      setSubmitting]      = useState(false);
  const [error,           setError]           = useState(null);
  const [submitted,       setSubmitted]       = useState(false);

  const initials = sitterName
    ? sitterName.trim().split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  async function handleSubmit() {
    if (!sessionRating) { setError(t("errors.rateRequired")); return; }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id:      booking.id,
          reviewer_role:   "parent",
          session_rating:  sessionRating,
          adventure_rating: adventureRating || null,
          review_text:     reviewText || null,
          would_rebook:
            rebookChoice === "yes"   ? true  :
            rebookChoice === "no"    ? false : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || t("errors.submitFailed")); return; }
      setSubmitted(true);
      onSubmitted?.();
    } catch {
      setError(t("errors.generic"));
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-2 py-3 px-4 bg-teal-50 rounded-xl border border-teal-100">
        <Check className="w-4 h-4 text-teal-500 shrink-0" />
        <span className="text-sm text-teal-700 font-medium">{t("submittedThanks")}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-4">
      {/* Title */}
      <h3 className="text-base font-bold text-gray-900 mb-4">
        {t("titleWithSitter", { sitterName })}
      </h3>

      {/* Sitter info row */}
      <div className="flex items-center justify-between mb-5 pb-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900">{sitterName}</p>
            <p className="text-xs text-gray-400">
              {booking.hours
                ? t("sessionInfoWithHours", { date: booking.date, hours: booking.hours })
                : t("sessionInfo", { date: booking.date })}
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
          {t("completed")}
        </span>
      </div>

      {/* Session quality rating */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">{t("overallQuality")}</p>
        <StarInput value={sessionRating} onChange={setSessionRating} />
      </div>

      {/* Adventure rating */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">{t("adventureExecution")}</p>
        <StarInput value={adventureRating} onChange={setAdventureRating} />
      </div>

      {/* Review text */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">{t("yourReview")}</p>
        <div className="relative">
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder={t("reviewPlaceholder")}
            rows={3}
            maxLength={500}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-500 focus:bg-white resize-none transition-colors"
          />
          {reviewText.length > 0 && (
            <span className="absolute bottom-2.5 right-3 text-xs text-gray-400">
              {reviewText.length}/500
            </span>
          )}
        </div>
      </div>

      {/* Would rebook */}
      <div className="mb-5">
        <p className="text-sm text-gray-600 mb-2">{t("wouldYouRebook", { sitterName })}</p>
        <div className="flex gap-2">
          {REBOOK_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRebookChoice(opt.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer ${
                rebookChoice === opt.value
                  ? "bg-teal-500 text-white border-teal-500"
                  : "border-gray-200 text-gray-600 hover:border-teal-300 hover:text-teal-600"
              }`}
            >
              {t(`rebookOptions.${opt.labelKey}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

      {/* Footer */}
      <div className="flex items-center justify-end">
        <button
          onClick={handleSubmit}
          disabled={!sessionRating || submitting}
          className="px-6 py-2.5 bg-teal-500 text-white rounded-xl font-semibold text-sm hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {submitting ? t("submitting") : t("submitReview")}
        </button>
      </div>
    </div>
  );
}
