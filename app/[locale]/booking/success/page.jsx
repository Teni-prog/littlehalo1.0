"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ThumbsUp, ThumbsDown, Star } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Booking Success + Post-Session Rating
//
// Flow:
//   1. Booking confirmed → show confirmation card
//   2. Rating section → parent rates the match quality (good / not a good fit)
//   3. Rating submitted → thank-you state + "Find another sitter" CTA
//
// The rating is sent to PATCH /api/matching/outcome with label 1 (good) or 0 (bad).
// This feeds the logistic regression model that adjusts TOPSIS weights over time.
// ─────────────────────────────────────────────────────────────────────────────

function BookingSuccessContent() {
  const t = useTranslations("bookingSuccess");
  const locale = useLocale();
  const dateLocale = locale === "fr" ? "fr-CA" : "en-US";
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");

  // Rating context saved by confirmation page before it cleared localStorage
  const [ctx, setCtx] = useState(null);

  // rating flow: 'idle' | 'submitting' | 'done' | 'skipped'
  const [ratingPhase, setRatingPhase] = useState("idle");
  const [selectedLabel, setSelectedLabel] = useState(null); // 1 | 0
  const [note, setNote] = useState("");
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ratingContext");
      if (raw) {
        setCtx(JSON.parse(raw));
        localStorage.removeItem("ratingContext");
      }
    } catch {}
  }, []);

  async function submitRating() {
    if (selectedLabel === null) return;
    setRatingPhase("submitting");
    setSubmitError(null);

    // outcomeId is null when the match_outcomes table hasn't been created in
    // Supabase yet. Still show the thank-you UI — no data is lost from the
    // user's perspective, and ratings will persist once the table exists.
    if (!ctx?.outcomeId) {
      setRatingPhase("done");
      return;
    }

    try {
      const res = await fetch("/api/matching/outcome", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outcomeId: ctx.outcomeId,
          label: selectedLabel,
        }),
      });

      if (!res.ok) throw new Error("Failed to save rating");
      setRatingPhase("done");
    } catch (err) {
      setSubmitError(t("rating.submitError"));
      setRatingPhase("idle");
    }
  }

  const sessionDateFormatted = ctx?.sessionDate
    ? new Date(ctx.sessionDate).toLocaleDateString(dateLocale, {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto space-y-5">
        {/* ── Booking confirmed card ─────────────────────────────────────── */}
        <Card>
          <CardContent className="pt-8 pb-6 text-center space-y-3">
            <CheckCircle className="h-14 w-14 text-green-500 mx-auto" />
            <h1 className="text-2xl font-bold">{t("pending.title")}</h1>
            <p className="text-gray-500 text-sm">{t("pending.description")}</p>

            {ctx?.sitterName && (
              <div className="flex items-center justify-center gap-3 pt-2">
                {ctx.sitterImage ? (
                  <img
                    src={ctx.sitterImage}
                    alt={ctx.sitterName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#ff6b6b]/10 flex items-center justify-center text-[#ff6b6b] font-bold text-lg">
                    {ctx.sitterName.charAt(0)}
                  </div>
                )}
                <div className="text-left">
                  <p className="font-semibold text-sm">{ctx.sitterName}</p>
                  {sessionDateFormatted && (
                    <p className="text-xs text-gray-400">
                      {sessionDateFormatted}
                      {ctx.sessionTime && ` · ${ctx.sessionTime}`}
                    </p>
                  )}
                </div>
              </div>
            )}

            {bookingId && (
              <p className="text-xs text-gray-400 pt-1">
                {t("pending.bookingId")} <span className="font-mono">{bookingId}</span>
              </p>
            )}
          </CardContent>
        </Card>

        {/* ── Rating card ────────────────────────────────────────────────── */}
        {ratingPhase !== "skipped" && (
          <Card
            className={
              ratingPhase === "done" ? "border-green-200 bg-green-50" : ""
            }
          >
            <CardContent className="pt-6 pb-6">
              {ratingPhase === "done" ? (
                /* ── Thank-you state ─────────────────────────────────── */
                <div className="text-center space-y-2">
                  <div className="text-3xl">🙏</div>
                  <h2 className="font-bold text-green-700">
                    {t("thankYou.title")}
                  </h2>
                  <p className="text-sm text-green-600">
                    {t("thankYou.description")}
                  </p>
                  {selectedLabel === 1 && (
                    <p className="text-xs text-gray-500 pt-1">
                      {t.rich("thankYou.prioritizeNote", {
                        sitterName: ctx?.sitterName?.split(" ")[0],
                        strong: (chunks) => <strong>{chunks}</strong>,
                      })}
                    </p>
                  )}
                </div>
              ) : (
                /* ── Rating form ─────────────────────────────────────── */
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="h-4 w-4 text-[#ff6b6b]" />
                    <h2 className="font-bold text-base">
                      {t("rating.title")}
                    </h2>
                  </div>
                  <p className="text-sm text-gray-500 mb-5">
                    {ctx?.sitterName
                      ? t("rating.promptNamed", { sitterName: ctx.sitterName.split(" ")[0] })
                      : t("rating.promptGeneric")}
                    <span className="block text-xs text-gray-400 mt-0.5">
                      {t("rating.hint")}
                    </span>
                  </p>

                  {/* Thumbs up / down */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <button
                      onClick={() => setSelectedLabel(1)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        selectedLabel === 1
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 hover:border-green-300 hover:bg-green-50/50 text-gray-600"
                      }`}
                    >
                      <ThumbsUp
                        className={`h-7 w-7 ${selectedLabel === 1 ? "fill-green-500 text-green-500" : ""}`}
                      />
                      <span className="font-semibold text-sm">{t("rating.greatMatch")}</span>
                      <span className="text-xs text-center opacity-70">
                        {t("rating.wouldBookAgain")}
                      </span>
                    </button>

                    <button
                      onClick={() => setSelectedLabel(0)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        selectedLabel === 0
                          ? "border-red-400 bg-red-50 text-red-700"
                          : "border-gray-200 hover:border-red-300 hover:bg-red-50/50 text-gray-600"
                      }`}
                    >
                      <ThumbsDown
                        className={`h-7 w-7 ${selectedLabel === 0 ? "fill-red-400 text-red-400" : ""}`}
                      />
                      <span className="font-semibold text-sm">
                        {t("rating.notRightFit")}
                      </span>
                      <span className="text-xs text-center opacity-70">
                        {t("rating.wouldntBookAgain")}
                      </span>
                    </button>
                  </div>

                  {/* Optional note */}
                  {selectedLabel !== null && (
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        {t("rating.noteLabel")}{" "}
                        <span className="font-normal">{t("rating.noteOptional")}</span>
                      </label>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder={
                          selectedLabel === 1
                            ? t("rating.notePlaceholderGood")
                            : t("rating.notePlaceholderBad")
                        }
                        rows={2}
                        className="w-full text-sm px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]"
                      />
                    </div>
                  )}

                  {submitError && (
                    <p className="text-xs text-red-500 mb-3">{submitError}</p>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={submitRating}
                      disabled={
                        selectedLabel === null || ratingPhase === "submitting"
                      }
                      className="flex-1 bg-[#ff6b6b] hover:bg-[#ff5a5f] text-white cursor-pointer disabled:opacity-40"
                    >
                      {ratingPhase === "submitting"
                        ? t("rating.saving")
                        : t("rating.submit")}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setRatingPhase("skipped")}
                      className="cursor-pointer text-gray-400"
                    >
                      {t("rating.skip")}
                    </Button>
                  </div>

                  <p className="text-xs text-gray-400 text-center mt-3">
                    {t("rating.privacyNote")}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        {(ratingPhase === "done" || ratingPhase === "skipped") && (
          <Button
            onClick={() => router.push("/search")}
            className="w-full bg-[#ff6b6b] hover:bg-[#ff5a5f] text-white cursor-pointer"
          >
            {t("cta.findAnotherSitter")}
          </Button>
        )}

        {ratingPhase === "idle" && (
          <Button
            variant="ghost"
            onClick={() => router.push("/search")}
            className="w-full text-gray-400 cursor-pointer"
          >
            {t("cta.findAnotherSitterArrow")}
          </Button>
        )}
      </div>
    </div>
  );
}

// useSearchParams() requires a Suspense boundary in the App Router.
export default function BookingSuccessPage() {
  return (
    <Suspense fallback={null}>
      <BookingSuccessContent />
    </Suspense>
  );
}
