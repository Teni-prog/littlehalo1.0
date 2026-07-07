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
// familyName: string
// onSubmitted?: () => void
export default function SitterFeedbackForm({ booking, familyName, onSubmitted }) {
  const t = useTranslations("sitterFeedbackForm");
  const [sessionRating, setSessionRating] = useState(0);
  const [feedbackText,  setFeedbackText]  = useState("");
  const [rebookChoice,  setRebookChoice]  = useState(null); // "yes" | "maybe" | "no" | null
  const [submitting,    setSubmitting]    = useState(false);
  const [error,         setError]         = useState(null);
  const [submitted,     setSubmitted]     = useState(false);


  const initials = familyName
    ? familyName.trim().split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase()
    : "FM";
  const firstName = familyName?.trim().split(/\s+/)[0] || familyName;

  async function handleSubmit() {
    if (!sessionRating) { setError(t("errors.ratingRequired")); return; }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id:     booking.id,
          reviewer_role:  "sitter",
          session_rating: sessionRating,
          review_text:    feedbackText || null,
          would_rebook:
            rebookChoice === "yes"  ? true  :
            rebookChoice === "no"   ? false : null,
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
    <div className="space-y-4 pt-1">
      {/* Title */}
      <p className="text-sm font-bold text-gray-800">
        {t("sessionQuestion", { firstName })}
      </p>

      {/* Family info row */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900">{t("familyLabel", { firstName })}</p>
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

      {/* Family rating */}
      <div>
        <p className="text-sm text-gray-600 mb-2">{t("familyRating")}</p>
        <StarInput value={sessionRating} onChange={setSessionRating} />
      </div>

      {/* Feedback text */}
      <div>
        <p className="text-sm text-gray-600 mb-2">{t("yourFeedback")}</p>
        <textarea
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          placeholder={t("feedbackPlaceholder")}
          rows={3}
          maxLength={500}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-500 focus:bg-white resize-none transition-colors"
        />
      </div>

      {/* Would work again */}
      <div>
        <p className="text-sm text-gray-600 mb-2">{t("rebookQuestion")}</p>
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
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Footer */}
      <div className="flex items-center justify-end">
        <button
          onClick={handleSubmit}
          disabled={!sessionRating || submitting}
          className="px-6 py-2.5 bg-teal-500 text-white rounded-xl font-semibold text-sm hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {submitting ? t("submitting") : t("submitFeedback")}
        </button>
      </div>
    </div>
  );
}
