"use client";

import { useState } from "react";
import { Star, Clock, Check } from "lucide-react";

const REBOOK_OPTIONS = [
  { value: "yes",   label: "Yes, definitely" },
  { value: "maybe", label: "Maybe" },
  { value: "no",    label: "No" },
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

// booking: { id, date, hours, deadline }
// familyName: string
// onSubmitted?: () => void
export default function SitterFeedbackForm({ booking, familyName, onSubmitted }) {
  const [sessionRating, setSessionRating] = useState(0);
  const [feedbackText,  setFeedbackText]  = useState("");
  const [rebookChoice,  setRebookChoice]  = useState(null); // "yes" | "maybe" | "no" | null
  const [submitting,    setSubmitting]    = useState(false);
  const [error,         setError]         = useState(null);
  const [submitted,     setSubmitted]     = useState(false);

  const daysLeft = booking.deadline
    ? Math.max(0, Math.ceil((new Date(booking.deadline) - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  const initials = familyName
    ? familyName.trim().split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase()
    : "FM";

  async function handleSubmit() {
    if (!sessionRating) { setError("Please provide a family rating."); return; }
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
      if (!res.ok) { setError(data.error || "Failed to submit feedback."); return; }
      setSubmitted(true);
      onSubmitted?.();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-2 py-3 px-4 bg-teal-50 rounded-xl border border-teal-100">
        <Check className="w-4 h-4 text-teal-500 shrink-0" />
        <span className="text-sm text-teal-700 font-medium">Feedback submitted. Thank you!</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-1">
      {/* Title */}
      <p className="text-sm font-bold text-gray-800">
        How was your session with the {familyName} family?
      </p>

      {/* Family info row */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900">{familyName} family</p>
            <p className="text-xs text-gray-400">
              Session · {booking.date}{booking.hours ? ` · ${booking.hours} hrs` : ""}
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
          Completed
        </span>
      </div>

      {/* Family rating */}
      <div>
        <p className="text-sm text-gray-600 mb-2">Family rating</p>
        <StarInput value={sessionRating} onChange={setSessionRating} />
      </div>

      {/* Feedback text */}
      <div>
        <p className="text-sm text-gray-600 mb-2">Your feedback</p>
        <textarea
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          placeholder="How was communication? Were children ready? Any notes for future sitters?"
          rows={3}
          maxLength={500}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-500 focus:bg-white resize-none transition-colors"
        />
      </div>

      {/* Would work again */}
      <div>
        <p className="text-sm text-gray-600 mb-2">Would you work with this family again?</p>
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
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        {daysLeft != null && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            {daysLeft} {daysLeft === 1 ? "day" : "days"} left to submit
          </div>
        )}
        <button
          onClick={handleSubmit}
          disabled={!sessionRating || submitting}
          className="ml-auto px-6 py-2.5 bg-teal-500 text-white rounded-xl font-semibold text-sm hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {submitting ? "Submitting…" : "Submit feedback"}
        </button>
      </div>
    </div>
  );
}
